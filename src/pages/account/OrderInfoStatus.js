import React, { useMemo } from 'react'
import { IconContext } from 'react-icons'
import { BsFillInfoCircleFill } from 'react-icons/bs'

const statusColor = (status) => {
  switch (status) {
    case 'CREATED':
      return {
        bg: 'rgba(255, 168, 0, 0.05)',
        textColor: '#FFA800',
      }
    case 'COMPLETED':
      return {
        bg: 'rgba(3, 128, 243, 0.05)',
        textColor: '#0380F3',
      }
    case 'DECLINED':
      return {
        bg: 'rgba(243, 3, 3, 0.01)',
        textColor: '#F30303',
      }
    default:
      return {
        bg: 'rgba(86, 87, 89, 0.05)',
        textColor: '#565759',
      }
  }
}

const OrderInfoStatus = ({ status, className, message }) => {
  const { bg, textColor } = useMemo(() => statusColor(status), [status])
  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        backgroundColor: bg,
        color: textColor,
        fontSize: '16px',
        fontStyle: 'normal',
        fontFamily: 'inter',
        borderRadius: '5px',
        borderWidth: '0.5px',
        borderColor: textColor,
        padding: '5 16px',
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

      <span className={'ml-6'}>{message.split('.').map((i,key) => {
            return <div key={key}>{i}</div>;
        })}</span>
    </div>
  )
}

export default OrderInfoStatus
