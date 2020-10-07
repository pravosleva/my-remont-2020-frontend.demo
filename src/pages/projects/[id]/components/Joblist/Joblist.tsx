import React, { useCallback, useContext, useState, useRef } from 'react'
import { IJob, Job } from './components/Job'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Divider,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useStyles } from './styles'
import clsx from 'clsx'
import { MainContext } from '~/common/context/MainContext'
import { Button } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useCookies } from 'react-cookie'
import { getApiUrl } from '~/utils/getApiUrl'

const apiUrl = getApiUrl()
interface IProps {
  joblist: IJob[]
  remontId: string
}
const getUniqueKey = (data: IJob): string => {
  return `${data._id}_${data.payed}_${data.priceDelivery}_${data.priceJobs}_${data.priceMaterials}`
}

export const Joblist = ({ remontId, joblist: j }: IProps) => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const handleChangeAccoddionItem = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const classes = useStyles()
  const { userData, changeJobField, joblist, updateJoblist } = useContext(MainContext)
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
          if (!!data.joblist && Array.isArray(data.joblist) && data.joblist.length > 0) {
            updateJoblist(data.joblist)
          }
          return
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
                  <b>{data.name}</b>
                </AccordionSummary>
                <Divider />
                <AccordionDetails className={classes.details}>
                  <Job data={data} key={getUniqueKey(data)} />
                </AccordionDetails>
                {!!userData && (
                  <>
                    <Divider />
                    <AccordionActions>
                      <Button size="small" onClick={handleOpenEditor(data._id)}>
                        Редактировать
                      </Button>
                    </AccordionActions>
                  </>
                )}
                <Dialog
                  open={openedEditorId === data._id}
                  onClose={handleCloseEditor}
                  scroll="paper"
                  aria-labelledby={`scroll-dialog-title_${data._id}`}
                >
                  <DialogTitle id={`scroll-dialog-title_${data._id}`}>{data.name}</DialogTitle>
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
                        id={`priceJobs_${data._id}`}
                        label="Ценник за работу"
                        type="number"
                        variant="outlined"
                        value={data.priceJobs}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(data._id, 'priceJobs', Number(e.target.value))()
                        }}
                      />
                      <TextField
                        id={`priceMaterials_${data._id}`}
                        label="Ценник за материалы"
                        type="number"
                        variant="outlined"
                        value={data.priceMaterials}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(data._id, 'priceMaterials', Number(e.target.value))()
                        }}
                      />
                      <TextField
                        id={`payed_${data._id}`}
                        label="Оплачено"
                        type="number"
                        variant="outlined"
                        value={data.payed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          changeJobField(data._id, 'payed', Number(e.target.value))()
                        }}
                      />
                      <Divider />
                      <h3
                        style={{
                          marginLeft: 'auto',
                          color: data.payed - (data.priceMaterials + data.priceJobs) < 0 ? 'red' : 'green',
                        }}
                      >
                        Остаток: {data.payed - (data.priceMaterials + data.priceJobs)}
                      </h3>
                    </div>
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
