import './approval.css'
import {
  CurrencyBeforeValue,
  DesktopMDContainer,
  GridLayout,
  LayoutBetween,
  MobileMDContainer,
} from 'components/Utilities/common'
import ApprovalShippingMethod from './ApprovalShippingMethod'
import {
  Heading3,
  TextRegular3,
  Underline,
} from 'components/Utilities/typography'
import { DropdownWithLabel } from 'components/Utilities/dropdown'
import { RadioGroup } from 'components/Utilities/radio'
import Address from 'pages/checkout/Address'
import { useApprovalAddress } from 'pages/approval/ApprovalAddressProvider'

const ApprovalShippingContent = () => {
  const {
    locations,
    addresses,
    selectedAddress,
    setSelectedAddress,
    defaultAddress,
    shippingMethods,
    setSelectedDeliveryMethod,
    setSelectedShippingMethod,
  } = useApprovalAddress()

  const onShippingChange = (value) => {
    const selectedShippingMethod = shippingMethods.filter(
      (method) => method.id === value
    )[0]
    setSelectedShippingMethod(selectedShippingMethod)
    setSelectedDeliveryMethod(selectedShippingMethod)
  }

  return (
    <>
      <GridLayout className="gap-12 border rounded border-quartz p-10 margin-bottom">
        <GridLayout className="gap-12">
          <DesktopMDContainer>
            <LayoutBetween className="items-center">
              <Heading3>Shipping Details</Heading3>
            </LayoutBetween>
          </DesktopMDContainer>
          <MobileMDContainer>
            <GridLayout className="gap-12  border rounded border-quartz p-6">
              <Heading3>Shipping Details</Heading3>
            </GridLayout>
          </MobileMDContainer>
        </GridLayout>

        <GridLayout className="gap-12">
          <DropdownWithLabel
            label="Location"
            options={locations}
            defaultValue={defaultAddress}
            onChange={(e) => {
              const addressId = e[0].value
              const address = addresses.find(
                (address) => address.id === addressId
              )
              if (address !== undefined) {
                setSelectedAddress(address)
              }
            }}
          />
          {addresses.length === 0 && (
            <GridLayout className="text-xs text-red-600 text-center">
              Must have at least one address to finalise your order
            </GridLayout>
          )}
          <GridLayout className="location-info">
            {selectedAddress && <Address data={selectedAddress} />}
          </GridLayout>
        </GridLayout>
      </GridLayout>

      <GridLayout className="gap-12 border rounded border-quartz p-6">
        <GridLayout className="gap-8">
          <Heading3>Shipping Method</Heading3>
          <MobileMDContainer>
            <TextRegular3>
              <Underline>Ship to multiple addresses</Underline>
            </TextRegular3>
          </MobileMDContainer>
          <RadioGroup>
            {shippingMethods.map((method) => {
              return (
                <ApprovalShippingMethod
                  key={method.id}
                  radioKey={method.id}
                  shippingmode={method.id}
                  date="Monday, June 6 - Tuesday June 7"
                  price={
                    method.fee === 0 ? (
                      'Free'
                    ) : (
                      <CurrencyBeforeValue value={method.grossFee} />
                    )
                  }
                  onClick={onShippingChange}
                />
              )
            })}
          </RadioGroup>
        </GridLayout>
      </GridLayout>
    </>
  )
}

export default ApprovalShippingContent
