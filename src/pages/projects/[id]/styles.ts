import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const widgetWidthDesktop = 340
const widgetWidthMobile = 200

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    widgetPaper: {
      padding: theme.spacing(1),
      backgroundColor: '#FFF',
      [theme.breakpoints.up('md')]: {
        width: `${widgetWidthDesktop}px`,
      },
      [theme.breakpoints.down('sm')]: {
        width: `${widgetWidthMobile}px`,
      },
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
    buttonsWrapper: {
      // zIndex: 1,
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        '& > button:not(:last-child)': {
          marginRight: theme.spacing(1),
        },
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        justifyContent: 'center',
        '& > button:not(:last-child)': {
          marginBottom: theme.spacing(1),
        },
      },
    },
    circularProgressCentered: {
      display: 'flex',
      justifyContent: 'center',
    },
    fixedDesktopWidget: {
      position: 'fixed',
      top: '90px',
      right: '0px',
      transition: 'transform 0.2s linear',
      zIndex: 6,

      display: 'flex',
      flexDirection: 'row',

      [theme.breakpoints.up('md')]: {
        transform: `translateX(${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        transform: `translateX(${widgetWidthMobile}px)`,
        alignItems: 'flex-start',
      },
    },
    openedWidget: {
      transform: 'translateX(0px)',
    },
    widgetTogglerBtn: {
      width: '80px',
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
    },
  })
)
