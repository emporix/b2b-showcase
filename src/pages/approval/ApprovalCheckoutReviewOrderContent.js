import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './approval.css'
import {
  CartProductPriceExcludeVat,
  CartProductImageAndReadOnlyQuantity,
} from 'components/Cart/cart'
import {
  Container,
  DesktopLGContainer,
  GridLayout,
  LayoutBetween,
  MobileLGContainer,
} from 'components/Utilities/common'
import { TextBold3, TextRegular } from 'components/Utilities/typography'
import { useApprovalAddress } from 'pages/approval/ApprovalAddressProvider'
import Address from 'pages/checkout/Address'
import ShipmentContent from './ApprovalCheckoutShipmentContent'

export const CartProductBasicInfo = ({ item }) => {
  return (
    <div className="cart-product-basic-info">
      <GridLayout className="gap-2">
        <div className="cart-product-name">{item.name}</div>
        <div className="cart-product-sku-wrapper">
          SKU:&nbsp;
          <span className="cart-product-sku">{item.code}</span>
        </div>
      </GridLayout>
    </div>
  )
}

export const CartProductInfo = ({ item }) => {
  return (
    <div className="cart-product-info">
      <GridLayout className="gap-[22px]">
        <CartProductBasicInfo item={item} />
        {item.itemPrice.currency && item.itemPrice.amount && (
          <CartProductPriceExcludeVat
            price={item.itemPrice.amount}
            currency={item.itemPrice.currency}
          />
        )}
      </GridLayout>
    </div>
  )
}

const ApprovalCheckoutReviewOrderContent = () => {
  const { billingAddress, approval } = useApprovalAddress()

  return (
    billingAddress && (
      <>
        <DesktopLGContainer>
          <LayoutBetween className="billing-information">
            <Container className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Billing Information</TextBold3>
              </div>
              <Address data={billingAddress} />
            </Container>
          </LayoutBetween>
        </DesktopLGContainer>

        <MobileLGContainer>
          <GridLayout className="billing-information gap-10">
            <LayoutBetween className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Billing Information</TextBold3>
              </div>
            </LayoutBetween>
            <Address data={billingAddress} />
          </GridLayout>
        </MobileLGContainer>

        <MobileLGContainer>
          <GridLayout className="billing-information gap-10 flex-container">
            <LayoutBetween className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Shipping Information</TextBold3>
              </div>
            </LayoutBetween>
            <ShipmentContent />
          </GridLayout>
        </MobileLGContainer>

        <DesktopLGContainer>
          <LayoutBetween className="billing-information">
            <Container className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Shipping Information</TextBold3>
              </div>
              <ShipmentContent />
            </Container>
          </LayoutBetween>
        </DesktopLGContainer>

        <DesktopLGContainer>
          <LayoutBetween className="billing-information">
            <Container className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Payment Method</TextBold3>
              </div>
              <GridLayout>
                <TextBold3>Invoice</TextBold3>
                <TextRegular>PO Number: 970465640469</TextRegular>
              </GridLayout>
            </Container>
          </LayoutBetween>
        </DesktopLGContainer>

        <MobileLGContainer>
          <GridLayout className="billing-information gap-2">
            <LayoutBetween className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Payment Method</TextBold3>
              </div>
            </LayoutBetween>

            <GridLayout>
              <TextBold3>Invoice</TextBold3>
              <TextRegular>PO Number: 970465640469</TextRegular>
            </GridLayout>
          </GridLayout>
        </MobileLGContainer>

        <DesktopLGContainer>
          <LayoutBetween className="billing-information">
            <Container className="gap-12 flex-container">
              <div className="property-wrapper">
                <TextBold3>Your Products</TextBold3>
              </div>
              <GridLayout className="gap-4">
                {approval.resource.items.map((cartItem, idx) => (
                  <>
                    <div className="cart-product-item p-2">
                      <CartProductImageAndReadOnlyQuantity
                        cartItem={{
                          product: { src: cartItem.media.url },
                          quantity: cartItem.quantity,
                        }}
                      />
                      <CartProductInfo
                        key={cartItem.id + idx}
                        item={cartItem}
                      />
                    </div>
                  </>
                ))}
              </GridLayout>
            </Container>
          </LayoutBetween>
        </DesktopLGContainer>

        <MobileLGContainer>
          <GridLayout className="billing-information gap-6">
            <LayoutBetween className="gap-8">
              <div className="property-wrapper">
                <TextBold3>Your Products</TextBold3>
              </div>
            </LayoutBetween>
            <GridLayout className="gap-4">
              {approval.resource.items.map((cartItem, idx) => (
                <>
                  <div className="cart-product-item p-2">
                    <CartProductImageAndReadOnlyQuantity
                      cartItem={{
                        product: { src: cartItem.media.url },
                        quantity: cartItem.quantity,
                      }}
                    />
                    <CartProductInfo key={cartItem.id + idx} item={cartItem} />
                  </div>
                </>
              ))}
            </GridLayout>
          </GridLayout>
        </MobileLGContainer>
      </>
    )
  )
}

export default ApprovalCheckoutReviewOrderContent
