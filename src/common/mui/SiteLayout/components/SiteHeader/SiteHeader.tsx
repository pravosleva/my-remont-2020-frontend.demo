import React, { useCallback, useContext } from 'react'
import { Button } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { NavLink } from 'react-router-dom'
import { useRouter } from '~/common/hooks/useRouter'
import { MainContext } from '~/common/context/MainContext'
import { useStyles } from './styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const SiteHeader = () => {
  const classes = useStyles()
  const { remontLogic, isUserDataLoading, userData, logout } = useContext(
    MainContext
  )
  const router = useRouter()
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const {
    location: { pathname },
  } = router
  const handleLogout = useCallback(() => {
    logout('Logout').then(() => {
      router.push('/auth/login')
    })
  }, [logout, history])

  return (
    <div className={classes.wrapper}>
      <div className={classes.rightSide}>
        {isUserDataLoading ? (
          <span>Loading...</span>
        ) : !userData ? (
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              router.push(
                !!remontLogic?.id
                  ? `/auth/login?from=${encodeURIComponent(
                      `/projects/${remontLogic?.id}`
                    )}`
                  : '/auth/login'
              )
            }}
            size="small"
            variant="contained"
            color="primary"
            endIcon={<AccountCircleIcon />}
            disabled={router.pathname === '/auth/login'}
          >
            <span>Вход</span>
          </Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <NavLink to="/profile" style={{ marginLeft: '10px' }}>Профиль</NavLink> */}
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                router.push('/profile')
              }}
              size="small"
              variant="contained"
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
              endIcon={<ExitToAppIcon />}
            >
              {/* <span>{userData?.username}</span> */}
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}