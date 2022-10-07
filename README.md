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
  - [x] Create login endpoint
  - [ ] Create logout endpoint

- [x] onboarding process

  - [x] endpoint to allow save the user information like name, lastname, birthdate
  - [x] endpoint to allow to the users select their gender
  - [x] endpoint to allow save the user's about and an image (both are optional)

- [ ] Stories

  - [x] Create Story model
  - [x] Use cloudinary sdk to get a random image from a folder and return the imageUrl
  - [ ] Create story
    - [ ] Allow enter title
    - [ ] Allow enter file and create an imageUrl or asign a defaultImageUrl
    - [ ] Allow enter categories
    - [ ] Allow enter the first chapter
  - [ ] Get all stories
    - [ ] Get only the stories where isDeleted is false
    - [ ] Sort stories by the most recently chapter using the createdAt attribute from the last chapter
    - [ ] Get only the content from the first chapter
    - [ ] It must have pagination
    - [ ] Get number of likes from all the chapters that belong this story (query or create a field in story schema)
    - [ ] Get number of comments from all the chapters that belong this story (query or create a field in story schema)
  - [ ] Get story by id
    - [ ] Get only the stories where isDeleted is false
    - [ ] It must have pagination for the chapters
    - [ ] It must have pagination for the comments from the chapters
  - [ ] Get stories where a user is the owner and there aren't published yet
    - [ ] Filter the stories by authorId = req.user.id
    - [ ] Filter the stories by isPublished = false
  - [ ] Update story by id (title, imageUrl, categories, isCompleted, isPublished)
    - [ ] allow update title
    - [ ] allow update imageUrl
    - [ ] allow update categories
    - [ ] allow update isCompleted status
    - [ ] allow update isPublished status
  - [ ] Delete story by id
    - [ ] make softdelete with the field isDeleted
  - [ ] Create story chapter by id
    - [ ] Allow enter the content for this chapter
    - [ ] validate timestamp createdAt is correct
  - [ ] Update story chapter by id
    - [ ] Allow update the content for this chapter
  - [ ] Delete story chapter by id
    - [ ] Allow delete the content for this chapter

- [ ] Test what happend when a user is logged an the account is deleted

# Pre MVP But not required

- [ ] Write tests for all the story endpoints
- [ ] Show on the client all the possible images to use in their stories and allow select one

# After MVP

- [ ] Make point system for every interaction

- [ ] Update express-rate-limiter package from [https://www.npmjs.com/package/rate-limiter-flexible](rate-limiter-flexible) or rate-limit-mongo

- [x] Add some tests when authentication is complete (look the code garden auth example with tests)

- [ ] try this implementation to avoid repeat register/login logic on every test file [share-beforeAll-between-test-files](https://stackoverflow.com/questions/47997652/jest-beforeall-share-between-multiple-test-files)

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

### formErrors property

This allow show an error in the form input at frontend

```
.json({ formErrors: [{ email: "email must be provided" }] })
```
