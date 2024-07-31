import { StoryblokComponent, storyblokEditable } from "@storyblok/react";

const Page = ({ blok }) => (
  <main {...storyblokEditable(blok)}>
    {blok.body && blok.body.map((blok, index) => {
      return index !== 1 ? <StoryblokComponent blok={blok} key={blok._uid} /> :
        <>
          <div className="h-[80px] md:h-[136px]" />
          <StoryblokComponent blok={blok} key={blok._uid} />
        </>
    })}
  </main>
);

export default Page;
