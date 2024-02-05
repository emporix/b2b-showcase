import React, {useCallback, useMemo} from 'react'
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
        <div className="font-inter p-4 h-full flex flex-col gap-4 justify-between cursor-pointer" onClick={handleProductDetail}>
          <div className='flex flex-col gap-4'>
            <div className="w-full h-5 justify-between hidden lg:flex">
                {item.productType !== 'PARENT_VARIANT' && (
                    <div
                        className={
                            'text-limeGreen font-inter font-medium float-right lg:float-none'
                        }
                    >
                        {available > 0 ? 'In Stock' : 'Out Of Stock'}
                    </div>
                )}
                <div className="flex float-right lg:float-none">
                    <ReactStars size={16} value={rating} color2={'#FBB13C'}/>(
                    {productCount})
                </div>
            </div>

            <div className=" block float-right lg:hidden">
                <div className=" flex float-right">
                    <ReactStars size={16} value={rating} color2={'#FBB13C'}/>(
                    {productCount})
                </div>
                <br/>
                <div
                    className={
                        'text-limeGreen font-inter font-medium float-right lg:float-none'
                    }
                >
                    {available > 0 ? 'In Stock' : 'Out Of Stock'}
                </div>
            </div>
            <div className="items-center mx-auto ">
              <img src={imageSrc} alt="" className="w-full h-fit rounded-xl" />
            </div>
            <div className="text-left w-full text-2xl text-eerieBlack font-light">
              {getLocalizedValue(item.name)}
            </div>
          </div>
              {item.productType !== 'PARENT_VARIANT' && (
        <div
          className={
            isLoggedIn
            ? 'flex flex-col w-full gap-4'
            : 'flex flex-col w-full gap-4 text-left font-bold'
          }
        >
          {isLoggedIn ? (
            <>
              <div className="text-xl flex items-center gap-2">
                {price !== null ? (
                  <>
                    {isLoggedIn ? 'Your negotiated price' : 'List Price'}
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
                                        <div className="text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1">
                                            <div className='flex flex-col'>
                                                <CurrencyBeforeValue value={price}/>
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
                        <div className="text-xl flex items-center gap-2">
                            {price !== null ? (
                                <>
                                    <CurrencyBeforeValue value={price}/>
                                    <span className="text-sm font-normal text-manatee">
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
                        className="cta-button bg-primary"
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
