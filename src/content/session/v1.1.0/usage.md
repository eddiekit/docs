# Using @eddiekit/session in SvelteKit (v1.1.0)

Version 1.1.0 includes all the features of v1.0.0 plus performance improvements and simplified middleware.

## 1. Create a Session Store

Implementing the `Store` interface remains the same as in v1.0.0.

```typescript
import type { Store, Session } from '@eddiekit/session';
// ... implementation
```

## 2. Initialize the Session Handler

The `createHandleSession` helper now also accepts optional configuration for cookie names and security settings.

```typescript
import { createHandleSession } from '@eddiekit/session';
import { RedisStore } from '$lib/server/redisStore'; // v1.1.0 recommended

const store = new RedisStore();

export const handle = createHandleSession(store, {
    // Optional configuration
});
```

## 3. Working with Payload Caching

In v1.1.0, session payloads are cached efficiently. Use `session.set()` and `session.get()` to manage session-specific data across requests.

```typescript
// Set data
locals.session.set('theme', 'dark');

// Get data
const theme = locals.session.get('theme');
```

For more details on upgrading from v1.0.0, see the [Upgrade Guide](./upgrade).
