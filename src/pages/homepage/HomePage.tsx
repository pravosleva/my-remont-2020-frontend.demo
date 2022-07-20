import React, { useCallback } from 'react'
// import { Link } from 'react-router-dom'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
import { useStyles } from './styles'
import { useRouter } from '~/common/hooks/useRouter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'

export const HomePage = () => {
  const classes = useStyles()
  const router = useRouter()
  const goToPage = useCallback(
    (link: string) => () => {
      router.push(link)
    },
    [router]
  )

  return (
    <>
      <ResponsiveBlock isLimited>
        <h1>Home</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List className={classes.root} subheader={<li />}>
              <ListItem className={classes.listItem} onClick={goToPage('/projects')}>
                <ListItemText primary="Проекты" secondary="Ремонты чего-либо" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </ResponsiveBlock>
    </>
  )
}
