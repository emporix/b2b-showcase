import Layout from '../Layout'
import { useLanguage } from '../../context/language-provider'
import { useNavigate } from 'react-router-dom'
import { CMSFilterType } from '../../services/content/filteredPage.service'
import Content from '../home/Content'

const ContentPage = () => {
  const { currentLanguage } = useLanguage()
  const navigate = useNavigate()

  let route = window.location.pathname
  route = route.substring('/n11showcase'.length)

  return (
    <Layout>
      <div>
        {currentLanguage === 'en' ? (
          <button onClick={() => navigate('/n11showcase/Content')}>
            Back to Overview
          </button>
        ) : (
          <button onClick={() => navigate('/n11showcase/Inhalt')}>
            Zurück zur Übersicht
          </button>
        )}
        <Content page={route} type={CMSFilterType.PAGE_FOR_SEO_ROUTE} />
      </div>
    </Layout>
  )
}

export default ContentPage
