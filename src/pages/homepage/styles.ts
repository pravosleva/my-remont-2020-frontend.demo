import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,

      borderRadius: '4px',
      padding: '0px',
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    listItem: {
      cursor: 'pointer',
      '&:hover': {
        color: '#FFF',
        backgroundColor: theme.palette.primary.main,

        '& .MuiListItemText-secondary': {
          color: '#FFF !important',
        },
      },
    },

    redBox: {
      border: '1px solid red',
    },
  })
)
