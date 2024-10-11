import { storyblokEditable } from '@storyblok/react'
import { Fragment, useEffect, useState } from 'react'
import { getLabel } from '../../../services/product/labels'
import { priceValidDate } from '../../../helpers/price'
import CounDownLabel from './CountDownLabel'

const PdpLabels = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [labels, setLabels] = useState([])
  const evaluatedPriceValidDate = priceValidDate(product)
  const newDeliveryTime = product.mixins?.WeitereProduktinformationen?.deliveryTimeDayRange
  const adjustDeliveryTime = (text) => {
    return newDeliveryTime ? text.replace("1 - 3", newDeliveryTime) : text
  }

  useEffect(() => {
    const labelIds = product?.mixins?.productCustomAttributes?.labels
    labelIds && Promise.all(labelIds.map(labelId => getLabel(labelId))).then(result => {
      setLabels(result)
    })
  }, [product])

  return labels && (<div className="grid grid-cols-[50px,1fr] auto-rows-[50px] items-center" {...storyblokEditable(blok)}>
    {evaluatedPriceValidDate > new Date() && <CounDownLabel targetDate={evaluatedPriceValidDate} />}
    {labels.map((label) => <Fragment key={label.id}>
      <img className="justify-self-center" src={label.image} alt="" />
      <div className="ml-2 text-demoHeadlines">{adjustDeliveryTime(label.name)}</div>
    </Fragment>)}
  </div>)
}

export default PdpLabels
