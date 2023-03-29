import React, { useEffect, useState } from 'react'
import './brand.css'
import Layout from '../Layout'
import { Container, GridLayout, Item } from '../../components/Utilities/common'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import BrandService from '../../services/product/brand.service'
import { Heading5 } from '../../components/Utilities/typography'

const Wrapper = ({ children }) => {
  return (
    <Container className="items-center grid grid-cols-5 gap-4 w-full text-[14px] leading-[16px] font-bold">
      {children}
    </Container>
  )
}

const ItemsWrapper = ({ children }) => {
  return (
    <Item className="items-center w-full  h-[220px] text-[14px] leading-[16px] font-bold">
      {children}
    </Item>
  )
}

const BrandPage = () => {
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState([])

  useEffect(() => {
    const getBrands = async () => {
      const brands = await BrandService.getBrands()
      setBrand(brands)
      setLoading(false)
    }
    getBrands()
  }, [])
  return (
    <div className="brand-page-wrapper text-center w-full">
      {loading ? (
        <LoadingCircleProgress1 />
      ) : (
        <GridLayout className="justify-end gap-6 mt-7 max-w-screen-lg m-auto text-right">
          <Wrapper>
            {brand.map((b, key) => (
              <ItemsWrapper key={key}>
                <Item className="h-4/5 px-4 flex items-center ">
                  <img src={b.image} alt={b.name} />
                </Item>
                <Item className="px-6 py-2 text-center">
                  <Heading5>{b.name}</Heading5>
                </Item>
              </ItemsWrapper>
            ))}
          </Wrapper>
        </GridLayout>
      )}
    </div>
  )
}
const Brand = () => {
  const title = `Brands`
  return (
    <Layout title={title}>
      <BrandPage />
    </Layout>
  )
}
export default Brand
