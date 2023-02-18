# Testing Guide

## Testing is part of our system

Our tests give us confidence.

- [Confidence to deploy to production at any time](https://www.martinfowler.com/articles/continuousIntegration.html)
- Confidence that our changes are not breaking previous functionality.
- Confidence to [continuously improve the design of our system](http://www.extremeprogramming.org/rules/refactor.html).

Because of this, our tests are an integral part of our system and software development process. Therefore our tests are first-class artifacts: we keep them clean, readable, and easy to maintain.

Recommended reading: [Self-testing code](https://martinfowler.com/bliki/SelfTestingCode.html) by Martin Fowler

## Testing in Photo Search

We test **all behavior** in the application.

### Rules of thumb

- If it can break, write a test for it.
- Write the tests you would like to have if you had to refactor the whole feature.
- Add tests for bug fixes.
- Add tests for edge cases.
- Pull Requests need tests to get approval.
- If you see a missing test in a pull request, mark it as "request changes".

### What makes a good test?

[Test Desiderata](https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3) by Kent Beck.

### What types of tests should I write?

In the Photo Search application, the following tests are valuable:

#### Backend Tests

- Tests for the API endpoints
  - Expected return records
  - Expected effects (CRUD) and persistence
  - Expected side-effects: External API requests, e-mails sent, etc.
  - Filters and other options
  - Error cases
  - Authorization

##### Recommended reading

- In the backend, we follow the [Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)

#### Frontend tests

- Comprehensive integration tests for the "page" component.
  - Test that your props, state, and data are all getting rendered correctly
  - Test that all user interactions have the desired effect on the DOM
  - Test any side effects, such as making sure that the correct network call was made with the right payload (i.e., `toBeCalledWith(myArguments)`)
  - Avoid snapshot tests ([use sparingly](https://kentcdodds.com/blog/effective-snapshot-testing)).
  - Use [jest-axe](https://github.com/nickcolley/jest-axe) to check for accessibility issues.
- Comprehensive unit tests for complex components.
- We avoid testing _implementation details_.

##### Recommended reading

- In the frontend, we follow the [Testing trophy](https://kentcdodds.com/blog/write-tests)
- [React testing library tips](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

#### System tests

- Cypress E2E tests for critical user flows
  - Mostly happy paths

##### Recommended reading

- [Cypress Best practices](https://docs.cypress.io/guides/references/best-practices.html#Creating-%E2%80%9Ctiny%E2%80%9D-tests-with-a-single-assertion) by cypress.io

### What types of tests should I skip?

We don't think we need to test the following:

- Static styles
- Routes
- Implementation details

## FAQ

### Should we test our external libraries?

- Don't test the implementation of the external libraries. Their maintainers should have tested them already. Instead, _test that we are using them correctly_. For example, when using a date formatting library, you don't need to test their `format()` function exhaustively; instead, test that the components using the library are working as expected.
- Write tests that would still work even if we switch libraries.

- When selecting a library to add to our project, choose one that is well-tested and well-maintained.

### I don't know how to test X; what should I do?

- Look for similar examples in the code. If you don't know what examples are relevant, contact the team. We will point you in the right direction or pair with you to write the tests together.

### What about test coverage?

- Keep it high.
- Don't obsess over it. It is just a flag to let us know if our coverage is slipping or increasing. Any number we choose would be arbitrary (Why is 80% good? Why not 79%? Why not 81%?)
- The number is just a data point without context. To take meaningful action, we need more information. For example, we need to know what part of the application is business-critical, has many production bugs, or is used heavily.
- In general, though, increasing test coverage is good, so aim to improve rather than reduce it. If maintaining high test coverage is causing pain or affecting the speed of feedback cycles, it might be time to take a step back and evaluate what's causing the pain.

##### Recommended reading

- [TestCoverage](https://martinfowler.com/bliki/TestCoverage.html) by Martin Fowler
- [StackOverflow discussion on test coverage](https://stackoverflow.com/questions/90002/what-is-a-reasonable-code-coverage-for-unit-tests-and-why)
