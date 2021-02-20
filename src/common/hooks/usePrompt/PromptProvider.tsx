/* eslint-disable */

import React, {
  useState,
  useCallback,
  Fragment,
  useMemo,
  useEffect,
} from 'react'
import { PromptContext } from './PromptContext'
import { PromptDialog } from './PromptDialog'

const DEFAULT_OPTIONS = {
  title: 'Are you sure?',
  type: 'text',
  description: '',
  confirmationText: 'Ok',
  cancellationText: 'Cancel',
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
}

const buildOptions = (defaultOptions, options) => {
  const dialogProps = {
    ...(defaultOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
    ...(options.dialogProps || {}),
  }
  const confirmationButtonProps = {
    ...(defaultOptions.confirmationButtonProps ||
      DEFAULT_OPTIONS.confirmationButtonProps),
    ...(options.confirmationButtonProps || {}),
  }
  const cancellationButtonProps = {
    ...(defaultOptions.cancellationButtonProps ||
      DEFAULT_OPTIONS.cancellationButtonProps),
    ...(options.cancellationButtonProps || {}),
  }

  return {
    ...DEFAULT_OPTIONS,
    ...defaultOptions,
    ...options,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
  }
}

export const PromptProvider: React.FC<any> = ({ children, defaultOptions = {} }) => {
  const [options, setOptions] = useState({
    ...DEFAULT_OPTIONS,
    ...defaultOptions,
  })
  const [resolveReject, setResolveReject] = useState([])
  const [resolve, reject] = resolveReject

  const prompt = useCallback(
    (options = {}) => {
      // console.log(options)
      return new Promise((resolve, reject) => {
        setOptions(buildOptions(defaultOptions, options))
        setResolveReject([resolve, reject])
      })
    },
    [
      setResolveReject,
      resolve,
      reject,
      setOptions,
      buildOptions,
      defaultOptions,
    ]
  )

  const defaultValue = useMemo(() => (options.type === 'number' ? 0 : ''), [
    options.type,
  ])
  const [value, setValue] = useState<string | number>(defaultValue)
  // --- Derty hack
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue, setValue])
  // ---
  const resetForm = useCallback(() => {
    setValue(defaultValue)
  }, [setValue, defaultValue])
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (options.type === 'number') {
        setValue(Number(e.target.value))
      } else {
        setValue(e.target.value)
      }
    },
    [options.type, setValue]
  )

  const handleClose = useCallback(() => {
    setResolveReject([])
    resetForm()
  }, [])

  const handleCancel = useCallback(() => {
    reject()
    handleClose()
    resetForm()
  }, [reject, handleClose])

  const handleConfirm = useCallback(() => {
    resolve(value)
    handleClose()
    resetForm()
  }, [value, resolve, handleClose, resetForm])

  return (
    <Fragment>
      <PromptContext.Provider value={prompt}>{children}</PromptContext.Provider>
      <PromptDialog
        open={resolveReject.length === 2}
        options={{
          onChange: handleChange,
          value,
          type: options.type,
          ...options,
        }}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        // @ts-ignore
        // type={type}
        // // @ts-ignore
        // onChange={handleChange}
        // value={value}
      />
    </Fragment>
  )
}
