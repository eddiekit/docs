# Upgrade Guide: v1.0.0 to v1.1.0

Upgrading to v1.1.0 is straightforward for most users.

## Breaking Changes

### Session Store Interface
The `SessionStore` interface has been updated to support asynchronous initialization.

```diff
- interface SessionStore {
-   get(id: string): Session;
+ interface SessionStore {
+   get(id: string): Promise<Session>;
```

## How to Upgrade

1. Update your package dependency:
   ```bash
   pnpm add @eddiekit/session@1.1.0
   ```
2. If you are using a custom store, ensure it now returns a `Promise`.
