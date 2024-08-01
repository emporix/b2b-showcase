import React from 'react'
import {useParams} from 'react-router-dom'
import './teaser.css'

// for content like teasers or simple content with with title, text and image (manufacturer, manufacturer process)

export const Teaser = (props) => {
  const { productId } = useParams()

  const classId = props?.props?.sectionType || ''
  const content = props.props?.data
  const headline = content?.st_headline
  const text = content?.st_text
  const image = content?.st_picture?.resolutions.ORIGINAL

  if (headline === undefined && text === undefined && image === undefined) return
  return (
    <div data-preview-id={props?.props?.previewId}
      className={`fs-${classId} mx-0 py-8 md:py-24 flex justify-center items-center`}
      style={
        image
          ? {
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
            }
          : null
      }
    >
      <div
        className={
          'w-11/12 md:w-3/4 rounded-3xl p-8 md:p12 flex flex-col justify-center items-center bg-opacity-95 bg-white ' +
          (!productId ? 'hp_teaser_box_shadow' : 'standard_box_shadow')
        }
      >
        {headline ? (
          <div className="text-3xl md:text-4xl text-balance font-semibold text-primary text-center pb-7 md:pb-10 w-full md:w-3/4">
            {headline}
          </div>
        ) : (
          ''
        )}
        {text.length ? (
          <div className="text-lg text-deepGray">
            {text.map((item, index) => {
              return <p key={index}>{item.content[0]?.content}</p>
            })}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
