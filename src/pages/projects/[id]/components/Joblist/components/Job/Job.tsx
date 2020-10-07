import React, { useMemo, useContext, useState } from 'react'
import { IJob } from './interfaces'
import { useStyles } from './styles'
import { Grid, Typography } from '@material-ui/core'
import Markdown from 'react-markdown'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import clsx from 'clsx'
import { getDifference } from '~/utils/getDifference'
// import { MainContext } from '~/common/context/MainContext'
// import { Button } from '@material-ui/core'

interface IProps {
  data: IJob
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()
  const diff = useMemo(() => getDifference(data), [data])
  // const { userData } = useContext(MainContext)
  // const [isEditorOpened, setIsEditorOpened] = useState<boolean>(false)

  return (
    <div className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
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
            Оплачено: {getPrettyPrice(data.payed)}
          </Typography>
        </Grid>
        {/*
          <Grid>{<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}</Grid>
        */}
        <Grid item>
          <b className={clsx({ [classes.redText]: diff < 0, [classes.greenText]: diff >= 0 })}>
            Остаток: {getPrettyPrice(diff)}
          </b>
        </Grid>
      </Grid>
    </div>
  )
}
