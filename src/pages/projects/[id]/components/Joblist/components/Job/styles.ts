import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  // Gallery 1: Lightbox
  lightboxWrapper: {
    marginTop: '10px',
    "& > .lightbox-container > img": {
      margin: '0 0 8px 0',
      objectFit: 'cover',
    },
    '& > .lightbox-container > img:not(:last-child)': {
      marginRight: '10px',
    },
  },
  // Gallery 2: SRLWrapper
  srLWrapperLayout: {
    // border: '1px solid red',
    '& > div': {
      // display: 'flex',
      // flexWrap: 'wrap',

      // GRID:
      display: 'grid',
      columnGap: '8px',
      rowGap: '8px',

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
      },
      // gridAutoRows: 'minmax(auto, auto)',
      gridAutoFlow: 'dense',
    },
    '& > div > a': {
      // width: '100%',
      // maxWidth: 'calc(33% - 1px)',
      // display: 'block',
      // height: 'auto',
      // margin: '0 0 1px 0',
      // borderRadius: '4px',

      // GRID ITEM:
      textDecoration: 'none',
      color: 'inherit',
      borderRadius: '8px',
      // [theme.breakpoints.up('md')]: { maxWidth: '265px' },
    },
    '& > div > a > img': {
      // border: '2px solid transparent',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '8px',
      transition: 'all 0.3s linear',
    },
    '& > div > a:hover > img': {
      boxShadow: '0px 5px 8px rgba(144, 164, 183, 0.6)',
      // border: '2px solid #FFF',
      // border: '2px solid #556cd6',
      // scale: 1.1,
    },
    '& > div > a:not(:last-child)': {
      marginRight: '1px',
    },
  },
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
      margin: '10px 0',
      padding: '5px 8px 5px 40px',
      // paddingTop: '5px',
      // paddingBottom: '5px',
      background: 'none repeat scroll 0 0 rgba(102,128,153,.05)',
      border: 'none',
      borderLeftColor: 'currentcolor',
      borderLeftStyle: 'none',
      borderLeftWidth: 'medium',
      color: '#333',
      borderLeft: '10px solid #d6dbdf !important',
      borderRadius: '4px',
    },
    '& blockquote::before': {
      fontFamily: 'Arial',
      content: 'open-quote',
      fontSize: '4em',
      fontStyle: 'italic',
      position: 'absolute',
      left: '8px',
      top: '-10px',
      color: '#d6dbdf',
    },
    '& blockquote span': {
      display: 'block',
      fontStyle: 'normal',
      fontWeight: 'bold',
      marginTop: '1em',
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
    // border: '1px solid red',
    // '& > div': { border: '1px solid red' },
    marginBottom: theme.spacing(1),
  },
}))
