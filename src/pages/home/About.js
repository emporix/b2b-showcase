import React, { useEffect, useState } from 'react'
import { useContentful } from '../../context/contentful-provider'
import DemoBanner from './DemoBanner'
import landingBg from '../../assets/landing_bg.png'
import './about.css'
import { Box } from '@mui/material'

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

  return (
    <div
      // style={{ backgroundImage: `url(${landingBg})` }}
      className="home_about"
    >
    <div className="mx-6 md:ml-16 mt-[48px] md:mt-[114px] w-[492px]">
          <div className="text-[48px] md:text-[48px] font-inter font-semibold md:leading-[64px] leading-[56px]">
            {fields.mainTitle}
          </div>
          <div className="text-[18px] leading-[30px] font-inter font-normal pt-[24px] md:max-w-[525px]">
            {fields.companyMission}
          </div>
          <div className="pt-[44px] desktop_only text-sm">
              <button className="px-6 py-4 font-semibold bg-yellow text-eerieBlack rounded">
                {fields.startShoppingButtonLabel}
              </button>
          </div>
        </div>      
    </div>
  )
}

export default About
