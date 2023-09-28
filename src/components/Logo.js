import { useContentful } from "../context/contentful-provider";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homeUrl } from "../services/service.config";
import walbuschLogo from '../assets/walbusch_logo.png';
import lashoeLogo from '../assets/lashoe_logo.png'; // Note: Fixed the missing '.png' here.
import meyedlichLogo from '../assets/mey-edlich_logo.png';
import { useSites } from '../context/sites-provider';

export const Logo = ({ onMouseOver, size, text }) => {
    const { fields } = useContentful();

    const [logoUrl, setLogoUrl] = useState('');
    const { companyLogo } = fields;
    const classes = size ? size : "w-[37px]";
    const typo = text ? text : "px-4 text-eerieBlack text-[25px]";
    const { currentSite } = useSites();

    useEffect(() => {
        if (companyLogo && companyLogo.fields && companyLogo.fields.file && companyLogo.fields.file.url) {
            setLogoUrl(companyLogo.fields.file.url);
        }
    }, [companyLogo]);

    let selectedLogo = logoUrl; // By default, the selected logo is from the contentful.
    if (currentSite === "main" || currentSite === "walbusch-at" || currentSite === "walbusch-ch") {
        selectedLogo = walbuschLogo;
    } else if (currentSite === "lashoe") {
        selectedLogo = lashoeLogo;
    } else if (currentSite === "Mey-Edlich") {
        selectedLogo = meyedlichLogo;
    }

    return (
        <Link to={homeUrl()} className="flex" onMouseOver={onMouseOver}>
            <img src={selectedLogo} alt={'Logo'} className="w-[203px] h-[84px] mt-[-20px]"/>
        </Link>
    );
};
