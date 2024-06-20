import { useContentful } from '../context/contentful-provider'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { homeUrl } from '../services/service.config'
import newLogo from '../assets/new_logo.svg'

export const Logo = ({ onMouseOver, size, text }) => {
  const { fields } = useContentful()

  const [logoUrl, setLogoUrl] = useState('')
  const { companyLogo } = fields
  const classes = size ? size : 'w-[37px]'
  const typo = text ? text : 'px-4 text-eerieBlack text-[25px]'

  useEffect(() => {
    ;(async () => {
      if (companyLogo && companyLogo.fields && companyLogo.fields.file && companyLogo.fields.file.url) {
        setLogoUrl(companyLogo.fields.file.url)
      }
    })()
  }, [companyLogo])
  //todo get image from cms
  return (
    <Link to={homeUrl()} className="flex" onMouseOver={onMouseOver}>
      <img id="logo-img" src="/img/n11logo.png" alt={'Logo'} className="object-contain" />
    </Link>
  )
}
