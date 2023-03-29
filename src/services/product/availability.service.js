import ApiRequest from '../index'
import { availabilityApi } from '../service.config'
import { serviceSiteName } from '../../constants/service'
import { ACCESS_TOKEN } from '../../constants/localstorage'

const AvailabilityService = () => {
  const getAllAvailability = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': 'en',
    }
    const params = {
      site: serviceSiteName,
    }

    const res = await ApiRequest(availabilityApi(), 'get', {}, headers, params)
    let availability = {}
    res.data.map((row) => {
      availability[`k${row.productId}`] = row
      return availability
    })

    return availability
  }
  return {
    getAllAvailability,
  }
}

export default AvailabilityService()
