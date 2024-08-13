import { AdditionalText } from 'components/Cms/additionalText'
import { Headline } from 'components/Cms/headline'
import { Text } from 'components/Cms/text'
import { Teaser } from 'components/Cms/teaser'
import { SimpleList } from 'components/Cms/simpleList'
import { TextPicture } from 'components/Cms/textPicture'
import { ProductTeaser } from 'components/Cms/productTeaser'
import { ProductCarousel } from 'components/Cms/productCarousel'
import { TeaserSlider } from 'components/Cms/teaserSlider'
import { TextBanner } from 'components/Cms/textBanner'
import { CMS_Accordion } from '../components/Cms/accordion'
import CMS_List from 'components/Cms/cms_list'
import CMS_Footer from 'components/Cms/footer'
import { ShoppableVideo } from 'components/Cms/shoppableVideo'
import React from 'react'
import { Helmet } from 'react-helmet-async'

const firstSpiritComponentMap = {
  // TODO still needed? check with first spirit data
  additional_text: AdditionalText,
  list: CMS_List,
  footer: CMS_Footer,
  headline: Headline,
  text: Text,
  text_picture: TextPicture,
  teaser: Teaser,
  product_teaser: ProductTeaser,
  accordion: CMS_Accordion,
  product_carousel: ProductCarousel,
  slider: TeaserSlider,
  simple_text_list_faq: SimpleList,
  text_banner: TextBanner,
  shoppable_video: ShoppableVideo
}

export const normalizeFsStructure = (content) => {
  if (typeof content?.props?.fsType === 'string') {
    return content.props
  } else if (typeof content.fsType === 'string') {
    return content
  } else {
    return {}
  }
}

export const normalizeFooterStructure = (content) => {
  return {
    footer: [
      {
        headline: content[1],
        items: content[0],
      },
      {
        headline: content[3],
        items: content[2],
      },
      {
        headline: content[5],
        items: content[4],
      },
      {
        headline: content[7],
        items: content[6],
      },
    ],
    copyright: {
      copy: content[8],
      items: content[9],
    },
  }
}

const FsGenericComponent = ({ data }) => {
  const page = data?.cmsFilteredPage?.page || null

  if (!page) return null

  const componentLayout = page?.layout || ''
  const { data: componentData, children: pageBody } = page

  switch (componentLayout) {
    case 'footer':
      const Component = firstSpiritComponentMap[componentLayout]
      return (
        Component && (
          <div className="flex h-full w-full">
            <Component props={normalizeFooterStructure(Object.values(componentData))} />
          </div>
        )
      )

    case 'homepage':
    case 'content_page':
      const { pt_title, pt_keywords, pt_description } = componentData

      return (
        <>
          <Helmet>
            {pt_title ? <title>{pt_title}</title> : null}
            {pt_keywords ? <meta name="keyword" content={pt_keywords} /> : null}
            {pt_description ? <meta name="description" content={pt_description} /> : null}
          </Helmet>
          {pageBody?.[0]?.children ? <FsGenericComponentList componentData={pageBody[0].children} /> : null}
        </>
      )

    case 'productpage':
    default:
      return <>{pageBody?.[0]?.children ? <FsGenericComponentList componentData={pageBody[0].children} /> : null}</>
  }
}

export default FsGenericComponent

export const FsGenericComponentList = ({ componentData }) => {
  return componentData.map((entry) => {
    if (!entry) return null

    const componentTypeKey = entry?.sectionType || entry?.name || entry?.template?.uid || 'text_banner'
    const Component = firstSpiritComponentMap[componentTypeKey]

    if (!Component) return null

    return <Component props={entry} key={entry.id} />
  })
}
