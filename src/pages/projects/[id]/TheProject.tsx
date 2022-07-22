import React, { useCallback, useEffect, useReducer, useState, useMemo } from 'react'
// import { useRemoteDataByFetch, TAns } from '~/common/hooks'
// import { getApiUrl } from '~/utils/getApiUrl'
import { useParams } from 'react-router-dom'
import { Joblist } from './components/Joblist'
import { Box, Button, CircularProgress, Grid } from '@material-ui/core'
import { TotalInfo } from './components/TotalInfo'
import { useCustomToastContext, useMainContext, useUserAuthContext } from '~/common/hooks'
import { useCookies } from 'react-cookie'
import { initialState as createNewJobInitialState, reducer as createNewJobReducer } from './createNewProjectReducer'
import { CreateNewJob } from './components/CreateNewJob'
import BuildIcon from '@material-ui/icons/Build'
import { useStyles } from './styles'
import { useRouter } from '~/common/hooks/useRouter'
import buildUrl from 'build-url'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import { httpClient } from '~/utils/httpClient'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'
import Alert from '@material-ui/lab/Alert'

// const apiUrl = getApiUrl()
// const isDev = process.env.NODE_ENV === 'development'

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
  // --- WIDGET
  const [isWidgetOpened, setWidgetOpened] = useState<boolean>(false)
  const handleToggleWidget = () => {
    setWidgetOpened((s) => !s)
  }
  // ---
  const {
    resetProjectData,
    setProjectData,
    // updateJoblist,
    jobsLogic,
    remontLogic,
    filterState,
    onSelectAll,
    onSelectIsDone,
    onSelectInProgress,
    updateRemont,
  } = useMainContext()
  const { toast } = useCustomToastContext()
  const { userData } = useUserAuthContext()
  // --- GET REMONT INFO
  const [cookies] = useCookies(['jwt'])
  const router: any = useRouter()
  const accessToken = useMemo(() => cookies.jwt, [cookies.jwt])
  /* V1:
  const handleSuccess = useCallback(
    (data) => {
      toast('useRemoteData: Received', { appearance: 'success' })
      setProjectData(data)
      updateRemont(data)
      updateJoblist(data.joblist)
    },
    [setProjectData, updateJoblist, toast]
  )
  const handleFail = useCallback(
    (msg: string) => {
      resetProjectData()
      if (isDev)
        toast(
          `Не удалось получить данные по ремонту: ${
            msg || 'Что-то пошло не так'
          }`,
          { appearance: 'error' }
        )
    },
    [resetProjectData]
  )
  const [project, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts/${id}`,
    method: 'GET',
    accessToken,
    onSuccess: handleSuccess,
    onFail: handleFail,
    on401: () => {
      const url = buildUrl('/', {
        path: 'auth/login',
        // hash: 'contact',
        queryParams: {
          from: `/projects/${id}`,
        },
      })
      router.history.push(url)
    },
    responseValidator: (res) => !!res.id,
  })
  */

  /* V2: */
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  useEffect(() => {
    setIsLoading(true)
    httpClient
      .getRemont(router.query?.id, cookies?.jwt)
      .then((data) => {
        setIsLoading(false)
        setIsLoaded(true)
        setProjectData(data)
        updateRemont(data)
        // updateJoblist(data.joblist)
        toast('Remont data received', { appearance: 'success' })
      })
      .catch((err) => {
        setIsLoading(false)
        setIsLoaded(false)
        toast(err.message, { appearance: 'error' })
      })
  }, [router.query?.id]) // remontLogic?.id, cookies?.jwt, setIsLoading

  // Reset on unmount:
  useEffect(
    () => () => {
      resetProjectData()
    },
    [resetProjectData]
  )
  // ---
  // --- CREATE JOB FORM:
  const [createJobState, dispatchCreateJob] = useReducer(createNewJobReducer, createNewJobInitialState)
  const handleCreateJob = useCallback(() => {
    dispatchCreateJob({ type: 'OPEN' })
  }, [])
  const handleCloseCreateJobForm = useCallback(() => {
    dispatchCreateJob({ type: 'CLOSE' })
    dispatchCreateJob({ type: 'TOTAL_RESET' })
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
  const joblist = useMemo(() => jobsLogic?.jobs || [], [jobsLogic])
  // --- SAVE JOB:
  const [isCreateNewJobLoading, setIsCreateNewJobLoading] = useState<boolean>(false)
  const handleSaveNewJobs = useCallback(() => {
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

    httpClient
      .updateRemontJoblist(id, [newJob, ...joblist], accessToken)
      .then((data) => {
        if (!!data?.id) {
          handleCloseCreateJobForm()
          if (Array.isArray(data.joblist)) {
            // NOTE: Necessary, because already updated by socket
            // updateJoblist(data.joblist)
            toast('Ok', { appearance: 'success' })
            return
          }
        }
        throw new Error('Fuckup')
      })
      .catch((err) => {
        console.log(err)
        if (err === 401) {
          const url = buildUrl('/', {
            path: 'auth/login',
            // hash: 'contact',
            queryParams: {
              from: `/projects/${id}`,
            },
          })
          router.history.push(url)
        } else {
          toast(err.message, { appearance: 'error' })
        }
      })
    setIsCreateNewJobLoading(false)
  }, [
    id,
    cookies,
    joblist,
    createJobState.comment,
    createJobState.name,
    setIsCreateNewJobLoading,
    handleCloseCreateJobForm,
    // updateJoblist,
    toast,
    accessToken,
  ])
  // ---
  // --- REMOVE JOB:
  const handleRemoveJob = useCallback(
    (jobId: string) => {
      setIsCreateNewJobLoading(true)
      const newJobList = joblist.filter(({ _id }) => _id !== jobId)

      httpClient
        .updateRemontJoblist(id, newJobList, accessToken)
        .then((data) => {
          if (!!data?.id) {
            handleCloseCreateJobForm()
            if (Array.isArray(data.joblist)) {
              // NOTE: Necessary, because already updated by socket
              // updateJoblist(data.joblist)
              toast('Ok', { appearance: 'success' })
              return
            }
          }
          throw new Error('Fuckup')
        })
        .catch((err) => {
          console.log(err)
          if (err === 401) {
            const url = buildUrl('/', {
              path: 'auth/login',
              // hash: 'contact',
              queryParams: {
                from: `/projects/${id}`,
              },
            })
            router.history.push(url)
          } else {
            toast(err.message, { appearance: 'error' })
          }
        })
      setIsCreateNewJobLoading(false)
    },
    [id, accessToken, setIsCreateNewJobLoading, joblist]
  )
  // ---
  const classes = useStyles()
  const isOwner: boolean = useMemo(() => remontLogic?.isOwner(userData?.id), [remontLogic, userData])
  const projectName: boolean = useMemo(() => remontLogic?.name, [remontLogic])
  const getFilterStateSelectedGroupInRussian = (value: string) => {
    switch (value) {
      case 'all':
        return 'Все'
      case 'inProgress':
        return 'В процессе'
      case 'isDone':
        return 'Завершенные'
      default:
        return 'FILTER'
    }
  }
  const filterTogglerLabel = useMemo(() => {
    if (!remontLogic) return 'Filter'
    switch (filterState.selectedGroup) {
      case 'isDone':
        return `${getFilterStateSelectedGroupInRussian(filterState.selectedGroup)} (${remontLogic.isDoneCounter})`
      case 'inProgress':
        return `${getFilterStateSelectedGroupInRussian(filterState.selectedGroup)} (${remontLogic.inProgressCounter})`
      case 'all':
        return `${getFilterStateSelectedGroupInRussian(filterState.selectedGroup)} (${remontLogic.allCounter})`
      default:
        return 0
    }
  }, [filterState.selectedGroup, remontLogic])
  const handleSelectAll = useCallback(() => {
    onSelectAll()
    handleToggleWidget()
  }, [onSelectAll, handleToggleWidget])
  const handleSelectIsDone = useCallback(() => {
    onSelectIsDone()
    handleToggleWidget()
  }, [onSelectIsDone, handleToggleWidget])
  const handleSelectInProgress = useCallback(() => {
    onSelectInProgress()
    handleToggleWidget()
  }, [onSelectInProgress, handleToggleWidget])

  return (
    <ResponsiveBlock isLimited>
      <h1>{projectName}</h1>
      <div
        className={clsx(classes.fixedDesktopWidget, {
          [classes.openedWidget]: isWidgetOpened,
        })}
      >
        <Box boxShadow={3} className={clsx(classes.widgetPaper, classes.buttonsWrapper)}>
          <Button
            onClick={handleToggleWidget}
            size="small"
            variant="contained"
            color="inherit"
            className={classes.widgetTogglerBtn}
            disabled={isLoading}
          >
            {isWidgetOpened ? <CloseIcon /> : filterTogglerLabel}
          </Button>
          <Button
            onClick={handleSelectAll}
            size="small"
            variant={filterState.selectedGroup === 'all' ? 'contained' : 'outlined'}
            color="primary"
            disabled={isLoading}
            // endIcon={<BuildIcon />}
            className={filterState.selectedGroup !== 'all' ? 'inactive' : ''}
          >
            Все{!!remontLogic ? ` (${remontLogic.allCounter})` : ''}
          </Button>
          <Button
            onClick={handleSelectIsDone}
            size="small"
            variant={filterState.selectedGroup === 'isDone' ? 'contained' : 'outlined'}
            color="primary"
            disabled={isLoading}
            // endIcon={<BuildIcon />}
            className={filterState.selectedGroup !== 'isDone' ? 'inactive' : ''}
          >
            Завершенные{!!remontLogic ? ` (${remontLogic.isDoneCounter})` : ''}
          </Button>
          <Button
            onClick={handleSelectInProgress}
            size="small"
            variant={filterState.selectedGroup === 'inProgress' ? 'contained' : 'outlined'}
            color="primary"
            disabled={isLoading}
            // endIcon={<BuildIcon />}
            className={filterState.selectedGroup !== 'inProgress' ? 'inactive' : ''}
          >
            В процессе{!!remontLogic ? ` (${remontLogic.inProgressCounter})` : ''}
          </Button>
        </Box>
      </div>
      <Grid container spacing={2}>
        {isLoading && (
          <Grid item xs={12} className={classes.circularProgressCentered}>
            <CircularProgress />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {isLoaded && (
              <Grid item xs={12}>
                <TotalInfo />
              </Grid>
            )}
            {!!isOwner && (
              <Grid item xs={12} style={{
                display: 'flex',
                justifyContent: 'center',
              }}>
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
                  onSave={handleSaveNewJobs}
                  {...createJobState}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Alert
                color='info'
                variant='filled'
                severity='info'
              >
                Здесь могла быть Ваша реклама
              </Alert>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {isLoaded && <Joblist remontId={remontLogic?.id} removeJob={handleRemoveJob} />}
              {/* remont.id */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ResponsiveBlock>
  )
}
