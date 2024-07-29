import React, { useState, createContext, useContext } from 'react'
import About from './About'
import Service from './Service'
import Category from './Category'
import Product from './Product'
import Subscribe from './Subscribe'
import Layout from '../Layout'
import { StoryblokComponent, useStoryblok } from '@storyblok/react'

const Home = () => {
  const story = useStoryblok("/home", { version: 'draft' })

  return (
    <Layout title={'home'}>
      <About />
      <Service />
      <Category />
      <Subscribe />
    </Layout>
  )
}

export default Home
