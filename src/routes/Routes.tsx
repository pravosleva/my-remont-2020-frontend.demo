import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { IRoute } from './interfaces'
import { Home } from '~/pages/index'
import { Projects } from '~/pages/projects'
import { TheProject } from '~/pages/projects/[id]'
import { Login } from '~/pages/auth/login'

const routes: IRoute[] = [
  { path: '/', exact: true, component: Home },
  { path: '/projects', exact: true, component: Projects },
  { path: '/projects/:id', exact: true, component: TheProject },
  { path: '/auth/login', exact: true, component: Login },
]

export const Routes = () => {
  return (
    <Switch>
      {[...routes].map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}
    </Switch>
  )
}
