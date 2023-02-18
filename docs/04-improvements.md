# Improvements

- Reduce some duplication by extracting pagination components and Pexel API response transformation logic.
  - I considered attempting this refactor but I didn't want to create a premature abstraction. Additionally, search and curation are separate concerns and have the potential to evolve in different directions. So I followed the [Three strikes rule](https://wiki.c2.com/?ThreeStrikesAndYouRefactor) and decided to wait.
- Custom 404 and 500 error pages
- [Configure Color Mode for SSR](https://chakra-ui.com/docs/styled-system/color-mode#add-colormodemanager-optional-for-ssr)
- Apply a consistent API response structure to the endpoints.
- Add an API middleware like [next-connect](https://github.com/hoangvvo/next-connect) to reduce some error handling duplication.
- Configure an error reporting tool like Sentry and Application Performance Monitoring.
- Add a vulnerability audit, `yarn audit`, to the continuous integration pipeline.
