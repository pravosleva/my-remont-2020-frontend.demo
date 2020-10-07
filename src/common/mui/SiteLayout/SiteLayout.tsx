import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext, IUserData, IJob } from '~/common/context/MainContext'
import { useRemoteDataByFetch } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { reducer } from './reducer'

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
let count = 0
export const SiteLayout: React.FC = ({ children }) => {
  // --- JOBLIST STATE:
  const [joblist, dispatch] = useReducer(reducer, [])
  const handleChangeJobField = useCallback(
    (id, fieldName: string, value: number | boolean) => () => {
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
  const [projectName, setProjectName] = useState<string | null>(null)
  const handleResetCurrentProject = useCallback(() => {
    setProjectName(null)
  }, [setProjectName])
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  // const cookies = {}
  // const setCookie = (a: any, b: any, c: any) => { }
  // const removeCookie = () => { }
  const handleSetUserData = useCallback((originalUserData: any, jwt?: string) => {
    const modifiedUserData = getNormalizedAns(originalUserData)

    setUserData(modifiedUserData)
    if (!!jwt) {
      setCookie('jwt', jwt, { maxAge: 60 * 60 * 24 * 5 })
    }
  }, [setCookie, setUserData])
  const [, isUserDataLoaded, isUserDataLoading]: any = useRemoteDataByFetch({
    url: `${apiUrl}/users/me`,
    method: 'GET',
    accessToken: cookies.jwt,
    onSuccess: (originalUserData) => {
      // window.alert(JSON.stringify(originalUserData))
      handleSetUserData(originalUserData)
    },
    on401: (msg: string) => {
      // TODO: Уведомления!
      // window.alert(msg)
      // handleLogout()
    },
    responseValidator: (res) => !!res.id,
  })
  const handleLogout = useCallback(() => {
    setUserData(null)
    removeCookie('jwt')
    return Promise.resolve(true)
  }, [setUserData, removeCookie])
  // useEffect(() => {
  //   alert(1)
  // }, [userData])

  return (
    <MainContext.Provider
      value={{
        projectName,
        setProjectName,
        resetProjectName: handleResetCurrentProject,
        // USER AUTH DATA:
        userData,
        onLogout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        setUserData: handleSetUserData,
        joblist,
        changeJobField: handleChangeJobField,
        updateJoblist: handleUpdateJoblist,
      }}
    >
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
    </MainContext.Provider>
  )
}
