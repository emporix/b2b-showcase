import {normalizeFsStructure} from "resolver/firstSpirit.resolver";
import React from "react";

const Pt_Headline = (props) => {
    const content = normalizeFsStructure(props)

    return (
        <h1 className="py-10 text-center text-[48px] md:text-[48px] font-semibold md:leading-[64px] leading-[56px]">
            {content?.value}
        </h1>
    );
}

export default Pt_Headline
