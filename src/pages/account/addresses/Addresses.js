import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from '../AccountLayout'
import { useUserAddressess } from 'context/user-addresss-context'
import AddressItem from './AddressItem'
import { useNavigate } from 'react-router-dom'
import { deleteAddress } from 'services/user/adresses'
import {
  MediumPrimaryButton,
  PrimaryBlueButton,
} from 'components/Utilities/button'
import ConfirmationDialog from './ConfirmationDialog'
import { CircularProgress } from '@mui/material'

const Addresses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [addressId, setAddressId] = useState(null)
  const { addresses, syncAddresses } = useUserAddressess()
  const navigate = useNavigate()
  useEffect(() => {
    console.log('addresses', addresses)
  }, [addresses])

  const handleEdit = (addressId) => {
    navigate(`${addressId}`)
  }

  const handleDelete = useCallback(async () => {
    try {
      setIsRemoving(true)
      await deleteAddress(addressId)
      syncAddresses()
    } finally {
      setIsRemoving(false)
      setIsDialogOpen(false)
    }
  }, [addressId])

  const handleInitRemove = async (addressId) => {
    setIsDialogOpen(true)
    setAddressId(addressId)
  }
  return (
    <AccountLayout page="Addresses">
      {addresses.map((a) => {
        return (
          <AddressItem
            key={a.id}
            address={a}
            onEdit={handleEdit}
            onRemove={handleInitRemove}
          />
        )
      })}
      <div className="flex flex-row-reverse mt-8">
        <MediumPrimaryButton
          title="CREATE NEW"
          onClick={() => {
            navigate('new')
          }}
        />
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        onDecline={() => {
          setIsDialogOpen(false)
        }}
        onAccept={() => {
          handleDelete()
        }}
        disabled={isRemoving}
      >
        {!isRemoving ? (
          <div>Are you sure you want to delete this address?</div>
        ) : (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        )}
      </ConfirmationDialog>
    </AccountLayout>
  )
}

export default Addresses
