import React from 'react'
import Layout from '../Layout'
import "./content.css"

const Content = () => {
  return (
    <>
      <center>
        <iframe
          src={"https://mach11.zendesk.com/hc/de-de"}
        >
        </iframe>
      </center>
    </>
  )
}

const HelpCenter = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}

export default HelpCenter
