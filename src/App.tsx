import React from 'react'
import {
  // BrowserRouter,
  HashRouter,
} from 'react-router-dom'
import { Routes } from '~/routes'
import { SiteLayout } from '~/common/mui/SiteLayout'
// See also: https://github.com/jossmac/react-toast-notifications
import useSocket from 'use-socket.io-client'
// import io from 'socket.io-client'
import 'react-image-gallery/styles/css/image-gallery.css'
import { ToastProvider } from 'react-toast-notifications'
import { CustomToastContextProvider } from '~/common/context'


const REACT_APP_SOCKET_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT

function App() {
  const [socket] = useSocket(REACT_APP_SOCKET_ENDPOINT, {
    autoConnect: true,
    //any other options
  })

  return (
    <HashRouter>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={10000}
        // components={{ Toast: Snack }}
        placement="bottom-center"
      >
        <CustomToastContextProvider>
          <SiteLayout socket={socket}>
            <Routes />
          </SiteLayout>
        </CustomToastContextProvider>
      </ToastProvider>
    </HashRouter>
  )
}

export default App
