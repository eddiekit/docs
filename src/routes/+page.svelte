<script lang="ts">
	const modules = import.meta.glob("/src/content/*.md", { eager: true }) as Record<
		string,
		{ metadata?: { title?: string } }
	>;

	function titleCase(id: string) {
		return id.charAt(0).toUpperCase() + id.slice(1);
	}

	const packages = Object.entries(modules)
		.map(([filePath, mod]) => {
			const id = filePath.replace("/src/content/", "").replace(".md", "");
			return { id, name: mod.metadata?.title ?? titleCase(id) };
		})
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<div class="prose max-w-none prose-invert prose-blue">
	<h1>Welcome to EddieKit Documentation</h1>
	<p class="text-xl text-slate-400">
		Select a package from the sidebar to get started. EddieKit is a modular suite of SvelteKit
		utilities designed to speed up your development process.
	</p>

	<div class="mt-12 grid grid-cols-2 gap-6">
		{#each packages as pkg}
			<a
				href="/{pkg.id}"
				class="group rounded-xl border border-slate-800 p-6 transition-colors hover:bg-slate-900"
			>
				<h3 class="text-blue-400 group-hover:text-blue-300">{pkg.name}</h3>
			</a>
		{/each}
	</div>
</div>
