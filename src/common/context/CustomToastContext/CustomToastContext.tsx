import React from 'react'
import { createContext, useContext } from 'react'
import { useToasts } from 'react-toast-notifications'

type TCustomToastContext = {
  toast: (
    msg: string,
    opts: { appearance: 'success' | 'error' | 'info' | 'warning' }
  ) => void
}

const CustomToastContext = createContext<TCustomToastContext>({
  toast: () => {
    throw new Error('toast method should be implemented')
  },
})

export const CustomToastContextProvider: React.FC<any> = ({ children }: any) => {
  const { addToast } = useToasts()

  return (
    <CustomToastContext.Provider
      value={{
        toast: addToast,
      }}
    >
      {children}
    </CustomToastContext.Provider>
  )
}

export const useCustomToastContext = () => useContext(CustomToastContext)
