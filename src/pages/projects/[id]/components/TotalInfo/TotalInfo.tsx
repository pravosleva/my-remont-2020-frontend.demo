import React, { useMemo } from 'react'
import { useStyles } from './styles'
import { Typography, Paper } from '@material-ui/core'
import { IJob } from '~/pages/projects/[id]/components/Joblist/components/Job/interfaces'
import { getPrettyPrice } from '~/utils/getPrettyPrice'

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
      <Typography variant="h4">Всего оплачено на текущий момент</Typography>
      <hr />
      <Typography variant="h1" component="h2">
        {getPrettyPrice(totalPayed)}
      </Typography>
    </Paper>
  )
}
