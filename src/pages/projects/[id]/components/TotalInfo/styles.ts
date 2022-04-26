import { makeStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import indigo from '@material-ui/core/colors/indigo'
import grey from '@material-ui/core/colors/grey'

export const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
  dangerText: {
    color: red[500],
  },
  successText: {
    // color: green[500],
    // color: theme.palette.primary.main,
    color: 'rgb(34,87,122)',
  },
  infoText: {
    // color: indigo[500],
    color: theme.palette.primary.main,
  },
  secondaryText: {
    color: grey[500],
  },
}))
