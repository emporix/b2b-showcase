import React, { useRef, useState } from 'react'
import algoliasearch from 'algoliasearch'
import {
  APPLICATION_ID,
  INDEX_NAME,
  SEARCH_KEY,
  TENANT,
} from '../constants/localstorage'
import { extractProductIDfromObjectID } from '../helpers/algolia'
import { useNavigate } from 'react-router-dom'
import { useContentful } from '../context/contentful-provider'

const tenant = localStorage.getItem(TENANT)

const ProductDisplay = ({ hit }) => {
  const navigate = useNavigate()

  const handleRedirect = (hit) => {
    navigate(
      `/${tenant}/product/details/${extractProductIDfromObjectID(
        hit.objectID
      )}`,
      { replace: true }
    )
  }

  return (
    <div
      className="flex flex-initial p-2 cursor-pointer hover:bg-gray-50 rounded"
      onClick={() => handleRedirect(hit)}
    >
      <img
        className="w-3/12 object-contain p-1 "
        src={hit.image}
        alt={hit.name}
      />
      <div className="pl-2">
        <p className="font-bold text-base lg:text-sm">{hit.name}</p>
        {hit.categories && (
          <p className="text-sm lg:text-xs">{hit.categories.join(' / ')}</p>
        )}
      </div>
    </div>
  )
}

const AlgoliaSearchbar = () => {
  const { fields } = useContentful()
  const client = algoliasearch(
    localStorage.getItem(APPLICATION_ID),
    localStorage.getItem(SEARCH_KEY)
  )
  const index = client.initIndex(localStorage.getItem(INDEX_NAME))
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()
  const searchBar = useRef()

  const handleSearch = (e) => {
    console.log('searching for: ', e.target.value)
    if (e.target.value.length === 0) setSearchResults(() => [])
    else {
      index
        .search(e.target.value)
        .then(({ hits }) => {
          setSearchResults(() => hits)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const handleRedirect = (hit) => {
    searchBar.current.reset()
    setSearchResults([])
    navigate(
      `/${tenant}/product/details/${extractProductIDfromObjectID(
        hit.objectID
      )}`,
      { replace: true }
    )
  }

  const ProductDisplay = ({ hit }) => {
    return (
      <div
        className="flex flex-initial p-2 cursor-pointer hover:bg-gray-50 rounded"
        onClick={() => handleRedirect(hit)}
      >
        <img
          className="w-3/12 object-contain p-1 "
          src={hit.image}
          alt={hit.name}
        />
        <div className="pl-2">
          <p className="font-bold text-base lg:text-sm">{hit.name}</p>
          {hit.categories && (
            <p className="text-sm lg:text-xs">{hit.categories.join(' / ')}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <form ref={searchBar} className="nosubmit">
        <input
          className="nosubmit lg:w-[250px] xl:w-[360px] relative !bg-white"
          type="search"
          placeholder={fields.searchHelpLabel}
          onChange={handleSearch}
        />
      </form>
      {searchResults && searchResults.length > 0 && (
        <div className="lg:w-[250px] xl:w-[360px] mt-0.5 bg-white rounded z-40 absolute shadow-md">
          <div id="autocomplete"></div>
          {searchResults.map((hit) => (
            <ProductDisplay key={hit.objectID} hit={hit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AlgoliaSearchbar
