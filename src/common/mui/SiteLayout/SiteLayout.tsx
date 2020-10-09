import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext, IUserData, IJob } from '~/common/context/MainContext'
import { useRemoteDataByFetch } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { reducer } from './reducer'
import { useToasts } from 'react-toast-notifications'
import { useStyles } from './styles'
import socketIOClient from 'socket.io-client'
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
  const [joblist, dispatch] = useReducer(reducer, [])
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
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const handleSetUserData = useCallback(
    (originalUserData: any, jwt?: string) => {
      const modifiedUserData = getNormalizedAns(originalUserData)

      setUserData(modifiedUserData)
      if (!!jwt) {
        setCookie('jwt', jwt, { maxAge: 60 * 60 * 24 * 5 })
      }
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
  useEffect(() => {
    const socket = socketIOClient(REACT_APP_SOCKET_ENDPOINT)

    socket.on('YOURE_WELCOME', () => {
      setSocketLink(socket)
    })

    return () => {
      socket.disconnect()
      setSocketLink(null)
    }
  }, [])

  return (
    <MainContext.Provider
      value={{
        projectData,
        setProjectData,
        resetProjectData: handleResetCurrentProjectData,
        userData,
        onLogout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        setUserData: handleSetUserData,
        joblist,
        changeJobField: handleChangeJobField,
        updateJoblist: handleUpdateJoblist,
        toast: addToast,
        socket: socketLink,
      }}
    >
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
    </MainContext.Provider>
  )
}
