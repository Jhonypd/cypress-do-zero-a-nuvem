declare namespace Cypress {
  interface Chainable {
    fillMandatoryFieldsAndSubmit(data?: {
      firstName: string;
      lastName: string;
      email: string;
      text: string;
    }): Chainable<JQuery<HTMLButtonElement>>;
  }
}
