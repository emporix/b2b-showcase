import {normalizeFsStructure} from "resolver/firstSpirit.resolver";
import React from "react";
import Card from "./card";

// for very simple lists only (glossary maybe)

const Simple_List = (props) => {
    return (
        <div>
            <h1 className="w-full h-fit bg-primary text-aliceBlue py-10 text-center text-[48px] md:text-[48px]  font-light md:leading-[64px] leading-[56px]">
                {props?.props}
            </h1>
            <ul>
                <li>Item</li>
            </ul>
        </div>
    );
}

export default Simple_List;
