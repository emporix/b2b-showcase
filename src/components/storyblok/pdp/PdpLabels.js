import { storyblokEditable } from '@storyblok/react'
import { Fragment, useEffect, useState } from 'react'
import { getLabel } from '../../../services/product/labels'

const PdpLabels = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [labels, setLabels] = useState([])

  useEffect(() => {
    const labelIds = product?.mixins?.productCustomAttributes?.labels
    labelIds && Promise.all(labelIds.map(labelId => getLabel(labelId))).then(result => {
      setLabels(result)
    })
  }, [product])

  return labels && (<div className="grid grid-cols-[40px,1fr] items-center" {...storyblokEditable(blok)}>
    {labels.map((label) => <Fragment key={label.id}>
      <img className="w-10 h-10 justify-self-center" src={label.image} alt="" />
      <div className="ml-2 text-aldiBlue4">{label.name}</div>
    </Fragment>)}
  </div>)
}

export default PdpLabels
