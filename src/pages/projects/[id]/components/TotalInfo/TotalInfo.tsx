import React, { useMemo } from 'react'
import { useStyles } from './styles'
import { Paper } from '@material-ui/core'
import { IJob } from '~/pages/projects/[id]/components/Joblist/components/Job/interfaces'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid } from '@material-ui/core'
import { getTotalDifference, getTotalPriceMaterials, getTotalPayed, getTotalPriceJobs } from '~/utils/getDifference'
import clsx from 'clsx'

interface IProps {
  joblist: IJob[]
}

export const TotalInfo = ({ joblist }: IProps) => {
  const classes = useStyles()
  const totalPriceJobs = useMemo(() => getTotalPriceJobs(joblist), [joblist])
  const totalPayed = useMemo(() => getTotalPayed(joblist), [joblist])
  const totalMaterials = useMemo(() => getTotalPriceMaterials(joblist), [joblist])
  const totalDifferecne = useMemo(() => getTotalDifference(joblist), [joblist])

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs style={{ opacity: '0.5' }}>
          <b>Ценник за работу: {getPrettyPrice(totalPriceJobs)}</b>
        </Grid>
        <Grid item xs style={{ opacity: '0.5' }}>
          <b>Ценник за материалы: {getPrettyPrice(totalMaterials)}</b>
        </Grid>
        <Grid item xs>
          <b>Всего оплачено на текущий момент: {getPrettyPrice(totalPayed)}</b>
        </Grid>
        <Grid
          item
          xs
          className={clsx({ [classes.redText]: totalDifferecne < 0, [classes.greenText]: totalDifferecne >= 0 })}
        >
          <b>Кредиторская задолженность: {getPrettyPrice(totalDifferecne)}</b>
        </Grid>
      </Grid>
    </Paper>
  )
}
