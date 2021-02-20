import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { IRoute } from './interfaces'
import { HomePage } from '~/pages/homepage'
import { Projects } from '~/pages/projects'
import { TheProject } from '~/pages/projects/[id]'
import { Login } from '~/pages/auth/login'
import { SignUp } from '~/pages/auth/sign-up'
import { NotFound } from '~/pages/not-found'
import { Profile } from '~/pages/profile'
import { TryUi } from '~/pages/try-ui'

const routes: IRoute[] = [
  { path: '/', exact: true, component: HomePage },
  { path: '/projects', exact: true, component: Projects },
  { path: '/projects/:id', exact: true, component: TheProject },
  { path: '/auth/login', exact: true, component: Login },
  { path: '/auth/sign-up', exact: true, component: SignUp },
  { path: '/profile', exact: true, component: Profile },
  { path: '/try-ui', exact: true, component: TryUi },
]

export const Routes = () => {
  return (
    <Switch>
      {[...routes].map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}
      <Route exact path="*" component={NotFound} />
    </Switch>
  )
}
