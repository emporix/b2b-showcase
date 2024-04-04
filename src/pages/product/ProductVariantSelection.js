import { useCurrency } from "context/currency-context"
import { useLanguage } from "context/language-provider"
import { useSites } from "context/sites-provider"
import { useEffect, useState } from "react"
import { useProducts } from "services/product/useProducts"
import { VariantSmallSummary } from "./VariantAccordion"
import { useSelector } from "react-redux"
import { availabilityDataSelector } from "redux/slices/availabilityReducer"

function normalizeColor(color) {
    return color.replace(/\s/g, '').toLowerCase();
}

function getAllVariantAttributes(variants, setAttribute, availability) { 
    const attributes = []
    let sortedAtrributes = {}
    let availableSizes = []

    const sizeSortOrder = {
        'XS': 0,
        'S': 1,
        'M': 2,
        'L': 3,
        'XL': 4,
        'XXL': 5,
    }
    
    variants?.forEach((element, index) => {
        const stockLevel = availability[`k${element.id}`].stockLevel
        attributes.push({
            key: index,
            ...element.mixins.productVariantAttributes,

        })
        
        if (!availableSizes.some(i => i.size === element.mixins.productVariantAttributes.size)) {
            availableSizes.push({
                id: index,
                size: element.mixins.productVariantAttributes.size,
                stockLevel
            })
        }
    });

    if (availableSizes.filter(size => 'M' === size).length > 0) {
        availableSizes.sort((a, b) => {
            return sizeSortOrder[a.size] - sizeSortOrder[b.size];
        });
    } else {
        availableSizes.sort((a, b) => {
            return Number(a.size) - Number(b.size)
        })
    }

    availableSizes = availableSizes.map(item => {
        return {
            size: item.size,
            stockLevel: item.stockLevel
        }
    })

    sortedAtrributes = attributes.reduce((acc, {color, size}) => {
        acc[color] ??= {color, availableSizes: []};

        if(Array.isArray(size)) 
            acc[color].availableSizes = acc[color].availableSizes.concat(size);
        else
            acc[color].availableSizes.push(size);
        

        return acc;
      }, {});    

    setAttribute({
        color: attributes[0].color,
        size: null,
        availableSizes,
        availableColors: Object.values(sortedAtrributes),
        availableSizesForColor: sortedAtrributes[Object.keys(sortedAtrributes)[0]].availableSizes
    })
}

export const ProductVariantSelection =  ({ product }) => {
    const { getVariantChildren } = useProducts()
    const { currentSite } = useSites()
    const [variants, setVariants] = useState([])
    const availability = useSelector(availabilityDataSelector)
    
    const { currentLanguage } = useLanguage()

    const { activeCurrency } = useCurrency()
    const [selectedAttributes, setAttribute] = useState({
        availableSizesForColor: [],
        availableSizes: [],
        availableColors: [],
        color: null,
        size: null,
    })

    const [selectedVariant, setVariant] = useState({})

    const selectedSizeVariant = (selectedAttributes, item) => {
        let styling = ''
        const availableSize = selectedAttributes.availableColors.filter((item) => selectedAttributes.color === item.color)[0].availableSizes
        if(availableSize.includes(item.size) && item.stockLevel > 0) {
            styling = 'product-variant-selection-color'
        } else {
            styling = 'product-variant-selection-color product-variant-selection-color_notAvailable'
        }

        if( selectedAttributes.size === item.size && isSizeAvailableForSelectedColor(selectedAttributes) && item.stockLevel > 0) {
            styling = styling + ' product-variant-selection-color_selected'
        } 
        return styling
    }

    const isSizeAvailableForSelectedColor = (selectedAttributes) => {
        return selectedAttributes.availableColors.filter((item) => selectedAttributes.color === item.color)[0].availableSizes.includes(selectedAttributes.size) ? true : false           
    }

    const activeAddToCart = (selectedVariant) => {
        return selectedVariant?.id !== undefined ? 'product-variant-cart' : 'product-variant-cart product-variant-cart_inActive'
    }

    useEffect(() => {
        ;(async () => {
            const allVariants = await getVariantChildren(product.id)

          if (allVariants !== undefined && variants.length <= 0) {
            setVariants(allVariants)
            getAllVariantAttributes(allVariants, setAttribute, availability)
          }


          if (selectedAttributes.color && selectedAttributes.size) {
            const selected = variants.filter(variant => variant.mixins.productVariantAttributes.color === selectedAttributes.color && variant.mixins.productVariantAttributes.size === selectedAttributes.size)[0];
            if (selected !== undefined) {
                
                setVariant(selected)
            } else if (selected === undefined && selectedVariant.id !== undefined) {
                setVariant({})
            } 
          }
        })()
      }, [product, currentSite, activeCurrency, currentLanguage, selectedAttributes, getVariantChildren, selectedVariant, variants, availability])

    return (
        <div>
            <div className="mb-4">
                <div className="flex">
                {selectedAttributes?.availableColors ? (
                    selectedAttributes?.availableColors.map(item => {
                         return (
                            <div className={selectedAttributes.color === item.color ? 'border border-solid border-black mr-2 p-[1px]': 'p-[2px] mr-2'}>
                                <div className={"p-[1px] w-10 h-10 bg-" + normalizeColor(item.color)} onClick={() => setAttribute({
                                    ...selectedAttributes,
                                    color: item.color
                                })}></div>
                            </div>
                        )
                    })
                ): ''}
                </div>
            </div>
            
            <div className="mb-4">
                <div className="flex">
                    {selectedAttributes?.availableSizes.length ? (
                        selectedAttributes?.availableSizes.map(item => {
                            return (
                                <button className={selectedSizeVariant(selectedAttributes, item)} onClick={() => setAttribute({
                                    ...selectedAttributes,
                                    size: item.size
                                })}>
                                    { item.size }
                                </button>
                            )
                        })
                    ) : ''}                 
                </div>
            </div>
           
            <div className={activeAddToCart(selectedVariant)}>    
               <VariantSmallSummary variant={selectedVariant}></VariantSmallSummary>
            </div>
      
        </div>
    )
}