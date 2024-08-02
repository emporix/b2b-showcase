import { productUrl } from '../../../services/service.config'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import React from 'react'
import { useAuth } from '../../../context/auth-provider'

const PdpBreadcrumbs = ({ blok, ...restProps }) => {
  const category = restProps.product.category
  const { userTenant } = useAuth()

  const categoryTree = [{ caption: 'Startseite', link: '/' + userTenant }]
  let lnk = productUrl()
  for (let c in category) {
    lnk = `${lnk}/${category[c].toLowerCase().replaceAll(' ', '_')}`
    categoryTree.push({ caption: category[c], link: lnk })
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
              className="text-xs text-aldiBlue4"
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
                <p className="text-xs text-aldiBlue4">{row.caption}</p>
              ) : (
                <p className="text-xs font-bold text-aldiBlue4">{row.caption}</p>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
     </div>
  )
}

export default PdpBreadcrumbs
