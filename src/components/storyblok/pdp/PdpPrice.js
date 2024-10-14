import { getShipment, getVAT } from '../../../pages/product/EachProduct'
import { useLanguage } from '../../../context/language-provider'
import { storyblokEditable } from '@storyblok/react'
import { formatPrice } from '../../../helpers/price'

const PdpPrice = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()

  const ePrice = formatPrice(product)
  const isDiscounted = product.price.originalValue >
    ePrice
  const discount = (100 -
    (((ePrice * 100) / product.price.originalValue) *
      100) / 100).toFixed(
    1,
  )

  return (
    <div className="flex flex-col text-demoHeadlines" {...storyblokEditable()}>
      {isDiscounted && <div
        className="line-through font-demoCorporateFont font-bold text-xl">{currentLanguage ===
      'de' ? 'UVP' : 'USP'} {product.price.originalValue}</div>}
      <div className="mb-1 flex flex-row">
        <div
          className="text-4xl font-demoCorporateFont font-bold">{ePrice.toFixed(2)}</div>
        <div>*</div>
        {isDiscounted && <div
          className="ml-5 self-center bg-demoAlerting h-8 text-white font-demoCorporateFont px-1 font-bold text-[30px] leading-[30px]">{`-${discount} %`}</div>}
      </div>
      <div className="flex flex-row text-xs">
        <div className="text-demoGrayDarkest">{getVAT(currentLanguage, true)}</div>
        <div className="text-demoSecondaryDimmed ml-2">{getShipment(
          currentLanguage)}</div>
      </div>
    </div>
  )
}

export default PdpPrice
