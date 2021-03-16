import { makeStyles } from '@material-ui/core/styles'

export const contentBottomMargin = 50
export const breadCrumbsHeight = 37
export const siteHeaderHeight = {
  desktop: 60,
  // TODO: mobile
}

export const useBaseStyles = makeStyles((theme) => ({
  redBox: {
    border: '1px dashed red',
  },
  centered: {
    margin: '0 auto',
  },
  isPaddedMobile: {
    [theme.breakpoints.up('lg')]: {
      // padding: theme.spacing(1, 3, 1, 3),
      border: '1px solid red',
      // paddingLeft: '14px !important',
      // paddingRight: '14px !important',
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 2, 1, 2),
      border: '1px dashed red',
      // paddingLeft: '14px !important',
      // paddingRight: '14px !important',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: theme.spacing(1, 3, 1, 3),
      // border: '1px dashed green',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 2, 1, 2),
    },
  },
  noPaddedMobile: {
    [theme.breakpoints.down('xs')]: {
      padding: '0px !important',
    },
  },
  desktopFrameInternalBox: {
    color: 'blue',
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(1, 2, 1, 2),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 2, 1, 2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: theme.spacing(1, 3, 1, 3),
      // border: '1px dashed green',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 2, 1, 2),
    },
  },
  isRounded: {
    borderRadius: '4px',
  },
  isRoundedDesktop: {
    [theme.breakpoints.up('sm')]: {
      borderRadius: '4px',
    },
  },

  standardJobInternalBox: {
    // Etc.
  },
  fixedPreloader: {
    zIndex: 2,
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '20px',
    backgroundColor: 'transparent',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperAsGrid: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      '& > div:not(:last-child)': {
        marginBottom: '20px',
      }
    },
    [theme.breakpoints.up('sm')]: {
      display: 'grid',
      columnGap: '20px',
      rowGap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    },
  },
  subWrapper: {
    '& > div:not(:last-child)': {
      marginBottom: '20px',
    },
  },
}))
