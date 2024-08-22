import { fetchGraphqlApi } from '../../graphql/utils/fetch-graphql-api'
import {CURRENT_LANGUAGE_KEY} from "../../context/language-provider";


const SearchResultQuery = `query SearchResultQuery($language: String, $query: String, $filter: String) {
  searchResults(language: $language, query: $query, filter: $filter) {
    info
  }
}`
export class FredhopperClient {

    query = async (query, filter) => {

        const language = localStorage.getItem(CURRENT_LANGUAGE_KEY)

        const variables = { language };
        if (filter) {
            variables.filter = filter;
        }
        if (query) {
            variables.query = query;
        }

        return await fetchGraphqlApi(SearchResultQuery, variables);

    }
}
