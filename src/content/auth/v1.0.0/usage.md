# Using @eddiekit/auth

`@eddiekit/auth` provides a high-level, database-agnostic authentication framework built on top of `@eddiekit/session`.

## 1. Implement Providers

You'll need to implement the `UserProvider` and `PasswordHasher` interfaces to connect the package to your database and hashing library of choice.

### User Provider
Abstracts your database operations (e.g., Kysely, Prisma, Drizzle).

```typescript
import type { User, UserProvider } from '@eddiekit/auth';

export class MyUserProvider implements UserProvider {
    async getUserByEmail(email: string): Promise<User | null> { /* ... */ }
    async getUserById(id: number): Promise<User | null> { /* ... */ }
    // ... implement other methods
}
```

### Password Hasher
Abstracts password hashing (e.g., Argon2, Bcrypt).

```typescript
import type { PasswordHasher } from '@eddiekit/auth';
import { hash, verify } from '@node-rs/argon2';

export class Argon2Hasher implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return await hash(password);
    }
    async verify(passwordHash: string, password: string): Promise<boolean> {
        return await verify(passwordHash, password);
    }
}
```

## 2. Initialize Auth

Create an instance of the `Auth` class in a server-side file (e.g., `src/lib/server/auth.ts`).

```typescript
import { Auth } from '@eddiekit/auth';
import { sessionStore } from './session';
import { userProvider, passwordHasher } from './providers';

export const auth = new Auth({
    sessionStore,
    userProvider,
    passwordHasher,
    protectedRoutes: ['/admin', '/dashboard'] // Optional automatic protection
});
```

## 3. Configure Hooks

Add the auth handlers to your `src/hooks.server.ts` using `sequence`.

```typescript
import { sequence } from '@sveltejs/kit/hooks';
import { createHandleSession } from '@eddiekit/session';
import { auth } from '$lib/server/auth';

const sessionHandle = createHandleSession(auth.sessionStore, {});
const authHandle = auth.createHandle(); // Populates event.locals.user
const protectionHandle = auth.createProtectionHandle(); // Handles redirects

export const handle = sequence(sessionHandle, authHandle, protectionHandle);
```

## 4. Authentication Workflows

### Login
```typescript
export const actions = {
    login: async (event) => {
        const data = await event.request.formData();
        const result = await auth.login(
            data.get('email'), 
            data.get('password'), 
            event
        );

        if (!result.success) {
            return fail(400, { error: result.error });
        }
        
        throw redirect(302, '/');
    }
};
```

### Route Protection manually
If you don't use `protectionHandle` in hooks, you can protect routes manually in your `load` functions:

```typescript
export const load = async (event) => {
    auth.protect(event); // Redirects to login if not authenticated
    return { user: event.locals.user };
};
```
