<script lang="ts">
	let { domain, alt, size = 32 } = $props();
</script>

<img src="/favicons/{domain}.ico" alt={alt ?? domain} width={size} height={size} loading="lazy" />
