import { projects } from '$lib/projects';

export const prerender = true;

export const load = async () => {
	return {
		projects
	};
};
