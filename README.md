# Photo Search

Hello! 👋🏽 I'm Rafael Huaman.

This is my solution of the [Photo Search exercise](docs/00-exercise-description.md).

I approached this exercise as an actual project, ensuring the application was well-tested and included build and deployment pipelines.

The links below include the project documentation and Testing Guidelines, an example of the guides I like to have in my projects to help the team.

I also added an Improvements section to capture things I didn't do but identified as potential improvements.

## Solution Highlights

- A "masonry layout" for photo display
- Prefetching "next pages" for a better user experience.
- Using a blur placeholder while the images are loading based on the average color of the photo returned by the Pexels API.
- Full test suite and end-to-end tests.
- Next.js server-side-rendering.
- The Next.js API server acts as a backend-for-frontend (BFF).
  - The BFF prevents API credentials from leaking to the front end.
  - The BFF limits the response size returned to the browser.

## Quick Links

- [Live App](https://pexels-ten.vercel.app/) (cold start)

## Project Documentation

- [Getting Started](docs/01-getting-started.md)
- [System Overview](docs/02-system-overview.md)
- [Testing Guidelines](docs/03-testing-guidelines.md)
- [Improvements](docs/04-improvements.md)
- [Exercise Description](docs/00-exercise-description.md)
