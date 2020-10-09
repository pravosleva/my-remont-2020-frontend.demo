import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useParams } from 'react-router-dom'
import { Joblist } from './components/Joblist'
import { Grid, Button } from '@material-ui/core'
import { TotalInfo } from './components/TotalInfo'
import { MainContext } from '~/common/context/MainContext'
import { useCookies } from 'react-cookie'
import {
  initialState as createNewJobInitialState,
  reducer as createNewJobReducer,
} from './createNewProjectReducer'
import { CreateNewJob } from './components/CreateNewJob'
import BuildIcon from '@material-ui/icons/Build';

const apiUrl = getApiUrl()

interface IPageParams {
  id: string
}
interface INewJob {
  comment: string
  name: string
  priceJobs: number
  priceMaterials: number
  priceDelivery: number

  isDone: boolean
  isStarted: boolean
  payed: number
  description?: string
  __component: string
}

export const TheProject = () => {
  const { id }: IPageParams = useParams()
  const {
    setProjectName,
    resetProjectName,
    updateJoblist,
    userData,
    joblist,
    toast,
  } = useContext(MainContext)
  const [cookies] = useCookies(['jwt'])
  // TODO: Подписаться на сокет, запрашивать обновления при каждом изменении.
  // Либо поместить в контекст
  const [project, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts/${id}`,
    method: 'GET',
    accessToken: cookies.jwt,
    onSuccess: (data) => {
      setProjectName(data.name)
      if (
        !!data.joblist &&
        Array.isArray(data.joblist) &&
        data.joblist.length > 0
      ) {
        updateJoblist(data.joblist)
      }
    },
    onFail: (msg) => {
      setProjectName(null)
      // toast(`Не удалось получить список ремонтов: ${msg || 'Что-то пошло не так'}`, { appearance: 'error' })
    },
    responseValidator: (res) => !!res.id,
  })
  useEffect(() => {
    return () => {
      resetProjectName()
    }
  }, [resetProjectName])
  const [createJobState, dispatchCreateJob] = useReducer(
    createNewJobReducer,
    createNewJobInitialState
  )
  const handleCreateJob = useCallback(() => {
    dispatchCreateJob({ type: 'OPEN' })
  }, [])
  const handleCloseCreateJobForm = useCallback(() => {
    dispatchCreateJob({ type: 'CLOSE' })
  }, [dispatchCreateJob])
  const handleChangeField = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'comment':
          dispatchCreateJob({ type: 'UPDATE_COMMENT', payload: value })
          break
        case 'name':
          dispatchCreateJob({ type: 'UPDATE_NAME', payload: value })
          break
        default:
          return
      }
    },
    [dispatchCreateJob]
  )
  // ---
  // const handleSubmit = useCallback(() => {
  // }, [remontId, cookies.jwt, joblist, handleCloseEditor, updateJoblist])
  const [isCreateNewJobLoading, setIsCreateNewJobLoading] = useState<boolean>(
    false
  )
  const handleSave = useCallback(() => {
    setIsCreateNewJobLoading(true)
    const newJob: INewJob = {
      comment: createJobState.comment,
      name: createJobState.name,
      priceJobs: 0,
      priceMaterials: 0,
      priceDelivery: 0,

      isDone: false,
      // plannedStartDate: "string",
      // plannedFinishDate: "string",
      // realFinishDate: "string",
      isStarted: false,
      payed: 0,
      // description: "",
      __component: 'job.job',
    }
    window
      .fetch(`${apiUrl}/remonts/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.jwt}`,
        },
        body: JSON.stringify({ joblist: [newJob, ...joblist] }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (!!data.id) {
          setIsCreateNewJobLoading(false)
          handleCloseCreateJobForm()
          if (
            !!data.joblist &&
            Array.isArray(data.joblist) &&
            data.joblist.length > 0
          ) {
            updateJoblist(data.joblist)
            toast(`Updated: ${data.joblist.length} jobs`, {
              appearance: 'success',
            })
            return
          }
        }
        throw new Error('Fuckup')
      })
      .catch((err) => {
        // window.alert(err.message)
        toast(err.message, { appearance: 'error' })
        setIsCreateNewJobLoading(false)
        console.log(err.message)
      })
  }, [createJobState])
  // ---

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {isLoading && (
              <Grid item xs={12}>
                {' '}
                <b>Loading...</b>
              </Grid>
            )}
            {isLoaded && (
              <Grid item xs={12}>
                <TotalInfo />
              </Grid>
            )}
            <Grid item xs={12}>
              {!!userData && (
                <>
                  <Button
                    onClick={handleCreateJob}
                    size="small"
                    variant="outlined"
                    color="primary"
                    disabled={isLoading}
                    endIcon={<BuildIcon />}
                  >
                    Создать работу
                  </Button>
                  <CreateNewJob
                    isLoading={isLoading || isCreateNewJobLoading}
                    onChangeField={handleChangeField}
                    onClose={handleCloseCreateJobForm}
                    onSave={handleSave}
                    {...createJobState}
                  />
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          {isLoaded && (
            <Joblist remontId={project.id} joblist={project.joblist} />
          )}
        </Grid>
      </Grid>
    </>
  )
}
