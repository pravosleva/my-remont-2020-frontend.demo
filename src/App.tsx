import React from 'react'
import {
  // BrowserRouter,
  HashRouter,
} from 'react-router-dom'
import { Routes } from '~/routes'
import { SiteLayout } from '~/common/mui/SiteLayout'
import { ToastProvider } from 'react-toast-notifications'
// See also: https://github.com/jossmac/react-toast-notifications

function App() {
  return (
    <HashRouter>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={10000}
        // components={{ Toast: Snack }}
        placement="bottom-center"
      >
        <SiteLayout>
          <Routes />
        </SiteLayout>
      </ToastProvider>
    </HashRouter>
  )
}

export default App
