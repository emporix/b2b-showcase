import React from 'react'
import { storyblokEditable } from '@storyblok/react'

const MobileFooter = ({ blok }) => {
  return (
    <>
      <div className="mobile_only_flex pt-6 pl-6 text-aldiBlue4">
        <div className="flex flex-col">
          {blok.linkLists.map((linkList, index) => (
            <div
              className="flex flex-col w-full border-b border-white pt-6 pb-10"
              key={'Footer_1_' + index} {...storyblokEditable(blok.linkLists[index])}>
              <span
                className="font-semibold text-xl mb-8">{linkList.title}</span>
              {linkList.links.map((textLink, index) => (
                <a href={textLink.link.url} target="_self"
                   className="mb-2 leading-[23px]" key={'Footer_2_' + index}>
                  {textLink.text && <span>{textLink.text}</span>}
                  {textLink.image && <img src={textLink.image.filename} alt={textLink.image.alt} />}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const DesktopFooter = ({ blok }) => {
  return blok && (
    <div
      className="desktop_only_flex  md:py-10 max-w-screen-xl mx-auto text-aldiBlue4">
      <div className="grid w-full grid-cols-5">
        {blok.linkLists.map((linkList, index) => (
          <div className="flex flex-col h-full border-r border-white pl-6"
               key={'Footer_1_' + index} {...storyblokEditable(blok.linkLists[index])}>
            <span className="font-semibold text-xl mb-8">{linkList.title}</span>
            {linkList.links.map((textLink, index) => (
              <a href={textLink.link.url} target="_self"
                 className="mb-2 leading-[23px]" key={'Footer_2_' + index}>
                {textLink.text && <span>{textLink.text}</span>}
                {textLink.image && <img src={textLink.image.filename} alt={textLink.image.alt} />}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const Footer = ({ blok }) => {
  return (
    <div className="footer" {...storyblokEditable(blok)}>
      <MobileFooter blok={blok} />
      <DesktopFooter blok={blok} />
    </div>
  )
}
export default Footer
