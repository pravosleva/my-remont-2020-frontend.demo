export interface IRoute {
  path: string
  exact?: boolean
  component: () => JSX.Element
}
