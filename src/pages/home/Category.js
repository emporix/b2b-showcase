import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'

const EachCategory = (props) => {
  return (
    <div>
      <div className="before:bg-yellow before:w-[12px] before:h-[312px] before:absolute before:rounded-l-[4px]">
        <img src={props.src} alt="" className="w-[276px] h-[312px] object-cover rounded-l-[4px]"/>
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
    <div className="home_category">
      <div className="desktop_only font-inter font-bold text-2xl text-center">
        Explore our products
      </div>
      <div className="desktop_only md:pt-4 font-inter text-[18px]/[30px] font-normal text-center">
        Browse our catalogue and find the right product for you
      </div>
      <div className="home_cat_content">
        <Link to={addTenantToUrl(`product/domestic_appliances`)}>
          <EachCategory
            src="/category/seating.png"
            title="Seating"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
        <Link to={addTenantToUrl(`product/domestic_appliances`)}>
          <EachCategory
            src="/category/desk.png"
            title="Desk and Workspaces"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
        <Link to={addTenantToUrl(`product/entertainment_&_hobby`)}>
          <EachCategory
            src="/category/storage.png"
            title="Storage"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
        <Link to={addTenantToUrl(`product/toys`)}>
          <EachCategory
            src="/category/printer.png"
            title="Printers, Ink and Toner"
            content="Tellus ornare at consequat ipsum,non lobortis"
          />
        </Link>
      </div>
    </div>
  )
}

export default Category
