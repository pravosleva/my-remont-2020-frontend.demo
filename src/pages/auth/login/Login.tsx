import React, { useCallback, useState, useContext } from 'react'
import {
  Typography,
  Container,
  Avatar,
  TextField,
  Button,
} from '@material-ui/core'
import { useStyles } from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { getNormalizedInputs } from '~/utils/strapi/getNormalizedInputs'
import { getApiUrl } from '~/utils/getApiUrl'
import { useCookies } from 'react-cookie'
import { MainContext } from '~/common/context/MainContext'
import { useRouter } from '~/common/hooks/useRouter'

const apiUrl = getApiUrl()
const REACT_APP_COOKIE_EXPIRES_IN_DAYS = process.env.REACT_APP_COOKIE_EXPIRES_IN_DAYS ? parseInt(process.env.REACT_APP_COOKIE_EXPIRES_IN_DAYS) : 1

export const Login = () => {
  const router = useRouter()
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const { setUserData, toast } = useContext(MainContext)
  const handleSubmit = useCallback(() => {
    const normalizedObj = getNormalizedInputs({ email, password })
    // const body = new FormData()

    // // @ts-ignore
    // body.append('identifier', normalizedObj.identifier)
    // // @ts-ignore
    // body.append('password', normalizedObj.password)

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
      .then((res) => res.json())
      .then((data) => {
        if (!!data.jwt && !!data.user) {
          setCookie(data.jwt, 'jwt', { maxAge: REACT_APP_COOKIE_EXPIRES_IN_DAYS * 24 * 60 *60 * 1000 })
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
        console.log(err.message)
      })
  }, [email, password])

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
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            size="small"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Войти
          </Button>
        </form>
      </div>
    </Container>
  )
}
