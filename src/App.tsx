import React, { useEffect } from 'react'
import {
  // BrowserRouter,
  HashRouter,
} from 'react-router-dom'
import { Routes } from '~/routes'
import { SiteLayout } from '~/common/mui/SiteLayout'
import { ToastProvider } from 'react-toast-notifications'
// See also: https://github.com/jossmac/react-toast-notifications
import useSocket from 'use-socket.io-client'
// import io from 'socket.io-client'

const REACT_APP_SOCKET_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT

function App() {
  const [socket] = useSocket(REACT_APP_SOCKET_ENDPOINT, {
    autoConnect: true,
    //any other options
  })

  useEffect(() => {
    console.log(socket)
  })

  return (
    <HashRouter>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={10000}
        // components={{ Toast: Snack }}
        placement="bottom-center"
      >
        <SiteLayout socket={socket}>
          <Routes />
        </SiteLayout>
      </ToastProvider>
    </HashRouter>
  )
}

export default App
