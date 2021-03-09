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
// import { ToastProvider } from 'react-toast-notifications'
import { NotifsContextProvider } from '~/common/context'
import 'react-notifications-component/dist/theme.css'
// preferred way to import (from `v4`). Uses `animate__` prefix.
import 'animate.css/animate.min.css'
// import 'react-lightbox-component/build/css/index.css'


const REACT_APP_SOCKET_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT

function App() {
  const [socket] = useSocket(REACT_APP_SOCKET_ENDPOINT, {
    autoConnect: true,
    //any other options
  })

  return (
    <HashRouter>
      <NotifsContextProvider>
          <SiteLayout socket={socket}>
            <Routes />
          </SiteLayout>
      </NotifsContextProvider>
    </HashRouter>
  )
}

export default App
