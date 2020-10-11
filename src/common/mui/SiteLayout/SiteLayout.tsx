import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext, IUserData, IJob } from '~/common/context/MainContext'
import { useRemoteDataByFetch } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { joblistReducer, filterReducer } from './reducers'
import { useToasts } from 'react-toast-notifications'
import { useStyles } from './styles'
import socketIOClient from 'socket.io-client'
import { eventlist as ev } from '~/common/socket'
import { isEqual } from 'lodash'
import { ConfirmProvider } from 'material-ui-confirm'
import { PromptProvider } from '~/common/hooks/usePrompt'

const REACT_APP_SOCKET_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT

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

export const SiteLayout: React.FC = ({ children }) => {
  // --- JOBLIST STATE:
  const [joblist, dispatch] = useReducer(joblistReducer, [])
  const handleChangeJobField = useCallback(
    (id, fieldName: string, value: number | boolean | string) => () => {
      dispatch({ type: 'UPDATE_JOB_FIELD', id, fieldName, payload: value })
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
  const [, isUserDataLoaded, isUserDataLoading]: any = useRemoteDataByFetch({
    url: `${apiUrl}/users/me`,
    method: 'GET',
    accessToken: cookies.jwt,
    onSuccess: (originalUserData) => {
      handleSetUserData(originalUserData)
    },
    on401: (msg: string) => {
      addToast(msg || 'Что-то пошло не так', { appearance: 'error' })
      handleLogout()
    },
    responseValidator: (res) => !!res.id,
  })
  const handleLogout = useCallback(() => {
    setUserData(null)
    removeCookie('jwt')
    addToast('Logout', { appearance: 'info' })
    return Promise.resolve(true)
  }, [setUserData, removeCookie])
  const classes = useStyles()
  const [socketLink, setSocketLink] = useState(null)

  const onRemontUpdate = useCallback(
    ({
      result,
      // params,
      data,
    }) => {
      if (!!projectData && result.id === projectData.id) {
        if (!!data?.joblist && !isEqual(joblist, data.joblist)) {
          handleUpdateJoblist(data.joblist)
          addToast('Список работ обновлен', { appearance: 'info' })
        }
      }
    },
    [joblist, projectData, handleUpdateJoblist]
  )
  useEffect(() => {
    const socket = socketIOClient(REACT_APP_SOCKET_ENDPOINT)

    setSocketLink(socket)

    return () => {
      socket.disconnect()
      setSocketLink(null)
    }
  }, [])
  useEffect(() => {
    const onHello = () => {
      console.log('yw')
    }
    if (!!socketLink) socketLink.on(ev.YOURE_WELCOME, onHello)

    return () => {
      if (!!socketLink) socketLink.off(ev.YOURE_WELCOME, onHello)
    }
  }, [socketLink])
  useEffect(() => {
    if (!!socketLink) socketLink.on(ev.REMONT_UPDATED, onRemontUpdate)

    return () => {
      if (!!socketLink) socketLink.off(ev.REMONT_UPDATED, onRemontUpdate)
    }
  }, [socketLink, onRemontUpdate])
  // --- FILTER STATE:
  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    selectedGroup: 'all',
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
  // const displayedJoblist

  return (
    <MainContext.Provider
      value={{
        // Project:
        projectData,
        setProjectData: handleSetProjectData,
        resetProjectData: handleResetCurrentProjectData,
        // User:
        userData,
        onLogout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        setUserData: handleSetUserData,
        // Joblist:
        joblist,
        changeJobField: handleChangeJobField,
        updateJoblist: handleUpdateJoblist,
        // Toaster:
        toast: addToast,
        // Socket:
        socket: socketLink,
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
