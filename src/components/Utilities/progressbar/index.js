import React, { useState, createContext, useContext } from 'react'
import { Container } from '../common'
import shipping from '../../../assets/shipping.svg'
import shippingGreen from '../../../assets/shipping_green.svg'
import order from '../../../assets/order.svg'
import orderGreen from '../../../assets/order_green.svg'
import payment from '../../../assets/payment.svg'
import paymentGreen from '../../../assets/payment_green.svg'

import './progressbar.css'

const ProgressBarContent = ({ barstyle, mobilestyle }) => {
  return (
    <div className="w-full">
      <div className="w-full main-bar"></div>
      <div style={barstyle} className="progress-bar md:block hidden"></div>
      <div style={mobilestyle} className="progress-bar md:hidden"></div>
    </div>
  )
}

export const ProgressBar = ({ children, active, className }) => {
  const status = children.map((node) => node.props.status)
  const active_index =
    status.indexOf(active) >= 0
      ? (status.indexOf(active) + 0.5) / status.length
      : 0
  const barstyle = {
    width: active_index ? `calc(27px + (100% - 48px)*${active_index})` : '',
  }
  const mobilestyle = {
    width: active_index ? `calc(3px + 100% * ${active_index})` : '',
  }

  return (
    <div className="progressbar mb-12">
      <Container className="progress-container">{children}</Container>
      <ProgressBarContent mobilestyle={mobilestyle} barstyle={barstyle} />
    </div>
  )
}

export const ProgressBarItem = ({ status, title, activeTab }) => {
  const iconIsGreen = status === activeTab
  let icons = {}
  console.log('status === active: ', status === activeTab)
  if (activeTab === 'shipping') {
    icons = {
      shipping: shippingGreen,
      payment: iconIsGreen ? paymentGreen : payment,
      'review order': iconIsGreen ? orderGreen : order,
    }
  } else if (activeTab === 'payment') {
    icons = {
      shipping: shippingGreen,
      payment: iconIsGreen ? paymentGreen : payment,
      'review order': iconIsGreen ? orderGreen : order,
    }
  } else if (activeTab === 'review_order') {
    icons = {
      shipping: shippingGreen,
      payment: paymentGreen,
      'review order': orderGreen,
    }
  }

  return (
    <div className="progress-bar-item w-full">
      <img
        src={icons[title.toLowerCase()]}
        className={`progress-bar_icons`}
        text
        alt={title}
      />
      <span>{title}</span>
      {/* <div className="point"></div> */}
    </div>
  )
}
