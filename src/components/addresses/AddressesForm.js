import { TextInput } from 'components/Utilities/input'
import React, { useState } from 'react'

const AddressForm = () => {
  const [form, setForm] = useState({ companyName: '' })
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4">
        <TextInput
          label="Company Name"
          value={form.companyName}
          action={(value) => setForm({ ...form, companyName: value || '' })}
        />
      </div>
      <div className="col-span-2">
        <TextInput
          label="Company Name"
          value={form.companyName}
          action={(value) => setForm({ ...form, companyName: value || '' })}
        />
      </div>
      <div className="col-span-2">
        <TextInput
          className="col-span-2"
          label="Company Name"
          value={form.companyName}
          action={(value) => setForm({ ...form, companyName: value || '' })}
        />
      </div>
    </div>
  )
}

export const INITIAL_ADDRESS = {
  firstName: '',
  lastName: '',
  contactPhone: '',
  contactEmail: '',
  contactName: '',
  street: '',
  streetNumber: '',
  streetAppendix: '',
  zipCode: '',
  country: '',
  state: '',
  city: '',
}

export const Input = ({ label, value, action, className, placeholder }) => {
  return (
    <div className={`!pt-2 w-full text-black text-base ${className}`}>
      <label className="pb-2">{label}</label>
      <br />
      <input
        placeholder={placeholder}
        onChange={(e) => action(e.target.value)}
        value={value}
        type="text"
        className="border w-full px-3 py-2"
      />
    </div>
  )
}

export const GuestAddressForm = ({ form, handleUpdate }) => {
  return (
    <div className="grid grid-cols-3 gap-x-4">
      <Input
        label="Street"
        className="col-span-2"
        placeholder="Street"
        value={form.street}
        action={(val) =>
          handleUpdate({
            ...form,
            street: val,
          })
        }
      />
      <Input
        label="Street Number"
        placeholder="Sreet Number"
        className="col-span-1"
        value={form.streetNumber}
        action={(val) =>
          handleUpdate({
            ...form,
            streetNumber: val,
          })
        }
      />
      <Input
        label="Postal Code"
        placeholder="Postal Code"
        className="col-span-1"
        value={form.zipCode}
        action={(val) =>
          handleUpdate({
            ...form,
            zipCode: val,
          })
        }
      />
      <Input
        label="City"
        placeholder="City"
        className="col-span-1"
        value={form.city}
        action={(val) =>
          handleUpdate({
            ...form,
            city: val,
          })
        }
      />
      <Input
        label="Country"
        placeholder="Country"
        className="col-span-1"
        value={form.country}
        action={(val) =>
          handleUpdate({
            ...form,
            country: val?.toUpperCase(),
          })
        }
      />
    </div>
  )
}

export const isAddressFilled = (address) => {
  if (address === null) {
    return false
  }
  return (
    address?.firstName?.length > 0 &&
    address?.lastName?.length > 0 &&
    address?.street?.length > 0 &&
    address?.streetNumber?.length > 0 &&
    address?.zipCode?.length > 0 &&
    address?.city?.length > 0 &&
    address?.country?.length > 0
  )
}

export default AddressForm
