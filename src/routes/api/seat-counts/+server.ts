import { getSeatCounts } from '$lib/server/waitlist';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const seatCounts = await getSeatCounts();
	return json(seatCounts);
};
