import red from '@material-ui/core/colors/red'
import {
  createMuiTheme,
  ThemeOptions,
  Theme,
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
      // main: '#3f50b5', // Official
      main: '#556cd6',
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

export const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    // '.MuiButton-root': {}
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
      color: 'black',
    },
  },
})(() => null)

export const theme = createMuiTheme(defaultTheme)
