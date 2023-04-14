import React, { useMemo } from 'react'

const statusColor = (status) => {
  switch (status) {
    case 'ACCEPTED':
      return { bg: 'rgba(75, 203, 103, 0.2)', text: '#4BCB67' }
    case 'DECLINED':
    case 'EXPIRED':
    case 'AWAITING':
      return { bg: 'rgba(255, 168, 0, 0.2)', text: '#FFA800' }
    case 'OPEN':
    case 'CREATING':
    case 'PENDING':
    default:
      return {
        bg: '#5F8FAA',
        text: '#FFFFFF',
      }
  }
}

const QuoteStatus = ({ status, className }) => {
  const resolvedStatus = resolveStatus(status)
  const { bg, text } = useMemo(
    () => statusColor(resolvedStatus),
    [resolvedStatus]
  )
  return (
    <div
      className={`font-bold uppercase text-center flex justify-center items-center ${className}`}
      style={{
        backgroundColor: bg,
        color: text,
        width: '188px',
        height: '36px',
        borderRadius: '18px',
      }}
    >
      {resolvedStatus}
    </div>
  )
}

const resolveStatus = (status) => {
  if (status === 'DECLINED_BY_MERCHANT') {
    return 'DECLINED'
  } else if (status === 'IN_PROGRESS') {
    return 'PENDING'
  }
  return status
}
export default QuoteStatus
