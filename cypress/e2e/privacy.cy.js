describe("Política de Privacidade", () => {
  it("testa a página da política de privacidade de forma independente", () => {
    cy.visit("./src/privacy.html");
    cy.title().should("eq", "Central de Atendimento ao Cliente - Política de Privacidade");
    cy.get("h1").should("have.text", "Central de Atendimento - Política de Privacidade");
    cy.get(".privacy p").should("have.length", 4);
    cy.contains("p", "Não salvamos dados submetidos no formulário da aplicação Central de Atendimento.").should("be.visible");
    cy.contains("p", "Utilizamos HTML, CSS e JavaScript para demonstrar o funcionamento de um formulário de atendimento.").should("be.visible");
    cy.contains("p", "Esta aplicação é uma demonstração: os dados preenchidos não são enviados a um servidor nem armazenados.").should("be.visible");
    cy.contains("p", "Central de Atendimento").should("be.visible");
  });
});
