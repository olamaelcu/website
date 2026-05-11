import { db } from './db/waitlist';
import { sql } from 'drizzle-orm';
import * as Sentry from '@sentry/sveltekit';

export enum STATUSES {
	INCUBATING = 'incubate',
	ALPHA = 'alpha',
	BETA = 'beta',
	RELEASE = 'rc'
}

export interface SeatCount {
	seatsTaken: number;
	maxSeats: number | null;
}

export interface ProjectData extends SeatCount {
	status: string;
	isActive: boolean;
}

export async function getProjectData(): Promise<Record<string, ProjectData>> {
	try {
		const rows = await db.all<{
			id: string;
			seats_taken: number;
			max_seats: number | null;
			status: string;
			is_active: number;
		}>(sql`
			SELECT 
				wi.id,
				COALESCE(
					(SELECT CAST(COUNT(*) AS INTEGER) 
					 FROM waitlist_entries we 
					 WHERE we.feature = wi.id),
					0
				) as seats_taken,
				wi.max_seats,
				wi.status,
				wi.is_active
			FROM waitlist_items wi
		`);

		const result: Record<string, ProjectData> = {};

		for (const row of rows) {
			result[row.id] = {
				seatsTaken: row.seats_taken ?? 0,
				maxSeats: row.max_seats ?? null,
				status: row.status ?? STATUSES.INCUBATING,
				isActive: Boolean(row.is_active)
			};
		}

		return result;
	} catch (error) {
		console.error('[waitlist] Failed to fetch project data:', error);
		Sentry.captureMessage('[waitlist] Failed to fetch project data, returning empty', 'warning');
		return {};
	}
}

export async function getSeatCounts(): Promise<Record<string, SeatCount>> {
	const projectData = await getProjectData();
	const result: Record<string, SeatCount> = {};
	for (const [key, data] of Object.entries(projectData)) {
		result[key] = { seatsTaken: data.seatsTaken, maxSeats: data.maxSeats };
	}
	return result;
}
