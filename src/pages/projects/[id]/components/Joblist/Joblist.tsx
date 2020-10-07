import React, { useCallback, useContext, useState, useRef, useReducer } from 'react'
import { IJob, Job } from './components/Job'
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Divider, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useStyles } from './styles'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'
import { Button } from '@material-ui/core'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { reducer } from './reducer'
import { Input, CircularProgress } from '@material-ui/core'
import { useCookies } from 'react-cookie'
import { getApiUrl } from '~/utils/getApiUrl'

const apiUrl = getApiUrl()
interface IProps {
  joblist: IJob[]
  remontId: string
}

export const Joblist = ({ remontId, joblist: j }: IProps) => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const handleChangeAccoddionItem = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const classes = useStyles()
  const { userData } = useContext(MainContext)
  const [openedEditorId, setOpenedEditorId] = useState<string | null>(null)
  const handleOpenEditor = useCallback(
    (id: string) => () => {
      setOpenedEditorId(id)
    },
    [setOpenedEditorId]
  )
  const handleCloseEditor = useCallback(() => {
    setOpenedEditorId(null)
  }, [setOpenedEditorId])
  const descriptionElementRef = useRef<HTMLElement>(null)
  const [joblist, dispatch] = useReducer(reducer, j)
  const handleChangeJobField = useCallback(
    (id, fieldName: string, value: number) => () => {
      dispatch({ type: 'UPDATE_JOB_FIELD', id, fieldName, payload: value })
    },
    [dispatch]
  )
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
          return
        }
        throw new Error('Fuckup')
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err.message)
      })
  }, [handleCloseEditor, remontId, joblist])

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
                  <b>{data.name}</b>
                </AccordionSummary>
                <Divider />
                <AccordionDetails className={classes.details}>
                  <Job data={data} />
                </AccordionDetails>
                <Divider />
                <AccordionActions>
                  {!!userData && (
                    <Button size="small" onClick={handleOpenEditor(data._id)}>
                      Редактировать
                    </Button>
                  )}
                </AccordionActions>
                <Dialog
                  // key={data._id}
                  open={openedEditorId === data._id}
                  onClose={handleCloseEditor}
                  scroll="paper"
                  aria-labelledby={`scroll-dialog-title_${data._id}`}
                  aria-describedby={`scroll-dialog-description_${data._id}`}
                >
                  <DialogTitle id={`scroll-dialog-title_${data._id}`}>Edit</DialogTitle>
                  <DialogContent dividers={true}>
                    <DialogContentText
                      id={`scroll-dialog-description_${data._id}`}
                      ref={descriptionElementRef}
                      tabIndex={-1}
                    >
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
                      <Input
                        id={`payed_${data._id}`}
                        // label="Оплачено"
                        type="number"
                        // variant="outlined"
                        value={data.payed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChangeJobField(data._id, 'payed', Number(e.target.value))()
                        }}
                      />
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEditor} color="secondary">
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      color="primary"
                      endIcon={
                        isLoading && <CircularProgress size={20} color="primary" style={{ marginLeft: 'auto' }} />
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
