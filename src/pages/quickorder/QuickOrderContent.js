import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TextInputOnly } from '../../components/Utilities/input'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { messageSelector } from '../../redux/slices/messageReducer'
import cartService from 'services/cart.service'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import priceService from 'services/product/price.service'
import LayoutContext from 'pages/context'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import './quickorder.css'
import { useDebounce } from 'hooks/useDebounce'
import { useQuickOrder } from 'context/quickorder-context'
import {
  LargePrimaryButton,
  MediumPrimaryButton,
} from 'components/Utilities/button'
import { useCart } from 'context/cart-provider'

const CartItem = ({
  item,
  codeHandler,
  quantityHandler,
  feature,
  focusHanlder,
  blurHandler,
  activeFocusCode,
  removeHandler,
}) => {
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      className="text-base"
    >
      <TableCell component="th" scope="row" className="!py-6">
        {feature === 'action' ? (
          <TextInputOnly
            value={item.code}
            action={codeHandler}
            placeholder="Enter Code"
            className="border max-w-[160px]"
          />
        ) : (
          <TextInputOnly value={item.code} className="border max-w-[160px]" />
        )}
      </TableCell>
      <TableCell align="left" className="!py-6 !font-bold w-[250px]">
        {item.name}
      </TableCell>
      <TableCell align="left" className="!py-6">
        <TextInputOnly
          value={item.quantity}
          action={(value) => quantityHandler(value, item.code, feature)}
          onFocus={() => {
            if (focusHanlder !== undefined) focusHanlder(item.code)
          }}
          onBlur={() => {
            if (blurHandler !== undefined) blurHandler(item.code)
          }}
          className="border max-w-[56px] "
          autoFocus={activeFocusCode === item.code ? true : false}
        />
      </TableCell>
      <TableCell align="left" className="!py-6">
        {item.price.totalValue ? (
          <CurrencyBeforeValue value={item.price.totalValue} />
        ) : null}
      </TableCell>
      <TableCell align="left" className="!py-6">
        {item.price.totalValue ? (
          <CurrencyBeforeValue
            value={
              Math.trunc(item.price.totalValue * item.quantity * 100) / 100
            }
          />
        ) : null}
      </TableCell>
      <TableCell
        align="left"
        className="!py-6 cursor-pointer"
        onClick={() => removeHandler(item.code)}
      >
        {item.code ? <span className="underline font-bold">X</span> : null}
      </TableCell>
    </TableRow>
  )
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const DesktopContent = () => {
  const {
    fetchProductsByCode,
    productsSuggestions,
    tempProductList,
    setTempProductList,
    newProduct,
    setNewProduct,
    handleAddItem,
    updateQuantity,
  } = useQuickOrder()
  const productOptions = useMemo(() => {
    return productsSuggestions.map((item) => {
      return {
        id: item.code,
        label: item.name,
      }
    })
  }, [productsSuggestions])

  const { debounce } = useDebounce(300)
  const { setShowCart } = useContext(LayoutContext)
  const activeFocusCode = useRef(null)
  // Notification message
  const [openNotification, setOpenNotification] = useState(false)
  const message = useSelector(messageSelector)
  const { cartAccount, syncCart } = useCart()

  // Notification handle close
  const handleClose = () => {
    setOpenNotification(false)
  }
  // Handle Code Change
  const handleCodeChange = (code) => {
    debounce(() => fetchProductsByCode(code))
  }
  const handleSelectItem = useCallback(
    async (code) => {
      const product = productsSuggestions.find((p) => p.code === code)
      if (!product) {
        return
      }
      const prices = await priceService.getPriceWithProductIds([product.id])
      setNewProduct((prev) => ({ ...prev, ...product, price: prices[0] }))
    },
    [productsSuggestions]
  )
  // Handle Quantity Change
  const handleQuantityChange = (quantity, code) => {
    updateQuantity(quantity, code)
  }
  const handleFocus = (code) => {
    activeFocusCode.current = code
  }
  const handleBlur = () => {
    activeFocusCode.current = null
  }
  const handleRemove = (code) => {
    setTempProductList((tempProductList) =>
      tempProductList.filter((product) => product.code !== code)
    )
  }
  const clearProductList = () => {
    setTempProductList([])
  }
  const addProductsToCart = async () => {
    await cartService.addMultipleProductsToCart(cartAccount.id, tempProductList)
    syncCart()
    setShowCart(true)
  }
  return (
    <div className="desktop_only border border-quartz rounded p-6">
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <div className="float-right text-[16px]/[24px] font-medium text-dodgerBlue">
        <span className="pr-8 cursor-pointer" onClick={clearProductList}>
          Clear List
        </span>
        <span>Order list</span>
      </div>
      <div className="pt-[58px]">
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="!py-2">
                <TableCell
                  align="left"
                  className="font-inter !font-normal text-[14px]/[22px] !text-manatee"
                >
                  Code
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-normal text-[14px]/[22px] !text-manatee"
                >
                  Item
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-normal text-[14px]/[22px] !text-manatee"
                >
                  Quantity
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-normal text-[14px]/[22px] !text-manatee"
                >
                  Unit Price
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-normal text-[14px]/[22px] !text-manatee"
                >
                  Total
                </TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tempProductList.length > 0 ? (
                tempProductList.map((tempoProduct) => (
                  <CartItem
                    feature="row"
                    key={Math.random()}
                    item={tempoProduct}
                    quantityHandler={handleQuantityChange}
                    focusHanlder={handleFocus}
                    blurHandler={handleBlur}
                    activeFocusCode={activeFocusCode.current}
                    removeHandler={handleRemove}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="font-inter !font-bold text-[14px]"
                  >
                    Empty Cart List
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-between w-full items-center gap-4 mt-8">
          <Autocomplete
            className="grow"
            size="small"
            options={productOptions}
            filterOptions={(x) => x}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {`${option.id} - ${option.label}`}
                </li>
              )
            }}
            onInput={(event) => {
              handleCodeChange(event.target.value)
            }}
            onChange={(_, v) => {
              if (v) {
                handleSelectItem(v.id)
              }
            }}
            sx={{ width: 300, padding: 0 }}
            renderInput={(params) => {
              return <TextField {...params} label={params.name} />
            }}
          />
          <TextField
            value={newProduct.quantity}
            type="number"
            size="small"
            className="w-auto"
            sx={{
              padding: 0,
              borderColor: '#214559',
            }}
            onChange={(e) => {
              setNewProduct((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value || 0),
              }))
            }}
          />
          <MediumPrimaryButton
            title={'Add'}
            onClick={handleAddItem}
            className="w-auto cta-button bg-yellow"
          />
        </div>
      </div>
      <div className="float-right pt-12 flex flex-col">
        <LargePrimaryButton
          title={'ADD TO CART'}
          onClick={addProductsToCart}
          disabled={tempProductList.length === 0}
          className="cta-button bg-yellow"
        />
      </div>
    </div>
  )
}

const MobileContent = () => {
  const [quickOrderList, setQuickOrderList] = useState([])
  const handleCodeChange = (code) => {}

  const MobileQuickOrderCell = ({ item }) => {
    return (
      <div className="w-full pt-10">
        <div className="flex gap-2">
          <input
            value={item.code}
            onChange={handleCodeChange}
            className="border p-1 w-[72%]"
            placeholder="Enter Code"
          />
          <input
            value={item.quantity}
            onChange={handleCodeChange}
            className="border p-1 w-[25%]"
          />
        </div>
        {item.code ? (
          <div>
            <div className="pt-4 font-bold text-base">{item.name}</div>
            <div className="flex justify-between pt-4">
              <div className="flex">
                <div>
                  <span className="font-bold text-sm">Unit Price</span>
                  <br />
                  <span className="tex-sm">
                    <CurrencyBeforeValue value={item.unitPrice} />
                  </span>
                </div>
                <div className="pl-6">
                  <span className="font-bold text-sm">Total Price</span>
                  <br />
                  <span className=" tex-sm">
                    <CurrencyBeforeValue value={item.total} />
                  </span>
                </div>
              </div>
              <div className="items-center">
                <span className="underline font-bold">X</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="mobile_only">
      <div className="">
        <div className="border-b flex justify-between pr-10 pb-2 font-bold text-sm">
          <span>Code</span>
          <span>Quantity</span>
        </div>
        {quickOrderList.map((item, index) => (
          <MobileQuickOrderCell item={item} key={index} />
        ))}
      </div>
      <div className="float-left underline text-base font-medium text-lightBlue mt-10">
        <div>Clear List</div>
        <div className="mt-6">Order list</div>
      </div>
      <div className="w-full pt-12">
        <button className="quickorder-add-to-cart-btn">ADD TO CART</button>{' '}
        <br />
        <button className="quickorder-add-to-quote-btn">ADD TO QUOTE</button>
      </div>
    </div>
  )
}

const QuickOrderContent = () => {
  return (
    <div className="md:w-2/3">
      <DesktopContent />
      <MobileContent />
    </div>
  )
}

export default QuickOrderContent
