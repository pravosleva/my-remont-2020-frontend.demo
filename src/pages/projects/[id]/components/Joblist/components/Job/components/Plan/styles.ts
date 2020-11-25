import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {},
  titleBox: {
    cursor: 'pointer',
    '&:hover': {
      color: '#3882C4',
    },

    display: 'flex',
    flexDirection: 'row',
    '& > div:not(:last-child)': {
      marginRight: '10px',
    },
  },
  marginBottomIfOpened: {
    marginBottom: '15px',
  },
}))
