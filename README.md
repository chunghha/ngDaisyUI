# ngDaisyUI

Angular + Tailwind + DaisyUI demo for browsing country data with optional local AI-generated country briefs.

## Stack

- Angular standalone components
- Tailwind CSS and DaisyUI
- TanStack Angular Query for country data loading
- TanStack AI with a browser-safe llama.cpp adapter for local AI briefs
- Vitest and Testing Library for tests
- Biome for formatting and linting

## Setup

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

Open `http://localhost:4200/`.

## Country Data

Countries are loaded from the maintained public dataset:

```text
https://raw.githubusercontent.com/mledoze/countries/master/countries.json
```

The app maps that dataset into the local `Country` shape and uses the free Rest Countries flag CDN for SVG flags.

## Local AI Briefs

The `Details` button on each country card calls a local llama.cpp server through TanStack AI.

Expected llama.cpp endpoint:

```text
http://127.0.0.1:8080/v1/chat/completions
```

Start any compatible GGUF chat model with `llama-server` on port `8080`:

```bash
llama-server \
  -m /path/to/model.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  -fa auto \
  -c 32768 \
  -rea off
```

The important requirements are:

- Serve the OpenAI-compatible chat endpoint at `http://127.0.0.1:8080/v1/chat/completions`.
- Use a chat/instruct GGUF model.
- Disable reasoning with `-rea off` so llama.cpp returns final text in `message.content` instead of only `reasoning_content`.

## Scripts

```bash
pnpm dev          # Start Angular dev server
pnpm build        # Production build
pnpm test         # Vitest
pnpm test:cov     # Vitest with coverage
pnpm check        # Biome check/fix for src
pnpm check:all    # Biome check plus coverage
```

## Verification

Before committing, run:

```bash
pnpm check:all
```

For a production build check:

```bash
pnpm build
```

Current build warnings are expected:

- Initial bundle exceeds the configured warning budget.
- `partial-json`, used by `@tanstack/ai`, is CommonJS and triggers an Angular optimization warning.
