import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Box } from '@mui/system'
import { CircularProgress } from '@material-ui/core'
import { useAuth } from '../../context/auth-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../integration/voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { Qualification } from '../shared/Qualification'
import { getCart } from '../../integration/emporix/emporixApi'
import { mapItemsToVoucherifyOrdersItems } from '../../integration/voucherify/validateCouponsAndGetAvailablePromotions/mappers/product'
import { getQualificationsWithItemsExtended } from '../../integration/voucherify/voucherifyApi'
import { getCustomerAdditionalMetadata } from '../../helpers/getCustomerAdditionalMetadata'
import { redeemCart } from '../../integration/voucherify/redeemCart'
import { mapEmporixItemsToVoucherifyProducts } from '../../integration/voucherify/mappers/mapEmporixItemsToVoucherifyProducts'

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

const AppliedCoupon = ({ appliedCoupon, user }) => {
  const { removeDiscount } = useCart()

  const deleteDiscountFromCart = useCallback(() => {
    removeDiscount(appliedCoupon.code, user)
  }, [appliedCoupon])

  return (
    <Chip
      sx={{ mb: 1, mr: 1 }}
      label={appliedCoupon?.banner || appliedCoupon.code}
      variant="outlined"
      onDelete={deleteDiscountFromCart}
    />
  )
}

const AppliedCouponsComponent = ({ appliedCoupons, user }) => {
  const counter = (appliedCoupons ?? []).reduce(
    (accumulator, appliedCoupon) => {
      switch (appliedCoupon.type) {
        case 'promotion_tier':
          accumulator.promotion_tier = accumulator.promotion_tier + 1
          break
        case 'voucher':
          accumulator.voucher = accumulator.voucher + 1
          break
        default:
          break
      }
      return accumulator
    },
    {
      promotion_tier: 0,
      voucher: 0,
    }
  )

  if (appliedCoupons?.length) {
    return (
      <Grid item xs={12} sx={{}}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <span className="font-bold ">
            Applied{' '}
            {counter.voucher && counter.promotion_tier
              ? `voucher${counter.voucher > 1 ? 's' : ''} and promotion${
                  counter.promotion_tier > 1 ? 's' : ''
                }`
              : counter.voucher
              ? `voucher${counter.voucher > 1 ? 's' : ''}`
              : `promotion${counter.promotion_tier > 1 ? 's' : ''}`}
          </span>
        </Grid>
        <Grid item xs={12}>
          {appliedCoupons.map((appliedCoupon) => (
            <AppliedCoupon
              key={appliedCoupon.code}
              appliedCoupon={appliedCoupon}
              user={user}
            />
          ))}
        </Grid>
      </Grid>
    )
  }
}

export const Coupon = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [keyValue, setKeyValue] = useState(Math.random())
  const { applyDiscount, mixins } = useCart()
  const appliedCoupons = mixins?.voucherify?.appliedCoupons || []
  const [isBeingApplied, setIsBeingApplied] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setError('')
  }, [code])

  const redeemCode = async (code, user) => {
    if (!code || isBeingApplied) {
      return
    }
    setIsBeingApplied(true)
    try {
      const result = await applyDiscount(code, user)
      if (result.inapplicableCoupons?.length) {
        const { inapplicableCoupons } = result
        const error = inapplicableCoupons
          .map?.(
            (inapplicableCoupon) => inapplicableCoupon?.result?.error?.details
          )
          .filter((e) => e)
          .join(', ')
        setError(error)
      } else {
        setKeyValue(Math.random())
        setCode('')
      }
    } catch (e) {
      console.error(e)
    }
    setIsBeingApplied(false)
  }

  return (
    <Grid container spacing={2} sx={{ mb: 0 }}>
      <Grid item xs={12}>
        <div key={keyValue}>
          {appliedCoupons.length < 5 && (
            <TextInput
              label=""
              value={code}
              placeholder="Put voucher code here"
              action={setCode}
              disabled={isBeingApplied || appliedCoupons.length >= 5}
            />
          )}
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Button
                title="Apply Coupon"
                disabled={isBeingApplied || appliedCoupons.length >= 5}
                onClick={() => redeemCode(code, user)}
              >
                {appliedCoupons.length >= 5
                  ? 'You have reached coupon limit'
                  : 'Apply'}
              </Button>
            </Box>
            {isBeingApplied && (
              <Box sx={{ mb: -'7px', mt: '9px' }}>
                <CircularProgress size={18} />
              </Box>
            )}
          </Box>
          <span style={{ color: 'red' }}>{error}</span>
        </Box>
      </Grid>
      <AppliedCouponsComponent appliedCoupons={appliedCoupons} user={user} />
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

  const { user } = useAuth()
  const [qualifications, setQualifications] = useState([])
  useEffect(() => {
    ;(async () => {
      if (!cartAccount?.id) {
        return
      }
      const customer = mapEmporixUserToVoucherifyCustomer(
        user,
        getCustomerAdditionalMetadata()
      )
      const emporixCart = await getCart(cartAccount.id)
      const items = mapItemsToVoucherifyOrdersItems(
        mapEmporixItemsToVoucherifyProducts(emporixCart?.items || [])
      )
      setQualifications(
        await getQualificationsWithItemsExtended('ALL', items, customer)
      )
    })()
  }, [cartAccount, user])

  const handleViewOrder = async () => {
    const order = await checkoutService.triggerCheckout(cartAccount.id, [
      selectedAddress,
      billingAddress,
    ])
    setOrder(order)
    setFinal(order.orderId)
    try {
      await redeemCart({
        emporixCart: cartAccount,
        emporixOrderId: order?.orderId,
        customer: mapEmporixUserToVoucherifyCustomer(
          user,
          getCustomerAdditionalMetadata()
        ),
      })
    } catch (e) {
      console.log('could not redeem or create order')
    }
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
                        <Box sx={{ mt: 1 }}>
                          <LargePrimaryButton
                            className="md:block hidden"
                            title="GO TO PAYMENT"
                            disabled={addresses.length === 0}
                            onClick={handlePayment}
                          />
                        </Box>
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
                    <PaymentAction
                      action={handleReview}
                      disabled={addresses.length === 0}
                    />
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
        <Box sx={{ mt: -2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {qualifications.length ? (
            <Box>
              <Box
                sx={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                Available promotions:
              </Box>
              <Box
                sx={{
                  mt: -1,
                  p: '20px!important',
                  gap: '10px!important',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {qualifications?.map((qualification) => (
                  <Qualification
                    key={qualification.id}
                    qualification={qualification}
                    allowVoucherApply={true}
                  />
                ))}
              </Box>
            </Box>
          ) : undefined}
        </Box>
      </div>
    </div>
  )
}

export default CheckoutPage
