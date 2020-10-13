import React, { useContext, useCallback } from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'

const apiUrl = getApiUrl()

interface IProject {
  id: string
  name: string
}

export const Projects = () => {
  const { userData, logout } = useContext(MainContext)
  const [cookies /* , setCookie, removeCookie */] = useCookies(['jwt'])
  const responseValidator = useCallback((res) => Array.isArray(res), [userData])
  const router = useRouter()
  const [projects, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts`,
    method: 'GET',
    accessToken: cookies.jwt,
    // onSuccess: (data) => {},
    responseValidator,
    on401: (msg: string) => {
      logout(msg).then(() => {
        router.push('/auth/login')
      })
    },
  })

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
