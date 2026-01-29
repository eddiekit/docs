# Using @eddiekit/captcha

This guide shows how to integrate Cloudflare Turnstile into your SvelteKit forms.

## 1. Client-side Integration

Use the `Turnstile` component in your Svelte page. You'll need a `sitekey` from the Cloudflare dashboard.

```svelte
<script lang="ts">
	import { Turnstile } from '@eddiekit/captcha';
	
	let token = $state('');
</script>

<form method="POST">
	<input type="text" name="username" placeholder="Username" />
	
	<Turnstile 
		sitekey="YOUR_SITE_KEY" 
		onsuccess={(t) => token = t} 
	/>

	<input type="hidden" name="cf-turnstile-response" value={token} />
	
	<button type="submit" disabled={!token}>Submit</button>
</form>
```

## 2. Server-side Verification

In your form action, use `verifyTurnstileToken` to validate the response.

```typescript
import { fail } from '@sveltejs/kit';
import { verifyTurnstileToken } from '@eddiekit/captcha';
import { TURNSTILE_SECRET_KEY } from '$env/static/private';

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const token = data.get('cf-turnstile-response') as string;

		if (!token) {
			return fail(400, { message: 'Captcha is required' });
		}

		const outcome = await verifyTurnstileToken(
			token, 
			TURNSTILE_SECRET_KEY,
			getClientAddress()
		);

		if (!outcome.success) {
			return fail(400, { message: 'Captcha verification failed' });
		}

		// Proceed with form submission...
	}
};
```
