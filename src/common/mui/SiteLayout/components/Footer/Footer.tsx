import React from 'react'
import { useStyles } from './styles'
import { Container } from '@material-ui/core'

export const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.bg}>
      <Container maxWidth='md'>
        <div className={classes.content}>{new Date().getFullYear()} Footer</div>
      </Container>
    </div>
  )
}
