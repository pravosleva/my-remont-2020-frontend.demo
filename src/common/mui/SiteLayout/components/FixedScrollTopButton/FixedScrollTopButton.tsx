import React, { useRef, useCallback } from 'react'
import {
  useScrollPosition,
  IWindowDims,
} from '~/common/hooks/useScrollPosition'
import clsx from 'clsx'
import { useStyles } from './styles'
import { scrollTop } from '~/utils/scrollTo'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export const FixedScrollTopButton = () => {
  const [, isMoreThan2Screens]: [IWindowDims, boolean] = useScrollPosition();
  const classes = useStyles()
  const ref = useRef(null)
  const handleClick = useCallback(() => {
    scrollTop()
  }, [])

  return (
    <>
      {typeof window !== 'undefined' && (
        <div
          ref={ref}
          onClick={handleClick}
          className={clsx(classes.main, { [classes.isRequired]: isMoreThan2Screens })}
        >
          <KeyboardArrowUpIcon color='action' />
        </div>
      )}
    </>
  );
};
