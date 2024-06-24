import { fetchGraphqlApi } from '../../graphql/utils/fetch-graphql-api'

const DataSourceQuery = `query CmsDataSource($templateUid: String!, $language: Language) {
  cmsDataSource(template_uid: $templateUid, language: $language) {
    pagesize
    items
    page
  }
}`

export const CMSDataSourceType = {
    NEWS: "n11.news",
    GLOSSARY: "n11.glossary",
}
export const getCmsDataSets = async (type, language) => {
    const data = await fetchGraphqlApi(DataSourceQuery, {templateUid:type, language:language })
    return data;
}