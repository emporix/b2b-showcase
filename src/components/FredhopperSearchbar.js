import React, { useRef } from 'react'
import {FredhopperClient} from "../services/search/fredhopper.service";
import {useTranslation} from "react-i18next";
import { useSearch } from '../context/search-context';


const FredhopperSearchbar = () => {
    const { t } = useTranslation('search')

    const client = new FredhopperClient()

    const searchBar = useRef()
    const { searchResults, setSearchResults } = useSearch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchBar.current.querySelector('#search-input').value;

            client.query(query).then(({hits}) => {
                setSearchResults(hits)
            }).catch((err) => {
                console.log(err)
            })
            console.log(searchResults)
            // if (e.target.value) {
            //     navigate(`/search/result`);
            // }

    }

    return (
        <div className="pl-4">
            <form ref={searchBar} onSubmit={handleSubmit}>
                <input
                    id="search-input"
                    className="lg:w-60 xl:w-72 relative !bg-aliceBlue"
                    type="search"
                    placeholder={t('label')}

                />
            </form>
        </div>
    )
}
export default FredhopperSearchbar
