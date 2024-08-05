import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'

const PdpTitle = ({blok, ...restProps} ) => {
  const product = restProps.product
  const { getLocalizedValue } = useLanguage()

  return (<h1 className="text-aldiBlue4 font-bold text-4xl" {...storyblokEditable(blok)}>
    {getLocalizedValue(product.name)}
  </h1>)
}

export default PdpTitle
