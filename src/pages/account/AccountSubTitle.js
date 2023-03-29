import { Container } from '../../components/Utilities/common'
import React from 'react'
import { Heading3, TextRegular5 } from '../../components/Utilities/typography'

const AccountSubTitle = ({ title, detail, className }) => {
  return (
    <Container
      className={`${className} font-inter font-bold text-2xl text-tinBlue pb-6 border-b border-lightGray`}
    >
      <Heading3>{title} &nbsp;</Heading3>
      {detail !== undefined ? (
        <TextRegular5 className="text-tinBlue">{detail}</TextRegular5>
      ) : (
        <></>
      )}
    </Container>
  )
}

export default AccountSubTitle
