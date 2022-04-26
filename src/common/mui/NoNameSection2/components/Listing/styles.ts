import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.up('md')]: {
      marginLeft: '65px',
      minWidth: '232px',
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '40px',
    },
    '& > div:not(:last-child)': {
      marginBottom: '35px',
    },

    display: 'flex',
    flexDirection: 'column',
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    // fontFamily: 'PT Sans',
    // fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '44px',
    lineHeight: '33px',
    color: '#FCBF2C',

    minWidth: '52px',
  },

  dashBox: {
    marginLeft: '15px',
  },
  dash: {
    width: '33px',
    borderBottom: '1px solid #FCBF2C',
  },

  description: {
    marginLeft: '23px',
    minWidth: '120px',
    whiteSpace: 'pre-wrap',

    // fontFamily: 'Fira Sans',
    // fontStyle: 'normal',
    // fontWeight: 'normal',
    // fontSize: '16px',
    // lineHeight: '20px',
  },
}))
