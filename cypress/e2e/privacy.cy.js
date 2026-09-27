describe("Política de Privacidade", () => {
  it("testa a página da política de privacidade de forma independente", () => {
    cy.visit("./src/privacy.html");
    cy.title().should(
      "be.equal",
      "Central de Atendimento ao Cliente - Política de Privacidade",
    );
    cy.get('[data-testid="privacy-title"]')
      .should("be.visible")
      .and("have.text", "Central de Atendimento - Política de Privacidade");
    cy.get('[data-testid="privacy-content"]')
      .should("be.visible")
      .and("contain.text", "os dados preenchidos não são enviados a um servidor nem armazenados.");
    cy.get('[data-testid="privacy-footer"]')
      .should("be.visible")
      .and("have.text", "Central de Atendimento");
  });
});
