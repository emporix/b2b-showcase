import { storyblokEditable } from '@storyblok/react'

const Headline = ({ blok }) => {
  return (<h2
    className="mx-4 xl:mx-auto max-w-screen-xl my-10 text-demoActionColor text-4xl font-bold" {...storyblokEditable(
    blok)}>{blok.text}</h2>)
}

export default Headline
