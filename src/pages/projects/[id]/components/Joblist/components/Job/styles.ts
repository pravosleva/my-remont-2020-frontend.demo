import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(0, 1, 0, 1),
  },
  dangerText: {
    color: red[500],
  },
  successText: {
    color: green[500],
  },
}))
