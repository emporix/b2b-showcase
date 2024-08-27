import React, {useEffect, useState} from "react";
import {Checkbox} from "@mui/material";
import {useFredhopperClient} from "../../services/search/fredhopper.service";
import {useTranslation} from "react-i18next";
import {CurrencyBeforeValue} from "../../components/Utilities/common";
import {StockLevel} from "../../components/Product/availability";
import {getLanguageFromLocalStorage, useLanguage} from "../../context/language-provider";
import {ACCESS_TOKEN} from "../../constants/localstorage";
import ApiRequest from "../../services";
import {productApi} from "../../services/service.config";
import {useSearch} from "../../context/search-context";
import Layout from "../Layout";
import {HiOutlineArrowLeft, HiOutlineArrowRight} from "react-icons/hi";


const SearchResultPage = () => {

    const {searchResults} = useSearch();
    const {query} = useFredhopperClient()
    const { t } = useTranslation('page')
    const {currentLanguage} = useLanguage()
    useEffect( () => {
        if (!searchResults || searchResults.length === 0) {
            async function getInitData() {
                await query({});
            }
            getInitData();
        }

        if (searchResults) {
            async function getInitDataWithFilter() {
                const urlParams = new URLSearchParams(searchResults.queryString);
                let location = urlParams.get('fh_location');
                if (location){
                    const result = location?.match(/\/(\w{2}_\w{2})/); //matches a string in the form of /xx_xx e.g. /de_DE or /en_GB

                    const locale = result[1];
                    if (locale === 'de_DE' && currentLanguage === 'en') {
                        location = location.replace('/de_DE', '/en_GB');
                        urlParams.set('fh_location', location);
                        const filter = urlParams.toString()
                        await query({ filter: filter });
                    } else if (locale === 'en_GB' && currentLanguage === 'de') {
                        location = location.replace('/en_GB', '/de_DE');
                        urlParams.set('fh_location', location);
                        const filter = urlParams.toString()
                        await query({ filter: filter });
                    }
                }
            }
            getInitDataWithFilter();
        }
    },[searchResults, currentLanguage])
    return (
        <Layout title={t('wines')}>
            <div>
                <div className='px-4 md:px-24 pb-12'>
                    <div className='mt-8 w-auto relative'>
                        <div className='flex gap-4 xl:gap-12'>
                            <FilterPanel props={searchResults}/>
                            <ResultPanel props={searchResults}/>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const FilterPanel = ({props}) => {
    return  (
        <div id='filterdrawer' className='flex-auto lg:w-[23%] bg-aliceBlue p-4 rounded-xl hidden lg:block'>
            <div className='relative'>
                <BreadcrumbsPanel
                    props={props}
                />
                <FacetsPanel
                    facet={props.facet}
                />
            </div>
        </div>
    )
}

const BreadcrumbsPanel = ({ props }) => {
    const {query} = useFredhopperClient()
    const handleClick = async (alternative) => {
        await query({query:`${alternative?.value}`})
    }

    return (
        <ul className="list-none p-0 m-0">
            {props?.breadcrumbs?.map((breadcrumb, index) => {
                const isSearchBreadcrumb = breadcrumb?.attributeType === "Search" || breadcrumb?.attributeType === "Suche";

                return (
                    <li key={index} className={isSearchBreadcrumb ? 'mb-2' : ''}>
                        <span className='font-semibold'>{breadcrumb?.attributeType}</span>
                        <div className='flex flex-wrap items-center'>
                            <div className='flex items-center mr-2'>
                                <FilterPanelCheckbox
                                    checked={true}
                                    filter={breadcrumb.urlParams}
                                    removeFilter={breadcrumb.removeBreadcrumbParams}
                                />
                                <div className={`ml-2 ${isSearchBreadcrumb ? 'ml-2' : ''}`}>
                                    <label className='cursor-pointer' title={breadcrumb?.name}>
                                        {breadcrumb?.name}
                                    </label>
                                </div>
                            </div>
                        </div>
                        {isSearchBreadcrumb && props?.queryAlternatives?.alternatives?.length > 0 && (

                            <div className='flex flex-wrap ml-2'>
                                <div className='flex flex-col'>
                                    {props.queryAlternatives.alternatives.map((alternative, index) => (
                                        <div key={index} className='flex items-center mb-2'>
                                            <span className='text-manatee'>{"->"}</span>
                                            <div className='flex items-center' onClick={handleClick}>
                                                <label
                                                    className='text-manatee pl-3 cursor-pointer'
                                                    title={alternative?.value}
                                                >
                                                    "{alternative?.value}"
                                                </label>
                                                <div className='text-manatee pl-3 cursor-pointer'>
                                                    ({alternative?.estimatedResult})
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};


const FacetsPanel = ({facet}) => {
    return (
        <ul>
            {facet?.map((filter, index) => (
                <li key={index}>
                    <span className='category_pan_title'>{filter?.title}</span>
                    <ul>
                        {filter?.facetSections?.map((facetsection, subIndex) => (
                            <li key={subIndex}>
                                <div className='flex'>
                                    <div className='flex'>
                                        <FilterPanelCheckbox checked={false}
                                                             filter={facetsection.urlParams}
                                                             />
                                        <div className='category_pan_field'>
                                            <label
                                                className='category_pan_field cursor-pointer'
                                                title={facetsection?.name}
                                            >
                                                {facetsection?.name}
                                            </label>
                                            <div className='text-manatee pl-3 cursor-pointer'>
                                                {facetsection?.availableHits}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

const FilterPanelCheckbox = (props) => {

    const {query} = useFredhopperClient()
    const handleChange = async () => {
        if (props?.checked) {
            await query({filter: props?.removeFilter})
        } else {
            await query({filter: props?.filter})
        }
    };
    return (
        <Checkbox
            checked={props?.checked}
            onChange={handleChange}
            sx={{
                color: '#cccccc',
                '&.Mui-checked': {
                    color: '#E03F58',
                },
                '& .MuiSvgIcon-root': {fontSize: 18},
            }}
        />
    )
}

const ResultPanel = ({props}) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [countPerPage, setCountPerPage] = useState(props?.results?.viewSize);
    const [totalItems, setTotalItems] = useState(props?.results?.totalItems);
    const queryString = props?.queryString
    const {query} = useFredhopperClient()

    useEffect(() => {
        if (props?.results) {
            setCountPerPage(props?.results?.viewSize || 6);
            setTotalItems(props?.results?.totalItems || 0);
        }
    }, [props.results]);

    const changePage = async (pageNumber) => {
        const newQueryString = updateQueryString(queryString, 'fh_start_index', `${(pageNumber-1) * countPerPage}`)

        await query({filter: `${newQueryString}`})

    }
    const updateQueryString = (queryString, key, value) => {
        const params =  new URLSearchParams(queryString)
        params.set(key,value)
        return params.toString()
    }

    return (
        <div className='flex-auto lg:w-[77%] w-full gap-y-4 xl:gap-y-12'>
            <ProductGrid props={props?.items}/>
            <ProductListPagination totalCount={totalItems} viewSize={countPerPage} pageNumber={pageNumber} setPageNumber={setPageNumber} changePageNumber={changePage}/>
        </div>
    )
}

const ProductListPagination = ({
                                   setPageNumber,
                                   viewSize = 6,
                                   totalCount = 0,
                                   pageNumber = 1,
                                   changePageNumber,
                               }) => {
    let totalPage = Math.ceil(totalCount / viewSize);
    if (isNaN(totalPage) || totalPage <= 0) return null;

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPage) {
            changePageNumber(pageNumber);
            setPageNumber(pageNumber);
        }
    };

    const pages = [];

    for (let i = Math.max(1, pageNumber - 2); i < pageNumber; i++) {
        pages.push(i);
    }

    pages.push(pageNumber);

    for (let i = pageNumber + 1; i <= Math.min(totalPage, pageNumber + 2); i++) {
        pages.push(i);
    }

    return (
        <div className="product-list-pagination items-center h-[24px] text-center w-full mx-auto">
            <div className="text-center items-center flex">
                <ul className="select-none gap-6 mx-auto items-center flex text-[18px] leading-[26px] font-inter text-gray">
                    <li
                        className={pageNumber === 1 ? '' : 'cursor-pointer'}
                        onClick={() => {
                            if (pageNumber > 1) handlePageChange(pageNumber - 1);
                        }}
                    >
                        <HiOutlineArrowLeft size={24} color={pageNumber === 1 ? '#ACAEB2' : 'black'} />
                    </li>

                    {pageNumber > 3 && (
                        <>
                            <li className="cursor-pointer" onClick={() => handlePageChange(1)}>
                                1
                            </li>
                            <li>...</li>
                        </>
                    )}

                    {pages.map((page) => (
                        <li
                            key={page}
                            className={`cursor-pointer ${page === pageNumber ? 'font-bold text-black' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </li>
                    ))}

                    {pageNumber + 2 < totalPage && (
                        <>
                            <li>...</li>
                            <li className="cursor-pointer" onClick={() => handlePageChange(totalPage)}>
                                {totalPage}
                            </li>
                        </>
                    )}

                    <li
                        className={pageNumber === totalPage ? '' : 'cursor-pointer'}
                        onClick={() => {
                            if (pageNumber < totalPage) handlePageChange(pageNumber + 1);
                        }}
                    >
                        <HiOutlineArrowRight size={24} color={pageNumber === totalPage ? '#ACAEB2' : 'black'} />
                    </li>
                </ul>
            </div>
        </div>
    );
};

const ProductGrid = ({props}) => {
    return (
        <div className='grid gap-4 md:gap-8 auto-cols-max grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-4 xl:mb-12'>
            {props?.map((product) => (
                <ProductCard key={product?.id} props={product} />
            ))}
        </div>
    )
}
const ProductCard = ({ props }) => {
    return (
        <div className="hover:scale-[1.01] transition-all duration-150 ease-in">
            <a href={`/n11showcase/product/details/${props?.id}`} className="no-underline">
                <ProductDetails props={props} />
            </a>
        </div>
    )
}
const ProductInformation = ({props}) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full flex flex-col-reverse justify-start items-end md:flex-row md:items-end'>
                <StockLevel stockLevel={props?.stock} />
                <div className='flex ml-auto'>
                    <div className='overflow: hidden; position: relative;'></div>
                </div>
            </div>
        </div>
    )
}
const ProductPrice = ({props}) => {
    const { t } = useTranslation('page')

    return (
        <div className='flex flex-col w-full gap-2 mt-auto'>
            <div className='text-xl flex items-center'>
                <span className='text-sm text-darkGray'>{t('negotiated')}</span>
            </div>
            <div className='flex'>
                <div className='text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1'>
                    <div className='flex flex-col'>
                        <CurrencyBeforeValue value={props?.price} />
                        <span className='text-xs font-normal text-manatee'>{t('excl_vat')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
const ProductImage = ({props}) => {
    return (
        <div className='items-center mx-auto'>
            <img src={props} className='w-full rounded-xl' alt='product image'/>
        </div>
    )
}
const ProductDetails = ({props}) => {
    return (
        <div className='p-4 bg-aliceBlue standard_box_shadow rounded-xl h-full flex flex-col gap-4  cursor-pointer'>
            <ProductInformation props={props}/>
            <div className='flex flex-col gap-4'>
                <ProductImage props={props?.thumbUrl}/>
                <div className="text-left w-full text-2xl text-eerieBlack font-light">{props?.name}</div>
            </div>
            <ProductPrice props={props}/>
        </div>
    )
}

const getAdditionalProductInformation = async (ids) => {
    const params = {
        q: 'id:(' + ids.join(',') + ')',
    }
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
        'X-Version': 'v2',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguageFromLocalStorage(),
    }
    const res = await ApiRequest(productApi(), 'get', {}, headers, params)
    return res.data
}
export default SearchResultPage
