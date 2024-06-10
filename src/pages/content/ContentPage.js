import Layout from '../Layout'
import { useNavigate, useParams } from 'react-router-dom'
import MainContent from '../home/MainContent'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ContentPage = () => {
  const navigate = useNavigate()
  const param = useParams()
  const { t } = useTranslation('page')

  const [route, setRoute] = useState(window.location.pathname.substring('/n11showcase'.length))

  useEffect(() => {
    setRoute(`/${t('content')}/${param.contentName}/`)
  }, [param, t])

  return (
    <Layout title="inhalt">
      <div className="pb-12">
        <div className="fs-content-wrapper">
          <button onClick={() => navigate(t('contentPath'))}>{t('back_to_overview')}</button>
        </div>
        <MainContent page={route} />
      </div>
    </Layout>
  )
}

export default ContentPage
