import React, { useCallback } from 'react'
import { Button, Container, CircularProgress } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
// import { NavLink } from 'react-router-dom'
import { useRouter } from '~/common/hooks/useRouter'
import { useUserAuthContext, useMainContext } from '~/common/hooks'
import { useStyles } from './styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const SiteHeader = () => {
  const classes = useStyles()
  const { remontLogic } = useMainContext()
  const { isUserDataLoading, logout, isUserLogged } = useUserAuthContext()
  const router = useRouter()
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const {
    location: { pathname },
  } = router
  const handleLogout = useCallback(() => {
    logout().then(() => {
      router.push('/auth/login')
    })
  }, [logout, history])

  return (
    <Container maxWidth="md">
      <div className={classes.wrapper}>
        <div className={classes.rightSide}>
          {isUserDataLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CircularProgress size={20} color="primary" />
            </div>
          ) : !isUserLogged ? (
            <Button
              // style={{ marginLeft: '10px' }}
              onClick={() => {
                router.push(
                  !!remontLogic?.id
                    ? `/auth/login?from=${encodeURIComponent(`/projects/${remontLogic?.id}`)}`
                    : '/auth/login'
                )
              }}
              size="small"
              variant={pathname === '/auth/login' || isUserDataLoading ? 'outlined' : 'contained'}
              color="primary"
              endIcon={<AccountCircleIcon />}
              disabled={pathname === '/auth/login'}
            >
              <span>Вход</span>
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <NavLink to="/profile" style={{ marginLeft: '10px' }}>Профиль</NavLink> */}
              <Button
                onClick={() => {
                  router.push('/try-ui')
                }}
                size="small"
                variant="outlined"
                disabled={router.pathname === '/try-ui'}
              >
                <span>Try UI</span>
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  router.push('/profile')
                }}
                size="small"
                variant="outlined"
                color="primary"
                endIcon={<AccountCircleIcon />}
                disabled={router.pathname === '/profile'}
              >
                <span>Профиль</span>
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                onClick={handleLogout}
                size="small"
                variant="outlined"
                color="primary"
                // endIcon={<ExitToAppIcon />}
              >
                {/* <span>{userData?.username}</span> */}
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
