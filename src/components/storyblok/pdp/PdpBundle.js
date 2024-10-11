import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { Fragment, useEffect, useState } from 'react'
import { cn } from '../../cssUtils'
import { formatPrice } from '../../../helpers/price'
import { getProductData } from '../../../context/product-list-context'

const PdpBundle = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const [bundledProducts, setBundledProducts] = useState([])
  const isBundle = product.productType === 'BUNDLE'

  useEffect(() => {
    if (isBundle) {
      const bundledProductIds = product.bundledProducts.map(
        item => item.productId)
      getProductData(bundledProductIds, 1, 100000).then(products => {
        const newBundledProducts = products.map((productItem, index) => {
          return {
            product: productItem,
            amount: product.bundledProducts[index].amount,
          }
        })
        setBundledProducts(newBundledProducts)
      })
    }
  }, [product])

  const headerClassName = (onlyDesktop = false) =>
    cn('pb-1 border-b border-demoGrayDarker pr-1', {
      'hidden lg:block': onlyDesktop,
    })

  const cellClassName = (index, onlyDesktop = false) =>
    cn('flex items-center pr-1 font-normal', {
      'border-b border-demoGrayDarker': index < bundledProducts.length - 1,
      'hidden lg:flex': onlyDesktop,
    })

  return (isBundle &&
    <div>
      <div
        className="text-demoHeadlines text-xl font-bold mb-6">{currentLanguage ===
      'de' ? 'Enthaltene Produkte' : 'Bundled products'}</div>
      <div
        className="text-demoHeadlines font-bold text-[14px] lg:text-base grid grid-cols-[60px,auto,80px,90px] lg:grid-cols-[100px,auto,auto,100px,100px,100px] grid-rows-1 auto-rows-[64px]" {...storyblokEditable(
        blok)}>
        <div className={headerClassName()}>Bild
        </div>
        <div className={headerClassName()}>Name
        </div>
        <div className={headerClassName(true)}>Code
        </div>
        <div className={headerClassName()}>Anzahl
        </div>
        <div
          className={headerClassName(true)}>Einzelpreis
        </div>
        <div
          className={headerClassName()}>Gesamtpreis
        </div>
        {bundledProducts.map(
          (bundledProduct, index) =>
            <Fragment key={bundledProduct.product.id}>
              <div className={cellClassName(index)}>
                <img className="h-10" src={bundledProduct.product.media[0].url}
                     alt="" />
              </div>
              <div
                className={cellClassName(
                  index)}>{bundledProduct.product.name}</div>
              <div
                className={cellClassName(
                  index, true)}>{bundledProduct.product.code}</div>
              <div
                className={cellClassName(index)}>{bundledProduct.amount}</div>
              <div
                className={cellClassName(
                  index, true)}>{formatPrice(bundledProduct.product)}</div>
              <div
                className={cellClassName(
                  index)}>{formatPrice(bundledProduct.product) *
                bundledProduct.amount}</div>
            </Fragment>
          )}
      </div>
    </div>)
}

export default PdpBundle

