import { StoryblokComponent, storyblokEditable } from "@storyblok/react/rsc"

const GlobalReference = ({ blok }) => {
  return blok.reference ? (
    <StoryblokComponent
      {...storyblokEditable(blok)}
      blok={blok.reference?.content}
    />
  ) : (
    <p className="font-bolder ml-10 text-wk-red">
      Bitte Referenz im Block &quot;Globale Referenz&quot; wählen
    </p>
  )
}

export default GlobalReference
