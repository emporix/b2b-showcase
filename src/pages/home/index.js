import React from 'react'
import About from './About'
import Category from './Category'
import Layout from '../Layout'

const Home = () => {
  return (
    <Layout title={'home'}>
      <About />
      <Category />
    </Layout>
  )
}

export default Home
