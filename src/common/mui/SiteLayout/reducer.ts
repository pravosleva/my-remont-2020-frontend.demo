import { IJob } from '~/common/context/MainContext'

export type TState = IJob[]
type TAction =
  | {
      type: 'UPDATE_JOB_FIELD'
      id: string
      fieldName: string
      payload: number | boolean
    }
  | { type: 'UPDATE_JOBLIST'; payload: IJob[] }

export function reducer(state: TState, action: TAction): TState {
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
