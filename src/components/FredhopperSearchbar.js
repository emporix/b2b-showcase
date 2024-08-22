import React, { useRef } from 'react'
import {FredhopperClient} from "../services/search/fredhopper.service";
import {useTranslation} from "react-i18next";
import { useSearch } from '../context/search-context';
import {useNavigate} from "react-router-dom";
import {TENANT} from "../constants/localstorage";



const FredhopperSearchbar = () => {
    const { t } = useTranslation('search')

    const client = new FredhopperClient()
    const navigate = useNavigate()
    const searchBar = useRef()
    const { setSearchResults } = useSearch();
    const tenant = localStorage.getItem(TENANT)
    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchBar.current.querySelector('#search-input').value;

            client.query(query).then((hits) => {
                setSearchResults(hits)
                if (hits) {
                    navigate(`/${tenant}/search/result`);
                }
            }).catch((err) => {
                console.log('Search error: ', err)
            })
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
