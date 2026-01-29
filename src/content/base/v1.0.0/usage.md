# Getting Started with Base

Follow these steps to turn the `base` starter into a fully functional application.

## 1. Implement Database Stubs

The core of the "pluggable" architecture lies in the stubbed servers. You must implement the methods in the following files:

### User Provider
`src/lib/server/auth/provider.ts`

Implement `getUserByEmail`, `createUser`, etc. using your preferred database library.

```typescript
export const userProvider: UserProvider = {
    async getUserByEmail(email: string) {
        return await db.selectFrom('user').where('email', '=', email).executeTakeFirst();
    },
    // ...
};
```

### Session Store
`src/lib/server/session/store.ts`

Implement the `read`, `write`, and `delete` methods.

```typescript
export const sessionStore: Store = {
    async read(id: string) {
        return await db.selectFrom('session').where('id', '=', id).executeTakeFirst();
    },
    // ...
};
```

## 2. Protected Routes

By default, the `Auth` configuration in `src/lib/server/auth.ts` protects specific routes:

```typescript
export const auth = new Auth({
    // ...
    protectedRoutes: ["/dashboard", "/profile"],
    loginRedirect: "/auth/login",
    afterLoginRedirect: "/dashboard"
});
```

Any request to the `protectedRoutes` will automatically redirect to the `loginRedirect` if the user is not authenticated.

## 3. Customizing the UI

The authentication pages are located in `src/routes/auth/`. They use Tailwind CSS and Svelte 5 snippets/runes. You can freely modify these to match your application's brand.

## 4. Environment Variables

Make sure to set up your `.env` file for database connections, mail server credentials (for forgot password), and any other secret keys.
