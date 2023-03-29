import React, { useState, createContext, useContext } from 'react'
import { Container } from '../common'

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
    <div className="progressbar">
      <Container className="progress-container">{children}</Container>
      <ProgressBarContent mobilestyle={mobilestyle} barstyle={barstyle} />
    </div>
  )
}

export const ProgressBarItem = ({ status, title }) => {
  return (
    <div className="progress-bar-item w-full">
      <span>{title}</span>
      <div className="point"></div>
    </div>
  )
}
