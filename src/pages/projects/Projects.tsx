import React from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { Link } from 'react-router-dom'

const apiUrl = getApiUrl()

interface IProject {
  id: string
  name: string
}

export const Projects = () => {
  const [projects, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts`,
    method: 'GET',
    // onSuccess: (data) => {},
    responseValidator: (res) => Array.isArray(res),
  })

  return (
    <div>
      <h1>🔙 <Link to='/'>Home</Link></h1>
      {
        isLoading && (
          <b>Loading...</b>
        )
      }
      {
        isLoaded && projects.length > 0 && (
          <ul>
            {
              projects.map(({ id, name }: IProject) => <li key={id}><Link to={`/projects/${id}`}>{name}</Link></li>)
            }
          </ul>
        )
      }
    </div>
  )
}