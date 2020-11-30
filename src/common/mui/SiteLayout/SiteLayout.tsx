import React, {
  useState,
  useCallback,
  useReducer,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import { Grid } from '@material-ui/core'
import { SiteHeader } from './components/SiteHeader'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext, IUserData, IJob } from '~/common/context/MainContext'
// import { useRemoteDataByFetch } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { filterReducer } from './reducers/filter'
import {
  remontReducer,
  initialState as remontInitialState,
} from './reducers/remont'
import { useToasts } from 'react-toast-notifications'
import { useStyles } from './styles'
import { eventlist as ev } from '~/common/socket'
import { isEqual } from 'lodash'
import { ConfirmProvider } from 'material-ui-confirm'
import { PromptProvider } from '~/common/hooks/usePrompt'
// import { httpErrorHandler } from '~/utils/errors/http/fetch'
import axios from 'axios'
import Headroom from 'react-headroom'
import { Footer } from './components/Footer'
import { FixedScrollTopButton } from './components/FixedScrollTopButton'
import { httpClient } from '~/utils/httpClient'
import axiosRetry from 'axios-retry';
// import { useRouter } from '~/common/hooks/useRouter'

axiosRetry(axios, { retries: 5 });

const apiUrl = getApiUrl()
const getNormalizedAns = (originalRes: any): IUserData => {
  const result = {}
  const keys = Object.keys(originalRes)
  const max1 = keys.length
  for (let i = 0; i < max1; i++) {
    if (keys[i] === 'role') {
      // @ts-ignore
      result[keys[i]] = getNormalizedAns(originalRes[keys[i]])
    } else if (keys[i] === 'createdAt' || keys[i] === 'updatedAt') {
      // @ts-ignore
      result[keys[i]] = new Date(originalRes[keys[i]])
    } else {
      // @ts-ignore
      result[keys[i]] = originalRes[keys[i]]
    }
  }
  // @ts-ignore
  return result
}

export const SiteLayout = ({ socket, children }: any) => {
  // --- REMONT STATE:
  const [remontState, dispatch] = useReducer(remontReducer, remontInitialState)
  const handleChangeJobField = useCallback(
    (id, fieldName: string, value: number | boolean | string | any) => () => {
      try {
        if (
          (fieldName === 'realFinishDate' ||
            fieldName === 'plannedStartDate' ||
            fieldName === 'plannedFinishDate') &&
          !value
        ) {
          return Promise.resolve()
        }
        if (fieldName === 'add@imagesUrls') {
          dispatch({ type: 'UPDATE_JOB_FIELD@ADD_IMAGES_URLS', id, payload: value })
          return Promise.resolve()
        }
        dispatch({ type: 'UPDATE_JOB_FIELD', id, fieldName, payload: value })
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err?.message || 'handleChangeJobField: Errored')
      }
    },
    [dispatch]
  )
  const handleUpdateJoblist = useCallback(
    (payload: IJob[]) => {
      dispatch({ type: 'UPDATE_JOBLIST', payload })
    },
    [dispatch]
  )
  // ---
  const handleResetProjectData = useCallback(() => {
    dispatch({ type: 'UPDATE_REMONT', payload: null })
  }, [dispatch])
  const handleSetProjectData = useCallback(
    (data: any | null) => {
      dispatch({ type: 'UPDATE_REMONT', payload: data })
    },
    [dispatch]
  )
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const handleSetUserData = useCallback(
    (originalUserData: any) => {
      const modifiedUserData = getNormalizedAns(originalUserData)

      setUserData(modifiedUserData)
    },
    [setCookie, setUserData]
  )
  const { addToast } = useToasts()
  const handleLogout = useCallback(
    (msg?: string) => {
      setUserData(null)
      removeCookie('jwt')
      if (!!msg) {
        addToast(`Logout: ${msg}`, { appearance: 'info' })
      }
      return Promise.resolve(true)
    },
    [setUserData, removeCookie]
  )
  // const [, isUserDataLoaded, isUserDataLoading]: any = useRemoteDataByFetch({
  //   url: `${apiUrl}/users/me`,
  //   method: 'GET',
  //   accessToken: cookies.jwt,
  //   onSuccess: (originalUserData) => {
  //     handleSetUserData(originalUserData)
  //   },
  //   on401: (msg: string) => {
  //     handleLogout(msg || 'Что-то пошло не так')
  //   },
  //   responseValidator: (res) => !!res.id,
  // })
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false)
  const [isUserDataLoaded, setIsUserDataLoaded] = useState<boolean>(false)
  // const router = useRouter()
  useEffect(() => {
    setIsUserDataLoading(true)
    setIsUserDataLoaded(false)
    httpClient.getMe(cookies.jwt)
      .then((originalUserData: any) => {
        setIsUserDataLoading(false)
        setIsUserDataLoaded(true)
        handleSetUserData(originalUserData)
      })
      .catch((err) => {
        setIsUserDataLoading(false)
        const msg = err?.message || 'Auth error'
        // addToast(msg, { appearance: 'error' })
        handleLogout(msg)
      })
  }, [])
  const classes = useStyles()
  const onRemontUpdate = useCallback(
    ({
      result,
      // params,
      data,
    }) => {
      if (
        !!remontState.remontLogic?.id &&
        result.id === remontState.remontLogic.id
      ) {
        if (!!data?.joblist && !isEqual(remontState.jobs, data.joblist)) {
          handleUpdateJoblist(data.joblist)
          handleSetProjectData(result)
          addToast('Список работ обновлен', { appearance: 'info' })
        }
      }
    },
    [remontState.jobs, remontState.remontLogic, handleUpdateJoblist]
  )
  // --- SOCKET SUBSCRIBER; GET REMONT IF NECESSARY;
  /*
  const getRemont = useCallback(
    (id: string, jwt?: string) => {
      let headers = {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
      if (!!jwt) {
        headers = {
          ...headers,
          // @ts-ignore
          Authorization: `Bearer ${jwt}`,
        }
      }
      window
        .fetch(`${apiUrl}/remonts/${id}`, {
          method: 'GET',
          mode: 'cors',
          headers,
        })
        .then(httpErrorHandler) // (res) => res.json()
        .then((data) => {
          if (!!data?.id) {
            handleSetProjectData(data)
            addToast('Remont data received', { appearance: 'success' })
            return
          }
          throw new Error('data.id not found')
        })
        .catch((err) => {
          addToast(err.message, { appearance: 'error' })
        })
    },
    [remontState.remontLogic, addToast]
  )
  */

  const socketRef = useRef(socket)
  const onSocketTest = useCallback(() => {
    if (!!remontState.remontLogic?.id) {
      httpClient.getRemont(remontState.remontLogic.id, cookies?.jwt)
        .then((data) => {
          handleSetProjectData(data)
          addToast('Remont data received', { appearance: 'success' })
        })
        .catch((err) => {
          addToast(err.message, { appearance: 'error' })
        })
    }
  }, [remontState.remontLogic, cookies?.jwt])
  useEffect(() => {
    // socket.on(ev.YOURE_WELCOME, onSocketTest)
    socketRef.current.on(ev.YOURE_WELCOME, onSocketTest)

    return () => {
      socketRef.current.off(ev.YOURE_WELCOME, onSocketTest)
    }
  }, [onSocketTest])
  // ---
  useEffect(() => {
    socketRef.current.on(ev.REMONT_UPDATED, onRemontUpdate)

    return () => {
      socketRef.current.off(ev.REMONT_UPDATED, onRemontUpdate)
    }
  }, [onRemontUpdate])
  // --- FILTER STATE:
  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    selectedGroup: 'inProgress',
  })
  const handleSelectAll = useCallback(() => {
    dispatchFilter({ type: 'SELECT_GROUP', payload: 'all' })
  }, [dispatchFilter])
  const handleSelectIsDone = useCallback(() => {
    dispatchFilter({ type: 'SELECT_GROUP', payload: 'isDone' })
  }, [dispatchFilter])
  const handleSelectInProgress = useCallback(() => {
    dispatchFilter({ type: 'SELECT_GROUP', payload: 'inProgress' })
  }, [dispatchFilter])
  // ---

  // --- AXIOS
  const memoizedAxiosOpts = useMemo(() => {
    const axiosOpts = {
      baseURL: `${apiUrl}/graphql`,
    }
    if (!!cookies?.jwt) {
      axiosOpts['Authorization'] = `Bearer ${cookies.jwt}`
    }

    return axiosOpts
  }, [cookies.jwt, apiUrl])
  // ---

  return (
    <MainContext.Provider
      value={{
        // Project:
        setProjectData: handleSetProjectData,
        resetProjectData: handleResetProjectData,
        // User:
        userData,
        logout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        setUserData: handleSetUserData,
        // Joblist logic && Remont logic:
        jobsLogic: remontState.jobsLogic,
        changeJobFieldPromise: handleChangeJobField,
        updateJoblist: handleUpdateJoblist,
        remontLogic: remontState.remontLogic,
        updateRemont: handleSetProjectData,
        // Toaster:
        toast: addToast,
        // Socket:
        socket: socketRef.current,
        // Filter:
        filterState,
        onSelectAll: handleSelectAll,
        onSelectIsDone: handleSelectIsDone,
        onSelectInProgress: handleSelectInProgress,
        // Axios:
        axiosRemoteGraphQL: axios.create(memoizedAxiosOpts),
      }}
    >
      <PromptProvider>
        <ConfirmProvider>
          <div className={classes.bg}>
            <Headroom
              style={{
                width: '100%',
                zIndex: 6,
                margin: '0 auto',
                padding: '0 10px 0 10px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid lightgray',
                backgroundColor: '#FFF',
              }}
            >
              <SiteHeader />
            </Headroom>
            <div className={classes.breadcrumbs}>
              <BreadCrumbs />
            </div>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <div className={classes.content}>{children}</div>
              </Grid>
            </Grid>
            <Footer />
          </div>
          <FixedScrollTopButton />
        </ConfirmProvider>
      </PromptProvider>
    </MainContext.Provider>
  )
}
