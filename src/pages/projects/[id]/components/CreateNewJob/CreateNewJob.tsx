import React from 'react'
import {
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
} from '@material-ui/core'
import { IState as ICreateJobState } from '~/pages/projects/[id]/createNewProjectReducer'
import { useStyles } from './styles'
import SaveIcon from '@material-ui/icons/Save'
import Slide from '@material-ui/core/Slide'
import { useWindowSize } from 'react-use'

const TransitionUp = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="up" ref={ref} {...props} />
})
// const TransitionRight = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="right" ref={ref} {...props} />;
// });
// const TransitionLeft = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="left" ref={ref} {...props} />;
// });

export const CreateNewJob = ({
  isOpened,
  name,
  comment,
  onChangeField,
  onSave,
  onClose,
  isLoading,
}: ICreateJobState & {
  onChangeField: (field: string, value: string) => void
  onClose: () => void
  isLoading?: boolean
  onSave: () => void
}) => {
  const classes = useStyles()
  const { width } = useWindowSize()

  return (
    <Dialog
      open={isOpened}
      // onClose={() => {}}
      scroll="paper"
      aria-labelledby="scroll-dialog-title_NEW_JOB"
      fullWidth={width > 767}
      fullScreen={width <= 767}
      maxWidth="md"
      // @ts-ignore
      TransitionComponent={TransitionUp}
    >
      <DialogTitle id="scroll-dialog-title_NEW_JOB">{name || 'Новая работа'}</DialogTitle>
      <DialogContent dividers={true} className={classes.dialogContent}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name_NEW_JOB"
                label="Название"
                type="text"
                variant="outlined"
                value={name}
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeField('name', e.target.value)
                }}
                // TODO: Use Formik
                // error={!name}
                helperText={!name ? 'Поле не может быть пустым' : undefined}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="comment_NEW_JOB"
                label="Коментарий"
                multiline
                rows={4}
                type="text"
                variant="outlined"
                value={comment}
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeField('comment', e.target.value)
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small" variant="contained" color="secondary" disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={onSave}
          // variant="contained"
          variant="contained"
          color="primary"
          size="small"
          disabled={isLoading || !name}
          endIcon={
            isLoading ? <CircularProgress size={20} color="primary" style={{ marginLeft: 'auto' }} /> : <SaveIcon />
          }
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
