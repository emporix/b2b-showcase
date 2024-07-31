const StoryblokImage = (props) => {
  const match = RegExp(/\/(\d+)x(\d+)\//).exec(props.src)
  const width = match ? Number(match[1]) : 0
  const height = match ? Number(match[2]) : 0

  // see also storyblok image service https://www.storyblok.com/docs/image-service/
  const imageSource = (() => {
    return props.src.toLowerCase().includes(".svg")
      ? props.src
      : props.src + "/m/"
  })()

  return (
    <img
      className={props.className}
      src={imageSource}
      alt={props.alt ?? ""}
      title={props.title ?? ""}
      width={!props.fill ? width : undefined}
      height={!props.fill ? height : undefined}
    />
  )
}

export default StoryblokImage
