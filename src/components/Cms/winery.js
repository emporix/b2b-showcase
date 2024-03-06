import React from 'react'

const Winery = ({ props }) => {
  const text =
    props?.props?.data?.cmsFilteredPage?.page?.children[0]?.children[0]?.data
      ?.st_text[0]?.content[0]?.content

  console.log(text)

  if (text === undefined) return
  return (
    <div className="winery product-details-tab-content-wrapper text-lg font-light">
      <div className={'winery__content'}>
        {text.length ? <div className="winery__text">{text}</div> : ''}
      </div>
    </div>
  )
}

export default Winery
