import React from 'react'
import { IJob, Job } from './components/Job'

interface IProps {
  joblist: IJob[]
}

export const Joblist = ({ joblist }: IProps) => {
  return (
    <>
      {joblist.length > 0 && (
        <div>
          {
            joblist.map((data) => <Job key={data.id} data={data} />)
          }
        </div>
      )}
    </>
  )
}