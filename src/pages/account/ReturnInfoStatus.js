import React, { useMemo } from 'react'
import { IconContext } from 'react-icons'
import { BsFillInfoCircleFill } from 'react-icons/bs'

const statusColor = (status) => {
  switch (status) {
    case 'CLOSED':
      return {
        bg: 'rgba(86, 87, 89, 0.05)',
        textColor: '#565759',
        text: 'Your return has been closed',
      }
    case 'PENDING':
      return {
        bg: 'rgba(255, 168, 0, 0.05)',
        textColor: '#FFA800',
        text: 'Your return request is pending, waiting for approval.',
      }
    case 'APPROVED':
      return {
        bg: 'rgba(3, 128, 243, 0.05)',
        textColor: '#0380F3',
        text: 'Your return has been approved',
      }
    case 'REJECTED':
      return {
        bg: 'rgba(243, 3, 3, 0.01)',
        textColor: '#F30303',
        text: 'We can not approve your return, please contact your sales representative.',
      }
    case 'EXPIRED':
      return {
        bg: 'rgba(243, 3, 3, 0.01)',
        textColor: '#F30303',
        text: 'We can not approve your return, because the return date has expired.',
      }
    // local use only, not a backend status https://emporix.atlassian.net/browse/DRS-74
    case 'INTERNAL_ALREADY_SUBMITTED':
      return {
        bg: 'rgba(243, 3, 3, 0.01)',
        textColor: '#F30303',
        text: 'Return was already submitted, please check under My Returns',
      }

    default:
      return {
        bg: 'rgba(86, 87, 89, 0.05)',
        textColor: '#565759',
        text: 'No valid status for this return',
      }
  }
}

const ReturnInfoStatus = ({ status, className }) => {
  const { bg, textColor, text } = useMemo(() => statusColor(status), [status])
  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        backgroundColor: bg,
        color: textColor,
        height: '48px',
        fontSize: '16px',
        fontStyle: 'normal',
        fontFamily: 'inter',
        borderRadius: '5px',
        borderWidth: '0.5px',
        borderColor: textColor,
        padding: '0 16px',
      }}
    >
      <IconContext.Provider
        value={{
          size: 32,
          color: `${textColor}`,
        }}
      >
        <>
          <BsFillInfoCircleFill />
        </>
      </IconContext.Provider>

      <span className={'ml-6'}>{text}</span>
    </div>
  )
}

export default ReturnInfoStatus
