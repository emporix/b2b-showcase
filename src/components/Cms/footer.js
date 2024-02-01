import React from 'react';
import { Link } from 'react-router-dom';
import './teaser.css';
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from 'react-icons/ai';

const socialMediaComponentMap = {
  instagram: AiFillInstagram,
  facebook: AiFillFacebook,
  youtube: AiFillYoutube,
};

const CMS_DESKTOP_FOOTER = (props) => {

  return (
      <div className="bg-aliceBlue">
          <div className="desktop_only_flex  md:py-12 max-w-screen-xl mx-auto ">
            { props.content.footer.map((column) => (
              <div className="mx-auto">
                  <ul className="text-base">
                      <li className="text-primary font-bold text-lg ">{column.headline}</li>
                      {column.items.map((item) => (
                        item?.data?.lt_text ? 
                          (
                            <Link to={item?.data?.lt_url} ><li className=" font-light pt-4">{item?.data?.lt_text}</li></Link>
                          ) :
                          (
                            <li className="font-light pt-5">{item?.content[0]?.content}</li>
                          )
                      ))}
                  </ul>
              </div>
            ))}
          </div>
          <div className="p-4 bg-primary text-manatee flex justify-between align-center">
              <div>
                  <p className="text-bgWhite font-bold ">
                    {props.content.copyright.copy}
                  </p>
              </div>
              <div className="flex">
                  <div className="flex pl-6 pt-[-2px] text-bgWhite">
                    { props.content.copyright.items.map((item) => {
                      const IconComponent = socialMediaComponentMap[item.data.lt_text]
                    return ( 
                      <a href={item.data.lt_url} >
                        <div className="pl-6 pt-[-2px] text-bgWhite flex items-center">
                          <IconComponent size={30}/>
                        </div>
                      </a>
                      )
                    })}
                  </div>
              </div>
          </div>

      </div>
  )
}

const CMS_MOBILE_FOOTER = (props) => {
  return (
    <div className='flex w-full flex-wrap gap-y-4 pt-4 pb-8 md:py-0 bg-aliceBlue'>
      { props.content.footer.map((column) => (
        <ul className="mobile_only text-primary font-bold text-base px-6 text-center w-1/2">
          <div className=''>
            <li className="py-4">{column.headline}</li>
            {column.items.map((item) => (
              item?.data?.lt_text ? 
              (
                <Link to={item?.data?.lt_url} ><li className=" font-light pt-2">{item?.data?.lt_text}</li></Link>
              ) :
              (
                <li className="font-light pt-2">{item?.content[0]?.content}</li>
              )
            ))}
          </div>
        </ul>
      ))}
    </div>
  )
}

const CMS_Footer = (props) => {
    return (
      <div className="footer">
          <CMS_MOBILE_FOOTER content={props.props}/>
          <CMS_DESKTOP_FOOTER content={props.props}/>
      </div>
    )
}

export default CMS_Footer
