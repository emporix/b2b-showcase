import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchQuoteDetails, patchQuoteById } from '../../services/quotes'
import { useAuth } from '../../context/auth-provider'
import { CircularProgress, Grid } from '@material-ui/core'
import AccountMenu from './AccountMenu'
import { formatDateTime } from '../../components/Utilities/common'
import { formatCurrency } from 'helpers/currency'
import QuoteStatus from './QuoteStatus'
import { getLanguageFromLocalStorage } from 'context/language-provider'
import { getCountry } from 'services/country.service'

const Subtitle = ({ children }) => {
  return <div className="text-tinBlue text-xl font-bold">{children}</div>
}
const Column = ({ label, value }) => {
  return (
    <div className="">
      <div className="text-sm font-bold mb-2">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
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

  const getQuote = useCallback(async () => {
    try {
      const fetchedQuote = await fetchQuoteDetails(userTenant, quoteId)
      setQuote(fetchedQuote)
      getAddressCountries(fetchedQuote)
    } finally {
      setIsLoading(false)
    }
  }, [userTenant, quoteId])

  const getAddressCountries = useCallback (async (q) => {
    const shippingAddress =  await getCountry(q.shippingAddress.countryCode)
    const billingAddress =  await getCountry(q.billingAddress.countryCode)
    setshippingCountry(shippingAddress.name[getLanguageFromLocalStorage()])
    setBillingCountry(billingAddress.name[getLanguageFromLocalStorage()])
  })

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

  const handleDeclineQuote = useCallback(async () => {
    try {
      await patchQuoteById(userTenant, quoteId, 'DECLINED')
      getQuote()
    } catch (e) {
      console.log(e)
    }
  }, [quoteId])

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="w-[320px] mr-2">
        <AccountMenu />
      </div>
      <div className="grow">
        <div className="text-tinBlue text-2xl">
          <span className="font-bold mr-2">Quote details</span>
          {quoteId}
        </div>
        <div container className="mt-8 grid grid-cols-6">
          <Column
            label="Created by"
            value={`${quote.customer.firstName} ${quote.customer.lastName}`}
          />
          <Column
            label="Created at"
            value={formatDateTime(quote.metadata.createdAt)}
          />
          <Column label="Quote number" value={quote.id} />
          <Column label="Valid until" value={formatDateTime(quote.validTo)} />
          <Column label="Contact" value={`Power Zone`} />
          <Column
            label="Status"
            value={<QuoteStatus status={quote.status.value} />}
          />
        </div>

        <div className="text-tinBlue text-2xl font-bold mr-2 mt-8">
          Address and Payment
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <Field
            label="Billing Address"
            content={
              <div className="text-sm">
                <div>{quote.billingAddress.name}</div>
                <div>{`${quote.billingAddress.addressLine1} ${quote.billingAddress.addressLine2}`}</div>
                <div>{`${quote.billingAddress.postcode} ${quote.billingAddress.city}`}</div>
                <div>{billingCountry}</div>
              </div>
            }
          />

          <Field
            label="Shipping Details"
            content={
              <div className="text-sm">
                <div>{quote.shippingAddress.name}</div>
                <div>{`${quote.shippingAddress.addressLine1} ${quote.shippingAddress.addressLine2}`}</div>
                <div>{`${quote.shippingAddress.postcode} ${quote.shippingAddress.city}`}</div>
                <div>{shippingCountry}</div>
              </div>
            }
          />
          <div className="flex flex-col">
            <Field
              label="Payment Details"
              content={<div className="text-sm">Payment: per invoice</div>}
            />
          </div>
        </div>

        <Grid container columnSpacing={{ xs: 2 }}>
          <Grid xs={7} item className="border-b">
            <Subtitle>Products offered</Subtitle>
            <div className="mt-4">
              {quote.items.map((item) => {
                return (
                  <div className="flex">
                    {item.product.media?.url && (
                      <img
                        src={item.product.media.url}
                        alt="product-img"
                        style={{
                          objectFit: 'contain',
                        }}
                        className="w-[72px] mr-4"
                      />
                    )}
                    <div className="grow">
                      <div className="text-md font-bold">
                        {item.product.name.en}
                      </div>
                      <div className="text-sm mt-2">
                        <span className="font-bold mr-1">SKU:</span>
                        <span>{item.id}</span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <div className="text-sm">
                          <span className="font-bold mr-1">Quantity:</span>
                          <span>{item.quantity.quantity}</span>
                        </div>
                        <div className="text-md font-medium">
                          {formatCurrency(
                            item.price.currency,
                            item.price.effectiveValue
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Grid>
          <Grid xs={5} item className="p-4">
            <div className="bg-bgWhite p-4 text-md border-gray-600">
              <div className="flex justify-between font-bold border-b pb-4">
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
              <div className="flex justify-between font-bold border-b pb-4">
                <div>Subtotal with VAT</div>
                <div>
                  {formatCurrency(
                    quote.subtotalPrice.currency,
                    quote.subtotalPrice.grossValue
                  )}
                </div>
              </div>
              <div className="flex justify-between font-light mt-4 border-b pb-4">
                <div>Shipping Costs</div>
                <div>
                  {formatCurrency(
                    quote.shippingCost.currency,
                    quote.shippingCost.value
                  )}
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
            {quote.status.value === 'OPEN' && (
              <div className="mt-4">
                <button
                  onClick={handleAcceptQuote}
                  className="w-full text-[16px] leading-[16px] text-center font-semibold h-12 px-6 bg-tinBlue hover:bg-tinBlue text-white"
                >
                  ACCEPT QUOTE
                </button>
                <button
                  onClick={handleDeclineQuote}
                  className="w-full text-[16px] leading-[16px] text-center font-semibold h-12 px-6 bg-lightRed hover:bg-tinBlue text-white mt-4"
                >
                  DECLINE QUOTE
                </button>

                <div className="w-full text-[16px] leading-[16px] text-center font-semibold h-12 px-6 bg-lightGray color-tinBlue mt-4 flex justify-center items-center cursor-not-allowed">
                  CHANGE QUOTE
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default AccountMyOrdersDetails
