import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import HtmlTextBox from '../HtmlTextBox'

const PdpUSPs = ({blok, ...restProps} ) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const usps = product?.mixins?.productAdditionalInformation?.productHighlights
  const getLocalizedUSPs = () => usps.filter(usp => usp.language === currentLanguage)[0]?.value

  return (usps && <div className="text-demoHeadlines" {...storyblokEditable(blok)}>
    <HtmlTextBox text={getLocalizedUSPs()} />
  </div>)
}

export default PdpUSPs
