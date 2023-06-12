import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
import { productUrl } from '../../services/service.config'

import { LargePrimaryButton } from '../../components/Utilities/button'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { ProductVariants } from './ProductVariants'
import { PriceTierValues } from './VariantAccordion'
import { useCart } from 'context/cart-provider'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { Qualification } from '../shared/Qualification'

const ProductContext = createContext()

const Bold = ({ children }) => {
  return <div className="font-bold">{children}</div>
}
const ProductDetailCategoryCaptionBar = ({ category }) => {
  const categoryTree = [{ caption: 'Home', link: productUrl() }]
  let lnk = productUrl()
  for (let c in category) {
    lnk = `${lnk}/${category[c].toLowerCase().replaceAll(' ', '_')}`
    categoryTree.push({ caption: category[c], link: lnk })
  }
  return (
    <div className="product-detail-category-caption-bar">
      <Breadcrumbs
        className="lg:block hidden"
        separator=">"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            <Typography
              key={index}
              className="breadcrumb-item"
              color="text.primary"
            >
              {row.caption}
            </Typography>
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color="inherit"
              href={row.link}
            >
              {index !== categoryTree.length - 1 ? (
                row.caption
              ) : (
                <Bold>{row.caption}</Bold>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs
        className="lg:hidden md:block hidden"
        separator=">"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            ''
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 2 ? 'text.primary' : 'inherit'
              }
              href="/"
            >
              {row.caption}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs className="md:hidden" separator=">" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return categoryTree.length - index > 1 &&
            categoryTree.length - index < 4 ? (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 1 ? 'text.primary' : 'inherit'
              }
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
  return (
    <div className="product-detail-image-content">
      <div className="product-detail-main-image rounded">
        <img src={`${product.src}`} alt="product" className="w-full" />
      </div>
      <div className="product-detail-sub-images">
        {product.subImages.map((link, index) => {
          return (
            <div
              key={index}
              className="rounded product-detail-sub-image-item flex items-center"
            >
              <img
                src={`${link}`}
                alt="product_"
                className="w-full m-auto items-center"
              />
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
          <div className="flex float-right lg:float-left lg:pb-0 pb-4">
            <ReactStars
              size={16}
              value={product.rating}
              color2={'#FBB13C'}
              className="reviews-star"
            />
            ({product.count})
          </div>
          <div className="lg:ml-4  product-all-reviews">Reviews</div>
        </div>
      </div>
    </div>
  )
}
const ProductTitle = ({ name }) => {
  return <div className="mt-6 product-title">{name}</div>
}
const ProductPriceAndAmount = ({ price, productCount, estimatedDelivery }) => {
  const { isLoggedIn } = useAuth()

  return (
    <div className="product-price-and-amount-wrapper mt-12 ">
      <div className="product-price-wrapper flex space-x-4 items-center">
        {price !== '' ? (
          <>
            <div className="product-price h-12">
              <CurrencyBeforeValue value={price} />
            </div>
            <div className="vat-caption">
              {isLoggedIn ? 'VAT Excluded' : 'VAT Included'}
            </div>
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
          <span className="desktop-sm text-xs  text-primaryBlue font-bold">
            No Price
          </span>
        )}
      </div>

      <div className="product-amount-wrapper flex mt-6 space-x-6 items-center">
        <span className="product-number">{productCount} in Stock</span>
        <span className="delivery-date">
          Estimated Delivery {estimatedDelivery}
        </span>
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
    <div className="product-basic-info-wrapper hidden lg:block">
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

const PrdouctAddToCart = () => {
  const { cartAccount } = useCart()
  const [cartItems, setCartItems] = useState(cartAccount.items || [])
  useEffect(() => {
    setCartItems(cartAccount.items)
  }, [cartAccount.items])

  const product = useContext(ProductContext)
  const { removeCartItem, changeCartItemQty } = useCart()

  const { setShowCart } = useContext(LayoutContext)
  const { syncCart, putCartProduct } = useCart()
  const HandleProductAddToCart1 = useCallback((product, action, quantitiy) => {
    let newProduct = { ...product }
    newProduct.quantity = quantitiy
    putCartProduct(newProduct)
    syncCart()
    action(true)
  }, [])

  return (
    <div className="product-add-to-cart-wrapper py-12">
      {(cartItems || []).find((item) => product.yrn === item.itemYrn) && (
        <div className="quantity">
          Quantity
          <Quantity
            key={
              product.yrn +
              (cartItems || []).find((item) => product.yrn === item.itemYrn)
                .quantity
            }
            value={
              (cartItems || []).find((item) => product.yrn === item.itemYrn)
                .quantity
            }
            changeCartItemQty={(quantity) =>
              changeCartItemQty(
                (cartItems || []).find((item) => product.yrn === item.itemYrn)
                  .id,
                quantity
              )
            }
          />
        </div>
      )}

      <div className="">
        {(cartItems || []).find((item) => product.yrn === item.itemYrn) ? (
          <LargePrimaryButton
            className="product-remove-from-cart-btn cta-button bg-yellow"
            onClick={() =>
              removeCartItem(
                (cartItems || []).find((item) => product.yrn === item.itemYrn)
              )
            }
            title="REMOVE ITEM FROM CART"
          />
        ) : (
          <LargePrimaryButton
            className="product-add-to-cart-btn cta-button bg-yellow"
            onClick={() => HandleProductAddToCart1(product, setShowCart, 1)}
            title="ADD TO CART"
          />
        )}
      </div>
    </div>
  )
}
const ProductDiscount = ({ price, quantity }) => {
  return (
    <div className="product-discount-wrapper pt-12 gap-6 ">
      <div className="product-discount-caption">Quantity Discount</div>
      <PriceTierValues
        sx={{ borderRight: '1px solid #DFE1E5' }}
        price={price}
        quantity={quantity}
      ></PriceTierValues>
    </div>
  )
}
const ProductInfo = ({ product }) => {
  return (
    <>
      <ProductBasicInfo product={product} />
      {product.productType !== 'PARENT_VARIANT' && (
        <>
          <PrdouctAddToCart />
          <ProductDiscount
            price={product.price}
            quantity={product.product_count}
          />
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
    if (
      product.price.priceModel !== undefined &&
      product.price.priceModel.includesTax === false
    ) {
      price =
        Math.trunc((price * 10000) / (100 + product.price.tax.taxRate)) / 100
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
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-fit h-8"
                  />
                </>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2">
                {labels && labels.length > 0 && <div>Labels</div>}
                {labels.map((label) => {
                  return (
                    <img
                      src={label.image}
                      alt={label.name}
                      className="w-fit h-8"
                    />
                  )
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
            if (flg === true || str[loop] === str[loop].toUpperCase())
              res += ' ' + str[loop].toUpperCase()
            else res += str[loop]
            flg = false
          }
        }
      }
      loop++
    }
    return res
  }
  const getAttributes = (items) => {
    let res = []
    Object.keys(items).map((key) => {
      let value = items[key]
      let caption = getFeatureName(key)
      if (typeof value !== 'object') value = value
      else if ('value' in value && 'uom' in value)
        value = value['value'] + ' ' + value['uom']
      else value = ''
      res.push({ property: caption, value: value })
    })
    return res
  }
  return (
    <div className="product-details-tab-content-wrapper">
      <div className="grid grid-cols-1 gap-12">
        {Object.keys(product.mixins).map((key) => {
          return (
            <ProductInfoPortal
              key={key}
              caption={getFeatureName(key)}
              items={getAttributes(product.mixins[key])}
            />
          )
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
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={handleChange}
          aria-label=""
        >
          <Tab sx={tabStyle} label="Details" {...a11yProps(0)} />
          <Tab sx={tabStyle} label="Additional Information" {...a11yProps(1)} />
          <Tab sx={tabStyle} label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <ProductDetailsTabContent product={product} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {product.description}
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Reviews
      </TabPanel>
    </Box>
  )
}
const ProductInfoPortal = ({ caption, items }) => {
  return (
    <div className="information-portal-wrapper grid grid-cols-1 gap-4">
      <div className="information-caption">{caption}</div>
      <div className="information-content grid grid-cols-1 gap-[6px]">
        {items.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <div className="information-properties pl-6 grid grid-cols-1">
              <span key={index}>{row.property}</span>
            </div>
            <div className="information-values pl-6 grid grid-cols-1 ">
              <span key={index}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductDetailInfo = ({ product }) => {
  return (
    <div className="product-detail-page-info-wrapper lg:py-12 pb-12">
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
              {product.description}
            </AccordionItem>
            <AccordionItem index={2} title="Reviews">
              Reviews
            </AccordionItem>
          </Accordion>
        </div>
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

const ProductMatchItems = () => {
  return (
    <div className="product-match-items-wrapper grid grid-cols-1">
      <div className="product-match-caption w-full">Match it with</div>
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
            />
          ))}
        </SliderComponent>
      </div>
    </div>
  )
}

const ProductDetailPage = ({ product, brand, labels, qualifications }) => {
  return (
    <div className="product-detail-page-wrapper ">
      <div className="product-detail-page-content">
        <ProductDetailCategoryCaptionBar category={product.category} />
        <ProductContent product={product} brand={brand} labels={labels} />
        <Box sx={{ mt: -10, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {qualifications.length ? (
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>
              Promotion{qualifications.length > 1 ? 's' : ''} related to this
              product:
            </span>
          ) : undefined}
          {qualifications?.map((qualification) => (
            <Qualification
              key={qualification.id}
              qualification={qualification}
            />
          ))}
        </Box>
        {product.productType === 'PARENT_VARIANT' && (
          <ProductVariants product={product} />
        )}
        <ProductDetailInfo product={product} />
        <ProductMatchItems />
      </div>
    </div>
  )
}
export default ProductDetailPage
