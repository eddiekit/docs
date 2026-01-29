<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="prose max-w-none prose-invert prose-blue">
	<h1>Welcome to EddieKit Documentation</h1>
	<p class="text-xl text-slate-400">
		Select a package from the sidebar to get started. EddieKit is a modular suite of SvelteKit
		utilities designed to speed up your development process.
	</p>

	<div class="mt-12 grid grid-cols-2 gap-6">
		<a
			href="/session/v1.0.0/introduction"
			class="group rounded-xl border border-slate-800 p-6 transition-colors hover:bg-slate-900"
		>
			<h3 class="text-blue-400 group-hover:text-blue-300">Session Management</h3>
			<p class="mt-2 text-slate-400">
				Database-agnostic session management with support for multiple stores.
			</p>
		</a>
		<a
			href="/auth/v1.0.0/introduction"
			class="group rounded-xl border border-slate-800 p-6 transition-colors hover:bg-slate-900"
		>
			<h3 class="text-blue-400 group-hover:text-blue-300">Authentication</h3>
			<p class="mt-2 text-slate-400">
				Powerful authentication flows built on top of our session package.
			</p>
		</a>
	</div>
</div>
