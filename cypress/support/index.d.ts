export interface MockParams {
  hostname: string;
  path: string;
  query: Record<string, any>;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  statusCode: number;
  body: Record<string, any>;
}

declare global {
  declare namespace Cypress {
    interface Chainable {
      /**
       * Mocks a server-side external HTTP request
       * @example cy.interceptServer({
          hostname: "https://example.com",
          method: "GET",
          path: "/posts",
          query: { page: 1, per_page: 10 },
          statusCode: 200,
          body: posts,
        });
       */
      interceptServer(mockParams: MockParams): Chainable<Cypress.Response<any>>;
      /**
       * Prevents unmocked server-side external HTTP requests.
       */
      disableNetConnect(): Chainable<Cypress.Response<any>>;
      /**
       * Cleans server-side external HTTP request mocks.
       */
      resetServerInterceptors(): Chainable<Cypress.Response<any>>;
    }
  }
}
