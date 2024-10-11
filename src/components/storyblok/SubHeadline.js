import { storyblokEditable } from '@storyblok/react'

const SubHeadline = ({ blok }) => {
  return (<h3
    className="mx-4 xl:mx-auto max-w-screen-xl my-10 text-demoHeadlines text-3xl font-bold" {...storyblokEditable(
    blok)}>{blok.text}</h3>)
}

export default SubHeadline
