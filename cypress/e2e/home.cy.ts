import { mockPexelsCuratedPhotosResponse } from "@/mockData/pexels";

describe("Home", () => {
  it("displays hello world", () => {
    cy.disableNetConnect();
    cy.interceptServer({
      hostname: "https://api.pexels.com",
      method: "GET",
      path: "/v1//curated",
      query: { page: 1, per_page: 10 },
      statusCode: 200,
      body: mockPexelsCuratedPhotosResponse,
    });

    cy.visit("/");
    cy.findByText(
      mockPexelsCuratedPhotosResponse.photos[0].photographer
    ).should("be.visible");

    cy.findByAltText(mockPexelsCuratedPhotosResponse.photos[1].alt).should(
      "be.visible"
    );
  });
});
