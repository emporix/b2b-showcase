import React from 'react'
import {Link} from 'react-router-dom'
import {addTenantToUrl} from '../../services/service.config'

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
                        title="Roséwein"
                        content="Tellus ornare at consequat ipsum,non lobortis"
                    />
                </Link>
            </div>
        </div>
    )
}

export default Category
