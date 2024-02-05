import {normalizeFsStructure} from "resolver/firstSpirit.resolver";
import React from "react";
import Card from "./card";

// for recipes, weinipedia (blog), events, winemakers, (storefinder occtoo)
// possibly different config to fit the most possible generic way to use this

const List = (props) => {
    return (
        <div>
            <h1 className="w-full h-fit bg-primary text-aliceBlue py-10 text-center text-[48px] md:text-[48px]  font-light md:leading-[64px] leading-[56px]">
                {props?.props}
            </h1>
            <div>
                <Card />
            </div>
        </div>
    );
}

export default List;
