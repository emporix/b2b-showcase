import axios from 'axios'

const ApiRequest = async (url, type, data, headers, params = {}) => {
  let Request
  switch (type) {
    case 'post':
      Request = axios.post
      break
    case 'get':
      Request = axios.get
      return Request(url, { headers, params })
    case 'delete':
      Request = axios.delete
      return Request(url, { headers })
    default:
      Request = axios.put
      break
  }
  return Request(url, data, { headers })
}

export default ApiRequest
