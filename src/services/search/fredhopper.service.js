import { CURRENT_LANGUAGE } from '../../constants/localstorage'
import { fetchGraphqlApi } from '../../graphql/utils/fetch-graphql-api'

const baseUrl = 'https://fdppartner3-config-live1.fas.eu-west-1.fdp-sales.fredhopperservices.com/fredhopper/query'

const SearchResultQuery = `query SearchResultQuery($url: Url) {
  searchResult(url: $url) {
    
  }
}`
export class FredhopperClient {

    currentLanguageKey = localStorage.getItem(CURRENT_LANGUAGE)

    languageMap = {
        de: 'de_DE',
        en: 'en_GB'
    }


    query = async (query) => {
        const url = `${baseUrl}?fh_location=//catalog01/${this.languageMap[this.currentLanguageKey]}/$s=${query}`

        return await fetchGraphqlApi(SearchResultQuery, {url: url})

    }

}
