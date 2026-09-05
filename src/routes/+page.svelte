<script lang="ts">
	import { base } from "$app/paths";

	const modules = import.meta.glob("/src/content/*.md", { eager: true }) as Record<
		string,
		{ metadata?: { title?: string; category?: string } }
	>;

	function titleCase(id: string) {
		return id.charAt(0).toUpperCase() + id.slice(1);
	}

	const entries = Object.entries(modules)
		.map(([filePath, mod]) => {
			const id = filePath.replace("/src/content/", "").replace(".md", "");
			return {
				id,
				name: mod.metadata?.title ?? titleCase(id),
				category: mod.metadata?.category ?? "package",
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	const packages = entries.filter((e) => e.category === "package");
	const tools = entries.filter((e) => e.category === "cli");
</script>

<div class="prose max-w-none prose-invert prose-blue">
	<h1>Welcome to EddieKit Documentation</h1>
	<p class="text-xl text-slate-400">
		Select a package from the sidebar to get started. EddieKit is a modular suite of SvelteKit
		utilities designed to speed up your development process.
	</p>

	{#if tools.length > 0}
		<div class="mt-12 not-prose">
			<div class="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">CLI</div>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{#each tools as tool}
					<a
						href="{base}/{tool.id}"
						class="group rounded-xl border border-blue-900/50 bg-blue-950/20 p-6 transition-colors hover:bg-blue-950/40"
					>
						<h3 class="text-blue-400 group-hover:text-blue-300">{tool.name}</h3>
						<p class="mt-2 text-sm text-slate-400">
							Add eddiekit packages to a SvelteKit project, with the hooks.server.ts / app.d.ts
							wiring done for you.
						</p>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mt-12 not-prose">
		<div class="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Packages</div>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#each packages as pkg}
				<a
					href="{base}/{pkg.id}"
					class="group rounded-xl border border-slate-800 p-6 transition-colors hover:bg-slate-900"
				>
					<h3 class="text-blue-400 group-hover:text-blue-300">{pkg.name}</h3>
				</a>
			{/each}
		</div>
	</div>
</div>
