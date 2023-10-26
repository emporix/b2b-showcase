import parse from 'html-react-parser'
import { useEffect, useState } from 'react';
import { getImage } from 'services/content/image.service';

const Teaser = (props) => {
    const content = props.props.formData
    const headline = content?.st_headline?.value;
    const text = content?.st_text?.value;
    const image = content?.st_picture?.value;


    const [resolvedImage, setImage] = useState([])
	const getData = async () => {
        if (content?.st_picture?.value?.url !== undefined) {
            const resolvedImage = await getImage(content?.st_picture?.value?.url)
		    setImage(resolvedImage.data.cmsImage)
        }
	};
	useEffect(() => {
		getData();
	}, [])

    return (
        <div className="teaser">
            {headline ? (
                <div className="teaser__headline">
                    {headline}
                </div>
            ) : ""}

            {text ? (
                <div className="teaser__text">
                    {parse(text)}
                </div>
            ) : ""}

            {resolvedImage ? (
                <div className="teaser__image">
                    <img src={resolvedImage.url} alt={image?.name} />
                </div>
            ) : ""}
        </div>
    )
}

export default Teaser