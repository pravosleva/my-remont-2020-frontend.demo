import React, { useState } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import Icon from '@mdi/react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

interface IProps {
  contentRenderer: React.FC<any>
  title: string
}

export const Collabsible = ({ title, contentRenderer }: IProps): any => {
  const classes = useStyles()
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleToggle = () => {
    setIsOpened((s: boolean) => !s)
  }

  return (
    <div className={classes.wrapper}>
      <div className={clsx(classes.titleBox, { [classes.marginBottomIfOpened]: isOpened })} onClick={handleToggle}>
        <div><b>{title}</b></div>
        <div>{isOpened ? <Icon path={mdiChevronUp} size={0.7} /> : <Icon path={mdiChevronDown} size={0.7} /> }</div>
      </div>
      {
        isOpened && contentRenderer({})
      }
    </div>
  )
}
