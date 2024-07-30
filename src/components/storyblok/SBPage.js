import Layout from '../../pages/Layout'
import {
  apiPlugin,
  getStoryblokApi, registerStoryblokBridge,
  StoryblokComponent,
  storyblokInit,
} from '@storyblok/react'
import { useEffect, useState } from 'react'
import { getLanguageFromLocalStorage } from '../../context/language-provider'
import StoryblokBridgeLoader from '@storyblok/react/bridge-loader'
import { componentList } from './storyblok-components'

storyblokInit({
  accessToken: process.env.REACT_APP_STORYBLOK_DRAFT_TOKEN,
  use: [apiPlugin],
  components: componentList(),
})

const SBPage = () => {
  const [story, setStory] = useState()
  const language = getLanguageFromLocalStorage()

  useEffect(() => {
    const slug = window.location.pathname.replace(/^\/de\/|^\/en\/|^\//, '')
    const sbParams = {
      version: 'draft',
      resolve_relations: 'global-reference.reference',
      language: language,
      fallback_lang: 'default',
      cv: new Date().getTime(),
    }
    const storyblokApi = getStoryblokApi()

    storyblokApi.get(`cdn/stories/${slug}`, sbParams).then((result) => {
      registerStoryblokBridge(
        result.data.story.id,
        (story) => setStory(story),
        {}
      );
      setStory(result.data.story)
    })
  }, [language])

  return story && (
    <>
      <Layout>
        <StoryblokComponent blok={story.content} />
      </Layout>
    </>
  )
}

export default SBPage
