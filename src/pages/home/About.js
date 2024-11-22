import React, { useEffect, useState } from 'react'
import { useContentful } from '../../context/contentful-provider'
import DemoBanner from './DemoBanner'
import landingBg from '../../assets/landing_bg.png'
import './about.css'
import { Box } from '@mui/material'
import { useCustomStyleContext } from 'context/custom-styles-provider'

const About = () => {
  const { fields } = useContentful()
  const { banner } = useCustomStyleContext()

  const [introImageUrl, setIntroImageUrl] = useState('')

  const { mainImageRight } = fields

  useEffect(() => {
    ; (async () => {
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
    <div className="home_about">
      <video
        className="mega-banner-media--video"
        data-object-fit="cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          type="video/mp4"
          src="https://static.commerce.aws.flender.cloud/sys-master/images/hca/hf2/10461905322014/40sek_A_FHD.mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default About
