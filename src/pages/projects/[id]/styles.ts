import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsWrapper: {
      display: 'flex',
      // flexWrap: 'wrap',
      justifyContent: 'flex-end',
      '& > button:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
  })
)
