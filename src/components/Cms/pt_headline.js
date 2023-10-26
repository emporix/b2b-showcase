import { normalizeFsStructure } from "resolver/firstSpirit.resolver";

const Pt_Headline = (props) => {
  const content = normalizeFsStructure(props)

    return (
        <h1>{content?.value}</h1>
    );
}

export default Pt_Headline