import FormattedTextBox from './FormattedTextBox'
import React from 'react'
import { storyblokEditable } from '@storyblok/react'

const RichText = ({blok}) => {
  return (
    <div className="prose-sm md:prose-lg xl:prose-xl mx-4 md:mx-6 xl:mx-auto w-full max-w-screen-xl prose-headings:text-aldiBlue4 prose-p:text-aldiBlue4" {...storyblokEditable(blok)}>
      <FormattedTextBox text={blok.text} />
    </div>
)
}

export default RichText
