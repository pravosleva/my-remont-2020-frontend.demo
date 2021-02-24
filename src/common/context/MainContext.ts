import { createContext, useContext } from 'react'
import { JobsLogic } from '~/utils/logic'
import { RemontLogic } from '~/utils/logic'

export interface IJob {
  name: string
  _id: string
  id?: string
  comment?: string
  description?: string
  payed: number
  priceJobs: number
  priceMaterials: number
  priceDelivery: number
  isDone: boolean
  isStarted: boolean
  // TODO:
  owners: any[]
  executors: any[]
  plannedStartDate?: string
  plannedFinishDate?: string
  realFinishDate?: string
  imagesUrls: string[]
}

declare var io: {
  connect(url: string): Socket
}
interface Socket {
  on(event: string, callback: (data: any) => void): any
  emit(event: string, data: any): any
  off(event: string, callback: (data: any) => void): any
}

interface IMainContext {
  setProjectData: (remont: any) => void
  resetProjectData: () => void
  // logout: (msg?: string) => Promise<boolean>
  // userData: IUserData | null
  // isUserDataLoading: boolean
  // isUserDataLoaded: boolean
  // setUserData: (uData: IUserData | null, jwt?: string) => void
  changeJobFieldPromise: (
    id: string,
    fieldName: string,
    value: number | boolean | string | any[]
  ) => () => Promise<any>
  // updateJoblist: (joblist: IJob[]) => void
  jobsLogic: JobsLogic | null
  remontLogic: RemontLogic | null
  updateRemont: (remont: any) => void
  // toast: (
  //   msg: string,
  //   opts: { appearance: 'success' | 'error' | 'info' | 'warning' }
  // ) => void
  socket: null | Socket
  filterState: { selectedGroup: 'all' | 'isDone' | 'inProgress' }
  onSelectAll: () => void
  onSelectIsDone: () => void
  onSelectInProgress: () => void
  axiosRemoteGraphQL: any | null
  removeJobPromise: (id: string) => Promise<any>
}

export const MainContext = createContext<IMainContext>({
  setProjectData: () => {
    throw new Error('setProjectData method should be implemented')
  },
  resetProjectData: () => {
    throw new Error('resetProjectData method should be implemented')
  },
  // userData: null,
  // logout: () => {
  //   throw new Error('logout method should be implemented')
  // },
  // isUserDataLoading: false,
  // isUserDataLoaded: false,
  // setUserData: () => {
  //   throw new Error('setUserData method should be implemented')
  // },
  changeJobFieldPromise: () => () => {
    return Promise.reject('changeJobFieldPromise method should be implemented')
  },
  // updateJoblist: () => {
  //   throw new Error('updateJoblist method should be implemented')
  // },
  jobsLogic: null,
  remontLogic: null,
  // toast: () => {
  //   throw new Error('addToast method should be implemented')
  // },
  updateRemont: () => {
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
  axiosRemoteGraphQL: null,
  removeJobPromise: (id: string) => {
    throw new Error('removeJobPromise method should be implemented')
  },
})

export const useMainContext = () => useContext(MainContext)
