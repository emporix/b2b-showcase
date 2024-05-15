import React from 'react'
import {Link} from 'react-router-dom'
import {addTenantToUrl} from '../../services/service.config'
import { useTranslation } from 'react-i18next'

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
    return (
        <div className="home_category">
            <div className=" desktop_only teaser__headline mx-auto">
              {t("categories")}
            </div>
            <div className="home_cat_content">
                <Link to={addTenantToUrl(`product/wein/rotwein`)} >
                    <EachCategory
                        src="/category/red-wine-category-image.png"
                        title=  {t("red_wine")}
                        content="in vino rosso veritas"
                    />
                </Link>
                <Link preventScrollReset={false} to={addTenantToUrl(`product/wein/weißwein`)}>
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title=  {t("white_wine")}
                        content="in vino blanco veritas"
                    />
                </Link>
                <Link to={addTenantToUrl(`product/wein/roséwein`)}>
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title=  {t("rose_wine")}
                        content="in rosé vino veritas"
                    />
                </Link>
            </div>
        </div>
    )
}

export default Category
