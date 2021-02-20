import React, { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react'
import { httpClient } from '~/utils/httpClient'
import { useCookies } from 'react-cookie'
import { getNormalizedUserDataResponse } from '~/utils/strapi/getNormalizedUserDataResponse'

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
})

export const UserAuthContextProvider: React.FC<any> = ({ children }: any) => {
  const [userData, setUserData] = useState<TUserData | null>(null)
  const isUserLogged = useMemo(() => !!userData?._id, [userData])
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const handleSetUserData = useCallback(
    (originalUserData: any) => {
      const modifiedUserData = getNormalizedUserDataResponse(originalUserData)

      setUserData(modifiedUserData)
    },
    [setCookie, setUserData]
  )
  // const { addToast } = useToasts()
  const handleLogout = useCallback(
    (msg?: string) => {
      setUserData(null)
      removeCookie('jwt')
      // if (!!msg) addToast(`Logout: ${msg}`, { appearance: 'info' })
      return Promise.resolve(true)
    },
    [setUserData, removeCookie]
  )
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false)
  const [isUserDataLoaded, setIsUserDataLoaded] = useState<boolean>(false)
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

  return (
    <UserAuthConxtext.Provider
      value={{
        userData,
        setUserData,
        logout: handleLogout,
        isUserDataLoading,
        isUserDataLoaded,
        isUserLogged,
      }}
    >
      {children}
    </UserAuthConxtext.Provider>
  )
}

export const useUserAuthContext = () => useContext(UserAuthConxtext)
