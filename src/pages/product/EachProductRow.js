import React, { useCallback, useMemo, useState } from 'react'
import ReactStars from 'react-stars'
import Quantity from '../../components/Utilities/quantity/quantity'
import { maxProductDescriptionLength } from '../../constants/page'
import parse from 'html-react-parser'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { trimImage } from '../../helpers/images'
import { useAuth } from 'context/auth-provider'
import { useCart } from 'context/cart-provider'
import { formatPrice } from 'helpers/price'
import { LargePrimaryButton } from 'components/Utilities/button'
import { useNavigate } from 'react-router-dom'

const EachProductRow = ({ item, type, available, rating, productCount }) => {
  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])
  const { putCartProduct } = useCart()
  const trimmedDescription = useMemo(() => {
    return item.description.length > maxProductDescriptionLength
      ? `${item.description.substr(0, maxProductDescriptionLength)} ...`
      : item.description
  }, [item.description])

  const { isLoggedIn, userTenant } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const handleProductDetail = useCallback(() => {
    navigate(`/${userTenant}/product/details/${item.id}`)
  }, [userTenant, item.id])
  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item.price, isLoggedIn])

  const handleAddToCart = useCallback(() => {
    putCartProduct({ ...item, quantity })
  }, [item, quantity])

  const renderPrice = (price) => {
    if (price) {
      return <CurrencyBeforeValue value={price} />
    } else {
      return <span className="text-xs text-brightRed font-bold">No Price</span>
    }
  }
  return (
    <div className="flex h-full font-inter ">
      <div className="flex w-[15%]">
        <img src={trimImage(`${imageSrc}`, 200, 150)} className="self-center" />
      </div>
      <div className="flex-auto w-[55%]">
        <div className="text-xs font-bold text-gray">{item.code}</div>
        <div className="text-2xl mt-4 font-semibold text-black h-16">
          {item.name}
        </div>
        <div className="text-sm mt-4  text-black flex">
          <ReactStars size={16} value={rating} color2={'#FBB13C'} />(
          {productCount})
        </div>
        <div className="text-sm mt-4  text-gray text-normal">
          {parse(`<span>${trimmedDescription}</span>`)}
        </div>
      </div>
      <div className="flex-auto w-[30%]">
        <div className={'w-full flex justify-between h-[56px] pt-2'}>
          {item.productType !== 'PARENT_VARIANT' && (
            <>
              <div className="text-[12px] text-gray w-[150px] text-left">
                {isLoggedIn ? 'Your negotiated price' : 'List Price'}
              </div>
              <div className="flex">
                <img
                  src="/products/pencil.png"
                  className="w-4 h-4 mt-1"
                  alt="pencil"
                />
                <div className="text-[20px] leading-[24px] font-bold ml-1">
                  {renderPrice(price)} <br />
                  <span className="text-[12px] font-normal text-gray">
                    {isLoggedIn ? 'Excl. VAT' : 'Incl. VAT'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className={
            available
              ? 'text-brightGreen font-inter font-bold text-xs mt-[90px] float-right'
              : 'text-brightRed font-inter font-bold text-xs mt-[90px] float-right'
          }
        >
          {available ? 'In Stock' : 'Out Of Stock'}
        </div>
        <div className="mt-6 lg:flex w-full float-right">
          {item.productType !== 'PARENT_VARIANT' ? (
            <>
              <div>
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
                />
              </div>
              <div className="ml-6 h-10 w-40 bg-tinBlue text-black flex items-center">
                <div
                  className="mx-auto flex cursor-pointer"
                  onClick={handleAddToCart}
                >
                  <span className="px-4">ADD TO CART</span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <LargePrimaryButton
                title={'VIEW VARIANTS'}
                onClick={handleProductDetail}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EachProductRow
