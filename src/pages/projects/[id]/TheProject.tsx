import React from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { Link, useParams } from 'react-router-dom'

const apiUrl = getApiUrl()

interface IPageParams {
  id: string
}

export const TheProject = () => {
  const { id }: IPageParams = useParams();
  const [project, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts/${id}`,
    method: 'GET',
    // onSuccess: (data) => {},
    responseValidator: (res) => !!res.id,
  })

  return (
    <div>
      <h1>🔙 <Link to='/projects'>Projects</Link></h1>
      {
        isLoading && (
          <b>Loading...</b>
        )
      }
      {
        isLoaded && (
          <pre>{JSON.stringify(project, null, 2)}</pre>
        )
      }
    </div>
  )
}