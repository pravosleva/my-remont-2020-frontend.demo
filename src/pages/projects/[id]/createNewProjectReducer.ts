export interface IState {
  isOpened: boolean

  comment: string
  name: string
}
type TAction =
  | {
      type: 'UPDATE_COMMENT'
      payload: string
    }
  | {
      type: 'OPEN'
    }
  | {
      type: 'CLOSE'
    }
  | {
      type: 'UPDATE_NAME'
      payload: string
    }
  | {
    type: 'TOTAL_RESET'
  }

export const initialState = { name: '', comment: '', isOpened: false }
export function reducer(state: IState, action: TAction): IState {
  switch (action.type) {
    case 'UPDATE_COMMENT':
      return { ...state, comment: action.payload }
    case 'UPDATE_NAME':
      return { ...state, name: action.payload }
    case 'OPEN':
      return { ...state, isOpened: true }
    case 'CLOSE':
      return { ...state, isOpened: false }
    case 'TOTAL_RESET':
      return initialState
    default:
      return state
  }
}
