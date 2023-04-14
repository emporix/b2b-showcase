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

export default AddressForm
