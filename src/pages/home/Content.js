import React, { useEffect, useState } from 'react'
import './content.css'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { getCmsFilteredPage } from 'services/content/filteredPage.service'
import { useLanguage } from '../../context/language-provider'

const Content = ({ type, page, classList }) => {
  const [content, setContent] = useState([])
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    const getData = async (currentLang) => {
      const pageData = await getCmsFilteredPage(page, type, currentLang)
      setContent(pageData)
    }

    getData(currentLanguage)
  }, [currentLanguage, page, type])

  return (
    <div className={'content ' + classList}>
      <FsGenericComponent props={content} />
    </div>
  )
}

export default Content
