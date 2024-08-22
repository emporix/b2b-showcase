import { useSearch } from '../../context/search-context';

const SearchResultPage = () => {

    const { searchResults } = useSearch();

    return (
        <div>
            <h1>Search Results</h1>
            <ul>
                {searchResults}
            </ul>
        </div>
    );
}
export default SearchResultPage
