import React from 'react'
import {
  // BrowserRouter,
  HashRouter,
} from 'react-router-dom'
import { Routes } from '~/routes'
import { SiteLayout } from '~/common/mui/SiteLayout'

function App() {
  return (
    <HashRouter>
      <SiteLayout>
        <Routes />
      </SiteLayout>
    </HashRouter >
  )
}

export default App
