import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/App'
import * as serviceWorker from '~/serviceWorker'
import { CssBaseline } from '@material-ui/core'
import { GlobalCss, theme } from '~/common/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'
import './index.module.scss'
import './fix.simple-react-lightbox.scss'
// import './fix.thuncate.css'

ReactDOM.render(
  <>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <GlobalCss />
      <App />
    </ThemeProvider>
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
