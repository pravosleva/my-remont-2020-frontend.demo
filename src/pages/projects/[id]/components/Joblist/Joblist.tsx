import React from 'react'
import { IJob, Job } from './components/Job'
import { Grid } from '@material-ui/core'

interface IProps {
  joblist: IJob[]
}

export const Joblist = ({ joblist }: IProps) => {
  return (
    <Grid container spacing={1}>
      {joblist.length > 0 && (
        <>
          {joblist.map((data) => (
            <Grid item xs={12} key={data._id}>
              <Job data={data} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  )
}
