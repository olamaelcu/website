import { db } from './db/waitlist';
import { sql } from 'drizzle-orm';

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

const DEFAULT_PROJECTS: Record<string, ProjectData> = {
	beats: { seatsTaken: 0, maxSeats: null, status: STATUSES.ALPHA, isActive: true },
	livtet: { seatsTaken: 0, maxSeats: null, status: STATUSES.INCUBATING, isActive: true },
	scratchback: { seatsTaken: 0, maxSeats: null, status: STATUSES.INCUBATING, isActive: true }
};

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
				COALESCE(wi.max_seats, (
					SELECT CAST(COUNT(*) AS INTEGER) 
					FROM waitlist_entries we 
					WHERE we.feature = wi.id
				)) as seats_taken,
				wi.max_seats,
				wi.status,
				wi.is_active
			FROM waitlist_items wi
		`);

		const result: Record<string, ProjectData> = { ...DEFAULT_PROJECTS };

		for (const row of rows) {
			if (Object.hasOwn(DEFAULT_PROJECTS, row.id)) {
				result[row.id] = {
					seatsTaken: row.seats_taken ?? 0,
					maxSeats: row.max_seats ?? null,
					status: row.status ?? DEFAULT_PROJECTS[row.id]?.status ?? STATUSES.INCUBATING,
					isActive: Boolean(row.is_active)
				};
			}
		}

		return result;
	} catch (error) {
		console.error('[waitlist] Failed to fetch project data:', error);
		return { ...DEFAULT_PROJECTS };
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
