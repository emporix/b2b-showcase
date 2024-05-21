import './teaser.css'
import { Button } from '@mui/material'

export const ButtonLink = (props) => {
  return (
    <button className="px-6 py-4 mt-2 mb-2 font-semibold bg-primary text-white rounded-xl">{props.props.data.st_buttonLink.data.lt_text}</button>
    //todo: link to some/where?
  )
}
