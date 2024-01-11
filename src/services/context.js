import { api } from './axios'

export const patchContext = async (tenant, context) => {
  const config = {
    params: {
      upsert: true,
    },
  }
  const currentContext = await fetchContext(tenant)
  const body = {
    ...context,
    metadata: currentContext.data.metadata
  }
  return api.patch(`session-context/${tenant}/me/context`, body, config)
}

export const fetchContext = (tenant) => {
  return api.get(`session-context/${tenant}/me/context`)
}
