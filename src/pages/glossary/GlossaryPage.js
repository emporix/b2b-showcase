import Layout from '../Layout'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CMSDataSourceType, getCmsDataSets } from '../../services/content/dataSource.service'
import { useLanguage } from '../../context/language-provider'

const GlossaryPage = () => {
  const [newsData, setNewsData] = useState();
  const { currentLanguage } = useLanguage()
  const {t} = useTranslation("page");

  useEffect(() => {
    const getNews = async (currentLang) => {
      setNewsData(await getCmsDataSets(CMSDataSourceType.GLOSSARY,  currentLang));
    }
    getNews(currentLanguage)
  }, [currentLanguage])

  return (
    <Layout title={t('glossary')}>
      <div className="fs-content-wrapper">
        <table className="table-fixed">
          <thead>
          <tr>
            <th className="border p-3">{t("glossary_term")}</th>
            <th className="border p-3">{t("glossary_descr")}</th>
          </tr>
          </thead>
          <tbody>
          {newsData?.data?.cmsDataSource?.items?.map((item) =>
            <GlossaryEntry item={item} key={item.id} />,
          )}
          </tbody>
        </table>
      </div>

    </Layout>
)
}

const GlossaryEntry = ({
  item
}) => {
  return <tr className="hover:bg-amber-50 p-2">
    <td className="border p-1">{item.data.tt_title}</td>
    <td className="border p-1">
      {item.data?.tt_text ? item.data?.tt_text.map((textItem) => {
        return <p className="text-lg text-eerieBlack font-light pt-1 mt-2 md:first-of-type:mt-0 md:first-of-type:pt-0">{textItem.content[0]?.content}</p>
      }) : null}
    </td>
  </tr>
}


export default GlossaryPage
