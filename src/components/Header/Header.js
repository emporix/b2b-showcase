import React from 'react'
import Navbar from './Navbar'
import './topbar.css'
import Menu from './Menu'

const Header = ({ blok }) => {
  return (
    <>
      <Navbar blok={blok}/>
      <Menu blok={blok} />
    </>
  )
}

export default Header
