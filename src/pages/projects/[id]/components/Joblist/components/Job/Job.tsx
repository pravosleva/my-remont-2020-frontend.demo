import React, { useMemo } from 'react'
import { IJob } from './interfaces'
import { useStyles } from './styles'
import { Grid, Typography, Paper } from '@material-ui/core'
import Markdown from 'react-markdown'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import clsx from 'clsx'

interface IProps {
  data: IJob
}

const getDifference = (data: IJob) => {
  return data.payed - (data.priceMaterials + data.priceJobs + data.priceDelivery)
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()
  const diff = useMemo(() => getDifference(data), [data])

  return (
    <Paper className={clsx(classes.paper, { [classes.disabled]: data.isDone })}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography gutterBottom variant="h4">
            {data.name}
          </Typography>
          {!!data.comment && (
            <Typography variant="body2" color="textSecondary">
              {data.comment || 'No comment'}
            </Typography>
          )}
          {!!data.description && <Markdown source={data.description} />}
        </Grid>
        {!!data.priceJobs && (
          <Grid item>
            <Typography gutterBottom variant="body2" color="textSecondary">
              Цена за работу: {getPrettyPrice(data.priceJobs)}
            </Typography>
          </Grid>
        )}
        {!!data.priceMaterials && (
          <Grid item>
            <Typography gutterBottom variant="body2" color="textSecondary">
              Цена за материалы: {getPrettyPrice(data.priceMaterials)}
            </Typography>
          </Grid>
        )}
        {!!data.priceDelivery && (
          <Grid item>
            <Typography gutterBottom variant="body2" color="textSecondary">
              Цена за доставку: {getPrettyPrice(data.priceDelivery)}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Typography gutterBottom variant="h5">
            Оплачено на текущий момент: {getPrettyPrice(data.payed)}
          </Typography>
        </Grid>
        {/*
          <Grid>{<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}</Grid>
          */}
      </Grid>
      <Grid item>
        <b className={clsx({ [classes.redText]: diff < 0, [classes.greenText]: diff >= 0 })}>
          Остаток: {getPrettyPrice(diff)}
        </b>
      </Grid>
    </Paper>
  )
}
