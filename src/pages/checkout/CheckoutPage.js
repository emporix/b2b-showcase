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
import CartService from '../../services/cart.service'
import { usePayment } from './PaymentProvider'
import PaymentSpreedly from 'components/Checkout/PaymentSpreedly'
import { RadioGroup } from 'components/Utilities/radio'
import FilledButton from 'components/Utilities/FilledButton'
import { api } from 'services/axios'
import { approvalApprovers, approvalConfirmationPage, approvalPermitted, authorizePayment } from 'services/service.config'
import { ACCESS_TOKEN } from 'constants/localstorage'
import Dropdown, { DropdownWithLabel } from 'components/Utilities/dropdown'
import { TextBold1, TextBold3, TextBold4, TextRegular1 } from 'components/Utilities/typography'
import approvalService from 'services/approval.service'
import { useNavigate } from 'react-router-dom'
import Dialog from 'components/Utilities/Dialog'

const PaymentAction = ({ action, disabled }) => {
  return (
    <>
      <DesktopMDContainer>
        <LargePrimaryButton
          className="md:block hidden cta-button bg-yellow"
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
          className="md:block hidden cta-button bg-yellow"
          title="CONFIRM AND PAY"
          onClick={action}
        />
      </DesktopMDContainer>

      <MobileMDContainer>
        <LargePrimaryButton className='cta-button bg-yellow' title="CONFIRM AND PAY" onClick={action} />
      </MobileMDContainer>
    </>
  )
}

const ApprovalNeededAction = ({ approvers }) => {

  const navigate = useNavigate()
  const { selectedAddress, billingAddress, addresses } = useUserAddress()
  const { cartAccount, syncCart, shippingMethod, cart } = useCart()
  const { getPaymentMethods, payment, deferredPayment, setDeferredPayment } = usePayment()

  const [ selectedApprover, setSelectedApprover] = useState(null) 
  const [ comment, setComment] = useState(null) 
  
  const [ showDialog, setShowDialog] = useState(null)  
  const approversOptions = approvers.map(approver => ({
    label: approver.firstName + ' ' + approver.lastName,
    value: approver.userId
  }))

  const handleCreateApproval = async () => {
    const shipping = {
      zoneId: shippingMethod.zoneId,
      methodId: shippingMethod.id,
      methodName: shippingMethod.name,
      shippingTaxCode: shippingMethod.shippingTaxCode,
      amount: shippingMethod.fee
    }
    const approval = await approvalService.triggerApproval(cartAccount.id, [
      selectedAddress,
      billingAddress,
    ], shipping, getPaymentMethods(), { userId : selectedApprover}, comment )
    
    setShowDialog(false)
    await syncCart()
    navigate(approvalConfirmationPage())
  }

  const handleCancelApproval = () =>{
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
        <div className="approvalDialog">
          <div className="text-xl font-bold mb-[10px]">Request Approval</div>
          <div className="approvalDialogContent">
            <div className={'approvalComment'}>
              <TextBold4>Approvers</TextBold4>
              <Dropdown
                className={'approversDropdown'}
                options={approversOptions}
                onChange={(e) => {
                  setSelectedApprover(e[0].value)
                }}
              />
            </div>

            <GridLayout className={'approvalComment'}>
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
            <div className="approvalDialogFooter">
              <LargePrimaryButton
                className="md:block hidden gray-button mt-[50px]"
                title="CANCEL"
                onClick={handleCancelApproval}
              />
              <LargePrimaryButton
                className="md:block hidden bg-yellow mt-[50px]"
                title="SUBMIT"
                onClick={handleCreateApproval}
              />
            </div>
          </div>
        </div>
      </Dialog>
      <LargePrimaryButton
        className="md:block hidden cta-button bg-yellow"
        title="APPROVAL REQUEST"
        onClick={() => setShowDialog(true)}
      />
      <div className="approvalErrorBox">
        You exceeded your limit. Please submit your cart for approval.
      </div>
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
  const [rewardPoints, setRewardPoints] = useState(0)
  const [redeemOptions, setRedeemOptions] = useState([])
  const { applyDiscount, discounts } = useCart()
  const [showDialog, setShowDialog] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [couponsLimitPerCart, setCouponsLimitPerCart] = useState(5);


  const redeemCode = useCallback(async () => {
    try {
      await applyDiscount(code)
    } catch (e) {
      console.error(e)
    } finally {
      setCode(() => '')
    }
  }, [code])

  const redeemPointsForCoupon = async () => {
    try {
      const newCode = await CartService.getCouponForPointsForLoggedUser(
        selectedOption.id
      )
      try {
        await applyDiscount(newCode.code)
        setShowInfo(true)
      } catch (e) {
        console.error(e)
        setShowDialog(false)
      } finally {
        setCode(() => '')
      }
    } catch (e) {
      console.error(e)
      setShowDialog(false)
      console.log("couldn't redeem points for coupon")
    }
  }

  const Card = (props) => {
    return (
      <div
        className={`${
          selectedOption && props.id === selectedOption.id
            ? 'border-blue-500'
            : 'border-lightGray'
        }  border-[1px]  p-2 flex flex-col w-48 cursor-pointer`}
        onClick={() => setSelectedOption(() => props)}
      >
        <div className="font-bold">{props.name}</div>
        <div className="text-md text-xs pt-2 pb-2">{props.description}</div>
        <div className="text-md text-sm mt-auto">
          <span className="font-bold">COST: </span>
          <span className="text-tinBlue">{props.points}</span>
        </div>
        <div className="mt-1 flex self-end">
          <div className="text-[#5F8FAA] text-xs font-bold">
            {props.coupon.discountType}
          </div>
        </div>
      </div>
    )
  }

  const openDialogAndFetchRedeemOptions = async () => {
    setShowInfo(false)
    setShowDialog(true)
    const options = await CartService.getRedeemOptionsForLoggedUser()
    setRedeemOptions(options)
  }

  useEffect(() => {
    ;(async () => {
      const points = await CartService.getRewardPointsForLoggedUser()
      setRewardPoints(points)
    })()
  }, [redeemOptions, discounts])

  const displayNewCouponAmount = (coupon) => {
    const display =
      coupon.discountType === 'ABSOLUTE'
        ? `${coupon.discountAbsolute.amount} ${coupon.discountAbsolute.currency}`
        : `${coupon.discountPercentage} %`

    return <span>{display}</span>
  }

  return (
    <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
      <Grid item xs={12} className={couponsLimitPerCart === discounts?.length && 'hidden'}>
        <TextInput
          label="Coupon"
          value={code}
          placeholder="Put coupon code here"
          action={setCode}
        />
        <div className="flex justify-between">
          <Button title="Apply Coupon" onClick={redeemCode}>
            Apply
          </Button>
          {rewardPoints > 0 && (
            <button
              className="font-bold cursor-pointer"
              onClick={openDialogAndFetchRedeemOptions}
            >
              Get coupons for points: {JSON.stringify(rewardPoints)}
            </button>
          )}
        </div>
      </Grid>
      {discounts && (
        <Grid item xs={12}>
          {discounts.map((discount) => (
            <AppliedCoupon
              key={discount.code}
              discount={discount}
              className="hello"
            ></AppliedCoupon>
          ))}
        </Grid>
      )}
      <Dialog
        maxWidth={'md'}
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedOption(null)
        }}
      >
        <div className="p-6 flex">
          <div
            className={
              'account-page-content content-panel flex flex-col min-w-[600px] min-h-[400px]'
            }
          >
            {showInfo ? (
              <div className="self-center m-auto font-bold flex flex-col">
                <div className="text-center mb-8">
                  You’ve earned {displayNewCouponAmount(selectedOption.coupon)}{' '}
                  discount
                </div>
                <div className="flex w-1/2 m-auto gap-4">
                  <button
                    className="action-discard-button"
                    onClick={() => {
                      setShowDialog(false)
                    }}
                  >
                   OK
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="font-inter font-bold text-2xl text-tinBlue pb-4 mb-6">
                  Redeem Points
                </div>

                <div className="pb-4">
                  <div className="font-inter font-bold text-xl text-tinBlue mb-2">
                    Available Coupons:
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {redeemOptions.length &&
                    redeemOptions.map((card) => <Card key={card.id} {...card} />)}
                </div>
                <div className="mt-6">
                  <div className="font-inter font-bold text-xl text-tinBlue">
                    Points:
                  </div>
                </div>
                <div className="mt-2 mb-4 p-1 flex">
                  <div className="border-[1px] border-lightGray p-2">
                    {JSON.stringify(rewardPoints)}
                  </div>
                </div>
                <div className="flex w-3/4 m-auto gap-4">
                  <button
                    className="action-discard-button"
                    onClick={() => {
                      setShowDialog(false)
                      setSelectedOption(null)
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    className={`ml-2 cart-go-checkout-btn ${!selectedOption && 'bg-bgWhite'}`}
                    onClick={redeemPointsForCoupon}
                    disabled={!selectedOption}
                  >
                    REDEEM SELECTED
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </Grid>
  )
}

const CheckoutPage = () => {
  const [status, setStatus] = useState('shipping')
  const [final, setFinal] = useState(false)
  const [order, setOrder] = useState(null)
  const [paymentProps, setPaymentProps] = useState(null) 
  const { selectedAddress, billingAddress, addresses } = useUserAddress()
  const { cartAccount, syncCart, shippingMethod, cart } = useCart()
  const { getPaymentMethods, payment, deferredPayment, setDeferredPayment } = usePayment()
  const [ approvalNeeded, setApprovalNeeded] = useState(false)  
  const [ approvers, setApprovers] = useState([])  

  const subtotalWithoutVat = useMemo(() => {
    let subTotal =
      cartAccount.subtotalAggregate
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
    const shipping = {
      zoneId: shippingMethod.zoneId,
      methodId: shippingMethod.id,
      methodName: shippingMethod.name,
      shippingTaxCode: shippingMethod.shippingTaxCode,
      amount: shippingMethod.fee
    }
    const order = await checkoutService.triggerCheckout(cartAccount.id, [
      selectedAddress,
      billingAddress,
    ], shipping, getPaymentMethods() )
    setOrder(order)
    setFinal(order.orderId)
    setPaymentProps({
      customerId : cartAccount.customerId, 
      grossValue : cartAccount.subtotalAggregate.grossValue, 
      currency: cartAccount.subtotalAggregate.currency,
      orderId: order.orderId,
      deferred: true
    })
    syncCart()
  }
  const executePayment = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    const body = {
      order : {
        id : order.orderId
      },
      paymentModeId: payment.customAttributes.modeId,
      creditCardToken: payment.customAttributes.token,
      browserInfo: payment.customAttributes.browserInfo 
    }
    const res = await api.post(`${authorizePayment()}`, body, { headers })
    order.paymentDetails = {
      externalPaymentHttpMethod: res.data.externalPaymentHttpMethod,
      authorizationToken: res.data.authorizationToken,
      externalPaymentRedirectURL: res.data.externalPaymentRedirectURL

    }
    setDeferredPayment(false)   
  }

  useEffect(() => {
    ;
    (async() => {
     const body = {
       resourceId : cartAccount.id,
       resourceType: 'CART',
       action: 'CHECKOUT'
     }
     const headers = {
       Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
     }
     const res = await api.post(`${approvalPermitted()}`, body, { headers })
     setApprovalNeeded(!res.data.permitted)
     
     if(!res.permitted) {
      const approversResponse = await api.post(`${approvalApprovers()}`, body, { headers })
      setApprovers(approversResponse.data)
     }

    })()
   }, [cartAccount])

  return (
    <div className="checkout-page-wrapper ">
      <div className="checkout-page-content">
        <div className="gap-12 lg:flex grid grid-cols-1">
          {final === false ? (
            <>
              <CheckoutContent status={status} cart={cartAccount} />
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
                          className="md:block hidden cta-button bg-yellow"
                          title="GO TO PAYMENT"
                          disabled={addresses.length === 0 || shippingMethod == null}
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

                  {status === 'review_order' && !approvalNeeded ? (
                    <ReviewOrderAction action={handleViewOrder} />
                  ) : (
                    ''
                  )}
                  {status === 'review_order' && approvalNeeded ? (
                    <ApprovalNeededAction approvers={approvers} />
                  ) : (
                    ''
                  )}
                </GridLayout>
              </div>
            </>
          ) : (
            deferredPayment ? 
              (
                <div className='deferredPaymentBox'> 
                  <RadioGroup active="radio1">
                    <GridLayout className="gap-4 border border-quartz rounded p-12 col-12">
                      <PaymentSpreedly  props={paymentProps} />
                    </GridLayout>
                  </RadioGroup>
                  {!payment.requiresInitialization && (<FilledButton
                    onClick={executePayment}
                    className="mt-4 w-auto bg-yellow text-eerieBlack"
                  >
                    PAY
                  </FilledButton>)}
                </div>
              ) : (
                <CheckoutSummary setFinal={setFinal} order={order} />
              )
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
