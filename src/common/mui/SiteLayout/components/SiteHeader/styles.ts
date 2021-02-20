import { makeStyles } from '@material-ui/core/styles'
// import red from '@material-ui/core/colors/red'
// import green from '@material-ui/core/colors/green'
// import indigo from '@material-ui/core/colors/indigo'
// import grey from '@material-ui/core/colors/grey'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // maxWidth: '1000px',
    margin: '0 auto',
    // padding: theme.spacing(0, 2, 0, 2),
  },
  rightSide: {
    marginLeft: 'auto',
  },
  muted: {
    opacity: '0.5',
  },
}))
