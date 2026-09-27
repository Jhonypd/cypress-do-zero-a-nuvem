const selectors = {
  email: "#_r_0_",
  password: "#_r_1_",
  menu: ":nth-child(7) > .css-fiyw4e",
  groups: '[aria-label="Cadastro dos Grupos que definem as permissões e características dos Usuários do sistema"] > .MuiButtonBase-root',
  name: ".css-1bcz5a4 > .MuiFormControl-root > .MuiInputBase-root",
  description: ".css-ci1t9m > .MuiFormControl-root > .MuiInputBase-root",
  profile: '[name="TipoPerfil"] > .MuiFormControl-root > .MuiInputBase-root',
  menuOptions: '[aria-colindex="2"] > .MuiDataGrid-columnHeaderDraggableContainer > .MuiDataGrid-columnHeaderTitleContainer > .MuiDataGrid-columnHeaderTitleContainerContent > .MuiButtonBase-root',
  mobileAccess: '[aria-colindex="3"] > .MuiDataGrid-columnHeaderDraggableContainer > .MuiDataGrid-columnHeaderTitleContainer > .MuiDataGrid-columnHeaderTitleContainerContent > .MuiButtonBase-root',
  save: '.css-kug113 > .MuiButton-contained',
  notification: ".MuiSnackbar-root > .MuiPaper-root",
  row: ".MuiDataGrid-row",
  rowCheckbox: '.MuiDataGrid-cellCheckbox input[type="checkbox"]',
  delete: '[aria-label="Excluir"] > .MuiButtonBase-root',
  confirmation: '[role="dialog"]',
  confirmDelete: ".MuiDialogActions-root > div > .MuiButton-contained",
};

describe("Aktian — grupos de usuários", () => {
  beforeEach(() => {
    cy.env([
      "URL_HTTPS_AKTIAN",
      "USER_AKTIAN",
      "PASSWORD_USER_AKTIAN",
    ]).then(({ URL_HTTPS_AKTIAN, USER_AKTIAN, PASSWORD_USER_AKTIAN }) => {
      if (!URL_HTTPS_AKTIAN || !USER_AKTIAN || !PASSWORD_USER_AKTIAN) {
        throw new Error(
          "Configure URL_HTTPS_AKTIAN, USER_AKTIAN e PASSWORD_USER_AKTIAN no cypress.env.json ou no CI.",
        );
      }

      cy.visit(URL_HTTPS_AKTIAN);
      cy.get(selectors.email).should("be.visible").type(USER_AKTIAN, { log: false });
      cy.get(selectors.password)
        .should("be.visible")
        .and("have.attr", "type", "password")
        .type(PASSWORD_USER_AKTIAN, { log: false });
      cy.contains("button", /^ENTRAR$/i).should("be.enabled").click();
    });

    cy.get(selectors.menu).should("be.visible");
  });

  it("cadastra grupo com menus e acesso mobile e exclui o registro criado", () => {
    const group = {
      name: `Grupo teste ${Date.now().toString(36)}-${Cypress._.random(100000, 999999)}`,
      description: "Grupo de trabalho para validar testes",
    };
    const groupName = new RegExp(`^${Cypress._.escapeRegExp(group.name)}$`);

    cy.get(selectors.menu).click();
    cy.get(selectors.groups).should("be.visible").click();
    cy.contains("button", /^INCLUIR$/i).should("be.enabled").click();
    cy.contains("Incluir - Grupo de Usuário").should("be.visible");

    cy.get(selectors.name).find("input").as("groupName");
    cy.get("@groupName").should("be.visible").type(group.name);
    cy.get("@groupName").should("have.value", group.name);

    cy.get(selectors.description)
      .find("input, textarea")
      .filter(":visible")
      .as("groupDescription");
    cy.get("@groupDescription").should("have.length", 1).type(group.description);
    cy.get("@groupDescription").should("have.value", group.description);

    cy.get(selectors.profile).find("input").as("profile");
    cy.get(selectors.profile).click();
    cy.get('[id$="-option-2"]')
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const profileName = text.trim();
        expect(profileName, "nome do perfil disponível").not.to.be.empty;
        cy.get('[id$="-option-2"]').click();
        cy.get("@profile").should("have.value", profileName);
      });

    cy.get("@groupName").should("have.value", group.name);
    cy.get("@groupDescription").should("have.value", group.description);

    cy.get(selectors.menuOptions).should("be.visible").click();
    cy.get(selectors.mobileAccess).should("be.visible").click();

    cy.contains(selectors.save, /^SALVAR$/i)
      .should("be.visible")
      .and("be.enabled")
      .click();

    cy.contains(selectors.notification, "Operação executada com sucesso")
      .should("be.visible");

    cy.contains(`${selectors.row} .MuiDataGrid-cell`, groupName)
      .closest(selectors.row)
      .as("createdGroup");
    cy.get("@createdGroup").should("be.visible");
    cy.get("@createdGroup").find(selectors.rowCheckbox).check();
    cy.get("@createdGroup").find(selectors.rowCheckbox).should("be.checked");
    cy.get(`${selectors.row}[aria-selected="true"]`)
      .should("have.length", 1)
      .and("contain.text", group.name);

    cy.get(selectors.delete).should("be.visible").and("be.enabled").click();
    cy.get(selectors.confirmation).should("be.visible").within(() => {
      cy.contains(selectors.confirmDelete, /^SIM$/i)
        .should("be.visible")
        .and("be.enabled")
        .click();
    });

    cy.contains(selectors.notification, "Registro excluído com sucesso!")
      .should("be.visible");
    cy.contains(`${selectors.row} .MuiDataGrid-cell`, groupName)
      .should("not.exist");
  });
});
