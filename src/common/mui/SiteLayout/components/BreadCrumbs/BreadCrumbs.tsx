import React, { useContext, useMemo } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link, withRouter } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'
// import { useCookies } from 'react-cookie'
import { useRouter } from '~/common/hooks/useRouter'

export const BreadCrumbs = withRouter(({ location }) => {
  // const { ...rest }: IPageParams = useParams()
  const { projectName, isUserDataLoading, isUserDataLoaded, userData, onLogout } = useContext(MainContext)
  const { pathname } = location
  const router = useRouter()
  const logoutRenderer = () => (
    <button
      style={{ marginLeft: '10px' }}
      onClick={() =>
        onLogout().then(() => {
          router.push('/auth/login')
        })
      }
    >
      Выход
    </button>
  )
  const userDataRenderer = ({ userData }: { userData: any }) => {
    if (!userData) {
      return <Link to="/auth/login">Вход</Link>
    } else {
      return (
        <div>
          {`Logged as ${userData?.username}`}
          {logoutRenderer()}
        </div>
      )
    }
  }
  // const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
  const memoizedUserInfo = useMemo(
    () => (
      <div style={{ marginLeft: 'auto' }}>
        {isUserDataLoading ? <span>Loading...</span> : userDataRenderer({ userData })}
      </div>
    ),
    [isUserDataLoading, isUserDataLoaded, userData]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
      {pathname === '/' && (
        <div>
          <Link to="/">Главная</Link>
        </div>
      )}
      {(pathname === '/projects' || pathname === '/projects/') && (
        <div>
          <Link to="/">Главная</Link> / <span style={{ opacity: '0.5' }}>Проекты</span>
        </div>
      )}
      {pathname.includes('/projects/') && pathname.length > 10 && (
        <div>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link> /{' '}
          <span style={{ opacity: '0.5' }}>{projectName || 'Please wait...'}</span>
        </div>
      )}
      {pathname.includes('/auth') && (
        <div>
          <Link to="/">Главная</Link> / <span style={{ opacity: '0.5' }}>Вход</span>
        </div>
      )}
      {memoizedUserInfo}
    </div>
  )
})
