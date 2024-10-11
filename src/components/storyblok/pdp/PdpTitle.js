import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { cn } from '../../cssUtils'

const PdpTitle = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage, getLocalizedValue } = useLanguage()
  const color = product.mixins?.WeitereProduktinformationen?.productColorHighlighting
  const specialInformation = product.mixins?.WeitereProduktinformationen?.productSpecialInformation

  const getLocalizedSpecialInformation = () => specialInformation && specialInformation.find(item => item.language === currentLanguage).value

  return (
    <>
      <h1 className={cn('text-demoFontHighlightColor font-bold text-4xl', {
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
      {specialInformation && <p className="text-demoFontHighlightColor font-bold">{getLocalizedSpecialInformation()}</p>}
    </>
  )
}

export default PdpTitle
