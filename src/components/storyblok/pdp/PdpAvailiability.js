import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector
} from '../../../redux/slices/availabilityReducer'
import { cn } from '../../cssUtils'

const PdpAvailiability = ({blok, ...restProps} ) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const availability = useSelector(availabilityDataSelector)

  const available = availability['k' + product.id]?.available
  const stockLevel = availability['k' + product.id]?.stockLevel

  const productAvailable = stockLevel > 0

  const availabilityText = () => {
    if (productAvailable) {
      return currentLanguage === "de" ? "Verfügbar" : "Available"
    } else {
      return currentLanguage === "de" ? "Nicht verfügbar" : "Not available"
    }
  }

  return (<div className={cn('text-aldiBlue4 font-bold', {
    "text-aldiRed1": !productAvailable,
    "text-limeGreen": productAvailable
  })} {...storyblokEditable(blok)}>
    {availabilityText()} {productAvailable && blok.showAvailableAmount && ` (${stockLevel})`}
  </div>)
}

export default PdpAvailiability
