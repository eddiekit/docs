# Eddiekit Base Project

`base` is a reusable SvelteKit starter template pre-configured with the `@eddiekit` core packages.

## Overview

The base project provides a solid foundation for building new applications within the Eddiekit monorepo. It comes out-of-the-box with:

- **Authentication**: Pre-configured Login, Signup, and Password Reset flows.
- **Session Management**: Secure session handling using `@eddiekit/session`.
- **Database Agnostic**: Uses stubbed interfaces for `UserProvider` and `SessionStore`, allowing you to plug in any database (Kysely, Drizzle, etc.).
- **Tailwind CSS**: Modern UI styling pre-setup.
- **Micro-animations**: Subtle interactions to provide a premium feel.

## Why use Base?

Instead of setting up authentication and session logic from scratch for every new project, `base` allows you to jump straight into building your application's unique features. By implementing a few simple methods in the provided stubs, you have a fully functional authentication system ready to go.
