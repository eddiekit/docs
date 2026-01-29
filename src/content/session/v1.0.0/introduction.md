# Introduction to @eddiekit/session

`@eddiekit/session` is a database-agnostic session management library for SvelteKit.

## Features

- **Database Agnostic**: Use any database you want (Postgres, Redis, etc.)
- **Type Safe**: First-class support for TypeScript
- **Kysely Integration**: Includes a built-in store for Kysely

## Installation

```bash
pnpm add @eddiekit/session
```

## Implementation

To implement sessions in your SvelteKit app, you'll need to:

1. Create a session store
2. Initialize the session handler in `hooks.server.ts`
3. Configure your database schema
