import { getSeatCounts } from '$lib/server/waitlist';
import { ensureDb } from '$lib/server/db/waitlist';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	await ensureDb();
	const seatCounts = await getSeatCounts();
	return json(seatCounts);
};
