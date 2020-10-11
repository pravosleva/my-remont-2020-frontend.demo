import { IJob } from '~/common/context/MainContext'

export type TJoblistState = IJob[]
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
      const targetJobIndex = state.findIndex(({ _id }) => action.id === _id)
      const newState = [...state]

      if (targetJobIndex !== -1) {
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload
      }

      return [...newState]
    case 'UPDATE_JOBLIST':
      return action.payload
    default:
      return state
  }
}
