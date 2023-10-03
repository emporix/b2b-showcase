import React, { useCallback, useEffect, useMemo } from 'react'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { TENANT } from '../../constants/localstorage'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { LargePrimaryButton } from '../../components/Utilities/button'
import { trimImage } from '../../helpers/images'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { useLanguage } from 'context/language-provider'

const EachProduct = ({ item, available, rating, productCount }) => {
  const { isLoggedIn, userTenant } = useAuth()
  const { getLocalizedValue } = useLanguage()
  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item.price, isLoggedIn])

  const navigate = useNavigate()
  const handleProductDetail = useCallback(() => {
    navigate(`/${userTenant}/product/details/${item.id}`)
  }, [userTenant, item.id])
  return (
    <div className="p-4" onClick={handleProductDetail}>
      <div className="w-full h-5  justify-between hidden lg:flex">
        {item.productType !== 'PARENT_VARIANT' && (
          <div
            className={
              'text-limeGreen font-inter text-[14px]/[20px] font-medium float-right lg:float-none'
            }
          >
            {available ? 'In Stock' : 'Out Of Stock'}
          </div>
        )}
        <div className="flex h-5 float-right lg:float-none">
          <ReactStars size={16} value={rating} color2={'#FBB13C'} />(
          {productCount})
        </div>
      </div>

      <div className=" block float-right lg:hidden">
        <div className=" flex h-5  float-right">
          <ReactStars size={16} value={rating} color2={'#FBB13C'} />(
          {productCount})
        </div>
        <br />
        <div
          className={
            'text-limeGreen font-inter text-[14px]/[20px] font-medium float-right lg:float-none'
          }
        >
          {available ? 'In Stock' : 'Out Of Stock'}
        </div>
      </div>

      <div className="pt-10 lg:w-[200px] lg:h-[260px] w-[100px] h-[140px] md:w-[150px] md:h-[200px] items-center mx-auto ">
        <img src={trimImage(`${imageSrc}`)} className="mx-auto h-full" />
      </div>
      <div className="mt-2 lg:mt-9 w-full font-inter">
          <div className="text-left text-[14px]/[20px] font-normal leading-xs text-manatee">
          {item.code}
        </div>
        <div className="mt-2 text-left max-w-[240px] min-h-[60px] lg:h-12 text-[16px]/[24px] text-eerieBlack font-medium">
          {getLocalizedValue(item.name)}
        </div>
      </div>
      {item.productType !== 'PARENT_VARIANT' && (
        <div
          className={
            isLoggedIn
              ? 'w-full h-[56px] pt-2'
              : 'w-full pt-2 text-left h-[56px] font-bold'
          }
        >
          {isLoggedIn ? (
            <>
              <div className="text-[14px]/[20px] font-normal text-eerieBlack w-[200px] text-left">
                {price !== null ? (
                  <>
                    {isLoggedIn ? 'Your negotiated price' : 'List Price'}
                    <CurrencyBeforeComponent>
                      <del>{price} </del>
                    </CurrencyBeforeComponent>
                  </>
                ) : (
                  <span className="text-xs text-primaryBlue font-bold">
                    No Price
                  </span>
                )}
              </div>
              <div className="flex">
                {price !== null ? (
                  <>
                    {/* <img src="/products/pencil.png" className="w-4 h-4 mt-1" /> */}
                    <div className="text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1">
                        <div className='flex flex-col'>
                          <CurrencyBeforeValue value={price} />
                          <span className="text-xs font-normal text-manatee">
                            (Excl. VAT)
                          </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-base pt-4">
              {price !== null ? (
                <>
                  <CurrencyBeforeValue value={price} />
                    <span className="text-xs font-normal text-manatee">
                    (Incl. VAT)
                  </span>
                </>
              ) : (
                <span className="text-xs  text-primaryBlue font-bold">
                  No Price
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {item.productType === 'PARENT_VARIANT' && (
        <div>
          <LargePrimaryButton
            className="cta-button bg-yellow"
            sx={{backgroundColor: '#FAC420 !important'}}
            title={'VIEW VARIANTS'}
            onClick={handleProductDetail}
          />
        </div>
      )}
    </div>
  )
}

export default EachProduct
