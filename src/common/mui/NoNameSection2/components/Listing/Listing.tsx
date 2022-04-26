import React from 'react'
import { data } from './data'
import { useStyles } from './styles'

export const Listing = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      {data.map(({ title, description }) => (
        <div key={`${title}_${description}`} className={classes.itemWrapper}>
          <div className={classes.title}>{title}</div>
          <div className={classes.dashBox}>
            <div className={classes.dash} />
          </div>
          <div className={classes.description}>{description}</div>
        </div>
      ))}
    </div>
  )
}
