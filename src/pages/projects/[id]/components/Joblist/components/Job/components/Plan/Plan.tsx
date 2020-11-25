import React, { useState } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'

interface IProps {
  contentRenderer: React.FC<any>
  title: string
}

export const Plan = ({ title, contentRenderer }: IProps): any => {
  const classes = useStyles()
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleToggle = () => {
    setIsOpened((s: boolean) => !s)
  }

  return (
    <div className={classes.wrapper}>
      <div className={clsx(classes.titleBox, { [classes.marginBottomIfOpened]: isOpened })} onClick={handleToggle}>
        <div><b>{title}</b></div>
        <div>{isOpened ? '(close)' : '(open)' }</div>
      </div>
      {
        isOpened && contentRenderer({})
      }
    </div>
  )
}
