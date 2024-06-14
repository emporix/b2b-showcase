export const ButtonLink = ({ props }) => {
  console.log(props)
  return (
    <div className="mx-4 mx-adjust">
      <button className="cta-primary block mx-auto md:mx-0">{props.data.st_buttonLink.data.lt_text}</button>
    </div>
    //todo: link to some/where?
  )
}
