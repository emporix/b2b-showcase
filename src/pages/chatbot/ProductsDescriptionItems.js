import { useEffect, useState } from 'react'
import { useLanguage } from 'context/language-provider'
import { CMSFilterType, getCmsFilteredPage } from 'services/content/filteredPage.service'
import { useTranslation } from 'react-i18next'
import { i18nPCADescriptionSuffix, i18nProductCustomAttributesNS } from './ProductsDescription'
import { nanoid } from '@reduxjs/toolkit'
import { default as FSComponent } from './ProductsDescriptionFSContents'

const getAttributes = (items, currentLanguage) => {
  let res = []
  Object.keys(items).forEach((key) => {
    let value = items[key]

    if (Array.isArray(value) && currentLanguage === 'en') value = value[1].value
    else if (Array.isArray(value) && currentLanguage === 'de') value = value[0].value
    else if (typeof value === 'string') value = items[key]
    else value = ''

    res.push({ property: key, value: value })
  })
  return res
}

const ProductsDescriptionItems = ({ content, fsTitle }) => {
  const [data, setData] = useState([])
  const { currentLanguage } = useLanguage()

  const { t } = useTranslation(i18nProductCustomAttributesNS)

  const type = CMSFilterType.PRODUCT

  useEffect(() => {
    const getData = async () => {
      const pageData = await getCmsFilteredPage(content.id, type, currentLanguage)
      setData(pageData?.data?.cmsFilteredPage?.page?.children?.[0]?.children || null)
      // console.log(pageData)
    }

    getData()
  }, [currentLanguage, content, type])

  const basicInfo = Object.keys(content?.mixins).map((key) => content?.mixins?.[key])

  return (
    <article>
      <h3>{content.name}</h3>
      <h5>Code: {content.code}</h5>
      <p>{content.description}</p>

      {basicInfo.map((items) => (
        <ol key={nanoid()}>
          {getAttributes(items, currentLanguage).map((row) => (
            <li key={nanoid()}>
              {`${t(row.property + i18nPCADescriptionSuffix)}
              : ${row.value}`}
            </li>
          ))}
        </ol>
      ))}
      {/* {data && console.log(data)} */}

      <div className="bg-slate-50">
        <h4>{fsTitle}</h4>
        {data && data?.map((item) => <FSComponent components={item} key={nanoid()} />)}
      </div>
    </article>
  )
}

export default ProductsDescriptionItems
