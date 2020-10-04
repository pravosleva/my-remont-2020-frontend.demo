import React from 'react'
import { IJob } from './interfaces'
import { useStyles } from './styles'
import { Grid, Typography, Paper } from '@material-ui/core'
import Markdown from 'react-markdown'
import { getPrettyPrice } from '~/utils/getPrettyPrice'

interface IProps {
  data: IJob
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1">
              {data.name}
            </Typography>
            {!!data.comment && (
              <Typography variant="body2" gutterBottom>
                {data.comment || 'No comment'}
              </Typography>
            )}
            {!!data.description && <Markdown source={data.description} />}
            <Typography variant="body2" color="textSecondary">
              ID: {data._id}
            </Typography>
          </Grid>
          {!!data.priceJobs && (
            <Grid>
              <Typography gutterBottom variant="subtitle1">
                Цена за работу: {getPrettyPrice(data.priceJobs)}
              </Typography>
            </Grid>
          )}
          {!!data.priceMaterials && (
            <Grid>
              <Typography gutterBottom variant="subtitle1">
                Цена за материалы: {getPrettyPrice(data.priceMaterials)}
              </Typography>
            </Grid>
          )}
          <Grid>
            <Typography gutterBottom variant="subtitle1">
              Оплачено на текущий момент: {getPrettyPrice(data.payed)}
            </Typography>
          </Grid>
          {/*
          <Grid>{<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}</Grid>
          */}
        </Grid>
      </Grid>
    </Paper>
  )
}
