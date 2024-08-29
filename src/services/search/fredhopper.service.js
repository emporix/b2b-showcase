import { fetchGraphqlApi } from '../../graphql/utils/fetch-graphql-api';
import {CURRENT_LANGUAGE_KEY, useLanguage} from '../../context/language-provider';
import {useSearch} from "../../context/search-context";

const SearchResultQuery = `query SearchResultQuery($filter: String, $query: String, $language: String) {
  searchResults(filter: $filter, query: $query, language: $language) {
    breadcrumbs {
      attributeType
      name
      removeBreadcrumbParams
    }
    facet {
      facetSections {
        name
        urlParams
        availableHits
      }
      title
      expandedFacet {
        type
        urlParams
        nr
      }
    }
    items {
      thumbUrl
      name
      price
      id
      stock
    }
    results {
      totalItems
      startIndex
      viewSize
    }
    queryString
    queryAlternatives {
      alternatives {
        value
        original
        estimatedResult
      }
    }
 	sortParams {
  	  name
  	  urlParams
    }
    
  }
}`;

export const useFredhopperClient = () => {
    const { setSearchResults } = useSearch();
    const {currentLanguage} = useLanguage()
    const query = async ({ query = '', filter = null }) => {

        try {

            const variables = { language: currentLanguage };
            if (filter) {
                variables.filter = filter;
            }
            if (query) {
                variables.query = query;
            }

            const data = await fetchGraphqlApi(SearchResultQuery, variables);
            const hits = data?.data?.searchResults;

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
