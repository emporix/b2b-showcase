import { api } from './axios'

export const patchContext = (tenant, context) => {
  const config = {
    params: {
      upsert: true,
    },
  }
  return api.patch(`session-context/${tenant}/me/context`, context, config)
}

export const fetchContext = (tenant) => {
  return api.get(`session-context/${tenant}/me/context`)
}
