import React, { useMemo } from 'react'
import { useStyles } from './styles'
import { Typography, Paper } from '@material-ui/core'
import { IJob } from '~/pages/projects/[id]/components/Joblist/components/Job/interfaces'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid } from '@material-ui/core'

interface IProps {
  joblist: IJob[]
}

const getTotalPayed = (joblist: IJob[]) => {
  let res = 0

  for (let i = 0, max = joblist.length; i < max; i++) {
    if (joblist[i].payed > 0) {
      res += joblist[i].payed
    }
  }

  return res
}

export const TotalInfo = ({ joblist }: IProps) => {
  const classes = useStyles()
  const totalPayed = useMemo(() => getTotalPayed(joblist), [joblist])

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography variant="h4">Всего оплачено на текущий момент</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h1" component="h2">
            {getPrettyPrice(totalPayed)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
