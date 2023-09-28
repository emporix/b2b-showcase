import React, { useEffect, useState } from 'react'
import { useContentful } from '../../context/contentful-provider'
import DemoBanner from './DemoBanner'
import landingBg from '../../assets/landing_bg.png'
import './about.css'
import { Box } from '@mui/material'
import { useSites } from '../../context/sites-provider';

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

  const { currentSite } = useSites();

  // Function to determine the correct class
  const determineClass = () => {
      switch(currentSite) {
          case "main":
          case "walbusch-at":
          case "walbusch-ch":
              return 'home_about';
          case "lashoe":
              return 'home_about_lashoe';
          case "Mey-Edlich":
              return 'home_about_mey-edlich';
          default:
              return 'home_about';  // default class
      }
  };

  return (
    <div
      // style={{ backgroundImage: `url(${landingBg})` }}
      className={determineClass()}
    >
    <div className="mx-6 md:ml-16 mt-[48px] md:mt-[114px] w-[492px]">
          <DemoBanner />
          <div className="text-[48px] md:text-[48px] font-inter font-semibold md:leading-[64px] leading-[56px]">
            {/* do not show: {fields.mainTitle} */}
          </div>
          <div className="text-[18px] leading-[30px] font-inter font-normal pt-[24px] md:max-w-[525px]">
            {/* do not show: {fields.companyMission} */}
          </div>
          <div className="pt-[44px] desktop_only text-sm">
              {/* do not show: 
              <button className="px-6 py-4 font-semibold bg-yellow text-eerieBlack rounded">
                {fields.startShoppingButtonLabel} 
              </button>
              */}
          </div>
        </div>      
    </div>
  )
}

export default About
