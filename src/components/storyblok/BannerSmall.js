import { storyblokEditable } from '@storyblok/react'
import StoryblokImage from './StoryblokImage'
import { cn } from '../cssUtils'

const BannerSmall = ({ blok }) => {
  return (
    <div className={cn('mx-4 xl:mx-auto w-full max-w-screen-xl my-4 grid gap-x-4',
        {
          "grid-cols-1": blok.images.length === 1,
          "grid-cols-2": blok.images.length === 2,
        })} {...storyblokEditable(
      blok)}>
      {blok.images.map((imageLink, index) => (
          <a href={imageLink.link.url} key={"BannerSmall_" + index}>
            <StoryblokImage className="w-full" src={imageLink.image.filename} alt={imageLink.image.alt} />
          </a>
        )
      )}


    </div>
  )
}

export default BannerSmall
