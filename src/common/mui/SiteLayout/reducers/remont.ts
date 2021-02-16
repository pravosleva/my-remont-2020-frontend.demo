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
  | {
    type: 'DELETE_JOB',
    payload: string
  }

export function remontReducer(
  state: TRemontState,
  action: TRemontAction
): TRemontState {
  let targetJobIndex = -1;
  let newState
  const { payload } = action

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
          newState[targetJobIndex].imagesUrls = [...newState[targetJobIndex].imagesUrls, ...payload]
        } else {
          // @ts-ignore
          newState[targetJobIndex].imagesUrls = [...payload]
        }
      }

      return { ...state, jobs: [...newState] }
      // return { ...state, jobs: payload, jobsLogic }
    case 'UPDATE_JOBLIST':
      // @ts-ignore
      return { ...state, jobs: payload, jobsLogic: new JobsLogic(payload) }
    case 'UPDATE_REMONT':
      // @ts-ignore
      return { ...state, remontLogic: new RemontLogic(payload) }
    case 'DELETE_JOB':
      newState = [...state.jobs].filter(({ _id }) => _id !== payload)
      // console.log(newState)
      // @ts-ignore
      return { ...state, jobs: newState, jobsLogic: new JobsLogic(newState) }
    default:
      return state
  }
}
