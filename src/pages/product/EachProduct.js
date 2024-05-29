import React, { useCallback, useMemo } from 'react'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { useLanguage } from 'context/language-provider'
import { useTranslation } from 'react-i18next'

const EachProduct = ({ item, available, rating }) => {
  const { t } = useTranslation('page')
  const { isLoggedIn, userTenant } = useAuth()
  const { getLocalizedValue } = useLanguage()

  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item, isLoggedIn])

  const navigate = useNavigate()

  const handleProductDetail = useCallback(
    (item) => {
      navigate(`/${userTenant}/product/details/${item.id}`)
    },
    [userTenant, navigate]
  )

  return (
    <div
      className="p-4 bg-aliceBlue standard_box_shadow rounded-xl h-full flex flex-col gap-4  cursor-pointer"
      onClick={() => handleProductDetail(item)}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col-reverse justify-start items-end md:flex-row md:items-end">
          {item.productType !== 'PARENT_VARIANT' && (
            <div className={available ? 'text-limeGreen' : 'text-red-500'}>
              {available ? t('in_stock') : t('out_stock')}
            </div>
          )}
          <div className="flex ml-auto">
            <ReactStars size={16} value={rating} color2={'#FBB13C'} />({rating})
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="items-center mx-auto ">
          <img src={imageSrc} alt="" className="w-full h-fit rounded-xl" />
        </div>
        <div className="text-left w-full text-2xl text-eerieBlack font-light">{getLocalizedValue(item.name)}</div>
      </div>

      {item.productType !== 'PARENT_VARIANT' && (
        <div
          className={
            isLoggedIn ? 'flex flex-col w-full gap-2 mt-auto' : 'flex flex-col w-full gap-2 mt-auto text-left font-bold'
          }
        >
          {isLoggedIn ? (
            <>
              <div className="text-xl flex items-center">
                {price !== null ? (
                  <span className="text-sm text-darkGray">{isLoggedIn ? t('negotiated') : t('public')}</span>
                ) : (
                  <span className="text-lg text-primaryBlue font-bold">{t('no_price')}</span>
                )}
              </div>
              <div className="flex">
                {price !== null ? (
                  <>
                    <div className="text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1">
                      <div className="flex flex-col">
                        <CurrencyBeforeValue value={price} />
                        <span className="text-xs font-normal text-manatee">
                          ({isLoggedIn ? t('excl_vat') : t('incl_vat')})
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-xl flex items-center gap-2">
              {price !== null ? (
                <>
                  <CurrencyBeforeValue value={price} />
                  <span className="text-sm font-normal text-manatee">{t('incl_vat')}</span>
                </>
              ) : (
                <span className="text-xs  text-primaryBlue font-bold">{t('no_price')}</span>
              )}
            </div>
          )}
        </div>
      )}
      {item.productType === 'PARENT_VARIANT' && (
        <div className="mt-auto">
          <button className="cta-primary w-full" onClick={() => handleProductDetail(item)}>
            {t('view_var')}
          </button>
        </div>
      )}
    </div>
  )
}

export default EachProduct
