# Task API

API de tarefas feita para estudar backend com Node.js e TypeScript.

A ideia é ir evoluindo o projeto aos poucos, adicionando funcionalidades reais enquanto pratico arquitetura, autenticação, banco de dados e testes.

## Stack

- Node.js
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Zod
- Jest
- Docker
- pnpm

## Estrutura

```text
src/
├── database/
├── errors/
├── modules/
│   ├── auth/
│   ├── tasks/
│   └── user/
├── security/
├── app.ts
└── server.ts

tests/
└── unit/
```

## O que já foi feito

### Auth

- Cadastro de usuário
- Login
- Logout
- Access token com JWT
- Refresh token
- Revogação de refresh token
- Cookies HttpOnly
- Proteção das rotas autenticadas

### Usuário

- Buscar usuário logado
- Atualizar nome e e-mail
- Alterar senha
- Validação da senha atual
- Excluir conta

### Tasks

- Criar tarefa
- Listar tarefas
- Buscar tarefa por ID
- Atualizar tarefa
- Excluir tarefa
- Separação das tarefas por usuário
- Impedir acesso às tarefas de outros usuários

### Segurança

- Senhas protegidas com bcrypt
- Refresh tokens armazenados com hash
- JWT para autenticação
- Cookies HttpOnly
- Validação de dados com Zod
- Isolamento dos dados entre usuários
- Tratamento centralizado de erros

## Tratamento de erros

Foi criado um sistema simples de erros da aplicação usando `AppError`.

Alguns erros definidos:

- `TASK_NOT_FOUND`
- `INVALID_CREDENTIALS`
- `INVALID_CURRENT_PASSWORD`

O `errorHandler` centraliza o tratamento dos erros e separa erros de validação, erros conhecidos da aplicação, erros do Prisma e erros inesperados.

## Testes

- Jest
- 11 suítes
- 68 testes

Os testes cobrem principalmente os services, autenticação, regras de negócio e tratamento de erros.

## Banco de dados

O projeto utiliza PostgreSQL com Prisma.

Principais entidades:

- `User`
- `Task`
- `RefreshToken`

O relacionamento entre usuário e tarefas garante que cada usuário tenha acesso apenas aos próprios dados.

Os refresh tokens também ficam associados ao usuário e podem ser revogados.

## Arquitetura

O projeto utiliza uma estrutura modular.

Cada módulo possui suas próprias responsabilidades, separando principalmente:

- Controllers
- Services
- Routes
- Schemas

A ideia é manter os controllers responsáveis pelo HTTP e deixar as regras de negócio nos services.

Atualmente os módulos principais são:

- `auth`
- `tasks`
- `user`

## Próximas etapas

- [ ] Verificação de e-mail
- [ ] Reenvio de e-mail
- [ ] Recuperação de senha
- [ ] Login com Google
- [ ] Paginação
- [ ] Filtros e busca
- [ ] Melhorias no sistema de autenticação
- [ ] Rate limiting
- [ ] Controle de sessões
