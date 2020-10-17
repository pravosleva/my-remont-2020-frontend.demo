import React, { useCallback, useContext } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'
// import { useCookies } from 'react-cookie'
import { useRouter } from '~/common/hooks/useRouter'
import { Button } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useStyles } from './styles'

export const BreadCrumbs = () => {
  const classes = useStyles()
  // const { ...rest }: IPageParams = useParams()
  const { projectData, isUserDataLoading, userData, logout } = useContext(
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

      {/* ROGHT SIDE */}

      {pathname === '/' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link>
        </div>
      )}
      {(pathname === '/projects' || pathname === '/projects/') && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span style={{ opacity: '0.5' }}>Проекты</span>
        </div>
      )}
      {pathname.includes('/projects/') && pathname.length > 10 && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link> /{' '}
          <span style={{ opacity: '0.5' }}>
            {projectData?.name || 'Please wait...'}
          </span>
        </div>
      )}
      {pathname === '/auth/login' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span style={{ opacity: '0.5' }}>Авторизация</span>
        </div>
      )}
      {pathname === '/auth/sign-up' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span style={{ opacity: '0.5' }}>Регистрация</span>
        </div>
      )}

      {/* LEFT SIDE */}

      <div  className={classes.leftSide}>
        {isUserDataLoading ? (
          <span>Loading...</span>
        ) : !userData ? (
          <NavLink to="/auth/login">Вход</NavLink>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleLogout}
              size="small"
              variant="contained"
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
