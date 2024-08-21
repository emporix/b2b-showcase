import { useSearch } from '../../context/search-context';

const SearchResultPage = () => {

    const { searchResults } = useSearch();

    return (
        <div>
            <h1>Search Results</h1>
            <ul>
                {searchResults.map((result, index) => (
                    <li key={index}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
}
export default SearchResultPage
