import StoryblokImage from './StoryblokImage'
import { storyblokEditable } from '@storyblok/react'

const Hero = ({ blok }) => {
  return (
    <div className="mx-4 xl:mx-auto w-full max-w-screen-xl my-4" {...storyblokEditable(blok)}>
      <a href={blok.link.url}>
        <StoryblokImage className="w-full" src={blok.image.filename} alt={blok.image.alt} />
      </a>
    </div>
  )
}

export default Hero
