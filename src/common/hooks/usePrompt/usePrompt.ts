import { useContext } from 'react'
import { PromptContext } from './PromptContext'

export const usePrompt = () => useContext(PromptContext)
