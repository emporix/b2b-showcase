import CMS_Footer from "components/Cms/footer";
import Pt_Headline from "components/Cms/pt_headline";
import Teaser from "components/Cms/teaser";
import Text_Banner from "components/Cms/text_banner";

const firstSpiritComponentMap = {
    pt_headline: Pt_Headline,
    teaser: Teaser,
    text_banner: Text_Banner,
    footer: CMS_Footer
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


export const normalizeFooterStructure = (content) => {
    return {
        footer: [
            { 
                headline: content[1],
                items: content[0],
            },
            {
                headline: content[3],
                items: content[2]
            },
            {
                headline: content[5],
                items: content[4]
            },
            {
                headline: content[7],
                items: content[6]
            },
        ],
        copyright: {
            copy: content[8],
            items: content[9]
        }
    }
}

const FsGenericComponent = (props) => {

    const componentLayout = props?.props?.data?.cmsFilteredPage?.page?.layout

    let componentData = [
        ...Object.values(props?.props?.data?.cmsFilteredPage?.page?.data ?? {}),
    ] ?? [];

    const children = props?.props?.data?.cmsFilteredPage?.page?.children[0]?.children;
    if (children !== undefined && Array.isArray(children)) {
        componentData = [
            ...componentData,
            ...children
        ]
    }

    if (componentLayout === "footer") {

        const Component = firstSpiritComponentMap[componentLayout];
        // Prevent undefined components to be rendered
        if (Component === undefined) return
        
        return (
            <Component props={normalizeFooterStructure(componentData)}/>
        )
    } else {
        return (
            <div>
                {componentData.map((entry, idx) => {
                    let key = ""
   
                    if(entry?.template?.uid) {
                        key = entry?.template?.uid
                    } else if(entry?.name) {
                        key = entry?.name
                    } else if (entry?.sectionType) {
                        key = entry?.sectionType;
                    } else {
                        key = "text_banner"
                    }
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
}

export default FsGenericComponent
