import { describe, it, expect } from 'vitest';

describe('GET /api/projects', () => {
	it('returns JSON with correct content-type', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();

		expect(response.headers.get('content-type')).toMatch(/application\/json/);
	});

	it('returns array of all three projects', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();
		const body = await response.json();

		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBe(3);
	});

	it('each project has required fields', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();
		const body = await response.json();

		for (const project of body) {
			expect(project).toHaveProperty('name');
			expect(project).toHaveProperty('status');
			expect(typeof project.name).toBe('string');
			expect(typeof project.status).toBe('string');
		}
	});

	it('scratchback project has correct structure', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();
		const body = await response.json();

		const scratchback = body.find((p: { name: string }) => p.name === 'scratchback');
		expect(scratchback).toBeDefined();
		expect(scratchback.status).toBe('incubate');
		expect(scratchback.name).toMatch(/scratchback/i);
	});

	it('beats project has correct structure', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();
		const body = await response.json();

		const beats = body.find((p: { name: string }) => p.name === 'beats');
		expect(beats).toBeDefined();
		expect(beats.status).toBe('alpha');
	});

	it('livtet project has correct structure', async () => {
		const { GET } = await import('../../../src/routes/api/projects/+server');
		const response = await GET();
		const body = await response.json();

		const livtet = body.find((p: { name: string }) => p.name === 'livtet');
		expect(livtet).toBeDefined();
		expect(livtet.status).toBe('incubate');
	});
});
