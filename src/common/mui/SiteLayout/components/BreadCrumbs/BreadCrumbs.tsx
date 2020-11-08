import React, { useContext } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'
// import { useCookies } from 'react-cookie'
import { useRouter } from '~/common/hooks/useRouter'

import { useStyles } from './styles'

export const BreadCrumbs = () => {
  const classes = useStyles()
  // const { ...rest }: IPageParams = useParams()
  const { remontLogic } = useContext(MainContext)
  const router = useRouter()
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const {
    location: { pathname },
  } = router

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
          <span className={classes.muted}>Проекты</span>
        </div>
      )}
      {pathname.includes('/projects/') && pathname.length > 10 && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link> /{' '}
          {!remontLogic && (
            <span className={classes.muted}>Please wait...</span>
          )}
          {!!remontLogic && (
            <span style={{ whiteSpace: 'nowrap' }} className={classes.muted}>
              {remontLogic.name}
            </span>
          )}
        </div>
      )}
      {pathname === '/auth/login' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span className={classes.muted}>Авторизация</span>
        </div>
      )}
      {pathname === '/auth/sign-up' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span className={classes.muted}>Регистрация</span>
        </div>
      )}
      {pathname === '/profile' && (
        <div className={classes.rightSide}>
          <Link to="/">Главная</Link> /{' '}
          <span className={classes.muted}>Профиль</span>
        </div>
      )}
    </div>
  )
}
