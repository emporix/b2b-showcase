import React, {useEffect, useState} from 'react'
import {useContentful} from '../../context/contentful-provider'
import './about.css'

const About = () => {
    const {fields} = useContentful()
    const [introImageUrl, setIntroImageUrl] = useState('')

    const {mainImageRight} = fields

    useEffect(() => {
        ;(async () => {
            if (
                mainImageRight &&
                mainImageRight.fields &&
                mainImageRight.fields.file &&
                mainImageRight.fields.file.url
            ) {
                const dummyImage = "../../assets/homepage-banner.png";
                //setIntroImageUrl(mainImageRight.fields.file.url)
                setIntroImageUrl(dummyImage);
            }
        })()
    }, [mainImageRight])


    // {fields.mainTitle}, {fields.companyMission},
    return (
        <div
            // style={{ backgroundImage: `url(${landingBg})` }}
            className="home_about"
        >
            <div className="w-1/2 h-fit flex flex-col text-eerieBlack pt-52">
                <div className="text-[72px] font-inter font-semibold md:leading-[64px] leading-[56px]">
                    Erleben Sie den <span className="text-primary">Luxus</span><br/> mit neteleven <span
                    className="text-primary">Wein</span>
                </div>
                <div className="text-[18px] leading-[30px] font-inter font-normal pt-[24px] md:max-w-[525px]">
                    Unsere exquisiten, handverlesenen Weine spiegeln die Eleganz und Qualität wider, die Sie von
                    neteleven erwarten
                </div>
                <div className="pt-[44px] desktop_only text-sm">
                    <button className="px-6 py-4 font-semibold bg-primary text-white rounded">
                        {fields.startShoppingButtonLabel}
                    </button>
                </div>
            </div>

            <div className='flex justify-end w-2/5 pt-28 h-fit'>
                <img className="w-fit h-fit" alt='' src="/img/bottlesandberries.png"/>
            </div>
            

        </div>
    )
}

export default About
