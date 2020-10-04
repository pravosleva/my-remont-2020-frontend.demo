import { useState, useEffect, useRef, MutableRefObject } from 'react'
// import { httpErrorHandler } from '~/utils/errors/http/fetch';

interface IProps {
  url: string
  method: string
  // accessToken,
  onCall?: () => void
  onAbortIfRequestStarted?: (val: boolean) => void
  onSuccess?: (res: any) => void
  onFail?: (err: any) => void
  debounce?: number
  responseValidator: (res: any) => boolean
}
export type TAns = [any, boolean, boolean, (val: boolean) => void]

export const useRemoteDataByFetch = ({
  url,
  method,
  // accessToken,
  onCall,
  onAbortIfRequestStarted,
  onSuccess,
  onFail,
  debounce = 0,
  responseValidator,
}: IProps): TAns => {
  const [dataFromServer, setDataFromServer] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isStartedImperativeRef = useRef<boolean>(false)
  const shouldBeForceArortedImperativeRef = useRef(false)
  const forceAbortToggler = (val: boolean) => {
    shouldBeForceArortedImperativeRef.current = val
  }

  useEffect(() => {
    isStartedImperativeRef.current = false
    const abortController = new AbortController()
    setIsLoading(false)

    const fetchData = () => {
      if (!!window) {
        setIsLoading(true)
        setIsLoaded(false)
        isStartedImperativeRef.current = true
        if (!!onCall) onCall()
        window
          .fetch(url, {
            // headers: { Authorization: `Bearer ${accessToken}` },
            method,
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
          // .then(httpErrorHandler)
          .then((res) => {
            try {
              return res.json()
            } catch (err) {
              throw new Error(err.message)
            }
          })
          .then((resData: any) => {
            if (!responseValidator(resData)) {
              setIsLoaded(false)
              setIsLoading(false)
              throw new Error('Data is not correct')
            }
            console.log(resData)
            setDataFromServer(resData)
            setIsLoaded(true)
            setIsLoading(false)
            if (!!onSuccess) onSuccess(resData)
            isStartedImperativeRef.current = false
          })
          .catch((error) => {
            if (!!onFail) onFail(error)
            isStartedImperativeRef.current = false
          })
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
  }, [
    // accessToken,
    url,
    debounce,
    onCall,
    onAbortIfRequestStarted,
  ])

  return [dataFromServer, isLoaded, isLoading, forceAbortToggler]
}
