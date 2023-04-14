import React, { useMemo } from 'react'

const statusColor = (status) => {
  switch (status) {
    case 'CLOSED':
      return { bg: 'rgba(86, 87, 89, 0.2)', text: '#565759' }
    case 'PENDING':
      return { bg: 'rgba(255, 168, 0, 0.2)', text: '#FFA800' }
    case 'APPROVED':
      return { bg: 'rgba(75, 203, 103, 0.2)', text: '#4BCB67' }
    case 'REJECTED':
      return { bg: 'rgba(243, 3, 3, 0.2)', text: '#F30303' }
    case 'EXPIRED':
      return { bg: 'rgba(243, 3, 3, 0.2)', text: '#F30303' }
    default:
      return { bg: 'rgba(86, 87, 89, 0.2)', text: '#565759' }
  }
}

const ReturnStatus = ({ status, className }) => {
  const { bg, text } = useMemo(() => statusColor(status), [status])
  return (
    <div
      className={`font-bold uppercase text-center flex justify-center items-center ${className}`}
      style={{
        backgroundColor: bg,
        color: text,
        height: '36px',
        width: '108px',
        fontSize: '10px',
        borderRadius: '18px',
        borderWidth: '1px',
        borderColor: text,
        padding: '0 14px',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: `${text}`,
          borderRadius: '50px',
        }}
      />
      <span>{status}</span>
    </div>
  )
}

export default ReturnStatus
