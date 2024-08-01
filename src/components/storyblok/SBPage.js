import Layout from '../../pages/Layout'
import {
  apiPlugin,
  getStoryblokApi,
  registerStoryblokBridge,
  StoryblokComponent,
  storyblokInit,
} from '@storyblok/react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/language-provider'
import { componentList } from './storyblok-components'
import { useAuth } from '../../context/auth-provider'

storyblokInit({
  accessToken: process.env.REACT_APP_STORYBLOK_DRAFT_TOKEN,
  use: [apiPlugin],
  components: componentList(),
})

const SBPage = () => {
  const [story, setStory] = useState()
  const { currentLanguage } = useLanguage()
  const { userTenant } = useAuth()

  useEffect(() => {
    const slug = window.location.pathname
      .replace(/^\/de\/|^\/en\/|^\//, '')
      .replace(userTenant, 'home')
    const sbParams = {
      version: 'draft',
      resolve_relations: 'global-reference.reference',
      language: currentLanguage,
      fallback_lang: 'default',
      cv: new Date().getTime(),
    }
    const storyblokApi = getStoryblokApi()

    storyblokApi.get(`cdn/stories/${slug}`, sbParams).then((result) => {
      registerStoryblokBridge(
        result.data.story.id,
        (story) => setStory(story),
        {},
      )
      setStory(result.data.story)
    })
  }, [currentLanguage])

  return story && (
    <>
      <Layout fromSBPage={true}>
        <StoryblokComponent blok={story.content} />
      </Layout>
    </>
  )
}

export default SBPage
