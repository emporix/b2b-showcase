import { LargePrimaryButton } from 'components/Utilities/button'
import { useQuickOrder } from 'context/quickorder-context'
import React, { useState, useMemo, useRef } from 'react'
import './quickorder.css'

const regex = /(\d+,)*\d+/g

const QuickOrderSelection = () => {
  const { handleBatchAddItem } = useQuickOrder()
  const [productCodes, setProductCodes] = useState('')
  const fileInput = useRef(null)
  const isValid = useMemo(() => {
    return regex.test(productCodes.replaceAll(' ', ''))
  }, [productCodes])

  const handleAddBatch = () => {
    handleBatchAddItem(
      productCodes
        .replaceAll(' ', '')
        .split(/,|\n/g)
        .map((code) => ({ code, quantity: 1 }))
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      const csvOutput = event.target.result
      const products = csvOutput.split('\n').map((line) => {
        const cols = line.replaceAll(' ', '').split(',')
        return {
          code: cols[0],
          quantity: cols.length > 1 ? parseInt(cols[1]) : 1,
        }
      })
      handleBatchAddItem(products)
    }
    fileReader.readAsText(file)
    e.target.value = null
  }

  return (
    <div className="md:w-[30%] w-full md:pt-0 pt-10">
      <div className="font-medium text-xl">Add SKUs from a .csv file</div>
      <div className="pt-6 text-black">
        The file must be in a .csv file format and include 'Code' and 'QTY'
        columns separated by commas.
        <a className="underline font-bold text-base" download href="/items.csv">
          Download sample
        </a>
      </div>
      <div className="pt-6">
        <input
          label=""
          accept={'.csv'}
          ref={fileInput}
          className="quickorder-selection-btn"
          type="file"
          hidden
          onChange={handleFileChange}
        />
        <LargePrimaryButton
          className="cta-button bg-yellow"
          title="UPLOAD FILE"
          onClick={() => {
            fileInput.current.click()
          }}
        />
      </div>
      <div className="font-medium text-xl pt-12">
        Enter multiple Product Codes
      </div>
      <div className="pt-6">
        <textarea
          className="w-full h-[126px] p-4 border-quartz border rounded"
          placeholder="Text Area"
          value={productCodes}
          onChange={(e) => {
            setProductCodes(e.target.value)
          }}
        />
      </div>
      <div className="pt-6 text-sm">
        Use commas or paragraphs to separate SKUs.
      </div>
      <div className="pt-6">
        <LargePrimaryButton
          className="cta-button bg-yellow"
          title="ADD TO LIST"
          disabled={!isValid}
          onClick={handleAddBatch}
        />
      </div>
      <div className="mobile_only pt-12">
        <button className="quickorder-add-to-cart-btn cta-button bg-yellow">
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default QuickOrderSelection
