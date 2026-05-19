<script lang="ts">
	let { domain, alt, size = 32 } = $props();
</script>

<img src="/api/favicon/{domain}" alt={alt ?? domain} width={size} height={size} loading="lazy" />
