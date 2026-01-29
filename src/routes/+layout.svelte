<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";

	let { children } = $props();

	const templates = [
		{ id: "base", name: "Base Template", versions: ["v1.0.0"] },
	];

	const packages = [
		{ id: "session", name: "Session", versions: ["v1.1.0", "v1.0.0"] },
		{ id: "auth", name: "Auth", versions: ["v1.0.0"] },
		{ id: "captcha", name: "Captcha", versions: ["v1.0.0"] },
		{ id: "limiter", name: "Limiter", versions: ["v1.0.0"] },
		{ id: "mail", name: "Mail", versions: ["v1.0.0"] },
	];

	const allItems = [...templates, ...packages];

	// Simple menu structure (could be dynamic later)
	const menus: Record<string, { id: string; name: string }[]> = {
		session: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
			{ id: "upgrade", name: "Upgrade Guide" },
			{ id: "deprecated", name: "Deprecations" },
		],
		auth: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
		],
		captcha: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
		],
		limiter: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
		],
		mail: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
		],
		base: [
			{ id: "introduction", name: "Introduction" },
			{ id: "usage", name: "Usage" },
		],
	};

	let currentPackageId = $derived($page.params.package || "");
	let currentPackage = $derived(
		allItems.find((p) => p.id === currentPackageId),
	);
	let currentVersion = $derived(
		$page.params.version || currentPackage?.versions[0] || "",
	);
	let currentPath = $derived($page.params.path || "");
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
				Templates
			</div>
			<ul class="flex flex-col gap-2">
				{#each templates as pkg}
					<li>
						<a
							href="/{pkg.id}/{pkg.versions[0]}/introduction"
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
							href="/{pkg.id}/{pkg.versions[0]}/introduction"
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

		{#if currentPackageId && menus[currentPackageId]}
			<nav class="flex flex-col gap-4">
				<div
					class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
				>
					Navigation
				</div>
				<ul class="flex flex-col gap-2">
					{#each menus[currentPackageId] as item}
						<li>
							<a
								href="/{currentPackageId}/{currentVersion}/{item.id}"
								class="block rounded-md px-3 py-2 transition-colors {currentPath ===
								item.id
									? 'bg-slate-800 text-white'
									: 'text-slate-400 hover:bg-slate-900'}"
							>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}

		{#if currentPackage}
			<div class="mt-auto border-t border-slate-800 pt-6">
				<label
					for="version-switcher"
					class="mb-2 block text-xs font-semibold tracking-wider text-slate-500 uppercase"
				>
					Version
				</label>
				<select
					id="version-switcher"
					class="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
					value={currentVersion}
					onchange={(e) => {
						window.location.href = `/${currentPackageId}/${e.currentTarget.value}/${currentPath || "introduction"}`;
					}}
				>
					{#each currentPackage.versions as version}
						<option value={version}>{version}</option>
					{/each}
				</select>
			</div>
		{/if}
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
