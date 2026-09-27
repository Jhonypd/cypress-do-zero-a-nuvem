describe("Política de Privacidade", () => {
  it("testa a página da política de privacidade de forma independente", () => {
    cy.visit("./src/privacy.html");
    cy.title().should(
      "be.equal",
      "Central de Atendimento ao Cliente - Política de Privacidade",
    );
    cy.contains(
      "h1",
      "Central de Atendimento - Política de Privacidade",
    ).should("be.visible");
    cy.contains("p", "Central de Atendimento").should("be.visible");
  });
});
