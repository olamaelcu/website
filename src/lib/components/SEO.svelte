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
		siteName?: string;
		twitterSite?: string;
		twitterCreator?: string;
	}

	let {
		title,
		description,
		canonical,
		openGraphType = 'website',
		twitterCard = 'summary',
		ogImage,
		twitterImage,
		siteName = 'Olamaelcu',
		twitterSite = '@olamaelcu',
		twitterCreator = '@jacky'
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
		images: ogImages,
		siteName
	}}
	twitter={{
		cardType: twitterCard,
		image: twitterImage,
		title,
		description,
		site: twitterSite,
		creator: twitterCreator
	}}
/>
