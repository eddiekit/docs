# Using @eddiekit/limiter

Rate limiting is essential for protecting your application from brute-force attacks and abuse.

## 1. Setup a Limiter

In your server-side code (e.g., in a lib file or directly in a route), initialize the limiter with a store and configuration.

```typescript
import { Limiter, MemoryStore } from '@eddiekit/limiter';

// Create a persistent store instance
const store = new MemoryStore();

// Define a limiter (e.g., 5 requests per minute)
const loginLimiter = new Limiter(store, {
    limit: 5,
    windowMs: 60 * 1000
});
```

## 2. Check Rate Limits

Use the `check` method to determine if a request should be allowed.

```typescript
export const actions = {
    default: async ({ request, getClientAddress }) => {
        const ip = getClientAddress();
        const result = await loginLimiter.check(ip);

        if (!result.success) {
            return fail(429, { 
                message: `Too many attempts. Please try again in ${result.retryAfter} seconds.` 
            });
        }

        // Proceed with sensitive operation...
    }
};
```

## 3. Implementing a Custom Store

You can implement a custom store by following the `Store` interface. This is useful for distributed systems where you might want to use Redis.

```typescript
import type { Store } from '@eddiekit/limiter';

export class RedisStore implements Store {
    async increment(key: string, windowMs: number) {
        // Implement Redis INCR and EXPIRE logic here
        // Should return { count: number, resetAt: number }
    }
}
```
