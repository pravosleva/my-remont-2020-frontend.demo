import React, { useState, memo } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import Icon from '@mdi/react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

interface IProps {
  contentRenderer: React.FC<any>
  title: string
  isOpenedByDefault?: boolean
}

const _Collabsible = ({ title, contentRenderer, isOpenedByDefault }: IProps): any => {
  const classes = useStyles()
  const [isOpened, setIsOpened] = useState<boolean>(isOpenedByDefault || false)
  const handleToggle = () => {
    setIsOpened((s: boolean) => !s)
  }

  return (
    <div className={classes.wrapper}>
      <div className={clsx(classes.titleBox, { [classes.marginBottomIfOpened]: isOpened })} onClick={handleToggle}>
        <div>{isOpened ? <Icon path={mdiChevronUp} size={0.7} /> : <Icon path={mdiChevronDown} size={0.7} />}</div>
        <div>
          <b>{title}</b>
        </div>
      </div>
      {isOpened && contentRenderer({})}
    </div>
  )
}

export const Collabsible = memo(_Collabsible)
