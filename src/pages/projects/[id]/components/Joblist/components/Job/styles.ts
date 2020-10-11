import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

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
    color: green[500],
  },
  description: {
    '& blockquote': {
      // borderLeft: '2px solid lightgray',
      // paddingLeft: theme.spacing(1),
      // marginLeft: theme.spacing(1),
    }
  }
}))
