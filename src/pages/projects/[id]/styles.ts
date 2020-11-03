import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
    stickyBox: {
      zIndex: 5,
      position: 'sticky',
      top: '0px',
    },
    buttonsWrapper: {
      zIndex: 1,
      display: 'flex',
      // flexWrap: 'wrap',
      justifyContent: 'flex-end',
      '& > button:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
    circularProgressCentered: {
      display: 'flex',
      justifyContent: 'center',
    },
    desktopStickyInfoBox: {
      [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: '0px',
      },
    },
  })
)
