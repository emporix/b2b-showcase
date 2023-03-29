import { api } from '../axios'

export const getLabel = async (labelId) => {
  const { data } = await api.get(`/label/labels/${labelId}`)
  return data
}
