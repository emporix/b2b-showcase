import React, {useEffect, useState} from 'react'
import './content.css'
import { getPage } from 'services/content/page.service'
import FsGenericComponent from 'resolver/firstSpirit.resolver'

const Content = () => {
    const [content, setContent] = useState([])
	const getData = async () => {
		const pageData = await getPage()
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
