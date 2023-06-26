import React, { useState } from 'react'
import AccountLayout from './AccountLayout'
import { Link } from 'react-router-dom'
import { addLocationUrl } from '../../services/service.config'
import LocationService from 'services/location.service'
import { useEffect } from 'react'

const AddButton = () => {
  return (
    <Link to={addLocationUrl()}>
      <div className="cta-button bg-yellow w-full md:w-60 h-10 flex items-center mt-6 md:mt-12">
        <span className="text-center  w-full">ADD NEW LOCATION </span>
      </div>
    </Link>
  )
}

const LocationItem = ({
  location,
  name,
  street,
  city,
  countryCode,
  shipping,
  postcode,
  billing,
}) => {
  return (
    <div className="location_item">
      <div className="flex-auto md:w-1/5 justify-between flex md:block w-full">
        <div className="location-title desktop_only">Location</div>
        <div className="location-data font-bold">{location}</div>
        <div className="mobile_only  underline text-sm font-semibold">
          Edit Address
        </div>
      </div>

      <div className=" flex-auto w-1/5 desktop_only ">
        <div className="location-title ">Name</div>
        <div className="location-data">{name}</div>
      </div>

      <div className="flex-auto">
        <div className=" location-title desktop_only">Address</div>
        <div className="location-data">
          {street}
          <br />
          {`${postcode} ${city}`} <br />
          {countryCode}
        </div>
      </div>

      <div className="flex-auto ">
        <div className=" md:flex md:float-right">
          <div className="pt-6 md:pt-0">
            <input type="checkbox" checked={shipping} readOnly /> Shipping
          </div>
          <div className="pt-6 md:pl-6 md:pt-0">
            <input type="checkbox" checked={billing} readOnly /> Billing
          </div>
        </div>
        <div className="desktop_only  mt-[70px] underline text-sm font-semibold float-right ml-[57%] ">
          Edit Address
        </div>
      </div>
    </div>
  )
}

const Locations = () => {
  const [locationList, setLocationList] = useState([])
  useEffect(() => {
    setLocationList(LocationService.getLocationList())
  }, [])
  return (
    <>
      <AddButton />
      <div className="mt-6 md:mt-12">
        {locationList.map((item, index) => (
          <LocationItem
            key={index}
            location={item.location}
            name={item.address.address2}
            street={item.address.address1}
            city={item.address.city}
            countryCode={item.address.countryCode}
            shipping={item.shipping}
            billing={item.billing}
          />
        ))}
      </div>
    </>
  )
}

const AccountLocations = () => {
  return (
    <AccountLayout page="Locations">
      <Locations />
    </AccountLayout>
  )
}

export default AccountLocations
