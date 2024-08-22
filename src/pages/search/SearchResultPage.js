import React, {useState} from "react";
import {Checkbox} from "@mui/material";
import {useFredhopperClient} from "../../services/search/fredhopper.service";


const SearchResultPage = () => {

    const searchResults = demo //useSearch();

    return (
        <div>
            <h1>Search Results</h1>
            <div className='px-4 md:px-24 pb-12'>
                <div className='mt-8 w-auto relative'>
                    <div className='flex gap-4 xl:gap-12'>
                        <FilterPanel props={searchResults}/>
                        {/*<ResultPanel props={searchResults}/>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

const FilterPanel = ({props}) => {

    return (
        <div id='filterdrawer' className='flex-auto lg:w-[23%] bg-aliceBlue p-4 rounded-xl hidden lg:block'>
            <div className='relative'>
                <ul>
                    {props.breadcrumbs?.map((breadcrumb, index) => (
                        <li key={index}>
                            <span className='category_pan_title'>{breadcrumb?.name}</span>
                            <div className='flex'>
                                <div className='flex'>
                                    <FilterPanelCheckbox checked = {true} filter={breadcrumb["url-params"]} removeFilter={breadcrumb["remove-params"]}/>
                                    <div className='category_pan_field'>
                                        <label className='category_pan_field cursor-pointer' title={breadcrumb?.value}>{breadcrumb?.value}</label>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <ul>
                    {props.filter?.map((filterSection, index) => (
                        <li key={index}>
                            <span className='category_pan_title'>{filterSection?.title}</span>
                            <div className='flex'>
                                <div className='flex'>
                                    <FilterPanelCheckbox checked = {false} filter={filterSection['url-params']}/>
                                    <div className='category_pan_field'>
                                        <label className='category_pan_field cursor-pointer' title={filterSection?.value}>{filterSection?.value}</label>
                                        <div className='text-manatee pl-3 cursor-pointer'>{filterSection?.nr}</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const FilterPanelCheckbox = (props) => {

    const [checked, setChecked] = useState(props.checked || false);
    const { query } = useFredhopperClient()
    const handleChange = async () => {
        const newChecked = !checked;
        if (checked) {
            const result = await query({filter: props?.removeFilter})
        } else {
            const result = await query({filter: props?.filter})
        }
        setChecked(newChecked);
    };
    return (
        <Checkbox
            checked={checked}
            onChange={handleChange}
            sx={{
                color: '#cccccc',
                '&.Mui-checked': {
                    color: '#E03F58',
                },
                '& .MuiSvgIcon-root': { fontSize: 18 },
            }}
        />
    )
}

const ResultPanel = (props) => {
    return (
        <div className='flex-auto lg:w-[77%] w-full gap-y-4 xl:gap-y-12'>
            <SortingPanel/>
            <ProductGrid/>
        </div>
    )
}
const SortingPanel = (props) => {
    return (
        <div className='box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'>
            <div className='view-setting-bar'>
                <ul className='setting gap-2 flex justify-between font-inter text-base font-normal'>
                    <li className='per-page'>
                        <div className='relative max-w-fit inline-block text-left whitespace-nowrap'>
                            <button className="flex flex-row items-center">
                                <span className="flex flex-row items-center text-sm">
                                    <span className="hidden lg:inline-block pl-2 text-sm">Products: </span>
                                    <span className="inline-block pl-2">6 per page</span>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="-mr-1 ml-1 h-5 w-5" height="20" width="20" xmlns="http://www.w3.org/2000/svg" >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd">

                                        </path>
                                    </svg>
                                </span>
                            </button>
                            <div
                                className="invisible opacity-0 absolute mt-1 min-w-full origin-top-right right-0 rounded-md shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none transition-opacity duration-600 z-20">
                                <div className="py-1">
                                    <button value="6" className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">
                                        6 per page
                                    </button>
                                    <button value="9" className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">
                                        9 per page
                                    </button>
                                    <button value="15" className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">
                                        15 per page
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className='sort-by'>
                        <div className="relative max-w-fit inline-block text-left whitespace-nowrap">
                            <button className="flex flex-row items-center"><span
                                className="flex flex-row items-center text-sm"><span
                                className="hidden lg:inline-block pl-2 text-sm">Sort: </span><span
                                className="inline-block pl-2">Price (High to Low)</span><svg stroke="currentColor"
                                                                                         fill="currentColor"
                                                                                         strokeWidth="0"
                                                                                         viewBox="0 0 20 20"
                                                                                         aria-hidden="true"
                                                                                         className="-mr-1 ml-1 h-5 w-5"
                                                                                         height="20" width="20"
                                                                                         xmlns="http://www.w3.org/2000/svg"
                                                                                         ><path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"></path></svg></span></button>
                            <div
                                className="invisible opacity-0 absolute mt-1 min-w-full origin-top-right right-0 rounded-md shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none transition-opacity duration-600 z-20">
                                <div className="py-1">
                                    <button value="0"
                                            className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">Price
                                        (High to Low)
                                    </button>
                                    <button value="1"
                                            className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">Price
                                        (Low to High)
                                    </button>
                                    <button value="2"
                                            className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">Name
                                        (A-Z)
                                    </button>
                                    <button value="3"
                                            className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap">Name
                                        (Z-A)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className='view-type'>
                        <div className="gap-2 md:gap-4 flex p-1">
                            <div className="lg:block products-filter-name">View:</div>
                            <div id="grid-view" className="cursor-pointer hover:text-yellow">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" color="#FAC420" height="20" width="20" xmlns="http://www.w3.org/2000/svg" >
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">

                                    </path>
                                </svg>
                            </div>
                            <div id="list-view" className="cursor-pointer">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" color="black" height="20" width="20" xmlns="http://www.w3.org/2000/svg" >
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd">

                                    </path>
                                </svg>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

const ProductGrid = (props) => {
    return (
        <div className='grid gap-4 md:gap-8 auto-cols-max grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-4 xl:mb-12'>
            <ProductCard/>
        </div>
    )
}
const ProductCard = (props) => {
    return (
        <div className='hover:scale-[1.01] transition-all duration-150 ease-in'>
            <a href="/n11showcase/product/details/productid" target="_blank" className='no-underline'>
                <ProductDetails/>
            </a>
        </div>
    )
}
const ProductInformation = (props) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full flex flex-col-reverse justify-start items-end md:flex-row md:items-end'>
                <span className='product-available'></span>
                <div className='flex ml-auto'>
                    <div className='overflow: hidden; position: relative;'></div>
                </div>
            </div>
        </div>
    )
}
const ProductPrice = (props) => {
    return (
        <div className='flex flex-col w-full gap-2 mt-auto'>
            <div className='text-xl flex items-center'>
                <span className='text-sm text-darkGray'></span>
            </div>
            <div className='flex'>
                <div className='text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1'>
                    <div className='flex flex-col'>
                        <span className='whitespace-nowrap'></span>
                        <span className='text-xs font-normal text-manatee'></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
const ProductImage = (props) => {
    return (
        <div className='items-center mx-auto'>
            <img src={props.link} className='w-full rounded-xl' alt=''/>
        </div>
    )
}
const ProductDetails = (props) => {
    const {item} = props
    return (
        <div className='p-4 bg-aliceBlue standard_box_shadow rounded-xl h-full flex flex-col gap-4  cursor-pointer'>
            <ProductInformation/>
            <div className='flex flex-col gap-4'>
                <ProductImage />
                <div className="text-left w-full text-2xl text-eerieBlack font-light">Château Margaux</div>
            </div>
            <ProductPrice/>
        </div>
    )
}

const demo = {
        "breadcrumbs": [
            {
                "url-params": "fh_location=%2f%2fcatalog01%2fde_DE%2fvintage%3d2020",
                "name": "Vintage",
                "value": "2020",
                "remove-params": "fh_location=%2f%2fcatalog01%2fde_DE",
            }
        ],
        "filter": [
            {
                "title": "Country",
                "value": "Argentinien",
                "url-params": "fh_refpath=fd189808-71b1-4c53-a707-ede2d11346d8&fh_refview=lister&fh_reffacet=country&fh_location=%2f%2fcatalog01%2fde_DE%2fvintage%3d2020%2fcountry%3e%7bargentina%7d",
                "nr": 38
            }
        ],
    "items": [
        {
            "winery": "Winery A",
            "region": "Region A",
            "flavor": "Flavor A",
            "country": "Country A",
            "color": "Color A",
            "thumbUrl": "https://res.cloudinary.com/saas-ag/image/upload/v1723817032/n11showcase/media/66bf5c477a19f46878c8c685",
            "name": "Item A",
            "price": 20.0,
            "id": "itemA"
        },
        {
            "winery": "Winery B",
            "region": "Region B",
            "flavor": "Flavor B",
            "country": "Country B",
            "color": "Color B",
            "thumbUrl": "https://res.cloudinary.com/saas-ag/image/upload/v1723817630/n11showcase/media/66bf5e9ef44d95309ddf8687",
            "name": "Item B",
            "price": 30.0,
            "id": "itemB"
        }
    ]
}

export default SearchResultPage
