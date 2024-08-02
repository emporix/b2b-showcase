import { storyblokEditable } from '@storyblok/react'

const PdpId = ({blok, ...restProps} ) => {
  const product = restProps.product

  return (<div className="text-xs text-aldiGray4" {...storyblokEditable()}>{product.code} ({product.id})</div>)
}

export default PdpId
