import React from 'react'
import { IJob } from './interfaces'
import { useStyles } from './styles'
import { Grid, Typography, Paper } from '@material-ui/core'

interface IProps {
  data: IJob
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1">
              {data.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {data.comment || 'No comment'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ID: {data._id}
            </Typography>
          </Grid>
          <Grid>{<pre>{JSON.stringify(data, null, 2)}</pre>}</Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
