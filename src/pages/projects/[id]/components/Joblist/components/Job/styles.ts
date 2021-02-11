import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: '15px',
  },
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    width: '100%',
    padding: theme.spacing(1),
  },
  dangerText: {
    color: red[500],
  },
  successText: {
    color: green[500],
  },
  description: {
    '& blockquote': {
      position: 'relative',
      margin: '16px 0',
      padding: '5px 8px 5px 30px',
      background: 'none repeat scroll 0 0 rgba(102,128,153,.05)',
      border: 'none',
      borderLeftColor: 'currentcolor',
      borderLeftStyle: 'none',
      borderLeftWidth: 'medium',
      color: '#333',
      borderLeft: '10px solid #d6dbdf !important',
    },
  },
  dropZoneWrapper: {
    '& .MuiDropzoneArea-root.smartprice-dropzone': {
      minHeight: 'unset',
    },
    '& .smartprice-dropzone > .MuiDropzoneArea-textContainer': {
      padding: '10px',
    },
    '& .MuiTypography-root.MuiTypography-h5.MuiDropzoneArea-text': {
      fontSize: '15px',
    },
    '& .MuiDropzonePreviewList-image': {
      objectFit: 'cover',
    },
    '& .MuiDropzoneArea-icon': {
      width: '35px',
      height: '35px',
    },
  },
  galleryWrapper: {
    maxWidth: '100%',
  },
}))
