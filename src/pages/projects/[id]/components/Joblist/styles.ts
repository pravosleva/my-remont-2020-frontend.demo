import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
// import grey from '@material-ui/core/colors/grey'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: '700px',
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        color: 'red',
      },
    },
    heading: {
      // fontSize: theme.typography.pxToRem(15),
      flexBasis: '50%',
      flexShrink: 0,
    },
    details: {
      // color: grey[600],
      padding: theme.spacing(1),
      // paddingLeft: theme.spacing(2),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    disabled: {
      opacity: '0.4',
    },
  })
)
