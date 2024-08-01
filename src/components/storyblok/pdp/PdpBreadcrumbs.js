import { productUrl } from '../../../services/service.config'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
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
    <div className="text-aldiBlue4 text-[10px] uppercase">
      <Breadcrumbs
        className="lg:block hidden"
        separator=">"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            <Typography
              key={index}
              className="breadcrumb-item"
              color="text.primary"
            >
              {row.caption}
            </Typography>
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color="inherit"
              href={row.link}
            >
              {index !== categoryTree.length - 1 ? (
                row.caption
              ) : (
                <p className="font-bold">{row.caption}</p>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs
        className="lg:hidden md:block hidden"
        separator=">"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            ''
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 2 ? 'text.primary' : 'inherit'
              }
              href="/"
            >
              {row.caption}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs className="md:hidden" separator=">" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return categoryTree.length - index > 1 &&
          categoryTree.length - index < 4 ? (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 1 ? 'text.primary' : 'inherit'
              }
              href="/"
            >
              {row.caption}
            </Link>
          ) : (
            ''
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

export default PdpBreadcrumbs
