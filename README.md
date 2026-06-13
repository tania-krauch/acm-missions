# ACM Missions

ACM Missions is a web game base for episodic hacking challenges set on a damaged spaceship. The starter implementation uses a reusable game shell, episode/challenge metadata, Fastify validation routes, hosted Supabase readiness, Docker routing, and a deliberately disabled code-execution boundary.

## Stack

| Area | Choice |
| --- | --- |
| Monorepo | pnpm workspaces |
| Game frontend | Vite, React, TypeScript |
| Landing frontend | Vite, React, TypeScript |
| Animation | anime.js |
| Styling | CSS with shared tokens/components |
| Backend API | Node.js, Fastify, TypeScript |
| Auth/data | Hosted Supabase |
| Local routing | nginx in Docker Compose |
| Code challenges | Placeholder runner service, disabled by default |

## Repository Layout

```txt
apps/
  api/          Fastify API for episodes, progress, validation, and Supabase auth
  code-runner/  Placeholder service for future isolated code execution
  game/         Vite React game shell and challenge UIs
  landing/      Placeholder landing app for teammates to replace

packages/
  episode-engine/  Shared episode registry and lookup helpers
  types/           Shared TypeScript contracts
  ui/              Shared UI primitives and CSS

docker/
  nginx/           Reverse proxy config
```

## Local Development

### Requirements

The short dependency checklist is in `requirements.txt`. Because this is a Node.js project, do not use `pip install -r requirements.txt`; install JavaScript dependencies with `pnpm install`.

This repo is configured for `pnpm`. If `pnpm` is not installed globally, use Corepack:

```sh
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

If you only want the Docker-routed stack, you can skip running `pnpm dev` and use Docker Compose instead.

App ports during local development:

| App | URL |
| --- | --- |
| Landing | `http://localhost:5173` |
| Game sign in | `http://localhost:5174/game/sign-in` |
| Game sign up | `http://localhost:5174/game/sign-up` |
| Game play shell | `http://localhost:5174/game/play` |
| API | `http://localhost:3000/health` |

## Docker Development

Start the default app stack:

```sh
docker compose up --build
```

Then open:

```txt
http://localhost:8080
http://localhost:8080/game/sign-in
http://localhost:8080/health
http://localhost:8080/api/episodes
```

Start the optional sandbox placeholder profile:

```sh
docker compose --profile sandbox up --build
```

The `code-runner` service is attached only to an internal Docker network. It is reachable by the API but not exposed publicly.

## Environment Variables

Copy `.env.example` to `.env` when you are ready to configure local secrets.

```txt
AUTH_MODE=mock
LANDING_BASE_URL=http://localhost:5173
GAME_BASE_URL=http://localhost:5174/game
API_BASE_URL=http://localhost:3000/api
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SANDBOX_ENABLED=false
CODE_RUNNER_URL=http://code-runner:4001

VITE_LANDING_BASE_URL=http://localhost:5173
VITE_GAME_BASE_URL=http://localhost:5174/game
VITE_GAME_BASE_PATH=/game/
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use `AUTH_MODE=mock` for early development. In mock mode the API accepts `x-player-id` and does not require Supabase tokens.

Use `AUTH_MODE=supabase` when registration/login is connected. The frontend should send the Supabase access token as:

```txt
Authorization: Bearer <access-token>
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

The URL variables are the deployment switches:

| Variable | Used by | Local direct dev | Docker / same-origin deploy |
| --- | --- | --- | --- |
| `VITE_LANDING_BASE_URL` | Landing public URL references | `http://localhost:5173` | `/` |
| `VITE_GAME_BASE_URL` | Landing links, game auth redirects, game route builder | `http://localhost:5174/game` | `/game` |
| `VITE_GAME_BASE_PATH` | Vite game asset/router base path | `/game/` | `/game/` |
| `VITE_API_BASE_URL` | Browser calls from game to API | `http://localhost:3000/api` | `/api` |
| `API_BASE_URL` | Server/deploy metadata for the API public route | `http://localhost:3000/api` | `/api` |

For local Supabase login, fill these values:

```txt
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<optional-server-only-service-role-key>
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

The game uses `VITE_SUPABASE_*` values for browser sign in and sign up. The API uses
`SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` to validate bearer tokens.

## Routing

The Docker nginx proxy maps:

```txt
/       -> apps/landing
/game/  -> apps/game
/api/   -> apps/api
/health -> apps/api health check
```

This lets teammates work on the landing and registration app without coupling it to the game shell.

## Episode And Challenge Design

An episode is a story unit. A challenge is a playable task inside that episode.

```ts
type Challenge = {
  id: string;
  episodeId: string;
  title: string;
  type: "circuit-repair" | "file-tree-reconstruction" | "password-crack" | "code-submission";
  validationMode: "client" | "server" | "sandbox";
  order: number;
  config: Record<string, unknown>;
};
```

Every challenge has a UI component. Validation is selected independently:

| Validation mode | Use for |
| --- | --- |
| `client` | Low-stakes UI-only interactions |
| `server` | Normal puzzles where answers should be checked by Fastify |
| `sandbox` | User-submitted code challenges |

Current sample episode:

```txt
Engineering Bay: Cold Start
  1. Repair Circuit
  2. Reconstruct Directory
  3. Recover Access Code
  4. Patch Telemetry Parser
```

The frontend renders challenges through `ChallengeRenderer`, while the API validates submissions through `validateChallenge`.

## Sandbox Placeholder

The code runner intentionally does not execute user code yet. It returns `501` with a clear message.

That is intentional. Full sandboxing should be added as a separate implementation pass with:

- per-submission process isolation
- no public network access
- CPU and memory limits
- execution timeouts
- read-only hidden tests
- strict language/runtime allowlists
- result-only communication back to the API

The existing boundary is:

```txt
React challenge UI
  -> Fastify /api/challenges/:challengeId/submit
    -> validationMode switch
      -> code-runner /run when SANDBOX_ENABLED=true
```

This means UI-only and server-validated challenges can ship first, while code execution can be hardened later without reshaping the game app.

## Supabase Plan

Recommended starting tables:

```txt
profiles
episodes
episode_progress
challenge_attempts
player_inventory
achievements
```

For the first implementation pass, keep canonical progress writes behind the Fastify API. The browser should not directly mark challenges complete.

## Useful Scripts

```sh
pnpm dev             # run landing, game, and api
pnpm build           # build all workspaces
pnpm check           # run the workspace typecheck
pnpm typecheck       # typecheck all workspaces
pnpm precommit       # run the same check used by the Git pre-commit hook
pnpm docker:dev      # start Docker Compose default stack
pnpm docker:sandbox  # start Docker Compose with placeholder code-runner
```

## Pre-Commit Hook

The repository uses a tracked Git hook in `.githooks/pre-commit`. It runs `scripts/pre-commit-check.sh`, which checks that dependencies are installed and then runs the workspace TypeScript typecheck.

Enable the hook for a clone:

```sh
git config core.hooksPath .githooks
```

Running `pnpm install` also attempts to set this through the `prepare` script.

## Next Implementation Steps

1. Connect landing login/registration to hosted Supabase.
2. Replace mock API progress with Supabase-backed progress tables.
3. Build the first real puzzle interaction for `circuit-repair`.
4. Add episode unlock logic and challenge completion persistence.
5. Design the hardened sandbox before enabling user-submitted code execution.
