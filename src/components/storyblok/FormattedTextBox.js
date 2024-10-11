import * as React from 'react'
import { NODE_PARAGRAPH, render } from 'storyblok-rich-text-react-renderer'
import { cn } from '../cssUtils'

const resolvers = {
  nodeResolvers: {
    [NODE_PARAGRAPH]: (children) => {
      return children ? <p>{children}</p> : <br />
    },
  },
}

const FormattedTextBox = (props) => {
  return (
    <div
      className="flex size-full break-words leading-[187.5%] tracking-wider"
    >
      <div
        className={cn(
          'w-full md:max-w-none max-w-none',
          'prose-headings:leading-none prose-headings:font-medium prose-headings:text-demoHeadlines',
          'prose-ul:ml-2 prose-ul:mt-1 prose-ul:list-[disc]',
          'prose-ol:ml-2 prose-ol:mt-3',
          'prose-li:m-3 prose-li:text-demoHeadlines prose-li:marker:text-demoHeadlines',
          'prose-a:no-underline',
          'prose-p:tracking-[0px] prose-p:mb-2.5 prose-p:text-demoGrayDarkest',
        )}
      >
        {render(props.text, resolvers)}
      </div>
    </div>
  )
}

export default FormattedTextBox
