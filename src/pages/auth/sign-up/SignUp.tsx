import React, { useCallback } from 'react'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  // LinearProgress,
  Typography,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { validShape } from './yup'
import { validateEmail, isCiryllic } from '~/utils/validators'
import { useStyles } from './styles'
import { Link } from 'react-router-dom'
// import { MainContext } from '~/common/context/MainContext'
import { useCustomToastContext, useUserAuthContext } from '~/common/hooks'
import axios from 'axios'
import { getApiUrl } from '~/utils/getApiUrl'
import { useRouter } from '~/common/hooks/useRouter'

const apiUrl = getApiUrl()
// const REACT_APP_COOKIE_MAXAGE_IN_DAYS = process.env
//   .REACT_APP_COOKIE_MAXAGE_IN_DAYS
//   ? parseInt(process.env.REACT_APP_COOKIE_MAXAGE_IN_DAYS)
//   : 1

interface IValues {
  username: string
  email: string
  password: string
  password2: string
}

export const SignUp = () => {
  const classes = useStyles()
  const {
    toast,
  } = useCustomToastContext()
  const {
    isUserDataLoading,
    isUserDataLoaded,
    // setUserData,
  } = useUserAuthContext()
  // const [, setCookie] = useCookies(['jwt'])
  const handleSubmit = useCallback(
    async (values: IValues): Promise<string | undefined> => {
      const res = await axios({
        url: `${apiUrl}/auth/local/register`,
        method: 'POST',
        data: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        validateStatus: (status) => status >= 200 && status < 500,
      })
        .then((res) => {
          console.log(res)

          if (res.status === 200) return res
          throw new Error(res.statusText)
        })
        .then((res) => res.data)
        .then((data) => {
          if (!!data.user) return { user: data.user }

          throw data
        })
        // .then(({ jwt, user }) => {
        //   setCookie('jwt', jwt, { maxAge: REACT_APP_COOKIE_MAXAGE_IN_DAYS * 24 * 60 * 60 })
        //   return 'Проверьте почту'
        // })
        .then(({ user }) => {
          return `Ok, ${user.username}, проверьте почту`
        })
        .catch((err) => {
          console.log(err)
          return typeof err === 'string' ? err : JSON.stringify(err)
        })

      return res
    },
    [toast]
  )
  const router = useRouter()

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
            const errors: Partial<IValues> = {}

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

            return errors
          }}
          validationSchema={validShape}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false)
              handleSubmit(values)
                .then((msg) => {
                  toast(msg, { appearance: 'success' })
                  router.history.push('/auth/login')
                })
                .catch((msg) => {
                  toast(msg, { appearance: 'warning' })
                })
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
            touched,
          }) => (
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form className={classes.form}>
                  <Field
                    autoFocus
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
                  {/* isSubmitting && (
                    <LinearProgress style={{ marginBottom: '20px' }} />
                  ) */}
                  <div>
                    <Button
                      disabled={
                        !isValid ||
                        isSubmitting ||
                        Object.keys(touched).length === 0 ||
                        isUserDataLoading ||
                        isUserDataLoaded
                      }
                      variant={isSubmitting || isUserDataLoading ? "outlined" : "contained"}
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
        <Link to="/auth/login">Авторизация</Link>
      </div>
    </Container>
  )
}
