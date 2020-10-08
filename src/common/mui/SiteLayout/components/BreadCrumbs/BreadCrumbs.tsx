import React, { useCallback, useContext } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'
// import { useCookies } from 'react-cookie'
import { useRouter } from '~/common/hooks/useRouter'
import { Button } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

export const BreadCrumbs = () => {
  // const { ...rest }: IPageParams = useParams()
  const { projectName, isUserDataLoading, userData, onLogout } = useContext(
    MainContext
  )
  const router = useRouter()
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const {
    location: { pathname },
  } = router
  const handleLogout = useCallback(() => {
    onLogout().then(() => {
      router.push('/auth/login')
    })
  }, [onLogout, history])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {pathname === '/' && (
        <div>
          <Link to="/">Главная</Link>
        </div>
      )}
      {(pathname === '/projects' || pathname === '/projects/') && (
        <div>
          <Link to="/">Главная</Link> /{' '}
          <span style={{ opacity: '0.5' }}>Проекты</span>
        </div>
      )}
      {pathname.includes('/projects/') && pathname.length > 10 && (
        <div>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link> /{' '}
          <span style={{ opacity: '0.5' }}>
            {projectName || 'Please wait...'}
          </span>
        </div>
      )}
      {pathname.includes('/auth') && (
        <div>
          <Link to="/">Главная</Link> /{' '}
          <span style={{ opacity: '0.5' }}>Авторизация</span>
        </div>
      )}
      <div style={{ marginLeft: 'auto' }}>
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
              <span>{userData?.username}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
