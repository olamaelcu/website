import { db, waitlistItems, waitlistEntries } from './db/waitlist';
import { eq, sql } from 'drizzle-orm';

export interface SeatCount {
	seatsTaken: number;
	maxSeats: number | null;
}

export async function getSeatCounts(): Promise<Record<string, SeatCount>> {
	try {
		const items = await db.select().from(waitlistItems).where(eq(waitlistItems.isActive, true));

		const counts: Record<string, SeatCount> = {};

		for (const item of items) {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(waitlistEntries)
				.where(eq(waitlistEntries.feature, item.id))
				.limit(1);

			counts[item.id] = {
				seatsTaken: result[0]?.count ?? 0,
				maxSeats: item.maxSeats ?? null
			};
		}

		return counts;
	} catch {
		return {};
	}
}
