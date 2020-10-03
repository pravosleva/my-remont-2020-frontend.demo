import React from 'react'
import { IJob } from './interfaces'

interface IProps {
  data: IJob
}

export const Job = ({ data }: IProps) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}