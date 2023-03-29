import {TENANT} from "../constants/localstorage";
import { api } from 'services/axios'

const getTenant = () => localStorage.getItem(TENANT)

export const useAlgolia = () => {
const getAlgoliaSearchCredentials = async () => {
  const { data } = await api.get(
      `/caas-indexing/${getTenant()}/project/configuration`
  )
  return data
}
  return {
    getAlgoliaSearchCredentials
  }
}