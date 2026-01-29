# Using @eddiekit/session in SvelteKit

This guide explains how to integrate `@eddiekit/session` into your SvelteKit application for robust, database-agnostic session management.

## 1. Create a Session Store

First, you need to implement the `Store` interface to persist sessions. Here is an example using an in-memory map (useful for development, but use a database in production):

```typescript
import type { Store, Session } from '@eddiekit/session';

export class MemoryStore implements Store {
    private sessions = new Map<string, Session>();

    async read(id: string): Promise<Session | null> {
        return this.sessions.get(id) || null;
    }

    async write(session: Session): Promise<void> {
        this.sessions.set(session.id, session);
    }

    async deleteBySessionId(id: string): Promise<void> {
        this.sessions.delete(id);
    }

    async deleteByUserId(userId: number): Promise<void> {
        for (const [id, session] of this.sessions) {
            if (session.userId === userId) {
                this.sessions.delete(id);
            }
        }
    }
}
```

## 2. Initialize the Session Handler

In your `src/hooks.server.ts`, use the `createHandleSession` helper to manage session cookies and populate `event.locals.session`.

```typescript
import { createHandleSession } from '@eddiekit/session';
import { MemoryStore } from '$lib/server/sessionStore';

const store = new MemoryStore();

export const handle = createHandleSession(store, {});
```

## 3. Define Types

To get full type safety in your `event.locals`, update your `src/app.d.ts`:

```typescript
import type { Session } from '@eddiekit/session';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
		}
	}
}

export {};
```

## 4. Managing Sessions

### Creating a Session
When a user logs in, create a new session and set the cookie:

```typescript
import { createSession, setSessionTokenCookie } from '@eddiekit/session';

// ... inside a form action or API route
const session = await createSession(store, user.id, event.getClientAddress(), event.request.headers.get('user-agent') || '');
setSessionTokenCookie(event, session.token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30));
```

### Invalidating a Session
When a user logs out, invalidate the session and delete the cookie:

```typescript
import { invalidateSession, deleteSessionTokenCookie } from '@eddiekit/session';

// ... inside a logout action
if (event.locals.session) {
    await invalidateSession(store, event.locals.session.id);
    deleteSessionTokenCookie(event);
}
```

### Accessing Session Data
You can now access the session and its payload anywhere in your server-side code:

```typescript
export const load = async ({ locals }) => {
    if (locals.session) {
        console.log('User ID:', locals.session.userId);
        console.log('Custom Data:', locals.session.get('my-key'));
    }
    return {};
};
```
