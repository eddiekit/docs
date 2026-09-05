<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import { base } from "$app/paths";

	let { children } = $props();

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

	let currentPackageId = $derived($page.params.package || "");
	let sidebarOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		sidebarOpen = false;
	});
</script>

<div class="min-h-screen bg-slate-950 text-slate-200 md:flex">
	<!-- Mobile top bar -->
	<div class="flex items-center justify-between border-b border-slate-800 p-4 md:hidden">
		<a href="{base}/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
			<div class="flex size-8 items-center justify-center rounded-lg bg-blue-600 font-bold">E</div>
			<span class="text-xl font-bold tracking-tight">EddieKit Docs</span>
		</a>
		<button
			type="button"
			class="rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
			aria-label="Toggle navigation"
			aria-expanded={sidebarOpen}
			onclick={() => (sidebarOpen = !sidebarOpen)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				{#if sidebarOpen}
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				{:else}
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile backdrop -->
	{#if sidebarOpen}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/60 md:hidden"
			aria-label="Close navigation"
			onclick={() => (sidebarOpen = false)}
		></button>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col gap-8 overflow-y-auto border-r border-slate-800 bg-slate-950 p-6 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: ''}"
	>
		<a href="{base}/" class="hidden items-center gap-2 transition-opacity hover:opacity-80 md:flex">
			<div class="flex size-8 items-center justify-center rounded-lg bg-blue-600 font-bold">E</div>
			<span class="text-xl font-bold tracking-tight">EddieKit Docs</span>
		</a>

		<nav class="flex flex-col gap-4">
			<div class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Packages</div>
			<ul class="flex flex-col gap-2">
				{#each packages as pkg}
					<li>
						<a
							href="{base}/{pkg.id}"
							class="block rounded-md px-3 py-2 transition-colors {currentPackageId === pkg.id
								? 'bg-blue-600/10 font-medium text-blue-400'
								: 'text-slate-400 hover:bg-slate-900'}"
						>
							{pkg.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		{#if tools.length > 0}
			<nav class="flex flex-col gap-4">
				<div class="text-xs font-semibold tracking-wider text-slate-500 uppercase">CLI</div>
				<ul class="flex flex-col gap-2">
					{#each tools as tool}
						<li>
							<a
								href="{base}/{tool.id}"
								class="block rounded-md px-3 py-2 transition-colors {currentPackageId === tool.id
									? 'bg-blue-600/10 font-medium text-blue-400'
									: 'text-slate-400 hover:bg-slate-900'}"
							>
								{tool.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</aside>

	<!-- Main Content -->
	<main class="min-w-0 flex-1 overflow-y-auto p-6 md:max-w-4xl md:p-12">
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
