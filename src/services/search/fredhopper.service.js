import { fetchGraphqlApi } from '../../graphql/utils/fetch-graphql-api';
import { CURRENT_LANGUAGE_KEY } from '../../context/language-provider';
import {useSearch} from "../../context/search-context";

const SearchResultQuery = `query SearchResultQuery($language: String, $query: String, $filter: String) {
  searchResults(language: $language, query: $query, filter: $filter) {
    info
  }
}`;

export const useFredhopperClient = () => {
    const { setSearchResults } = useSearch();
    const query = async ({ query = '', filter = null }) => {

        try {
            const language = localStorage.getItem(CURRENT_LANGUAGE_KEY);

            const variables = { language };
            if (filter) {
                variables.filter = filter;
            }
            if (query) {
                variables.query = query;
            }

            const data = await fetchGraphqlApi(SearchResultQuery, variables);
            const hits = data?.data?.searchResults?.info;

            if (setSearchResults) {
                setSearchResults(hits);
            }
            return hits;
        } catch (err) {
            throw err;
        }
    };

    return { query };
};
