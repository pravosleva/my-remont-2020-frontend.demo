import React, { useMemo, useContext } from 'react'
import { useStyles } from './styles'
import { Paper, Typography } from '@material-ui/core'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid, Divider } from '@material-ui/core'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'
import CountUp from 'react-countup'

export const TotalInfo = () => {
  const { jobsLogic } = useContext(MainContext)
  const classes = useStyles()
  const totalPriceJobs = useMemo(() => jobsLogic?.totalPriceJobs || 0, [
    jobsLogic,
  ])
  const totalPayed = useMemo(() => jobsLogic?.totalPayed || 0, [jobsLogic])
  const totalMaterials = useMemo(() => jobsLogic?.totalPriceMaterials || 0, [
    jobsLogic,
  ])
  const totalDifferecne = useMemo(() => jobsLogic?.totalDifference || 0, [
    jobsLogic,
  ])
  const comletedJobsCount = useMemo(() => jobsLogic?.comletedJobsCount, [
    jobsLogic,
  ])
  const totalJobsCount = useMemo(() => jobsLogic?.totalJobsCount, [jobsLogic])

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <b className={classes.infoText}>
            Работ принято: {comletedJobsCount} из {totalJobsCount}
          </b>
        </Grid>
        <Divider />

        <Grid className={classes.secondaryText} item>
          <Typography>
            Ценник за работу: {getPrettyPrice(totalPriceJobs)}
          </Typography>
          <Typography>
            Ценник за материалы: {getPrettyPrice(totalMaterials)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">
            ИТОГО затраты: <CountUp
              end={totalPayed}
              duration={2.75}
              separator=" "
              redraw
            >
              {({ countUpRef }) => (
                <span ref={countUpRef} />
              )}
            </CountUp>
          </Typography>
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
