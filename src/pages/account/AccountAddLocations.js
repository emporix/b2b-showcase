import React from 'react'
import { MediumPrimaryButton } from '../../components/Utilities/button'
import { GridLayout, Container } from '../../components/Utilities/common'
import AccountLayout from './AccountLayout'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import { TextInput } from '../../components/Utilities/input'
import { Link } from 'react-router-dom'
import { myAccountLocationUrl } from '../../services/service.config'

const AddLocations = () => {
  const locationTypeOptions = [
    { value: 'Headquarters', label: 'Headquarters' },
    { value: 'Office', label: 'Office' },
    { value: 'Warehouse', label: 'Warehouse' },
  ]
  return (
    <GridLayout className="mt-12 justify-center gap-12">
      <GridLayout className="md:w-[65%] w-full gap-2 m-auto">
        <DropdownWithLabel
          label="Location Type"
          placeholder="Please select"
          options={locationTypeOptions}
        />
        <TextInput label="Country" placeholder="placeholder" value="" />
        <TextInput label="Address Line1" placeholder="placeholder" value="" />
        <TextInput label="Address Line2" placeholder="placeholder" value="" />

        <div className="lg:flex grid gap-2">
          <TextInput label="Town/City" placeholder="placeholder" value="" />
          <TextInput label="State/Country" placeholder="placeholder" value="" />
          <TextInput label="Postcode" placeholder="placeholder" value="" />
        </div>
      </GridLayout>
      <Container className="text-center w-full">
        <Link to={myAccountLocationUrl()} className="w-60 m-auto">
          <MediumPrimaryButton title="SAVE NEW LOCATION" />
        </Link>
      </Container>
    </GridLayout>
  )
}

const AccountAddLocations = () => {
  return (
    <AccountLayout page="Add New Location">
      {' '}
      <AddLocations />
    </AccountLayout>
  )
}

export default AccountAddLocations
