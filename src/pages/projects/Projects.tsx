import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCustomToastContext, useMainContext, useUserAuthContext } from '~/common/hooks'
import { useRouter } from '~/common/hooks/useRouter'
import { httpErrorHandler } from '~/utils/errors/http/axios'
import { HttpError } from '~/utils/errors/http'
import { Avatar, Button, CircularProgress, Chip, Grid, List, ListItem, ListItemText } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { usePrompt } from '~/common/hooks/usePrompt'
import { useStyles } from './styles'
import { useCookies } from 'react-cookie'
import { eventlist as ev } from '~/common/socket'
import { formatDateBySeconds2 } from '~/utils/time/timeConverter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'

const apiUrl = getApiUrl()
const GET_REMONTS = `
  {
    remonts(sort: "updatedAt:DESC")  {
      id
      name
      updatedAt
      owners { id }
      executors { id }
    }
  }
`
// SEARCH SAMPLE 1:
// const GET_MY_EXECURER_REMONTS = (id: string) => `{ remonts(where: { executers: "${id}" }) { id, name }}`
// SEARCH SAMPLE 2:
// query { remonts(sort: "updatedAt:DESC") { id, name, owners { id } }}
/*
const CREATE_REMONT = ({ ownerId, projectName }) => `
  mutation {
    createRemont (
      input: {
        data: {
          owners: [
            "${ownerId}"
          ]
          name: "${projectName}"
        }
      }
    ) {
      remont {
        id
        name
        owners { id }
      }
    }
  }
`;
*/

interface IProjectMinimalData {
  id: string
  name: string
  owners: any[]
  executors: any[]
  updatedAt: string
}

const gqlResponseValidator = (res: any) => {
  if (!!res?.errors && Array.isArray(res?.errors)) {
    throw new Error(res?.errors[0]?.message || 'gql Errored; Msg not found')
  }
  if (!!res.data) {
    return res.data
  }
  throw new Error('gql Errored; Errors not received')
}
const responseDataValidator = (data: any) => {
  if (!!data?.remonts && Array.isArray(data.remonts)) {
    return data.remonts
  }

  throw new Error(`data.remonts is ${String(data?.remonts)}; Errors not received`)
}

export const Projects = () => {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  // NOTE: Больше не нужно (придет по сокету)
  // const addProject = useCallback(
  //   (newP) => {
  //     const normalizedObj = {
  //       id: newP.id,
  //       name: newP.name,
  //       owners: newP.owners.map((elm: string) => ({ id: elm })),
  //     }

  //     setProjects((ps: any[]) => [normalizedObj, ...ps])
  //   },
  //   [setProjects]
  // )
  // NOTE: Если передать объект data
  // const handleUpdateProjectDATA = useCallback(
  //   (data) => {
  //     setProjects((ps: any[]) => {
  //       const oldList = ps.filter(({ id }) => id !== data.id)
  //       const normalizedObj = {
  //         id: data.id,
  //         name: data.name,
  //         owners: data.owners.map((elm: string) => ({ id: elm })),
  //       }
  //       const newList = [normalizedObj, ...oldList]

  //       return [...newList]
  //     })
  //   },
  //   [setProjects]
  // )
  const handleCreateOrUpdateProject = useCallback(
    (result) => {
      setProjects((ps: any[]) => {
        const oldList = ps.filter(({ id }) => id !== result.id)
        const newList = [result, ...oldList]

        return [...newList]
      })
    },
    [setProjects]
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { socket, axiosRemoteGraphQL } = useMainContext()
  const { toast } = useCustomToastContext()
  const { userData, logout } = useUserAuthContext()
  const onRemontCreateOrUpdate = useCallback(
    ({ result }) => {
      if (!!result.id) {
        handleCreateOrUpdateProject(result)
        toast('Список проектов обновлен', { appearance: 'info' })
      }
    },
    [handleCreateOrUpdateProject, toast]
  )
  useEffect(() => {
    socket.on(ev.REMONT_UPDATED, onRemontCreateOrUpdate)
    socket.on(ev.REMONT_CREATED, onRemontCreateOrUpdate)

    return () => {
      socket.off(ev.REMONT_UPDATED, onRemontCreateOrUpdate)
      socket.off(ev.REMONT_CREATED, onRemontCreateOrUpdate)
    }
  }, [socket, onRemontCreateOrUpdate, handleCreateOrUpdateProject, toast])
  const fetch = useCallback(
    ({
      onSuccess,
      onFail,
    }: {
      userId: any
      forType: string | null
      onSuccess: (arr: any[]) => void
      onFail?: (msg?: string) => void
    }) => {
      if (!axiosRemoteGraphQL) return

      setIsLoading(true)
      setIsLoaded(false)

      axiosRemoteGraphQL
        .post('', {
          query: GET_REMONTS,
        })
        .then(httpErrorHandler)
        .then(gqlResponseValidator)
        .then(responseDataValidator)
        .then((arr) => {
          onSuccess(arr)
          setIsLoading(false)
          setIsLoaded(true)
        })
        .catch((err) => {
          setIsLoading(false)
          console.log(err)

          if (err instanceof HttpError) {
            const msg = err.getErrorMsg()
            if (msg.includes('401:')) {
              logout(msg).then(() => {
                router.push('/auth/login')
              })
            }
          } else {
            if (!!onFail) onFail(typeof err === 'string' ? err : err?.message || 'Errored')
          }
        })
    },
    [logout, setIsLoading, setIsLoaded, axiosRemoteGraphQL]
  )

  // const count = useRef<number>(0)
  useEffect(
    () => {
      // V2:
      // TODO: Убрать костыль co счетчиком!
      // - (hook for axiosRemoteGraphQL)
      // - Давать действия со списком в соответствии с результатами
      // if (count.current === 0) {}
      fetch({
        userId: null,
        forType: null,
        onSuccess: (ps) => {
          // count.current += 1
          setProjects(ps)
        },
        onFail: (msg: string) => {
          toast(msg, { appearance: 'error' })
        },
      })
    },
    [
      // userData,
      // setProjects,
    ]
  )

  // V1:
  // const [projects, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
  //   url: `${apiUrl}/remonts`,
  //   method: 'GET',
  //   accessToken: cookies.jwt,
  //   // onSuccess: (data) => {},
  //   responseValidator,
  //   on401: (msg: string) => {
  //     logout(msg).then(() => {
  //       router.push('/auth/login')
  //     })
  //   },
  // })

  const myUserId = useMemo(() => userData?.id, [userData])
  const myUserName = useMemo(() => userData?.username, [userData])
  const classes = useStyles()
  const goToPage = useCallback(
    (link: string) => () => {
      router.push(link)
    },
    [router]
  )

  // CREATE JOB:
  // V2: GraphQL (TOO: Why does not works?)
  /*
  const createRemontPromise = useCallback(async ({ name }: { name: string }): Promise<any | undefined> => {
    if (!axiosRemoteGraphQL) return Promise.reject('Sorry, try again')
    setIsLoading(true)

    const res = await axiosRemoteGraphQL
      .post(
        '',
        {
          query: CREATE_REMONT({ ownerId: userData?.id, projectName: name })
        }
      )
      .then(httpErrorHandler)
      .then(gqlResponseValidator)
      .then((r: any) => {
        const { errors, data } = r
        console.log(r)
        if (!!errors) {
          throw new Error(Array.isArray(errors) ? (errors[0]?.message || 'No message') : 'errors in not array')
        }
        if (!data?.createRemont) {
          throw new Error('Response data is incorrect')
        }
        return data?.createRemont
      })
      .then((remont: any) => {
        // onSuccess(arr)
        setIsLoading(false)
        setIsLoaded(true)
        return remont
      })
      .catch((err: any) => {
        setIsLoading(false)

        if (err instanceof HttpError) {
          const msg = err.getErrorMsg()
          if (msg.includes('401:')) {
            logout(msg)
              .then(() => {
                router.push('/auth/login')
              })
            throw new Error(msg)
          }
        } else {
          // if (!!onFail) onFail(typeof err === 'string' ? err : err?.message || 'Errored')
        }
        throw new Error(typeof err === 'string' ? err : err?.message || 'axiosRemoteGraphQL: Errored')
      });

    return res
  }, [axiosRemoteGraphQL, setIsLoading, setIsLoaded, cookies])
  */

  // V3: winfow.fetch
  const [cookies] = useCookies(['jwt'])
  const createRemontPromise2 = useCallback(
    async ({ name }: { name: string }): Promise<any | undefined> => {
      if (!axiosRemoteGraphQL) return Promise.reject('Sorry, try again')
      setIsLoading(true)

      const res = await window
        .fetch(`${apiUrl}/remonts`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            // 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.jwt}`,
          },
          body: JSON.stringify({ name, owners: [userData.id] }),
        })
        .then((res) => res.json())
        .then((remont) => {
          if (!!remont.id) {
            setIsLoading(false)
            toast('Успешно', { appearance: 'success' })
            return remont
          }
          throw new Error('Fuckup')
        })
        .catch((err) => {
          setIsLoading(false)
          throw new Error(typeof err === 'string' ? err : err?.message || 'window.fetch: Errored')
        })

      return res
    },
    [axiosRemoteGraphQL, setIsLoading, setIsLoaded, cookies]
  )
  // const confirm = useConfirm()
  const prompt = usePrompt()

  const handleCreateProject = useCallback(() => {
    if (!userData?.id) {
      toast('Необходима авторизация', { appearance: 'error' })
      return
    }

    prompt({
      label: 'Введите название',
      type: 'text',
      title: 'Новый проект',
    })
      .then((value: string) => {
        if (!value) {
          throw new Error('Соррян, бро. Название проекта не может быть пустым')
        }
        createRemontPromise2({ name: value })
          // NOTE: Могли бы сразу же занести в стейт, но вместо этого ждем ремонт по сокету:
          // .then((remont: any) => { addProject(remont) })
          .catch((err) => {
            toast(typeof err === 'string' ? err : err?.message || 'createRemontPromise2: Errored', {
              appearance: 'error',
            })
          })
      })
      .catch((err: any) => {
        toast(err?.message || 'handleCreateProject: Declined', {
          appearance: 'error',
        })
      })
  }, [userData, toast, createRemontPromise2])

  const MemoizedListing = useMemo(
    () => (
      <>
        {projects.map(({ id, name, owners, executors, updatedAt }: IProjectMinimalData) => {
          const isOwner = owners.some(({ id }) => myUserId === id)

          return (
            <ListItem key={id} className={classes.listItem} onClick={goToPage(`/projects/${id}`)} title={id}>
              <ListItemText
                key={`${id}--subheader`}
                primary={name}
                secondary={`Обновлено ${formatDateBySeconds2(updatedAt)}`}
              />
              {isOwner && (
                <Chip
                  className={classes.chip}
                  variant="outlined"
                  size="small"
                  avatar={<Avatar>{myUserName.slice(0, 1).toUpperCase()}</Avatar>}
                  label="Ваш проект"
                />
              )}
            </ListItem>
          )
        })}
      </>
    ),
    [projects, myUserId]
  )

  return (
    <ResponsiveBlock isLimited>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'inline' }}>Проекты</h1>
        {!!userData?.id && (
          <div>
            <Button
              size="small"
              variant="outlined"
              onClick={handleCreateProject}
              startIcon={<AddIcon />}
              disabled={isLoading || !isLoaded}
            >
              Создать
            </Button>
          </div>
        )}
      </div>
      <Grid container spacing={2}>
        {isLoading && (
          <Grid item xs={12} className={classes.circularProgressCentered}>
            <CircularProgress />
          </Grid>
        )}
        {isLoaded && projects.length > 0 && (
          <Grid item xs={12} md={6}>
            <List className={classes.root} subheader={<li />}>
              {MemoizedListing}
            </List>
          </Grid>
        )}
        {/* {!!userData?.id && (
          <Grid item xs={12} md={6}>
            <div className={classes.rightSpace}>

            </div>
          </Grid>
        )} */}
      </Grid>
    </ResponsiveBlock>
  )
}
