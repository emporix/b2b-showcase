import React, { useEffect, useState } from 'react'
import './content.css'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { getCmsFilteredPage } from 'services/content/filteredPage.service'
import { useLanguage } from '../../context/language-provider'

const Content = ({ type, page, classList, title }) => {
  const [content, setContent] = useState([])
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    const getData = async () => {
      const pageData = await getCmsFilteredPage(page, type, currentLanguage)
      setContent(pageData)
    }

    getData()
  }, [currentLanguage, page, type])

  return (
    <div className={'content ' + (classList || '')}>
      {title ? <h2 className="font-bold text-2xl text-center lg:text-left pb-2 border-b-2">{title}</h2> : null}
      <FsGenericComponent data={content?.data} />
    </div>
  )
}

export default Content
