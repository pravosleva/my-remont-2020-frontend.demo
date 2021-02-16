import React, { useMemo, useEffect, useState, useContext, useCallback } from 'react'
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
import { Collabsible } from './components/Collabsible'
import { httpClient } from '~/utils/httpClient'
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { useCookies } from 'react-cookie'
import ImageGallery from 'react-image-gallery';
import { getApiUrl } from '~/utils/getApiUrl'

const apiUrl = getApiUrl()

interface IProps {
  data: IJob
  onSetDates: (
    id: string,
    psd: string,
    pfd: string,
    realFinishDate: string
  ) => () => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  remontId: string
}

export const Job = ({ remontId, data, onSetDates, isLoading, setIsLoading }: IProps) => {
  const { userData, remontLogic, toast, changeJobFieldPromise, jobsLogic } = useContext(MainContext)
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
  const handleSubmit = () => {
    // console.log(dates)
    // console.log(dates[0].toISOString())
    // console.log(dates[1].toISOString())
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

  const [files, setFiles] = useState<any[]>([])
  // const [fileUrls, setFileUrls] = useState<any>(null)

  const addFile = (fs: any) => {
    setFiles((s) => [...s, ...fs]);
  };
  const handleAddFile = (arr: any[]) => {
    addFile(arr)
  }
  const removeFile = (testedPath: string) => {
    // console.log(testedPath)
    setFiles((fs) => fs.filter(({ file }) => file.path !== testedPath));
  };
  const handleDeleteFile = (arg: any) => {
    const {
      file: { path },
    } = arg;
    removeFile(path);
  }
  // --- ASSING FILES
  const [cookies] = useCookies(['jwt'])
  const joblist = useMemo(() => jobsLogic?.jobs || [], [jobsLogic])
  const handleAssignFiles = useCallback((formats) => {
    // console.log('TODO: assign ids')
    // console.log(fileUrls)

    changeJobFieldPromise(data._id, 'add@imagesUrls', formats)()
      .then(() => {
        // console.log(data)
        if (!!data.imagesUrls) {
          setIsLoading(true)
          httpClient.updateMedia(remontId, joblist, cookies?.jwt)
            .finally(() => {
              setIsLoading(false)
            })
          // .then(() => { setFileUrls(null); })
        }
      })
  }, [
    // fileUrls, setFileUrls,
    JSON.stringify(data),
    JSON.stringify(joblist),
    setIsLoading,
  ])
  // ---
  const handleUploadFiles = useCallback(async () => {
    // if (files.length === 0) { console.log('No files'); return; }
    setIsLoading(true)

    const res = await httpClient.uploadFiles(files)
      .then((d) => {
        toast('Ok', { appearance: 'success' })
        return d;
      })
      .catch((err) => {
        toast(typeof err === 'string' ? err : err?.message || 'Sorry', { appearance: 'error' })
        return err
      })

    setIsLoading(false)

    // console.log(res)
    /* ARRAY like this:
    [{
      __v: 0
      _id: "5fc273520b3cf8c9f2c4c069"
      createdAt: "2020-11-28T15:57:06.787Z"
      ext: ".png"
      formats: Object { thumbnail: {…}, large: {…}, medium: {…}, … }
      hash: "Snimok_ekrana_ot_2020_10_20_18_46_46_ee2ded8957"
      height: 472
      id: "5fc273520b3cf8c9f2c4c069"
      mime: "image/png"
      name: "Снимок экрана от 2020-10-20 18-46-46.png"
      provider: "local"
      related: Array []
      size: 700.51
      updatedAt: "2020-11-28T15:57:06.787Z"
      url: "/uploads/Snimok_ekrana_ot_2020_10_20_18_46_46_ee2ded8957.png"
      width: 1042
    }]
    */

    if (Array.isArray(res)) {
      setFiles([])
      console.log(res)
      try {
        const formats = res.map(({ formats }) => formats)
        // setFileUrls(formats)
        handleAssignFiles(formats)
      } catch (err) {
        console.log(err)
      }
    }
  }, [
    JSON.stringify(files),
    setFiles,
    // setFileUrls,
    handleAssignFiles,
    setIsLoading,
  ])

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
      <div className={classes.paper}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Collabsible
              title='Итог'
              contentRenderer={() => (
                <>
                  <Typography gutterBottom variant="body2" color="textSecondary">
                    Цена за работу: {getPrettyPrice(data.priceJobs)}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="textSecondary">
                    Цена за материалы: {getPrettyPrice(data.priceMaterials)}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="textSecondary">
                    Цена за доставку: {getPrettyPrice(data.priceDelivery)}
                  </Typography>
                </>
              )}
            />
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
          <Grid item>
            <Collabsible
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
                        onClick={handleSubmit}
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
          {!!data.comment && (
            <Grid item xs={12}>
              <Collabsible
                title='Комментарий'
                isOpenedByDefault
                contentRenderer={() => (
                  <div>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {data.comment || 'No comment'}
                    </Typography>
                  </div>
                )}
              />
            </Grid>
          )}
          {!!data.description && (
            <Grid item xs={12} className="job-description-markdown">
              <Collabsible
                title='Описание'
                contentRenderer={() => (
                  <Markdown
                    source={data.description}
                    className={classes.description}
                  />
                )}
              />
            </Grid>
          )}
          {/* https://next.material-ui-pickers.dev/demo/daterangepicker
          <Grid item>
            <div className={classes.title}><b>Dates</b></div>
            <pre>{JSON.stringify(data.dateStart)}</pre>
          </Grid>
          */}
          {
            isOwner && (
              <>
                <Grid item xs={12} className={classes.dropZoneWrapper}>
                  <DropzoneAreaBase
                    // Icon={BackupIcon}
                    filesLimit={5}
                    maxFileSize={50 * 1024 * 1024}
                    onAdd={handleAddFile}
                    // onDrop={handleAdd}
                    onDelete={handleDeleteFile}
                    showPreviewsInDropzone={true}
                    showAlerts={false}
                    // onAlert={this.onDropzoneAlert}
                    fileObjects={files}
                    dropzoneText="Загрузите или перетащите файл в выделенную область в формате .jpg или .png"
                    dropzoneClass="smartprice-dropzone"
                    acceptedFiles={[
                      // 'application/msword',
                      'image/jpeg',
                      'image/png',
                      // 'image/bmp',
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  {
                    files.length > 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleUploadFiles}
                        // disabled={isSubmitDisabled}
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
                        Upload files
                      </Button>
                    )
                  }
                  {/*
                    !!fileUrls && fileUrls.length > 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleAssignFiles}
                        // disabled={isSubmitDisabled}
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
                        Assign files
                      </Button>
                    )
                  */}
                </Grid>
              </>
            )
          }
          {
            !!data.imagesUrls && data.imagesUrls.length > 0 && (
              <Grid item className={classes.galleryWrapper}>
                <div className={classes.title}>
                  <b>Фото ({data.imagesUrls.length})</b>
                </div>
                <ImageGallery items={data.imagesUrls.map(({ large, medium, thumbnail, small }: any) => ({
                  original: !!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : `${apiUrl}${small.url}`,
                  thumbnail: `${apiUrl}${thumbnail.url}`
                }))} />
              </Grid>
            )
          }
        </Grid>
      </div>
    </LocalizationProvider>
  )
}
