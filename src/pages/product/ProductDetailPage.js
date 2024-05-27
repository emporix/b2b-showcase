import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import ReactStars from 'react-stars'
import Quantity from '../../components/Utilities/quantity/quantity'
import Product from '../../components/Product/product'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import SliderComponent from '../../components/Utilities/slider'
import Accordion, { AccordionItem } from '../../components/Utilities/accordion'

import LayoutContext from '../context'
import { homeUrl, productSchemaApi, productUrl } from '../../services/service.config'

import { LargePrimaryButton } from '../../components/Utilities/button'
import { CurrencyBeforeComponent, CurrencyBeforeValue } from 'components/Utilities/common'
import { ProductVariants } from './ProductVariants'
import { PriceTierValues } from './VariantAccordion'
import { useCart } from 'context/cart-provider'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { useLanguage } from 'context/language-provider'
import productService from '../../services/product/product.service'
import priceService from '../../services/product/price.service'
import { useNavigate } from 'react-router-dom'
import { ProductConfiguration } from './ProductConfiguration'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Content from 'pages/home/Content'
import { CMSFilterType } from 'services/content/filteredPage.service'
import { useTranslation } from 'react-i18next'
import { ACCESS_TOKEN } from '../../constants/localstorage'
import ApiRequest from '../../services'
import i18next from 'i18next'

const ProductContext = createContext()
export const i18nProductCustomAttributesNS = 'productCustomAttributes'
export const i18nPCADescriptionSuffix = '_desc'

const Bold = ({ children }) => {
  return <div className="font-bold">{children}</div>
}
const ProductDetailCategoryCaptionBar = ({ category }) => {
  const categoryTree = [{ caption: 'Home', link: homeUrl() }]
  let lnk = productUrl()
  for (let c in category) {
    lnk = `${lnk}/${category[c].toLowerCase().replaceAll(' ', '_')}`
    categoryTree.push({ caption: category[c], link: lnk })
  }
  return (
    <div className="product-detail-category-caption-bar">
      <Breadcrumbs className="lg:block hidden" separator=">" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            <Typography key={index} className="breadcrumb-item" color="text.primary">
              {row.caption}
            </Typography>
          ) : (
            <Link key={index} className="breadcrumb-item" underline="hover" color="inherit" href={row.link}>
              {index !== categoryTree.length - 1 ? row.caption : <Bold>{row.caption}</Bold>}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs className="lg:hidden md:block hidden" separator=">" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            ''
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={index === categoryTree.length - 2 ? 'text.primary' : 'inherit'}
              href="/"
            >
              {row.caption}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs className="md:hidden" separator=">" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return categoryTree.length - index > 1 && categoryTree.length - index < 4 ? (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={index === categoryTree.length - 1 ? 'text.primary' : 'inherit'}
              href="/"
            >
              {row.caption}
            </Link>
          ) : (
            ''
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

const ProductImage = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.src || '')
  const [subImages] = useState([product.src || '', ...product.subImages])

  const handleImageClick = (clickedImage) => {
    setMainImage(clickedImage)
  }

  return (
    <div className="product-detail-image-content">
      <div className="product-detail-main-image rounded-3xl standard_box_shadow p-4">
        <img src={mainImage} alt="product" className="w-full rounded-2xl" />
      </div>
      <div className="product-detail-sub-images rounded-3xl standard_box_shadow">
        {subImages.map((link, index) => {
          return (
            <div
              key={index}
              className="rounded-2xl product-detail-sub-image-item flex items-center"
              onClick={() => handleImageClick(link)}
            >
              <img src={`${link}`} alt="product_" className="w-full m-auto items-center rounded-2xl" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
const ProductSkuAndReview = ({ product }) => {
  return (
    <div className="flex justify-between items-end">
      <div className="sku-info">
        SKU:&nbsp;&nbsp;<span className="sku">{product.code}</span>
      </div>
      <div className="reviews-info">
        <div className="lg:flex">
          <div className="flex float-right lg:float-left">
            <ReactStars size={16} value={product.rating} color2={'#FBB13C'} className="reviews-star" />({product.count})
          </div>
        </div>
      </div>
    </div>
  )
}
const ProductTitle = ({ name }) => {
  const { getLocalizedValue } = useLanguage()
  return <div className="mt-6 product-title text-left w-full text-eerieBlack font-light">{getLocalizedValue(name)}</div>
}
const ProductPriceAndAmount = ({ price, productCount, estimatedDelivery }) => {
  const { isLoggedIn } = useAuth()

  return (
    <div className="product-price-and-amount-wrapper">
      <div className="product-price-wrapper flex gap-4 items-end">
        {price !== '' ? (
          <>
            <div className="product-price">
              <CurrencyBeforeValue value={price} />
            </div>
            <div className="vat-caption">{isLoggedIn ? 'Excl. VAT' : 'Incl. VAT'}</div>
          </>
        ) : (
          <></>
        )}
        {price !== null ? (
          <div className="list-price desktop-sm">
            {isLoggedIn ? 'Your negotiated price' : 'List Price'}{' '}
            <CurrencyBeforeComponent>
              <del>{price}</del>
            </CurrencyBeforeComponent>
          </div>
        ) : (
          <span className="desktop-sm text-xs  text-primaryBlue font-bold">No Price</span>
        )}
      </div>

      <div className="product-amount-wrapper flex mt-6 space-x-6 items-center">
        <span className="product-number">{productCount} in Stock</span>
        <span className="delivery-date">Estimated Delivery {estimatedDelivery}</span>
      </div>
    </div>
  )
}
const ProductBasicInfo = ({ product }) => {
  const { isLoggedIn } = useAuth()
  const price = useMemo(() => {
    return formatPrice(product, isLoggedIn)
  }, [isLoggedIn, product])
  return (
    <div className="product-basic-info-wrapper hidden lg:flex flex-col gap-4">
      <ProductSkuAndReview product={product} />
      <ProductTitle name={product.name} />
      {product.productType !== 'PARENT_VARIANT' && (
        <ProductPriceAndAmount
          price={price}
          productCount={product.product_count}
          estimatedCelivery={product.estimated_delivery}
        />
      )}
    </div>
  )
}

const ProductBundleInfo = ({ product }) => {
  const { getLocalizedValue } = useLanguage()
  const [bundledProducts, setBundledProducts] = useState([])

  useEffect(() => {
    ;(async () => {
      const bundledProductsIds = product.bundledProducts.map((i) => i.productId)
      const products = await productService.getProductsWithIds(bundledProductsIds)
      const prices = await priceService.getPriceWithProductIds(bundledProductsIds)
      const res = products.map((p) => {
        const price = prices.filter((i) => i.itemId.id === p.id)[0]
        const amount = product.bundledProducts.filter((prod) => prod.productId === p.id)[0]
        return {
          product: p,
          price: price,
          amount: amount.amount,
        }
      })
      setBundledProducts(res)
    })()
  }, [product])

  return (
    <>
      <div className="product-match-caption w-full" style={{ paddingBottom: 0 }}>
        Bundled products
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity In Bundle</TableCell>
              <TableCell>Price item</TableCell>
              <TableCell>Price total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bundledProducts &&
              bundledProducts.map((bundledProduct) => (
                <TableRow key={bundledProduct.product.code} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {bundledProduct.product.media && bundledProduct.product.media.length > 0 && (
                      <img src={bundledProduct.product.media[0].url} className="w-fit h-8" />
                    )}
                  </TableCell>
                  <TableCell>{bundledProduct.product.code}</TableCell>
                  <TableCell>{getLocalizedValue(bundledProduct.product.name)}</TableCell>
                  <TableCell>{bundledProduct.amount}</TableCell>
                  <TableCell>
                    <CurrencyBeforeValue
                      value={bundledProduct.price.effectiveValue}
                      currency={bundledProduct.price.currency}
                    />
                  </TableCell>
                  <TableCell>
                    <CurrencyBeforeValue
                      value={bundledProduct.price.effectiveValue * bundledProduct.amount}
                      currency={bundledProduct.price.currency}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const ProductAddToCart = () => {
  const product = useContext(ProductContext)
  const { setShowCart } = useContext(LayoutContext)
  const [quantity, setQuantity] = useState(1)
  const { syncCart, putCartProduct } = useCart()
  const HandleProductAddToCart1 = useCallback((product, action, quantitiy) => {
    let newProduct = { ...product }
    newProduct.quantity = quantitiy
    putCartProduct(newProduct)
    action(true)
  }, [])

  const increaseQty = () => {
    setQuantity((prevState) => prevState + 1)
  }

  const decreaseQty = () => {
    if (quantity <= 1) return
    setQuantity((prevState) => prevState - 1)
  }

  return (
    <div className="product-add-to-cart-wrapper lg:py-12">
      <div className="quantity">
        Quantity
        <Quantity
          value={quantity}
          increase={increaseQty}
          decrease={decreaseQty}
          onChange={(value) => {
            setQuantity(value)
          }}
          left
        />
      </div>
      <div className="">
        <LargePrimaryButton
          disabled={!product.price}
          className="product-add-to-cart-btn cta-button bg-yellow !text-aliceBlue !text-lg"
          onClick={() => HandleProductAddToCart1(product, setShowCart, quantity)}
          title="ADD TO CART"
        />
      </div>
    </div>
  )
}
const ProductDiscount = ({ price, quantity }) => {
  return (
    <div className="product-discount-wrapper pt-12 gap-6 ">
      <div className="product-discount-caption">Quantity Discount</div>
      <PriceTierValues sx={{ borderRight: '1px solid #DFE1E5' }} price={price} quantity={quantity}></PriceTierValues>
    </div>
  )
}
const ProductInfo = ({ product }) => {
  return (
    <>
      <ProductBasicInfo product={product} />
      {product.productType !== 'PARENT_VARIANT' && (
        <>
          <ProductAddToCart />
          <ProductDiscount price={product.price} quantity={product.product_count} />
        </>
      )}
    </>
  )
}

const ProductContent = ({ product, brand, labels }) => {
  let price = '',
    listPrice = ''
  if (product.price !== undefined) {
    listPrice = Math.trunc(product.price.totalValue * 100) / 100
    price = listPrice
    if (product.price.priceModel !== undefined && product.price.priceModel.includesTax === false) {
      price = Math.trunc((price * 10000) / (100 + product.price.tax.taxRate)) / 100
    }
  }

  return (
    <ProductContext.Provider value={product}>
      <div className="product-content-wrapper">
        <div className="mobile-lg">
          <ProductSkuAndReview product={product} />
          <ProductTitle name={product.name} />
        </div>
        <div className="product-image-wrapper">
          <ProductImage product={product} />{' '}
          <div className="grid grid-cols-2 mt-2">
            <div className="flex flex-col">
              {brand && (
                <>
                  <div>Brands</div>
                  <img src={brand.image} alt={brand.name} className="w-fit h-8" />
                </>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2">
                {labels && labels.length > 0 && <div>Labels</div>}
                {labels.map((label) => {
                  return <img src={label.image} alt={label.name} className="w-fit h-8" />
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-price-and-amount-wrapper">
          <ProductPriceAndAmount
            price={price}
            listPrice={listPrice}
            product_count={product.product_count}
            estimated_delivery={product.estimated_delivery}
          />
        </div>
        <div className="product-info-wrapper">
          <ProductInfo product={product} />
        </div>
      </div>
    </ProductContext.Provider>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ProductDetailsTabContent = ({ product }) => {
  const { currentLanguage } = useLanguage()
  const getFeatureName = (str) => {
    let loop = 0
    let res = ''
    let flg = false
    while (loop < str.length) {
      if (loop === 0) res += str[loop].toUpperCase()
      else {
        if (!isNaN(str[loop] * 1)) res += str[loop]
        else {
          if (str[loop] === '_') flg = true
          else {
            if (flg === true || str[loop] === str[loop].toUpperCase()) res += ' ' + str[loop].toUpperCase()
            else res += str[loop]
            flg = false
          }
        }
      }
      loop++
    }
    return res
  }
  const ensureAttributeNameTranslationIsPresent = async (lang) => {
    if (i18next.hasResourceBundle(lang, i18nProductCustomAttributesNS)) {
      return
    }

    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      'Accept-Language': lang,
    }
    const res = await ApiRequest(productSchemaApi(), 'get', {}, headers, {})
    if (res.status !== 200) {
      return
    }

    const data = res.data[0]

    //reflect https://api.emporix.io/schema/n11showcase/schemas to i18next resource
    const resource = {}
    resource[data.id] = data.name[lang]
    data.attributes.forEach((a) => {
      resource[a.key] = a.name[lang]
      resource[a.key + i18nPCADescriptionSuffix] = a.description[lang]
    })
    i18next.addResourceBundle(lang, i18nProductCustomAttributesNS, resource, false, true)
    i18next.changeLanguage(lang)
  }

  useEffect(() => {
    ensureAttributeNameTranslationIsPresent(currentLanguage)
  }, [currentLanguage])

  const getAttributes = (items) => {
    let res = []
    Object.keys(items).forEach((key) => {
      let value = items[key]

      if (Array.isArray(value) && currentLanguage === 'en') value = value[1].value
      else if (Array.isArray(value) && currentLanguage === 'de') value = value[0].value
      else if (typeof value === 'string') value = items[key]
      else value = ''

      res.push({ property: key, value: value })
    })
    return res
  }
  return (
    <div className="product-details-tab-content-wrapper">
      <div className="grid grid-cols-1 gap-12">
        {Object.keys(product.mixins ? product.mixins : []).map((key) => {
          return <ProductInfoPortal key={key} caption={key} items={getAttributes(product.mixins[key])} />
        })}
      </div>
    </div>
  )
}

const ProductDetailTabContent = ({ product }) => {
  const [tab, setTab] = React.useState(0)

  const handleChange = (event, tab) => {
    setTab(tab)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }

  const tabStyle = {
    color: '#ACAEB2',
    fontSize: '20px',
    lineHeight: '32px',
    fontHeight: 500,
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingBottom: '8px',
  }
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={tab} onChange={handleChange} aria-label="">
          <Tab sx={tabStyle} label="Details" {...a11yProps(0)} />
          <Tab sx={tabStyle} label="Additional Information" {...a11yProps(1)} />
          <Tab sx={tabStyle} label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <ProductDetailsTabContent product={product} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <div
          dangerouslySetInnerHTML={{ __html: product.description }}
          className="product-details-tab-content-wrapper text-lg font-light"
        />
        <Content type={CMSFilterType.PRODUCT} page={product.id} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <div className="product-details-tab-content-wrapper font-light">Reviews</div>
      </TabPanel>
    </Box>
  )
}
const ProductInfoPortal = ({ caption, items }) => {
  const { t } = useTranslation(i18nProductCustomAttributesNS)

  return (
    <div className="information-portal-wrapper grid grid-cols-1 gap-4">
      <div className="information-caption">{t(caption)}</div>
      <div className="information-content grid grid-cols-1 gap-[6px]">
        {items.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <div className="information-properties pl-6 grid grid-cols-1 text-lg last tooltipped">
              <span className="tooltip rounded-b-lg bg-aliceBlue p-1 -mr-2 standard_box_shadow">
                {t(row.property + i18nPCADescriptionSuffix)}
              </span>
              <span key={index} className="tail">
                {t(row.property)}
              </span>
            </div>
            <div className="information-values pl-6 grid grid-cols-1 text-lg font-light">
              <span key={index}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductDetailInfo = ({ product }) => {
  const { getLocalizedValue } = useLanguage()
  return (
    <div className="product-detail-page-info-wrapper pb-12">
      <div className="product-detail-content">
        <div className="desktop-lg">
          <ProductDetailTabContent product={product} />
        </div>
        <div className="mobile-lg">
          <Accordion>
            <AccordionItem index={0} title="Details">
              <ProductDetailsTabContent product={product} />
            </AccordionItem>
            <AccordionItem index={1} title="Additional Information">
              <div className="product-details-tab-content-wrapper">{getLocalizedValue(product.description)}</div>
            </AccordionItem>
            <AccordionItem index={2} title="Reviews" className="product-details-tab-content-wrapper">
              <div className="product-details-tab-content-wrapper">Reviews</div>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="desktop-lg mt-4"></div>
      </div>
    </div>
  )
}

const products = [
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/hp_laser_printer.png',
    code: 'TY2-B#M74A',
    name: 'HP LaserJet 1*500-sheet Paper Feeder and Cabinet',
    price: '341.89',
    listPrice: '389.50',
  },

  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/comfort_chair.png',
    code: 'BB2-B3M987',
    name: 'RP9 Retail Compact Stand Silver PC Multimedia stand',
    price: '84.89',
    listPrice: '94.10',
  },
  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/pc_stand.png',
    code: 'BB2-B3M987',
    name: 'Zenith Plier stapler 548/E Silver',
    price: '27.50',
    listPrice: '34.99',
  },
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/stapler.png',
    code: 'TY2-B#M74A',
    name: 'Comfort Ergo 2-Lever Operator Chairs',
    price: '53.59',
    listPrice: '59.99',
  },
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/comfort_chair.png',
    code: 'TY2-B#M74A',
    name: 'Comfort Ergo 2-Lever Operator Chairs',
    price: '53.59',
    listPrice: '59.99',
  },
]

const getRelatedProducts = async (language, product) => {
  let productIds = []
  const relatedItems = product.relatedItems
  if (!relatedItems) return null

  relatedItems.forEach((item) => {
    productIds.push(item.refId)
  })
  const products = await productService.getProductsWithIds(productIds)
  const prices = await priceService.getPriceWithProductIds(productIds)

  const prices_obj = {}
  prices.forEach((p) => {
    prices_obj[`p${p.itemId.id}`] = p
  })

  let price_id
  let result = []
  for (let i = 0; i < products.length; i++) {
    price_id = `p${products[i]['id']}`
    if (prices_obj[price_id] !== undefined)
      result.push({
        id: products[i].id,
        code: products[i].code,
        name: prices_obj[price_id].itemId?.name[language] || '',
        price: prices_obj[price_id].effectiveValue,
        listprice: prices_obj[price_id].effectiveValue,
        src: products[i].media[0].url,
      })
  }
  return result
}

const ProductMatchItems = ({ productInput }) => {
  const [products, setProducts] = useState([])
  const { currentLanguage } = useLanguage()

  const navigate = useNavigate()
  const { userTenant } = useAuth()

  useEffect(() => {
    getRelatedProducts(currentLanguage, productInput).then((result) => {
      result ? setProducts(result.slice(0, 5)) : setProducts([])
    })
  }, [currentLanguage, productInput])
  return (
    <div className="product-match-items-wrapper grid grid-cols-1">
      <div className="product-match-caption mx-auto font-light w-full lg:w-1/3 border-b-2 pb-2">Related products</div>
      {products.length > 0 ? (
        <div className="product-match-items-content w-full">
          <SliderComponent>
            {products.map((item, index) => (
              <Product
                key={index}
                stock={item.stock}
                rating={item.rating}
                total_count={item.count}
                src={item.src}
                code={item.code}
                name={item.name}
                price={item.price}
                listPrice={item.listPrice}
                onClick={() => {
                  navigate(`/${userTenant}/product/details/${item.id}`, {
                    replace: true,
                  })
                }}
              />
            ))}
          </SliderComponent>
        </div>
      ) : (
        <div className="w-full text-center text-lg font-light">No matching products</div>
      )}
    </div>
  )
}

const ProductDetailPage = ({ product, brand, labels }) => {
  console.log(product)
  return (
    <div className="product-detail-page-wrapper ">
      <div className="product-detail-page-content">
        <ProductDetailCategoryCaptionBar category={product.category} />
        <ProductContent product={product} brand={brand} labels={labels} />
        {product.productType === 'PARENT_VARIANT' &&
          (product?.mixins?.b2bShowcase?.productConfiguration === false ? (
            <ProductVariants product={product} />
          ) : (
            <ProductConfiguration product={product} />
          ))}
        {product.productType === 'BUNDLE' && <ProductBundleInfo product={product} />}
        <ProductDetailInfo product={product} />
        <ProductMatchItems productInput={product} />
      </div>
    </div>
  )
}
export default ProductDetailPage
