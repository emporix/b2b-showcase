import { StoryblokComponent, storyblokEditable } from "@storyblok/react/rsc"

const GlobalReference = ({ blok }) => {
  return blok.reference ? (
    <StoryblokComponent
      {...storyblokEditable(blok)}
      blok={typeof blok.reference !== "string" ? blok.reference?.content : {}}
    />
  ) : (
    <p className="font-bolder ml-10 text-red-500">
      Bitte Referenz im Block &quot;Globale Referenz&quot; wählen
    </p>
  )
}

export default GlobalReference
