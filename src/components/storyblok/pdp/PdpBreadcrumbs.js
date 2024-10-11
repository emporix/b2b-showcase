import { productUrl } from '../../../services/service.config'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import React from 'react'
import { useAuth } from '../../../context/auth-provider'
import { useLanguage } from '../../../context/language-provider'

const PdpBreadcrumbs = ({ blok, ...restProps }) => {
  const category = restProps.product.category
  const { userTenant } = useAuth()
  const { currentLanguage } = useLanguage()

  const categoryTree = [
    {
      caption: currentLanguage === 'de' ?
        'Startseite' :
        'Home', link: '/' + userTenant,
    }]
  let lnk = productUrl()
  for (let c in category) {
    lnk = `${lnk}/${category[c].name.toLowerCase().replaceAll(' ', '_')}`
    categoryTree.push({ caption: category[c].localizedName[currentLanguage], link: lnk })
  }
  return (
    <div className="uppercase">
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            <p
              key={index}
              className="text-xs text-demoHeadlines"
            >
              {row.caption}
            </p>
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color="inherit"
              href={row.link}
            >
              {index !== categoryTree.length - 1 ? (
                <p className="text-xs text-demoHeadlines">{row.caption}</p>
              ) : (
                <p
                  className="text-xs font-bold text-demoHeadlines">{row.caption}</p>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

export default PdpBreadcrumbs
