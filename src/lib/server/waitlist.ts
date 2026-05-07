import { db } from './db/waitlist';
import { sql } from 'drizzle-orm';

export interface SeatCount {
	seatsTaken: number;
	maxSeats: number | null;
}

export async function getSeatCounts(): Promise<Record<string, SeatCount>> {
	try {
		const rows = await db.all<{
			feature: string;
			seats_taken: number;
			max_seats: number | null;
		}>(
			sql`SELECT feature, CAST(seats_taken AS INTEGER) AS seats_taken, max_seats FROM feature_seat_counts`
		);

		const counts: Record<string, SeatCount> = {};
		for (const row of rows) {
			counts[row.feature] = {
				seatsTaken: row.seats_taken,
				maxSeats: row.max_seats
			};
		}
		return counts;
	} catch {
		return {};
	}
}
