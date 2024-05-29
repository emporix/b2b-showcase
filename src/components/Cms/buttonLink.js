import './teaser.css'
import { Button } from '@mui/material'

export const ButtonLink = (props) => {
  return (
    <button className="cta-primary my-2">{props.props.data.st_buttonLink.data.lt_text}</button>
    //todo: link to some/where?
  )
}
