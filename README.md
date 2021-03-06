# Description

Microservice for processing movies using [OMDb](https://www.omdbapi.com). Netguru recruitment [task](https://github.com/netguru/nodejs-recruitment-task).

## Installation

```bash
$ npm install
```

## Environmental variables

```bash
$ APP_PORT=3100      # published port of movies microservice
$ PG_DATA=~/pgstore  # host storage for postgresql
```

All variables used by the service with their defaults are in .env configuration file.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod # requires docker-compose
```

Production mode uses PostgreSQL as database. Therefore requires to map its data store.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e # requires docker-compose

# test coverage
$ npm run test:cov
```

## Api documentation

`POST /movies`

- **Header**

  `{ Authorization: "Bearer <token>" }`

- **Body**

  `{ title: "Star wars" }`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:** `{"id":"d160fee1-3255-413c-b4de-acd3892c5533","title":"Star Wars: Episode IV - A New Hope","released":"1977-05-24T22:00:00.000Z","genre":"Action, Adventure, Fantasy, Sci-Fi","director":"George Lucas","createdAt":"2000-06-09T22:00:00.000Z"}`

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />

  OR

  - **Code:** 403 FORBIDDEN <br />
    **Content:** `{ error : "movies-count-per-month-exceeded" }`

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "OMDb api error / not found" }`

`GET /movies`

- **Header**

  `{ Authorization: "Bearer <token>" }`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `[{"id":"d160fee1-3255-413c-b4de-acd3892c5533","title":"Star Wars: Episode IV - A New Hope","released":"1977-05-24T22:00:00.000Z","genre":"Action, Adventure, Fantasy, Sci-Fi","director":"George Lucas","createdAt":"2000-06-09T22:00:00.000Z"}]`

  OR

  - **Code:** 401 UNAUTHORIZED <br />

Interactive docs available at http://localhost:3100/docs in development and test modes.

## Continuous integration

GitHub Actions with automated tests.

## Technological stack

- [NestJS](https://nestjs.com)
- [Sequelize](https://sequelize.org) - postgres, sqlite in dev mode
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## Final notes

Other solutions could have been used like CQRS, Event Sourcing and DDD but this API is far too simple for any more complex solutions at this moment.
When user is removed from auth-svc then his remaining movies here will lead to data inconsistency. The solution for that would be e.g. global event bus and subscribing to user removal event.
