# Getting started

## System Requirements

- [Node.js 18](https://nodejs.org/en/)
- [Yarn 1.22](https://classic.yarnpkg.com/lang/en/)

> This project has `.nvmrc`, `.node-version`, and `.tool-versions` files compatible with version managers.

## Installation

1. Clone the repo: `git clone git@github.com:rafahuaman/photo-search.git`
2. Install JavaScript packages: `yarn install`
3. Create `.env.local` file and set `PEXELS_API_KEY` to your Pexels API key.
4. Run `yarn dev` to start the application on [http://localhost:3000](http://localhost:3000/).

## Testing

- `yarn test` to run the full Jest suite.
- `yarn test ./path/to/test.ts` to run an individual test file.
- `yarn test --watch` to watch for changes.
- `yarn e2e` to run end-to-end tests in UI mode.
- `yarn e2e:headless` to run run end-to-end tests in headless mode.

> Note: When running E2E tests, the application runs with the `--no-experimental-fetch` node flag.
> This is because the HTTP mocking library [nock](https://github.com/nock/nock) does not support Node 18's native fetch function. See [relevant issue](https://github.com/nock/nock/issues/2183).

## CI & CD

- The Continuous Integration pipeline runs on every Pull Request.
- Merging to `main` triggers our CI pipeline and deploys the application with [Vercel](https://vercel.com/).
