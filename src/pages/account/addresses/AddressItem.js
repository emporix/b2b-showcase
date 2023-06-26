const Label = ({ txt }) => {
  return <span className="font-bold">{txt}</span>
}

const AddressItem = ({ address, onRemove, onEdit }) => {
  const {
    contactName,
    street,
    streetNumber,
    streetAppendix,
    zipCode,
    city,
    country,
    state,
    tags,
    id,
    isDefault,
  } = address

  return (
    <div className="border-b px-2 pt-2 pb-4 border-lightGray mb-2 grid grid-cols-3">
      <p className="col-span-3 mb-2">
        <Label txt={'Contact Name:'} /> {contactName}
      </p>
      <p>
        <Label txt={'Street:'} /> {street}
      </p>
      <p>
        <Label txt={'St. Number:'} /> {streetNumber}
      </p>
      <p>
        <Label txt={'St. Appendix:'} /> {streetAppendix || 'N/A'}
      </p>
      <p>
        <Label txt={'Zip Code:'} /> {zipCode}
      </p>
      <p>
        <Label txt={'City:'} /> {city}
      </p>
      <p>
        <Label txt={'Country'} /> {country}
      </p>
      <p>
        <Label txt={'State:'} /> {state}
      </p>
      <p>
        <Label txt={'Tags:'} /> {tags.join(', ')}
      </p>
      <p className="mb-2">
        <Label txt={'Is Default:'} /> {isDefault ? 'Yes' : 'No'}
      </p>
      <div className="col-start-3 col-span-1 flex justify-end">
        <button
          onClick={() => onEdit(address.id)}
          className="inline-block align-middle account-edit-btn"
        >
          Edit
        </button>
        <span className="mx-2">|</span>
        <button
          onClick={() => onRemove(address.id)}
          className="inline-block align-middle account-edit-btn"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default AddressItem
