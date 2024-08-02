import React, { Fragment } from 'react'
import { StoryblokComponent } from '@storyblok/react'

const PdpColumnLayout2 = ({ blok, ...restProps }) => {
  return (<div
    className="grid grid-cols-1 md:grid-cols-2 mx-4 xl:mx-auto xl:max-w-screen-xl my-10 gap-x-8">
    <div className="flex flex-col gap-10">{blok.leftColumn.map(
      (childBlok) => (<Fragment key={childBlok._uid}>
        <StoryblokComponent blok={childBlok} {...restProps} />
      </Fragment>))
    }</div>
    <div className="flex flex-col gap-10">{blok.rightColumn.map(
      (childBlok) => (<Fragment key={childBlok._uid}>
        <StoryblokComponent blok={childBlok} {...restProps} />
      </Fragment>))
    }</div>
  </div>)
}

export default PdpColumnLayout2
