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
export interface IJob {
  name: string
  _id: string
  comment?: string
  description?: string
  payed: number
  priceJobs: number
  priceMaterials: number
  priceDelivery: number
  isDone: boolean
  isStarted: boolean
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
  joblist: IJob[]
  changeJobField: (
    id: string,
    fieldName: string,
    value: number | boolean | string
  ) => () => void
  updateJoblist: (joblist: IJob[]) => void
  toast: (msg: string, opts: { appearance: 'success' | 'error' }) => void
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
  joblist: [],
  changeJobField: () => () => {
    throw new Error('changeJobField method should be implemented')
  },
  updateJoblist: () => {
    throw new Error('updateJoblist method should be implemented')
  },
  toast: () => {
    throw new Error('addToast method should be implemented')
  },
})
