import React, { createContext, useContext } from 'react'
import { ReactNotificationOptions as IReactNotificationOptions } from 'react-notifications-component'
import {
  addInfoNotif as _addInfoNotif,
  addSuccessNotif as _addSuccessNotif,
  addDangerNotif as _addDangerNotif,
  addDefaultNotif as _addDefaultNotif,
  addWarningNotif as _addWarningNotif,
} from './addNotif'
// import { useToasts } from 'react-toast-notifications'
import ReactNotification from 'react-notifications-component'
import { useWindowSize } from '~/common/hooks'

type TOpts = {
  appearance: 'success' | 'error' | 'info' | 'warning'
}
type TCustomToastContext = {
  toast: (msg: string, opts: TOpts) => void
}

// const CustomToastContext = createContext<TCustomToastContext>({
//   toast: () => {
//     throw new Error('toast method should be implemented')
//   },
// })
export const NotifsContext = createContext<TCustomToastContext>({
  toast: () => {
    throw new Error('toast method should be implemented')
  },
})

// export const CustomToastContextProvider: React.FC<any> = ({ children }: any) => {
//   const { addToast } = useToasts()

//   return (
//     <CustomToastContext.Provider
//       value={{
//         toast: addToast,
//       }}
//     >
//       {children}
//     </CustomToastContext.Provider>
//   )
// }

export const NotifsContextProvider = ({ children }: any) => {
  const { isMobile } = useWindowSize()
  // @ts-ignore
  // const isMobile = useMemo(() => (!!width ? width <= 767 : false), [width])
  // const addInfoNotif = (note: Partial<IReactNotificationOptions>) => {
  //   _addInfoNotif({ ...note })
  // }
  // const addSuccessNotif = (note: Partial<IReactNotificationOptions>) => {
  //   _addSuccessNotif(note)
  // }
  // const addDangerNotif = (note: Partial<IReactNotificationOptions>) => {
  //   _addDangerNotif(note)
  // }
  const addDefaultNotif = (note: Partial<IReactNotificationOptions>) => {
    _addDefaultNotif(note)
  }
  // const addWarningNotif = (note: Partial<IReactNotificationOptions>) => {
  //   _addWarningNotif(note)
  // }

  const toast = (msg: string, opts: TOpts) => {
    if (!opts.appearance) return

    addDefaultNotif({
      // title,
      type: opts.appearance === 'error' ? 'danger' : opts.appearance,
      message: msg,
      // dismiss: { duration: 10000 },
    })
  }

  return (
    <NotifsContext.Provider value={{ toast }}>
      <>
        <ReactNotification isMobile={isMobile} />
        {children}
      </>
    </NotifsContext.Provider>
  )
}

// export const useCustomToastContext = () => useContext(CustomToastContext)

export const useCustomToastContext = () => useContext(NotifsContext)
