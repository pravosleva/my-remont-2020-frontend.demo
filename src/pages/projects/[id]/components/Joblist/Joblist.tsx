import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { Job } from './components/Job'
import { IJob } from '~/common/context/MainContext'
import { IProps } from './interfaces'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button as MuiButton,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  withStyles,
  Typography,
  Grid,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useStyles } from './styles'
import clsx from 'clsx'
import { useCustomToastContext, useMainContext, useUserAuthContext, useDebouncedCallback } from '~/common/hooks'
import { useCookies } from 'react-cookie'
import { getApiUrl } from '~/utils/getApiUrl'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import MarkdownIt from 'markdown-it'
import MDEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Slide from '@material-ui/core/Slide'
import { useConfirm } from 'material-ui-confirm'
import { usePrompt } from '~/common/hooks/usePrompt'
import { useWindowSize } from 'react-use'
import { HttpError } from '~/utils/errors/http'
import { useRouter } from '~/common/hooks/useRouter'
import buildUrl from 'build-url'
import { httpErrorHandler } from '~/utils/errors/http/fetch'
import useDynamicRefs from 'use-dynamic-refs'
import { scrollTo } from '~/utils/scrollTo'
import { getDifference } from '~/utils/getDifference'
import Icon from '@mdi/react'
import { mdiDelete } from '@mdi/js'
import { useBaseStyles } from '~/common/mui/baseStyles'

// NOTE: See also: Настраиваемый аккордеон
// https://material-ui.com/ru/components/accordion/#customized-accordions

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
// See also: https://markdown-it.github.io/markdown-it/
// https://github.com/HarryChen0506/react-markdown-editor-lite/blob/HEAD/docs/configure.md
const mdParser = new MarkdownIt({
  html: false,
  langPrefix: 'language-',
})
const TransitionUp = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="up" ref={ref} {...props} />
})
// const TransitionRight = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="right" ref={ref} {...props} />;
// });
// const TransitionLeft = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="left" ref={ref} {...props} />;
// });

const Button = withStyles((theme) => ({
  root: {
    // paddingTop: theme.spacing(1),
  },
}))(MuiButton)

const apiUrl = getApiUrl()
const getUniqueKey = (data: IJob): string => {
  return `${data._id}_${data.payed}_${data.priceDelivery}_${data.priceJobs}_${data.priceMaterials}`
}

export const Joblist = ({ remontId, removeJob }: IProps) => {
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  const {
    changeJobFieldPromise,
    // jobsLogic,
    remontLogic,
    // updateJoblist,
    updateRemont,
    filterState,
    // removeJobPromise,
    onSelectAll,
  } = useMainContext()
  const { toast } = useCustomToastContext()
  const { userData } = useUserAuthContext()
  // --
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [getRef, setRef] =  useDynamicRefs();
  const [isAbsolutePreloaderActive, setIsAbsolutePreloaderActive] = useState<boolean>(false)
  const handleChangeAccoddionItem = (panelName: string, id: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setIsAbsolutePreloaderActive(true)
    setExpanded(isExpanded ? panelName : false)
    // console.log(panelName, id)
    if (!!id) setTimeout(() => {
      scrollTo(getRef(id), false)
      setIsAbsolutePreloaderActive(false)
    }, 100)
  }
  // --
  const isOwner: boolean = useMemo(() => remontLogic?.isOwner(userData?.id), [
    remontLogic,
    userData,
  ])
  // useEffect(() => {
  //   console.log(remontLogic?.joblist)
  // }, [JSON.stringify(remontLogic?.joblist)])
  const joblist = useMemo(() => remontLogic?.jobsLogic?.joblist || [], [JSON.stringify(remontLogic?.jobsLogic)])
  const [openedEditorId, setOpenedEditorId] = useState<string | null>(null)
  const handleOpenEditor = useCallback(
    (id: string) => () => {
      setOpenedEditorId(id)
      setOpenedMarkdownEditorId(null)
    },
    [setOpenedEditorId]
  )
  const handleCloseEditor = useCallback(() => {
    setOpenedEditorId(null)
  }, [setOpenedEditorId])
  const [openedMarkdownEditorId, setOpenedMarkdownEditorId] = useState<
    string | null
  >(null)
  const handleOpenMarkdownEditor = useCallback(
    (id: string) => () => {
      setOpenedEditorId(null)
      setOpenedMarkdownEditorId(id)
    },
    [setOpenedEditorId, setOpenedMarkdownEditorId]
  )
  const handleCloseMarkdownEditor = useCallback(() => {
    setOpenedMarkdownEditorId(null)
  }, [setOpenedMarkdownEditorId])
  // const descriptionElementRef = useRef<HTMLElement>(null)
  const [cookies] = useCookies(['jwt'])
  const accessToken = useMemo(() => cookies.jwt, [cookies.jwt])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [localMD, setLocalMD] = useState<string>('')
  useEffect(() => {
    const targetJob = joblist.find(({ _id }) => _id === openedMarkdownEditorId)
    if (!!targetJob) setLocalMD(targetJob.description)
  }, [openedMarkdownEditorId, joblist])
  const debouncedUpdateJoblist = useDebouncedCallback(
    (openedMarkdownEditorId, text, changeJobFieldPromise) => {
      // localMD -> joblist
      changeJobFieldPromise(openedMarkdownEditorId, 'description', text)()
    },
    500
  )
  const router = useRouter()
  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    window
      .fetch(`${apiUrl}/remonts/${remontId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ joblist }),
      })
      .then(httpErrorHandler)
      // .then((res) => res.json())
      .then((data) => {
        if (!!data.id) {
          // TODO: Set filter by all!
          setIsLoading(false)
          handleCloseEditor()
          handleCloseMarkdownEditor()
          if (!!data?.joblist && Array.isArray(data.joblist)) {
            // updateJoblist(data.joblist)
            updateRemont(data)
            toast('Успешно', { appearance: 'success' })
            return
          }
        }
        throw new Error('Fuckup')
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err.message)
        if (err instanceof HttpError && err.resStatus === 401) {
          const url = buildUrl('/', {
            path: 'auth/login',
            // hash: 'contact',
            queryParams: {
              from: `/projects/${remontId}`,
            },
          })
          router.history.push(url)
        }
      })
  }, [
    router,
    setIsLoading,
    remontId,
    accessToken,
    joblist,
    handleCloseEditor,
    handleCloseMarkdownEditor,
    // updateJoblist,
    updateRemont,
    toast,
  ])
  const confirm = useConfirm()

  // const handleDoneJob = useCallback(
  //   (id, checked) => {
  //     confirm({
  //       title: 'Статус работы',
  //       description: `Статус будет изменен на ${
  //         checked ? '"Выполнено"' : '"Незавершено"'
  //       }. Ok?`,
  //     })
  //       .then(() => {
  //         changeJobFieldPromise(id, 'isDone', checked)()
  //           // .then(handleSubmit)
  //           // .catch((msg) => { throw new Error(msg) })
  //       })
  //       .catch((err) => {
  //         toast(err?.message || 'handleDoneJob: Declined', {
  //           appearance: 'error',
  //         })
  //       })
  //   },
  //   [handleSubmit, changeJobFieldPromise]
  // )
  const isItemExpanded = (id: string) => expanded === `panel${id}`
  const displayedJoblist = useMemo(() => {
    switch (filterState.selectedGroup) {
      case 'isDone':
        return joblist.filter(({ isDone, isStarted }) => isStarted && isDone)
      case 'inProgress':
        return joblist.filter(({ isDone, isStarted }) => !isDone && isStarted)
      case 'all':
      default:
        return joblist
    }
  }, [joblist, filterState.selectedGroup])
  const prompt = usePrompt()
  // priceJobs:
  const handleAddPriceJobs = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за работу',
        type: 'number',
        title: 'Добавить сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceJobs', initPrice + value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleAddPriceJobs: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  const handleRemovePriceJobs = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за работу',
        type: 'number',
        title: 'Вычесть сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceJobs', initPrice - value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleRemovePriceJobs: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  // priceMaterials:
  const handleAddPriceMaterials = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за материалы',
        type: 'number',
        title: 'Добавить сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceMaterials', initPrice + value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleAddPriceMaterials: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  const handleRemovePriceMaterials = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за материалы',
        type: 'number',
        title: 'Вычесть сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceMaterials', initPrice - value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleRemovePriceMaterials: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  // priceDelivery:
  const handleAddPriceDelivery = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за доставку',
        type: 'number',
        title: 'Добавить сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceDelivery', initPrice + value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleAddPriceDelivery: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  const handleRemovePriceDelivery = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Ценник за доставку',
        type: 'number',
        title: 'Вычесть сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'priceDelivery', initPrice - value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleRemovePriceDelivery: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  // payed:
  const handleAddPayed = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Оплачено',
        type: 'number',
        title: 'Добавить сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'payed', initPrice + value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleAddPayed: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  const handleRemovePayed = useCallback(
    (id, initPrice) => () => {
      prompt({
        label: 'Оплачено',
        type: 'number',
        title: 'Вычесть сумму',
      })
        .then((value: number) => {
          changeJobFieldPromise(id, 'payed', initPrice - value)()
            // .then(handleSubmit)
            // .catch((msg) => { throw new Error(msg) })
        })
        .catch((err) => {
          toast(err?.message || 'handleRemovePayed: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast]
  )
  const { width } = useWindowSize()
  const handleSetDates = useCallback(
    (id, plannedStartDate, plannedFinishDate, realFinishDate) => () => {
      changeJobFieldPromise(id, 'plannedStartDate', plannedStartDate)()
        .then(() => {
          changeJobFieldPromise(id, 'plannedFinishDate', plannedFinishDate)()
            .then(() => {
              changeJobFieldPromise(id, 'realFinishDate', realFinishDate)()
                .then(handleSubmit)
                .catch((msg) => {
                  // console.log(msg)
                  toast(msg || 'realFinishDate: Declined', {
                    appearance: 'error',
                  })
                })
            })
            .catch((msg) => {
              // console.log(msg)
              toast(msg || 'plannedFinishDate: Declined', {
                appearance: 'error',
              })
            })
        })
        .catch((msg) => {
          // console.log(msg)
          toast(msg || 'plannedStartDate: Declined', {
            appearance: 'error',
          })
        })
    },
    [prompt, changeJobFieldPromise, toast, handleSubmit]
  )
  const handleDeleteJob = useCallback(
    (data: IJob) => {
      if (!!data.imagesUrls ?? data.imagesUrls?.length > 0) {
        toast('Сначала нужно удалить все изображения, прикрепленные к данной работе (TODO: dev roadmap)', { appearance: 'error' })
      } else {
        confirm({
          title: <span style={{ color: 'red' }}>Работа будет удалена. Ok?</span>,
          description: data.name,
        })
          .then(() => {
            removeJob(data._id)
          })
          .catch((err) => {
            toast(err?.message || 'handleDeleteJob: Declined', {
              appearance: 'error',
            })
          })
      }
    },
    [removeJob]
  )

  return (
    <>
      {displayedJoblist.length > 0 && (
        <>
          {isAbsolutePreloaderActive && (
            <div className={baseClasses.fixedPreloader}>
              <CircularProgress
                size={20}
                color="primary"
              />
            </div>
          )}
          {displayedJoblist.map((data, i) => (
            <React.Fragment key={data._id}>
              <Accordion
                className={clsx({
                  [classes.disabled]: data.isDone && !isItemExpanded(data._id),
                })}
                key={data._id}
                expanded={expanded === `panel${data._id}`}
                onChange={handleChangeAccoddionItem(`panel${data._id}`, data._id)}
                // @ts-ignore
                ref={setRef(data._id)}
                TransitionProps={{
                  timeout: 0
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${data._id}bh-content`}
                  id={`panel${data._id}bh-header`}
                >
                  {
                    <Typography
                      className={clsx({
                        [classes.greyText]: !data.isStarted,
                        [classes.dangerText]:
                          data.isStarted && data.payed - (data.priceMaterials + data.priceJobs) <
                          0,
                        [classes.successText]:
                          data.isStarted && data.payed - (data.priceMaterials + data.priceJobs) >=
                          0,
                      })}
                    >
                      {isOwner && <><span style={{ marginRight: '8px' }}>⚙️</span>{(data.isStarted && !data.isDone) && <span className='price'>({getPrettyPrice(getDifference(data))})</span>}</>} {data.name}
                    </Typography>
                  }
                </AccordionSummary>
                <Divider />
                <AccordionDetails className={classes.details}>
                  <Job
                    data={data}
                    key={getUniqueKey(data)}
                    onSetDates={handleSetDates}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    remontId={remontId}
                  />
                </AccordionDetails>
                {isOwner && (
                  <>
                    <Divider />
                    <AccordionActions>
                      <Button
                        onClick={() => handleDeleteJob(data)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        disabled={isLoading}
                        endIcon={<Icon path={mdiDelete} size={0.8} />}
                        style={{ marginRight: 'auto' }}
                      >
                        DEL
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleOpenMarkdownEditor(data._id)}
                        endIcon={<EditIcon />}
                      >
                        Edit md
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleOpenEditor(data._id)}
                        endIcon={<EditIcon />}
                      >
                        Edit values
                      </Button>
                    </AccordionActions>
                  </>
                )}
                {/* DIALOG FOR MARKDOWN */}
                <Dialog
                  open={openedMarkdownEditorId === data._id}
                  onClose={handleCloseEditor}
                  scroll="paper"
                  aria-labelledby={`scroll-dialog-md-title_${data._id}`}
                  fullWidth={width > 767}
                  fullScreen={width <= 767}
                  maxWidth="lg"
                  // @ts-ignore
                  TransitionComponent={TransitionUp}
                >
                  <DialogTitle id={`scroll-dialog-md-title_${data._id}`}>
                    {data.name}
                  </DialogTitle>
                  <DialogContent
                    dividers={true}
                    className={classes.dialogMDContent}
                  >
                    <MDEditor
                      value={localMD}
                      style={{ minHeight: width > 767 ? '450px' : '300px' }}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={({ text }) => {
                        // if (!!text) changeJobFieldPromise(data._id, 'description', text)()
                        setLocalMD(text)
                        debouncedUpdateJoblist(
                          data._id,
                          text,
                          changeJobFieldPromise
                        )
                      }}
                      config={{
                        view: { menu: false, md: true, html: width > 767 },
                        canView: {
                          menu: false,
                          md: true,
                          html: width > 767,
                          fullScreen: true,
                          hideMenu: true,
                        },
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseMarkdownEditor}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      // variant="contained"
                      variant="outlined"
                      color="primary"
                      size="small"
                      disabled={isLoading}
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
                      Сохранить
                    </Button>
                  </DialogActions>
                </Dialog>
                {/* DIALOG FOR VALUES */}
                <Dialog
                  fullWidth={width > 767}
                  fullScreen={width <= 767}
                  open={openedEditorId === data._id}
                  onClose={handleCloseEditor}
                  scroll="paper"
                  aria-labelledby={`scroll-dialog-values-title_${data._id}`}
                >
                  <DialogTitle id={`scroll-dialog-values-title_${data._id}`} className={classes.truncate}>
                    {data.name || 'Title'}
                  </DialogTitle>
                  <DialogContent dividers={true}>
                    {/*
                      {
                        "__component": "job.job",
                        "isDone": false,
                        "isStarted": false,
                        "payed": 25000,
                        "priceJobs": 10000,
                        "priceMaterials": 12332,
                        "priceDelivery": 0,
                        "_id": "5f7901e014e0008700d02545",
                        "price": 0,
                        "name": "Замена батарей",
                        "createdAt": "2020-10-03T22:57:36.559Z",
                        "updatedAt": "2020-10-05T21:53:21.693Z",
                        "__v": 0,
                        "comment": "Пока ждем информацию по ценам от ЖЭК",
                        "description": "- 5.10 - Озвучена цена за работу: 5000 за одну батарею (**=10 000 Р** за две)\n- 5.10 - Съездили в магазин с Кудратом, ценник за материалы: **=12 332 Р** за батареи с комплектацией (8 секц. + 4 секц.)",
                        "id": "5f7901e014e0008700d02545"
                      }
                    */}
                    <Grid
                      container
                      direction="column"
                      spacing={0}
                      className={classes.inputsBox}
                    >
                      <Grid item xs={12}>
                        <TextField
                          id={`name_${data._id}`}
                          label="Название"
                          type="text"
                          variant="outlined"
                          value={data.name}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'name',
                              e.target.value
                            )()
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id={`comment_${data._id}`}
                          label="Комментарий"
                          type="text"
                          variant="outlined"
                          multiline
                          rows={4}
                          value={data.comment}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'comment',
                              e.target.value
                            )()
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} style={{ marginBottom: '10px' }}>
                        <TextField
                          id={`priceJobs_${data._id}`}
                          label="Ценник за работу"
                          type="number"
                          // variant="outlined"
                          value={data.priceJobs}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'priceJobs',
                              Number(e.target.value)
                            )()
                          }}
                          fullWidth
                          // disabled={true}
                        />
                      </Grid>
                      <Grid item className={classes.buttonsWrapper}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleAddPriceJobs(data._id, data.priceJobs)}
                          // endIcon={<EditIcon />}
                        >
                          Добавить сумму
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleRemovePriceJobs(
                            data._id,
                            data.priceJobs
                          )}
                          // endIcon={<EditIcon />}
                        >
                          Вычесть сумму
                        </Button>
                      </Grid>
                      <Grid item xs={12} style={{ marginBottom: '10px' }}>
                        <TextField
                          id={`priceMaterials_${data._id}`}
                          label="Ценник за материалы"
                          type="number"
                          // variant="outlined"
                          value={data.priceMaterials}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'priceMaterials',
                              Number(e.target.value)
                            )()
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item className={classes.buttonsWrapper}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleAddPriceMaterials(
                            data._id,
                            data.priceMaterials
                          )}
                          // endIcon={<EditIcon />}
                        >
                          Добавить сумму
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleRemovePriceMaterials(
                            data._id,
                            data.priceMaterials
                          )}
                          // endIcon={<EditIcon />}
                        >
                          Вычесть сумму
                        </Button>
                      </Grid>
                      <Grid item xs={12} style={{ marginBottom: '10px' }}>
                        <TextField
                          id={`priceDelivery_${data._id}`}
                          label="Ценник за доставку"
                          type="number"
                          // variant="outlined"
                          value={data.priceDelivery}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'priceDelivery',
                              Number(e.target.value)
                            )()
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item className={classes.buttonsWrapper}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleAddPriceDelivery(
                            data._id,
                            data.priceDelivery
                          )}
                          // endIcon={<EditIcon />}
                        >
                          Добавить сумму
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleRemovePriceDelivery(
                            data._id,
                            data.priceDelivery
                          )}
                          // endIcon={<EditIcon />}
                        >
                          Вычесть сумму
                        </Button>
                      </Grid>
                      <Grid item xs={12} style={{ marginBottom: '10px' }}>
                        <TextField
                          id={`payed_${data._id}`}
                          label="Оплачено"
                          type="number"
                          variant="outlined"
                          value={data.payed}
                          size="small"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            changeJobFieldPromise(
                              data._id,
                              'payed',
                              Number(e.target.value)
                            )()
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item className={classes.buttonsWrapper}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleAddPayed(data._id, data.payed)}
                          // endIcon={<EditIcon />}
                        >
                          Добавить сумму
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleRemovePayed(data._id, data.payed)}
                          // endIcon={<EditIcon />}
                        >
                          Вычесть сумму
                        </Button>
                      </Grid>
                      <div className={classes.checkboxWrapper}>
                        <FormControl
                          component="fieldset"
                          className={classes.formControl}
                        >
                          <FormGroup>
                            <FormControl
                              component="fieldset"
                              className={classes.formControl}
                            >
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      checked={data.isStarted}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        changeJobFieldPromise(
                                          data._id,
                                          'isStarted',
                                          e.target.checked
                                        )()
                                          .then(() => {
                                            onSelectAll()
                                          })
                                          .catch((err) => {
                                            console.log(err)
                                          })
                                      }}
                                      name="isStarted"
                                    />
                                  }
                                  label="Работы были начаты"
                                />
                              </FormGroup>
                            </FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={data.isDone}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    changeJobFieldPromise(
                                      data._id,
                                      'isDone',
                                      e.target.checked
                                    )()
                                      .then(() => {
                                        onSelectAll()
                                      })
                                      .catch((err) => {
                                        console.log(err)
                                      })
                                  }}
                                  name="isDone"
                                />
                              }
                              label="Работы завершены"
                            />
                          </FormGroup>
                        </FormControl>
                      </div>
                      <h3
                        className={clsx({
                          [classes.dangerText]:
                            data.payed -
                              (data.priceMaterials + data.priceJobs) <
                            0,
                          [classes.successText]:
                            data.payed -
                              (data.priceMaterials + data.priceJobs) >=
                            0,
                        })}
                      >
                        Остаток:{' '}
                        {getPrettyPrice(
                          data.payed - (data.priceMaterials + data.priceJobs)
                        )}
                      </h3>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseEditor}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      // variant="contained"
                      variant="outlined"
                      color="primary"
                      size="small"
                      disabled={isLoading}
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
                      Сохранить
                    </Button>
                  </DialogActions>
                </Dialog>
              </Accordion>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  )
}
