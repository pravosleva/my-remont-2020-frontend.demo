# my-remont-2020/frontend.demo

**MVP CRA based**

Fullstack приложение для мониторинга затрат на процесс ремонта квартиры **(реализация MVP)**

## [Demo](http://selection4test.ru:1338/demo)

## Критерии успешности MVP

Требования, обозначенные на старте:

- [ ] Любой пользователь должен иметь возможность
  - [ ] Зарегистрироваться в системе
    - [ ] **JWT**
      - [x] Авторизация;
      - [x] Регистрация;
      - [ ] Забыли пароль;
- [ ] Авторизованный пользователь должен иметь возможность
  - [ ] Просматривать любые Ремонты и затраты по выполненным работам (или только ремонты, `isPublic`?);
  - [x] Редактировать только свои Ремонты;
  - [x] Создать проект (далее _Ремонт_);
- [ ] Авторизованный пользователь из списка `owners` (далее _Собственник_) **в рамках конкретного проекта** должен иметь возможность:
  - [ ] Искать других пользователей по `username` и добавлять в список `executors` (далее _Исполнители_) по конкретному ремонту (или по конкретной работе?);
    > Итог деятельности Исполнителя может быть спрогнозирован на основании его прогнозов и реальных окончаний работ за последние пол-года (либо, настраиваемый интервал времени);
  - [x] Добавлять и удалять позиции joblist (далее _Список работ_);
  - [x] Редактировать любые поля;
- [ ] Пользователь из списка `executors` для конкретного проекта может редактировать только поля:
  - [ ] `isStarted` _(Начать работу)_;
    > Нужно ли давать доступ к комментариям?
    > Ценники за ремонты должны быть доступны всем, т.к. задача сайта - помочь пользователю ориентироватья по ценам.
- [x] Real time web app (приложение реального времени)
  > Изменения по данному Ремонту, Спискам работ должны приходить по сокет-соединению без необходимости перезагрузки страницы;
- [ ] Аналитика по всем ремонтам на главной странице:
  - [ ] Количество пользователей в системе;
  - [ ] Количество ремонтов в системе;
  - [ ] Ссылки на ремонты, не помеченные как **приватные**: `isPrivate` (далее _Приватный ремонт_)
- [ ] ДОП: Система прогнозов Исполнителя на основе анализа выполненных работ во всех проектах где данный Исполнитель входит в список `executors`;

## Roadmap

- [ ] use `httpClient`
- [x] `webpack-bundle-analyzer` by `$ yarn analyze`
- [x] [envs](#envs)
- [x] [quick deploy](#deploy-app)
- [ ] **git hooks**
- [ ] UX
  - [ ] личный кабинет (?)
    - [x] доп. кнопки на странице `/projects/:id` "Добавить сумму"/"Вычесть сумму"
    - [ ] авториз. пользователь должен видеть только свои ремонты (?)
      - [x] `/projects`
        - [x] project should be related to user?
          - [x] user could be owner
          - [ ] user could be executor
        - [ ] findOne for the user
  - [ ] неавториз. польз. должен видеть только общую информацию о ремонтах (?)
    - [ ] общая аналитика по всем ремонтам на главной
      - [ ] _HomePage_
        - [x] allow find all projects free (gql)
  - [ ] _Auth pages: registry service_
    - [ ] `/auth/forgot-password`
      - [ ] frontend
      - [ ] backend
    - [x] login/logout mechanism
    - [x] email confirmation mechanism
      - [ ] https for MVP?
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
- [x] GraphQL
- [x] `package.json` for example:

```json
"script": {
  "prebuild": "yarn format && prettier --write ."
}
```

## envs

`.env.production.local`

```bash
REACT_APP_API_ENDPOINT=http://localhost:1337
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337
REACT_APP_COOKIE_MAXAGE_IN_DAYS=5
```

## deploy-app

> NOTE: Check `./.env.production.local`!

### WAY 1: `deploy-app init`

```json
{
  "prod:demo": {
    "user": "deploy",
    "host": "selection4test.ru",
    "port": "22",
    "files": "./build/*",
    "path": "/home/my-remont-2020/backend/public/demo",
    "pre-deploy-local": "yarn build && yarn analyze"
  },
  "dev": {},
  "staging": {}
}
```

> Bundlez size analysis will be moved to `./build/analyze/*` dir.

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
