import React, { useState } from 'react'
import { DropdownWithLabel } from 'components/Utilities/dropdown'
import { useApprovalAddress } from 'pages/approval/ApprovalAddressProvider'
import './approval.css'

const transformDeliveryWindow = (deliveryWindow) => {
  if (!deliveryWindow || !deliveryWindow.id || !deliveryWindow.deliveryDate) {
    return null
  }
  const dateObj = new Date(deliveryWindow.deliveryDate)
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const dayName = dayNames[dateObj.getUTCDay()]
  return {
    value: {
      value: {
        id: deliveryWindow.id,
        slotId: deliveryWindow.slotId,
        deliveryDate: deliveryWindow.deliveryDate,
        deliveryDayLabel: `${dayName} ${dateObj.toLocaleDateString()}`,
        deliveryTimeLabel: `${deliveryWindow.deliveryTimeRange.startTime} - ${deliveryWindow.deliveryTimeRange.endTime}`,
      },
      label: `${deliveryWindow.deliveryTimeRange.startTime} - ${deliveryWindow.deliveryTimeRange.endTime}`,
    },
    label: `${dayName} ${dateObj.toLocaleDateString()}`,
    date: dateObj,
  }
}

const ApprovalDeliveryWindow = ({ sitesDeliveryWindows }) => {
  const [possibleTimes, setPosibleTimes] = useState([])
  const { setSelectedDeliveryWindow } = useApprovalAddress()

  const groupDeliverySlots = (deliveryWindows) => {
    const groupedDeliveryWindows = deliveryWindows
      .map(transformDeliveryWindow)
      .reduce((group, item) => {
        group[item.label] = group[item.label] ?? []
        group[item.label].push(item)
        return group
      }, {})
    return Object.keys(groupedDeliveryWindows)
      .map((key) => ({
        label: key,
        value: groupedDeliveryWindows[key],
      }))
      .sort((a, b) => a.value.date - b.value.date)
  }

  const validDeliveryWindows = groupDeliverySlots(sitesDeliveryWindows)

  const formatPossibleTimes = (possibleTimes) => {
    return possibleTimes.map((time) => time.value)
  }

  return (
    <div className="flex justify-between w-full">
      <div className="flex-auto" style={{ marginRight: '20px' }}>
        <DropdownWithLabel
          label="Delivery Day"
          options={validDeliveryWindows}
          onChange={(e) => {
            setPosibleTimes(e[0].value)
          }}
        />
      </div>
      <div className="flex-auto" style={{ marginLeft: '20px' }}>
        <DropdownWithLabel
          label="Delivery Time"
          options={formatPossibleTimes(possibleTimes)}
          onChange={(e) => {
            setSelectedDeliveryWindow(e[0].value)
          }}
        />
      </div>
    </div>
  )
}

export default ApprovalDeliveryWindow
