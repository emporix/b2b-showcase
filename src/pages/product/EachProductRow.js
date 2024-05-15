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

const EachProductRow = ({ item, type, available, rating, productCount }) => {
  const { getLocalizedValue } = useLanguage()
  const { putCartProduct } = useCart()
  const navigate = useNavigate()
  const { isLoggedIn, userTenant } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const trimmedDescription = useMemo(() => {
    const desc = getLocalizedValue(item.description)
    return desc.length > maxProductDescriptionLength
      ? `${desc.substr(0, maxProductDescriptionLength)} ...`
      : desc
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
      return (
        <span className="text-lg text-primaryBlue font-bold">No Price</span>
      )
    }
  }

  return (
    <div className="standard_box_shadow h-full rounded-xl bg-aliceBlue p-4 flex flex-col md:flex-row gap-4">
      <div
        className="cursor-pointer flex flex-col justify-between"
        onClick={() => handleProductDetail(item)}
      >
        <img src={imageSrc} alt="" className="aspect-square h-fit rounded-xl" />
      </div>

      <div className="flex flex-col gap-4">
        <div
          className="flex flex-row gap-4 cursor-pointer"
          onClick={() => handleProductDetail(item)}
        >
          <div
            className={`${
              available > 0 ? 'text-limeGreen' : 'text-red-500'
            } font-medium float-right lg:float-none`}
          >
            {available > 0 ? 'In Stock' : 'Out Of Stock'}
          </div>
          <div className="flex flex-col justify-end ml-auto">
            {item.productType !== 'PARENT_VARIANT' && (
              <>
                <div className="text-gray text-sm text-end">
                  {isLoggedIn ? 'Your negotiated price ' : 'List Price'}
                </div>
                <div className="text-[20px] leading-[24px] text-end font-bold ml-1 whitespace-nowrap">
                  {renderPrice(price)} <br />
                  <span className="text-[12px] font-normal text-gray">
                    ({isLoggedIn ? 'Excl. VAT' : 'Incl. VAT'})
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
              <ReactStars size={16} value={rating} color2={'#FBB13C'} />(
              {productCount})
            </div>

            <div
              className="text-sm mt-4 text-eerieBlack cursor-pointer"
              onClick={() => handleProductDetail(item)}
            >
              <span>{trimmedDescription}</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 items-cente md:items-end justify-end">
            {item.productType !== 'PARENT_VARIANT' ? (
              <>
                <Quantity
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
                  className="cta-primary w-full md:w-auto"
                  onClick={() => handleAddToCart(item, quantity)}
                >
                  add to cart
                </button>
                {/* <div
                className="cursor-pointer cta-button bg-lightGray flex items-center justify-center px-5 py-2 w-fit hover:!bg-gray transition-all duration-150 ease-in"
                onClick={handleProductDetail}
              >
                <span className="text-aliceBlue">MORE DETAILS</span>
              </div> */}
              </>
            ) : (
              <div>
                <button
                  className="cta-primary w-full"
                  onClick={() => handleProductDetail(item)}
                >
                  view variants
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
