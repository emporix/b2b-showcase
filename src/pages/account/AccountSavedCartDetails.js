import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/auth-provider'
import { CircularProgress, Grid } from '@material-ui/core'
import AccountMenu from './AccountMenu'
import { formatDateTime } from '../../components/Utilities/common'
import { formatCurrency } from 'helpers/currency'
import approvalService from 'services/approval.service'
import { renderStatus } from './AccountSavedCarts'
import { calculateTax } from 'services/product/tax.service'

const Subtitle = ({ children }) => {
  return <div className="text-black text-md font-bold">{children}</div>
}

const Separator = ({ className }) => {
  return <div className={`bg-[#D7DADE] h-[1px] w-full ${className}`}></div>
}

const Field = ({ label, content, className }) => {
  return (
    <div className={className}>
      <Subtitle>{label}</Subtitle>
      {content}
    </div>
  )
}

const AccountSavedCartDetails = () => {
  const { userTenant } = useAuth()
  const { approvalId } = useParams()
  const [approval, setApproval] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState()
  const [billingAddress, setBillingAddress] = useState()
  const [shippingCost, setShippingCost] = useState(0)

  const getApproval = useCallback(async () => {
    try {
      setIsLoading(true)
      const approvalRequest = await approvalService.getApproval(approvalId)
      setAddresses(approvalRequest)
      setApproval(approvalRequest)
    } finally {
      setIsLoading(false)
    }
  }, [userTenant, approvalId])

  const calculateGrossShipping = useCallback(async () => {
    const grossShippingCost = await calculateTax(
      approval?.details?.shipping?.amount,
      approval?.details?.shipping?.shippingTaxCode,
      shippingAddress?.country
    )
    setShippingCost(grossShippingCost)
  }, [shippingAddress, approval])

  useEffect(() => {
    getApproval()
  }, [])

  useEffect(() => {
    calculateGrossShipping()
  }, [shippingAddress])

  const setAddresses = (approval) => {
    const shipping = approval.details.addresses.find(
      (element) => element.type === 'SHIPPING'
    )
    const billing = approval.details.addresses.find(
      (element) => element.type === 'BILLING'
    )
    setShippingAddress(shipping)
    setBillingAddress(billing ? billing : shipping)
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CircularProgress />
      </div>
    )
  }

  if (!isLoading && !approval) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-2xl font-bold">Error </div>
      </div>
    )
  }

  return (
    approval && (
      <div className="flex">
        <div className="w-[320px] mr-2">
          <AccountMenu page="All Saved Carts" />
        </div>
        <div className="grow">
          <div className="text-[#214559] text-2xl font-bold mb-8">
            My saved carts
          </div>
          <Separator />
          <div className="text-black text-xl mt-12 font-bold">
            <span className="mr-2">Approval ID</span>
            {approvalId}
          </div>
          <div container className="mt-8 grid grid-cols-6 mb-6">
            <div className="text-sm font-bold">Date</div>
            <div className="text-sm font-bold">Requestor</div>
            <div className="text-sm font-bold">Valid Until</div>
            <div className="text-sm font-bold">Approver</div>
            <div className="text-sm font-bold">Status</div>
          </div>
          <Separator />
          <div container className="mt-6 mb-6 grid grid-cols-6">
            <div className="text-md flex items-center">
              {formatDateTime(approval.metadata.createdAt)}
            </div>
            <div className="text-md flex items-center">
              {`${approval.requestor.firstName} ${approval.requestor.lastName}`}
            </div>
            <div className="text-md flex items-center">
              {formatDateTime(approval.expiryDate)}
            </div>
            <div className="text-md flex items-center">
              {`${approval.approver.firstName} ${approval.approver.lastName}`}
            </div>
            <div className="flex items-center">
              {renderStatus(approval.status)}
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
                  <div className="my-2">{shippingAddress.contactName}</div>
                  <div className="my-2">{`${shippingAddress.street} ${shippingAddress.streetNumber}`}</div>
                  <div className="my-2">{`${shippingAddress.zipCode} ${shippingAddress.city}`}</div>
                  <div className="my-2">{shippingAddress.country}</div>
                </div>
              }
            />
            <Field
              label="Billing Address"
              content={
                <div className="text-sm">
                  <div className="my-2">{billingAddress.contactName}</div>
                  <div className="my-2">{`${billingAddress.street} ${billingAddress.streetNumber}`}</div>
                  <div className="my-2">{`${billingAddress.zipCode} ${billingAddress.city}`}</div>
                  <div className="my-2">{billingAddress.country}</div>
                </div>
              }
            />

            <div className="flex flex-col">
              <Field
                label="Payment Details"
                content={
                  <div className="text-sm my-2">Payment: per invoice</div>
                }
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
                {approval.resource.items.map((product) => {
                  return (
                    <>
                      <div className="grid grid-cols-12 my-4 h-[122px]">
                        <div className="col-span-2 flex justify-center items-center">
                          {product.media?.url && (
                            <img
                              src={product.media.url}
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
                              {product.name}
                            </div>
                            <div className="text-sm mt-2">
                              <span className="font-bold mr-1">SKU:</span>
                              <span>{product.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm col-span-2 flex justify-center items-center">
                          <span className="text-md font-medium">
                            {product.quantity}
                          </span>
                        </div>
                        <div className="col-span-2 flex justify-center items-center">
                          <span className="text-md font-medium">
                            {formatCurrency(
                              product.itemPrice.currency,
                              product.itemPrice.amount
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
                      approval.details.currency,
                      approval.resource.subtotalAggregate.netValue
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-light mt-4 pb-4">
                  <div>{`VAT of ${formatCurrency(
                    approval.details.currency,
                    approval.resource.subtotalAggregate.grossValue
                  )}`}</div>
                  <div>
                    {formatCurrency(
                      approval.details.currency,
                      approval.resource.subtotalAggregate.taxValue
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-bold border-b border-[#D7D7D7] pb-4">
                  <div>Subtotal with VAT</div>
                  <div>
                    {formatCurrency(
                      approval.details.currency,
                      approval.resource.subtotalAggregate.grossValue
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-light mt-4 border-b border-[#D7D7D7] pb-4">
                  <div>Shipping Costs</div>
                  <div>
                    {formatCurrency(
                      approval.details.currency,
                      shippingCost
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 pb-32">
                  <div>Total Price</div>
                  <div>
                    {formatCurrency(
                      approval.resource.totalPrice.currency,
                      approval.resource.subtotalAggregate.grossValue + shippingCost
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  )
}

export default AccountSavedCartDetails
