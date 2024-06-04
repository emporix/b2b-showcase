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
import Winery from '../components/Cms/winery'
import React from 'react'

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

const FsGenericComponent = (props) => {
  const componentLayout = props?.props?.data?.cmsFilteredPage?.page?.layout

  let componentData = [...Object.values(props?.props?.data?.cmsFilteredPage?.page?.data ?? {})]

  const children = props?.props?.data?.cmsFilteredPage?.page?.children[0]?.children
  if (children !== undefined && Array.isArray(children)) {
    componentData = [...componentData, ...children]
  }

  switch (componentLayout) {
    case 'footer':
      const Component = firstSpiritComponentMap[componentLayout]
      return Component && <Component props={normalizeFooterStructure(componentData)} />
    case 'productpage':
    case 'homepage':
    default:
      return <FsGenericComponentList componentData={componentData} />
  }
}

export default FsGenericComponent

export const FsGenericComponentList = (props) => {
  const { componentData } = props

  return componentData.map((entry, idx) => {
    if (!entry) {
      return
    }

    const componentTypeKey = entry?.sectionType || entry?.name || entry?.template?.uid || 'text_banner'
    const Component = firstSpiritComponentMap[componentTypeKey]

    if (!Component) return

    return <Component props={entry} key={idx} />
  })
}
