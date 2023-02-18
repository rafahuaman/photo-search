import {
  mockPexelsEmptyPageResponse,
  mockPexelsPhotosResponse,
  mockPexelsPhotosSecondPageResponse,
} from "@/mockData/pexels";

describe("Search", () => {
  it("displays and paginates search results", () => {
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//search",
      query: { page: 1, per_page: 10, query: "cats" },
      statusCode: 200,
      body: mockPexelsPhotosResponse,
    });

    // Prefetching the second page
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//search",
      query: { page: 2, per_page: 10, query: "cats" },
      statusCode: 200,
      body: mockPexelsPhotosSecondPageResponse,
    });

    cy.visit("/search");

    cy.findByRole("heading", { name: /welcome!/i }).should("be.visible");

    cy.findByPlaceholderText(/search/i).type("cats{enter}");

    cy.findByAltText(mockPexelsPhotosResponse.photos[0].alt).should(
      "be.visible"
    );
    cy.findByAltText(mockPexelsPhotosResponse.photos[1].alt).should(
      "be.visible"
    );

    // Prefetching the third page
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//search",
      query: { page: 3, per_page: 10, query: "cats" },
      statusCode: 200,
      body: mockPexelsEmptyPageResponse,
    });

    cy.findByRole("button", { name: /next/i }).should("be.visible").click();

    cy.findByText(
      mockPexelsPhotosSecondPageResponse.photos[0].photographer
    ).should("be.visible");
    cy.findByAltText(mockPexelsPhotosResponse.photos[0].alt).should(
      "not.exist"
    );
    cy.findByRole("button", { name: /next/i }).should("not.exist");

    cy.findByRole("button", { name: /previous/i })
      .should("be.visible")
      .click();

    cy.findByRole("button", { name: /previous/i }).should("not.exist");

    cy.findByText(mockPexelsPhotosResponse.photos[0].photographer).should(
      "be.visible"
    );
    cy.findByText(
      mockPexelsPhotosSecondPageResponse.photos[0].photographer
    ).should("not.exist");
  });
});
