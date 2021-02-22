import { useBaseStyles } from '~/common/mui/baseStyles'
import clsx from 'clsx'
import React from 'react'
import { Container } from '@material-ui/core'
import { useStyles } from './styles'

// const isDev = process.env.NODE_ENV === 'development'

type IProps = {
  isLimited?: boolean
  isPaddedMobile?: boolean
  style?: React.CSSProperties
  className?: any
  hasDesktopFrame?: boolean
}

export const ResponsiveBlock: React.FC<IProps> = ({ children, isLimited, isPaddedMobile, style, className, hasDesktopFrame }) => {
  const baseClasses = useBaseStyles()
  const classes = useStyles()

  switch (true) {
    case isLimited && !isPaddedMobile && !hasDesktopFrame:
    case isLimited && !isPaddedMobile:
      return (
        <Container style={style} maxWidth='md' className={clsx(classes.responsiveBlock, baseClasses.centered, className)}>{children}</Container>
      )
    case isLimited && hasDesktopFrame:
      return (
        <Container style={style} maxWidth='md' className={clsx(classes.responsiveBlock, baseClasses.centered, baseClasses.noPaddedMobile, className)}>
          {children}
        </Container>
      )
    default:
      return (
        <div
          style={style}
          // maxWidth='md'
          className={
            clsx(classes.responsiveBlock,
              {
                [baseClasses.isPaddedMobile]: isPaddedMobile,
              },
              className
            )}
        >
          {children}
        </div>
      )
  }
}
