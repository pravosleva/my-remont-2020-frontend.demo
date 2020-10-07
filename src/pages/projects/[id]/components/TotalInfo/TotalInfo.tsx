import React, { useMemo, useContext } from 'react'
import { useStyles } from './styles'
import { Paper } from '@material-ui/core'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid, Divider } from '@material-ui/core'
import { getTotalDifference, getTotalPriceMaterials, getTotalPayed, getTotalPriceJobs } from '~/utils/getDifference'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'

export const TotalInfo = () => {
  const { joblist } = useContext(MainContext)
  const classes = useStyles()
  const totalPriceJobs = useMemo(() => getTotalPriceJobs(joblist), [joblist])
  const totalPayed = useMemo(() => getTotalPayed(joblist), [joblist])
  const totalMaterials = useMemo(() => getTotalPriceMaterials(joblist), [joblist])
  const totalDifferecne = useMemo(() => getTotalDifference(joblist), [joblist])
  const comletedJobsCount = useMemo(() => joblist.filter(({ isDone }) => isDone).length, [joblist])

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <h3>
            Работ принято: {comletedJobsCount} из {joblist.length}
          </h3>
        </Grid>
        <Divider />
        <Grid item xs style={{ opacity: '0.5', marginTop: '20px' }}>
          <b>Ценник за работу: {getPrettyPrice(totalPriceJobs)}</b>
        </Grid>
        <Grid item xs style={{ opacity: '0.5' }}>
          <b>Ценник за материалы: {getPrettyPrice(totalMaterials)}</b>
        </Grid>
        <Grid item xs>
          <b>ИТОГО оплачено на текущий момент: {getPrettyPrice(totalPayed)}</b>
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
