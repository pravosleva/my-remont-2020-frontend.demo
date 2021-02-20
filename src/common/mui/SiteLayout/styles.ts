import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: grey[100],
  },
  content: {
    minHeight: `calc(100vh - ${breadCrumbsHeight}px - ${siteHeaderHeight.desktop}px - ${contentBottomMargin}px)`,
    // padding: theme.spacing(1, 1, 4, 1),
    // maxWidth: '1000px',
    margin: '0 auto',
    marginBottom: `${contentBottomMargin}px`,
    // overflowY: 'auto',
  },
  breadcrumbs: {
    position: 'sticky',
    top: 0,

    backgroundColor: '#FFF',
    zIndex: 5,
    borderBottom: '1px solid lightgray',
  },
}))
