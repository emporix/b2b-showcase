import React, { useEffect, useState } from 'react'
import './cart.css'
import CartActionBar from './CartActionBar'
import CartTable from './CartTable'
import CartMobileContent from './CartMobileContent'
import { CartActionPanel } from '../../components/Cart/cart'
import { useCart } from 'context/cart-provider'
import { Qualification } from '../shared/Qualification'
import { Box } from '@mui/system'
import { useAuth } from '../../context/auth-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../voucherify-integration/mapEmporixUserToVoucherifyCustomer'
import { getQualificationsWithItemsExtended } from '../../voucherify-integration/voucherifyApi'
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

  const setCustomerWalletQualificationsFunction = async (items, customer) => {
    console.log(123)
    const customerWalletQualifications =
      await getQualificationsWithItemsExtended(
        'CUSTOMER_WALLET',
        items,
        customer
      )
    setCustomerWalletQualifications(customerWalletQualifications)
    return customerWalletQualifications
  }

  const setALLQualificationsFunction = async (items, customer) => {
    return await getQualificationsWithItemsExtended('ALL', items, customer)
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
    setBundleQualifications(bundles)
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
    return allQualificationsPerProducts
  }

  useEffect(() => {
    ;(async () => {
      if (!cartAccount?.id) {
        return
      }
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
      const x = Promise.all([
        await setProductsQualificationsFunction(items, customer),
        await setCustomerWalletQualificationsFunction(items, customer),
      ])
      console.log(x, 'aaa')
      // console.log(await setALLQualificationsFunction(items, customer))
    })()
  }, [cartAccount?.id])
  const [open, setOpen] = useState(false)

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
            <Box>
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
                  onClick={() => setOpen(true)}
                >
                  Found {customerWalletQualifications.length} promotion
                  {customerWalletQualifications.length > 1 ? 's' : ''} related
                  to customer
                </Box>
              ) : undefined}
            </Box>
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
                <Box sx={{ mt: -1, p: '20px!important' }}>
                  {bundleQualifications?.map((qualification) => (
                    <Qualification
                      key={qualification.id}
                      qualification={qualification}
                      hideApply={false}
                    />
                  ))}
                </Box>
              </Box>
            ) : undefined}
            <Modal
              open={open}
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
                  whiteSpace: `nowrap`,
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
                  onClick={() => setOpen(false)}
                >
                  &#10060;
                </Box>
                <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Available promotion
                  {customerWalletQualifications.length > 1 ? 's' : ''}:
                </span>
                {customerWalletQualifications?.map((qualification) => (
                  <Qualification
                    key={qualification.id}
                    qualification={qualification}
                    hideApply={false}
                  />
                ))}
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
