import { red } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
  redText: {
    color: 'red',
  },
  greenText: {
    color: 'green',
  },
}))
