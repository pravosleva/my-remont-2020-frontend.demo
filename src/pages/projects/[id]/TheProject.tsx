import React, { useContext, useEffect } from 'react'
import { useRemoteDataByFetch, TAns } from '~/common/hooks/useRemoteDataByFetch'
import { getApiUrl } from '~/utils/getApiUrl'
import { useParams } from 'react-router-dom'
import { Joblist } from './components/Joblist'
import { Grid } from '@material-ui/core'
import { TotalInfo } from './components/TotalInfo'
import { MainContext } from '~/common/context/MainContext'

const apiUrl = getApiUrl()

interface IPageParams {
  id: string
}

export const TheProject = () => {
  const { id }: IPageParams = useParams()
  const { setProjectName, resetProjectName } = useContext(MainContext)
  const [project, isLoaded, isLoading]: TAns = useRemoteDataByFetch({
    url: `${apiUrl}/remonts/${id}`,
    method: 'GET',
    onSuccess: (data) => {
      setProjectName(data.name)
    },
    onFail: () => {
      setProjectName(null)
    },
    responseValidator: (res) => !!res.id,
  })
  useEffect(() => {
    return () => {
      resetProjectName()
    }
  }, [])

  return (
    <>
      <h1>Список работ</h1>
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
