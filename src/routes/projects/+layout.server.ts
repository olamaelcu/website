import { getSeatCounts } from '$lib/server/waitlist';
import { ensureDb } from '$lib/server/db/waitlist';

export const prerender = true;

export const load = async () => {
	// Runs at build time for the static export. If the waitlist database is
	// unreachable or unconfigured (e.g. secrets absent in CI), degrade to empty
	// seat counts rather than failing the whole build.
	try {
		await ensureDb();
		const seatCounts = await getSeatCounts();
		return { seatCounts };
	} catch (err) {
		console.warn('[projects] Failed to load seat counts:', err);
		return { seatCounts: {} };
	}
};
