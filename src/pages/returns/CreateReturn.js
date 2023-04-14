import { useCallback, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/orders.service'
import ReturnIitemsTable from './ReturnItemsTable'
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

const CreateReturnPage = () => {
  const [order, setOrder] = useState()

  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const { orderId } = useParams()
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
    <div className="cart-page-wrapper ">
      <div className="cart-page-content">
        <div className="lg:block hidden">
          {order && (
            <ReturnIitemsTable
              order={order}
              incrementQty={incrementQty}
              decrementQty={decrementQty}
            />
          )}
        </div>
        <div></div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <TextInput
              label="Reason"
              value={reason}
              placeholder="Please put reason"
              action={setReason}
              className="w-full"
            />
            <TextInput
              label="Comment"
              value={comment}
              placeholder="Please put comment"
              action={setComment}
              className="w-full"
            />
          </div>

          <div className="float-right">
            <div className="cart-action-panel-wrapper ml-auto">
              {order && order.entries && (
                <ReturnPanel
                  entries={order.entries}
                  currency={order.currency}
                />
              )}
            </div>
            <div className="cart-action-panel-wrapper ml-auto">
              <LargePrimaryButton
                title="Submit return"
                onClick={submitReturn}
              ></LargePrimaryButton>
            </div>
          </div>
        </Box>
      </div>
    </div>
  )
}
export default CreateReturnPage
