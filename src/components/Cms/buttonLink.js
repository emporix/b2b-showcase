export const ButtonLink = (props) => {
  return (
    <button className="cta-primary block mx-auto md:mx-0">{props.props.data.st_buttonLink.data.lt_text}</button>
    //todo: link to some/where?
  )
}
