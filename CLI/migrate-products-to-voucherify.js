const { VoucherifyServerSide } = require('@voucherify/sdk')
const fetch = require('node-fetch')
const { TENANT } = require('../src/constants/localstorage')
require('dotenv').config()

const getEmporixAPIAccessToken = async () => {
  const formData = {
    client_id: process.env.REACT_APP_EMPORIX_CLIENT_ID,
    client_secret: process.env.REACT_APP_EMPORIX_CLIENT_SECRET,
    grant_type: 'client_credentials',
  }
  const responseRaw = await fetch(
    `${process.env.REACT_APP_API_URL}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    }
  )
  if (responseRaw.status !== 200) {
    throw {
      error: 'Could not get access token',
    }
  }
  const { access_token } = await responseRaw.json()
  if (!access_token) {
    throw 'could not get Emporix access token'
  }
  return access_token
}

const getProducts = async (page, emporixAccessToken) => {
  const resultRaw = await fetch(
    `${process.env.REACT_APP_API_URL}/product/${localStorage.getItem(
      TENANT
    )}/products?pageNumber=${page}`,
    {
      method: 'Get',
      headers: {
        Authorization: `Bearer ${emporixAccessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )
  if (resultRaw.status !== 200) {
    throw 'could not get products'
  }
  return await resultRaw.json()
}

;(async () => {
  const emporixAccessToken = await getEmporixAPIAccessToken()
  let productNumber = 1
  let page = 1
  let products = []
  const voucherifyClient = VoucherifyServerSide({
    applicationId: process.env.REACT_APP_VOUCHERIFY_APP_ID,
    secretKey: process.env.REACT_APP_VOUCHERIFY_SECRET_KEY,
    apiUrl: process.env.REACT_APP_VOUCHERIFY_API_URL,
  })
  do {
    products = await getProducts(page, emporixAccessToken)
    for (const product of products) {
      const name =
        product.name?.en || product.name instanceof Object
          ? Object.entries(product.name)?.[0]?.[1]
          : undefined
      const productCreated = await voucherifyClient.products.create({
        name,
        source_id: product.id,
        metadata: {
          description: product.description,
        },
        image_url: product.media?.[0]?.url,
      })
      if (productCreated) {
        console.log(`Product ${productNumber} created successfully`)
        productNumber++
      }
    }
    page++
  } while (products.length !== 0)
})()
