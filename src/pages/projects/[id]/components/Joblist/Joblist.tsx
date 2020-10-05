import React from 'react'
import { IJob, Job } from './components/Job'
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Divider, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useStyles } from './styles'
import clsx from 'clsx'

interface IProps {
  joblist: IJob[]
}

export const Joblist = ({ joblist }: IProps) => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const handleChange = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const classes = useStyles()

  return (
    <>
      {joblist.length > 0 && (
        <>
          {joblist.map((data, i) => (
            <Accordion
              className={clsx({ [classes.disabled]: data.isDone })}
              key={data._id || i}
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i}bh-content`}
                id={`panel${i}bh-header`}
              >
                <b>{data.name}</b>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className={classes.details}>
                <Job data={data} />
              </AccordionDetails>
              {/*
              <Divider />
              <AccordionActions>
                <Button size="small" onClick={() => goToPage(path)}>
                  {t('READ_MORE')}
                </Button>
              </AccordionActions>
              */}
            </Accordion>
          ))}
        </>
      )}
    </>
  )
}
