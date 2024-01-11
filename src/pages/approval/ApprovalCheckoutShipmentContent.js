import React, { useState } from 'react'
import './approval.css'
import {
  Container,
  DesktopXLContainer,
  GridLayout,
  MobileXLContainer,
} from 'components/Utilities/common'
import {
  Heading4,
  TextBold3,
  TextRegular,
} from 'components/Utilities/typography'
import { MediumPrimaryButton } from 'components/Utilities/button'
import ApprovalShippingContent from './ApprovalShippingContent'
import Address from 'pages/checkout/Address'
import { useApprovalAddress } from './ApprovalAddressProvider'
import approvalService from 'services/approval.service'

const ShipmentAddressContent = ({ selectedAddress }) => {
  return (
    <GridLayout>
      <div className="mb-3">
        <Heading4>Shipment</Heading4>
      </div>
      <Address data={selectedAddress} />
    </GridLayout>
  )
}
const ShipmentDeliveryContent = ({
  selectedDeliveryWindow,
  selectedDeliveryMethod,
}) => {
  return (
    <GridLayout className="gap-6 !h-18">
      <div className='flex-container'>
        <div className="mb-6">
          <TextBold3>Estimated Delivery:</TextBold3>{' '}
          {selectedDeliveryWindow && (
            <TextRegular>
              {selectedDeliveryWindow.deliveryDayLabel}{' '}
              {selectedDeliveryWindow.deliveryTimeLabel}
            </TextRegular>
          )}
        </div>
        <TextBold3>Delivery Method:</TextBold3>{' '}
        {selectedDeliveryMethod && (
          <TextRegular>{selectedDeliveryMethod.id}</TextRegular>
        )}
      </div>
    </GridLayout>
  )
}

const ShipmentContent = () => {
  const {
    selectedDeliveryWindow,
    selectedDeliveryMethod,
    selectedAddress,
    approval,
  } = useApprovalAddress()
  const [isEditShippingMode, setEditShippingMode] = useState(false)

  const handleEditShipping = () => {
    setEditShippingMode(true)
  }

  const handleUpdateShipping = () => {
    setEditShippingMode(false)
    approvalService.updateDeliveryWindow(approval.id, selectedDeliveryWindow)
  }

  const handleDeclineShippingChange = () => {
    setEditShippingMode(false)
  }

  return (
    (
      <GridLayout className="gap-12 flex-container">
        <DesktopXLContainer>
          {!isEditShippingMode && (
            <Container className="gap-12">
              <ShipmentAddressContent selectedAddress={selectedAddress} />
              <ShipmentDeliveryContent
                selectedDeliveryWindow={selectedDeliveryWindow}
                selectedDeliveryMethod={selectedDeliveryMethod}
              />
              <div className='approval-shipment-edit-wrapper'>
              <MediumPrimaryButton
                className="cta-button bg-yellow"
                title="EDIT"
                onClick={handleEditShipping}
              />
              </div>
            </Container>
          )}
          {isEditShippingMode && (
            <Container className="gap-12">
              <div className='flex-container'>
                <ApprovalShippingContent className="gap-12" />
                <MediumPrimaryButton
                  className="cta-button bg-yellow approval-shipment-button"
                  title="CONFIRM"
                  onClick={handleUpdateShipping}
                />
                <MediumPrimaryButton
                className="cta-button gray-button approval-shipment-button"
                title="DECLINE"
                onClick={handleDeclineShippingChange}
              />
              </div>
            </Container>
          )}
        </DesktopXLContainer>
      </GridLayout>
    )
  )
}

export default ShipmentContent
