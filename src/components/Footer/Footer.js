import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import FormattedTextBox from '../storyblok/FormattedTextBox'
import { cn } from '../cssUtils'

const MobileFooter = ({ blok }) => {
  return (
    <div className="mobile_only_flex flex-col text-aldiBlue4">
      <div className="flex flex-col p-6 bg-aldiGray1">
        {blok.linkLists.map((linkList, index) => (
          <div
            className={cn(
              'flex flex-col w-full pt-6 pb-10',
              { 'border-b border-white': index < blok.linkLists.length - 1 })}
            key={'Footer_1_' + index} {...storyblokEditable(
            blok.linkLists[index])}>
              <span
                className="font-semibold text-xl mb-8">{linkList.title}</span>
            {linkList.links.map((textLink, index) => (
              <a href={textLink.link.url} target="_self"
                 className="mb-2 leading-[23px]" key={'Footer_2_' + index}>
                {textLink.text && <span>{textLink.text}</span>}
                {textLink.image && <img src={textLink.image.filename}
                                        alt={textLink.image.alt} />}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="prose-p:text-xs p-6">
        <FormattedTextBox text={blok.legalInformation} />
      </div>
    </div>
  )
}

const DesktopFooter = ({ blok }) => {
  return blok && (
    <div className="desktop_only_flex flex-col  text-aldiBlue4">
      <div className="bg-aldiGray1">
        <div
          className="max-w-screen-xl mx-auto">
          <div className={cn('grid w-full md:py-10',
            {
              'grid-cols-1': blok.linkLists.length === 1,
              'grid-cols-2': blok.linkLists.length === 2,
              'grid-cols-3': blok.linkLists.length === 3,
              'grid-cols-4': blok.linkLists.length === 4,
              'grid-cols-5': blok.linkLists.length === 5,
            })}>
            {blok.linkLists.map((linkList, index) => (
              <div className={cn('flex flex-col h-full pl-6 xl:pl-0', {
                'border-r border-white': index < blok.linkLists.length - 1,
                'xl:pl-6': index > 0
              })}
                   key={'Footer_1_' + index} {...storyblokEditable(
                blok.linkLists[index])}>
              <span
                className="font-semibold text-xl mb-8">{linkList.title}</span>
                {linkList.links.map((textLink, index) => (
                  <a href={textLink.link.url} target="_self"
                     className="mb-2 leading-[23px]" key={'Footer_2_' + index}>
                    {textLink.text && <span>{textLink.text}</span>}
                    {textLink.image && <img src={textLink.image.filename}
                                            alt={textLink.image.alt} />}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto prose-p:text-xs p-6 xl:px-0 prose-p:text-aldiBlue4">
        <FormattedTextBox text={blok.legalInformation} />
      </div>
    </div>
  )
}

const Footer = ({ blok }) => {
  console.log(blok)
  return (
    <div className="footer" {...storyblokEditable(blok)}>
      <MobileFooter blok={blok} />
      <DesktopFooter blok={blok} />
    </div>
  )
}
export default Footer
