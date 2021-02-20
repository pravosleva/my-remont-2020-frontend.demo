import { makeStyles } from '@material-ui/core/styles'
// import red from '@material-ui/core/colors/red'
// import green from '@material-ui/core/colors/green'
// import indigo from '@material-ui/core/colors/indigo'
// import grey from '@material-ui/core/colors/grey'
import { breadCrumbsHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    // maxWidth: '1000px',
    // padding: theme.spacing(0, 2, 0, 2),
    margin: '0 auto',
    height: `${breadCrumbsHeight}px`,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSide: {},
  leftSide: {
    marginLeft: 'auto',
  },
  muted: {
    opacity: '0.5',
  },
}))
