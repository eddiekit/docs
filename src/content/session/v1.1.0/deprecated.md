# Deprecated Features in v1.1.0

The following features are deprecated and will be removed in v2.0.0.

## Deprecations

### `MemoryStore`
The `MemoryStore` is now deprecated. It is not suitable for production use and lacks many of the features of the newer stores.

**Replacement**: Use `SQLiteStore` or `RedisStore`.

### `session.clear()`
The `clear()` method on the session object is deprecated in favor of `session.destroy()`.

```javascript
// Deprecated
session.clear();

// Recommended
session.destroy();
```
