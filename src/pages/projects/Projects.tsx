import React, { useContext, useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'
import axios from 'axios'
import { httpErrorHandler } from '~/utils/errors/http/axios'
import { HttpError } from '~/utils/errors/http'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import { useStyles } from './styles'

const apiUrl = getApiUrl()
const GET_REMONTS = `
  {
    remonts {
      id,
      name,
      owners { id },
      executors { id }
    }
  }
`;
// SEARCH SAMPLE:
// const GET_MY_EXECURER_REMONTS = (id: string) => `{ remonts(where: { executers: "${id}" }) { id, name }}`

interface IProject {
  id: string
  name: string
  owners: any[]
  executors: any[]
}

const gqlResponseValidator = (res: any) => {
  if (!!res.data) {
    return res.data
  }
  if (!!res?.errors && Array.isArray(res?.errors)) {
    throw new Error(res?.errors[0]?.message || 'gql Errored; Msg not found')
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
  const [projects, setProjects] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { userData, logout, toast } = useContext(MainContext)
  const [cookies /* , setCookie, removeCookie */] = useCookies(['jwt'])
  const fetch = useCallback(({
    onSuccess, onFail,
  }: { userId: any, forType: string | null, onSuccess: (arr: any[]) => void, onFail?: (msg?: string) => void }) => {
    const axiosOpts = {
      baseURL: `${apiUrl}/graphql`,
    }
    if (!!cookies.jwt) {
      axiosOpts['Authorization'] =`Bearer ${cookies.jwt}`
    }
    const axiosRemoteGraphQL = axios.create(axiosOpts);

    setIsLoading(true)
    setIsLoaded(false)

    axiosRemoteGraphQL
      .post(
        '',
        {
          query: GET_REMONTS
        }
      )
      .then(httpErrorHandler)
      .then(gqlResponseValidator)
      .then(responseDataValidator)
      .then(arr => {
        onSuccess(arr)
        setIsLoading(false)
        setIsLoaded(true)
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)

        if (err instanceof HttpError) {
          const msg = err.getErrorMsg()
          if (msg.includes('401:')) {
            logout(msg)
              .then(() => {
                router.push('/auth/login')
              })
          }
        } else {
          if (!!onFail) onFail(typeof err === 'string' ? err : err?.message || 'Errored')
        }
      });
  }, [logout, setIsLoading, setIsLoaded]);

  const count = useRef<number>(0)
  useEffect(() => {
    // V2:
    // TODO: Убрать костыль co счетчиком!
    // - (hook for axiosRemoteGraphQL)
    // - Давать действия со списком в соответствии с результатами
    if (count.current === 0) {
      fetch({
        userId: null,
        forType: null,
        onSuccess: (ps) => {
          count.current += 1
          setProjects(ps)
        }
      })
    }
  }, [userData, setProjects, toast])

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
  const classes = useStyles()
  const goToPage = useCallback((link: string) => () => {
    router.push(link)
  }, [router])

  return (
    <div>
      <h1>Проекы</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {isLoading && <b>Loading...</b>}
          {isLoaded && projects.length > 0 && (
            <List className={classes.root} subheader={<li />}>
              {projects.map(({ id, name, owners, executors }: IProject) => (
                <ListItem
                  key={id}
                  className={classes.listItem}
                  onClick={goToPage(`/projects/${id}`)}
                >
                  <ListItemText
                    primary={name}
                    secondary={owners.some(({ id }) => myUserId === id) ? 'Ваш проект' : null}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </div>
  )
}
