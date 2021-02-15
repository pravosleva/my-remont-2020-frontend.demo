import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    truncate: {
      '& > h2': {
        whiteSpace: 'nowrap',
        width: '100%', // IE6 needs any width
        overflow: 'hidden', // "overflow" value must be different from  visible"
        // -o-text-overflow: 'ellipsis // Opera < 11
        textOverflow: 'ellipsis !important', // IE, Safari (WebKit), Opera >= 11, FF > 6
      },
    },
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
    checkbox: {
      '& .price': {
        whiteSpace: 'nowrap',
      },
    },
    // jobTitle: { margin: theme.spacing(0) },
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
    inputsBox: {
      display: 'flex',
      flexDirection: 'column',
      '& > div:not(:last-child)': {
        marginBottom: theme.spacing(2),
      },
    },
    // Checkbox:
    checkboxWrapper: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    formControl: {
      // marginTop: theme.spacing(1),
    },
    // Dialog:
    dialogMDContent: {
      padding: theme.spacing(0),
    },
    dangerText: {
      color: red[500],
    },
    successText: {
      color: green[500],
    },
    buttonsWrapper: {
      marginLeft: 'auto',
      '& > *': {
        marginBottom: theme.spacing(1),
      },
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
  })
)
