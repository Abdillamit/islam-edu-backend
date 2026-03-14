# Contributing

## Branching
- Keep `main` stable.
- Create feature branches with format `feat/<scope>`, `fix/<scope>`, or `chore/<scope>`.
- Open a pull request into `main` for every branch.

## Commit style
- Use Conventional Commits:
  - `feat:`
  - `fix:`
  - `chore:`
  - `docs:`
  - `refactor:`
  - `test:`

## Local checks
Run before pushing:

```bash
npm run prisma:generate
npm run lint
npm run test
npm run test:e2e
```
