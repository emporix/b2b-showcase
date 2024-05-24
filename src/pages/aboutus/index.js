import React from 'react'
import Layout from '../Layout'
import { TextRegular6 } from '../../components/Utilities/typography'

const Content = () => {
  return (
    <div className="">
      <TextRegular6 className="mt-16 mx-auto px-4 xl:px-0 xl:mx-24 max-w-screen-md">
        We pride ourselves on being a company that focuses on helping businesses
        achieve their goals and increase their profits. We've been in the
        industry for over 12 years now and have an extensive experience in
        helping many companies conquer their goals. Our team has extensive
        experience in various fields such as marketing, finance and logistics.
        We believe that a diverse set of perspectives and backgrounds are
        important when it comes to running a successful business.
      </TextRegular6>
      <TextRegular6 className="mt-8 mx-auto mb-16 px-4 xl:px-0 xl:mx-24 max-w-screen-md ">
        Our mission is to always provide high-quality services to our clients,
        by closely working with them to understand their needs and always being
        ready to tailor their experience whenever that may be needed. Our
        philosophy is that our clients' success is the only way for us to
        succeed and we are committed to helping each and every client reach
        their full potential.
      </TextRegular6>
    </div>
  )
}

const AboutUs = () => {
  return (
    <Layout title={'About Us'}>
      <Content />
    </Layout>
  )
}

export default AboutUs
