import { useAuth } from '../../context/auth-provider'
import React, { useState } from 'react'
import { useCart } from '../../context/cart-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../voucherify-integration/mapEmporixUserToVoucherifyCustomer'
import Box from '@mui/material/Box'
import { Button, Link } from '@mui/material'
import { CircularProgress } from '@material-ui/core'

export const Qualification = ({ qualification, hideApply, addProducts }) => {
  function updateClipboard(newClip) {
    return navigator.clipboard.writeText(newClip).then(
      () => {
        console.log('copied to clipboard')
        return true
      },
      () => {
        console.log('failed to copy to clipboard')
        return false
      }
    )
  }

  const { user } = useAuth()
  const [isBeingApplied, setIsBeingApplied] = useState(false)
  const { applyPromotion, applyDiscount, cartAccount } = useCart()
  const cartMixins = cartAccount.metadata?.mixins || {}
  const { availablePromotions, appliedCoupons } = cartMixins
  const availablePromotionsCodes = (availablePromotions || []).map(
    (availablePromotion) => availablePromotion.code
  )

  const name = qualification?.cmsFields?.name
  const description = qualification?.cmsFields?.description
  const termsAndConditions = qualification?.cmsFields?.termsAndConditions
  const canApply =
    qualification.object === 'voucher' ||
    availablePromotionsCodes.includes(qualification.id)
  const [error, setError] = useState('')
  const alreadyAppliedCodes = (appliedCoupons || []).map(
    (appliedCoupon) => appliedCoupon.code
  )
  const isAlreadyApplied =
    qualification.object === 'voucher'
      ? alreadyAppliedCodes.includes(qualification.code)
      : alreadyAppliedCodes.includes(qualification.id)
  const background = isAlreadyApplied
    ? qualification.object === 'voucher'
      ? '#caf8cd'
      : '#cee8f8'
    : qualification.object === 'voucher'
    ? '#9fe7a5'
    : '#9bcfef'

  const apply = async (code, user) => {
    if (!code || isBeingApplied) {
      return
    }
    setError('')
    setIsBeingApplied(true)
    try {
      const result =
        qualification.object === 'voucher'
          ? await applyDiscount(code, user)
          : await applyPromotion(code, user)
      if (result.inapplicableCoupons?.length) {
        const { inapplicableCoupons } = result
        const error = inapplicableCoupons
          .map?.(
            (inapplicableCoupon) => inapplicableCoupon?.result?.error?.details
          )
          .filter((e) => e)
          .join(', ')
        setError(error)
      }
    } catch (e) {
      console.error(e)
    }
    setIsBeingApplied(false)
  }

  const [copied, setCopied] = useState(false)

  return (
    <Box
      sx={{
        background,
        p: '10px!important',
        color: isAlreadyApplied ? '#7e7e7e' : '#222',
      }}
    >
      <Box sx={{ m: 2 }}>
        <Box sx={{ fontWeight: 800 }}>
          {qualification.object === 'voucher'
            ? `Voucher code: ${qualification.code}`
            : name || qualification.banner}
        </Box>
        <Box sx={{ fontWeight: '500' }}>
          <span style={{ fontWeight: 800 }}>
            {qualification.object === 'voucher'
              ? name || description
              : description}
          </span>
        </Box>
        {termsAndConditions && (
          <Box sx={{ fontWeight: '500', mt: 1 }}>
            Terms & Conditions:
            <br />
            <span
              style={{
                fontWeight: 400,
              }}
            >
              {termsAndConditions}
            </span>
          </Box>
        )}
        {!hideApply && (
          <>
            {isAlreadyApplied ? (
              <Box>
                <Button
                  title="Applied"
                  disabled={true}
                  variant={'contained'}
                  sx={{ mt: 1, mb: '14px', borderRadius: 0 }}
                >
                  Applied
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  {qualification.object === 'voucher' ? (
                    <Box>
                      <Button
                        title="Copy Voucher"
                        disabled={copied}
                        variant={'contained'}
                        sx={{ mt: 1, mb: '14px', borderRadius: 0 }}
                        onClick={() => {
                          const updateClipboardResult = updateClipboard(
                            qualification.code
                          )
                          if (updateClipboardResult) {
                            setCopied(true)
                            setTimeout(() => {
                              setCopied(false)
                            }, 3000)
                          }
                        }}
                      >
                        {copied ? 'Copied to clipboard' : 'Copy voucher code'}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {canApply && (
                        <Box>
                          <Button
                            title="Apply Coupon"
                            disabled={
                              isBeingApplied || alreadyAppliedCodes.length >= 5
                            }
                            variant={'contained'}
                            sx={{ mt: 1, mb: '14px', borderRadius: 0 }}
                            onClick={() =>
                              alreadyAppliedCodes.length < 5 &&
                              apply(
                                qualification.object === 'voucher'
                                  ? qualification.code
                                  : qualification.id,
                                user
                              )
                            }
                          >
                            {alreadyAppliedCodes.length >= 5
                              ? 'You have reached coupon limit'
                              : 'Apply'}
                          </Button>
                        </Box>
                      )}
                    </>
                  )}
                  {isBeingApplied && (
                    <Box sx={{ mb: '-60px', mt: '9px', ml: 1 }}>
                      <CircularProgress size={36.5} />
                    </Box>
                  )}
                </Box>
                <Box sx={{ color: 'red' }}>{error}</Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
