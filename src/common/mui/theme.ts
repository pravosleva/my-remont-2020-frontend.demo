import red from '@material-ui/core/colors/red'
import {
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles'
// import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
// See also: https://material-ui.com/guides/typescript/#customization-of-theme

// Like this: https://github.com/mui-org/material-ui/blob/master/examples/create-react-app-with-typescript/src/theme.tsx
// See also: https://material-ui.com/ru/styles/basics/
export const defaultTheme = {
  palette: {
    primary: {
      light: '#757ce8',
      main: '#22577a',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
    svyaznoy: {
      main: '#4c1e87',
      yellow: '#ffc800',

      // Fake:
      light: '#757ce8',
      dark: '#002884',
      contrastText: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
}

export const { breakpoints: { values: { md } } } = defaultTheme

export const GlobalCss = withStyles((theme) => ({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiButton-root': {
      outline: 'none !important',
      userSelect: 'none !important',
    },
    // See also: https://material-ui.com/ru/customization/components/
    code: {
      background: 'rgba(250, 239, 240, 0.78)',
      // boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
      color: '#b44437',
      padding: '3px 4px',
      borderRadius: '5px',
      margin: '0 1px',
      fontSize: '0.9em',
      fontWeight: '500',
      letterSpacing: '0.3px',
    },
    body: {
      overflowX: 'hidden',
    },
    a: {
      color: theme.palette.primary.main,
    },
    h1: {
      margin: theme.spacing(4, 0, 4, 0),
    },
    blockquote: {
      fontSize: '1em',
      maxWidth: '100%',
      borderRadius: '4px',
      margin: '10px auto 20px auto',
      fontFamily: 'Open Sans',
      fontStyle: 'italic',
      color: '#555555',
      padding: '1.2em 30px 1.2em 45px',
      borderLeft: '8px solid #78c0a8',
      borderLeftColor: theme.palette.primary.main,
      lineHeight: 1.6,
      position: 'relative',
      background: '#ededed',
      '&::before': {
        fontFamily: 'Arial',
        content: 'open-quote',
        color: theme.palette.primary.main,
        fontSize: '4em',
        position: 'absolute',
        left: '10px',
        top: '-10px',
      },
    },
  },
}))(() => null)

export const theme = createMuiTheme(defaultTheme)
