import { IJob } from '~/common/context/MainContext'
import { JobsLogic } from '~/utils/logic'

export const initialState = {
  items: [],
  logic: null,
}
export type TJoblistState = {
  items: IJob[]
  logic: JobsLogic | null
}
type TAction =
  | {
      type: 'UPDATE_JOB_FIELD'
      id: string
      fieldName: string
      payload: number | boolean | string
    }
  | { type: 'UPDATE_JOBLIST'; payload: IJob[] }

export function joblistReducer(
  state: TJoblistState,
  action: TAction
): TJoblistState {
  switch (action.type) {
    case 'UPDATE_JOB_FIELD':
      const targetJobIndex = state.items.findIndex(
        ({ _id }) => action.id === _id
      )
      const newState = [...state.items]

      if (targetJobIndex !== -1) {
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload
      }

      return { ...state, items: [...newState] }
    case 'UPDATE_JOBLIST':
      const logic = new JobsLogic(action.payload)
      // @ts-ignore
      return { ...state, items: action.payload, logic }
    default:
      return state
  }
}
