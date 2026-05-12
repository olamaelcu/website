import { json } from '@sveltejs/kit';
import { getRoadmapEntries } from '$lib/server/db/roadmap';

export const GET = async ({ params }) => {
	const entries = await getRoadmapEntries(params.projectKey);
	return json(entries);
};
