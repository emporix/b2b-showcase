import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'

const EachCategory = (props) => {
  return (
    <div>
        <div>
            <img src={props.src} alt="" className="relative w-[312px] h-[312px] object-cover home_category_shadow" />
        </div>
        <div className="pt-6 font-inter font-semibold text-[20px] leading-[32px]">
        {props.title}
      </div>
      <div className="pt-[8px] font-normal text-base">
        {props.content}
      </div>
    </div>
  )
}

const Category = () => {
  return (
    <div className="home_category mt-10">
      <div className="desktop_only font-inter font-bold text-2xl text-center">
          Kategorien
      </div>
      <div className="home_cat_content">
        <Link to={addTenantToUrl(`product/domestic_appliances`)}>
          <EachCategory
            src="/category/red-wine-category-image.png"
            title="Rotwein"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
        <Link to={addTenantToUrl(`product/domestic_appliances`)}>
          <EachCategory
            src="/category/white-wine-category-image.png"
            title="Weißwein"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
      </div>
    </div>
  )
}

export default Category
