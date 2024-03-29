import { IJob } from '~/common/context/MainContext'
import { JobsLogic, RemontLogic } from '~/utils/logic'
import { clone } from '~/utils/clone'

export const initialState = {
  jobs: [],
  jobsLogic: null,
  remontLogic: null,
  stash: null,
  _remont: null,
}
export type TRemontState = {
  jobs: IJob[]
  jobsLogic: JobsLogic | null
  remontLogic: RemontLogic | null
  stash: TRemontState | null
  _remont: any
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
  // | { type: 'UPDATE_JOBLIST'; payload: IJob[] }
  | { type: 'UPDATE_REMONT'; payload: any }
  | {
      type: 'UPDATE_JOB_FIELD@ADD_IMAGES_URLS'
      id: string
      payload: TFileId[]
    }
  | {
      type: 'DELETE_JOB'
      payload: string
    }
  | { type: 'STASH'; payload?: TRemontState | null }
  | { type: 'STASH_POP'; payload?: TRemontState | null }

export function remontReducer(state: TRemontState, action: TRemontAction): TRemontState {
  let targetJobIndex = -1
  let newState
  const payload = action.payload || null
  let newJobsLogic

  switch (action.type) {
    case 'STASH': {
      console.log('stash')
      const remontLogic = new RemontLogic(state._remont)
      // const jobsLogic = new JobsLogic(remontLogic.joblist)
      const stash: TRemontState = clone({ ...state, remontLogic, jobsLogic: new JobsLogic(remontLogic.joblist) })
      return {
        ...state,
        stash,
      }
    }
    case 'STASH_POP': {
      console.log('stash pop')
      const remontLogic = new RemontLogic({ ...state.stash._remont })
      const jobsLogic = new JobsLogic({ ...remontLogic.joblist })

      return {
        ...state.stash,
        remontLogic,
        jobsLogic,
        jobs: remontLogic.joblist,
        stash: null,
        _remont: state.stash?._remont || null,
      }
    }
    case 'UPDATE_JOB_FIELD':
      targetJobIndex = state.jobs.findIndex(({ _id }) => action.id === _id)
      newState = [...state.jobs]

      if (targetJobIndex !== -1) {
        // @ts-ignore
        newState[targetJobIndex][action.fieldName] = action.payload
      }

      newJobsLogic = new JobsLogic(newState)

      return { ...state, jobs: [...newState], jobsLogic: newJobsLogic }
    case 'UPDATE_JOB_FIELD@ADD_IMAGES_URLS':
      newState = [...state.jobs]

      targetJobIndex = state.jobs.findIndex(({ _id }) => action.id === _id)
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

      newJobsLogic = new JobsLogic(newState)

      return { ...state, jobs: [...newState], jobsLogic: newJobsLogic }
    // return { ...state, jobs: payload, jobsLogic }
    // case 'UPDATE_JOBLIST':
    //   // @ts-ignore
    //   return { ...state, jobs: payload, jobsLogic: new JobsLogic(payload) }
    case 'UPDATE_REMONT': {
      const remontLogic = new RemontLogic(payload)
      const jobsLogic = new JobsLogic(remontLogic.joblist)
      // @ts-ignore
      return { ...state, remontLogic, jobsLogic, jobs: remontLogic.joblist, _remont: Object.assign({}, payload) }
    }
    case 'DELETE_JOB':
      newState = [...state.jobs].filter(({ _id }) => _id !== payload)
      // console.log(newState)
      // @ts-ignore
      return { ...state, jobs: newState, jobsLogic: new JobsLogic(newState) }
    default:
      return state
  }
}
