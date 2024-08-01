import { StoryblokComponent, storyblokEditable } from "@storyblok/react/rsc"

const Global = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body ? (
        <>
          {blok.body.map((nestedBlok) => {
            return (
              <StoryblokComponent
                blok={nestedBlok}
                key={nestedBlok._uid}
              />
            )
          })}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Global
