import { useAuth } from '../../context/auth-provider'
import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/cart-provider'
import Box from '@mui/material/Box'
import { Button, Link } from '@mui/material'
import { CircularProgress } from '@material-ui/core'
import { getProduct } from '../../integration/emporix/emporixApi'
import { asyncMap } from '../../integration/voucherify/voucherifyApi'
import CartService from '../../services/cart.service'
import priceService from '../../services/product/price.service'
import category from '../home/Category'

const getUserId = (user) => {
  return user?.id || 'anonymous'
}

const getSavedQualifications = () => {
  const rawLocalStorageSavedQualifications = localStorage.getItem(
    'savedQualifications'
  )
  try {
    const localStorageSavedQualifications = JSON.parse(
      rawLocalStorageSavedQualifications
    )
    return localStorageSavedQualifications instanceof Object
      ? localStorageSavedQualifications
      : {}
  } catch (e) {
    return {}
  }
}

export const getUsersSavedQualifications = (user) => {
  const userId = getUserId(user)
  const localStorageSavedQualifications = getSavedQualifications()
  const usersSavedQualifications =
    localStorageSavedQualifications?.[userId]?.filter?.(
      (qualification) => qualification?.code
    ) || []
  return Array.isArray(usersSavedQualifications) ? usersSavedQualifications : []
}

const setUsersSavedQualifications = (user, codes) => {
  const userId = getUserId(user)
  const localStorageSavedQualifications = getSavedQualifications()
  localStorageSavedQualifications[userId] = codes
  localStorage.setItem(
    'savedQualifications',
    JSON.stringify(localStorageSavedQualifications)
  )
  return localStorageSavedQualifications[userId]
}

export const Qualification = ({
  qualification,
  addProducts,
  cartId,
  allowVoucherApply,
}) => {
  const { user } = useAuth()
  const [usersSavedQualificationsState, setUsersSavedQualificationsState] =
    useState(getUsersSavedQualifications(user))

  useEffect(() => {
    setUsersSavedQualificationsState(getUsersSavedQualifications(user))
  }, [user])
  function addToUsersSavedQualifications(qualification) {
    const usersSavedQualifications = getUsersSavedQualifications(user)
    usersSavedQualifications.push(qualification)
    setUsersSavedQualificationsState(usersSavedQualifications)
    setUsersSavedQualifications(user, usersSavedQualifications)
  }

  function removeFromUsersSavedQualifications(code) {
    const usersSavedQualifications = getUsersSavedQualifications(user)
    const updatedUsersSavedQualifications = usersSavedQualifications.filter(
      (qualification) => qualification?.code !== code
    )
    setUsersSavedQualificationsState(updatedUsersSavedQualifications)
    setUsersSavedQualifications(user, updatedUsersSavedQualifications)
  }

  const [isBeingApplied, setIsBeingApplied] = useState(false)
  const [areProductsBeingAdded, setAreProductsBeingAdded] = useState(false)
  const { applyPromotion, applyDiscount, cartAccount, recheckCart } = useCart()
  const cartMixins = cartAccount?.mixins?.voucherify || {}
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
  const categoriesNames = (qualification.categories || [])
    .map((category) => category.name)
    .filter((e) => e)

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isAlreadyApplied ? (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button
                title="Applied"
                disabled={true}
                variant={'contained'}
                sx={{ mt: 1, mb: '14px', borderRadius: 0 }}
              >
                Applied
              </Button>
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
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Box sx={{ display: 'flex' }}>
                {qualification.object === 'voucher' && !allowVoucherApply ? (
                  <Box>
                    <Button
                      title="Save voucher"
                      variant={'contained'}
                      sx={{
                        mt: 1,
                        mb: '14px',
                        borderRadius: 0,
                        background: !usersSavedQualificationsState
                          .map((qualification) => qualification?.code)
                          .includes(qualification.code)
                          ? '#1976d2'
                          : '#19ccd2',
                        '&:hover': {
                          background: !usersSavedQualificationsState
                            .map((qualification) => qualification?.code)
                            .includes(qualification.code)
                            ? '#11589f'
                            : '#14a3a8',
                        },
                      }}
                      onClick={() => {
                        if (
                          !usersSavedQualificationsState
                            .map((qualification) => qualification?.code)
                            .includes(qualification.code)
                        ) {
                          addToUsersSavedQualifications(qualification)
                        } else {
                          removeFromUsersSavedQualifications(qualification.code)
                        }
                      }}
                    >
                      {usersSavedQualificationsState
                        .map((qualification) => qualification?.code)
                        .includes(qualification.code)
                        ? 'Saved for later'
                        : 'Save for later'}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            {categoriesNames.map((categoryName) => {
              return (
                <Box
                  key={`qualification-${qualification.id}-${categoryName}`}
                  sx={{
                    m: 0,
                    background: 'rgb(180,97,1)',
                    color: 'white',
                    padding: '10px!important',
                    paddingTop: '5px!important',
                    paddingBottom: '5px!important',
                    mt: 1,
                    mb: '14px',
                    maxHeight: '36.5px',
                    borderRadius: '3px',
                  }}
                >
                  {categoryName}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
