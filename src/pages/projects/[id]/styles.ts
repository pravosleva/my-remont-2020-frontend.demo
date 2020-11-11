import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const widgetWidthDesktop = 390
const widgetWidthMobile = 200
// const widgetTogglerWidthDesktop = 160
// const widgetTogglerWidthMobile = 160

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsWrapper: {
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

    // Widget:
    widgetPaper: {
      padding: theme.spacing(1),
      backgroundColor: '#FFF',
      [theme.breakpoints.up('md')]: {
        width: `${widgetWidthDesktop}px`,
      },
      [theme.breakpoints.down('sm')]: {
        width: `${widgetWidthMobile}px`,
      },
      borderRadius: '0 0 0 4px',

      position: 'relative',
    },
    fixedDesktopWidget: {
      position: 'fixed',
      top: '90px',
      right: '0px',
      transition: 'transform 0.2s linear',
      zIndex: 6,

      [theme.breakpoints.up('md')]: {
        transform: `translateX(${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        transform: `translateX(${widgetWidthMobile}px)`,
        // alignItems: 'flex-start',
        // '& > div:nth-child(2)': {
        //   width: '100%',
        // },
      },
    },
    openedWidget: {
      transform: 'translateX(0px)',
    },
    widgetTogglerBtn: {
      marginRight: '0px !important',
      position: 'absolute',
      top: '0px',
      right: '0px',
      boxShadow: 'none',

      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      [theme.breakpoints.up('md')]: {
        // width: `${widgetTogglerWidthDesktop}px`,
        // left: `-${widgetTogglerWidthDesktop}px`,
        transform: `translateX(-${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        // width: `${widgetTogglerWidthMobile}px !important`,
        // minWidth: `${widgetTogglerWidthMobile}px`,
        // left: `-${widgetTogglerWidthMobile}px`,
        transform: `translateX(-${widgetWidthMobile}px)`,
      },

      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: 'none',
      },
    },
  })
)
