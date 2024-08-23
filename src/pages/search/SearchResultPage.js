import React, {useEffect} from "react";
import {Checkbox} from "@mui/material";
import {useFredhopperClient} from "../../services/search/fredhopper.service";
import {useTranslation} from "react-i18next";
import {CurrencyBeforeValue} from "../../components/Utilities/common";
import {StockLevel} from "../../components/Product/availability";
import {getLanguageFromLocalStorage} from "../../context/language-provider";
import {ACCESS_TOKEN} from "../../constants/localstorage";
import ApiRequest from "../../services";
import {productApi} from "../../services/service.config";
import {useSearch} from "../../context/search-context";
import Layout from "../Layout";


const SearchResultPage = () => {

    const {searchResults} = useSearch();
    const {query} = useFredhopperClient()

    useEffect( () => {
        if (!searchResults || searchResults.length === 0) {
            async function getInitData() {
                await query({});
            }
            getInitData();
        }
    },[searchResults])
    return (
        <Layout title='Search Results'>
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
                <span>GESETZTE FILTER</span>
                <BreadcrumbsPanel
                    breadcrumbs={props.breadcrumbs}
                />
                <span>FILTER</span>
                <FacetsPanel
                    facet={props.facet}
                />
            </div>
        </div>
    )
}

const BreadcrumbsPanel = ({breadcrumbs}) => {
    return (
        <ul>
            {breadcrumbs?.map((breadcrumb, index) => (
                <li key={index}>
                    <span className='category_pan_title'>{breadcrumb?.attributeType}</span>
                    <div className='flex'>
                        <div className='flex'>
                            <FilterPanelCheckbox checked={true}
                                                 filter={breadcrumb.urlParams}
                                                 removeFilter={breadcrumb.removeBreadcrumbParams}/>
                            <div className='category_pan_field'>
                                <label className='category_pan_field cursor-pointer' title={breadcrumb?.name}>{breadcrumb?.name}</label>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

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
            const result = await query({filter: props?.removeFilter})
        } else {
            const result = await query({filter: props?.filter})
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

    return (
        <div className='flex-auto lg:w-[77%] w-full gap-y-4 xl:gap-y-12'>
            <ProductGrid props={props?.items}/>
        </div>
    )
}
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
            <a href={`/n11showcase/product/details/${props?.id}`} target="_blank" className="no-underline">
                <ProductDetails props={props} />
            </a>
        </div>
    )
}
const ProductInformation = ({props}) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full flex flex-col-reverse justify-start items-end md:flex-row md:items-end'>
                <StockLevel stockLevel={props?.stockLevel} />
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
