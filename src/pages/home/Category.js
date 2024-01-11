import React from 'react'
import {Link} from 'react-router-dom'
import {addTenantToUrl} from '../../services/service.config'

const EachCategory = (props) => {
    return (
        <>
        
            <img src={props.src} alt="" className="relative w-fit aspect-square object-cover home_category_shadow rounded-2xl"/>
            <div className="pt-6 font-inter font-semibold text-[20px] leading-[32px]">
                {props.title}
            </div>
            <div className="pt-[8px] font-normal text-base">
                {props.content}
            </div>
        </>
    )
}

const Category = () => {
    return (
        <div className="home_category">
            <div className=" desktop_only teaser__headline mx-auto">
                Kategorien
            </div>
            <div className="home_cat_content">
                <Link to={addTenantToUrl(`product/wein/rot`)}>
                    <EachCategory
                        src="/category/red-wine-category-image.png"
                        title="Rotwein"
                        content="Tellus ornare at consequat ipsum,non lobortis"
                    />
                </Link>
                <Link to={addTenantToUrl(`product/wein/weiss`)}>
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title="Weißwein"
                        content="Tellus ornare at consequat ipsum,non lobortis"
                    />
                </Link>
                <Link to={addTenantToUrl(`product/wein/rose`)}>
                    <EachCategory
                        src="/category/white-wine-category-image.png"
                        title="Rosewein"
                        content="Tellus ornare at consequat ipsum,non lobortis"
                    />
                </Link>
            </div>
        </div>
    )
}

export default Category
