# Hotel concierge: web

Chat frontend for the Thambili Bay Hotel concierge bot, a demo AI assistant for a fictional hotel. Built with Next.js, TypeScript and Tailwind CSS. The Python API lives in a separate repository.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Workflow

- `master` is protected. Every change goes through a pull request.
- Branch names: `feat/web-0001`, `fix/web-0002`, `chore/web-0003`. The number increases by one for each change.

## License

No license. The source is public for review only. All rights reserved.
