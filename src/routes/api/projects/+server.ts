import { json } from '@sveltejs/kit';

interface Project {
	name: string;
	status: string;
}

const projects: Project[] = [
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

export const GET = async () => {
	return json(projects);
};
