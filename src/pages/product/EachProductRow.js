import React, { useCallback, useMemo, useState } from 'react'
import ReactStars from 'react-stars'
import Quantity from '../../components/Utilities/quantity/quantity'
import { maxProductDescriptionLength } from '../../constants/page'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { useAuth } from 'context/auth-provider'
import { useCart } from 'context/cart-provider'
import { formatPrice } from 'helpers/price'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from 'context/language-provider'
import { useTranslation } from 'react-i18next'
import { HiChevronDoubleRight } from 'react-icons/hi'
import { StockLevel } from '../../components/Product/availability'

const EachProductRow = ({ item, stockLevel, rating }) => {
  const { getLocalizedValue } = useLanguage()
  const { putCartProduct } = useCart()
  const navigate = useNavigate()
  const { isLoggedIn, userTenant } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const { t } = useTranslation('page')

  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const trimmedDescription = useMemo(() => {
    const desc = getLocalizedValue(item.description)
    return desc.length > maxProductDescriptionLength ? `${desc.substr(0, maxProductDescriptionLength)} ...` : desc
  }, [item, getLocalizedValue])

  const handleProductDetail = useCallback(
    (item) => {
      navigate(`/${userTenant}/product/details/${item.id}`)
    },
    [userTenant, navigate]
  )

  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item, isLoggedIn])

  const handleAddToCart = useCallback(
    (e, item, quantity) => {
      e.preventDefault()
      putCartProduct({ ...item, quantity })
    },
    [putCartProduct]
  )

  const renderPrice = (price) => {
    if (price) {
      return <CurrencyBeforeValue value={price} />
    } else {
      return <span className="text-lg text-primaryBlue font-bold">No Price</span>
    }
  }

  return (
    <div className="standard_box_shadow h-full rounded-xl bg-aliceBlue p-4 flex flex-col md:flex-row gap-4">
      <div className="cursor-pointer flex flex-col justify-between" onClick={() => handleProductDetail(item)}>
        <img src={imageSrc} alt="" className="aspect-square rounded-xl" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 cursor-pointer" onClick={() => handleProductDetail(item)}>
          <StockLevel stockLevel={stockLevel} />
          <div className="flex flex-col justify-end ml-auto">
            {item.productType !== 'PARENT_VARIANT' && (
              <>
                <div className="text-gray text-sm text-end">{isLoggedIn ? t('negotiated') : t('public')}</div>
                <div className="text-[20px] leading-[24px] text-end font-bold ml-1 whitespace-nowrap">
                  {renderPrice(price)} <br />
                  <span className="text-[12px] font-normal text-gray">
                    ({isLoggedIn ? t('excl_vat') : t('incl_vat')})
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <div
                className="h-fit text-left w-full text-2xl text-eerieBlack font-light cursor-pointer"
                onClick={() => handleProductDetail(item)}
              >
                {getLocalizedValue(item.name)}
              </div>
              <div className="text-xs font-bold text-gray">{item.code}</div>
            </div>

            <div className="text-sm mt-4  text-black flex">
              <ReactStars size={16} value={rating} color2={'#FBB13C'} />({rating})
            </div>

            <div className="text-sm mt-4 text-eerieBlack cursor-pointer" onClick={() => handleProductDetail(item)}>
              <span>{trimmedDescription}</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 items-cente md:items-end justify-end">
            {item.productType !== 'PARENT_VARIANT' ? (
              <>
                <button
                  className="mx-auto md:mx-0 cursor-pointer text-darkGray flex items-center justify-center px-5 py-2 w-fit hover:text-primary transition-all duration-150 ease-in uppercase"
                  onClick={() => handleProductDetail(item)}
                >
                  {t('more_dtls')}
                  <HiChevronDoubleRight />
                </button>
                <Quantity
                  center
                  value={quantity}
                  increase={() => {
                    setQuantity((prev) => {
                      return prev + 1
                    })
                  }}
                  decrease={() => {
                    setQuantity((prev) => {
                      return prev - 1 > 1 ? prev - 1 : 1
                    })
                  }}
                  onChange={(value) => {
                    setQuantity(value)
                  }}
                />
                <button
                  className="cta-primary w-full text-sm md:w-auto"
                  onClick={(e) => handleAddToCart(e, item, quantity)}
                >
                  {t('add_cart')}
                </button>
              </>
            ) : (
              <div>
                <button className="cta-primary w-full" onClick={() => handleProductDetail(item)}>
                  {t('view_var')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EachProductRow
