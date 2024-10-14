import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector
} from '../../../redux/slices/availabilityReducer'
import { cn } from '../../cssUtils'
import { isPriceValid } from '../../../helpers/price'

const PdpAvailiability = ({blok, ...restProps} ) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const availability = useSelector(availabilityDataSelector)
  const stockLevel = availability['k' + product.id]?.stockLevel
  const productAvailable = stockLevel > 0
  const priceValid = isPriceValid(product)

  const availabilityText = () => {
    if (!priceValid) {
      return currentLanguage === "de" ? "Nur so lange der Vorrat reicht" : "Only while stocks last"
    }
    if (productAvailable) {
      return currentLanguage === "de" ? "Verfügbar" : "Available"
    } else {
      return currentLanguage === "de" ? "Nicht verfügbar" : "Not available"
    }
  }

  return (<div className={cn('text-demoHeadlines font-bold', {
    "text-demoAlerting": !productAvailable,
    "text-green-600": productAvailable && priceValid
  })} {...storyblokEditable(blok)}>
    {availabilityText()} {productAvailable && blok.showAvailableAmount && (priceValid && ` (${stockLevel})`)}
  </div>)
}

export default PdpAvailiability
