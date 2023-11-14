import { ACCESS_TOKEN, USER } from 'constants/localstorage'
import { iamApi } from './service.config'
import { api } from './axios'
import axios from 'axios'


export const getCustomerGroups = async () => {

  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${iamApi()}/groups?userType=customer&name=b2b`, { headers })
  return res.data
}

export const getUsersFromGroup = async (groupId) => {

  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${iamApi()}/groups/${groupId}/users`, { headers })
  return res.data
}

export const reassignGroup = async (oldGroup, newGroup, userId) => {

  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const body = {
    userId: userId,
    userType: "CUSTOMER"
  }

  const delRes = await api.delete(`${iamApi()}/groups/${oldGroup}/users/${userId}`, { headers })
  const res = await api.post(`${iamApi()}/groups/${newGroup}/users`, body, { headers })
  return res.data
}