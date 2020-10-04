import { createContext } from 'react'

interface IMainContext {
  projectName: string | null
  setProjectName: (name: string | null) => void
  resetProjectName: () => void
}

export const MainContext = createContext<IMainContext>({
  projectName: null,
  setProjectName: (_name: string | null) => {
    throw new Error('setProjectName method should be implemented')
  },
  resetProjectName: () => {
    throw new Error('resetProjectName method should be implemented')
  },
})
