import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  fetchQuoteDetails,
  fetchQuoteReasons,
  patchQuoteById,
  updateQuote,
} from '../../services/quotes'
import { useAuth } from '../../context/auth-provider'
import { CircularProgress, Grid } from '@material-ui/core'
import AccountMenu from './AccountMenu'
import { formatDateTime } from '../../components/Utilities/common'
import { formatCurrency } from 'helpers/currency'
import { getLanguageFromLocalStorage } from 'context/language-provider'
import { getCountry } from 'services/country.service'
import { DropdownWithLabel } from 'components/Utilities/dropdown'
import Dialog from 'components/Utilities/Dialog'
import FilledButton from 'components/Utilities/FilledButton'
import OutlinedButton from 'components/Utilities/OutlinedButton'

const Subtitle = ({ children }) => {
  return <div className="text-black text-md font-bold">{children}</div>
}

const Separator = ({ className }) => {
  return <div className={`bg-[#D7DADE] h-[1px] w-full ${className}`}></div>
}

const QuoteStatus = ({ status, bgColor, textColor }) => {
  return (
    <div
      style={{
        height: `36px`,
        fontSize: '10px',
        backgroundColor: bgColor,
        color: textColor,
        padding: '8px 16px 8px 16px',
        fontWeight: 'bold',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: textColor,
          borderRadius: '50px',
        }}
      ></div>
      {status}
    </div>
  )
}

export const renderStatus = (status) => {
  switch (status) {
    case 'OPEN': {
      return (
        <QuoteStatus
          status={status}
          bgColor={'rgba(3, 128, 243, 0.15)'}
          textColor={'#0380F3'}
        />
      )
    }
    case 'IN_PROGRESS': {
      return (
        <QuoteStatus
          status={'IN PROGRESS'}
          bgColor={'rgba(3, 128, 243, 0.15)'}
          textColor={'#0380F3'}
        />
      )
    }
    case 'ACCEPTED': {
      return (
        <QuoteStatus
          status={status}
          bgColor={'rgba(40, 164, 67, 0.15)'}
          textColor={'rgba(40, 164, 67, 1)'}
        />
      )
    }
    case 'AWAITING': {
      return (
        <QuoteStatus
          status={status}
          bgColor={'rgba(255, 168, 0, 0.2)'}
          textColor={'#FFA800'}
        />
      )
    }
    case 'DECLINED':
    case 'EXPIRED':
    case 'DECLINED_BY_MERCHANT':
    case 'CANCELED': {
      return (
        <QuoteStatus
          status={status.replaceAll('_', ' ')}
          bgColor={'rgba(243, 3, 3, 0.15)'}
          textColor={'rgba(243, 3, 3, 1)'}
        />
      )
    }
    case 'CONFIRMED': {
      return <QuoteStatus status={status} />
    }
    default: {
      return <QuoteStatus status={status} />
    }
  }
}

const Field = ({ label, content, className }) => {
  return (
    <div className={className}>
      <Subtitle>{label}</Subtitle>
      {content}
    </div>
  )
}

const AccountMyOrdersDetails = () => {
  const { userTenant } = useAuth()
  const { quoteId } = useParams()
  const [quote, setQuote] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [shippingCountry, setshippingCountry] = useState()
  const [billingCountry, setBillingCountry] = useState()
  const [reasons, setReasons] = useState([])
  const options = useMemo(() => {
    return reasons.map((r) => {
      return {
        label: r.message,
        value: r.id,
        type: r.type,
      }
    })
  }, [reasons])
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [comment, setComment] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const dialogActionRef = useRef()
  const [code, setCode] = useState('')

  const getQuote = useCallback(async () => {
    try {
      setIsLoading(true)
      const reasons = await fetchQuoteReasons()
      setReasons(reasons)
      const fetchedQuote = await fetchQuoteDetails(userTenant, quoteId)
      setQuote(fetchedQuote)
      getAddressCountries(fetchedQuote)
    } finally {
      setIsLoading(false)
    }
  }, [userTenant, quoteId])

  const getAddressCountries = async (q) => {
    const shippingAddress = await getCountry(q.shippingAddress.countryCode)
    const billingAddress = await getCountry(q.billingAddress.countryCode)
    setshippingCountry(shippingAddress.name[getLanguageFromLocalStorage()])
    setBillingCountry(billingAddress.name[getLanguageFromLocalStorage()])
  }

  useEffect(() => {
    getQuote()
  }, [])

  const handleAcceptQuote = useCallback(async () => {
    try {
      await patchQuoteById(userTenant, quoteId, 'ACCEPTED')
      getQuote()
    } catch (e) {
      console.log(e)
    }
  }, [quoteId])

  const isDialogInvalid = useMemo(() => {
    return !comment || comment.length === 0 || !code || code.length === 0
  }, [comment, code])

  const handleDeclineQuote = async (quoteId, code, comment) => {
    try {
      await updateQuote(quoteId, code, 'DECLINED', comment)
      await getQuote()
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = useCallback(async () => {
    try {
      dialogActionRef.current(quoteId, code, comment)
    } finally {
      setShowDialog(false)
    }
  }, [dialogActionRef, quoteId, code, comment])

  const handleUpdateQuote = async (quoteId, quoteReasonId, comment) => {
    try {
      await updateQuote(quoteId, quoteReasonId, 'IN_PROGRESS', comment)
      await getQuote()
    } catch (e) {
      console.error(e)
    }
  }

  const handleInitUpdateQuote = () => {
    setDialogTitle('Update Quote')
    setFilteredOptions(options.filter((o) => o.type === 'CHANGE'))
    setShowDialog(true)
    dialogActionRef.current = handleUpdateQuote
  }

  const handleInitDeclineQuote = () => {
    setDialogTitle('Decline Quote')
    setFilteredOptions(options.filter((o) => o.type === 'DECLINE'))
    setShowDialog(true)
    dialogActionRef.current = handleDeclineQuote
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CircularProgress />
      </div>
    )
  }

  if (!isLoading && !quote) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-2xl font-bold">Error </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="w-[320px] mr-2">
        <AccountMenu page='All Quotes' />
      </div>
      <div className="grow">
        <div className="text-[#214559] text-2xl font-bold mb-8">My quotes</div>
        <Separator />
        <div className="text-black text-xl mt-12 font-bold">
          <span className="mr-2">Quote Number</span>
          {quoteId}
        </div>
        <div container className="mt-8 grid grid-cols-6 mb-6">
          <div className="text-sm font-bold">Created by</div>
          <div className="text-sm font-bold">Created</div>
          <div className="text-sm font-bold">Quote Number</div>
          <div className="text-sm font-bold">Valid Until</div>
          <div className="text-sm font-bold">Contact</div>
          <div className="text-sm font-bold">Status</div>
        </div>
        <Separator />
        <div container className="mt-6 mb-6 grid grid-cols-6">
          <div className="text-md flex items-center">
            {quote.customer
              ? `${quote.customer.firstName} ${quote.customer.lastName}`
              : 'N/A'}
          </div>
          <div className="text-md flex items-center">
            {formatDateTime(quote.metadata.createdAt)}
          </div>
          <div className="text-md flex items-center">{quoteId}</div>
          <div className="text-md flex items-center">
            {formatDateTime(quote.validTo)}
          </div>
          <div className="text-md flex items-center">Power Zone</div>
          <div className="flex items-center">
            {renderStatus(quote.status.value)}
          </div>
        </div>
        <Separator />
        <div className="text-black text-xl font-bold mt-12">
          Address and Payment
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field
            label="Shipping Details"
            content={
              <div className="text-sm">
                <div className="my-2">{quote.shippingAddress.name}</div>
                <div className="my-2">{`${quote.shippingAddress.addressLine1} ${quote.shippingAddress.addressLine2}`}</div>
                <div className="my-2">{`${quote.shippingAddress.postcode} ${quote.shippingAddress.city}`}</div>
                <div className="my-2">{shippingCountry}</div>
              </div>
            }
          />
          <Field
            label="Billing Address"
            content={
              <div className="text-sm">
                <div className="my-2">{quote.billingAddress.name}</div>
                <div className="my-2">{`${quote.billingAddress.addressLine1} ${quote.billingAddress.addressLine2}`}</div>
                <div className="my-2">{`${quote.billingAddress.postcode} ${quote.billingAddress.city}`}</div>
                <div className="my-2">{billingCountry}</div>
              </div>
            }
          />

          <div className="flex flex-col">
            <Field
              label="Payment Details"
              content={<div className="text-sm my-2">Payment: per invoice</div>}
            />
          </div>
        </div>
        <Separator className="mt-8" />
        <Grid container columnSpacing={{ xs: 2 }}>
          <Grid xs={7} item>
            <div className="text-xlfont-bold text-black mt-12">
              Products offered
            </div>
            <div className="text-md text-black">Item / Pos: 10</div>
            <div className="">
              <div className="grid grid-cols-12 my-8">
                <div className="text-sm font-bold mr-4 col-span-8 text-center ">
                  Your Product
                </div>
                <div className="text-sm font-bold mr-4 col-span-2 text-center ">
                  Quantity
                </div>
                <div className="text-sm font-bold mr-4 col-span-2 text-center ">
                  Price
                </div>
              </div>
              <Separator />
              {quote.items.map((item) => {
                return (
                  <>
                    <div className="grid grid-cols-12 my-4 h-[122px]">
                      <div className="col-span-2 flex justify-center items-center">
                        {item.product.media?.url && (
                          <img
                            src={item.product.media.url}
                            alt="product-img"
                            style={{
                              objectFit: 'contain',
                            }}
                            className="w-[72px] mr-8 col-span-3"
                          />
                        )}
                      </div>
                      <div class="col-span-6 flex justify-center items-center">
                        <div className="">
                          <div className="text-md font-bold">
                            {item.product.name.en}
                          </div>
                          <div className="text-sm mt-2">
                            <span className="font-bold mr-1">SKU:</span>
                            <span>{item.product.productId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm col-span-2 flex justify-center items-center">
                        <span className="text-md font-medium">
                          {item.quantity.quantity}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-center items-center">
                        <span className="text-md font-medium">
                          {formatCurrency(
                            item.price.currency,
                            item.price.newUnitPrice
                          )}
                        </span>
                      </div>
                    </div>
                    <Separator />
                  </>
                )
              })}
            </div>
          </Grid>
          <Grid xs={5} item className="p-4">
            <div className="bg-bgWhite p-4 text-md border-gray-600">
              <div className="flex justify-between font-bold border-b border-[#D7D7D7] pb-4">
                <div>Subtotal without VAT</div>
                <div>
                  {formatCurrency(
                    quote.subtotalPrice.currency,
                    quote.subtotalPrice.netValue
                  )}
                </div>
              </div>
              <div className="flex justify-between font-light mt-4 pb-4">
                <div>{`VAT ${
                  quote.taxAggregate.lines[0].rate
                }% of ${formatCurrency(
                  quote.subtotalPrice.currency,
                  quote.subtotalPrice.grossValue
                )}`}</div>
                <div>
                  {formatCurrency(
                    quote.subtotalPrice.currency,
                    quote.subtotalPrice.taxValue
                  )}
                </div>
              </div>
              <div className="flex justify-between font-bold border-b border-[#D7D7D7] pb-4">
                <div>Subtotal with VAT</div>
                <div>
                  {formatCurrency(
                    quote.subtotalPrice.currency,
                    quote.subtotalPrice.grossValue
                  )}
                </div>
              </div>
              <div className="flex justify-between font-light mt-4 border-b border-[#D7D7D7] pb-4">
                <div>Shipping Costs</div>
                <div>
                  {quote.shippingCost
                    ? formatCurrency(
                        quote.shippingCost.currency,
                        quote.shippingCost.value
                      )
                    : '-'}
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 pb-32">
                <div>Total Price</div>
                <div>
                  {formatCurrency(
                    quote.totalPrice.currency,
                    quote.totalPrice.grossValue
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <FilledButton
                onClick={handleAcceptQuote}
                disabled={quote.status.value !== 'OPEN'}
                className="mt-4 w-auto bg-yellow text-eerieBlack"
              >
                ACCEPT QUOTE
              </FilledButton>
              <FilledButton
                onClick={handleInitDeclineQuote}
                className="mt-4 w-auto bg-yellow text-eerieBlack"
                disabled={quote.status.value !== 'OPEN'}
              >
                DECLINE QUOTE
              </FilledButton>
              <OutlinedButton
                className="mt-4"
                onClick={handleInitUpdateQuote}
                disabled={quote.status.value !== 'OPEN'}
              >
                CHANGE QUOTE
              </OutlinedButton>
            </div>
          </Grid>
        </Grid>
      </div>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <div className="text-2xl font-bold">{dialogTitle}</div>
        <DropdownWithLabel
          className="mt-16"
          label="Reason"
          options={filteredOptions}
          onChange={(code) => {
            setCode(code[0].value)
          }}
        />
        <textarea
          className="mt-16 w-full h-[126px] p-4 border-black border"
          placeholder="Comment here"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
        />
        <div className="grid grid-cols-2 mt-8 w-full gap-2">
          <button
            className="h-12 w-full font-bold text-[#214559] text-center bg-[#EFF0F2] border-[#214559] hover:brightness-95 border"
            onClick={() => {
              setShowDialog(false)
              setComment('')
            }}
          >
            Cancel
          </button>
          <FilledButton disabled={isDialogInvalid} onClick={handleSave}>
            Save
          </FilledButton>
        </div>
      </Dialog>
    </div>
  )
}

export default AccountMyOrdersDetails
