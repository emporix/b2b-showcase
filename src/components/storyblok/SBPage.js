import Layout from '../../pages/Layout'
import { getStoryblokApi, StoryblokComponent } from '@storyblok/react'
import { useEffect, useState } from 'react'
import { getLanguageFromLocalStorage } from '../../context/language-provider'

const SBPage = () => {
  const [story, setStory] = useState()
  const language = getLanguageFromLocalStorage()

  useEffect(() => {
    const slug = window.location.pathname.replace(/^\/de\/|^\/en\/|^\//, "");
    const sbParams = {
      version: "draft",
      resolve_relations: "global-reference.reference",
      language: language,
      fallback_lang: "default",
      cv: new Date().getTime(),
    }
    const storyblokApi = getStoryblokApi()

    storyblokApi.get(`cdn/stories/${slug}`, sbParams).then((result) => {
      setStory(result.data.story)
    })
  }, [language])

  return story && (
    <Layout>
      <StoryblokComponent blok={story.content}/>
    </Layout>
  )
}

export default SBPage
