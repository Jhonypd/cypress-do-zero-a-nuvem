describe("Requisição HTTP", () => {
  it("faz uma requisição HTTP", () => {
    cy.intercept("GET", "**/src/index.html").as("pagina");
    cy.visit("./src/index.html");
    cy.wait("@pagina").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.headers["content-type"]).to.include("text/html");
      expect(response.body).to.include("Central de Atendimento");
    });
  });
});
