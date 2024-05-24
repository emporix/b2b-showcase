import React from 'react'
import { useTranslation } from 'react-i18next'

const Label = ({ txt }) => {
  return <span className="font-semibold">{txt}</span>
}

const AddressItem = ({ address, onRemove, onEdit }) => {
  const { contactName, street, streetNumber, streetAppendix, zipCode, city, country, state, tags, id, isDefault } =
    address

  const { t } = useTranslation('address')

  return (
    <div className="border-b px-2 pt-2 pb-4 border-lightGray mb-2">
      <div className="flex flex-row justify-start">
        <span className="font-semibold">{`${t('contact')}:`}</span>
        <span className="ml-auto md:ml-2">{contactName}</span>
      </div>
      <div className="flex flex-col md:grid md:gap-2 md:grid-cols-3">
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('street')}:`}</span>
          <span className="ml-auto md:ml-2">{street}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('streetnumber')}:`}</span>
          <span className="ml-auto md:ml-2">{streetNumber}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('strappendix')}:`}</span>
          <span className="ml-auto md:ml-2">{streetAppendix}</span>
        </div>
      </div>
      <div className="flex flex-col md:grid md:gap-2 md:grid-cols-3">
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('zipcode')}:`}</span>
          <span className="ml-auto md:ml-2">{zipCode}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('city')}:`}</span>
          <span className="ml-auto md:ml-2">{city}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('country')}:`}</span>
          <span className="ml-auto md:ml-2">{country}</span>
        </div>
      </div>
      <div className="flex flex-col md:grid md:gap-2 md:grid-cols-3">
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('state')}:`}</span>
          <span className="ml-auto md:ml-2">{state}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('tags')}:`}</span>
          <span className="ml-auto md:ml-2">{tags}</span>
        </div>
        <div className="flex flex-row justify-start">
          <span className="font-semibold">{`${t('default')}:`}</span>
          <span className="ml-auto md:ml-2">{isDefault ? 'Yes' : 'No'}</span>
        </div>
      </div>
      <div className="col-start-3 col-span-1 flex justify-end">
        <button onClick={() => onEdit(address.id)} className="inline-block align-middle account-cta">
          Edit
        </button>
        <span className="mx-2">|</span>
        <button onClick={() => onRemove(address.id)} className="inline-block align-middle account-cta">
          Remove
        </button>
      </div>
    </div>
  )
}

export default AddressItem
