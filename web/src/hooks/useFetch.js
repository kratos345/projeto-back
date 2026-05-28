import { useCallback, useEffect, useState } from 'react'

export function useFetch(fn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    return fn()
      .then((r) => setData(r.data))
      .catch((e) => {
        setError(e?.response?.data?.message || e?.message || 'Erro ao carregar.')
        throw e
      })
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
