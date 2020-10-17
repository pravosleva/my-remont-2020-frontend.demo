import React, {
  useState,
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from 'react'
import { Grid } from '@material-ui/core'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext, IUserData, IJob } from '~/common/context/MainContext'
import { useRemoteDataByFetch } from '~/common/hooks/useRemoteDataByFetch'
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
import { httpErrorHandler } from '~/utils/errors/http/fetch'

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
  const [remontState, dispatch] = useReducer(
    remontReducer,
    remontInitialState
  )
  const handleChangeJobField = useCallback(
    (id, fieldName: string, value: number | boolean | string) => () => {
      try {
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
  const [projectData, setProjectData] = useState<any>(null)
  const handleResetCurrentProjectData = useCallback(() => {
    setProjectData(null)
  }, [setProjectData])
  const handleSetProjectData = useCallback(
    (data) => {
      // console.log('handleSetProjectData')
      setProjectData(data)
    },
    [setProjectData]
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
    (msg: string) => {
      setUserData(null)
      removeCookie('jwt')
      addToast(`Logout: ${msg}`, { appearance: 'info' })
      return Promise.resolve(true)
    },
    [setUserData, removeCookie]
  )
  const [, isUserDataLoaded, isUserDataLoading]: any = useRemoteDataByFetch({
    url: `${apiUrl}/users/me`,
    method: 'GET',
    accessToken: cookies.jwt,
    onSuccess: (originalUserData) => {
      handleSetUserData(originalUserData)
    },
    on401: (msg: string) => {
      handleLogout(msg || 'Что-то пошло не так')
    },
    responseValidator: (res) => !!res.id,
  })
  const classes = useStyles()
  const onRemontUpdate = useCallback(
    ({
      result,
      // params,
      data,
    }) => {
      if (!!projectData && result.id === projectData.id) {
        if (!!data?.joblist && !isEqual(remontState.jobs, data.joblist)) {
          handleUpdateJoblist(data.joblist)
          addToast('Список работ обновлен', { appearance: 'info' })
        }
      }
    },
    [remontState.jobs, projectData, handleUpdateJoblist]
  )
  // --- SOCKET SUBSCRIBER; GET REMONT IF NECESSARY;
  const getRemont = useCallback(
    (id: string, jwt?: string) => {
      // setIsCreateNewJobLoading(true)
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
          if (!!data.id) {
            // setIsCreateNewJobLoading(false)
            setProjectData(data)
            // toast(`Updated: ${data.joblist.length} jobs`, { appearance: 'success' })
            addToast('Remont data received', { appearance: 'success' })
            return
          }
          throw new Error('data.id not found')
        })
        .catch((err) => {
          addToast(err.message, { appearance: 'error' })
          // setIsCreateNewJobLoading(false)
        })
    },
    [setProjectData, addToast]
  )
  const socketRef = useRef(socket)
  const onSocketTest = useCallback(() => {
    console.log('onSocketTest: CALLED')
    if (!!projectData?.id) {
      getRemont(projectData?.id, cookies?.jwt)
    }
  }, [getRemont, projectData])
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
  const handleUpdateRemont = useCallback((remont: any) => {
    dispatch({ type: 'UPDATE_REMONT', payload: remont })
  }, [dispatchFilter])

  return (
    <MainContext.Provider
      value={{
        // Project:
        projectData,
        setProjectData: handleSetProjectData,
        resetProjectData: handleResetCurrentProjectData,
        // User:
        userData,
        logout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        setUserData: handleSetUserData,
        // Joblist:
        // joblist: remontState.jobs,
        jobsLogic: remontState.jobsLogic,
        changeJobFieldPromise: handleChangeJobField,
        updateJoblist: handleUpdateJoblist,
        remontLogic: remontState.remontLogic,
        updateRemont: handleUpdateRemont,
        // Toaster:
        toast: addToast,
        // Socket:
        socket: socketRef.current,
        // Filter:
        filterState,
        onSelectAll: handleSelectAll,
        onSelectIsDone: handleSelectIsDone,
        onSelectInProgress: handleSelectInProgress,
      }}
    >
      <PromptProvider>
        <ConfirmProvider>
          <div className={classes.bg}>
            <Grid container spacing={0}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '1000px',
                  margin: '0 auto',
                  padding: '0 10px 0 10px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <BreadCrumbs />
              </div>
              <Grid item xs={12}>
                <div
                  style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '10px',
                    maxHeight: 'calc(100vh - 70px)',
                    overflowY: 'auto',
                    borderTop: '1px solid lightgray',
                  }}
                >
                  {children}
                </div>
              </Grid>
            </Grid>
          </div>
        </ConfirmProvider>
      </PromptProvider>
    </MainContext.Provider>
  )
}
