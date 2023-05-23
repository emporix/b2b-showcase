import { useAuth } from '../../context/auth-provider'
import React, { useState } from 'react'
import { useCart } from '../../context/cart-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../voucherify-integration/mapEmporixUserToVoucherifyCustomer'
import Box from '@mui/material/Box'
import { Button, Link } from '@mui/material'
import { CircularProgress } from '@material-ui/core'
import { getProduct } from '../../voucherify-integration/emporixApi'
import { asyncMap } from '../../voucherify-integration/voucherifyApi'
import CartService from '../../services/cart.service'
import priceService from '../../services/product/price.service'

export const Qualification = ({
  qualification,
  hideApply,
  customer,
  addProducts,
  cartId,
}) => {
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
  const [areProductsBeingAdded, setAreProductsBeingAdded] = useState(false)
  const { applyPromotion, applyDiscount, cartAccount, recheckCart } = useCart()
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

  const addMissingProducts = async () => {
    if (areProductsBeingAdded || !cartId) {
      return
    }
    setAreProductsBeingAdded(true)
    const products = (
      await Promise.all(
        await asyncMap(addProducts, async (productId) => {
          const product = await getProduct(productId)
          const prices = await priceService.getPriceWithProductIds([productId])
          return { ...product, price: prices?.[0] }
        })
      )
    ).filter((product) => product)
    for (const product of products) {
      await CartService.addProductToCart(cartId, { ...product, quantity: 1 })
    }
    await recheckCart()
    setAreProductsBeingAdded(false)
  }

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
              <Box sx={{ display: 'flex', gap: '10px' }}>
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
                {addProducts?.length > 0 ? (
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      title="Apply Coupon"
                      disabled={!addProducts}
                      variant={'contained'}
                      sx={{
                        mt: 1,
                        mb: '14px',
                        borderRadius: 0,
                        background: '#097e12',
                        '&:hover': {
                          backgroundColor: '#07670f',
                        },
                      }}
                      onClick={() => addMissingProducts()}
                    >
                      Add missing product{addProducts?.length > 1 ? 's' : ''}
                    </Button>
                    {areProductsBeingAdded && (
                      <Box sx={{ mb: '-60px', mt: '9px', ml: 1 }}>
                        <CircularProgress size={36.5} />
                      </Box>
                    )}
                  </Box>
                ) : undefined}
                <Box sx={{ color: 'red' }}>{error}</Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
