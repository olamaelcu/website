export interface Project {
	name: string;
	status: string;
}

/**
 * Static project list. Previously served from `/api/projects`; now consumed
 * directly at build time and written to `static/data/projects.json` for the
 * client-side queries that still fetch it.
 */
export const projects: Project[] = [
	{
		name: 'scratchback',
		status: 'incubate'
	},
	{
		name: 'beats',
		status: 'alpha'
	},
	{
		name: 'livtet',
		status: 'incubate'
	}
];
