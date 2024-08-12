import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { cn } from '../../cssUtils'

const PdpTitle = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage, getLocalizedValue } = useLanguage()
  const color = product.mixins?.['Zus\u0061\u0308tzlicheProduktinformationen']?.ProductColorHighlighting
  const specialInformation = product.mixins?.['Zus\u0061\u0308tzlicheProduktinformationen']?.productSpecialInformation

  const getLocalizedSpecialInformation = () => specialInformation && specialInformation.find(item => item.language === currentLanguage).value

  return (
    <>
      <h1 className={cn('text-aldiBlue4 font-bold text-4xl', {
        'text-titleBlack': color === 'Black',
        'text-titleRed': color === 'Red',
        'text-titleBlue': color === 'Blue',
        'text-titleGreen': color === 'Green',
        'text-titleYellow': color === 'Yellow',
        'text-titleOrange': color === 'Orange',
        'text-titlePurple': color === 'Purple',
      })} {...storyblokEditable(blok)}>
        {getLocalizedValue(product.name)}
      </h1>
      {specialInformation && <p className="text-aldiBlue4 font-bold">{getLocalizedSpecialInformation()}</p>}
    </>
  )
}

export default PdpTitle
