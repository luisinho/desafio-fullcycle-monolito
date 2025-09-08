# desafio-fullcycle-monolito
Desafio Full Cycle modulo sistemas monolitos
## Sobre o projeto
  # Disponibilizar os seguintes endpoints:
    - POST /products
    - GET  /products/check-stock/:id
    - POST /clients
    - GET  /clients/:id
    - GET  /clients/document/:document
    - POST /checkout
    - GET  /checkout/:id
    - GET  /document/client/:document
    - POST /invoice
    - GET  /invoice/:id
    - GET  /invoice/list/:ids
    - GET  /payment/:orderId
    - GET  /store-catalog/:id
    - GET  /store-catalog/list

# Tecnologias utilizadas
  Linguagem de programação TypeScript

# Como executar o projeto

```bash
  # Clonar o repositório
  git clone https://github.com/luisinho/desafio-fullcycle-monolito.git

  # Entrar na pasta do projeto
  cd desafio-fullcycle-monolito

  # Instalar dependências
  npm install

  # Executar o docker
  docker-compose up --build

  # Entra no bash para executar os testes
  docker-compose exec app bash

# Autor

Luis Antonio Batista dos Santos

https://www.linkedin.com/in/luis-antonio-batista-dos-santos-5a37b781
