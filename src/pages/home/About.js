import React, { useEffect, useState } from 'react'
import { useContentful } from '../../context/contentful-provider'
import landingBg from '../../assets/landing_bg.png'
import { useAuth } from '../../context/auth-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../integration/voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { Box } from '@mui/system'
import { getQualificationsWithItemsExtended } from '../../integration/voucherify/voucherifyApi'
import { Qualification } from '../shared/Qualification'
import { CUSTOMER_ADDITIONAL_METADATA } from '../../constants/localstorage'
import { getCustomerAdditionalMetadata } from '../../helpers/getCustomerAdditionalMetadata'
const About = () => {
  const { fields } = useContentful()
  const [introImageUrl, setIntroImageUrl] = useState('')

  const { mainImageRight } = fields

  useEffect(() => {
    ;(async () => {
      if (
        mainImageRight &&
        mainImageRight.fields &&
        mainImageRight.fields.file &&
        mainImageRight.fields.file.url
      ) {
        setIntroImageUrl(mainImageRight.fields.file.url)
      }
    })()
  }, [mainImageRight])

  const { user } = useAuth()
  const [qualifications, setQualifications] = useState([])

  useEffect(() => {
    ;(async () => {
      const customer = mapEmporixUserToVoucherifyCustomer(
        user,
        getCustomerAdditionalMetadata()
      )
      setQualifications(
        await getQualificationsWithItemsExtended('AUDIENCE_ONLY', [], customer)
      )
    })()
  }, [user])

  return (
    <Box
      style={{ backgroundImage: `url(${landingBg})` }}
      className="home_about"
      sx={{ minWidth: '500px' }}
    >
      <Box className="px-6 md:pl-16 pt-[48px]" sx={{ m: 3, mt: 20 }}>
        <div className="text-[40px] md:text-[56px] font-inter font-semibold leading-[48px] md:leading-[64px]">
          {fields.mainTitle}
        </div>
        <div className="text-[20px] leading-[32px] font-inter font-light pt-[27px] md:max-w-[525px]">
          {fields.companyMission}
        </div>

        <div
          className="pt-[78px] desktop_only text-sm"
          style={{ marginTop: -50 }}
        >
          <button className="px-6 py-4 border font-bold">
            {fields.startShoppingButtonLabel}
          </button>
        </div>
        <Box
          sx={{
            mt: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {qualifications.map((qualification) => (
            <Qualification
              key={qualification.id}
              qualification={qualification}
            />
          ))}
        </Box>
      </Box>
      <img
        src={introImageUrl}
        className=" mt-[60px] hidden xl:block w-[530px] h-[818px] "
      />
    </Box>
  )
}

export default About
