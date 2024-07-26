import { useCallback, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/orders.service'
import ReturnItemsTableModal from './ReturnItemsTableModal'
import {
  CurrencyBeforeValue,
  GridLayout,
  LayoutBetween,
} from 'components/Utilities/common'
import { TextInput } from '../../components/Utilities/input'
import { CartActionRow } from '../../components/Cart/cart'
import { LargePrimaryButton } from 'components/Utilities/button'
import { Box } from '@mui/system'
import { createReturn } from 'services/returns'
import { useAuth } from 'context/auth-provider'
import './CreateReturnModal.css'

export const ReturnPanel = ({ entries, currency }) => {
  const subtotalWithoutVat = useMemo(
    () =>
      entries.reduce(
        (acc, orderEntry) =>
          acc + orderEntry.price.originalAmount * orderEntry.amount,
        0
      ),
    [entries]
  )

  const taxTotal = useMemo(
    () =>
      entries.reduce((acc, orderEntry) => {
        if (orderEntry.amount > 0) {
          return acc + (orderEntry.tax?.lines[0].amount || 0)
        } else {
          return acc + 0
        }
      }, 0),
    [entries]
  )

  const subtotalWithVat = useMemo(
    () => subtotalWithoutVat + taxTotal,
    [subtotalWithoutVat, taxTotal]
  )

  return (
    <div className="cart-action-panel">
      <GridLayout className="gap-4">
        <CartActionRow>
          <LayoutBetween>
            <>
              <span className="font-semibold">Subtotal without VAT</span>
              <span className="font-semibold">
                <CurrencyBeforeValue
                  value={Math.trunc(subtotalWithoutVat)}
                  currency={currency}
                />
              </span>
            </>
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <LayoutBetween>
            <>
              <span className="font-semibold">Total VAT</span>
              <span className="font-semibold">
                <CurrencyBeforeValue value={taxTotal} currency={currency} />
              </span>
            </>
          </LayoutBetween>
          <LayoutBetween>
            <>
              <span className="font-semibold">Subtotal with VAT</span>
              <span className="font-semibold">
                <CurrencyBeforeValue
                  value={Math.trunc(subtotalWithVat)}
                  currency={currency}
                />
              </span>
            </>
          </LayoutBetween>
        </CartActionRow>
      </GridLayout>
    </div>
  )
}

const CreateReturnModal = (orderObj) => {
  const [order, setOrder] = useState()
  const orderId = orderObj.orderId
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const { userTenant } = useAuth()
  const navigate = useNavigate()
  const submitReturn = useCallback(async () => {
    const createReturnResponse = await createReturn({
      orders: [
        {
          id: order.id,
          items: [
            ...order.entries.map((entry) => ({
              id: entry.id,
              quantity: entry.amount,
            })),
          ],
        },
      ],
      reason: { code: reason, details: comment },
    })
    navigate(`/${userTenant}/my-account/returns/${createReturnResponse.id}`)
  }, [order, comment, reason, userTenant])

  useEffect(() => {
    ;(async () => {
      const fetchedOrder = await getOrder(orderId)
      fetchedOrder.entries = fetchedOrder.entries.map((entry) => ({
        ...entry,
        originalAmount: entry.amount,
      }))
      setOrder(fetchedOrder)
    })()
  }, [])

  const incrementQty = useCallback(
    (entryId) => {
      const entryIndex = order.entries.findIndex(
        (entry) => entry.id === entryId
      )
      const entry = order.entries[entryIndex]
      const newAmout = entry.amount + 1
      if (newAmout <= entry.originalAmount) {
        entry.amount = newAmout
      }

      const newEntries = [...order.entries]
      newEntries[entry.id] = entry
      setOrder({ ...order, entries: [...newEntries] })
    },
    [order]
  )
  const decrementQty = useCallback(
    (entryId) => {
      const entry = order.entries.find((entry) => entry.id === entryId)
      if (entry.amount > 0) {
        entry.amount -= 1
      }
      const newEntries = [...order.entries]
      newEntries[entry.id] = entry
      setOrder({ ...order, entries: [...newEntries] })
    },
    [order]
  )

  return (
    <div className="p-8">
      <p className="font-bold rma-modal-title">Create Return</p>
      <div className="cart-page-content">
        {order && (
          <div className="flex">
            <div className="mr-8">
              <p className="font-bold">Order Number:</p>
              { order.id }
            </div>
            <div className="mr-8">
              <p className="font-bold">Delivery Date:</p>
              { order.deliveryWindow.deliveryDate }
            </div>
          </div>)}
        <div className="lg:block hidden border-1 border-gray-300 border-round-sm">
          {order && (
            <ReturnItemsTableModal
              order={order}
              incrementQty={incrementQty}
              decrementQty={decrementQty}
            />
          )}
        </div>
        
        <div>
          <TextInput
            id="reason-input"
            label="Reason"
            value={reason}
            placeholder="Please put reason"
            action={setReason}
            className="w-full"
          />
          <TextInput
            id="comment-input"
            label="Comment"
            value={comment}
            placeholder="Please put comment"
            action={setComment}
            className="w-full"
          />
        </div>
        <div className="flex centered">
          <LargePrimaryButton 
            className="bg-yellow rounded text-eerieBlack w-8rem"
            title="SUBMIT"
            onClick={submitReturn}
          ></LargePrimaryButton>
        </div>
      </div>
    </div>
  )
}
export default CreateReturnModal
