import { getSeatCounts } from '$lib/server/waitlist';

export const load = async () => {
	const seatCounts = await getSeatCounts();
	return { seatCounts };
};
