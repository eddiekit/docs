<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";

	let { children } = $props();

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

	let currentPackageId = $derived($page.params.package || "");
</script>

<div class="flex min-h-screen bg-slate-950 text-slate-200">
	<!-- Sidebar -->
	<aside
		class="sticky top-0 flex h-screen w-64 flex-col gap-8 overflow-y-auto border-r border-slate-800 p-6"
	>
		<a
			href="/"
			class="flex items-center gap-2 transition-opacity hover:opacity-80"
		>
			<div
				class="flex size-8 items-center justify-center rounded-lg bg-blue-600 font-bold"
			>
				E
			</div>
			<span class="text-xl font-bold tracking-tight">EddieKit Docs</span>
		</a>

		<nav class="flex flex-col gap-4">
			<div
				class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
			>
				Packages
			</div>
			<ul class="flex flex-col gap-2">
				{#each packages as pkg}
					<li>
						<a
							href="/{pkg.id}"
							class="block rounded-md px-3 py-2 transition-colors {currentPackageId ===
							pkg.id
								? 'bg-blue-600/10 font-medium text-blue-400'
								: 'text-slate-400 hover:bg-slate-900'}"
						>
							{pkg.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="max-w-4xl flex-1 overflow-y-auto p-12">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: "Inter", sans-serif;
	}

	:global(.prose) {
		--tw-prose-invert-body: #94a3b8;
		--tw-prose-invert-headings: #f8fafc;
		--tw-prose-invert-links: #60a5fa;
		--tw-prose-invert-code: #f1f5f9;
		--tw-prose-invert-pre-bg: #0f172a;
		--tw-prose-invert-pre-code: #f1f5f9;
	}
</style>
