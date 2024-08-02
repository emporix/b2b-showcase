import { storyblokEditable } from '@storyblok/react'

const PdpAddToCart = ({blok, ...restProps} ) => {
  const product = restProps.product

  return (<div {...storyblokEditable()}>PdpAddToBasket</div>)
}

export default PdpAddToCart
