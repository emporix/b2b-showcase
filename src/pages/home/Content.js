import React, {useEffect, useState} from 'react'
import './content.css'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { getCmsFilteredPage } from 'services/content/filteredPage.service'
import { useLanguage } from '../../context/language-provider'


const Content = ({type, page}) => {
    const [content, setContent] = useState([])
		const { currentLanguage } = useLanguage()
	const getData = async (currentLang) => {
		const pageData = await getCmsFilteredPage(page, type, currentLang)
		setContent(pageData)
	};
	useEffect(() => {
		getData(currentLanguage);
	}, [currentLanguage])



    return (
        <div className="content">
            <FsGenericComponent props={content} />
        </div>
    )
}

export default Content
