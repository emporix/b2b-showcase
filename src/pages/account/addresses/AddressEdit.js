import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AccountLayout from '../AccountLayout'
import { useUserAddressess } from 'context/user-addresss-context'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton, MediumPrimaryButton } from 'components/Utilities/button'
import { useAuth } from 'context/auth-provider'
import Select from '@mui/material/Select'

import {
  createAddress,
  deleteAddress,
  fetchCountries,
  updateAddress,
} from 'services/user/adresses'
import ConfirmationDialog from './ConfirmationDialog'
import { useSites } from 'context/sites-provider'
import Dropdown from 'components/Utilities/dropdown'

const REQUIERED_FIELDS = { country: true, contactName: true }

const AddressesEdit = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { sites } = useSites()
  const { addressId } = useParams()
  const { addresses, syncAddresses } = useUserAddressess()
  const { userTenant } = useAuth()
  const navigate = useNavigate()

  const address = useMemo(() => {
    return addresses.find((a) => a.id === addressId)
  }, [addresses, addressId])

  const countries = useMemo(() => {
    return sites.map((site) => ({ label: site.code, value: site.code }))
  }, [sites])

  // const selectedCountry = useState()

  // useEffect(() => {
  //   ;(async () => {
  //     const c = await fetchCountries()
  //     console.log(c)
  //   })()
  // }, [])

  useEffect(() => {
    if (address) {
      setFormData(address)
    }
  }, [address])

  const [formData, setFormData] = useState({
    contactName: '',
    street: '',
    streetNumber: '',
    streetAppendix: '',
    zipCode: '',
    country: '',
    state: '',
    city: '',
    tags: [],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => {
      if (type === 'checkbox') {
        if (name === 'isDefault') {
          return {
            ...prevState,
            [name]: checked,
          }
        } else if (name.startsWith('tags')) {
          const tag = name.split('.')[1]
          const { tags } = prevState
          if ((tags || []).some((t) => t === tag)) {
            tags.splice(tags.indexOf(tag), 1)
          } else {
            tags.push(tag)
          }
          return {
            ...prevState,
            tags,
          }
        }
      }
      return {
        ...prevState,
        [name]: value,
      }
    })
  }
  const handleDelete = useCallback(async () => {
    await deleteAddress(addressId)
    navigate(`/${userTenant}/my-account/addresses`)
  }, [addressId])

  const handleSubmit = useCallback(
    async (e) => {
      setIsSubmitted(true)
      e.preventDefault()
      if (addressId) {
        await updateAddress(formData)
      } else {
        await createAddress(formData)
      }
      await syncAddresses()
      navigate(`/${userTenant}/my-account/addresses`)
    },
    [formData, addressId]
  )

  const hasError = useCallback(
    (key) => {
      return isSubmitted && REQUIERED_FIELDS[key] && formData[key].length === 0
    },
    [formData, isSubmitted]
  )

  return (
    <AccountLayout page={addressId ? 'Address # ' + addressId : 'New Address'}>
      <BackButton
        link={`/${userTenant}/my-account/addresses`}
        title={'Back to addresses'}
      />

      <div className="grid-cols-2 mt-8">
        <h2 className="text-xl font-bold mb-4">Address Form</h2>
        <div className="text-black border-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="mb-1">Contact Name:</div>

              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className={`mt-2 sm:mt-0 form-input-item border-gray`}
                style={{
                  borderColor: hasError('contactName') && 'red',
                }}
              />
              {hasError('contactName') && (
                <div className="text-red-500 text-xs">Must not be blank</div>
              )}
            </div>

            <div className="col-span-1 flex flex-col">
              <label className="mb-1">Street:</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">Street Number:</label>
              <input
                type="text"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">Street Appendinx:</label>
              <input
                type="text"
                name="streetAppendix"
                value={formData.streetAppendix}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">Zip Code:</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">Country:</label>
              <Dropdown
                options={countries}
                defaultValue={{
                  label: formData.country,
                  value: formData.country,
                }}
                onChange={(e) => {
                  console.log(e)
                  setFormData((prev) => {
                    return { ...prev, country: e[0].value }
                  })
                }}
                style={{
                  borderColor: hasError('country') && 'red',
                  borderWidth: '1px',
                  width: '100px',
                }}
              />
              {hasError('country') && (
                <div className="text-red-500 text-xs">Must not be blank</div>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="mb-1">State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-2 sm:mt-0 form-input-item border-gray"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className="mb-1">Is Default:</label>
              <div className="flex">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="mt-5 sm:mt-3 border-gray"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="mb-1">Tags:</label>
              <div className="flex align-items">
                <div className="mr-2">Shipping </div>
                <input
                  type="checkbox"
                  name="tags.shipping"
                  checked={formData?.tags?.some((f) => f === 'shipping')}
                  onChange={handleChange}
                  className="border-gray mr-4"
                />
                <div className="mr-2">Billing</div>
                <input
                  type="checkbox"
                  name="tags.billing"
                  checked={formData?.tags?.some((f) => f === 'billing')}
                  onChange={handleChange}
                  className="border-gray"
                />
              </div>
            </div>
            <div className="mt-6 col-span-2 flex justify-end">
              <MediumPrimaryButton
                title="SAVE"
                className="w-60 m-auto px-4 py-2 mr-2"
                onClick={handleSubmit}
              />
              {addressId && (
                <button
                  className="border-lightBlue border-[1px] b-1 w-60 px-4 py-2 text-lightBlue text-center font-bold text-sm hover:bg-lightBlue/20"
                  onClick={() => setIsDialogOpen(true)}
                >
                  DELETE
                </button>
              )}
            </div>
            <ConfirmationDialog
              open={isDialogOpen}
              onDecline={() => {
                setIsDialogOpen(false)
              }}
              onAccept={handleDelete}
            >
              <div>Are you sure you want to delete this address?</div>
            </ConfirmationDialog>
          </div>
        </div>
      </div>
    </AccountLayout>
  )
}

export default AddressesEdit
