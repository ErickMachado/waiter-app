<p align="center">
  <img src="../assets/logo.png" />
</p>

<div align="center">
  <image src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <image src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <image src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</div>

## ⚙️ Tecnologias

- [Node.js](https://nodejs.org)
- [Mongodb](https://mongodb.com)
- [Docker](https://docker.com)

## 📂 Estrutura de pastas

### Pasta `src`

- [entities](https://github.com/ErickMachado/waiter-app/tree/master/api/src/entities): O coração da aplicação. Nessa camada ficam todas as entidades, objetos de valores e regras de informações.
- [external](https://github.com/ErickMachado/waiter-app/tree/master/api/src/external): Aqui ficam todas as implementações de repositórios (no caso desse projeto, implementações para Mongo) e schemas das entidades do banco de dados.
- [main](https://github.com/ErickMachado/waiter-app/tree/master/api/src/main): A camada mais "suja" do projeto. Aqui ficam as funções _factory_ dos _handlers_. Inicialização e configuração do Express, configurações de _logging_, etc.
- [presentation](https://github.com/ErickMachado/waiter-app/tree/master/api/src/presentation): Camada de apresentação dos dados para o consumidor. Aqui ficam os _handlers_ que transformam respostas do domínio em respostas HTTP.
- [shared](https://github.com/ErickMachado/waiter-app/tree/master/api/src/shared): Funções utilitárias que pode ser usado por qualquer camada da aplicação.
- [useCases](https://github.com/ErickMachado/waiter-app/tree/master/api/src/useCases): Camada onde ficam todas as tarefas que o usuário pode executar dentro da aplicação.

## Pasta `tests`

- [integration](https://github.com/ErickMachado/waiter-app/tree/master/api/tests/integration): Todos os testes de integração ficam aqui. Cada rota em um arquivo.
- [mocks](https://github.com/ErickMachado/waiter-app/tree/master/api/tests/mocks): Aqui ficam todos os mocks usados pelos testes unitários e de integração.
- [utils](https://github.com/ErickMachado/waiter-app/tree/master/api/tests/utils): Funções utilitárias que podem ser usadas tanto pelos testes unitários quanto pelos de integração.

## 🚀 Como rodar a API localmente

> ⚠️ Nessa etapa você vai precisa ter o Node.js (pelo menos na v16 com yarn) e o Docker instalado.

1. Abra um terminal e rode o comando:

```bash
# Inicializa um container chamado "mongodb" rodando Mongodb na porta 27017 (porta padrão do mongodb)
docker run --name mongodb -p 27017:27017 -d mongo
```

2. Clone o projeto para sua máquina com:

```bash
# O projeto será clonado para a sua pasta home
cd && git clone git@github.com:ErickMachado/waiter-app.git
```

3. A parte de _upload_ de arquivos acontece localmente, por isso será necessário criar um diretório chamado _uploads_ na pasta do projeto da API:

```bash
# O projeto será clonado para a sua pasta home
cd ~/waiter-app/api && mkdir uploads
```

4. Entre no diretório do projeto e inicie o ambiente de desenvolvimento com:

```bash
# O projeto será clonado para a sua pasta home
cd ~/waiter-app/api && yarn dev
```

5. Abra um cliente HTTP (recomendo o [Insomnia](https://insomnia.rest)) e comece a fazer uso da sua API 🙌

> 💡 Você pode importar uma coleção de requisições prontas para o seu cliente HTTP favorito. O arquivo se encontra em `/waiter-app/assets/requests-collection.json`.

> 💡 O projeto também possuí documentação das rotas. você também pode dar uma olhada nele caso não queira usar a coleção pronta de requisições.

## 🧪 Executando os tests

Boa parte do projeto está coberto com testes unitários e de integração. Você pode abrindo um terminal e rodando o seguinte comando:

### Testes unitários

```bash
cd ~/waiter-app/api && yarn test:unit
```

```bash
cd ~/waiter-app/api && yarn test:integration
```

> ⚠️ Até esse momento, ainda não implementei uma separação dos _uploads_ de arquivos dos testes de integração e dos _uploads_ de desenvolvimento. Por isso seria legal você deletar os arquivos gerados pelos testes de integração do diretório `/uploads`.

---

<p align="center">Feito com ❤️ por <a href="https://www.linkedin.com/in/erickgsantos/">Erick Machado</a></p>
