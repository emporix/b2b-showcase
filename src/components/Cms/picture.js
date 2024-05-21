import { React } from 'react'
import './teaser.css'

export const Picture = (props) => {
  return (
    <img className="rounded-xl" src={props.props.data.st_picture.resolutions.ORIGINAL.url} alt={props.props.data.st_picture.description}/>
  )
}
