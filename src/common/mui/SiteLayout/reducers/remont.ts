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
type TRemontAction =
  | {
      type: 'UPDATE_JOB_FIELD'
      id: string
      fieldName: string
      payload: number | boolean | string
    }
  | { type: 'UPDATE_JOBLIST'; payload: IJob[] }
  | { type: 'UPDATE_REMONT'; payload: any }

export function remontReducer(
  state: TRemontState,
  action: TRemontAction
): TRemontState {
  switch (action.type) {
    case 'UPDATE_JOB_FIELD':
      const targetJobIndex = state.jobs.findIndex(
        ({ _id }) => action.id === _id
      )
      const newState = [...state.jobs]

      if (targetJobIndex !== -1) {
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload
      }

      return { ...state, jobs: [...newState] }
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
