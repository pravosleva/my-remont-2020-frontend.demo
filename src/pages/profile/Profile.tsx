import React, { useCallback, useContext } from 'react'
// import { Link } from 'react-router-dom'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
// import { useStyles } from './styles'
// import { useRouter } from '~/common/hooks/useRouter'
import ReactJson from 'react-json-view'
import { MainContext } from '~/common/context/MainContext'

export const Profile = () => {
  // const classes = useStyles()
  // const router = useRouter()
  // const goToPage = useCallback(
  //   (link: string) => () => {
  //     router.push(link)
  //   },
  //   [router]
  // )
  const { userData } = useContext(MainContext)

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
