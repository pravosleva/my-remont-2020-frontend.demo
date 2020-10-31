import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsWrapper: {
      zIndex: 1,
      display: 'flex',
      // flexWrap: 'wrap',
      justifyContent: 'flex-end',
      '& > button:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
      position: 'sticky',
      top: '0px',
      '& > button.inactive': {
        backgroundColor: '#FFF',
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
