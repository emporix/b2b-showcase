import React, { useEffect, useState } from 'react'
import productService from '../../services/product/product.service'
import EachProductRow from "../../pages/product/EachProductRow";
export const ShoppableVideo = (props) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false)
    const [products, setProducts] = useState([])
    const productData = props?.props?.data?.st_catalog
    const video = props?.props?.data?.st_video

    const productIds = productData.map(product => product?.data?.st_product?.value[0]?.identifier)

    useEffect(() => {
        const fetchProducts = async () => {
            setProducts(await productService.getProductsWithIds(productIds))
        }

        fetchProducts()
    }, [productData])

    const handleVideoClick = () => {
        setIsOverlayVisible(!isOverlayVisible)
    }

    return (
        <div className="video-container">
            <video width="750" height="500" muted autoPlay={true} onClick={handleVideoClick}>
                <source src={video?.url} type="video/mp4"/>
            </video>
            {isOverlayVisible && (
                <div className="product-mini-container">
                    {products.map((product, idx) => (
                        <EachProductRow key={idx} item={product} available={true} rating={4} />
                    ))}
                </div>
            )}
        </div>
    )
}
