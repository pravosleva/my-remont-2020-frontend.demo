import React, { useMemo, useEffect } from 'react'
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

function linkInNewTab(e: any) {
  try {
    const { tagName } = e?.originalTarget

    if (!tagName) return

    if (tagName === 'A') {
      e.preventDefault()
      const newLink = window.document.createElement('a')

      newLink.setAttribute('href', e.originalTarget.href)
      newLink.setAttribute('target', '_blank')
      newLink.click()
    }
  } catch (err) {
    return
  }
}

export const Job = ({ data }: IProps) => {
  const classes = useStyles()
  const diff = useMemo(() => getDifference(data), [data])

  // Links should be opened in new tab:
  useEffect(() => {
    const jobDescriptionMarkdown = document.querySelector(
      '.job-description-markdown'
    )

    if (typeof window !== 'undefined') {
      if (!!jobDescriptionMarkdown)
        jobDescriptionMarkdown?.addEventListener('click', linkInNewTab)
    }
    return () => {
      if (typeof window !== 'undefined') {
        if (!!jobDescriptionMarkdown)
          jobDescriptionMarkdown?.removeEventListener('click', linkInNewTab)
      }
    }
  }, [])

  return (
    <div className={classes.paper}>
      <Grid container direction="column" spacing={2}>
        {!!data.comment && (
          <Grid item xs={12}>
            <div style={{ marginBottom: '15px' }}>
              <b>Комментарий</b>
            </div>
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
          <Grid item xs={12} className="job-description-markdown">
            <div>
              <b>Описание</b>
            </div>
            <Markdown
              source={data.description}
              className={classes.description}
            />
          </Grid>
        )}
        <Grid item>
          <div style={{ marginBottom: '15px' }}>
            <b>Итог</b>
          </div>
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
