import React, {useCallback, useMemo, useState} from 'react'
import ReactStars from 'react-stars'
import Quantity from '../../components/Utilities/quantity/quantity'
import { maxProductDescriptionLength } from '../../constants/page'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { trimImage } from '../../helpers/images'
import { useAuth } from 'context/auth-provider'
import { useCart } from 'context/cart-provider'
import { formatPrice } from 'helpers/price'
import { LargePrimaryButton } from 'components/Utilities/button'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from 'context/language-provider'

const EachProductRow = ({ item, type, available, rating, productCount }) => {
  const { getLocalizedValue } = useLanguage()
  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])
  const { putCartProduct } = useCart()
  const trimmedDescription = useMemo(() => {
    const desc = getLocalizedValue(item.description)
    return desc.length > maxProductDescriptionLength
      ? `${desc.substr(0, maxProductDescriptionLength)} ...`
      : desc
  }, [item.description])

    const {isLoggedIn, userTenant} = useAuth()
    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()
    const handleProductDetail = useCallback(() => {
        navigate(`/${userTenant}/product/details/${item.id}`)
    }, [userTenant, item.id])
    const price = useMemo(() => {
        return formatPrice(item, isLoggedIn)
    }, [item.price, isLoggedIn])

    const handleAddToCart = useCallback(() => {
        putCartProduct({...item, quantity})
    }, [item, quantity])

  const renderPrice = (price) => {
    if (price) {
      return <CurrencyBeforeValue value={price} />
    } else {
      return <span className="text-xs text-primaryBlue font-bold">No Price</span>
    }
  }
  return (
    <div className="standard_box_shadow flex h-full font-inter rounded-xl bg-aliceBlue p-4 gap-4">
      <div className="flex w-1/4 flex-col justify-between">
        <img src={imageSrc} alt='' className=" aspect-square h-fit rounded-xl" />
      </div>
      <div className="flex flex-col w-1/2">
        <div
          className={'text-limeGreen font-inter font-medium float-right lg:float-none'}
        >
          {available > 0 ? 'In Stock' : 'Out Of Stock'}
        </div>
        <div className='flex flex-col gap-2'>

          <div className="mt-4 h-fit text-left w-full text-2xl text-eerieBlack font-light">
            {getLocalizedValue(item.name)}
          </div>
          <div className="text-xs font-bold text-gray">{item.code}</div>
        </div>
        <div className="text-sm mt-4  text-black flex">
          <ReactStars size={16} value={rating} color2={'#FBB13C'} />(
          {productCount})
        </div>
        <div className="text-sm mt-4 text-eerieBlack text-base">
          <span>{trimmedDescription}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-auto w-1/4">
        <div className={'w-full flex justify-end gap-4'}>
          {item.productType !== 'PARENT_VARIANT' && (
            <>
              <div className="text-gray">
                {isLoggedIn ? 'Your negotiated price' : 'List Price'}
              </div>
              <div className="flex">
                <div className="text-[20px] leading-[24px] text-end font-bold ml-1">
                  {renderPrice(price)} <br />
                  <span className="text-[12px] font-normal text-gray">
                    ({isLoggedIn ? 'Excl. VAT' : 'Incl. VAT'})
                  </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

        <div className="flex w-full flex-col gap-2 items-end">
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
                <div
                  className="cursor-pointer cta-button bg-yellow flex items-center justify-center px-10 py-4 transition-all duration-150 ease-in"
                  onClick={handleAddToCart}
                  >
                  <span className="text-aliceBlue text-lg">ADD TO CART</span>
                </div>
                <div
                  className="cursor-pointer cta-button bg-lightGray flex items-center justify-center px-5 py-2 w-fit hover:!bg-gray transition-all duration-150 ease-in"
                  onClick={handleProductDetail}
                  >
                  <span className="text-aliceBlue">MORE DETAILS</span>
                </div>
            </>
          ) : (
            <div>
              <LargePrimaryButton
                title={'VIEW VARIANTS'}
                onClick={handleProductDetail}
                className="cta-button bg-yellow"
                sx={{ backgroundColor: '#FAC420 !important' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EachProductRow
