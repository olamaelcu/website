<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	interface Props {
		title: string;
		description: string;
		canonical: string;
		openGraphType?: 'website' | 'article';
		twitterCard?: 'summary' | 'summary_large_image';
		ogImage?: string;
		twitterImage?: string;
	}

	let {
		title,
		description,
		canonical,
		openGraphType = 'website',
		twitterCard = 'summary',
		ogImage,
		twitterImage
	}: Props = $props();

	let ogImages = $derived(ogImage ? [{ url: ogImage, alt: 'OG Image' }] : []);
</script>

<MetaTags
	{title}
	{description}
	{canonical}
	openGraph={{
		type: openGraphType,
		title,
		description,
		url: canonical,
		images: ogImages
	}}
	twitter={{
		cardType: twitterCard,
		image: twitterImage,
		title,
		description
	}}
/>
