import React, { useCallback, useMemo } from 'react'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { LargePrimaryButton } from '../../components/Utilities/button'
import { trimImage } from '../../helpers/images'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { useLanguage } from 'context/language-provider'
import { cn } from '../../components/cssUtils'

export const getAvailable = (language, available) => {
  switch (language) {
    case 'de':
      return available ? 'Verfügbar' : 'Nicht verfügbar'
    case 'en':
      return available ? 'In Stock' : 'Out Of Stock'
  }
}

export const getVAT = (language, included) => {
  switch (language) {
    case 'de':
      return included ? 'inkl. MwSt' : 'excl. MwSt'
    case 'en':
      return included ? 'Incl. VAT' : 'Excl. VAT'
  }
}

export const getShipment = (language) => {
  switch (language) {
    case 'de':
      return 'zzgl. Versand'
    case 'en':
      return 'excl. Shipping costs'
  }
}

const EachProduct = ({ item, available, rating, productCount }) => {
  const { isLoggedIn, userTenant } = useAuth()
  const { currentLanguage, getLocalizedValue } = useLanguage()
  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item.price, isLoggedIn])

  const navigate = useNavigate()
  const handleProductDetail = useCallback(() => {
    navigate(`/${userTenant}/product/details/${item.id}`)
    navigate(0)
  }, [userTenant, item.id])
  return (
    <div className="p-4 cursor-pointer" onClick={handleProductDetail}>
      <div className="w-full h-5  justify-between hidden lg:flex">
        {item.productType !== 'PARENT_VARIANT' && (
          <div
            className={
              cn('text-[14px]/[20px] font-medium float-right lg:float-none', {
                'text-limeGreen': available,
                'text-red-500': !available,
              })
            }
          >
            {getAvailable(currentLanguage, available)}
          </div>
        )}
        <div className="flex h-5 float-right lg:float-none">
          <ReactStars size={16} value={rating} color2={'#00B6ED'} />
          {productCount && `(${productCount})`}
        </div>
      </div>

      <div className=" block float-right lg:hidden">
        <div className=" flex h-5  float-right">
          <ReactStars size={16} value={rating} color2={'#00B6ED'} />
          {productCount && `(${productCount})`}
        </div>
        <br />
        <div
          className={
            cn('text-[14px]/[20px] font-medium float-right lg:float-none', {
              'text-limeGreen': available,
              'text-red-500': !available,
            })
          }
        >
          {getAvailable(currentLanguage, available)}
        </div>
      </div>

      <div
        className="pt-10 lg:w-[200px] lg:h-[260px] w-[100px] h-[140px] md:w-[150px] md:h-[200px] items-center mx-auto ">
        <img src={trimImage(`${imageSrc}`)} className="mx-auto h-full" alt="" />
      </div>
      <div className="mt-2 lg:mt-9 w-full ">
        <div
          className="text-left text-[14px]/[20px] font-normal leading-xs text-manatee">
          {item.code}
        </div>
        <div
          className="mt-2 text-left max-w-[240px] min-h-[60px] lg:h-12 text-[20px] font-bold text-aldiBlue4">
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
              <div
                className="text-[30px] font-aldiCondensed font-normal text-aldiBlue4 w-[200px] text-left">
                {price !== null ? (
                  <>
                    <CurrencyBeforeValue value={price} />
                    <span className="text-xs font-normal text-manatee">
                    {' '}({getVAT(currentLanguage, true)})
                  </span>
                  </>
                ) : (
                  <span className="text-xs text-aldiBlue1 font-bold">
                    No Price
                  </span>
                )}
              </div>
              <div className="flex">
                {price !== null ? (
                  <>
                    {/* <img src="/products/pencil.png" className="w-4 h-4 mt-1" /> */}
                    <div
                      className="text-[30px] font-aldiCondensed text-aldiBlue4 lg:text-xl leading-[24px] font-bold ml-1">
                      <div className="flex flex-col">
                        <CurrencyBeforeValue value={price} />
                        <span className="text-xs font-normal text-manatee">
                            {' '}({getVAT(currentLanguage, false)})
                          </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-[30px] font-aldiCondensed text-aldiBlue4 pt-4">
              {price !== null ? (
                <>
                  <CurrencyBeforeValue value={price} />
                  <span className="text-xs font-normal text-manatee">
                    {' '}({getVAT(currentLanguage, true)})
                  </span>
                </>
              ) : (
                <span className="text-xs text-aldiBlue1 font-bold">
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
            className="cta-button bg-aldiBlue1"
            sx={{ backgroundColor: '#FAC420 !important' }}
            title={currentLanguage === 'de' ? 'VARIANTEN' : 'VIEW VARIANTS'}
            onClick={handleProductDetail}
          />
        </div>
      )}
    </div>
  )
}

export default EachProduct
