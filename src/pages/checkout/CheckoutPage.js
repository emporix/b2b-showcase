import React, { useCallback, useMemo, useState } from 'react'
import { CartActionPanel } from '../../components/Cart/cart'
import { LargePrimaryButton } from '../../components/Utilities/button'
import {
  DesktopMDContainer,
  GridLayout,
  MobileMDContainer,
} from '../../components/Utilities/common'
import './checkout.css'
import checkoutService from 'services/checkout.service'
import CheckoutContent from './CheckoutContent'
import CheckoutSummary from './CheckoutSummary'
import { useUserAddress } from './AddressProvider'
import { useCart } from 'context/cart-provider'
import { Button, Chip, Grid } from '@mui/material'
import { TextInput } from '../../components/Utilities/input'

const PaymentAction = ({ action, disabled }) => {
  return (
    <>
      <DesktopMDContainer>
        <LargePrimaryButton
          className="md:block hidden"
          title="REVIEW ORDER"
          onClick={action}
        />
      </DesktopMDContainer>

      <MobileMDContainer>
        <LargePrimaryButton
          title="CHECK OUT"
          onClick={action}
          disabled={disabled}
        />
      </MobileMDContainer>
    </>
  )
}

const ReviewOrderAction = ({ action }) => {
  return (
    <>
      <DesktopMDContainer>
        <LargePrimaryButton
          className="md:block hidden"
          title="CONFIRM AND PAY"
          onClick={action}
        />
      </DesktopMDContainer>

      <MobileMDContainer>
        <LargePrimaryButton title="CONFIRM AND PAY" onClick={action} />
      </MobileMDContainer>
    </>
  )
}

const AppliedCoupon = ({ discount }) => {
  const { removeDiscount } = useCart()

  const deleteDiscountFromCart = useCallback(() => {
    removeDiscount(discount.id)
  }, [discount])

  return (
    <Chip
      label={discount.code}
      variant="outlined"
      onDelete={deleteDiscountFromCart}
    />
  )
}

const Coupon = () => {
  const [code, setCode] = useState('')
  const { applyDiscount, discounts } = useCart()

  const redeemCode = useCallback(async () => {
    try {
      await applyDiscount(code)
      setCode('')
    } catch (e) {
      console.error(e)
    }
  }, [code])

  return (
    <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
      <Grid item xs={12}>
        <TextInput
          label="Coupon"
          value={code}
          placeholder="Put coupon code here"
          action={setCode}
        />
        <Button title="Apply Coupon" onClick={redeemCode}>
          Apply
        </Button>
      </Grid>
      {discounts && (
        <Grid item xs={12}>
          {discounts.map((discount) => (
            <AppliedCoupon
              key={discount.code}
              discount={discount}
            ></AppliedCoupon>
          ))}
        </Grid>
      )}
    </Grid>
  )
}

const CheckoutPage = () => {
  const [status, setStatus] = useState('shipping')
  const [final, setFinal] = useState(false)
  const [order, setOrder] = useState(null)
  const { selectedAddress, billingAddress, addresses } = useUserAddress()
  const { cartAccount, syncCart } = useCart()

  const subtotalWithoutVat = useMemo(() => {
    let subTotal =
      cartAccount.subtotalAggregate && cartAccount.subtotalAggregate
        ? cartAccount.subtotalAggregate.grossValue
        : 0
    if (cartAccount.totalDiscount && cartAccount.totalDiscount.amount) {
      subTotal -= cartAccount.totalDiscount.amount
    }
    return subTotal
  }, [cartAccount, cartAccount.subtotalAggregate])

  const handlePayment = () => {
    setStatus('payment')
  }
  const handleReview = () => {
    setStatus('review_order')
  }
  const handleViewOrder = async () => {
    const order = await checkoutService.triggerCheckout(cartAccount.id, [
      selectedAddress,
      billingAddress,
    ])
    setOrder(order)
    setFinal(order.orderId)
    syncCart()
  }
  return (
    <div className="checkout-page-wrapper ">
      <div className="checkout-page-content">
        <div className="gap-12 lg:flex grid grid-cols-1">
          {final === false ? (
            <>
              <CheckoutContent status={status} />
              <div className="checkout-action-panel-wrapper">
                <GridLayout className="gap-6">
                  <CartActionPanel
                    subtotalWithoutVat={subtotalWithoutVat}
                    action={false}
                  />
                  {status === 'shipping' ? (
                    <>
                      <DesktopMDContainer>
                        <Coupon />
                        <LargePrimaryButton
                          className="md:block hidden"
                          title="GO TO PAYMENT"
                          disabled={addresses.length === 0}
                          onClick={handlePayment}
                        />
                      </DesktopMDContainer>

                      <MobileMDContainer>
                        <LargePrimaryButton
                          title="CHECK OUT"
                          onClick={handlePayment}
                        />
                      </MobileMDContainer>
                    </>
                  ) : (
                    ''
                  )}
                  {status === 'payment' ? (
                    <>
                      <Coupon />
                      <PaymentAction
                        action={handleReview}
                        disabled={addresses.length === 0}
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {status === 'review_order' ? (
                    <ReviewOrderAction action={handleViewOrder} />
                  ) : (
                    ''
                  )}
                </GridLayout>
              </div>
            </>
          ) : (
            <CheckoutSummary setFinal={setFinal} order={order} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
