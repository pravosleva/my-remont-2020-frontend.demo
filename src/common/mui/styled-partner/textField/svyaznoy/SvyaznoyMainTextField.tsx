import { withStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

export const SvyaznoyMainTextField = withStyles((theme: Theme & { palette : { svyaznoy: { main: string, contrastText: string } } }) => ({
  root: {
    // backgroundColor: theme.palette.svyaznoy.main,
    // margin: theme.spacing(2),
    // width: 400,
    // '& .MuiInputBase-root': { color: theme.palette.svyaznoy.contrastText },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        // borderColor: 'white',
        borderRadius: '8px',
      },
      // '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.svyaznoy.main,
      },
    },
    '& label.Mui-focused': {
      color: theme.palette.svyaznoy.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
  }
}))(TextField);
