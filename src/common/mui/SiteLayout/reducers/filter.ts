type TGroup = 'all' | 'isDone' | 'inProgress'
export type TFilterState = {
  selectedGroup: TGroup
}
type TAction = {
  type: 'SELECT_GROUP'
  payload: TGroup
}

export function filterReducer(
  state: TFilterState,
  action: TAction
): TFilterState {
  switch (action.type) {
    case 'SELECT_GROUP':
      return { selectedGroup: action.payload }
    default:
      return state
  }
}
