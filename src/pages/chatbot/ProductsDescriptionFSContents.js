import { nanoid } from '@reduxjs/toolkit'
import React from 'react'

const Text = ({ type, content, data }) => {
  // console.log(type === 'text' ? content : null)
  switch (type) {
    case 'paragraph':
    case 'block':
      return content?.map((item) => <Text {...item} key={nanoid()} />)
    case 'text':
    default:
      if (data?.format === 'bold')
        return content?.map((item) => (
          <strong key={nanoid()}>
            <Text {...item} />
          </strong>
        ))
      return Array.isArray(content) ? content?.map((item) => <Text {...item} key={nanoid()} />) : content
  }
}

const ProductsDescriptionFSContents = ({ components }) => {
  const { sectionType, data } = components

  // console.log(components)
  // console.log(sectionType !== 'text' && sectionType !== 'headline' ? { sectionType, ...data } : null)
  // console.log(sectionType === 'headline' ? { sectionType, ...data } : '')

  switch (sectionType) {
    case 'text':
      return (
        <>
          {}
          {data?.st_text.map((each) => (
            <p key={nanoid()}>
              <Text {...each} />
            </p>
          ))}
        </>
      )

    case 'headline':
      const level = data?.st_headlineLevel?.value || 'h5'
      return data?.st_headline ? React.createElement(level, {}, data.st_headline) : null

    case 'buttonLink':
      return

    case 'text_faq':
      return (
        <>
          {data?.st_question ? (
            <ProductsDescriptionFSContents
              components={{
                sectionType: 'headline',
                data: { st_headline: data.st_question, st_headlineLevel: { value: 'h4' } },
              }}
            />
          ) : null}
          {data?.st_answer
            ? data.st_answer.map((paragraph) => (
                <p key={nanoid()}>
                  <Text {...paragraph} />
                </p>
              ))
            : null}
        </>
      )

    case 'simple_text_list_faq':
      return data?.st_elements.map((element) => (
        <ProductsDescriptionFSContents components={{ ...element }} key={nanoid()} />
      ))

    case 'teaser':
    case 'text_picture':
      console.log(data)
      return (
        <>
          {data?.st_headline ? (
            <ProductsDescriptionFSContents
              components={{
                sectionType: 'headline',
                data: { st_headline: data.st_headline, st_headlineLevel: { value: 'h4' } },
              }}
            />
          ) : null}
          {data?.st_text ? (
            <ProductsDescriptionFSContents components={{ sectionType: 'text', data: { st_text: data.st_text } }} />
          ) : null}
          {data?.st_buttonLink ? (
            <a href={data?.st_buttonLink?.data?.lt_url || '*'}>{data?.st_buttonLink?.data?.lt_text}</a>
          ) : null}
        </>
      )

    default:
      return <p>{sectionType}</p>
  }
}

export default ProductsDescriptionFSContents
