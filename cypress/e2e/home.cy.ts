import {
  mockPexelsEmptyPageResponse,
  mockPexelsPhotosResponse,
  mockPexelsPhotosSecondPageResponse,
} from "@/mockData/pexels";

describe("Home", () => {
  it("displays and paginates curated photos", () => {
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//curated",
      query: { page: 1, per_page: 10 },
      statusCode: 200,
      body: mockPexelsPhotosResponse,
    });

    // Prefetching second page
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//curated",
      query: { page: 2, per_page: 10 },
      statusCode: 200,
      body: mockPexelsPhotosSecondPageResponse,
    });

    cy.visit("/");

    cy.findByText(mockPexelsPhotosResponse.photos[0].photographer).should(
      "be.visible"
    );
    cy.findByAltText(mockPexelsPhotosResponse.photos[1].alt).should(
      "be.visible"
    );

    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//curated",
      query: { page: 2, per_page: 10 },
      statusCode: 200,
      body: mockPexelsEmptyPageResponse,
    });
    cy.findByRole("button", { name: /next/i }).should("be.visible").click();

    cy.findByText(
      mockPexelsPhotosSecondPageResponse.photos[0].photographer
    ).should("be.visible");
    cy.findByText(mockPexelsPhotosResponse.photos[0].photographer).should(
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
