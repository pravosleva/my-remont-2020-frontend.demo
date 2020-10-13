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

declare var io: {
  connect(url: string): Socket
}
interface Socket {
  on(event: string, callback: (data: any) => void)
  emit(event: string, data: any)
  off(event: string, callback: (data: any) => void)
}

interface IMainContext {
  projectData: any
  setProjectData: (remont: any) => void
  resetProjectData: () => void
  onLogout: (msg: string) => Promise<boolean>
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
  toast: (
    msg: string,
    opts: { appearance: 'success' | 'error' | 'info' }
  ) => void
  socket: null | Socket
  filterState: { selectedGroup: 'all' | 'isDone' | 'inProgress' }
  onSelectAll: () => void
  onSelectIsDone: () => void
  onSelectInProgress: () => void
}

export const MainContext = createContext<IMainContext>({
  projectData: null,
  setProjectData: () => {
    throw new Error('setProjectData method should be implemented')
  },
  resetProjectData: () => {
    throw new Error('resetProjectData method should be implemented')
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
  socket: null,
  filterState: { selectedGroup: 'inProgress' },
  onSelectAll: () => {
    throw new Error('onSelectAll method should be implemented')
  },
  onSelectIsDone: () => {
    throw new Error('onSelectIsDone method should be implemented')
  },
  onSelectInProgress: () => {
    throw new Error('onSelectInProgress method should be implemented')
  },
})
