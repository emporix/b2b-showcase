import FormattedTextBox from './FormattedTextBox'
import React from 'react'
import { storyblokEditable } from '@storyblok/react'

const RichText = ({blok}) => {
  return (
    <div className="prose-sm md:prose-lg xl:prose-xl mx-4 xl:mx-auto w-full max-w-screen-xl prose-headings:text-demoFontHighlightColor prose-p:text-demoGrayDarkest" {...storyblokEditable(blok)}>
      <FormattedTextBox text={blok.text} />
    </div>
)
}

export default RichText
