import React, { useEffect, useState } from 'react'
import Topbar from 'components/Header/topbar'
import Drawer from 'components/Utilities/drawer/drawer'
import Cart from 'components/Cart/cart'
import LayoutContext from './context'
import { GridLayout } from 'components/Utilities/common'
import { useDispatch } from 'react-redux'

import { GetAvailability } from 'redux/slices/availabilityReducer'
import InvalidTenant from './InvalidTenant'
import { useAuth } from 'context/auth-provider'
import { useCart } from 'context/cart-provider'
import Content from './home/Content'
import { CMSFilterType, ContentPageMapping } from 'services/content/filteredPage.service'

const Layout = ({ children, title }) => {
  const { accesstToken, userTenant } = useAuth()
  const { cartAccount } = useCart()
  const [showCart, setShowCart] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (accesstToken === '' || !cartAccount || !Object.keys(cartAccount).length) {
      return
    }
    dispatch(GetAvailability())
  }, [accesstToken, cartAccount])

  return (
    <>
      {userTenant ? (
        <LayoutContext.Provider value={{ showCart, setShowCart }}>
          <GridLayout className="min-w-[375px]">
            <Topbar title={title} />
            <Drawer>
              <Cart />
            </Drawer>
            {children}
            <Content type={CMSFilterType.NAME} page={ContentPageMapping.footer} />
          </GridLayout>
        </LayoutContext.Provider>
      ) : (
        <InvalidTenant />
      )}
    </>
  )
}
export default Layout
