import React, { useMemo, useContext } from 'react'
import { useStyles } from './styles'
// import { Paper } from '@material-ui/core'
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
    <div className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <h3 className={classes.infoText}>
            Работ принято: {comletedJobsCount} из {joblist.length}
          </h3>
        </Grid>
        <Divider />
        <Grid
          className={classes.secondaryText}
          item
          xs
          style={{ marginTop: '20px' }}
        >
          <b>ИТОГО оплачено: {getPrettyPrice(totalPayed)}</b>
        </Grid>
        <Grid item xs className={classes.secondaryText}>
          <b>Ценник за работу: {getPrettyPrice(totalPriceJobs)}</b>
        </Grid>
        <Grid item xs className={classes.secondaryText}>
          <b>Ценник за материалы: {getPrettyPrice(totalMaterials)}</b>
        </Grid>
        <Grid
          item
          xs
          className={clsx({
            [classes.dangerText]: totalDifferecne < 0,
            [classes.successText]: totalDifferecne >= 0,
          })}
        >
          <b>Кредиторская задолженность: {getPrettyPrice(totalDifferecne)}</b>
        </Grid>
      </Grid>
    </div>
  )
}
