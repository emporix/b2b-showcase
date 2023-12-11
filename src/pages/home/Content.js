import React, {useEffect, useState} from 'react'
import './content.css'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { getCmsFilteredPage } from 'services/content/filteredPage.service'
import {getLanguageFromLocalStorage } from '../../context/language-provider'


const Content = ({type, page}) => {
    const [content, setContent] = useState([])
	const getData = async () => {
		const language = getLanguageFromLocalStorage() ?? 'de';
		const pageData = await getCmsFilteredPage(page, type, language)
		setContent(pageData)
	};
	useEffect(() => {
		getData();
	}, [])



    return (
        <div className="content">
            <FsGenericComponent props={content} />
        </div>
    )
}

export default Content
