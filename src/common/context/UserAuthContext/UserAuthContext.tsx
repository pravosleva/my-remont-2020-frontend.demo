import React, { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react'
import { httpClient } from '~/utils/httpClient'
import { useCookies } from 'react-cookie'
import { getNormalizedUserDataResponse } from '~/utils/strapi/getNormalizedUserDataResponse'
import { useRouter, useCustomToastContext } from '~/common/hooks'

const { REACT_APP_ADMIN_USER_IDS } = process.env

const adminIds = !!REACT_APP_ADMIN_USER_IDS ? REACT_APP_ADMIN_USER_IDS.split(',') : []
const adminMap = new Map()

if (adminIds.length > 0) {
  adminIds.forEach((id) => {
    adminMap.set(id, true)
  })
}

type TRole = {
  _id: string
  name: String
  description: string
  type: string
  createdAt: Date
  updatedAt: Date
  __v: number
  id: string
}
export type TUserData = {
  confirmed: boolean
  blocked: boolean
  _id: string
  username: string
  email: string
  provider: string
  createdAt: Date
  updatedAt: Date
  __v: number
  role: TRole
  id: string
}
type TUserAuthContext = {
  userData: TUserData | null
  setUserData: (uData: TUserData | null, jwt?: string) => void
  logout: (msg?: string) => Promise<boolean>
  isUserDataLoading: boolean
  isUserDataLoaded: boolean
  isUserLogged: boolean
  isUserAdmin: boolean
}

export const UserAuthConxtext = createContext<TUserAuthContext>({
  userData: null,
  setUserData: () => {
    throw new Error('setUserData method should be implemented')
  },
  logout: () => {
    throw new Error('logout method should be implemented')
  },
  isUserDataLoading: false,
  isUserDataLoaded: false,
  isUserLogged: false,
  isUserAdmin: false
})

export const UserAuthContextProvider: React.FC<any> = ({ children }: any) => {
  const [userData, setUserData] = useState<TUserData | null>(null)
  const isUserLogged = useMemo(() => !!userData?._id, [userData])
  const isUserAdmin = useMemo(() => adminMap.has(userData?._id), [userData])
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const handleSetUserData = useCallback(
    (originalUserData: any) => {
      const modifiedUserData = getNormalizedUserDataResponse(originalUserData)

      setUserData(modifiedUserData)
    },
    [setCookie, setUserData]
  )
  // const { addToast } = useToasts()
  const { toast } = useCustomToastContext()
  const handleLogout = useCallback(
    (msg?: string) => {
      setUserData(null)
      removeCookie('jwt')
      if (!!msg) toast(`Logout: ${msg}`, { appearance: 'info' })
      return Promise.resolve(true)
    },
    [setUserData, removeCookie]
  )
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false)
  const [isUserDataLoaded, setIsUserDataLoaded] = useState<boolean>(false)
  const { pathname } = useRouter()
  const jwt = useMemo(() => cookies.jwt, [cookies.jwt])
  useEffect(() => {
    // console.log(pathname)
    if (pathname !== '/auth/login') {
      setIsUserDataLoading(true)
      setIsUserDataLoaded(false)
      httpClient.getMe(jwt, { on401: handleLogout })
        .then((originalUserData: any) => {
          handleSetUserData(originalUserData)
        })
        .catch(console.log)
        .finally(() => {
          setIsUserDataLoading(false)
          setIsUserDataLoaded(true)
        })
    }
  }, [pathname])

  return (
    <UserAuthConxtext.Provider
      value={{
        userData,
        setUserData,
        logout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        isUserLogged,
        isUserAdmin,
      }}
    >
      {children}
    </UserAuthConxtext.Provider>
  )
}

export const useUserAuthContext = () => useContext(UserAuthConxtext)
