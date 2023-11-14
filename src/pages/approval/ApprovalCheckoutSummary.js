import React, { useEffect, useState } from 'react'
import './approval.css'
import {
  CartSubTotalIncludeVat,
  CartActionRow,
  CartSubTotalExcludeVat,
  CartShipingCost,
  getShippingCost,
  CartVat,
  CartTotalPrice,
} from 'components/Cart/cart'
import {
  savedCartsPage,
  approvalOrderCreatedPage,
} from 'services/service.config'
import {
  DesktopMDContainer,
  GridLayout,
  LayoutBetween,
  MobileMDContainer,
} from 'components/Utilities/common'
import { useApprovalAddress } from 'pages/approval/ApprovalAddressProvider'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { LargePrimaryButton } from 'components/Utilities/button'
import { useAuth } from 'context/auth-provider'
import checkoutService from 'services/checkout.service'
import ApprovalCheckoutReviewOrderContent from './ApprovalCheckoutReviewOrderContent'
import approvalService from 'services/approval.service'
import { TextBold4 } from 'components/Utilities/typography'
import Dialog from 'components/Utilities/Dialog'

const ReviewOrderAction = ({ action }) => {
  return (
    <>
      <DesktopMDContainer>
        <LargePrimaryButton
          className="md:block hidden cta-button bg-yellow"
          title="CONFIRM AND PAY"
          onClick={action}
        />
      </DesktopMDContainer>

      <MobileMDContainer>
        <LargePrimaryButton
          className="cta-button bg-yellow"
          title="CONFIRM AND PAY"
          onClick={action}
        />
      </MobileMDContainer>
    </>
  )
}

const DeclineAction = ({ approval }) => {
  const navigate = useNavigate()

  const [comment, setComment] = useState(null)

  const [showDialog, setShowDialog] = useState(null)

  const handleDeclineApprovalRequest = async () => {
    await approvalService.declineApproval(approval.id, comment)
    setShowDialog(false)
    navigate(savedCartsPage())
  }

  const handleCancelPopup = () => {
    setShowDialog(false)
  }

  return (
    <>
      <Dialog
        maxWidth="xl"
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
        }}
      >
        <div className="declineApprovalDialog">
          <div className="text-xl font-bold mb-[10px]">Decline Approval</div>
          <div className="declineApprovalDialogContent">
            <GridLayout className={'min-w-[400px] declineApprovalComment'}>
              <TextBold4>Additional Information (optional)</TextBold4>
              <GridLayout className="">
                <textarea
                  className="h-[126px] p-4 border-black border"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value)
                  }}
                />
              </GridLayout>
            </GridLayout>
            <div className="declineApprovalDialogFooter">
              <LargePrimaryButton
                className="md:block hidden bg-yellow mt-[50px]"
                title="SUBMIT"
                onClick={handleDeclineApprovalRequest}
              />
              <LargePrimaryButton
                className="md:block hidden gray-button mt-[50px]"
                title="CANCEL"
                onClick={handleCancelPopup}
              />
            </div>
          </div>
        </div>
      </Dialog>
      <DesktopMDContainer>
        <LargePrimaryButton
          className="md:block hidden cta-button gray-button"
          title="DECLINE REQUEST"
          onClick={() => setShowDialog(true)}
        />
      </DesktopMDContainer>

      <MobileMDContainer>
        <LargePrimaryButton
          className="cta-button gray-button"
          title="DECLINE REQUEST"
          onClick={() => setShowDialog(true)}
        />
      </MobileMDContainer>
    </>
  )
}

export const CartActionPanel = ({ action }) => {
  const { approval, selectedShippingMethod } = useApprovalAddress()
  const resource = approval.resource
  return (
    <div className="cart-action-panel">
      <GridLayout className="gap-4">
        <CartActionRow>
          <LayoutBetween>
            {resource.subtotalAggregate?.netValue && (
              <CartSubTotalExcludeVat
                value={resource.subtotalAggregate.netValue}
                currency={approval.details.currency}
              />
            )}
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <LayoutBetween>
            {resource &&
              resource?.taxAggregate &&
              resource?.taxAggregate.lines.length > 0 && (
                <CartVat
                  value={resource.subtotalAggregate.taxValue}
                  taxPercentage={
                    (resource.subtotalAggregate.taxValue * 100) /
                    resource.subtotalAggregate.netValue
                  }
                  currency={resource?.currency}
                  taxValue={resource?.subtotalAggregate?.taxValue}
                />
              )}
          </LayoutBetween>
          <LayoutBetween>
            {
              <CartSubTotalIncludeVat
                grossValue={resource.subtotalAggregate.grossValue}
                currency={approval.details.currency}
              />
            }
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <LayoutBetween>
            <CartShipingCost
              currency={approval.details.currency}
              shippingCost={getShippingCost(selectedShippingMethod)}
            />
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <div className="cart-total-price-wrapper">
            <LayoutBetween>
              {resource.totalPrice && resource.totalPrice.amount && (
                <CartTotalPrice
                  totalValue={
                    resource.subtotalAggregate.grossValue +
                    getShippingCost(selectedShippingMethod)
                  }
                  currency={approval.details.currency}
                />
              )}
            </LayoutBetween>
          </div>
        </CartActionRow>
      </GridLayout>
    </div>
  )
}

const ApprovalCheckoutSummary = () => {
  const { user } = useAuth()

  const { selectedAddress, selectedShippingMethod, billingAddress, approval } =
    useApprovalAddress()

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate(loginUrl())
    }
  })

  const handleViewOrder = async () => {
    const shipping = {
      zoneId: selectedShippingMethod.zoneId,
      methodId: selectedShippingMethod.id,
      methodName: selectedShippingMethod.name,
      shippingTaxCode: selectedShippingMethod.shippingTaxCode,
      amount: selectedShippingMethod.fee,
    }
    const order = await checkoutService.triggerCheckoutAsApprover(
      approval.resource.id,
      [selectedAddress, billingAddress],
      shipping,
      approval.details.paymentMethods,
      approval.requestor
    )
    navigate(approvalOrderCreatedPage())
  }

  return (
    approval && (
      <div className="checkout-page-wrapper ">
        <div className="checkout-page-content">
          <div className="gap-12 lg:flex grid grid-cols-1">
            {
              <>
                <div className="checkout-content-wrapper">
                  <GridLayout className="gap-8">
                    <ApprovalCheckoutReviewOrderContent />
                  </GridLayout>
                </div>
                <div className="checkout-action-panel-wrapper">
                  <GridLayout className="gap-6">
                    <CartActionPanel
                      subtotalWithoutVat={
                        approval.resource.subtotalAggregate.netValue
                      }
                      action={false}
                    />
                    {approval.status === 'PENDING' && (
                      <>
                        <ReviewOrderAction action={handleViewOrder} />
                        <DeclineAction approval={approval} />
                      </>
                    )}
                  </GridLayout>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    )
  )
}

export default ApprovalCheckoutSummary
