<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';
</script>

<SEO
	title="Support | Olamaelcu"
	description="Ways to fiscally support Olamaelcu's projects"
	canonical={`${SITE_URL}/about`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<h1 style="font-size: 275%">Support</h1>
<p style="font-size: 150%;">
	You can donate to our <a href="https://liberapay.com/Olamaelcu/">LiberaPay</a> page (requires an
	account), paying for a coffee on <a href="https://ko-fi.com/jackyalcine">Ko-Fi</a> or send tips to
	Jacky's <a href="https://www.paypal.com/paypalme/jalcine">Paypal</a>. Anything helps! The goal is
	to raise $0/2,000 of monthly support.
</p>
<p>You can also support Jacky directly via <a href="https://github.com/sponsors/jalcine">GitHub's sponsorship program</a>.</p>
<p>
	<progress value="0"></progress>
</p>
