import React from 'react'
import { useStyles } from './styles'

export const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.bg}>
      <div className={classes.content}>{new Date().getFullYear()} Footer</div>
    </div>
  )
}
