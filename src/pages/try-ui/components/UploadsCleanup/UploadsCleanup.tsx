import React, { useState, useEffect, useMemo } from 'react'
import { httpClient } from '~/utils/httpClient'
import ReactJson from 'react-json-view'

export const UploadsCleanup = () => {
  // const { data, loaded, loading, error, reload } = useDataLoader<any>(httpClient.getUploadsReport)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [_loaded, setLoaded] = useState<boolean>(false)

  const [err, setErr] = useState<any>(null)

  useEffect(() => {
    setLoading(true)

    httpClient
      .getUploadsReport()
      .then((data) => {
        setLoaded(true)
        setData(data)
      })
      .catch((err) => {
        setLoaded(false)
        setErr(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const MemoizedContent = useMemo(
    () => (
      <>
        {!!data &&
          Object.keys(data).map((key) => {
            const { title, description, ...rest } = data[key]

            return (
              <div key={key}>
                <h3>{title}</h3>
                <blockquote>{description}</blockquote>
                <ReactJson src={{ ...rest }} collapsed />
              </div>
            )
          })}
      </>
    ),
    [data]
  )

  if (loading) return <div>Lodaing...</div>
  if (!!err)
    return (
      <div>ERR: {typeof err === 'string' ? err : err.message || `Cant get error.message, error is ${typeof err}`}</div>
    )

  return MemoizedContent
}
