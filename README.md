# Central de Atendimento

Aplicação demonstrativa de atendimento ao cliente com testes automatizados em Cypress. O formulário permite informar dados de contato, selecionar um produto, definir o tipo de atendimento e anexar um arquivo.

O envio é simulado no navegador: não há backend nem persistência dos dados.

## Tecnologias

- HTML, CSS e JavaScript.
- Cypress 13.12.0 para testes de ponta a ponta e requisições HTTP.
- Cypress Cloud para gravação opcional das execuções.

## Instalação

Pré-requisitos: Node.js 22 e npm. Para instalar as versões fixadas no lockfile:

```sh
npm ci
```

Abra `src/index.html` no navegador para usar a aplicação. Os testes utilizam o servidor de arquivos do próprio Cypress, sem iniciar um servidor separado.

## Testes

| Comando | Execução |
| --- | --- |
| `npm run cy:open` | Interface interativa, desktop 1280 × 880 |
| `npm test` | Headless, desktop 1280 × 880 |
| `npm run cy:open:mobile` | Interface interativa, mobile 410 × 860 |
| `npm run test:mobile` | Headless, mobile 410 × 860 |
| `npm run test:cloud` | Headless com gravação no Cypress Cloud configurado |

A suíte cobre preenchimento e validação de campos, mensagens temporárias, seleção de produtos, opções de atendimento, preferências de contato, anexos, política de privacidade e resposta HTTP da aplicação local.

Para executar apenas os testes do formulário:

```sh
npm test -- --spec "cypress/e2e/atendimento.cy.js"
```

Vídeos ficam em `cypress/videos/` e screenshots de falhas em `cypress/screenshots/`. Esses arquivos são ignorados pelo Git.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/` | Páginas, estilos, comportamento e dados de exemplo |
| `cypress/e2e/atendimento.cy.js` | Testes do formulário |
| `cypress/e2e/privacy.cy.js` | Teste independente da política de privacidade |
| `cypress/e2e/http.cy.js` | Verificação HTTP da página local |
| `cypress/fixtures/` | Arquivos usados nos testes de upload |
| `cypress/support/` | Configuração de suporte e comandos customizados |
| `cypress.config.js` | Configuração dos testes |

O comando `fillMandatoryFieldsAndSubmit` aceita um objeto com `firstName`, `lastName`, `email` e `text`, ou utiliza valores padrão quando chamado sem argumentos.

## Cypress Cloud

Configure as variáveis de ambiente `CYPRESS_PROJECT_ID` e `CYPRESS_RECORD_KEY` com os valores do seu projeto no Cypress Cloud. Depois execute:

```sh
npm run test:cloud
```

A gravação é opcional. Os demais comandos funcionam sem credenciais. Mantenha a Record Key fora dos arquivos versionados.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para os termos e avisos de autoria.
