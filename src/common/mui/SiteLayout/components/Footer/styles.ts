import { makeStyles } from '@material-ui/core/styles'
// import red from '@material-ui/core/colors/red'
// import green from '@material-ui/core/colors/green'
// import indigo from '@material-ui/core/colors/indigo'
// import grey from '@material-ui/core/colors/grey'

export const useStyles = makeStyles((theme) => ({
  bg: {
    // backgroundColor: grey[500],
    backgroundColor: theme.palette.primary.main,
    color: '#FFF',
  },
  content: {
    // maxWidth: '1000px',
    margin: '0 auto',
    padding: theme.spacing(1, 0, 1, 0),
  },
}))
