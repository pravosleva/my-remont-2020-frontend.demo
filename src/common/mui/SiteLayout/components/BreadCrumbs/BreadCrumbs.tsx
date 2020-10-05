import React, { useContext } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link, useParams, withRouter } from 'react-router-dom'
import { MainContext } from '~/common/context/MainContext'

// interface IPageParams {
//   id: string
// }

export const BreadCrumbs = withRouter(({ location }) => {
  // const { ...rest }: IPageParams = useParams()
  const { projectName } = useContext(MainContext)
  const { pathname } = location

  return (
    <>
      {pathname === '/' && (
        <div>
          <Link to="/">Главная</Link>
        </div>
      )}
      {(pathname === '/projects' || pathname === '/projects/') && (
        <div>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link>
        </div>
      )}
      {pathname.includes('/projects/') && pathname.length > 10 && (
        <div>
          <Link to="/">Главная</Link> / <Link to="/projects">Проекты</Link> /{' '}
          <span style={{ opacity: '0.5' }}>{projectName || 'Please wait...'}</span>
        </div>
      )}
    </>
  )
})
