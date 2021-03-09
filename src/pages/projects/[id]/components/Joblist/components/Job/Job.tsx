import React, { useMemo, useEffect, useState, useCallback } from 'react'
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
import {useCustomToastContext, useMainContext, useUserAuthContext } from '~/common/hooks'
import { Collabsible } from './components/Collabsible'
import { httpClient } from '~/utils/httpClient'
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { useCookies } from 'react-cookie'
// import ImageGallery from 'react-image-gallery';
// import Lightbox from 'react-lightbox-component'
import { getApiUrl } from '~/utils/getApiUrl'
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"
import slugify from 'slugify'

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
  const { remontLogic, changeJobFieldPromise, jobsLogic } = useMainContext()
  const { toast } = useCustomToastContext()
  const { userData } = useUserAuthContext()
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
  const [fileUrls, setFileUrls] = useState<any>(null)

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

    return changeJobFieldPromise(data._id, 'add@imagesUrls', formats)()
  }, [
    // fileUrls, setFileUrls,
    JSON.stringify(data),
    setIsLoading,
  ])
  // ---
  const handleUploadFiles = useCallback(async () => {
    // if (files.length === 0) { console.log('No files'); return; }
    setIsLoading(true)

    const res = await httpClient.uploadFiles(files, cookies?.jwt)
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
      setFileUrls(res)
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  }, [
    // remontId,
    // JSON.stringify(data),
    JSON.stringify(files),
    setFiles,
    setFileUrls,
    // handleAssignFiles,
    setIsLoading,
    // joblist,
    cookies?.jwt,
  ])
  // const { isDesktop } = useWindowSize()

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
      <div className={classes.paper}>
        <Grid container direction="column" spacing={2}>
          {
            !!data.imagesUrls && data.imagesUrls.length > 0 && (
              <Grid item className={classes.galleryWrapper}>
                {/* <div className={classes.title}><b>Фото ({data.imagesUrls.length})</b></div> */}
                {/* <ImageGallery
                  items={data.imagesUrls.map(({ large, medium, thumbnail, small }: any) => ({
                    original: !!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : `${apiUrl}${small.url}`,
                    thumbnail: `${apiUrl}${thumbnail.url}`
                  }))}
                /> */}
                {/* <div className={classes.lightboxWrapper}>
                  <Lightbox
                    // images={[
                    //   { src: 'some image url', title: 'image title', description: 'image description' }
                    // ]}
                    images={data.imagesUrls.map(({ large, medium, thumbnail, small }: any) => ({
                      // src: isDesktop ? (!!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : `${apiUrl}${small.url}`) : `${apiUrl}${thumbnail.url}`,
                      src: !!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : `${apiUrl}${small.url}`,
                      // thumbnail: `${apiUrl}${thumbnail.url}`,
                      title: data.name,
                      description: data.comment || 'No comment',
                    }))}
                  />
                </div> */}
                <SimpleReactLightbox>
                  <div className={classes.srLWrapperLayout}>
                <SRLWrapper
                  options={{
                    settings: {
                      // overlayColor: "rgb(25, 136, 124)",
                    },
                    caption: {
                      captionAlignment: 'start',
                      captionColor: '#FFFFFF',
                      captionContainerPadding: '20px 0 30px 0',
                      captionFontFamily: 'inherit',
                      captionFontSize: 'inherit',
                      captionFontStyle: 'inherit',
                      captionFontWeight: 'inherit',
                      captionTextTransform: 'inherit',
                      showCaption: true
                    },
                    buttons: {
                      showDownloadButton: false,
                      showAutoplayButton: false,
                      // backgroundColor: 'rgba(30,30,36,0.8)',
                      // backgroundColor: 'rgb(25, 136, 124)',
                      backgroundColor: '#556cd6',
                      iconColor: 'rgba(255, 255, 255, 1)',
                      iconPadding: '10px',
                    },
                    thumbnails: {
                      showThumbnails: true,
                      thumbnailsAlignment: 'center',
                      thumbnailsContainerBackgroundColor: 'transparent',
                      thumbnailsContainerPadding: '0',
                      thumbnailsGap: '0 1px',
                      thumbnailsIconColor: '#ffffff',
                      thumbnailsOpacity: 0.4,
                      thumbnailsPosition: 'bottom',
                      thumbnailsSize: ['100px', '80px']
                    },
                    progressBar:{
                      backgroundColor: '#f2f2f2',
                      fillColor: '#000000',
                      height: '3px',
                      showProgressBar: true
                    },
                    translations: {}, // PRO ONLY
                    icons: {} // PRO ONLY
                  }}
                >
                  {
                    data.imagesUrls.map(({ large, medium, thumbnail, small }: any) => {
                      const src = !!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : `${apiUrl}${small.url}`
                      return (
                        <a href={src} key={`${src}_${slugify(data.comment)}`}>
                          <img src={src} alt={data.comment || 'No comment'} />
                        </a>
                      )
                    })
                  }
                  </SRLWrapper></div>
                  </SimpleReactLightbox>
              </Grid>
            )
          }
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
                {
                  files.length > 0 && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          handleUploadFiles()
                            .then(res => {
                              // console.log(res)
                              if (Array.isArray(res)) {
                                const formats = res.map(({ formats }) => formats)

                                setFiles([])
                                handleAssignFiles(formats)
                              }
                            })
                            .catch(err => {
                              toast(err?.message || '#2 Что-то пошло не так', { appearance: 'error' })
                            })
                        }}
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
                    </Grid>
                  )
                }
                {
                  !!fileUrls && fileUrls?.length > 0 && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          // console.log(data)
                          try {
                            if (!!data.imagesUrls) {
                              setIsLoading(true)
                              httpClient.updateMedia(remontId, joblist, cookies?.jwt)
                                .then(() => {
                                  setFileUrls(null)
                                })
                                .finally(() => {
                                  setIsLoading(false)
                                })
                            }
                          } catch (err) {
                            toast(err?.message || '#1 Что-то пошло не так', { appearance: 'error' })
                          }
                        }}
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
                    </Grid>
                  )
                }
              </>
            )
          }
          {!!data.comment && (
            <Grid item xs={12}>
              {/* <Collabsible
                title='Комментарий'
                isOpenedByDefault
                contentRenderer={() => (
                  <div>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {data.comment}
                    </Typography>
                  </div>
                )}
              /> */}
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {data.comment}
              </Typography>
            </Grid>
          )}

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
        </Grid>
      </div>
    </LocalizationProvider>
  )
}
