# Storymash API

Includes API Server utilities:

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
- [cors](https://www.npmjs.com/package/cors)
  - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Development utilities:

- [typescript](https://www.npmjs.com/package/typescript)
  - TypeScript is a language for application-scale JavaScript.
- [ts-node](https://www.npmjs.com/package/ts-node)
  - TypeScript execution and REPL for node.js, with source map and native ESM support.
- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [eslint](https://www.npmjs.com/package/eslint)
  - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [typescript-eslint](https://typescript-eslint.io/)
  - Tooling which enables ESLint to support TypeScript.
- [jest](https://www.npmjs.com/package/mocha)
  - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [supertest](https://www.npmjs.com/package/supertest)
  - HTTP assertions made easy via superagent.

## Setup

Install all necessary packages

```
npm install
```

Copy .env.sample in a new file called .env

```
cp .env.sample .env
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```

## TODO

- [x] Uplaod repo to github

  - [ ] Configure husky and lint-stagged

- [ ] Create authentication endpoints

  - [x] Create activate-account endpoint
  - [ ] Create login endpoint
  - [ ] Create logout endpoint

- [ ] Update express-rate-limiter package from [https://www.npmjs.com/package/rate-limiter-flexible](rate-limiter-flexible) or rate-limit-mongo

- [ ] Add some tests when authentication is complete (look the code garden auth example with tests)

## API Standars

#### Message property

We only should response the prop message if we want to show a toast at frontend, ex:

```
.json({ message: "Show a toast" })
```

#### Redirect property

Redirect property allow the frontend to redirect the user to the correct page

```
.json({ redirect: "/activate-account" })
```

#### Log property

If we want to send just information use the prop "log"

```
.json({ log: "The service is not ready yet" })
```
