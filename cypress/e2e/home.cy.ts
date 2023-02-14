describe("Home", () => {
  it("displays hello world", () => {
    cy.visit("/");
    cy.findByText(/hello world/i).should("be.visible");
  });
});
