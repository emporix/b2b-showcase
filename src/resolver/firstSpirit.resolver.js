import Pt_Headline from "components/Cms/pt_headline";
import Teaser from "components/Cms/teaser";

const firstSpiritComponentMap = {
    pt_headline: Pt_Headline,
    teaser: Teaser,
};

export const normalizeFsStructure = (content) => {
    if (typeof (content?.props?.fsType) === "string") {
        return content.props
    } else if (typeof (content.fsType) === "string") {
        return content
    } else {
        return {}
    }
}

const FsGenericComponent = (props) => {
    let componentData = [
        ...Object.values(props?.props?.data?.cmsFilteredPage?.page?.data ?? {}),
    ] ?? [];


    const children = props?.props?.data?.cmsFilteredPage?.page?.children[0].children;
    if (children !== undefined && Array.isArray(children)) {
        componentData = [
            ...componentData,
            ...children
        ]
    }
    return (
        <div>
            {componentData.map(entry => {
                const key = entry?.template?.uid ? entry?.template?.uid : entry?.name;
                const Component = firstSpiritComponentMap[key];

                // Prevent undefined components to be rendered
                if (Component === undefined) return

                return (
                    <div><Component props={entry}/></div>
                );
            })}
        </div>
    )
}

export default FsGenericComponent
