import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import HtmlTextBox from '../HtmlTextBox'

const PdpDescription = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { getLocalizedValue } = useLanguage()

  return (
    <div className="md:max-w-none max-w-none w-full prose prose-ul:mt-0 prose-li:mt-0 prose-li:mb-2 prose-li:marker:text-demoFontHighlightColor prose-li:text-demoFontHighlightColor prose-headings:text-demoFontHighlightColor prose-p:text-demoFontHighlightColor" {...storyblokEditable(blok)}>
      <HtmlTextBox
         {...storyblokEditable(
        blok)}
        text={getLocalizedValue(product.description)}
      />
    </div>
  )
}

export default PdpDescription
