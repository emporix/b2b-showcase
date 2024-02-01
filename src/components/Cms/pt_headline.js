import {normalizeFsStructure} from "resolver/firstSpirit.resolver";
import React from "react";

const Pt_Headline = (props) => {
    return (
        <h1 className="w-full h-fit bg-primary text-aliceBlue py-10 text-center text-[48px] md:text-[48px]  font-light md:leading-[64px] leading-[56px]">
            {props?.props}
        </h1>
    );
}

export default Pt_Headline
