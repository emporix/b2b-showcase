import React, { useEffect, useState } from 'react'
import './cart.css'
import CartActionBar from './CartActionBar'
import CartTable from './CartTable'
import CartMobileContent from './CartMobileContent'
import { CartActionPanel } from '../../components/Cart/cart'
import { useCart } from 'context/cart-provider'
import {
  getUsersSavedQualifications,
  Qualification,
} from '../shared/Qualification'
import { Box } from '@mui/system'
import { useAuth } from '../../context/auth-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../voucherify-integration/mapEmporixUserToVoucherifyCustomer'
import {
  asyncMap,
  getQualificationsWithItemsExtended,
  getValidationRule,
} from '../../voucherify-integration/voucherifyApi'
import useMediaQuery from '@mui/material/useMediaQuery'
import { buildCartFromEmporixCart } from '../../voucherify-integration/buildCartFromEmporixCart'
import { getCart } from '../../voucherify-integration/emporixApi'
import { mapItemsToVoucherifyOrdersItems } from '../../voucherify-integration/validateCouponsAndGetAvailablePromotions/product'
import { Modal } from '@mui/material'
import { uniq } from 'lodash'

const CartPage = () => {
  const minWidth900px = useMediaQuery('(min-width:900px)')
  const { cartAccount } = useCart()
  const { user } = useAuth()
  const [productQualifications, setProductQualifications] = useState([])
  const [customerWalletQualifications, setCustomerWalletQualifications] =
    useState([])
  const [bundleQualifications, setBundleQualifications] = useState([])
  const [allOtherQualifications, setAllOtherQualifications] = useState([])
  const [cartId, setCartId] = useState(undefined)

  const loadCustomerWalletQualifications = async (items, customer) => {
    const customerWalletQualifications =
      await getQualificationsWithItemsExtended(
        'CUSTOMER_WALLET',
        items,
        customer
      )
    setCustomerWalletQualifications(customerWalletQualifications)
    return customerWalletQualifications
  }

  const loadALLQualifications = async (
    items,
    customer,
    allQualificationsSoFar
  ) => {
    const qualificationsIdsSoFar = allQualificationsSoFar.map(
      (qualification) => qualification.id
    )
    const qualificationsAllScenario = await getQualificationsWithItemsExtended(
      'ALL',
      items,
      customer
    )
    setAllOtherQualifications(
      qualificationsAllScenario.filter(
        (qualification) => !qualificationsIdsSoFar.includes(qualification.id)
      )
    )
  }

  const setBundleQualificationsEnriched = async (bundleQualifications) => {
    //It is intended
    //We shall show promotion asap, later update promotion with more data when found.
    setBundleQualifications(bundleQualifications)
    const enrichedBundleQualificationsByProductsRelatedTo = await asyncMap(
      bundleQualifications,
      async (bundleQualification) => {
        const allValidationRuleIds = (
          bundleQualification?.validation_rule_assignments?.data || []
        )
          .map((validationRule) => validationRule.rule_id)
          .filter((e) => e)
        const allValidationRules = await Promise.all(
          await asyncMap(allValidationRuleIds, (id) => getValidationRule(id))
        )
        const allValidationRulesEnrichedByProductIdsFoundInValidationRules =
          allValidationRules.map((validationRule) => {
            const rules = validationRule?.rules || {}
            const conditions = Object.values(rules)
              .filter((rule) => rule?.conditions instanceof Object)
              .map((rule) => Object.values(rule.conditions))
              .flat()
              .flat()
              .filter(
                (condition) =>
                  condition instanceof Object && condition?.source_id
              )
            validationRule.productIdsFoundInValidationRules = conditions.map(
              (condition) => condition.source_id
            )
            return validationRule
          })
        const productIdsFoundInValidationRules =
          allValidationRulesEnrichedByProductIdsFoundInValidationRules
            .filter(
              (enrichedValidationRule) =>
                enrichedValidationRule?.productIdsFoundInValidationRules?.length
            )
            .map(
              (enrichedValidationRule) =>
                enrichedValidationRule?.productIdsFoundInValidationRules
            )
            .flat()

        const promotionApplicableTo =
          bundleQualification.qualification?.applicable_to?.data || []
        bundleQualification.relatedTo = [
          ...productIdsFoundInValidationRules,
          ...(promotionApplicableTo
            .map((applicableTo) => applicableTo.source_id)
            .filter((e) => e) || []),
        ]
        return bundleQualification
      }
    )
    setBundleQualifications(enrichedBundleQualificationsByProductsRelatedTo)
  }

  const setProductsQualificationsFunction = async (items, customer) => {
    const productsIds = items.map((item) => item.source_id).filter((e) => e)
    const allQualifications = await getQualificationsWithItemsExtended(
      'PRODUCTS',
      items,
      customer
    )
    let allQualificationsPerProducts = productsIds.map((productId) => {
      return {
        productId: productId,
        qualifications: [],
      }
    })
    const bundles = uniq(
      allQualifications.filter(
        (qualification) =>
          qualification?.metadata?.bundle === 'true' ||
          qualification?.metadata?.bundle === true
      )
    )
    //don't wait
    setBundleQualificationsEnriched(bundles)
    const allQualificationsWithoutBundles = allQualifications.filter(
      (qualification) =>
        !(
          qualification?.metadata?.bundle === 'true' ||
          qualification?.metadata?.bundle === true
        )
    )
    allQualificationsWithoutBundles.forEach((qualificationExtended) => {
      const applicable_to =
        qualificationExtended.qualification?.applicable_to?.data || []
      const sourceIds =
        applicable_to
          .map((applicableTo) => applicableTo.source_id)
          .filter((e) => e) || []
      sourceIds.forEach((sourceId) => {
        if (
          allQualificationsPerProducts.find(
            (allQualificationsPerProduct) =>
              allQualificationsPerProduct.productId === sourceId
          )
        ) {
          allQualificationsPerProducts = allQualificationsPerProducts.map(
            (allQualificationsPerProducts) => {
              if (allQualificationsPerProducts.productId === sourceId) {
                allQualificationsPerProducts.qualifications = [
                  ...allQualificationsPerProducts.qualifications,
                  qualificationExtended,
                ]
              }
              return allQualificationsPerProducts
            }
          )
        }
      })
    })
    setProductQualifications(allQualificationsPerProducts)
    return allQualifications
  }
  const [cartItemIds, setCartItemIds] = useState([])

  useEffect(() => {
    ;(async () => {
      if (!cartAccount?.id) {
        return
      }
      setCartId(cartAccount?.id)
      const customer =
        user instanceof Object
          ? mapEmporixUserToVoucherifyCustomer(user)
          : undefined
      const emporixCart = await getCart(cartAccount.id)
      const cart = buildCartFromEmporixCart({
        emporixCart,
        customer,
      })
      const items = mapItemsToVoucherifyOrdersItems(cart.items || [])
      const allQualificationsSoFar = [].concat(
        ...(await Promise.all([
          await setProductsQualificationsFunction(items, customer),
          await loadCustomerWalletQualifications(items, customer),
        ]))
      )
      await loadALLQualifications(items, customer, allQualificationsSoFar)
    })()
  }, [cartAccount?.id])

  useEffect(() => {
    const items = cartAccount?.items || []
    const itemIds = items
      .map((item) => item?.itemYrn?.split?.(';')?.at?.(-1))
      .filter((e) => e)
    setCartItemIds(itemIds)
  }, [cartAccount?.items])

  const [usersSavedQualifications, setUsersSavedQualifications] = useState(
    getUsersSavedQualifications(user)
  )

  useEffect(() => {
    setUsersSavedQualifications(getUsersSavedQualifications(user))
  }, [user])

  const [
    openCustomerWalletQualifications,
    setOpenCustomerWalletQualifications,
  ] = useState(false)

  const [openUsersSavedQualifications, setOpenUsersSavedQualifications] =
    useState(false)

  return (
    <div className="cart-page-wrapper ">
      <div className="cart-page-content">
        <CartActionBar view={true} />
        <div className="lg:block hidden">
          <CartTable
            cartList={cartAccount.items}
            cart={cartAccount}
            qualifications={productQualifications}
          />
        </div>
        <div className="lg:hidden">
          <CartMobileContent cartList={cartAccount.items} cart={cartAccount} />
        </div>
        <div
          className="float-right"
          style={{
            display: 'flex',
            flexDirection: !minWidth900px ? 'column-reverse' : 'row',
            gap: !minWidth900px ? 40 : 20,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: '10px !important',
              gap: 1,
            }}
          >
            {customerWalletQualifications.length ? (
              <Box
                sx={{
                  m: 2,
                  p: '20px!important',
                  background: '#9fe7a5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  textWeight: '800!important',
                }}
                onClick={() => setOpenCustomerWalletQualifications(true)}
              >
                Found {customerWalletQualifications.length} promotion
                {customerWalletQualifications.length > 1 ? 's' : ''} related to
                customer
              </Box>
            ) : undefined}
            {usersSavedQualifications.length ? (
              <Box
                sx={{
                  m: 2,
                  p: '20px!important',
                  background: '#9fe7a5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  textWeight: '800!important',
                }}
                onClick={() => setOpenUsersSavedQualifications(true)}
              >
                You have {usersSavedQualifications.length} voucher
                {usersSavedQualifications.length > 1 ? 's' : ''} saved
              </Box>
            ) : undefined}
            {bundleQualifications.length ? (
              <Box>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Bundles:
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
                  {bundleQualifications?.map((qualification) => (
                    <Qualification
                      key={qualification.id}
                      qualification={qualification}
                      cartId={cartId}
                      allowVoucherApply={true}
                      addProducts={(qualification?.relatedTo || []).filter(
                        (id) => !cartItemIds.includes(id)
                      )}
                    />
                  ))}
                </Box>
              </Box>
            ) : undefined}
            {allOtherQualifications.length ? (
              <Box>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    width: '100%',
                    textAlign: 'center',
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
                  {allOtherQualifications?.map((qualification) => (
                    <Qualification
                      key={qualification.id}
                      qualification={qualification}
                      allowVoucherApply={true}
                    />
                  ))}
                </Box>
              </Box>
            ) : undefined}
            <Modal
              open={
                openCustomerWalletQualifications || openUsersSavedQualifications
              }
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 16,
                  fontWeight: 'bold',
                  gap: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  background: `white`,
                  border: 0,
                  padding: 10,
                }}
              >
                <Box
                  className="cursor-pointer"
                  sx={{
                    mb: -2,
                    justifyContent: 'end',
                    width: '100%',
                    justifyItems: 'end',
                    cursor: 'pointer',
                    maxWidth: '40px',
                  }}
                  onClick={() => {
                    setOpenCustomerWalletQualifications(false)
                    setOpenUsersSavedQualifications(false)
                  }}
                >
                  &#10060;
                </Box>
                {openCustomerWalletQualifications ? (
                  <>
                    <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                      Available promotion
                      {customerWalletQualifications.length > 1 ? 's' : ''}:
                    </span>
                    {customerWalletQualifications?.map((qualification) => (
                      <Qualification
                        key={qualification.id}
                        qualification={qualification}
                        allowVoucherApply={true}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                      Saved voucher
                      {usersSavedQualifications.length > 1 ? 's' : ''}:
                    </span>
                    {usersSavedQualifications?.map((qualification) => (
                      <Qualification
                        key={qualification.id}
                        qualification={qualification}
                        allowVoucherApply={true}
                      />
                    ))}
                  </>
                )}
              </div>
            </Modal>
          </Box>
          <div
            className="cart-action-panel-wrapper ml-auto"
            style={{ minWidth: 400 }}
          >
            <CartActionPanel />
          </div>
        </div>
        <CartActionBar />
      </div>
    </div>
  )
}
export default CartPage
