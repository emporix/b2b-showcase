import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  menu: [
    {
      contentfulFieldName: 'catalogLabel',
      title: 'Shop',
      items: [],
    },
    {
      contentfulFieldName: 'brandLabel',
      title: 'Brands',
      items: [],
      url: 'brand',
    },
    {
      contentfulFieldName: 'quickOrderLabel',
      title: 'Quick Order',
      items: [],
      url: 'quick_order',
    },
    {
      contentfulFieldName: 'aboutUsLabel',
      title: 'About Us',
      items: [],
      url: 'aboutus',
    },
  ],
  tenantList: [],
}

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setShopItems: (state, action) => {
      state.menu[0]['items'] = action.payload
    },
    setTenantList: (state, action) => {
      state.tenantList[action.payload.tenant] = action.payload.tenant
    },
  },
})
// The Page Reducer
export default pageSlice.reducer
// The Page Actions.
export const { setShopItems, setTenantList } = pageSlice.actions

export const putShopItems = (items) => async (dispatch) => {
  dispatch(setShopItems(items))
}
// The Page Selector
export const pageMenuSelector = (state) => state.page.menu
export const tenantListSelector = (state) => state.page.tenantList
