Cypress.Commands.add(
  "fillMandatoryFieldsAndSubmit",
  (
    data = {
      firstName: "José",
      lastName: "Pereira",
      email: "jose.pereira@example.com",
      text: "Lorem ipsum dolor sit amet...",
    },
  ) => {
    cy.get("#firstName").type(data.firstName);
    cy.get("#lastName").type(data.lastName);
    cy.get("#email").type(data.email);
    cy.get("#open-text-area").type(data.text, { delay: 0 });
    cy.contains("button", "Enviar").click();
  },
);
