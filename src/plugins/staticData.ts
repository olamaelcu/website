import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type Plugin, loadEnv } from 'vite';
import { createClient } from '@libsql/client';

/**
 * Resolved environment for the build. In CI the database secrets arrive as
 * real process env vars; locally they live in `.env`, which Vite exposes to
 * SvelteKit's `$env` but not to `process.env`. We merge both so the data
 * freeze behaves the same in dev, local builds, and CI.
 */
let resolvedEnv: Record<string, string | undefined> = process.env;

/**
 * Build-time data freeze for the static (GitHub Pages) build.
 *
 * There is no server at runtime, so the data that used to come from the
 * `/api/*` endpoints is queried from the database once, at build time, and
 * written as plain JSON into `static/data/`. Favicons that used to be proxied
 * through `/api/favicon/[domain]` are fetched and cached into `static/favicons/`.
 *
 * Client code fetches these static files instead of the old endpoints. The
 * data is therefore a snapshot as of the last build/deploy.
 */

const DUCKDUCKGO_ICON_URL = 'https://icons.duckduckgo.com/ip3';

interface SeatCount {
	seatsTaken: number;
	maxSeats: number | null;
}

async function dumpSeatCounts(dataDir: string): Promise<void> {
	const url = resolvedEnv.WAITLIST_DATABASE_URL;
	const authToken = resolvedEnv.WAITLIST_DATABASE_AUTH_TOKEN || undefined;

	let seatCounts: Record<string, SeatCount> = {};

	if (url) {
		try {
			const client = createClient({ url, authToken });
			const result = await client.execute(`
				SELECT
					wi.id,
					COALESCE(
						(SELECT CAST(COUNT(*) AS INTEGER)
						 FROM waitlist_entries we
						 WHERE we.feature = wi.id),
						0
					) AS seats_taken,
					wi.max_seats
				FROM waitlist_items wi
			`);
			for (const row of result.rows) {
				const id = row.id as string;
				seatCounts[id] = {
					seatsTaken: Number(row.seats_taken ?? 0),
					maxSeats: row.max_seats === null ? null : Number(row.max_seats)
				};
			}
		} catch (err) {
			console.warn('[staticData] seat-counts dump failed, writing empty:', err);
			seatCounts = {};
		}
	} else {
		console.warn('[staticData] WAITLIST_DATABASE_URL not set — writing empty seat-counts.json');
	}

	writeFileSync(join(dataDir, 'seat-counts.json'), JSON.stringify(seatCounts));
	console.log(`[staticData] Wrote seat-counts.json (${Object.keys(seatCounts).length} projects)`);
}

async function dumpRoadmaps(dataDir: string): Promise<string[]> {
	const url = resolvedEnv.DATABASE_URL;
	const authToken = resolvedEnv.DATABASE_AUTH_TOKEN || undefined;
	const roadmapDir = join(dataDir, 'roadmap');
	mkdirSync(roadmapDir, { recursive: true });

	const domains: string[] = [];

	if (!url) {
		console.warn('[staticData] DATABASE_URL not set — skipping roadmap/favicon dump');
		return domains;
	}

	try {
		const client = createClient({ url, authToken });

		// Roadmap entries grouped per project key.
		const keysResult = await client.execute(`SELECT DISTINCT project_key FROM roadmap_entries`);
		for (const keyRow of keysResult.rows) {
			const projectKey = keyRow.project_key as string;
			const entriesResult = await client.execute({
				sql: `SELECT entry_date, category, description, link_url, link_label
				      FROM roadmap_entries WHERE project_key = ? ORDER BY entry_date ASC`,
				args: [projectKey]
			});
			const entries = entriesResult.rows.map((row) => ({
				entry_date: row.entry_date,
				category: row.category,
				description: row.description,
				link_url: row.link_url ?? undefined,
				link_label: row.link_label ?? undefined
			}));
			writeFileSync(join(roadmapDir, `${projectKey}.json`), JSON.stringify(entries));
			console.log(`[staticData] Wrote roadmap/${projectKey}.json (${entries.length} entries)`);
		}

		// Collect stack domains for favicon prebaking.
		const stackResult = await client.execute(`SELECT DISTINCT domain FROM stack_entries`);
		for (const row of stackResult.rows) {
			if (row.domain) domains.push(row.domain as string);
		}
	} catch (err) {
		console.warn('[staticData] roadmap/stack dump failed:', err);
	}

	return domains;
}

// Transparent 1x1 PNG fallback (matches the old endpoint's behaviour).
const FALLBACK_PNG = Buffer.from([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
	0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
	0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
	0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
	0x42, 0x60, 0x82
]);

async function prebakeFavicons(root: string, domains: string[]): Promise<void> {
	const faviconDir = join(root, 'static', 'favicons');
	mkdirSync(faviconDir, { recursive: true });

	for (const domain of domains) {
		if (domain.includes('..') || domain.includes('/')) continue;
		const out = join(faviconDir, `${domain}.ico`);
		try {
			const response = await fetch(`${DUCKDUCKGO_ICON_URL}/${domain}.ico`);
			if (response.ok) {
				const data = Buffer.from(await response.arrayBuffer());
				writeFileSync(out, data);
			} else {
				writeFileSync(out, FALLBACK_PNG);
			}
		} catch {
			writeFileSync(out, FALLBACK_PNG);
		}
	}
	console.log(`[staticData] Prebaked ${domains.length} favicons`);
}

async function run(root: string): Promise<void> {
	const dataDir = join(root, 'static', 'data');
	// Start clean so stale snapshots don't linger between builds.
	rmSync(dataDir, { recursive: true, force: true });
	mkdirSync(dataDir, { recursive: true });

	// Static project list (previously /api/projects).
	const { projects } = await import('../lib/projects.ts');
	writeFileSync(join(dataDir, 'projects.json'), JSON.stringify(projects));

	await dumpSeatCounts(dataDir);
	const domains = await dumpRoadmaps(dataDir);
	await prebakeFavicons(root, domains);
}

export function staticDataPlugin(): Plugin {
	const pluginRoot = dirname(fileURLToPath(import.meta.url));
	const root = join(pluginRoot, '..', '..');
	return {
		name: 'vite-plugin-static-data',
		configResolved(config) {
			// Merge `.env` files (loaded by Vite) over the process env so local
			// builds and `vite dev` see the database credentials, matching CI
			// where they arrive as real env vars. Empty string wins over nothing
			// so an explicitly-blank var still disables a source.
			const fileEnv = loadEnv(config.mode, config.envDir || root, '');
			resolvedEnv = { ...fileEnv, ...process.env };
		},
		async buildStart() {
			await run(root);
		},
		async configureServer() {
			// Generate snapshots for `vite dev` too, so the dev server can serve them.
			await run(root);
		}
	};
}
