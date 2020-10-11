import React, { useMemo, useContext } from 'react'
import { useStyles } from './styles'
import { Paper, Typography } from '@material-ui/core'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid, Divider } from '@material-ui/core'
import {
  getTotalDifference,
  getTotalPriceMaterials,
  getTotalPayed,
  getTotalPriceJobs,
} from '~/utils/getDifference'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'

export const TotalInfo = () => {
  const { joblist } = useContext(MainContext)
  const classes = useStyles()
  const totalPriceJobs = useMemo(() => getTotalPriceJobs(joblist), [joblist])
  const totalPayed = useMemo(() => getTotalPayed(joblist), [joblist])
  const totalMaterials = useMemo(() => getTotalPriceMaterials(joblist), [
    joblist,
  ])
  const totalDifferecne = useMemo(() => getTotalDifference(joblist), [joblist])
  const comletedJobsCount = useMemo(
    () => joblist.filter(({ isDone }) => isDone).length,
    [joblist]
  )

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <b className={classes.infoText}>
            Работ принято: {comletedJobsCount} из {joblist.length}
          </b>
        </Grid>
        <Divider />

        <Grid className={classes.secondaryText} item>
          <Typography>Ценник за работу: {getPrettyPrice(totalPriceJobs)}</Typography>
          <Typography>Ценник за материалы: {getPrettyPrice(totalMaterials)}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">ИТОГО затраты: {getPrettyPrice(totalPayed)}</Typography>
        </Grid>
        <Divider />
        <Grid
          item
          className={clsx({
            [classes.dangerText]: totalDifferecne < 0,
            [classes.successText]: totalDifferecne >= 0,
          })}
        >
          <b>Баланс: {getPrettyPrice(totalDifferecne)}</b>
        </Grid>
      </Grid>
    </Paper>
  )
}
