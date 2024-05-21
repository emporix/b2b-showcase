import React from 'react'
import { Headline } from './headline'
import { Text } from './text'
import { ButtonLink } from './buttonLink'
import { Picture } from './picture'

export const TextPicture = (props) => {
  return <>
    {props.props.data.st_headline && <Headline props={props.props} />}
    {props.props.data.st_text && <Text props={props.props}/>}
    {props.props.data.st_buttonLink && <ButtonLink props={props.props}/>}
    {props.props.data.st_picture && <Picture props={props.props}/>}
    </>
}
