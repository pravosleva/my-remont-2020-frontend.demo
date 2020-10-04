import React from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { Link, useParams } from 'react-router-dom'
import { Joblist } from './components/Joblist'
import { Grid } from '@material-ui/core'
import { TotalInfo } from './components/TotalInfo'

const apiUrl = getApiUrl()

interface IPageParams {
  id: string
}

export const TheProject = () => {
  const { id }: IPageParams = useParams()
  const [project, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts/${id}`,
    method: 'GET',
    // onSuccess: (data) => {},
    responseValidator: (res) => !!res.id,
  })

  return (
    <>
      <h1>Список работ</h1>
      <div>
        🔙 <Link to="/">Главная</Link> / 🔙 <Link to="/projects">Проекты</Link> /{' '}
        <span style={{ opacity: '0.5' }}>{project?.name || 'Please wait...'}</span>
      </div>
      <hr />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {isLoading && <b>Loading...</b>}
          {isLoaded && <TotalInfo joblist={project.joblist} />}
        </Grid>
        <Grid item xs={12} md={6}>
          {isLoaded && <Joblist joblist={project.joblist} />}
        </Grid>
      </Grid>
    </>
  )
}
