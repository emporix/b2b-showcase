import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  menu: [
    {
      title: 'catalog',
      items: [],
    },
    {
      title: 'Inhalt',
      items: [],
    },
    {
      title: 'news',
      items: [],
      url: 'news',
    },
    {
      title: 'Storefinder',
      items: [],
      url: 'storefinder',
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
    setNavigation: (state, action) => {
      state.menu[1]['items'] = action.payload
      state.menu[1]['title'] = action.payload[0].title
    },
  },
})

// The Page Reducer
export default pageSlice.reducer

// The Page Actions.
export const { setShopItems, setTenantList, setNavigation } = pageSlice.actions

export const putShopItems = (items) => async (dispatch) => {
  dispatch(setShopItems(items))
}

export const putCmsNavigation = (navigation) => async (dispatch) => {
  dispatch(setNavigation(navigation))
}

// The Page Selector
export const pageMenuSelector = (state) => state.page.menu
export const tenantListSelector = (state) => state.page.tenantList
