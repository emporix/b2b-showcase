import { TENANT } from 'constants/localstorage'
import { api } from 'services/axios'

const getTenant = () => localStorage.getItem(TENANT)

export const useConfiguration = () => {
  const getConfiguration = async () => {
    const { data } = await api.get(
      `/configuration/${getTenant()}/configurations`,
    )
    return data
  }

  return {
    getConfiguration,
  }
}
