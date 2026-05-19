<script lang="ts">
	let { domain, alt, size = 32 } = $props();
</script>

<img
	src="https://icons.duckduckgo.com/ip3/{domain}.ico"
	alt={alt ?? domain}
	width={size}
	height={size}
	loading="lazy"
/>
