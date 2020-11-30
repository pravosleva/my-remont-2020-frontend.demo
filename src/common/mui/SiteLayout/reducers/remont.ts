import { IJob } from '~/common/context/MainContext'
import { JobsLogic, RemontLogic } from '~/utils/logic'

export const initialState = {
  jobs: [],
  jobsLogic: null,
  remontLogic: null,
}
export type TRemontState = {
  jobs: IJob[]
  jobsLogic: JobsLogic | null
  remontLogic: RemontLogic | null
}
type TFileId = {
  id: string
}
type TRemontAction =
  | {
      type: 'UPDATE_JOB_FIELD'
      id: string
      fieldName: string
      payload: number | boolean | string
    }
  | { type: 'UPDATE_JOBLIST'; payload: IJob[] }
  | { type: 'UPDATE_REMONT'; payload: any }
  | {
    type: 'UPDATE_JOB_FIELD@ADD_IMAGES_URLS',
    id: string
    payload: TFileId[]
  }

export function remontReducer(
  state: TRemontState,
  action: TRemontAction
): TRemontState {
  // console.log(action)
  let targetJobIndex = -1;
  let newState

  switch (action.type) {
    case 'UPDATE_JOB_FIELD':
      targetJobIndex = state.jobs.findIndex(
        ({ _id }) => action.id === _id
      )
      newState = [...state.jobs]

      if (targetJobIndex !== -1) {
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload
      }

      return { ...state, jobs: [...newState] }
    case 'UPDATE_JOB_FIELD@ADD_IMAGES_URLS':
      newState = [...state.jobs]

      targetJobIndex = state.jobs.findIndex(
        ({ _id }) => action.id === _id
      )
      if (targetJobIndex !== -1) {
        // @ts-ignore
        if (!!newState[targetJobIndex]?.imagesUrls) {
          // @ts-ignore
          newState[targetJobIndex].imagesUrls = [...newState[targetJobIndex].imagesUrls, ...action.payload]
        } else {
          // @ts-ignore
          newState[targetJobIndex].imagesUrls = [...action.payload]
        }
      }

      return { ...state, jobs: [...newState] }
      // return { ...state, jobs: action.payload, jobsLogic }
    case 'UPDATE_JOBLIST':
      const jobsLogic = new JobsLogic(action.payload)
      // @ts-ignore
      return { ...state, jobs: action.payload, jobsLogic }
    case 'UPDATE_REMONT':
      const remontLogic = new RemontLogic(action.payload)
      // @ts-ignore
      return { ...state, remontLogic }
    default:
      return state
  }
}
