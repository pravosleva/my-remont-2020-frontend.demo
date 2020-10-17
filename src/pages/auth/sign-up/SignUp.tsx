import React, { useContext } from 'react'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { validShape } from './yup'
import { validateEmail, isCiryllic } from '~/utils/validators'
import { useStyles } from './styles'
import { Link } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'

interface IValues {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export const SignUp = () => {
  const classes = useStyles()
  const { toast, isUserDataLoading, isUserDataLoaded } = useContext(MainContext)

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            password2: '',
          }}
          validate={(values: IValues) => {
            const errors: Partial<IValues> = {};

            if (!values.username) {
              errors.username = 'Введите имя пользователя'
            } else if (isCiryllic(values.username)) {
              errors.username = 'Только латиница'
            }
            // isCiryllic
            if (!values.password) {
              errors.password = 'Введите пароль'
            } else if (isCiryllic(values.password)) {
              errors.password = 'Присутствует кириллица'
            }
            if (values.password2 !== values.password) {
              errors.password2 = 'Пароли должны совпадать'
            } else if (isCiryllic(values.password2)) {
              errors.password2 = 'Присутствует кириллица'
            }

            return errors;
          }}
          validationSchema={validShape}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false)
              toast('Функционал в разработке', { appearance: 'warning' })
            }, 500)
          }}
          validateOnChange
          validateOnBlur
        >
          {({
            submitForm,
            isSubmitting,
            errors,
            // setFieldValue,
            // values,
            // ...rest,
            // isValidating,
            // submitCount,
            isValid,
            touched
          }) => (
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form className={classes.form}>
                  <Field
                    component={TextField}
                    name="username"
                    type="text"
                    label="Username"
                    error={!!errors.username && touched.username}
                    helperText={errors.username}
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                  />
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email"
                    error={!!errors.email && touched.email}
                    validate={validateEmail}
                    helperText={errors.email}
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                  />
                  <Field
                    component={TextField}
                    name="password"
                    type="text"
                    label="Пароль"
                    error={!!errors.password && touched.password}
                    helperText={errors.password}
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                  />
                  <Field
                    component={TextField}
                    name="password2"
                    type="text"
                    label="Повторите пароль"
                    error={!!errors.password2 && touched.password2}
                    helperText={errors.password2}
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                  />
                  {isSubmitting && (
                    <LinearProgress style={{ marginBottom: '20px' }} />
                  )}
                  <div>
                    <Button
                      disabled={!isValid || isSubmitting || Object.keys(touched).length === 0 || isUserDataLoading || isUserDataLoaded}
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                      fullWidth
                      endIcon={
                        (isSubmitting || isUserDataLoading) && (
                          <CircularProgress
                            size={20}
                            color="primary"
                            style={{ marginLeft: 'auto' }}
                          />
                        )
                      }
                    >
                      Зарегистрироваться
                    </Button>
                  </div>
                </Form>
              </Grid>
            </Grid>
          )}
        </Formik>
        <Link to="/auth/login">
          Авторизация
        </Link>
      </div>

    </Container>
  );
};
