# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1bb4f0d5-cb9a-4600-a655-d4a09cf68bdf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1bb4f0d5-cb9a-4600-a655-d4a09cf68bdf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# Deploy e Build de Produção

## Variáveis de Ambiente

Crie um arquivo `.env.production` na raiz do diretório `app/` com o seguinte conteúdo:

```
VITE_BACKEND_URL=https://backend-capsula-production.up.railway.app/
```

Você pode criar também um `.env` para desenvolvimento:
```
VITE_BACKEND_URL=http://localhost:4000
```

> **Atenção:** Os arquivos `.env` e `.env.production` já estão no `.gitignore` e não devem ser versionados.

## Build de Produção

Para gerar o build otimizado para produção, execute:

```sh
npm run build
```

Os arquivos finais estarão na pasta `dist/`.

## Deploy

Você pode fazer deploy do frontend em serviços como Vercel, Netlify, Railway (Static), ou qualquer serviço de hospedagem estática.

- **Vercel/Netlify:** Basta conectar o repositório e garantir que a variável de ambiente `VITE_BACKEND_URL` esteja configurada no painel do serviço.
- **Railway:** Use o tipo de projeto "Static" e configure a variável de ambiente `VITE_BACKEND_URL`.
- **Manual:** Faça upload do conteúdo da pasta `dist/` para seu serviço de hospedagem estática.

## Integração com Backend

O frontend irá consumir a URL definida em `VITE_BACKEND_URL`. Certifique-se de que o backend esteja acessível publicamente e que o CORS esteja configurado corretamente.

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1bb4f0d5-cb9a-4600-a655-d4a09cf68bdf) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)


instruções: do backend 

Amorarium API
 1.0.0 
OAS 3.0
API REST para o projeto Amorarium - Uma aplicação para casais gerenciarem cápsulas do tempo e sonhos compartilhados

Contact Amorarium Team
Livre para uso educacional
Servers

http://localhost:4000 - Servidor de Desenvolvimento

Authorize
Admin
Endpoints administrativos (apenas para administradores)



GET
/api/admin/stats
Obter estatísticas do sistema


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Estatísticas do sistema

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "totalUsers": 150,
  "totalCapsules": 89,
  "totalDreams": 45,
  "totalCouples": 75
}
No links
401	
Token inválido ou ausente

No links
403	
Acesso negado - apenas administradores

No links

GET
/api/admin/users
Listar todos os usuários


Parameters
Try it out
Name	Description
page
integer
(query)
Número da página

Default value : 1

1
limit
integer
(query)
Itens por página

Default value : 10

10
Responses
Code	Description	Links
200	
Lista de usuários

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "createdAt": "2025-06-08T01:22:35.362Z",
      "isAdmin": true
    }
  ],
  "pagination": {
    "page": 0,
    "limit": 0,
    "total": 0,
    "totalPages": 0
  }
}
No links
Authentication
Endpoints para autenticação de usuários



POST
/api/auth/register
Cadastrar novo usuário

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
Responses
Code	Description	Links
201	
Usuário criado com sucesso

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clp123abc456def789",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
No links
400	
Dados inválidos ou email já existe

Media type

application/json
Example Value
Schema
{
  "error": "Erro interno do servidor"
}
No links

POST
/api/auth/login
Fazer login

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
Responses
Code	Description	Links
200	
Login realizado com sucesso

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clp123abc456def789",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
No links
401	
Credenciais inválidas

Media type

application/json
Example Value
Schema
{
  "error": "Erro interno do servidor"
}
No links
Capsules
Gerenciamento de cápsulas do tempo



GET
/api/capsules
Listar todas as cápsulas do usuário


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Lista de cápsulas

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": "clp123abc456def789",
    "title": "Nossa primeira viagem juntos",
    "content": "Hoje visitamos Paris pela primeira vez...",
    "imageUrl": "https://exemplo.com/imagem.jpg",
    "songUrl": "https://open.spotify.com/track/123",
    "location": "Paris, França",
    "openAt": "2025-06-08T01:22:35.374Z",
    "isOpened": false,
    "coupleId": "string",
    "createdAt": "2025-06-08T01:22:35.374Z"
  }
]
No links
401	
Token inválido ou ausente

Media type

application/json
Example Value
Schema
{
  "error": "Erro interno do servidor"
}
No links

POST
/api/capsules
Criar nova cápsula


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "title": "Nossa primeira viagem",
  "content": "Hoje visitamos Paris pela primeira vez juntos...",
  "openAt": "2024-12-25T00:00:00Z"
}
Responses
Code	Description	Links
201	
Cápsula criada com sucesso

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "clp123abc456def789",
  "title": "Nossa primeira viagem juntos",
  "content": "Hoje visitamos Paris pela primeira vez...",
  "imageUrl": "https://exemplo.com/imagem.jpg",
  "songUrl": "https://open.spotify.com/track/123",
  "location": "Paris, França",
  "openAt": "2025-06-08T01:22:35.378Z",
  "isOpened": false,
  "coupleId": "string",
  "createdAt": "2025-06-08T01:22:35.378Z"
}
No links
400	
Dados inválidos

Media type

application/json
Example Value
Schema
{
  "error": "Erro interno do servidor"
}
No links

GET
/api/capsules/{id}
Obter cápsula específica


Parameters
Try it out
Name	Description
id *
string
(path)
ID da cápsula

id
Responses
Code	Description	Links
200	
Dados da cápsula

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "clp123abc456def789",
  "title": "Nossa primeira viagem juntos",
  "content": "Hoje visitamos Paris pela primeira vez...",
  "imageUrl": "https://exemplo.com/imagem.jpg",
  "songUrl": "https://open.spotify.com/track/123",
  "location": "Paris, França",
  "openAt": "2025-06-08T01:22:35.382Z",
  "isOpened": false,
  "coupleId": "string",
  "createdAt": "2025-06-08T01:22:35.382Z"
}
No links
404	
Cápsula não encontrada

Media type

application/json
Example Value
Schema
{
  "error": "Erro interno do servidor"
}
No links

PUT
/api/capsules/{id}
Atualizar cápsula


Parameters
Try it out
Name	Description
id *
string
(path)
ID da cápsula

id
Request body

application/json
Example Value
Schema
{
  "title": "string",
  "content": "string",
  "openAt": "2025-06-08T01:22:35.387Z"
}
Responses
Code	Description	Links
200	
Cápsula atualizada com sucesso

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "clp123abc456def789",
  "title": "Nossa primeira viagem juntos",
  "content": "Hoje visitamos Paris pela primeira vez...",
  "imageUrl": "https://exemplo.com/imagem.jpg",
  "songUrl": "https://open.spotify.com/track/123",
  "location": "Paris, França",
  "openAt": "2025-06-08T01:22:35.387Z",
  "isOpened": false,
  "coupleId": "string",
  "createdAt": "2025-06-08T01:22:35.387Z"
}
No links
404	
Cápsula não encontrada

No links

DELETE
/api/capsules/{id}
Excluir cápsula


Parameters
Try it out
Name	Description
id *
string
(path)
ID da cápsula

id
Responses
Code	Description	Links
200	
Cápsula excluída com sucesso

No links
404	
Cápsula não encontrada

No links

GET
/api/capsules/random
Obter cápsula aleatória do usuário


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Cápsula aleatória

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "clp123abc456def789",
  "title": "Nossa primeira viagem juntos",
  "content": "Hoje visitamos Paris pela primeira vez...",
  "imageUrl": "https://exemplo.com/imagem.jpg",
  "songUrl": "https://open.spotify.com/track/123",
  "location": "Paris, França",
  "openAt": "2025-06-08T01:22:35.393Z",
  "isOpened": false,
  "coupleId": "string",
  "createdAt": "2025-06-08T01:22:35.393Z"
}
No links
404	
Nenhuma cápsula encontrada

No links
Couples
Gerenciamento de casais



POST
/api/couples/invite
Convidar parceiro


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "partnerEmail": "parceiro@email.com"
}
Responses
Code	Description	Links
200	
Convite enviado com sucesso

No links
Dreams
Gerenciamento de sonhos futuros



GET
/api/dreams
Listar todos os sonhos



POST
/api/dreams
Criar novo sonho


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "title": "Viajar para o Japão",
  "description": "Queremos conhecer Tóquio..."
}
Responses
Code	Description	Links
201	
Sonho criado com sucesso

No links
Health


GET
/
Endpoint de saúde da API


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
API funcionando corretamente

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "message": "Amorarium API está funcionando!",
  "version": "1.0.0",
  "timestamp": "2025-06-08T01:22:35.400Z"
}
No links

Schemas
User{
id	[...]
name*	[...]
email*	[...]
password*	[...]
coupleId	[...]
createdAt	[...]
}
Couple{
id	[...]
createdAt	[...]
users	[...]
}
Capsule{
id	[...]
title*	[...]
content*	[...]
imageUrl	[...]
songUrl	[...]
location	[...]
openAt*	[...]
isOpened	[...]
coupleId	[...]
createdAt	[...]
}
Dream{
id	[...]
title*	[...]
description*	[...]
isCompleted	[...]
coupleId	[...]
createdAt	[...]
}
Error{
error	[...]
}
AuthResponse{
token	[...]
user	{...}
}