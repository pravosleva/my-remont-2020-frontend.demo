import React from 'react'
import { Grid } from '@material-ui/core'
import ReactJson from 'react-json-view'
import { useUserAuthContext } from '~/common/hooks'

export const Profile = () => {
  const { userData } = useUserAuthContext()

  return (
    <div>
      <h1>Профиль</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {!userData && <b>Loading...</b>}
          {!!userData && <ReactJson src={userData} />}
        </Grid>
      </Grid>
    </div>
  )
}
