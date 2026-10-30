# talherzim-frontend

Front-end do **Talherzim** — aplicativo web que ajuda o usuário a cozinhar com o que já tem em casa: ele cadastra os ingredientes da **despensa**, vê **receitas sugeridas** e salva as preferidas nos **favoritos**.

Consome a API do [`talherzim-backend`](https://github.com/Talhezim-Receitas-Rapidas/talherzim-backend) (Node.js + Express + PostgreSQL). Contrato de autenticação: `src/openapi.yaml` no repositório do back-end.

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

App local: `http://localhost:5173` (porta padrão do Vite). O back-end deve estar em `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex.: `http://localhost:3000`). Se não definida, o `httpClient` usa `http://localhost:3000` e o serviço de receitas usa dados mockados |

> Variáveis `VITE_*` ficam expostas no bundle do navegador. Nunca coloque segredos nelas.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Checa tipos (`tsc -b`) e gera o build em `dist/` |
| `npm run preview` | Serve localmente o build gerado |
| `npm run lint` | Verifica o código com ESLint |

_(No Windows PowerShell, caso o script `.ps1` seja bloqueado por política de execução, use `npm.cmd run dev`)_

## Stack

| Camada | Tecnologia |
|---|---|
| Build / dev server | Vite 8 + `@vitejs/plugin-react` |
| UI | React 19 + TypeScript 6 |
| Estilo | Tailwind CSS 4 (`@tailwindcss/vite`, tokens em `src/index.css`) |
| Rotas | React Router 7 (`react-router-dom`) |
| Dados do servidor | TanStack Query 5 |
| HTTP | Axios (`httpClient`) e `fetch` (serviço de receitas) |
| Estado global | Zustand (com `persist`) |
| Formulários / validação | React Hook Form + Zod (`@hookform/resolvers`) |
| Ícones | lucide-react |
| Mocks | MSW 2 (handlers em `src/mocks/handlers.ts`) |
| Qualidade | ESLint 10 + typescript-eslint + `react-hooks` + `react-refresh` |

## Arquitetura

O código é organizado **por feature**, com componentes de interface genéricos separados.

```
src/
├── main.tsx                    # Ponto de entrada: QueryClientProvider + AppRouter
├── index.css                   # Tailwind + tokens de design (@theme)
├── app/
│   ├── router.tsx              # Definição de todas as rotas
│   ├── ProtectedRoute.tsx      # Guarda de rota (exige token)
│   └── App.tsx                 # Wrapper de AppRouter (não é usado pelo main.tsx)
├── pages/
│   └── auth/                   # LoginPage, RegisterPage (orquestram form + serviço)
├── features/
│   ├── auth/                   # authService, authStore, AuthLayout, LoginForm, RegisterForm
│   ├── despensa/               # CRUD de ingredientes
│   └── receitas/               # sugestões, detalhe, favoritos
├── components/ui/              # Button, Input, FormError, Logo
├── services/
│   └── httpClient.ts           # Instância Axios com interceptors
└── mocks/
    └── handlers.ts             # Handlers MSW de /auth/login e /auth/register
```

### Fluxo de dados

```
Página → hook (React Query) → service → httpClient (Axios) → API
                 ↑                             │
          cache / invalidação          interceptors: injeta Bearer token,
                                       faz logout em 401
```

- **Componentes de formulário** (`LoginForm`, `RegisterForm`, `IngredientForm`) são de apresentação. Quem cria o `useForm` e o schema Zod é a página (login/cadastro) ou o próprio formulário (despensa).
- **Services** concentram a comunicação com a API e a tradução de formatos (ex.: `password` → `senha`).
- **Hooks** (`useDespensa.ts`) envolvem os services em `useQuery`/`useMutation` e invalidam o cache após cada mutação.

## Rotas

Definidas em `src/app/router.tsx`.

| Rota | Página | Acesso |
|---|---|---|
| `/login` | `LoginPage` | pública |
| `/cadastro` | `RegisterPage` | pública |
| `/despensa` | `DespensaPage` | protegida |
| `/receitas-sugeridas` | `RecipesListPage` | protegida |
| `/receitas/:id` | `RecipeDetailPage` | protegida |
| `/favoritos` | `FavoritesPage` | protegida |
| `/` e `*` | redireciona para `/despensa` | — |

`ProtectedRoute` lê `token` do `useAuthStore`; sem token, redireciona para `/login`.

## Módulos

### Autenticação (`features/auth`, `pages/auth`)

| Arquivo | Responsabilidade |
|---|---|
| `authService.ts` | `login(payload)` → `POST /auth/login`; `registrar(payload)` → `POST /auth/register` e, em seguida, login automático. Converte `password` em `senha` para o contrato do back-end |
| `authStore.ts` | Store Zustand persistida em `localStorage` (chave `talherzim-auth`). Estado: `token`, `isAuthenticated`. Ações: `setToken`, `logout` |
| `LoginPage.tsx` | Schema Zod (e-mail válido, senha ≥ 6), chama `login`, grava o token e navega para `/despensa`. Exibe "E-mail ou senha inválidos" em qualquer falha |
| `RegisterPage.tsx` | Schema Zod (nome obrigatório, e-mail, senha ≥ 6, confirmação igual, aceite dos termos), chama `registrar` |
| `AuthLayout.tsx` | Moldura das telas de auth: cabeçalho com logo, card central e rodapé. Os `onNavigate*` são opcionais |
| `LoginForm.tsx` / `RegisterForm.tsx` | Formulários controlados por props (`register`, `errors`, `onSubmit`, `isLoading`, `serverError`) |

Contrato usado:

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| POST | `/auth/login` | `{ email, senha }` | `{ token, usuario: { id, email } }` |
| POST | `/auth/register` | `{ email, senha }` | `{ id, email }` |

### Despensa (`features/despensa`)

Gerencia os ingredientes do usuário (nome, quantidade, unidade).

| Arquivo | Responsabilidade |
|---|---|
| `despensaSchema.ts` | Schema Zod: `nome` (2–100 caracteres), `quantidade` (> 0, finita), `unidade` (`un`, `g`, `kg`, `ml`, `l`). Exporta `DespensaFormData` |
| `despensaService.ts` | Cliente REST de `/despensa` (`listar`, `cadastrar`, `atualizar` via `PUT /despensa/:id`, `remover`). `listar` aceita array puro ou objeto com `itens`, `ingredientes` ou `data` |
| `despensaMockService.ts` | Implementação com a mesma interface, persistida em `localStorage` (`talherzim:despensa:mock:v1`), com 5 ingredientes iniciais e validação do JSON armazenado |
| `useDespensa.ts` | Hooks `useIngredientes`, `useCadastrarIngrediente`, `useAtualizarIngrediente`, `useRemoverIngrediente`. Query key: `['despensa']` |
| `IngredientForm.tsx` | Formulário de criação/edição. Faz `reset` quando `ingrediente` muda |
| `DespensaPage.tsx` | Tela principal: busca local por nome, formulário inline, cards, confirmação de exclusão (`window.confirm`) e estados de loading, erro, vazio e sem resultado. `getErrorMessage` traduz os códigos `nao_autenticado`, `token_invalido` e `dados_invalidos` |

### Receitas (`features/receitas`)

| Arquivo | Responsabilidade |
|---|---|
| `receitaService.ts` | `listarReceitasSugeridas()` → `GET /receitas/sugeridas`; `buscarReceita(id)` → `GET /receitas/:id`. Normaliza a resposta (`normalizarReceita`), aplica `FALLBACK_IMAGE` e lança `ReceitaApiError` (com `status`). Sem `VITE_API_URL`, devolve 3 receitas mockadas |
| `favoritosService.ts` | Favoritos persistidos em `localStorage` (`talherzim:receitas-favoritas`), com cache em memória, sincronização entre abas (evento `storage`) e o hook `useFavoritos()` baseado em `useSyncExternalStore` |
| `RecipesListPage.tsx` | Lista sugestões, com busca por nome ou ingrediente e estados de loading, erro e vazio |
| `RecipeCard.tsx` | Card com imagem, ingredientes em comum, tempo de preparo e `FavoriteButton` |
| `RecipeDetailPage.tsx` | Detalhe: ingredientes e modo de preparo. Aceita itens como `string` ou objeto. Não faz retry em 404 |
| `FavoritesPage.tsx` | Busca cada receita favorita (`Promise.all`) por `['receitas-favoritas', ids]` |
| `FavoriteButton.tsx` | Alterna favorito (`aria-pressed`). Fica fora do `<Link>` para evitar links aninhados |
| `RecipesHeader.tsx` | Cabeçalho compartilhado, com navegação desktop/mobile e prop `activePage` (`despensa`, `receitas`, `favoritos`) |
| `StatePanel.tsx` | Painel reutilizável para estados vazio/erro (`icon`, `title`, `action`) |

### Componentes de UI (`components/ui`)

| Componente | Props principais |
|---|---|
| `Button` | `variant` (`primary`, `secondary`, `outline`, `social`), `fullWidth` (padrão `true`), `isLoading` (mostra spinner e desabilita) |
| `Input` | `id`, `label`, `error`, `isPassword` (botão exibir/ocultar), `rightIcon`. Usa `forwardRef` (compatível com `register`) e liga `aria-invalid`/`aria-describedby` |
| `FormError` | `id`, `message`. Não renderiza nada sem mensagem; usa `role="alert"` |
| `Logo` | Logo em SVG; aceita props de `<svg>` |

### HTTP (`services/httpClient.ts`)

- `baseURL`: `VITE_API_URL` ou `http://localhost:3000`.
- **Request:** injeta `Authorization: Bearer <token>` com o token do `useAuthStore`.
- **Response:** em erro `401`, chama `logout()` e rejeita a promise, o que devolve o usuário ao login via `ProtectedRoute`.

### Estilo e tema

Tokens em `src/index.css` (`@theme`): `brand`, `brand-hover`, `brand-focus`, `ink`, `danger`, `cream*`, `stone-*`. Visual "neo-brutalista": bordas `border-2 border-ink` e sombras sólidas (`shadow-[4px_4px_0px_0px_theme(colors.ink)]`). O `index.html` aplica a classe `dark` se `localStorage['talherzim:theme'] === 'dark'`, mas os componentes ainda não usam variantes `dark:`.

### Mock de API (MSW)

`src/mocks/handlers.ts` simula `/auth/login` (e-mail `erro@teste.com` → 401) e `/auth/register` (`existente@teste.com` → 409; senha < 8 → 422). O pacote está configurado para gerar o worker em `public/`, mas **o worker ainda não é iniciado** em `main.tsx`.

## Persistência no navegador

| Chave (`localStorage`) | Quem grava | Conteúdo |
|---|---|---|
| `talherzim-auth` | `authStore` | `{ token, isAuthenticated }` |
| `talherzim:receitas-favoritas` | `favoritosService` | Array de IDs de receitas |
| `talherzim:despensa:mock:v1` | `despensaMockService` | Ingredientes mockados |
| `talherzim:theme` | (leitura em `index.html`) | `dark` ou ausente |

## Como estender

**Nova tela protegida**
1. Crie a pasta em `src/features/<nome>/` com `Page`, `service` e, se usar cache, um hook.
2. Registre a rota em `src/app/router.tsx` dentro de `<ProtectedRoute>`.
3. Reutilize `RecipesHeader` e `StatePanel` para manter navegação e estados consistentes.

**Novo endpoint**
1. Crie a função no service da feature usando `httpClient` (token e 401 já tratados).
2. Defina interfaces de payload e resposta no mesmo arquivo.
3. Envolva em `useQuery`/`useMutation` e invalide a query key relacionada no `onSuccess`.

**Novo formulário**
1. Escreva o schema Zod e derive o tipo com `z.infer`.
2. Use `useForm` com `zodResolver` e os componentes `Input`, `Button` e `FormError`.

## Limitações conhecidas

Divergências entre o código atual e o fluxo completo com o back-end:

| # | Situação | Onde |
|---|---|---|
| 1 | A despensa usa `despensaMockService` nos hooks; `despensaService` (REST) existe, mas não está ligado | `useDespensa.ts` |
| 2 | `receitaService` lê o token em `localStorage['token']`, mas o login grava em `talherzim-auth`. Com `VITE_API_URL` definido, as chamadas de receitas vão sem `Authorization` | `receitaService.ts` |
| 3 | Sem `VITE_API_URL`, as receitas vêm de um mock estático | `receitaService.ts` |
| 4 | O campo `name` do cadastro é validado, mas **não é enviado** (a API ainda não o aceita) | `authService.ts` |
| 5 | `rememberMe` existe no formulário de login, mas não altera o comportamento | `LoginForm.tsx` |
| 6 | A senha exige 6+ caracteres no front-end; o mock de cadastro exige 8 | `LoginPage.tsx`, `RegisterPage.tsx`, `handlers.ts` |
| 7 | Em `RecipeDetailPage`, "Voltar às receitas" navega para `/receitas`, que não existe e cai no redirecionamento para `/despensa`. A rota correta é `/receitas-sugeridas` | `RecipeDetailPage.tsx` |
| 8 | Ajuda, Termos, Privacidade e "Esqueceu a senha?" são callbacks vazios | `LoginPage.tsx`, `RegisterPage.tsx` |
| 9 | `App.tsx` não é usado; `main.tsx` renderiza `AppRouter` direto | `app/App.tsx` |
| 10 | O worker do MSW não é iniciado | `main.tsx`, `mocks/` |

## Qualidade de código

```bash
npm run lint     # verifica o código com ESLint
npm run build    # valida os tipos com tsc antes de gerar o build
```

> O projeto ainda não possui testes automatizados nem formatador (Prettier).

## Licença

[MIT](LICENSE)
