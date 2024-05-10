import Layout from '../Layout'
import './content.css'
import { getLocalizedCmsNavigation } from '../../services/content/navigation.service'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/language-provider'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ContentOverview = () => {
  const [content, setContent] = useState([])
  let { currentLanguage } = useLanguage()
  const navigate = useNavigate()
  const {t} = useTranslation("page")
  const getData = async () => {
    let data = await getLocalizedCmsNavigation(currentLanguage)
    data = data.data.cmsNavigation.filter((item) => {
      return (
        (item.seoRoute?.startsWith('/Content') ||
          item.seoRoute?.startsWith('/Inhalt')) &&
        item.label !== 'Content' &&
        item.label !== 'Inhalt'
      )
    })

    setContent(data)
  }

  useEffect(() => {
    getData()
  }, [currentLanguage])

  return (
    <Layout title={t("content")}>
      <div>
        {content.map((item, index) => (
          <div key={index}>
            <button onClick={() => navigate('/n11showcase' + item.seoRoute)}>
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default ContentOverview
