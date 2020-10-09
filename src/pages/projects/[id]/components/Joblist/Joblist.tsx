import React, { useCallback, useContext, useState, useRef } from 'react'
import { IJob, Job } from './components/Job'
import { IProps } from './interfaces'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Divider,
  TextField,
  CircularProgress,
  withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useStyles } from './styles'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'
import { Button as MuiButton } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useCookies } from 'react-cookie'
import { getApiUrl } from '~/utils/getApiUrl'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
// import MDEditor from '@uiw/react-md-editor'
import MarkdownIt from 'markdown-it'
import MDEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Slide from '@material-ui/core/Slide'

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

export const Joblist = ({ remontId, joblist: j }: IProps) => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const handleChangeAccoddionItem = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false)
  }
  const classes = useStyles()
  const {
    userData,
    changeJobField,
    joblist,
    updateJoblist,
    toast,
  } = useContext(MainContext)
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    window
      .fetch(`${apiUrl}/remonts/${remontId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.jwt}`,
        },
        body: JSON.stringify({ joblist }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (!!data.id) {
          setIsLoading(false)
          handleCloseEditor()
          handleCloseMarkdownEditor()
          if (
            !!data.joblist &&
            Array.isArray(data.joblist) &&
            data.joblist.length > 0
          ) {
            updateJoblist(data.joblist)
            toast('Ok', { appearance: 'success' })
            return
          }
        }
        throw new Error('Fuckup')
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err.message)
      })
  }, [remontId, cookies.jwt, joblist, handleCloseEditor, updateJoblist])

  return (
    <>
      {joblist.length > 0 && (
        <>
          {joblist.map((data, i) => (
            <React.Fragment key={data._id}>
              <Accordion
                className={clsx({ [classes.disabled]: data.isDone })}
                key={data._id}
                expanded={expanded === `panel${data._id}`}
                onChange={handleChangeAccoddionItem(`panel${data._id}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${data._id}bh-content`}
                  id={`panel${data._id}bh-header`}
                >
                  <b
                    className={clsx({
                      [classes.dangerText]:
                        data.payed - (data.priceMaterials + data.priceJobs) < 0,
                      [classes.successText]:
                        data.payed - (data.priceMaterials + data.priceJobs) >=
                        0,
                    })}
                  >
                    {data.name}
                  </b>
                </AccordionSummary>
                <Divider />
                <AccordionDetails className={classes.details}>
                  <Job data={data} key={getUniqueKey(data)} />
                </AccordionDetails>
                {!!userData && (
                  <>
                    <Divider />
                    <AccordionActions>
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
                  aria-labelledby={`scroll-dialog-title_${data._id}`}
                  fullScreen
                  // @ts-ignore
                  TransitionComponent={TransitionUp}
                >
                  <DialogTitle id={`scroll-dialog-title_${data._id}`}>
                    {data.name}
                  </DialogTitle>
                  <DialogContent
                    dividers={true}
                    className={classes.dialogMDContent}
                  >
                    <MDEditor
                      value={data.description}
                      style={{ minHeight: '300px' }}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={({ text }) => {
                        // console.log('handleEditorChange', html, text)
                        if (!!text) {
                          changeJobField(data._id, 'description', text)()
                        }
                      }}
                      config={{
                        view: { menu: false, md: true, html: false },
                        canView: {
                          menu: false,
                          md: true,
                          html: false,
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
                  fullWidth
                  open={openedEditorId === data._id}
                  onClose={handleCloseEditor}
                  scroll="paper"
                  aria-labelledby={`scroll-dialog-title_${data._id}`}
                >
                  <DialogTitle id={`scroll-dialog-title_${data._id}`}>
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
                    <div className={classes.inputsBox}>
                      <TextField
                        id={`name_${data._id}`}
                        label="Название"
                        type="text"
                        variant="outlined"
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(data._id, 'name', e.target.value)()
                        }}
                      />
                      <TextField
                        id={`comment_${data._id}`}
                        label="Комментарий"
                        type="text"
                        variant="outlined"
                        value={data.comment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(data._id, 'comment', e.target.value)()
                        }}
                      />
                      <TextField
                        id={`priceJobs_${data._id}`}
                        label="Ценник за работу"
                        type="number"
                        variant="outlined"
                        value={data.priceJobs}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(
                            data._id,
                            'priceJobs',
                            Number(e.target.value)
                          )()
                        }}
                      />
                      <TextField
                        id={`priceMaterials_${data._id}`}
                        label="Ценник за материалы"
                        type="number"
                        variant="outlined"
                        value={data.priceMaterials}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(
                            data._id,
                            'priceMaterials',
                            Number(e.target.value)
                          )()
                        }}
                      />
                      <TextField
                        id={`priceDelivery_${data._id}`}
                        label="Ценник за доставку"
                        type="number"
                        variant="outlined"
                        value={data.priceDelivery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(
                            data._id,
                            'priceDelivery',
                            Number(e.target.value)
                          )()
                        }}
                      />
                      <TextField
                        id={`payed_${data._id}`}
                        label="Оплачено"
                        type="number"
                        variant="outlined"
                        value={data.payed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(
                            data._id,
                            'payed',
                            Number(e.target.value)
                          )()
                        }}
                      />

                      <Divider />
                      <div className={classes.checkboxWrapper}>
                        <FormControl
                          component="fieldset"
                          className={classes.formControl}
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={data.isDone}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    changeJobField(
                                      data._id,
                                      'isDone',
                                      e.target.checked
                                    )()
                                  }}
                                  name="isDone"
                                />
                              }
                              label="Работы завершены"
                            />
                          </FormGroup>
                        </FormControl>
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
                                    changeJobField(
                                      data._id,
                                      'isStarted',
                                      e.target.checked
                                    )()
                                  }}
                                  name="isStarted"
                                />
                              }
                              label="Работы были начаты"
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
                    </div>
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
