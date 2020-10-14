import React, { useMemo, useContext, useState } from 'react'
import { IJob } from './interfaces'
import { useStyles } from './styles'
import { Grid, Typography } from '@material-ui/core'
import Markdown from 'react-markdown'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import clsx from 'clsx'
import { getDifference } from '~/utils/getDifference'

interface IProps {
  data: IJob
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()
  const diff = useMemo(() => getDifference(data), [data])

  return (
    <div className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        {!!data.comment && (
          <Grid item xs={12}>
            <b>Комментарий</b>
            <div>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {data.comment || 'No comment'}
              </Typography>
            </div>
          </Grid>
        )}
        {!!data.description && (
          <Grid item xs={12}>
            <b>Описание</b>
            <Markdown
              source={data.description}
              className={classes.description}
            />
          </Grid>
        )}
        <Grid item>
          <Typography gutterBottom variant="body2" color="textSecondary">
            Цена за работу: {getPrettyPrice(data.priceJobs)}
          </Typography>
          <Typography gutterBottom variant="body2" color="textSecondary">
            Цена за материалы: {getPrettyPrice(data.priceMaterials)}
          </Typography>
          <Typography gutterBottom variant="body2" color="textSecondary">
            Цена за доставку: {getPrettyPrice(data.priceDelivery)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h5">
            Оплачено: {getPrettyPrice(data.payed)}
          </Typography>
        </Grid>
        <Grid item>
          <b
            className={clsx({
              [classes.dangerText]: diff < 0,
              [classes.successText]: diff >= 0,
            })}
          >
            Остаток: {getPrettyPrice(diff)}
          </b>
        </Grid>
      </Grid>
    </div>
  )
}
