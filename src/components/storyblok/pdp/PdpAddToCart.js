import { storyblokEditable } from '@storyblok/react'
import Quantity from '../../Utilities/quantity/quantity'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import LayoutContext from '../../../pages/context'
import { useCart } from '../../../context/cart-provider'
import { useLanguage } from '../../../context/language-provider'
import { AiOutlineBell, AiOutlineShoppingCart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector,
} from '../../../redux/slices/availabilityReducer'
import Dialog from '../../Utilities/Dialog'
import { getBrand } from '../../../services/product/brand.service'
import FormattedTextBox from '../FormattedTextBox'
import { api } from '../../../services/axios'
import { formatPrice, isPriceValid } from '../../../helpers/price'

const PdpAddToCart = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [quantity, setQuantity] = useState(1)
  const [formVisible, setFormVisible] = useState(false)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [brand, setBrand] = useState()
  const { setShowCart } = useContext(LayoutContext)
  const { putCartProduct } = useCart()
  const { currentLanguage } = useLanguage()
  const availability = useSelector(availabilityDataSelector)

  const initialFormData = {
    email: '',
    privacyPolicy: false,
  }

  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    const brandId = product?.mixins?.productCustomAttributes?.brand
    brandId && getBrand(brandId).then((data) => {
      setBrand(data)
    })
  }, [product])

  const stockLevel = availability['k' + product.id]?.stockLevel

  const ePrice = formatPrice(product)
  const inStock = stockLevel > 0

  const canPurchase = inStock && isPriceValid(product)

  const increaseQty = () => {
    setQuantity((prevState) => prevState + 1)
  }

  const decreaseQty = () => {
    if (quantity <= 1) return
    setQuantity((prevState) => prevState - 1)
  }

  const handleProductAddToCart = useCallback((product, action, quantitiy) => {
    let newProduct = { ...product }
    newProduct.quantity = quantitiy
    putCartProduct(newProduct)
    action(true)
  }, [])

  const handleRemindMe = () => {
    setFormVisible(true)
  }

  const handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    const newFormData = {
      ...formData, [name]: value,
    }
    setFormData(newFormData)
  }

  const sendForm = (data) => {
    console.log(`sending data ${JSON.stringify(data)} to ${process.env.REACT_APP_HOOK_REMINDER}`)
    api.post(
      process.env.REACT_APP_HOOK_REMINDER,
      data).
      then(_result => {
        setConfirmationVisible(true)
        setFormData(initialFormData)
      }).
      catch(error => console.log("sendForm", error))
  }

  const evaluatedType = !isPriceValid(product) ? "promotion" : "availability"

  const handleOnSubmit = (event) => {
    event.preventDefault()
    setFormVisible(false)

    const data =
    {
      "email": formData.email,
      "productCode": product.id,
      "privacy": formData.privacyPolicy,
      "type": evaluatedType
    }

    sendForm(data)
  }

  return (<div {...storyblokEditable(blok)}>
    {canPurchase ?
      (<div className="flex flex-row">
        <div className="quantity">
          <Quantity
            value={quantity}
            increase={increaseQty}
            decrease={decreaseQty}
            onChange={(value) => {
              setQuantity(value)
            }}
          />
        </div>
        <div className="flex w-full">
          <button
            disabled={!product.price}
            className="ml-4 flex flex-row w-full max-w-[448px] h-[50px] place-items-center place-content-center bg-demoSecondaryDimmed hover:bg-demoSecondaryDimmed rounded text-white uppercase font-bold"
            onClick={() =>
              handleProductAddToCart(product, setShowCart, quantity)
            }
          >
            <AiOutlineShoppingCart size={27} />
            <div className="ml-3">{currentLanguage === 'de' ?
              'In den Warenkorb' :
              'add to cart'}</div>
          </button>
        </div>
      </div>) :
      <button
        disabled={!product.price}
        className="flex flex-row w-full h-[50px] place-items-center place-content-center border border-demoGrayDarker bg-white hover:border-demoSecondaryDimmed rounded text-demoSecondaryDimmed uppercase font-bold"
        onClick={() =>
          handleRemindMe()
        }
      >
        <AiOutlineBell size={27} />
        <div className="ml-3">{currentLanguage === 'de' ?
          'Erinnern' :
          'remind me'}</div>
      </button>}
    <Dialog maxWidth="xl"
            open={formVisible}
            onClose={() => {
              setFormVisible(false)
            }}>
      <div className="flex flex-col text-demoFontHighlightColor p-3">
        <div
          className="text-xl font-bold border-b border-demoGray pb-1 mb-4">{blok.title}</div>
        <div className="flex flex-row mb-2">
          <img className="w-44 bg-demoGrayBrightest" src={product.src} alt="" />
          <div className="flex flex-col">
            <div className="">{brand?.name}</div>
            <div className="font-bold mb-6">{product.name}</div>
            <div>{currentLanguage === 'de' ? 'Einzelpreis' : 'Unit price'}</div>
            <div className="font-bold">{ePrice} €</div>
          </div>
        </div>
        <div className="mb-5">{blok.text}</div>
        <form onSubmit={handleOnSubmit}
              className="flex flex-col bg-demoGrayBrightest mb-5 rounded p-4">
          <label className="mb-1">{currentLanguage === 'de' ?
            'E-Mail-Adresse' :
            'E-Mail Address'}<span className="text-demoAlerting"> *</span></label>
          <input id="email" name="email"
                 className="mb-4 focus:border-demoSecondaryDimmed rounded border-demoGrayDarker"
                 type={'email'} value={formData.email}
                 required
                 onChange={handleInputChange}></input>
          <div className="mb-4 flex flex-row">
            <input id="privacyPolicy" name="privacyPolicy"
                   className="focus:ring-0 text-demoSecondaryDimmed border-demoGrayDarker rounded w-6 h-6"
                   type={'checkbox'} value={formData.privacyPolicy}
                   required
                   onChange={handleInputChange} />
            <label className="ml-2">{blok.privacyPolicy}<span
              className="text-demoAlerting"> *</span></label>
          </div>
          <button
            className="flex flex-row w-full h-[50px] place-items-center place-content-center bg-demoSecondaryDimmed hover:bg-demoSecondaryDimmed rounded text-white uppercase font-bold"
            type="submit">
            <AiOutlineBell size={27} />
            <div className="ml-3">{currentLanguage === 'de' ?
              'Erinnerung aktivieren' :
              'Activate Reminder'}</div>
          </button>
        </form>
        <div className="mb-10"><span
          className="text-demoAlerting">*</span> {currentLanguage ===
        'de' ?
          'Pflichtfeld' :
          'Mandatory field'}</div>
        <div className="prose-p:text-xs prose-headings:text-sm">
          <FormattedTextBox text={blok.hints} />
        </div>
      </div>
    </Dialog>
    <Dialog maxWidth="xl"
            open={confirmationVisible}
            onClose={() => {
              setConfirmationVisible(false)
            }}>
      <div className="flex flex-col text-demoFontHighlightColor p-3">
        <div
          className="text-xl font-bold border-b border-demoGray pb-1 mb-4">{blok.confirmationTitle}</div>
        <div className="flex flex-row pl-8">
          <AiOutlineBell size={80} />
          <div className="ml-10">
            <FormattedTextBox text={blok.confirmationText} />
          </div>
        </div>
      </div>
    </Dialog>
  </div>)
}

export default PdpAddToCart
