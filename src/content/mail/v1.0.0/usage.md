# Using @eddiekit/mail

`@eddiekit/mail` provides a structured way to send emails using Svelte components or MJML templates.

## 1. Setup Mailer

First, you need to configure the global mailer. Typically, you do this in a server-side initialization file (e.g., `src/lib/server/mail.ts`).

```typescript
import { Mail, Mailer } from '@eddiekit/mail';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM_ADDRESS, MAIL_FROM_NAME } from '$env/static/private';

Mail.setMailer(new Mailer({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
    from: {
        address: MAIL_FROM_ADDRESS,
        name: MAIL_FROM_NAME
    }
}));
```

## 2. Define a Mailable

Instead of manually constructing email options, you create a "Mailable" class. This keeps your email logic organized.

### Example with Svelte

Create a Svelte component for your email body:

```svelte
<!-- src/lib/emails/WelcomeEmail.svelte -->
<script lang="ts">
    let { name } = $props();
</script>

<h1>Welcome, {name}!</h1>
<p>Thanks for joining our amazing platform.</p>
```

Then, create a Mailable class:

```typescript
// src/lib/server/mailables/WelcomeMailable.ts
import { Mailable } from '@eddiekit/mail';
import WelcomeEmail from '$lib/emails/WelcomeEmail.svelte';

export class WelcomeMailable extends Mailable {
    constructor(private user: { email: string, name: string }) {
        super();
    }

    async build() {
        this.to(this.user.email)
            .subject('Welcome to Appletto!')
            .view(WelcomeEmail, { name: this.user.name });
    }
}
```

### Example with MJML

If you prefer MJML for responsive email design:

```typescript
import { Mailable } from '@eddiekit/mail';

const template = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Hello {{name}}!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

export class MJMLMailable extends Mailable {
    async build() {
        this.to('user@example.com')
            .subject('Responsive Email')
            .mjml(template, { name: 'Eddie' });
    }
}
```

## 3. Sending Email

Once your Mailable is defined, sending it is simple:

```typescript
import { Mail } from '@eddiekit/mail';
import { WelcomeMailable } from '$lib/server/mailables/WelcomeMailable';

const mailable = new WelcomeMailable({
    email: 'user@example.com',
    name: 'Eddie'
});

await Mail.send(mailable);
```

You can also chain methods directly if needed:

```typescript
await Mail.send(new MyMailable().to('test@test.com').subject('Quick Note'));
```
