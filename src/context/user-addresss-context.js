import { createContext, useContext, useEffect, useState } from 'react'
import { fetchAddresses } from '../services/user/adresses'

const UserAddressContext = createContext({})

export const useUserAddressess = () => useContext(UserAddressContext)

const UserAddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([])

  const syncAddresses = async () => {
    try {
      const addresses = await fetchAddresses()
      setAddresses(addresses)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    syncAddresses()
  }, [])
  return (
    <UserAddressContext.Provider value={{ addresses, setAddresses }}>
      {children}
    </UserAddressContext.Provider>
  )
}

export default UserAddressProvider
