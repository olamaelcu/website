import { getSeatCounts } from '$lib/server/waitlist';
import { ensureDb } from '$lib/server/db/waitlist';

export const prerender = true;

export const load = async () => {
	await ensureDb();
	const seatCounts = await getSeatCounts();
	return { seatCounts };
};
