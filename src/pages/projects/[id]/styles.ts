import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsWrapper: {
      '& > button:not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    },
  })
)
