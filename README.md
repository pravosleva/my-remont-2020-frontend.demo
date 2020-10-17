# my-remont-2020 frontend.demo (CRA based)

## Roadmap

- [ ] **git hooks**
- [ ] UX
  - [ ] личный кабинет
    - [x] доп. кнопки на странице `/projects/:id` "Добавить сумму"/"Вычесть сумму"
    - [ ] авториз. пользователь должен видеть только свои ремонты
      - [ ] `/projects`
        - [ ] project should be related to user?
        - [ ] findOne for the user
  - [ ] неавториз. польз. должен видеть только общую информацию о ремонтах
    - [ ] общая аналитика по всем ремонтам на главной
      - [ ] `/`
        - [ ] allow find all projects free (gql)
  - [ ] открытие ссылок `description` в новом окне
  - [ ] registry service
    - [ ] `/auth/sign-up`
      - [x] page
      - [ ] API
    - [ ] `/auth/forgot-password`
      - [ ] page
      - [ ] API
    - [ ] email confirmation
      - [ ] https for MVP?
    - [x] **RESTful api**
  - [ ] 2 balances
    > (Баланс в бухгалтерии считается только как разница между сделанными и оплаченными работами) Один на фактическую дату (где будет только факт работ и оплат). Другой - на плановую дату (где будет факт+план). Думать про 2 баланса должна система и разработчик. А не конечный пользователь. А у конечного пользователя может возникнуть ситуация, когда неожиданно решено будет закрытыть/приостановить проект. В этом случае нужно будет закрыть расчёты по состоянию на эту дату. И без аналитики реально закрытые работы на дату - этого не сделать (только плановые работы будут в системе)
  - [x] DB for dev mode
  - [x] GraphQL
  - [x] `isDone` filter: А как отделить работы сделаны от НЕ сделаны?
  - [x] update job status cofirm dialog by `material-ui-confirm`
  - [x] socket connection for realtime web app
  - [x] create/edit job: by auth user
  - [x] logout on `/users/me` 401 (bad jwt)
- [ ] UI
  - [x] `react-toast-notifications`
  - [x] markdown editor
- [ ] allow `findOne` for auth user for his projects
- [ ] socket
  - [ ] remont room connection?
- [ ] Standard errors handlers
  - [ ] network
  - [x] http
  - [ ] api
- [x] gql

## envs

`.env.production.local`

```bash
REACT_APP_API_ENDPOINT=http://localhost:1337
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337
REACT_APP_COOKIE_MAXAGE_IN_DAYS=5
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
