import { createContext } from 'react'

interface IRole {
  _id: string
  name: String
  description: string
  type: string
  createdAt: Date
  updatedAt: Date
  __v: number
  id: string
}
export interface IUserData {
  confirmed: boolean
  blocked: boolean
  _id: string
  username: string
  email: string
  provider: string
  createdAt: Date
  updatedAt: Date
  __v: number
  role: IRole
  id: string
}
interface IMainContext {
  projectName: string | null
  setProjectName: (name: string | null) => void
  resetProjectName: () => void
  onLogout: () => Promise<boolean>
  userData: IUserData | null
  isUserDataLoading: boolean
  isUserDataLoaded: boolean
  setUserData: (uData: IUserData | null, jwt?: string) => void
}

export const MainContext = createContext<IMainContext>({
  projectName: null,
  setProjectName: (_name: string | null) => {
    throw new Error('setProjectName method should be implemented')
  },
  resetProjectName: () => {
    throw new Error('resetProjectName method should be implemented')
  },
  userData: null,
  onLogout: () => {
    throw new Error('onLogout method should be implemented')
  },
  isUserDataLoading: false,
  isUserDataLoaded: false,
  setUserData: () => {
    throw new Error('setUserData method should be implemented')
  },
})
