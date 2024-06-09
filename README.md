# JSD Evolution

## Descrição do Projeto
O projeto JSD Evolution tem como objetivo evoluir o esquema JSON de forma incremental à medida que novos documentos são adicionados à coleção. A JSD Evolution expande a abordagem de Frozza et al. (2018), partindo da premissa de que existe um esquema JSON inicial que reflete a coleção de documentos existente. À medida que novos documentos são adicionados, o esquema JSON é atualizado para incorporar essas novas adições.

A JSD Evolution se destaca por focar exclusivamente nos novos documentos adicionados à coleção para evoluir o esquema, reduzindo significativamente o tempo e o esforço necessários para manter o esquema atualizado. Isso não apenas otimiza a gestão de dados em ambientes dinâmicos, mas também oferece uma solução mais eficiente e escalável para a evolução contínua do esquema.

## O que você precisa instalar para executar este projeto::
* [NodeJS](http://nodejs.org)
* [Mongo DB](https://www.mongodb.org)
* [Python](https://www.python.org)

## Configurando o ambiente de desenvolvimento:
Após clonar o repositório para a sua máquina local, no diretório do projeto:
1. Instale as dependências globais:
* [Angular CLI](https://cli.angular.io/) `npm install -g @angular/cli`
* [Typescript](https://www.typescriptlang.org/) `npm install -g typescript`

2. Instale as dependências do projeto executando: `npm install`;
3. Instale o Docker: `sudo apt install docker.io docker docker-compose`

## Development server
* Execute `sudo docker-compose up -d` para iniciar os contêineres Docker.
* Execute `npm run dev` para iniciar um servidor de desenvolvimento.

## Controlador
Configuerar o Replica Set.
* [Replication](https://www.mongodb.com/docs/manual/replication/)
* [Deploy a Replica Set](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

## Code scaffolding

Execute `ng generate component component-name` para gerar um novo componente. Você também pode usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Executando testes unitários

Execute `ng test` para executar os testes unitários via [Karma](https://karma-runner.github.io).

## Executando testes end-to-end

Execute `ng e2e` para executar os testes end-to-end via [Protractor](http://www.protractortest.org/).
Antes de executar os testes rode o servidor pelo comando `ng serve`.
