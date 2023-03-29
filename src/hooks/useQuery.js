import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'

export const useQuery = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const query = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location])

  const updateQuery = useCallback(
    (updateParams, deleteParams = []) => {
      updateParams.forEach(([key, value]) => {
        query.set(key, value)
      })
      deleteParams.forEach((key) => {
        query.delete(key)
      })
      navigate({
        search: query.toString(),
      })
    },
    [navigate, query.toString()]
  )

  const redirectTo = useCallback(
    (pathname, params = []) => {
      const searchParams = params.map((param) => {
        return `${param[0]}=${param[1]}`
      })

      return navigate({
        pathname,
        search: searchParams ? `?${searchParams.join('&')}` : '',
      })
    },
    [navigate]
  )

  return { query, updateQuery, redirectTo }
}
