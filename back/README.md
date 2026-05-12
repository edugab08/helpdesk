# NexSupport — Back-end

API REST desenvolvida com **NestJS**, **Prisma ORM** e **PostgreSQL**.

---

## 🚀 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com suas credenciais do banco

# 3. Gerar o client Prisma
npm run prisma:generate

# 4. Rodar as migrations (cria as tabelas no banco)
npm run prisma:migrate

# 5. Iniciar em modo desenvolvimento
npm run start:dev
```

---

## 📁 Estrutura de Módulos

```
src/
├── main.ts                  # Entrada da aplicação
├── app.module.ts            # Módulo raiz
│
├── prisma/
│   ├── prisma.module.ts     # Módulo global do Prisma
│   └── prisma.service.ts    # Client Prisma injetável
│
├── auth/
│   ├── auth.controller.ts   # POST /auth/register, /auth/login
│   ├── auth.service.ts      # Lógica de autenticação JWT
│   ├── strategies/
│   │   └── jwt.strategy.ts  # Estratégia JWT do Passport
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── decorators/
│       └── roles.decorator.ts
│
├── users/
│   ├── users.controller.ts  # CRUD de usuários
│   ├── users.service.ts
│   └── dto/
│       └── create-user.dto.ts
│
└── tickets/
    ├── tickets.controller.ts # CRUD de chamados + stats
    ├── tickets.service.ts
    └── dto/
        └── create-ticket.dto.ts
```

---

## 🔗 Rotas da API

### Auth
| Método | Rota              | Descrição            | Auth |
|--------|-------------------|----------------------|------|
| POST   | /api/auth/register | Criar conta          | ❌   |
| POST   | /api/auth/login    | Login (retorna JWT)  | ❌   |

### Users
| Método | Rota             | Descrição               | Auth  |
|--------|------------------|-------------------------|-------|
| GET    | /api/users       | Listar usuários         | ADMIN |
| GET    | /api/users/:id   | Buscar usuário          | ✅    |
| PATCH  | /api/users/:id   | Atualizar usuário       | ✅    |
| DELETE | /api/users/:id   | Remover usuário         | ADMIN |

### Tickets
| Método | Rota                | Descrição                          | Auth  |
|--------|---------------------|------------------------------------|-------|
| POST   | /api/tickets        | Abrir chamado                      | ✅    |
| GET    | /api/tickets        | Listar chamados (com filtros)      | ✅    |
| GET    | /api/tickets/stats  | Estatísticas dos chamados          | ADMIN |
| GET    | /api/tickets/:id    | Detalhe do chamado                 | ✅    |
| PATCH  | /api/tickets/:id    | Atualizar chamado (status, etc)    | ✅    |
| DELETE | /api/tickets/:id    | Remover chamado                    | ADMIN |

### Filtros disponíveis em GET /api/tickets
```
?status=ABERTO
?status=EM_ANDAMENTO
?priority=ALTA
?categoryId=uuid
?userId=uuid
?assignedTo=uuid
```

---

## 🏗️ Diagrama de Entidades

| Entidade       | Descrição                                      |
|----------------|------------------------------------------------|
| User           | Usuários do sistema (USER ou ADMIN)            |
| Ticket         | Chamados de suporte                            |
| Category       | Categorias para classificar chamados           |
| Comment        | Comentários em cada chamado                    |
| Attachment     | Arquivos anexados aos chamados                 |
| TicketHistory  | Histórico automático de mudanças              |

---

## 🔐 Autenticação

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token_jwt>
```

O token é retornado no login e expira em **7 dias**.
