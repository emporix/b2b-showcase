import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import HtmlTextBox from '../HtmlTextBox'

const PdpUSPs = ({blok, ...restProps} ) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()

  const getLocalizedUSPs = () => {
    const usps = product?.mixins?.productAdditionalInformation?.productHighlights
    return usps.filter(usp => usp.language === currentLanguage)[0]?.value
  }

  return (<div className="text-aldiBlue4" {...storyblokEditable(blok)}>
    <HtmlTextBox text={getLocalizedUSPs()} />
  </div>)
}

export default PdpUSPs
