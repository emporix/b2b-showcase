import { storyblokEditable } from '@storyblok/react'

const PdpId = ({blok, ...restProps} ) => {
  const product = restProps.product

  return (<div {...storyblokEditable()}>ID</div>)
}

export default PdpId
