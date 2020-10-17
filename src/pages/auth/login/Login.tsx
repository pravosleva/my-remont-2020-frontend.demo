import React, { useCallback, useState, useContext } from 'react'
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  // LinearProgress,
  Typography,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { useStyles } from './styles'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { getNormalizedInputs } from '~/utils/strapi/getNormalizedInputs'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'
import { httpErrorHandler } from '~/utils/errors/http/fetch'
import { Link } from 'react-router-dom'
import { validateEmail } from '~/utils/validators'
import { validShape } from './yup'

const apiUrl = getApiUrl()
const REACT_APP_COOKIE_MAXAGE_IN_DAYS = process.env
  .REACT_APP_COOKIE_MAXAGE_IN_DAYS
  ? parseInt(process.env.REACT_APP_COOKIE_MAXAGE_IN_DAYS)
  : 1

interface IValues {
  email: string
  password: string
}

export const Login = () => {
  const router = useRouter()
  const classes = useStyles()
  const [, setCookie] = useCookies(['jwt'])
  const { setUserData, toast, isUserDataLoading, isUserDataLoaded } = useContext(MainContext)
  const handleSubmit = useCallback(({ email, password }: IValues) => {
    const normalizedObj = getNormalizedInputs({ email, password })
    // const body = new FormData()

    // // @ts-ignore
    // body.append('identifier', normalizedObj.identifier)
    // // @ts-ignore
    // body.append('password', normalizedObj.password)

    return window
      .fetch(`${apiUrl}/auth/local`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedObj),
      })
      .then(httpErrorHandler) // res -> res.json()
      .then((data) => {
        if (!!data.jwt && !!data.user) {
          setCookie('jwt', data.jwt, {
            maxAge: REACT_APP_COOKIE_MAXAGE_IN_DAYS * 24 * 60 * 60,
          })
          setUserData(data.user)

          return Promise.resolve(data.user.username)
        }
        throw new Error('Fuckup')
      })

      .catch((err) => {
        console.log(err.message)
        return Promise.reject(err.message || 'Errored')
      })
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validShape}
          onSubmit={( values, { setSubmitting }) => {
            // setTimeout(() => {
            //   setSubmitting(false)
            //   alert(JSON.stringify(values, null, 2))
            // }, 500)
            handleSubmit(values)
              .then((msg: string) => {
                setSubmitting(false)
                toast(`Hello, ${msg}`, { appearance: 'success' })
                router.history.push('/projects')
              })
              .catch((msg: string) => {
                setSubmitting(false)
                toast(msg || 'Errored', { appearance: 'error' })
              })
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
                    type="password"
                    label="Пароль"
                    error={!!errors.password && touched.password}
                    helperText={errors.password}
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                  />
                  {/* isSubmitting && (
                    <LinearProgress style={{ marginBottom: '20px' }} />
                  ) */}
                  <div>
                    <Button
                      disabled={!isValid || isSubmitting || Object.keys(touched).length === 0 || isUserDataLoading}
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
                      Войти
                    </Button>
                  </div>
                </Form>
              </Grid>
            </Grid>
          )}
        </Formik>
        <Link to="/auth/sign-up">
          Регистрация
        </Link>
      </div>
    </Container>
  )
}
