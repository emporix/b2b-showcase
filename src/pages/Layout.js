import React, { useEffect, useState } from 'react'
import Drawer from 'components/Utilities/drawer/drawer'
import Cart from 'components/Cart/cart'
import LayoutContext from './context'
import { GridLayout } from 'components/Utilities/common'
import { useDispatch } from 'react-redux'

import { GetAvailability } from 'redux/slices/availabilityReducer'
import InvalidTenant from './InvalidTenant'
import { useAuth } from 'context/auth-provider'
import { useCart } from 'context/cart-provider'
import '../fonts/font.css'
import { useLanguage } from '../context/language-provider'
import {
  getStoryblokApi,
  registerStoryblokBridge,
  StoryblokComponent,
} from '@storyblok/react'

const Layout = ({ children, fromSBPage }) => {
  const { accesstToken, userTenant } = useAuth()
  const { cartAccount } = useCart()
  const [showCart, setShowCart] = useState(false)
  const dispatch = useDispatch()
  const { currentLanguage } = useLanguage()

  const [headerStory, setHeaderStory] = useState()
  const [footerStory, setFooterStory] = useState()

  useEffect(() => {
    if (
      accesstToken === '' ||
      !cartAccount ||
      !Object.keys(cartAccount).length
    ) {
      return
    }
    dispatch(GetAvailability())
  }, [accesstToken, cartAccount, dispatch])


  useEffect(() => {
    const sbParams = {
      version: 'draft',
      resolve_relations: 'global-reference.reference',
      language: currentLanguage,
      fallback_lang: 'default',
      cv: new Date().getTime(),
    }
    const storyblokApi = getStoryblokApi()

    const getStory = (slug, cb) => {
      storyblokApi.get(`cdn/stories/${slug}`, sbParams).then((result) => {
        registerStoryblokBridge(
          result.data.story.id,
          (story) => cb(story),
          {},
        )
        cb(result.data.story)
      })
    }

    if (!fromSBPage) {
      getStory("intern/header", setHeaderStory)
      getStory("intern/footer", setFooterStory)
    }
  }, [currentLanguage])

  return (
    <>
      {userTenant ? (
        <LayoutContext.Provider value={{ showCart, setShowCart }}>
          <GridLayout className="min-w-[375px]">
            {headerStory && <StoryblokComponent blok={headerStory.content} />}
            <Drawer>
              <Cart />
            </Drawer>
            {children}
            {footerStory && <StoryblokComponent blok={footerStory.content} />}
          </GridLayout>
        </LayoutContext.Provider>
      ) : (
        <InvalidTenant />
      )}
    </>
  )
}
export default Layout
