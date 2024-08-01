import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import HtmlTextBox from '../HtmlTextBox'

const PdpDescription = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { getLocalizedValue } = useLanguage()

  return (
    <div className="prose prose-li:marker:text-aldiBlue4 prose-li:text-aldiBlue4 prose-headings:text-aldiBlue4 prose-p:text-aldiBlue4">
      <HtmlTextBox
         {...storyblokEditable(
        blok)}
        text={getLocalizedValue(product.description)}
      />
    </div>
  )
}

export default PdpDescription
