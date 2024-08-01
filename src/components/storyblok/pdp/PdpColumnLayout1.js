import React, { Fragment } from 'react'
import { StoryblokComponent } from '@storyblok/react'

const PdpColumnLayout1 = ({ blok, ...restProps }) => {
  return (<div
    className="grid grid-cols-1 mx-4 xl:mx-auto w-full max-w-screen-xl my-10">
    <div>{blok.column.map(
      (childBlok) => (<Fragment key={childBlok._uid}>
        <StoryblokComponent blok={childBlok} {...restProps} />
      </Fragment>))
    }</div>
  </div>)
}

export default PdpColumnLayout1
