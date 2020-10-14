import React, { useContext, useCallback, useState, useEffect } from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'
import axios from 'axios'

const apiUrl = getApiUrl()
const GET_REMONTS = `
  {
    remonts {
      id,
      name
    }
  }
`;

interface IProject {
  id: string
  name: string
}

export const Projects = () => {
  const router = useRouter()
  const responseValidator = (data: any) => !!data?.data?.remonts && Array.isArray(data.data.remonts)
  const [projects, setProjects] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { userData, logout } = useContext(MainContext)
  const [cookies /* , setCookie, removeCookie */] = useCookies(['jwt'])
  const fetch = useCallback(() => {
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
      .post('', { query: GET_REMONTS })
      // .then(apiResponseHadler)
      .then((res) => {
        if (res.status === 200) {
          return res;
        } else if (res.status === 401) {
          logout(res.statusText)
            .then(() => {
              router.push('/auth/login')
            })
        }
        throw res;
      })
      .then(res => {
        if (!!res?.data && responseValidator(res.data)) {
          return res.data.data.remonts;
        }
        throw new Error('Invalid response');
      })
      .then(arr => {
        setProjects(arr)
        setIsLoading(false)
        setIsLoaded(true)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      });
  }, [setProjects, logout, setIsLoading, setIsLoaded]);
  useEffect(() => {
    fetch()
  }, [])

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

  return (
    <div>
      <h1>Проекы</h1>
      {isLoading && <b>Loading...</b>}
      {isLoaded && projects.length > 0 && (
        <ul>
          {projects.map(({ id, name }: IProject) => (
            <li key={id}>
              <Link to={`/projects/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
