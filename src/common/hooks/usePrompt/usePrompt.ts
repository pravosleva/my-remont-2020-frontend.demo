import { useContext } from 'react'
import { PromptContext } from './PromptContext'

export const usePrompt = () => {
  const prompt = useContext(PromptContext)
  return prompt
}
