import { React } from 'react'
import './teaser.css'

export const Text = (props) => {
  return props.props.data.st_text.map((text1) => {
    return text1.content.map((text2, idx) => {
      return (
        <p className="mt-3 mr-6 ml-6 mb-6 text-lg text-left text-eerieBlack font-light" key={idx}>
          {text2.content}
        </p>
      )
    })
  })
}
