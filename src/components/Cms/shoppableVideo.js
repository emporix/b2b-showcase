import React, { useEffect, useState } from 'react'
import productService from '../../services/product/product.service'
import EachProductRow from "../../pages/product/EachProductRow";
import priceService from "../../services/product/price.service";
import {useSelector} from "react-redux";
import {availabilityDataSelector} from "../../redux/slices/availabilityReducer";
import "../../components/Cms/shoppableVideo.css"
export const ShoppableVideo = (props) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false)
    const [products, setProducts] = useState([])
    const productData = props?.props?.data?.st_catalog
    const video = props?.props?.data?.st_video

    const productIds = productData.map(product => product?.data?.st_product?.value[0]?.identifier)
    const availabilityData = useSelector(availabilityDataSelector);
    useEffect(() => {
        const fetchProducts = async () => {
            const products = await productService.getProductsWithIds(productIds);
            const prices = await priceService.getPriceWithProductIds(productIds);
            const priceMap = new Map(prices.map(price => [price?.itemId?.id, price]));
            const availabilityMap = new Map(
                Object.values(availabilityData).map(item => [item.productId, item])
            );

            const enrichedProducts = products.map(product => {
                const productId = product?.id;
                return {
                    ...product,
                    price: priceMap.get(productId) || null,
                    availability:  availabilityMap.get(productId) || null
                };
            });

            setProducts(enrichedProducts);
        }

        fetchProducts()
    }, [productData])

    const handleVideoClick = () => {
        setIsOverlayVisible(!isOverlayVisible)
    }

    return (
        <div className="video-container">
            <video muted autoPlay={true} loop onClick={handleVideoClick}>
                <source src={video?.url} type="video/mp4"/>
            </video>
            {isOverlayVisible && (
                <div className={`product-container ${isOverlayVisible ? 'visible' : ''}`}>
                    {products.map((product, idx) => (
                        <EachProductRow key={idx} item={product} available={product?.availability?.available} rating={4} />
                    ))}
                </div>
            )}
        </div>

    );

}
