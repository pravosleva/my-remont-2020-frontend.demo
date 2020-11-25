import React, { useMemo, useEffect, useState, useContext } from 'react'
import { IJob } from '~/common/context/MainContext'
import { useStyles } from './styles'
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core'
import Markdown from 'react-markdown'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import clsx from 'clsx'
import { getDifference } from '~/utils/getDifference'
import { openLinkInNewTab } from '~/utils/openLinkInNewTab'
import TextField from '@material-ui/core/TextField'
import {
  DateRangePicker,
  DateRangeDelimiter,
  DateRange as TDateRange,
  LocalizationProvider,
  MobileDatePicker,
} from '@material-ui/pickers'
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'
import ruLocale from 'date-fns/locale/ru'
import SaveIcon from '@material-ui/icons/Save'
import { MainContext } from '~/common/context/MainContext'
import { Plan } from './components/Plan'

interface IProps {
  data: IJob
  onSetDates: (
    id: string,
    psd: string,
    pfd: string,
    realFinishDate: string
  ) => () => void
  isLoading: boolean
}

export const Job = ({ data, onSetDates, isLoading }: IProps) => {
  const { userData, remontLogic } = useContext(MainContext)
  const isOwner: boolean = useMemo(() => remontLogic?.isOwner(userData?.id), [
    remontLogic,
    userData,
  ])
  const classes = useStyles()
  const diff = useMemo(() => getDifference(data), [data])

  // Links should be opened in new tab:
  useEffect(() => {
    const jobDescriptionMarkdown = document.querySelector(
      '.job-description-markdown'
    )

    if (typeof window !== 'undefined') {
      if (!!jobDescriptionMarkdown)
        jobDescriptionMarkdown?.addEventListener('click', openLinkInNewTab)
    }
    return () => {
      if (typeof window !== 'undefined') {
        if (!!jobDescriptionMarkdown)
          jobDescriptionMarkdown?.removeEventListener('click', openLinkInNewTab)
      }
    }
  }, [])

  const [dates, setStartDate] = useState<TDateRange<Date>>([
    data.plannedStartDate ? new Date(data.plannedStartDate) : null,
    data.plannedFinishDate ? new Date(data.plannedFinishDate) : null,
  ])
  const [realFinishDate, setRealFinishDate] = useState<Date>(
    data.realFinishDate ? new Date(data.realFinishDate) : null
  )
  const handleSunmit = () => {
    console.log(dates)
    console.log(dates[0].toISOString())
    console.log(dates[1].toISOString())
    onSetDates(
      data._id,
      !!dates[0] ? dates[0].toISOString() : null,
      !!dates[1] ? dates[1].toISOString() : null,
      !!realFinishDate ? realFinishDate.toISOString() : null
    )()
  }
  const isSubmitDisabled = useMemo(
    () =>
      !dates[0] ||
      (new Date(data.plannedStartDate).getTime() ===
        new Date(dates[0]).getTime() &&
        new Date(data.plannedFinishDate).getTime() ===
          new Date(dates[1]).getTime() &&
        new Date(data.realFinishDate).getTime() ===
          new Date(realFinishDate).getTime()),
    [
      dates,
      data.plannedStartDate,
      data.plannedFinishDate,
      data.realFinishDate,
      realFinishDate,
    ]
  )

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
      <div className={classes.paper}>
        <Grid container direction="column" spacing={2}>
        <Grid item>
            <Plan
              title='План'
              contentRenderer={() => (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <DateRangePicker
                      calendars={1}
                      value={dates}
                      onChange={(newValue) => {
                        setStartDate(newValue)
                      }}
                      disabled={!isOwner}
                      renderInput={(startProps, endProps) => (
                        <>
                          <TextField
                            size="small"
                            {...startProps}
                            label="Начало работ (факт)"
                            // helperText="Фактическая дата"
                            helperText={undefined}
                            fullWidth
                          />
                          <DateRangeDelimiter>to</DateRangeDelimiter>
                          <TextField
                            size="small"
                            {...endProps}
                            label="Конец работ (план)"
                            // helperText="Планируемая дата"
                            helperText={undefined}
                            fullWidth
                          />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <MobileDatePicker
                      // clearable
                      // mask='__.__.____'
                      label="Дата завершения"
                      inputFormat="dd.MM.yyyy"
                      toolbarPlaceholder="Финиш"
                      value={realFinishDate}
                      onChange={(newValue) => setRealFinishDate(newValue)}
                      renderInput={(props) => (
                        <TextField
                          size="small"
                          {...props}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      disabled={!isOwner}
                    />
                  </div>
                  {isOwner && !isSubmitDisabled && (
                    <div style={{ marginTop: '20px' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleSunmit}
                        disabled={isSubmitDisabled}
                        endIcon={
                          isLoading ? (
                            <CircularProgress
                              size={20}
                              color="primary"
                              style={{ marginLeft: 'auto' }}
                            />
                          ) : (
                            <SaveIcon />
                          )
                        }
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item>
            <div className={classes.title}>
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
          {!!data.comment && (
            <Grid item xs={12}>
              <div className={classes.title}>
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
          {/* https://next.material-ui-pickers.dev/demo/daterangepicker
          <Grid item>
            <div className={classes.title}><b>Dates</b></div>
            <pre>{JSON.stringify(data.dateStart)}</pre>
          </Grid>
          */}
        </Grid>
      </div>
    </LocalizationProvider>
  )
}
