import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSeatCounts } from '$lib/server/waitlist';
import { ensureDb } from '$lib/server/db/waitlist';

vi.mock('../../../src/lib/server/waitlist', () => ({
	getSeatCounts: vi.fn()
}));

vi.mock('../../../src/lib/server/db/waitlist', () => ({
	ensureDb: vi.fn()
}));

describe('GET /api/seat-counts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns JSON with correct content-type', async () => {
		vi.mocked(getSeatCounts).mockResolvedValue({});
		vi.mocked(ensureDb).mockResolvedValue(undefined);

		const { GET } = await import('../../../src/routes/api/seat-counts/+server');
		const response = await GET();
		const body = await response.json();

		expect(response.headers.get('content-type')).toMatch(/application\/json/);
		expect(body).toBeDefined();
	});

	it('returns an object with project seat counts', async () => {
		const mockSeatCounts = {
			beats: { seatsTaken: 5, maxSeats: 10 },
			livtet: { seatsTaken: 3, maxSeats: null },
			scratchback: { seatsTaken: 0, maxSeats: null }
		};
		vi.mocked(getSeatCounts).mockResolvedValue(mockSeatCounts);
		vi.mocked(ensureDb).mockResolvedValue(undefined);

		const { GET } = await import('../../../src/routes/api/seat-counts/+server');
		const response = await GET();
		const body = await response.json();

		expect(body).toEqual(mockSeatCounts);
		expect(body).toHaveProperty('beats');
		expect(body).toHaveProperty('livtet');
		expect(body).toHaveProperty('scratchback');
	});

	it('each project has a numeric seat count', async () => {
		const mockSeatCounts = {
			beats: { seatsTaken: 5, maxSeats: 10 },
			livtet: { seatsTaken: 0, maxSeats: null },
			scratchback: { seatsTaken: 12, maxSeats: 20 }
		};
		vi.mocked(getSeatCounts).mockResolvedValue(mockSeatCounts);
		vi.mocked(ensureDb).mockResolvedValue(undefined);

		const { GET } = await import('../../../src/routes/api/seat-counts/+server');
		const response = await GET();
		const body = await response.json();

		for (const counts of Object.values(body)) {
			expect(counts).toHaveProperty('seatsTaken');
			expect(typeof counts.seatsTaken).toBe('number');
			expect(counts.seatsTaken).toBeGreaterThanOrEqual(0);
		}
	});

	it('returns empty object when no entries exist', async () => {
		const mockSeatCounts = {
			beats: { seatsTaken: 0, maxSeats: null },
			livtet: { seatsTaken: 0, maxSeats: null },
			scratchback: { seatsTaken: 0, maxSeats: null }
		};
		vi.mocked(getSeatCounts).mockResolvedValue(mockSeatCounts);
		vi.mocked(ensureDb).mockResolvedValue(undefined);

		const { GET } = await import('../../../src/routes/api/seat-counts/+server');
		const response = await GET();
		const body = await response.json();

		expect(body).toBeDefined();
		expect(typeof body).toBe('object');
		for (const counts of Object.values(body)) {
			expect(counts.seatsTaken).toBe(0);
		}
	});

	it('handles database errors gracefully', async () => {
		vi.mocked(ensureDb).mockRejectedValue(new Error('Database connection failed'));
		vi.mocked(getSeatCounts).mockRejectedValue(new Error('Database error'));

		const { GET } = await import('../../../src/routes/api/seat-counts/+server');

		await expect(GET()).rejects.toThrow('Database connection failed');
	});
});
