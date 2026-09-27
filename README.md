# Central de Atendimento

Aplicação demonstrativa de atendimento ao cliente com testes automatizados em Cypress. O formulário permite informar dados de contato, selecionar um produto, definir o tipo de atendimento e anexar um arquivo.

Na aplicação de demonstração em `src/`, o envio é simulado no navegador, sem backend nem persistência. Há também um teste de interface do Aktian, que acessa um ambiente externo e cria e exclui um grupo de usuários real nesse ambiente.

## Guia interno de Cypress

O material de referência produzido a partir deste estudo está disponível em:

[Guia interno de automação de testes com Cypress](./docs/guia-cypress.md)

## Tecnologias

- HTML, CSS e JavaScript.
- Cypress (versão estável) para testes de ponta a ponta e requisições HTTP.
- Cypress Cloud para gravação opcional das execuções.

## Instalação

Pré-requisitos: Node.js 22, npm e Google Chrome instalado. Para instalar as versões fixadas no lockfile:

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

Abra `src/index.html` no navegador para usar a aplicação de demonstração. Os testes locais utilizam o servidor de arquivos do próprio Cypress, sem iniciar um servidor separado. O teste do Aktian requer internet e as configurações descritas abaixo.

## Testes

O navegador padrão é o Google Chrome, definido uma única vez em
`cypress.config.js` por `defaultBrowser`. Isso vale para os comandos locais e
para o CI. Para escolher outro navegador em uma execução, passe `--browser`,
por exemplo: `npm run test:local -- --browser firefox`.

| Comando                  | Execução                                           |
| ------------------------ | -------------------------------------------------- |
| `npm run cy:open`        | Interface interativa, desktop 1280 × 880           |
| `npm test`               | Headless, desktop 1280 × 880                       |
| `npm run test:local` | Apenas demonstração e privacidade, sem credenciais |
| `npm run test:aktian` | Apenas cadastro e exclusão de grupo no Aktian |
| `npm run cy:open:mobile` | Interface interativa, mobile 410 × 860             |
| `npm run test:mobile`    | Headless, mobile 410 × 860                         |
| `npm run test:cloud`     | Headless com gravação no Cypress Cloud configurado |

A suíte local cobre preenchimento e validação de campos, mensagens temporárias, seleção de produtos, opções de atendimento, preferências de contato, anexos e política de privacidade. O teste do Aktian cobre login, cadastro de grupo com menus e acesso mobile, confirmação de sucesso e exclusão do grupo criado.

`npm test`, os comandos mobile e `test:cloud` executam toda a suíte, incluindo o Aktian. Para validar somente a demonstração sem acessar o ambiente externo, use `npm run test:local`.

O teste do Aktian identifica o grupo por um nome único. Se a linha não estiver visível por paginação ou filtro, o teste falha em vez de selecionar outro registro. Se houver uma falha depois da inclusão, o grupo criado pode permanecer no ambiente; a exclusão faz parte do fluxo de sucesso.

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
| `cypress/e2e/aktian-grupos.cy.js` | Cadastro e exclusão de grupo no Aktian |
| `cypress/fixtures/`             | Arquivos usados nos testes de upload               |
| `cypress/support/`              | Configuração de suporte e comandos customizados    |
| `cypress.config.js`             | Configuração dos testes                            |
| `cypress.env.example.json` | Modelo sem credenciais para configurar o Aktian localmente |
| `.env.example` | Modelo das variáveis do Cypress Cloud para o terminal |
| `jsconfig.json` | IntelliSense dos arquivos JavaScript |

O comando `fillMandatoryFieldsAndSubmit` aceita um objeto com `firstName`, `lastName`, `email` e `text`, ou utiliza valores padrão quando chamado sem argumentos.

## Configuração de ambientes

### Aktian local

Copie `cypress.env.example.json` para `cypress.env.json` e preencha a URL, o usuário e a senha do ambiente de testes. O Cypress lê esse JSON automaticamente. O teste acessa esses valores com `cy.env()`.

O `cypress.env.json` é ignorado pelo Git. Mantenha os modelos de configuração sem valores reais. Não é necessário repetir os dados do Aktian no `.env`.

### Cypress Cloud no terminal

O Project ID é lido da variável de ambiente `CYPRESS_PROJECT_ID`, sem valor fixo no código.

Para gravar localmente, defina `CYPRESS_PROJECT_ID` com o identificador do projeto e `CYPRESS_RECORD_KEY` com uma chave desse mesmo projeto. Essas duas variáveis são do processo e não devem ser colocadas no `cypress.env.json`.

O projeto não carrega `.env` automaticamente. Se preferir usar esse arquivo, copie `.env.example` para `.env`, preencha os valores e carregue-o no **Git Bash**, na raiz do projeto:

```sh
set -a
source .env
set +a
npm run test:cloud
```

### GitHub Actions

Em **Settings → Secrets and variables → Actions**, configure:

| Aba | Nome | Finalidade |
| --- | --- | --- |
| Variables | `URL_HTTPS_AKTIAN` | URL do ambiente de testes |
| Variables | `CYPRESS_PROJECT_ID` | Identificador do projeto no Cloud |
| Secrets | `USER_AKTIAN` | Usuário de teste |
| Secrets | `PASSWORD_USER_AKTIAN` | Senha do usuário de teste |
| Secrets | `CYPRESS_RECORD_KEY` | Chave de gravação do projeto no Cloud |

O workflow `.github/workflows/ci.yml` mapeia os dados do Aktian para variáveis com prefixo `CYPRESS_`, que o Cypress disponibiliza para `cy.env()`. Não é necessário criar `.env` ou `cypress.env.json` no CI.

O workflow executa a suíte completa e grava no Cloud em pushes e pull requests. Pull requests de forks não recebem os secrets e, com a configuração atual, não conseguem executar o fluxo autenticado nem a gravação.

As credenciais do Cloud são necessárias apenas para gravar; as credenciais do Aktian são necessárias sempre que esse teste for executado, mesmo sem gravação.

## Origem do projeto

Este repositório foi utilizado como base prática durante o estudo do curso Cypress, do Zero à Nuvem, de Walmyr Lima e Silva Filho / Talking About Testing.

A pasta `lessons/` contém o material de estudo disponibilizado no projeto original do curso.

O diretório `docs/` contém o material produzido para fins de desenvolvimento profissional e compartilhamento interno, elaborado a partir dos conceitos estudados e da implementação prática realizada neste repositório.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para os termos e avisos de autoria.
