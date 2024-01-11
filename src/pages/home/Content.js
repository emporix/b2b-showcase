import React, {useEffect, useState} from 'react'
import './content.css'
import FsGenericComponent from 'resolver/firstSpirit.resolver'
import { getCmsFilteredPage } from 'services/content/filteredPage.service'

const Content = ({type, page}) => {
    const [content, setContent] = useState([])
	const getData = async () => {
		if(page && type) {
			const pageData = await getCmsFilteredPage(page, type)
			setContent(pageData)
		}
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
