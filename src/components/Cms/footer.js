import React from 'react'
import { Link } from 'react-router-dom'
import './teaser.css'
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from 'react-icons/ai'

const socialMediaComponentMap = {
  instagram: AiFillInstagram,
  facebook: AiFillFacebook,
  youtube: AiFillYoutube,
}

// specifically for footer

const CMS_DESKTOP_FOOTER = (props) => {
  return (
    <div className="desktop_only bg-aliceBlue">
      <div className="flex md:py-12 max-w-screen-xl mx-auto ">
        {props.content.footer.map((column, columnIndex) => (
          <div className="mx-auto" key={columnIndex}>
            <ul className="text-base">
              <li className="text-primary font-bold text-lg pb-4">{column.headline}</li>
              {column.items.map((item, itemIndex) =>
                item?.data?.lt_text ? (
                  <li key={itemIndex} className="font-light pb-4 last-of-type:pb-0">
                    <Link to={item?.data?.lt_url}>{item?.data?.lt_text}</Link>
                  </li>
                ) : (
                  <li key={itemIndex} className="text-eerieBlack font-light text-sm pb-1 last-of-type:pb-0">
                    {item?.content[0]?.content}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const CMS_MOBILE_FOOTER = (props) => {
  return (
    <div className="mobile_only flex w-full flex-wrap gap-y-4 pt-4 pb-8 md:py-0 bg-aliceBlue">
      {props.content.footer.map((column, columnIndex) => (
        <ul key={columnIndex} className="text-primary font-bold text-base px-6 text-center w-1/2">
          <li className="py-4">{column.headline}</li>
          {column.items.map((item, itemIndex) =>
            item?.data?.lt_text ? (
              <li key={itemIndex} className=" font-light pt-2">
                <Link to={item?.data?.lt_url}>{item?.data?.lt_text}</Link>
              </li>
            ) : (
              <li key={itemIndex} className="text-eerieBlack font-light text-sm pt-1">
                {item?.content[0]?.content}
              </li>
            )
          )}
        </ul>
      ))}
    </div>
  )
}

const COPYRIGHT_FOOTER = (props) => {
  return (
    <div className="p-4 bg-primary text-manatee flex justify-between align-center xxl:px-[20%]">
      <p className="text-bgWhite font-bold ">{props.content.copyright.copy}</p>
      <div className="flex">
        <div className="flex pl-6 pt-[-2px] text-bgWhite">
          {props.content.copyright.items.map((item, index) => {
            const IconComponent = socialMediaComponentMap[item.data.lt_text]
            return (
              <a href={item.data.lt_url} key={index}>
                <div className="pl-6 pt-[-2px] text-bgWhite flex items-center">
                  <IconComponent size={30} />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const CMS_Footer = (props) => {
  return (
    <div className="footer relative z-10 mt-auto">
      <CMS_MOBILE_FOOTER content={props.props} />
      <CMS_DESKTOP_FOOTER content={props.props} />
      <COPYRIGHT_FOOTER content={props.props} />
    </div>
  )
}

export default CMS_Footer
