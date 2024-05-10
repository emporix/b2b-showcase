import Layout from '../Layout'
import { useLanguage } from '../../context/language-provider'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CMSFilterType } from '../../services/content/filteredPage.service'
import MainContent from '../home/MainContent'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProductListBanner from '../product/ProductListBanner'

const ContentPage = () => {
  const navigate = useNavigate()
  const param = useParams()
  const {t} = useTranslation("page")

  const [route, setRoute] = useState(window.location.pathname.substring('/n11showcase'.length));

  useEffect(()=>{
    setRoute(`/${ t("content")}/${ param.contentName}/`)
  }, [param])
  return (
    <Layout>
      <div className="px-4 md:px-24 pb-12">
        <button onClick={() => navigate(t('contentPath'))}>
            {t("back_to_overview")}
          </button>
        <MainContent page={route}/>
      </div>
    </Layout>
  )
}

export default ContentPage
