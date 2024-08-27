import React from 'react'
import {Link} from 'react-router-dom'
import {addTenantToUrl} from '../../services/service.config'
import { useTranslation } from 'react-i18next'
import {useNavigate} from "react-router";
import {TENANT} from "../../constants/localstorage";
import {useFredhopperClient} from "../../services/search/fredhopper.service";
import {Button} from "@mui/material";
import {CURRENT_LANGUAGE_KEY} from "../../context/language-provider";

const EachCategory = (props) => {
    return (
        <div className='bg-aliceBlue p-8 md:p-4 flex flex-col md:flex-row lg:flex-col gap-4 md:gap-8 standard_box_shadow rounded-xl'>
            <img src={props.src} alt="" className="relative w-fit md:w-1/3 lg:w-fit aspect-square object-cover rounded-xl"/>
            <div className="md:flex md:flex-col md:gap-8">
                <div className="font-inter font-semibold text-2xl leading-[32px]">
                    {props.title}
                </div>
                <div className="font-normal text-lg">
                    {props.content}
                </div>
            </div>
        </div>
    )
}

const Category = () => {
    const {t} = useTranslation("page")
    const navigate = useNavigate()
    const tenant = localStorage.getItem(TENANT)
    let language=localStorage.getItem(CURRENT_LANGUAGE_KEY)
    const {query} = useFredhopperClient()
    if(language==='de'){
        language='de_DE'
    } else{
        language='en_GB'
    }

    return (
        <div className="home_category">
            <div className=" desktop_only teaser__headline mx-auto">
              {t("categories")}
            </div>
            <div className="home_cat_content">
                <button onClick={async () => {
                    await query({filter: `fh_refpath=0039dd2d-8560-48a1-822c-c9e286a46ba3&fh_refview=lister&fh_reffacet=categories&fh_location=%2f%2fcatalog01%2f${language}%2fcategories%3c%7bcatalog01_catalog01_wine_catalog01_wine_red%7d`})
                    navigate(`/${tenant}/catalog`)
                }}>

                    {/*<Link to={addTenantToUrl(`product/wein/rotwein`)} >*/}
                    <EachCategory
                        src="/category/red-wine-category-image.png"
                        title={t("red_wine")}
                        content="in vino rosso veritas"
                    />
                </button>
                <button onClick={async () => {
                    await query({filter: `fh_refpath=0039dd2d-8560-48a1-822c-c9e286a46ba3&fh_refview=lister&fh_reffacet=categories&fh_location=%2f%2fcatalog01%2f${language}%2fcategories%3c%7bcatalog01_catalog01_wine_catalog01_wine_white%7d`})
                    navigate(`/${tenant}/catalog`)
                }}>
                    {/*</Link>*/}
                    {/*<Link preventScrollReset={false} to={addTenantToUrl(`product/wein/weißwein`)}>*/}
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title={t("white_wine")}
                        content="in vino blanco veritas"
                    />
                </button>
                <button onClick={async () => {
                    await query({filter: `fh_refpath=0039dd2d-8560-48a1-822c-c9e286a46ba3&fh_refview=lister&fh_reffacet=categories&fh_location=%2f%2fcatalog01%2f${language}%2fcategories%3c%7bcatalog01_catalog01_wine_catalog01_wine_rose%7d`})
                    navigate(`/${tenant}/catalog`)
                }}>
                    {/*</Link>*/}
                    {/*<Link to={addTenantToUrl(`product/wein/roséwein`)}>*/}
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title={t("rose_wine")}
                        content="in rosé vino veritas"
                    />
                </button>
                    {/*</Link>*/}
            </div>
        </div>
)
}

export default Category
