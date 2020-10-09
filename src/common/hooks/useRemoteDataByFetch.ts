import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { httpErrorHandler } from '~/utils/errors/http/fetch'
import { universalFetchCatch } from '~/utils/errors/http/universalFetchCatch'
import { TResponse } from '~/utils/errors/api'

interface IUseRemoteDataByFetchProps {
  url: string
  method: string
  accessToken?: string
  onCall?: () => void
  onAbortIfRequestStarted?: (val: boolean) => void
  onSuccess?: (res: any) => void
  onFail?: (err: any) => void
  debounce?: number
  responseValidator: (res: any) => boolean
  on401?: (msg: string) => void
}
export type TAns = [any, boolean, boolean, (val: boolean) => void]

export const useRemoteDataByFetch = ({
  url,
  method,
  accessToken,
  onCall,
  onAbortIfRequestStarted,
  onSuccess,
  onFail,
  debounce = 300,
  responseValidator,
  on401,
}: IUseRemoteDataByFetchProps): TAns => {
  const [dataFromServer, setDataFromServer] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isStartedImperativeRef = useRef<boolean>(false)
  const shouldBeForceArortedImperativeRef = useRef(false)
  const forceAbortToggler = (val: boolean) => {
    shouldBeForceArortedImperativeRef.current = val
  }

  useEffect(
    () => {
      isStartedImperativeRef.current = false
      const abortController = new AbortController()
      setIsLoading(false)

      const fetchData = async () => {
        if (!!window) {
          setIsLoading(true)
          setIsLoaded(false)
          isStartedImperativeRef.current = true
          if (!!onCall) onCall()

          let headers = {
            'Content-Type': 'application/json',
          }
          if (!!accessToken) {
            headers = {
              ...headers,
              // @ts-ignore
              Authorization: `Bearer ${accessToken}`,
            }
          }

          const res: TResponse = await window
            .fetch(url, {
              method,
              headers,
              mode: 'cors',
              signal: abortController.signal,
            })
            .then(async (res) => {
              if (abortController.signal.aborted) {
                setIsLoading(false)
                throw Error('Already aborted')
              }
              if (shouldBeForceArortedImperativeRef.current) {
                setIsLoading(false)
                throw Error('Force abort')
              }
              return res
            })
            .then((res) => {
              if (res.status === 401) {
                if (!!on401) on401(res.statusText)
              }
              return res
            })
            .then(httpErrorHandler) // res -> res.json()
            .then((data: any) => ({
              isOk: true,
              response: data,
            }))
            .catch(universalFetchCatch)

          if (res.isOk) {
            // @ts-ignore
            if (!responseValidator(res.response)) {
              setIsLoaded(false)
              setIsLoading(false)
              throw new Error('Data is not correct')
            } else {
              // @ts-ignore
              setDataFromServer(res.response)
              setIsLoaded(true)
              setIsLoading(false)
              // @ts-ignore
              if (!!onSuccess) onSuccess(res.response)
              isStartedImperativeRef.current = false
              abortController.abort()
            }
          } else {
            // @ts-ignore
            if (!!onFail) onFail(res.msg)
            setIsLoaded(false)
            setIsLoading(false)
            isStartedImperativeRef.current = false
          }
        }
      }

      const debouncedHandler = setTimeout(fetchData, debounce)

      return function cancel() {
        clearTimeout(debouncedHandler)
        abortController.abort()
        if (!!isStartedImperativeRef.current && !!onAbortIfRequestStarted) {
          onAbortIfRequestStarted(isStartedImperativeRef.current)
        }
      }
    },
    [
      // url,
      // debounce,
      // onCall,
      // onAbortIfRequestStarted,
      // accessToken,
      // method,
      // on401,
      // responseValidator,
      // onSuccess,
      // onFail,
    ]
  )

  return [dataFromServer, isLoaded, isLoading, forceAbortToggler]
}
