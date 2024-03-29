import React, { useContext, useMemo } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'
// import { useCookies } from 'react-cookie'
import { useRouter } from '~/common/hooks/useRouter'
import { Container } from '@material-ui/core'
import { useStyles } from './styles'
// import clsx from 'clsx'
import { useWindowSize } from '~/common/hooks'
import clsx from 'clsx'

export const BreadCrumbs = () => {
  const classes = useStyles()
  // const { ...rest }: IPageParams = useParams()
  const { remontLogic } = useContext(MainContext)
  const router = useRouter()
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const {
    location: { pathname },
  } = router
  const { isDesktop } = useWindowSize()
  const displayedName = useMemo(() => {
    return remontLogic?.name || null
    // if (!remontLogic?.name) return null
    // if (isDesktop) return remontLogic.name

    // return remontLogic.name.length <= 15 ? remontLogic.name : `${remontLogic.name.slice(0, 15)}...`
  }, [remontLogic?.name, isDesktop])

  return (
    <Container maxWidth="md">
      <div className={classes.wrapper}>
        {/* RIGHT SIDE */}

        {pathname === '/' && (
          <div className={classes.rightSide}>
            <Link to="/" className={classes.muted}>
              Главная
            </Link>
          </div>
        )}
        {(pathname === '/projects' || pathname === '/projects/') && (
          <div className={classes.rightSide}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <span className={classes.muted}>Проекты</span>
          </div>
        )}
        {pathname.includes('/projects/') && pathname.length > 10 && (
          <div className={clsx(classes.rightSide, 'truncate')}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <Link to="/projects">Проекты</Link>
            <span className={classes.muted}>/</span>
            {!remontLogic?.name && <span className={classes.muted}>Please wait...</span>}
            {!!displayedName && (
              <span style={{ whiteSpace: 'nowrap' }} className={classes.muted}>
                {displayedName}
              </span>
            )}
          </div>
        )}
        {pathname === '/auth/login' && (
          <div className={classes.rightSide}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <span className={classes.muted}>Авторизация</span>
          </div>
        )}
        {pathname === '/auth/sign-up' && (
          <div className={classes.rightSide}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <span className={classes.muted}>Регистрация</span>
          </div>
        )}
        {pathname === '/profile' && (
          <div className={classes.rightSide}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <span className={classes.muted}>Профиль</span>
          </div>
        )}
        {pathname === '/try-ui' && (
          <div className={classes.rightSide}>
            <Link to="/">Главная</Link>
            <span className={classes.muted}>/</span>
            <span className={classes.muted}>Try UI</span>
          </div>
        )}
      </div>
    </Container>
  )
}
