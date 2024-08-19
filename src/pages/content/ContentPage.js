import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import MainContent from '../home/MainContent'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HiChevronLeft } from 'react-icons/hi'

const ContentPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('page')

  return (
    <Layout title={t('content')}>
      <div className="pb-12">
        <div className="fs-content-wrapper">
          <button onClick={() => navigate(t('contentPath'))} className="flex items-center">
            <HiChevronLeft size={20} className="h-12 w-8 pr-1" />
            {t('back_to_overview')}
          </button>
        </div>
        <MainContent />
      </div>
    </Layout>
  )
}

export default ContentPage
