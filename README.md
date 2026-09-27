# Central de Atendimento

Aplicação demonstrativa de atendimento ao cliente com testes automatizados em Cypress. O formulário permite informar dados de contato, selecionar um produto, definir o tipo de atendimento e anexar um arquivo.

O envio é simulado no navegador: não há backend nem persistência dos dados.

## Tecnologias

- HTML, CSS e JavaScript.
- Cypress (versão estável) para testes de ponta a ponta e requisições HTTP.
- Cypress Cloud para gravação opcional das execuções.

## Instalação

Pré-requisitos: Node.js 22 e npm. Para instalar as versões fixadas no lockfile:

```sh
npm ci
```

A dependência do Cypress usa a tag `latest`, enquanto o `package-lock.json`
registra a versão instalada para manter as execuções reproduzíveis. O `npm ci`
instala essa versão registrada, sem buscar atualizações. Para atualizar para a
versão estável mais recente e validar a compatibilidade:

```sh
npm update cypress
npm test
npm run test:mobile
```

Após a atualização, versione também o `package-lock.json`.

Abra `src/index.html` no navegador para usar a aplicação. Os testes utilizam o servidor de arquivos do próprio Cypress, sem iniciar um servidor separado.

## Testes

| Comando                  | Execução                                           |
| ------------------------ | -------------------------------------------------- |
| `npm run cy:open`        | Interface interativa, desktop 1280 × 880           |
| `npm test`               | Headless, desktop 1280 × 880                       |
| `npm run cy:open:mobile` | Interface interativa, mobile 410 × 860             |
| `npm run test:mobile`    | Headless, mobile 410 × 860                         |
| `npm run test:cloud`     | Headless com gravação no Cypress Cloud configurado |

A suíte cobre preenchimento e validação de campos, mensagens temporárias, seleção de produtos, opções de atendimento, preferências de contato, anexos, política de privacidade e resposta HTTP da aplicação local.

Para executar apenas os testes do formulário:

```sh
npm test -- --spec "cypress/e2e/atendimento.cy.js"
```

Vídeos ficam em `cypress/videos/` e screenshots de falhas em `cypress/screenshots/`. Esses arquivos são ignorados pelo Git.

## Estrutura

| Caminho                         | Conteúdo                                           |
| ------------------------------- | -------------------------------------------------- |
| `src/`                          | Páginas, estilos, comportamento e dados de exemplo |
| `cypress/e2e/atendimento.cy.js` | Testes do formulário                               |
| `cypress/e2e/privacy.cy.js`     | Teste independente da política de privacidade      |
| `cypress/e2e/http.cy.js`        | Verificação HTTP da página local                   |
| `cypress/fixtures/`             | Arquivos usados nos testes de upload               |
| `cypress/support/`              | Configuração de suporte e comandos customizados    |
| `cypress.config.js`             | Configuração dos testes                            |

O comando `fillMandatoryFieldsAndSubmit` aceita um objeto com `firstName`, `lastName`, `email` e `text`, ou utiliza valores padrão quando chamado sem argumentos.

## Cypress Cloud

O Project ID é lido da variável de ambiente `CYPRESS_PROJECT_ID`, sem valor fixo no código.

Para gravar localmente, defina `CYPRESS_PROJECT_ID` com o identificador do projeto e `CYPRESS_RECORD_KEY` com uma chave desse mesmo projeto e execute:

```sh
npm run test:cloud
```

No GitHub, acesse **Settings → Secrets and variables → Actions**. Na aba **Variables**, cadastre `CYPRESS_PROJECT_ID` com o identificador do projeto. Na aba **Secrets**, cadastre `CYPRESS_RECORD_KEY` com uma chave do mesmo projeto. O workflow `.github/workflows/ci.yml` passa esses valores ao Cypress e grava os testes no Cloud a cada push.

Os comandos locais `npm test` e `npm run test:mobile` funcionam sem credenciais. Mantenha a Record Key fora dos arquivos versionados.

## Origem do projeto

Este repositório foi utilizado como base prática durante o estudo do curso Cypress, do Zero à Nuvem, de Walmyr Lima e Silva Filho / Talking About Testing.

A pasta `lessons/` contém o material de estudo disponibilizado no projeto original do curso.

O diretório `docs/` contém o material produzido para fins de desenvolvimento profissional e compartilhamento interno, elaborado a partir dos conceitos estudados e da implementação prática realizada neste repositório.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para os termos e avisos de autoria.
