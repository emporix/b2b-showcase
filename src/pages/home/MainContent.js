import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { useLanguage } from '../../context/language-provider'
import { CMSFilterType, getCmsFilteredPage } from 'services/content/filteredPage.service'
import './content.css'

const removeTenant = ({ path, tenant }) => {
  const target = path
    .split('/')
    .filter((a) => a !== tenant)
    .join('/')
  return target
}

const MainContent = ({ page }) => {
  const [content, setContent] = useState(null)
  const location = useLocation()
  const param = useParams()
  const { currentLanguage, setLanguage } = useLanguage()
  const pageId = useRef(null)
  const currentPage = useRef()

  useEffect(() => {
    const requestPath = removeTenant({ path: location?.pathname || '/', tenant: param?.tenant || '' })

    const getData = async () => {
      const isSamePage = currentPage.current === requestPath
      pageId.current = isSamePage ? pageId.current : undefined

      const pageData = pageId.current
        ? await getCmsFilteredPage(pageId.current, CMSFilterType.IDENTIFIER, currentLanguage)
        : await getCmsFilteredPage(requestPath, CMSFilterType.ROUTE, currentLanguage)

      const route = await pageData.data?.cmsFilteredPage?.page?.route
      route && window.history.replaceState({}, '', '/' + param.tenant + route)

      // dirty solution: in case direct link to an English content page .../Content/Ecological-aspect...
      // as this site default 'de', the target content will not be found so redirect to language en
      currentLanguage === 'de' && !route && setLanguage('en')

      currentPage.current = pageData.data?.cmsFilteredPage?.page?.route
      pageId.current = pageData.data?.cmsFilteredPage?.page?.refId
      setContent(pageData)
    }

    getData()
  }, [currentLanguage, location, param])

  return (
    <div data-preview-id={content?.data?.cmsFilteredPage?.page?.previewId} className="fs-content-wrapper">
      {content ? (
        content.data?.cmsFilteredPage ? (
          <FsGenericComponent data={content?.data} />
        ) : (
          <p>Sorry we could not found the page.</p>
        )
      ) : null}
    </div>
  )
}

export default MainContent
