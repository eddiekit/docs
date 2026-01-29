<script lang="ts">
	let { data } = $props();
</script>

<div
	class="prose max-w-none prose-invert prose-blue prose-headings:scroll-mt-20 prose-a:text-blue-400 hover:prose-a:text-blue-300"
>
	<data.content />
</div>
