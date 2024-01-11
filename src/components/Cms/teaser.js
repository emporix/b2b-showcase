import './teaser.css';

const Teaser = (props) => {
    const content = props.props.data
    const headline = content?.st_headline;
    const text = content?.st_text;
    const image = content?.st_picture?.resolutions.ORIGINAL;

    if (headline === undefined && text === undefined && image === undefined) return;
    return (
        <div className="teaser"
             style={image ? {
                 backgroundImage: `url(${image.url})`,
                 backgroundSize: 'cover',
             } : null}
             >
            <div
                className="teaser__content">
                {headline ? (
                    <div className="teaser__headline">
                        {headline}
                    </div>
                ) : ""}
                {text.length ? (
                    <div className="teaser__text">
                        {text.map((item, index) => {
                            return <p key={index}>{item.content[0]?.content}</p>
                        })}
                    </div>
                ) : ""}
            </div>
        </div>
    )
}

export default Teaser
