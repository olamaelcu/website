import { COMMIT } from '$lib/commit';

export const load = () => {
	return { commit: COMMIT ?? process.env.COMMIT };
};
