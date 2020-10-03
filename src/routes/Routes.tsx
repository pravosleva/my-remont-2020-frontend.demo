import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

// PAGES:
import { Home } from '~/pages/index';
import { Projects } from '~/pages/projects';
import { TheProject } from '~/pages/projects/[id]'

interface IRoute {
  path: string
  exact?: boolean
  component: () => JSX.Element
}
const routes: IRoute[] = [
  { path: '/', exact: true, component: () => <Home /> },
  { path: '/projects', exact: true, component: () => <Projects /> },
  { path: '/projects/:id', exact: true, component: () => <TheProject /> },
];

export const Routes = () => {
  return (
    <Switch>
      {
        [...routes].map(({
          path,
          exact,
          component,
        }) => <Route key={path} path={path} exact={exact} component={component} />)
      }
    </Switch>
  );
};
