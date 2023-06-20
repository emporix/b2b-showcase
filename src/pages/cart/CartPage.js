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
import { mapEmporixUserToVoucherifyCustomer } from '../../integration/voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { getQualificationsWithItemsExtended } from '../../integration/voucherify/voucherifyApi'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getCart } from '../../integration/emporix/emporixApi'
import { mapItemsToVoucherifyOrdersItems } from '../../integration/voucherify/validateCouponsAndGetAvailablePromotions/mappers/product'
import { Modal } from '@mui/material'
import { enrichBundleQualificationsByProductIdsRelatedTo } from '../../integration/voucherify/mappers/enrichBundleQualificationsByProductIdsRelatedTo'
import {
  filterOutBundleQualifications,
  getOnlyBundleQualifications,
} from '../../integration/voucherify/mappers/bundleQualifications'
import { getQualificationsPerProducts } from '../../integration/voucherify/mappers/getQualificationsPerProducts'
import { getCustomerAdditionalMetadata } from '../../helpers/getCustomerAdditionalMetadata'
import { mapEmporixItemsToVoucherifyProducts } from '../../integration/voucherify/mappers/mapEmporixItemsToVoucherifyProducts'

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
    setBundleQualifications(
      await enrichBundleQualificationsByProductIdsRelatedTo(
        bundleQualifications
      )
    )
  }

  const setProductsQualificationsFunction = async (items, customer) => {
    const productsIds = items.map((item) => item.source_id).filter((e) => e)
    const allQualifications = await getQualificationsWithItemsExtended(
      'PRODUCTS',
      items,
      customer
    )
    const bundleQualifications = getOnlyBundleQualifications(allQualifications)
    //don't wait
    setBundleQualificationsEnriched(bundleQualifications)
    const allQualificationsWithoutBundles =
      filterOutBundleQualifications(allQualifications)
    const allQualificationsPerProducts = getQualificationsPerProducts(
      allQualificationsWithoutBundles,
      productsIds
    )
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
      const customer = mapEmporixUserToVoucherifyCustomer(
        user,
        getCustomerAdditionalMetadata()
      )
      const emporixCart = await getCart(cartAccount.id)
      const items = mapItemsToVoucherifyOrdersItems(
        mapEmporixItemsToVoucherifyProducts(emporixCart?.items || [])
      )
      const allQualificationsSoFar = [].concat(
        ...(await Promise.all([
          await setProductsQualificationsFunction(items, customer),
          await loadCustomerWalletQualifications(items, customer),
        ]))
      )
      await loadALLQualifications(items, customer, allQualificationsSoFar)
    })()
  }, [cartAccount?.items, user])

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

  const CloseButton = () => (
    <Box
      className="cursor-pointer"
      sx={{
        justifyContent: 'end',
        // width: '14px',
        justifyItems: 'end',
        cursor: 'pointer',
        color: '#AAABB2',
      }}
      onClick={() => {
        setOpenCustomerWalletQualifications(false)
        setOpenUsersSavedQualifications(false)
      }}
    >
      X
    </Box>
  )

  return (
    <div className="cart-page-wrapper ">
      <div className="cart-page-content">
        <CartActionBar view={true} />
        <div className="lg:block hidden border rounded border-quartz p-6">
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
              width: '100%',
              gap: 1,
            }}
          >
            {customerWalletQualifications.length ? (
              <Box
                className="cta-button "
                sx={{
                  m: '0px!important',
                  pt: '20px!important',
                  pb: '20px!important',
                  background: '#FAC420',
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
            {Array.isArray(usersSavedQualifications) &&
            usersSavedQualifications.length ? (
              <Box
                className="cta-button "
                sx={{
                  m: '0px!important',
                  pt: '20px!important',
                  pb: '20px!important',
                  background: '#FAC420',
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

            {customerWalletQualifications.length ||
            (Array.isArray(usersSavedQualifications) &&
              usersSavedQualifications.length) ? (
              <Box sx={{ mb: 1 }} />
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
                    pt: '20px!important',
                    pb: '20px!important',
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
                    pt: '20px!important',
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
              disableAutoFocus={true}
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
                  borderRadius: 4,
                  padding: 32,
                }}
              >
                {openCustomerWalletQualifications ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Available promotion
                        {customerWalletQualifications.length > 1 ? 's' : ''}:
                      </span>
                      <CloseButton />
                    </div>
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
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Saved voucher
                        {usersSavedQualifications.length > 1 ? 's' : ''}:
                      </span>
                      <CloseButton />
                    </div>
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
