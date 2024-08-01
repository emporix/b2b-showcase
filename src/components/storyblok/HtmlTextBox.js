import DOMPurify from "isomorphic-dompurify"

const HtmlTextBox = (props) => {
  const domains = ["youtube-nocookie.com", "youtube.com"]

  DOMPurify.addHook("uponSanitizeElement", (currentNode, data, _config) => {
    if (data.tagName === "iframe") {
      if (
        domains.some((domain) =>
          currentNode.getAttribute("src")?.includes(domain)
        )
      ) {
        currentNode.setAttribute(
          "sandbox",
          "allow-scripts allow-same-origin allow-presentation allow-popups"
        )
      }
    }
  })

  return (
    <div
      className="prose relative max-w-full"
      style={{
        ["--tw-prose-body"]: "inherit",
        ["--tw-prose-headings"]: "inherit",
        ["--tw-prose-lead"]: "inherit",
        ["--tw-prose-links"]: "inherit",
        ["--tw-prose-bold"]: "inherit",
        ["--tw-prose-counters"]: "inherit",
        ["--tw-prose-bullets"]: "inherit",
        ["--tw-prose-hr"]: "inherit",
        ["--tw-prose-quotes"]: "inherit",
        ["--tw-prose-quote-borders"]: "inherit",
        ["--tw-prose-captions"]: "inherit",
        ["--tw-prose-kbd"]: "inherit",
        ["--tw-prose-kbd-shadows"]: "inherit",
        ["--tw-prose-code"]: "inherit",
        ["--tw-prose-pre-code"]: "inherit",
        ["--tw-prose-pre-bg"]: "inherit",
        ["--tw-prose-th-borders"]: "inherit",
        ["--tw-prose-td-borders"]: "inherit",
        ["--tw-prose-invert-body"]: "inherit",
        ["--tw-prose-invert-headings"]: "inherit",
        ["--tw-prose-invert-lead"]: "inherit",
        ["--tw-prose-invert-links"]: "inherit",
        ["--tw-prose-invert-bold"]: "inherit",
        ["--tw-prose-invert-counters"]: "inherit",
        ["--tw-prose-invert-bullets"]: "inherit",
        ["--tw-prose-invert-hr"]: "inherit",
        ["--tw-prose-invert-quotes"]: "inherit",
        ["--tw-prose-invert-quote-borders"]: "inherit",
        ["--tw-prose-invert-captions"]: "inherit",
        ["--tw-prose-invert-kbd"]: "inherit",
        ["--tw-prose-invert-kbd-shadows"]: "inherit",
        ["--tw-prose-invert-code"]: "inherit",
        ["--tw-prose-invert-pre-code"]: "inherit",
        ["--tw-prose-invert-pre-bg"]: "inherit",
        ["--tw-prose-invert-th-borders"]: "inherit",
        ["--tw-prose-invert-td-borders"]: "inherit",
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(props.text, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: [
              "allow",
              "allowfullscreen",
              "frameborder",
              "scrolling",
              "sandbox",
            ],
          }),
        }}
      />
    </div>
  )
}

export default HtmlTextBox
