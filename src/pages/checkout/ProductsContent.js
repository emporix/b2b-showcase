import { useCart } from 'context/cart-provider'
import React, { useEffect } from 'react'
import {
  Container,
  CurrencyBeforeValue,
  GridLayout,
  LayoutBetween,
} from '../../components/Utilities/common'
import {
  Heading4,
  Heading5,
  TextBold5,
  TextBold6,
  TextRegular4,
} from '../../components/Utilities/typography'
import './checkout.css'

const ProductContent = () => {
  const { products } = useCart()
  return (
    <GridLayout className="gap-6">
      <GridLayout className="gap-6 ">
        {products.map((product) => (
          <Container key={product.sku} className="gap-6 w-full">
            <img src={product.src} className={'checkout-product-image'} />

            <GridLayout className="lg:w-[650px] md:w-[450px] w-[400px] ">
              <TextBold5>{product.name}</TextBold5>
              <Container>
                <TextBold6>SKU:</TextBold6>
                <TextRegular4>&nbsp;{product.sku}</TextRegular4>
              </Container>
              <LayoutBetween>
                <Container>
                  <TextBold6>Quantity:</TextBold6>
                  <TextRegular4>&nbsp;{product.quantity}</TextRegular4>
                </Container>
                <Heading5>
                  <CurrencyBeforeValue value={product.price} />
                </Heading5>
              </LayoutBetween>
            </GridLayout>
          </Container>
        ))}
      </GridLayout>
    </GridLayout>
  )
}

export default ProductContent
