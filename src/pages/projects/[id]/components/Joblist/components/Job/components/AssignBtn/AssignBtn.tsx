import React, { useEffect, useRef } from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'

interface IProps {
  click: () => void
  isLoading: boolean
}

export const AssignBtn = ({ click, isLoading }: IProps) => {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    console.log('Assign btn: cDM')
    try {
      if (!!ref?.current) ref.current.click()
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <>
      <Button
        ref={ref}
        fullWidth
        variant="contained"
        color="primary"
        onClick={click}
        disabled={isLoading}
        endIcon={
          isLoading ? (
            <CircularProgress
              size={20}
              color="inherit"
              style={{ marginLeft: 'auto' }}
            />
          ) : (
            <SaveIcon />
          )
        }
      >
        Assign files
      </Button>
    </>
  )
}
