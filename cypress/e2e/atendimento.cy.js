import { longText, data } from "../../src/consts/constants";

describe("Central de Atendimento ao Cliente", () => {
  beforeEach(() => {
    cy.clock();
    cy.visit("./src/index.html");
  });
  it("Verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente");
  });

  it("Preenche os campos obrigatórios e envia o formulário", () => {
    cy.get("#firstName").type("Jhony");
    cy.get("#lastName").type("Pereira");
    cy.get("#email").type("jhony.silva@example.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success")
      .should("be.visible")
      .should("contain", "Mensagem enviada com sucesso.");
    cy.tick(2999);
    cy.get(".success").should("be.visible");
    cy.tick(1);
    cy.get(".success").should("not.be.visible");
  });

  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.get("#firstName").type("Jhony");
    cy.get("#lastName").type("Pereira");
    cy.get("#email").type("jhony.silva@invalid-email");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".error")
      .should("be.visible")
      .should("contain", "Valide os campos obrigatórios");
    cy.tick(2999);
    cy.get(".error").should("be.visible");
    cy.tick(1);
    cy.get(".error").should("not.be.visible");
  });

  it("Campo telefone continua vazio quando preenchido com valor não numérico", () => {
    cy.get("#phone").type("abcdefghij").should("have.value", "");
  });

  it("Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Jhony");
    cy.get("#lastName").type("Pereira");
    cy.get("#email").type("jhony.silva@example.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(2999);
    cy.get(".error").should("be.visible");
    cy.tick(1);
    cy.get(".error").should("not.be.visible");
  });

  it("Preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Jhony")
      .should("have.value", "Jhony")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Pereira")
      .should("have.value", "Pereira")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("jhony.silva@example.com")
      .should("have.value", "jhony.silva@example.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("1234567890")
      .should("have.value", "1234567890")
      .clear()
      .should("have.value", "");
  });

  it("Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.contains("button", "Enviar").click();
    cy.get(".error")
      .should("be.visible")
      .should("contain", "Valide os campos obrigatórios");
    cy.tick(2999);
    cy.get(".error").should("be.visible");
    cy.tick(1);
    cy.get(".error").should("not.be.visible");
  });

  it("Envia o formulário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success")
      .should("be.visible")
      .should("contain", "Mensagem enviada com sucesso.");
    cy.tick(2999);
    cy.get(".success").should("be.visible");
    cy.tick(1);
    cy.get(".success").should("not.be.visible");
  });
  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube");
    cy.get("#product").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria");
    cy.get("#product").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1);
    cy.get("#product").should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[value="feedback"]').check();
    cy.get('input[value="feedback"]').should("be.checked");
    cy.get('input[value="ajuda"]').should("not.be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]').each(($radio) => {
      cy.wrap($radio).check();
      cy.wrap($radio).should("be.checked");
      cy.get('input[type="radio"]:checked').should("have.length", 1);
    });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]').check();
    cy.get('input[type="checkbox"]').should("be.checked");
    cy.get("#phone").should("have.prop", "required", true);
    cy.get(".phone-label-span").should("be.visible");
    cy.get('input[type="checkbox"]').last().uncheck();
    cy.get('input[type="checkbox"]').last().should("not.be.checked");
    cy.get("#email-checkbox").should("be.checked");
    cy.get("#phone").should("have.prop", "required", false);
    cy.get(".phone-label-span").should("not.be.visible");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get("#file-upload").selectFile("cypress/fixtures/example.json");
    cy.get("#file-upload").its("0.files.0.name").should("eq", "example.json");
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("#file-upload").selectFile("cypress/fixtures/example.json", {
      action: "drag-drop",
    });
    cy.get("#file-upload").its("0.files.0.name").should("eq", "example.json");
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json", null).as("arquivo");
    cy.get("#file-upload").selectFile("@arquivo");
    cy.get("#file-upload").its("0.files.0.name").should("eq", "example.json");
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "target", "_blank");
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.contains("a", "Política de Privacidade").invoke("removeAttr", "target");
    cy.contains("a", "Política de Privacidade").click();
    cy.location("pathname").should("eq", "/src/privacy.html");
    cy.get("h1").should("have.text", "Central de Atendimento - Política de Privacidade");
  });

  Cypress._.times(3, (index) => {
    it(`envia dados personalizados com comando customizado (execução ${index + 1})`, () => {
      cy.fillMandatoryFieldsAndSubmit(data);
      cy.get(".success").should("be.visible").and("contain", "Mensagem enviada com sucesso.");
      cy.tick(2999);
      cy.get(".success").should("be.visible");
      cy.tick(1);
      cy.get(".success").should("not.be.visible");
    });
  });

  it("exibe e oculta as mensagens de sucesso e erro usando .invoke()", () => {
    cy.get(".success").should("not.be.visible")
      .invoke("show").should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.");
    cy.get(".success").invoke("hide").should("not.be.visible");
    cy.get(".error").should("not.be.visible")
      .invoke("show").should("be.visible")
      .and("contain", "Valide os campos obrigatórios!");
    cy.get(".error").invoke("hide").should("not.be.visible");
  });

  it("preenche o campo da área de texto usando o comando invoke", () => {
    const text = Cypress._.repeat("Testando a aplicação Central de Atendimento. ", 20);
    cy.get("#open-text-area").invoke("val", text);
    cy.get("#open-text-area").should("have.value", text);
  });

  it("encontra o gato escondido e demonstra que está visível", () => {
    cy.get("#cat").should("not.be.visible").and("contain", "🐈");
    cy.get("#cat").invoke("show").should("be.visible");
  });
});
