# Project Brief

Build a website to let users browse photos from [Pexels](https://www.pexels.com/) (see below for notes on [getting an API key](#getting-a-pexels-api-key)). There is much online competition in the photo space, and to stand
out, we need a lightning-fast solution to load with a snappy, responsive UI. In addition, we must greet site visitors with a selection of curated photos and allow them to search our extensive catalog of quality photos from professional photographers.

## Minimum requirements

The solution needs to satisfy all of these. Beyond these, the implementation is unconstrained. Use tools, libraries, and frameworks you think best accomplish the task. (See below user stories for these requirements)

- Display 10 curated photos on the home screen. Use the Pexels curated photos resource to render these photos.
- Provide pagination for Curated photos. Paging should not cause a page refresh. From the client side, initiate the needed requests to allow the user to go forward and backward.
- Provide a photo search. Searching should not cause a page refresh. Consume the photo search resource and display the results to the user, along with pagination, if needed.

These are the requirements for an MVP. Beyond these, dig into any areas as deep as you like.

## Suggested Extras

- Implement a server that wraps the Pexels API, providing one or more of the following features:
  - Maintain your application API key on the server, and avoid exposing it to the client.
  - Server-side rendering
- Write tests.
- Add placeholder content for images before they're loaded.

## User stories

The solution needs to satisfy all of these.

As a user visiting the website...

- I can see an initial set of curated photos on the home screen
- I can access the photographer's name and URL if those details are available for every photo
- I can paginate the list of curated photos
- I can use text input to search for images I am interested
- I can see the results of my search in the photo viewing area
- I can paginate search results if needed
- I should not be shown the "previous" pagination button without a previous page available.
- I can refresh my browser and retain my search query and page.

As a developer working on the project locally...

- I can access all project-specific local setup instructions to run the project.
- I can install any required dependencies with npm or yarn
- I can compile and run the project in one step

## Getting a Pexels API Key

To work with the Pexels API, you need an API key. To get a key;

- Create a free Pexels account
  - <https://www.pexels.com/onboarding>
  - Follow "I want to download."
  - Complete the form. Make sure you use a valid email address
- Confirm your email
- Visit the Image & Video API section of your account
- Provide a description and a URL. These can be fake. Feel free to use the examples below or write your own
  - Example description: "I'm using the API for a programming practice project."
  - Example URL: <https://example.com>
