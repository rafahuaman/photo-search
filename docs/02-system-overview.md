# System Overview

## Language, Framework, and Runtime

- [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/) running on [Node.js](https://nodejs.org/en/) v18.x.

### Application UI

- [React](https://reactjs.org/) v18 to build our components.
- [Chakra UI](https://chakra-ui.com/) to build and style our UI.
- [react-hook-form](https://react-hook-form.com/) for forms.

### Application Data Layer

- [TanStack Query](https://tanstack.com/query/v3//) for data fetching and asynchronous state management.

### Linting & Formatting

- [ESLint](https://eslint.org/) for linting.
- [Prettier](https://prettier.io/) for formatting
- [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) for fixing and autoformatting on git commit.

### Testing

- [Jest](https://jestjs.io/) for unit and integration tests.
- [Cypress](https://www.cypress.io/) for end-to-end tests.

### Project Structure

- `/docs` Documentation
- `/public` Public static assets
- `/src` Application source code
  - `__tests__` Tests for pages and API endpoints
  - `/components` Reusable core components
    - `/layout` Layout components
  - `/hooks` Custom hooks
  - `/constants` Global constants
  - `/types` TypeScript type definitions
  - `/mockData` Mock data used in tests
  - `/utils` Utility functions
  - `/pages` File-based server-side routing for pages and API endpoints
- `/cypress` End-to-end tests
- `/.github/workflows` Github Action Workflows
