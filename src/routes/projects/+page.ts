import { STATUSES } from '$lib/statuses';

interface Project {
	name: string;
	status: string;
}

export const prerender = true;

export const load = async ({ fetch }) => {
	try {
		const response = await fetch('/api/projects');
		if (!response.ok) {
			throw new Error(`Failed to fetch projects: ${response.status}`);
		}
		const projects: Project[] = await response.json();
		return {
			projects
		};
	} catch {
		return {
			projects: [
				{ name: 'scratchback', status: STATUSES.INCUBATING },
				{ name: 'beats', status: STATUSES.INCUBATING },
				{ name: 'livtet', status: STATUSES.INCUBATING }
			]
		};
	}
};
