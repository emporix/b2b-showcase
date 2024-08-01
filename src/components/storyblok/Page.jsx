import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import { Fragment } from 'react'

const Page = ({ blok }) => (
  <main {...storyblokEditable(blok)}>
    {blok.body && blok.body.map((blok, index) => {
      return index !== 1 ? <StoryblokComponent blok={blok} key={blok._uid} /> :
        <Fragment key={blok._uid}>
          <div className="h-[80px] md:h-[136px]" />
          <StoryblokComponent blok={blok} />
        </Fragment>
    })}
  </main>
);

export default Page;
