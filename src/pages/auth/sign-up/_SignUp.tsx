import React, { useCallback, useState, useContext, useMemo } from 'react'
import {
  Typography,
  Container,
  Avatar,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { useStyles } from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { getNormalizedInputs } from '~/utils/strapi/getNormalizedInputs'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'
import { httpErrorHandler } from '~/utils/errors/http/fetch'

const apiUrl = getApiUrl()
const REACT_APP_COOKIE_MAXAGE_IN_DAYS = process.env
  .REACT_APP_COOKIE_MAXAGE_IN_DAYS
  ? parseInt(process.env.REACT_APP_COOKIE_MAXAGE_IN_DAYS)
  : 1

export const SignUp = () => {
  const router = useRouter()
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const { setUserData, toast, isUserDataLoading } = useContext(MainContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const validate = (values: any) => {
    let errors = {
      email: null,
      password: null,
      password2: null,
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    if (!values.email) {
      errors.email = 'Cannot be blank'
    } else if (!regex.test(values.email)) {
      errors.email = 'Invalid email format'
    }
    if (!values.password) {
      errors.password = 'Cannot be blank'
    } else if (values.password.length < 4) {
      errors.password = 'Password must be more than 4 characters'
    }
    if (values.password2 !== values.password) {
      errors.password2 = 'Should be equal to Password'
    }
    return errors
  }
  const errors = useMemo(() => validate({ email, password, password2 }), [
    email,
    password,
    password2,
  ])
  const isCorrect = useMemo(
    () => !errors.email && !errors.password && !errors.password2,
    [errors]
  )
  const handleSubmit = useCallback(() => {
    const normalizedObj = getNormalizedInputs({ email, password })
    // const body = new FormData()

    // // @ts-ignore
    // body.append('identifier', normalizedObj.identifier)
    // // @ts-ignore
    // body.append('password', normalizedObj.password)

    setIsLoading(true)

    window
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
        setIsLoading(false)
        if (!!data.jwt && !!data.user) {
          setCookie('jwt', data.jwt, {
            maxAge: REACT_APP_COOKIE_MAXAGE_IN_DAYS * 24 * 60 * 60,
          })
          setUserData(data.user)
          toast(`Hello, ${data.user.username}`, { appearance: 'success' })
          return
        }
        throw new Error('Fuckup')
      })
      .then(() => {
        router.history.push('/projects')
      })
      .catch((err) => {
        setIsLoading(false)
        toast(err.message || 'Errored', { appearance: 'error' })
        console.log(err.message)
      })
  }, [email, password, setIsLoading])

  /*
  https://github.com/pravosleva/get-money-frontend-cra/blob/master/src/pages/registry-page/index.js

  const submit = async formValue => {
    // if (dev) {
    //   notif({ type: 'warning', title: 'For production mode only' });
    //   return;
    // }

    await schema.validate(formValue)
      .then(async () => {
        setLoading(true);

        const {
          // username,
          email,
          password,
          // Additional:
          fullName,
          bankName,
          cardNumber,
          phone,
        } = formValue;

        await axios({
          url: `${apiUrl}/auth/local/register`,
          method: 'POST',
          data: {
            username: email,
            email,
            password,
            // fullName,
            // bankName,
            // cardNumber,
            // phone,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        })
          .then(apiResponseHadler)
          .then(res => res.data)
          .then(data => {
            console.log(data); // { jwt, user }
            notif({ type: 'success', title: 'Проверьте почту', description: email });

            if (data.jwt && data.user) return { jwt: data.jwt, user: data.user };

            throw data;
          })
          // Y're welcome:
          .then(({ jwt, user }) => {
            setLoading(false);
            cookies.set('jwt', jwt, { maxAge: getSecondsFromDays(authTokenCookieExpires) });
            cookies.set('userId', user.id, { maxAge: getSecondsFromDays(authTokenCookieExpires) });
            dispatch(userInfoActions.setUser(user));
            history.push('/cabinet');
          })
          .catch(err => {
            console.log(err);

            setLoading(false);

            if (
              // MongoDB version:
              err && err.data && err.data.message && Array.isArray(err.data.message) && err.data.message[0] && err.data.message[0].messages && Array.isArray(err.data.message[0].messages) && err.data.message[0].messages[0] && err.data.message[0].messages[0].message
            ) {
              const description = err.data.message[0].messages[0].message;

              notif({ type: 'error', title: 'Ошибка запроса', description });
              return;
            }

            notif({ type: 'error', title: 'Ошибка запроса', description: 'See console' });
            return;
          });
      })
      .catch(async err => {
        notif({ type: 'error', title: 'Проверьте данные', description: err && err.errors && err.errors[0] ? err.errors[0] : '' });

        await console.log(err);
      });
  };
  */

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="identifier"
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            size="small"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            // error={!!errors.email}
            // helperText={errors.email || undefined}
          />
          <TextField
            id="password"
            label="Пароль"
            type="password"
            variant="outlined"
            value={password}
            size="small"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            error={!errors.email && !!errors.password}
            // helperText={errors.password || undefined}
            disabled={!email || !!errors.email}
          />
          <TextField
            id="password2"
            label="Повторите пароль"
            type="password"
            variant="outlined"
            value={password2}
            size="small"
            onChange={(e) => {
              setPassword2(e.target.value)
            }}
            error={!!errors.password2}
            helperText={errors.password2 || undefined}
            disabled={
              !email || !password || !!errors.email || !!errors.password
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!isCorrect || isLoading || isUserDataLoading}
            endIcon={
              isLoading && (
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
        </form>
      </div>
    </Container>
  )
}
