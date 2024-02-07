import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontWeight: 'bold',
      fontSize: '16px',

      // display: 'flex',
      // gap: '8px',
      // flexWrap: 'wrap',

      '& > *:not(:first-child)': {
        marginLeft: '8px',
      },
    },
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
        // marginRight: theme.spacing(3),
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
      // display: 'flex',
      // flexDirection: 'column',
      // '& > div:not(:last-child)': {
      //   marginBottom: theme.spacing(2),
      // },
    },
    // Checkbox:
    checkboxWrapper: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: '20px',
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
      // color: '#rgb(34,87,122)',
    },
    defaultText: {
      color: '#rgb(34,87,122)',
    },
    greyText: {
      color: grey[500],
    },
    buttonsWrapper: {
      // border: '1px dashed red',
      // marginLeft: 'auto',
      '& > *': { marginBottom: 0, },
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(1),
      },

      display: 'flex',
      alignItems: 'center',
    },
    dialogActionsWrapper: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    redChip: {
      color: '#FFF'
    },
    price: {
      whiteSpace: 'nowrap',
    },
  })
)
