import React, { useState, createContext, useContext } from 'react'
import About from './About'
import Service from './Service'
import Category from './Category'
import Product from './Product'
import Subscribe from './Subscribe'
import Layout from '../Layout'
import Content from './Content'

const Home = () => {
  return (
    <Layout title={'home'}>
      <Content />
      <About />
      <Service />
      <Category />
      <Subscribe />
    </Layout>
  )
}

export default Home
