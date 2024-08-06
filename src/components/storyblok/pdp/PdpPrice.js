import { getShipment, getVAT } from '../../../pages/product/EachProduct'
import { useLanguage } from '../../../context/language-provider'
import { storyblokEditable } from '@storyblok/react'

const PdpPrice = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()

  const isDiscounted = product.price.originalValue >
    product.price.effectiveValue
  const discount = (100 -
    (((product.price.effectiveValue * 100) / product.price.originalValue) *
      100) / 100).toFixed(
    1,
  )

  return (
    <div className="flex flex-col text-aldiBlue4" {...storyblokEditable()}>
      {isDiscounted && <div
        className="line-through font-aldiCondensed font-bold text-xl">{currentLanguage ===
      'de' ? 'UVP' : 'USP'} {product.price.originalValue}</div>}
      <div className="mb-1 flex flex-row">
        <div
          className="text-4xl font-aldiCondensed font-bold">{product.price.effectiveValue}</div>
        <div>*</div>
        {isDiscounted && <div
          className="ml-5 self-center bg-aldiRed1 h-8 text-white font-aldiCondensed px-1 font-bold text-[30px] leading-[30px]">{`-${discount} %`}</div>}
      </div>
      <div className="flex flex-row text-xs">
        <div className="text-aldiGray4">{getVAT(currentLanguage, true)}</div>
        <div className="text-aldiBlue6 ml-2">{getShipment(
          currentLanguage)}</div>
      </div>
    </div>
  )
}

export default PdpPrice
