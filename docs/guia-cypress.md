# Guia interno de automação de testes com Cypress

## 1. Objetivo

Este material foi criado a partir do estudo e da implementação prática de testes automatizados com Cypress.

A ideia é deixar uma referência inicial para quem precisar entender como o Cypress funciona, como configurar um projeto e como começar a automatizar alguns cenários comuns do sistema.

Durante o estudo utilizei uma aplicação simples de atendimento ao cliente para praticar os principais recursos da ferramenta. Os exemplos mostrados neste guia estão implementados neste próprio repositório, então é possível consultar o teste completo e executar os cenários localmente.

---

## 2. Automação de testes e onde o Cypress entra

A principal ideia por trás da automação é não precisar repetir manualmente todas as mesmas validações sempre que uma funcionalidade for alterada.

Por exemplo, se existe um formulário com nome, e-mail, telefone e mensagem, podemos ter um teste que abre a tela, preenche os campos, envia o formulário e verifica o resultado.

No projeto deste estudo fiz exatamente esse tipo de cenário:

```js
cy.get("#firstName").type("Jhony");
cy.get("#lastName").type("Pereira");
cy.get("#email").type("jhony.silva@example.com");

cy.contains("button", "Enviar").click();

cy.get(".success").should("be.visible");
```

Isso não significa substituir os testes manuais. Existem cenários exploratórios, alterações visuais e situações específicas em que a validação manual continua sendo importante.

O ponto é automatizar principalmente aquilo que é repetitivo e que precisa continuar funcionando após novas alterações.

Alguns bons candidatos para automação são:

- fluxos importantes para o sistema;
- cenários que são testados com frequência;
- regras bem definidas;
- pontos que já apresentaram regressões;
- validações repetitivas que hoje exigem trabalho manual.

---

## 3. O que é Cypress

Cypress é uma ferramenta de automação de testes voltada principalmente para aplicações web.

Com ela é possível controlar o navegador por código, interagir com elementos da tela e validar o comportamento da aplicação.

Um exemplo simples:

```js
cy.visit("./src/index.html");

cy.get("#firstName").type("Jhony");

cy.contains("button", "Enviar").click();
```

Nesse caso o Cypress acessa a página, encontra um campo, preenche o valor e depois clica no botão.

Além das ações, também podemos fazer verificações:

```js
cy.get(".success")
  .should("be.visible")
  .and("contain", "Mensagem enviada com sucesso.");
```

No projeto utilizei o Cypress para testar:

- formulários;
- campos obrigatórios;
- selects;
- radio buttons;
- checkboxes;
- upload de arquivos;
- navegação entre páginas;
- mensagens temporárias;
- requisições HTTP;
- diferentes tamanhos de viewport;
- execução automática em CI.

---

## 4. Preparando o projeto

### 4.1 Pré-requisitos

Para este projeto utilizei:

- Node.js 22;
- npm;
- Cypress.

Depois de clonar o repositório, as dependências podem ser instaladas com:

```sh
npm ci
```

Como o projeto possui `package-lock.json`, o `npm ci` instala as versões registradas no lockfile.

### 4.2 Abrindo o Cypress

Para abrir a interface interativa:

```sh
npm run cy:open
```

Esse modo é útil durante o desenvolvimento porque permite acompanhar visualmente cada comando executado pelo teste.

### 4.3 Execução headless

Para executar os testes sem abrir a interface gráfica:

```sh
npm test
```

Esse é o formato utilizado normalmente em pipelines de integração contínua.

### 4.4 Execução mobile

O projeto também possui comandos para executar os testes com viewport mobile.

Modo interativo:

```sh
npm run cy:open:mobile
```

Modo headless:

```sh
npm run test:mobile
```

---

## 5. Configuração do Cypress

A configuração principal do projeto está em:

```text
cypress.config.js
```

Configuração atual:

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 880,
  viewportWidth: 1280,
  e2e: {},
  video: true,
  projectId: "1reb2u",
});
```

Os principais pontos dessa configuração são:

- `viewportWidth` e `viewportHeight`: definem o tamanho padrão do navegador durante os testes;
- `e2e`: configuração dos testes end-to-end;
- `video`: habilita a gravação das execuções;
- `projectId`: identifica o projeto utilizado no Cypress Cloud.

---

## 6. Estrutura utilizada no projeto

A parte principal relacionada aos testes ficou organizada desta forma:

```text
cypress/
├── e2e/
│   ├── atendimento.cy.js
│   ├── http.cy.js
│   └── privacy.cy.js
├── fixtures/
│   └── example.json
└── support/
    ├── commands.js
    └── e2e.js
```

### `cypress/e2e`

Contém os arquivos de testes.

No projeto:

- `atendimento.cy.js`: concentra os principais cenários do formulário;
- `privacy.cy.js`: testa a página de política de privacidade de forma separada;
- `http.cy.js`: contém um exemplo de validação HTTP.

### `cypress/fixtures`

Contém arquivos utilizados como dados de apoio durante os testes.

Neste projeto existe:

```text
cypress/fixtures/example.json
```

Ele é utilizado nos cenários de upload.

### `cypress/support`

É utilizado para configurações e comandos compartilhados.

O comando customizado criado durante o estudo está em:

```text
cypress/support/commands.js
```

---

## 7. Estrutura básica dos testes

Um teste simples pode ser escrito assim:

```js
describe("Central de Atendimento ao Cliente", () => {
  it("Verifica o título da aplicação", () => {
    cy.visit("./src/index.html");

    cy.title().should(
      "be.equal",
      "Central de Atendimento ao Cliente"
    );
  });
});
```

O `describe` agrupa testes relacionados e o `it` representa um cenário de teste.

Uma coisa que considerei importante durante o estudo foi dar nomes claros para os cenários.

Por exemplo:

```js
it("Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
```

é muito melhor para identificar uma falha do que algo genérico como:

```js
it("teste formulário", () => {
```

### Hooks

Quando uma ação precisa acontecer antes de vários testes, podemos utilizar hooks.

Neste projeto:

```js
beforeEach(() => {
  cy.clock();
  cy.visit("./src/index.html");
});
```

O `beforeEach` é executado antes de cada teste daquele bloco.

Isso evita repetir a abertura da página em todos os cenários.

---

## 8. Interações e verificações mais utilizadas

### Localizando elementos

Um dos comandos mais utilizados é:

```js
cy.get("#firstName");
```

Também podemos localizar elementos pelo texto exibido:

```js
cy.contains("button", "Enviar");
```

### Digitação

```js
cy.get("#firstName").type("Jhony");
```

### Limpeza de campo

```js
cy.get("#firstName").clear();
```

### Clique

```js
cy.contains("button", "Enviar").click();
```

### Assertions

As assertions verificam se o resultado apresentado pela aplicação está correto.

Exemplo:

```js
cy.get(".success").should("be.visible");
```

Também podemos verificar o conteúdo:

```js
cy.get(".success")
  .should("be.visible")
  .and("contain", "Mensagem enviada com sucesso.");
```

Ou o valor de um campo:

```js
cy.get("#firstName").should("have.value", "Jhony");
```

---

## 9. Exemplos que implementei

### 9.1 Campos obrigatórios

Um dos cenários implementados verifica o envio do formulário sem preencher os campos obrigatórios.

```js
it("Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
  cy.contains("button", "Enviar").click();

  cy.get(".error")
    .should("be.visible")
    .should("contain", "Valide os campos obrigatórios");
});
```

Esse é um tipo de teste simples, mas que pode ser aplicado em vários cadastros.

### 9.2 Select

Para campos do tipo `select`, utilizei:

```js
cy.get("#product").select("YouTube");

cy.get("#product").should("have.value", "youtube");
```

Também testei seleção pelo `value`:

```js
cy.get("#product").select("mentoria");
```

e por índice:

```js
cy.get("#product").select(1);
```

### 9.3 Radio button

```js
cy.get('input[value="feedback"]').check();

cy.get('input[value="feedback"]').should("be.checked");
```

### 9.4 Checkbox

Para marcar:

```js
cy.get("#phone-checkbox").check();
```

Para desmarcar:

```js
cy.get("#phone-checkbox").uncheck();
```

Nesse tipo de campo considero mais claro utilizar `check()` e `uncheck()` do que apenas `click()`, porque o teste deixa explícita a intenção.

### 9.5 Upload de arquivos

O Cypress possui o comando `selectFile()`.

Exemplo utilizado no projeto:

```js
cy.get("#file-upload")
  .selectFile("cypress/fixtures/example.json")
  .should((input) => {
    expect(input[0].files[0].name).to.equal("example.json");
  });
```

Também testei upload simulando drag-and-drop:

```js
cy.get("#file-upload").selectFile(
  "cypress/fixtures/example.json",
  { action: "drag-drop" }
);
```

### 9.6 Navegação

Também foi criado um teste para validar o link da política de privacidade:

```js
cy.contains("a", "Política de Privacidade")
  .should("have.attr", "href", "privacy.html")
  .and("have.attr", "target", "_blank");
```

Em outro cenário removi o `target` para permitir que o Cypress seguisse o link na mesma aba:

```js
cy.contains("a", "Política de Privacidade")
  .invoke("removeAttr", "target")
  .click();
```

---

## 10. Reutilização de código

### 10.1 Fixtures

Fixtures são arquivos que podem ser utilizados como dados durante os testes.

No projeto:

```js
cy.fixture("example.json").as("arquivo");
```

Depois o alias pode ser utilizado no teste:

```js
cy.get("#file-upload").selectFile("@arquivo");
```

### 10.2 Custom commands

Durante o estudo também criei um comando customizado para evitar repetir o preenchimento dos campos obrigatórios.

O comando ficou em:

```text
cypress/support/commands.js
```

Implementação:

```js
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
```

Depois ele pode ser utilizado assim:

```js
cy.fillMandatoryFieldsAndSubmit();
```

Achei útil principalmente porque esse fluxo aparece mais de uma vez.

Ao mesmo tempo, não vejo vantagem em transformar qualquer sequência pequena de comandos em custom command. Para mim faz mais sentido quando existe reutilização real.

---

## 11. Controle de tempo com `cy.clock()` e `cy.tick()`

Uma situação que apareceu nos testes foi a mensagem de sucesso e erro da aplicação, que permanece visível por três segundos.

A primeira opção seria realmente esperar os três segundos, mas isso deixaria a suíte mais lenta.

Por isso utilizei:

```js
cy.clock();
```

antes de carregar a página e depois:

```js
cy.tick(2999);
cy.get(".success").should("be.visible");

cy.tick(1);
cy.get(".success").should("not.be.visible");
```

Dessa forma o teste continua validando o comportamento dos três segundos sem precisar esperar três segundos reais.

Foi um dos recursos que achei mais interessantes durante o estudo porque resolve um problema comum sem depender de `cy.wait()` com tempo fixo.

---

## 12. Retry-ability e esperas

Outro ponto importante do Cypress é o mecanismo de novas tentativas.

Quando executamos:

```js
cy.get(".success").should("be.visible");
```

o Cypress não faz apenas uma verificação instantânea. Durante um determinado período ele tenta novamente localizar o elemento e validar a condição.

Isso reduz a necessidade de escrever esperas fixas como:

```js
cy.wait(5000);
```

Sempre que possível, prefiro aguardar o comportamento que realmente interessa:

```js
cy.get(".success").should("be.visible");
```

ou aguardar uma requisição conhecida.

---

## 13. Testes HTTP

O Cypress também pode ser utilizado para validar requisições e respostas.

Neste projeto foi criado um exemplo com `cy.intercept()`:

```js
cy.intercept("GET", "**/src/index.html").as("pagina");

cy.visit("./src/index.html");

cy.wait("@pagina").then(({ response }) => {
  expect(response.statusCode).to.eq(200);
  expect(response.headers["content-type"]).to.include("text/html");
  expect(response.body).to.include("Central de Atendimento");
});
```

Nesse exemplo são verificados:

- status HTTP;
- `content-type`;
- conteúdo retornado.

Em uma aplicação real o mesmo conceito pode ser utilizado para acompanhar chamadas feitas pela tela e validar respostas de APIs.

---

## 14. Boas práticas que considerei importantes

Durante o estudo alguns pontos ficaram mais claros para mim.

### Testes independentes

Um teste não deve depender de outro teste ter rodado antes.

Cada cenário precisa conseguir preparar o estado necessário para sua própria execução.

### Nomes claros

O nome do teste deve explicar o comportamento que está sendo validado.

Isso ajuda bastante quando algum cenário falha no pipeline.

### Evitar `wait` com tempo fixo

Sempre que possível, é melhor aguardar um elemento, uma condição ou uma requisição específica.

### Seletores estáveis

Em aplicações reais, utilizar seletores baseados em estrutura de HTML ou classes de estilo pode deixar os testes frágeis.

Uma alternativa é utilizar atributos específicos para automação:

```html
<button data-cy="salvar">Salvar</button>
```

E no teste:

```js
cy.get('[data-cy="salvar"]').click();
```

Assim uma mudança de classe CSS não necessariamente quebra o teste.

### Evitar duplicação

Se vários cenários repetem exatamente o mesmo fluxo, pode fazer sentido extrair essa lógica.

Foi o caso do comando `fillMandatoryFieldsAndSubmit` criado neste projeto.

### Testar comportamento

O foco principal deve ser o comportamento esperado da aplicação.

Por exemplo, é mais importante validar que um cadastro foi salvo e que o usuário recebeu o retorno correto do que testar detalhes internos da implementação do componente.

---

## 15. Execução no CI

Depois dos testes locais, configurei a execução pelo GitHub Actions.

O workflow está em:

```text
.github/workflows/ci.yml
```

A ideia é permitir que a suíte seja executada automaticamente quando houver alteração no repositório.

Fluxo simplificado:

```text
Alteração no código
        ↓
Push / Pull Request
        ↓
GitHub Actions
        ↓
Execução do Cypress
        ↓
Resultado
      /       \
   sucesso    falha
```

Durante o estudo também provoquei uma regressão propositalmente.

Removi uma validação de e-mail da aplicação, enviei a alteração e deixei o pipeline executar.

O Cypress identificou a falha.

Depois restaurei a validação e a execução voltou a passar.

Na prática, esse foi um exemplo simples de como uma suíte automatizada pode identificar uma regressão após uma mudança no sistema.

---

## 16. Cypress Cloud

O projeto também foi integrado ao Cypress Cloud.

A execução com gravação pode ser feita com:

```sh
npm run test:cloud
```

O projeto utiliza a variável:

```text
CYPRESS_RECORD_KEY
```

Essa chave fica armazenada como secret no GitHub e não deve ser versionada junto com o código.

Com o Cloud é possível acompanhar as execuções feitas pelo CI e consultar os resultados dos testes.

---

## 17. Onde isso pode ser aplicado na empresa

Pensando no sistema da empresa, eu não começaria tentando automatizar todas as telas.

Os primeiros candidatos seriam fluxos que hoje precisam ser repetidos várias vezes durante uma validação ou que são mais sensíveis a regressões.

Alguns exemplos:

- autenticação e logout;
- permissões diferentes por perfil;
- inclusão e alteração de cadastros;
- campos obrigatórios e validações;
- filtros e grids;
- fluxos que passam por várias telas;
- processos que mudam de status;
- regressões que já ocorreram anteriormente.

Um exemplo interessante seria uma funcionalidade que passa por cadastro, processamento e consulta.

O Cypress poderia realizar o fluxo completo e verificar se o resultado final continua correto.

Outro uso que vejo como importante é criar um teste quando um bug relevante for corrigido.

Além de corrigir o problema, o cenário pode ficar registrado na suíte para evitar que a mesma regressão volte sem ser percebida.

---

## 18. Como eu começaria uma adoção real

Depois do estudo, eu não começaria tentando automatizar o sistema inteiro.

Eu seguiria uma evolução mais simples:

1. escolher poucos fluxos realmente importantes;
2. automatizar primeiro os caminhos principais;
3. adicionar validações de regras críticas;
4. executar esses testes no pipeline;
5. criar testes de regressão para bugs relevantes;
6. avaliar o custo de manutenção antes de aumentar a cobertura.

A suíte precisa crescer conforme fizer sentido para o projeto.

Ter muitos testes não significa necessariamente ter uma boa estratégia de automação.

---

## 19. Conclusão

Antes deste estudo eu tinha pouco contato prático com Cypress.

Durante o projeto passei desde os testes mais simples, como preenchimento de campos e cliques, até pontos como custom commands, fixtures, controle de tempo, upload de arquivos, requisições HTTP, execução em CI e Cypress Cloud.

O principal ponto que tirei do estudo é que não faz sentido tentar automatizar tudo.

A automação parece trazer mais benefício quando é aplicada em fluxos importantes, repetitivos e que precisam ser verificados constantemente durante o desenvolvimento.

Para uma adoção real na empresa, eu começaria com poucos cenários, integraria esses testes ao processo atual e avaliaria o resultado antes de aumentar a cobertura.

---

## 20. Referências

Este estudo foi desenvolvido principalmente com base no curso **Cypress, do Zero à Nuvem**, de Walmyr Lima e Silva Filho, da Talking About Testing.

Também foram utilizadas como referência as documentações oficiais do Cypress durante a implementação dos exemplos.

- Documentação oficial do Cypress: https://docs.cypress.io/
- Projeto utilizado como base para o curso: https://github.com/wlsf82/cypress-do-zero-a-nuvem
