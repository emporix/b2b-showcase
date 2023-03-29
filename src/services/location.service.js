import { LOCATION_LIST } from 'constants/localstorage'

const LocationService = () => {
  const getLocationList = () => {
    const res = localStorage.getItem(LOCATION_LIST)
    const locationList = res
      ? JSON.parse(res)
      : [
          {
            location: 'Head Office',
            address: {
              address1: 'Barer Str.27',
              address2: 'Company Name',
              city: 'Munchen',
              postcode: '80333',
              countryCode: 'Germany',
            },
            dhipping: true,
            billing: true,
          },
          {
            location: 'Stuttgart Office',
            address: {
              address1: 'Schobpl.',
              address2: 'Company Name',
              postcode: '70173',
              city: 'Stuttgart',
              countryCode: 'Germany',
            },
            shipping: true,
            billing: true,
          },
        ]
    return locationList
  }
  const addLocation = (location) => {
    let locationList = getLocationList()
    locationList.push(location)
    localStorage.setItem(LOCATION_LIST, locationList)
  }
  return {
    getLocationList,
    addLocation,
  }
}

export default LocationService()
