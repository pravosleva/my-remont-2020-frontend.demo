import * as React from 'react'
import { DialogProps } from '@material-ui/core/Dialog'
import { ButtonProps } from '@material-ui/core/Button'
// import { TextFieldProps } from '@material-ui/core/TextField';

export interface PromptOptions {
  title?: React.ReactNode
  type: 'text' | 'number'
  description?: React.ReactNode
  label: 'string'
  confirmationText?: React.ReactNode
  cancellationText?: React.ReactNode
  dialogProps?: DialogProps
  confirmationButtonProps?: ButtonProps
  cancellationButtonProps?: ButtonProps
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface PromptProviderProps {
  defaultOptions?: PromptOptions
}

export const PromptProvider: React.ComponentType<PromptProviderProps>

export const usePrompt: () => (options?: PromptOptions) => Promise<void>
