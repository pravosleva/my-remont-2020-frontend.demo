import { IJob } from './components/Job/interfaces'

export type IState = IJob[]
interface IAction {
  type: 'UPDATE_JOB_FIELD'
  id: string
  fieldName: string
  payload: number
}

export function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'UPDATE_JOB_FIELD':
      const targetJobIndex = state.findIndex(({ _id }) => action.id === _id)
      const newState = [...state]

      console.log(targetJobIndex)

      if (targetJobIndex !== -1) {
        console.log(newState[targetJobIndex])
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload

        console.log(newState)
      }

      return [...newState]
    default:
      return state
  }
}
