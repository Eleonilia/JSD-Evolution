# JSD Evolution

## Descrição do Projeto
O projeto JSD Evolution tem como objetivo evoluir o esquema JSON de forma incremental à medida que novos documentos são adicionados à coleção. A JSD Evolution expande a abordagem de Frozza et al. (2018) (An Approach for Schema Extraction of JSON and Extended JSON Document Collections), partindo da premissa de que existe um esquema JSON inicial que reflete a coleção de documentos existente. À medida que novos documentos são adicionados, o esquema JSON é atualizado para incorporar essas novas adições.

A JSD Evolution se destaca por focar exclusivamente nos novos documentos adicionados à coleção para evoluir o esquema, reduzindo significativamente o tempo e o esforço necessários para manter o esquema atualizado. Isso não apenas otimiza a gestão de dados em ambientes dinâmicos, mas também oferece uma solução mais eficiente e escalável para a evolução contínua do esquema.

## O projeto JSD Evolution foi uma extensão da ferramenta: 
* [JSON Schema Discovery](https://github.com/feekosta/JSONSchemaDiscovery.git)

## O que você precisa instalar para executar este projeto:
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

## Server
* Execute `sudo docker-compose up -d` para iniciar os contêineres Docker.
* Execute `npm run dev` para iniciar um servidor de desenvolvimento.

## Controlador JDS Evolution
### Configurar o Replica Set:
* [Replication](https://www.mongodb.com/docs/manual/replication/)
* [Deploy a Replica Set](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)
  
### Preencher informações de Entrada:
* [Configuração de Entrada](Controlador/config.json)
  
### Para inicicar o controlador JSD Evolution:
* [Controlador JSD Evolution](Controlador/Controlador_JSD_Evolution.ipynb)

## Experimentos:
* [JSD Evolution](Experimentos/Experimentos_JSD_Evolution.ipynb) 
* [JSD](Experimentos/Experimentos_JSD.ipynb)


