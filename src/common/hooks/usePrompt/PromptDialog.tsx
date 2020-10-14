import React, { useState, useCallback, useMemo } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

export const PromptDialog = ({
  open,
  options,
  onCancel,
  onConfirm,
  onClose,
}) => {
  const {
    title,
    description,
    confirmationText,
    cancellationText,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
    type,
    onChange,
    value,
    label,
  } = options

  return (
    <Dialog fullWidth {...dialogProps} open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}
        <TextField
          value={value}
          id={`standard-basic_${type}`}
          label={label}
          onChange={onChange}
          fullWidth
          type={type}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button {...cancellationButtonProps} onClick={onCancel} color="secondary">
          {cancellationText}
        </Button>
        <Button
          color="primary"
          {...confirmationButtonProps}
          onClick={onConfirm}
        >
          {confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
