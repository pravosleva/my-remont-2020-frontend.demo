import React, { useMemo, useContext, memo } from 'react'
import { useStyles } from './styles'
import { Paper, Typography } from '@material-ui/core'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import { Grid, Divider } from '@material-ui/core'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'
import CountUp from 'react-countup'
import { Collabsible } from '~/pages/projects/[id]/components/Joblist/components/Job/components/Collabsible'

const _TotalInfo = () => {
  const { jobsLogic, remontLogic } = useContext(MainContext)
  const classes = useStyles()
  const totalPriceJobs = useMemo(() => jobsLogic?.totalPriceJobs || 0, [jobsLogic])
  const totalPayed = useMemo(() => jobsLogic?.totalPayed || 0, [jobsLogic])
  const totalMaterials = useMemo(() => jobsLogic?.totalPriceMaterials || 0, [jobsLogic])
  const totalDelivery = useMemo(() => jobsLogic?.totalPriceDelivery || 0, [jobsLogic])
  const totalDifferecne = useMemo(() => jobsLogic?.totalDifference || 0, [jobsLogic])
  const comletedJobsCount = useMemo(() => jobsLogic?.comletedJobsCount, [jobsLogic])
  const totalJobsCount = useMemo(() => jobsLogic?.totalJobsCount, [jobsLogic])
  const lastUpdateReadable = useMemo(() => remontLogic?.lastUpdateReadable, [remontLogic?.lastUpdateReadable])

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <b className={classes.infoText}>
            Работ принято: {comletedJobsCount} из {totalJobsCount}
          </b>
        </Grid>
        <Divider />

        <Grid item>
          <Typography variant="h5">
            Total:{' '}
            <CountUp end={totalPayed} duration={2} separator=" " redraw>
              {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp>
          </Typography>
          {
            !!lastUpdateReadable && (
              <div className={classes.secondaryText}>
                <em>Last update {lastUpdateReadable}</em>
              </div>
            )
          }
        </Grid>

        {(!!totalPriceJobs || !!totalMaterials || !!totalDelivery) && (
          <Grid item>
            <Collabsible
              title='Details'
              contentRenderer={() => (
                <div className={classes.secondaryText}>
                  {!!totalPriceJobs && <Typography>Ценник за работу: {getPrettyPrice(totalPriceJobs)}</Typography>}
                  {!!totalMaterials && <Typography>Ценник за материалы: {getPrettyPrice(totalMaterials)}</Typography>}
                  {!!totalDelivery && <Typography>Ценник за доставку: {getPrettyPrice(totalDelivery)}</Typography>}
                </div>
              )}
            />
          </Grid>
        )}

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

export const TotalInfo = memo(_TotalInfo)
