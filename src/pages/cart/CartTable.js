import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Quantity from '../../components/Utilities/quantity/quantity'
import {
  CartProductBasicInfo,
  CartProductImage,
  PriceExcludeVAT,
} from '../../components/Cart/cart'

import './cart.css'
import { useCart } from 'context/cart-provider'
import { Box } from '@mui/system'
import { Qualification } from '../shared/Qualification'
import { Modal } from '@mui/material'

const CartProductInfo = ({ cart }) => {
  return (
    <div className="cart-product-info-wrapper flex gap-6">
      <div className="">
        <CartProductImage
          className="table-cart-product-image"
          src={cart.product.src}
        />
      </div>
      <div>
        <CartProductBasicInfo cart={cart} />
      </div>
    </div>
  )
}

const CartTable = ({ cartList, cart, classname, qualifications = [] }) => {
  const [open, setOpen] = useState(false)
  const [currentProductQualifications, setCurrentProductQualifications] =
    useState([])
  const [productName, setProductName] = useState('')

  useEffect(() => {
    setCurrentProductQualifications(
      qualifications.find(
        (qualificationWithProductId) =>
          qualificationWithProductId?.productId === open
      )?.qualifications || []
    )
    let newName = ''
    cartList.map((cartItem, index) => {
      const itemId = cartItem.itemYrn?.split?.(';')?.at?.(-1)
      if (itemId === open) {
        newName = cartItem?.product?.name
      }
    })
    setProductName(newName)
  }, [open])

  const discountsDetails = cart?.mixins?.voucherify?.discountsDetails || []
  const { removeCartItem, changeCartItemQty } = useCart()
  return (
    <>
      <TableContainer className={classname}>
        <div className="shopping-cart_table-title">your products</div>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell align="left" className="cart-head-item">
                Product
              </TableCell>
              <TableCell align="left" className="cart-head-item">
                Promotions
              </TableCell>
              <TableCell align="center" className="cart-head-item">
                Price
              </TableCell>
              <TableCell align="left" className="cart-head-item">
                Quantity
              </TableCell>
              <TableCell align="center" className="cart-head-item">
                Subtotal
              </TableCell>
              <TableCell align="center" className="cart-head-item">
                VAT
              </TableCell>
              <TableCell align="center" className="cart-head-item">
                Discount
              </TableCell>
              <TableCell align="center" className="cart-head-item">
                Total Price
              </TableCell>
              <TableCell align="center" className="cart-head-item"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartList.map((cartItem, index) => {
              const itemId = cartItem.itemYrn?.split?.(';')?.at?.(-1)
              const discountDetails = discountsDetails.find(
                (discountDetails) => discountDetails.source_id === itemId
              )
              const discount = discountDetails?.discount
                ? discountDetails.discount / 100
                : 0
              const amount = discountDetails?.amount
                ? discountDetails.amount / 100
                : Math.round(
                    cartItem.product.price.originalAmount * cartItem.quantity +
                      cartItem.product.price.originalAmount *
                        cartItem.quantity *
                        (cartItem.itemTaxInfo[0].rate / 100)
                  )
              const currentProductQualifications =
                qualifications.find(
                  (qualificationWithProductId) =>
                    qualificationWithProductId?.productId === itemId
                )?.qualifications || []
              return (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ width: '356px', border: 'none' }}>
                    <CartProductInfo cart={cartItem} />
                  </TableCell>
                  <TableCell className="cart-row-item">
                    {currentProductQualifications.length ? (
                      <Box
                        className="shopping-cart_promotions-label"
                        sx={{
                          mb: -2,
                          background: '#EB5757',
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          color: 'white',
                        }}
                        onClick={() => setOpen(itemId)}
                      >
                        {currentProductQualifications.length} promotion
                        {currentProductQualifications.length > 1 ? 's' : ''}
                      </Box>
                    ) : undefined}
                  </TableCell>
                  <TableCell className="cart-row-item">
                    <PriceExcludeVAT
                      price={cartItem.product.price.effectiveAmount}
                    />
                  </TableCell>
                  <TableCell align="center" className="cart-row-item">
                    <div className="quantity-wrapper">
                      <Quantity
                        value={cartItem.quantity}
                        changeCartItemQty={(quantity) =>
                          changeCartItemQty(cartItem.id, quantity)
                        }
                      />
                    </div>
                  </TableCell>

                  <TableCell className="cart-row-item">
                    <PriceExcludeVAT
                      price={
                        cartItem.product.price.originalAmount *
                        cartItem.quantity
                      }
                    />
                  </TableCell>

                  <TableCell className="cart-row-item">
                    {cartItem.itemTaxInfo && (
                      <PriceExcludeVAT
                        price={cartItem.itemTaxInfo[0].value.amount}
                        caption={`${cartItem.itemTaxInfo[0].rate} %`}
                      />
                    )}
                  </TableCell>

                  <TableCell className="cart-row-item">
                    <PriceExcludeVAT price={discount} caption="incl. VAT" />
                  </TableCell>

                  <TableCell className="cart-row-item">
                    <PriceExcludeVAT
                      price={amount - discount}
                      caption="incl. VAT"
                    />
                  </TableCell>

                  <TableCell className="cart-row-item">
                    <span
                      onClick={() => removeCartItem(cartItem)}
                      className="cursor-pointer"
                    >
                      &#10060;
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={!!open}
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
            whiteSpace: `nowrap`,
          }}
        >
          <div className='flex justify-between items-center'>
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>
            Promotion{currentProductQualifications.length > 1 ? 's' : ''}{' '}
            related to {productName}:
          </span>
          <Box
            className="cursor-pointer"
            sx={{
              justifyContent: 'end',
              justifyItems: 'end',
              cursor: 'pointer',
              color: '#AAABB2',
            }}
            onClick={() => setOpen(false)}
          >
            X
          </Box>
          </div>
          {currentProductQualifications?.map((qualification) => (
            <Qualification
              key={qualification.id}
              qualification={qualification}
              allowVoucherApply={true}
            />
          ))}
        </div>
      </Modal>
    </>
  )
}

export default CartTable
