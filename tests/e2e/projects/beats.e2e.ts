import { test, expect } from '@playwright/test';

test.describe('Beats project page', () => {
	test('page loads without console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/projects/beats');

		// Wait for the page to be fully loaded
		await expect(page.locator('h1')).toContainText('Beats');

		// Filter out known non-critical errors (e.g., resource loading that doesn't affect functionality)
		const criticalErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('manifest'));
		expect(criticalErrors).toHaveLength(0);
	});

	test('project title and description render', async ({ page }) => {
		await page.goto('/projects/beats');

		// Expect title contains "Beats"
		await expect(page.locator('h1')).toContainText('Beats');

		// Expect description about music curation is visible
		await expect(page.getByText(/music curation/i)).toBeVisible();
		await expect(page.getByText(/exclusively for Blacksky/i)).toBeVisible();
	});

	test('status badge shows ALPHA', async ({ page }) => {
		await page.goto('/projects/beats');

		// Badge should show "Alpha" with blue styling (ALPHA status shows "Closed Alpha")
		const badge = page.locator('.project-status.alpha');
		await expect(badge).toBeVisible();
		await expect(badge).toContainText(/alpha/i);
	});

	test('seat count displays with mocked API', async ({ page }) => {
		// Mock /api/seat-counts returning { "beats": 10, ... }
		await page.route('/api/seat-counts', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					beats: { seatsTaken: 10, maxSeats: null }
				})
			});
		});

		await page.goto('/projects/beats');

		// Should show the mocked seat count
		await expect(page.getByText(/10 seats claimed/i)).toBeVisible();
	});

	test('contributor avatars section renders', async ({ page }) => {
		// Mock the Bluesky API for each contributor DID
		const mockProfiles = {
			'did:plc:w3vda6vzfsi6xa5acotbavzx': {
				did: 'did:plc:w3vda6vzfsi6xa5acotbavzx',
				handle: 'jeniusj.blacksky.app',
				displayName: 'Jenius J',
				avatar: 'https://example.com/jeniusj-avatar.png'
			},
			'did:plc:usheh7mu2uypezyl4disq2ql': {
				did: 'did:plc:usheh7mu2uypezyl4disq2ql',
				handle: 'chillarybanks.com',
				displayName: 'Chillary Banks',
				avatar: null
			},
			'did:plc:mqplt3ok3pc5h4y3ce3wz4o5': {
				did: 'did:plc:mqplt3ok3pc5h4y3ce3wz4o5',
				handle: 'tre.blacksky.app',
				displayName: 'Tre',
				avatar: 'https://example.com/tre-avatar.png'
			}
		};

		// Intercept all Bluesky API calls
		await page.route(/\/xrpc\/app\.bsky\.actor\.getProfile/, async (route) => {
			const url = new URL(route.request().url());
			const did = url.searchParams.get('actor');
			const profile = mockProfiles[did as keyof typeof mockProfiles];

			if (profile) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify(profile)
				});
			} else {
				await route.fulfill({
					status: 404,
					contentType: 'application/json',
					body: JSON.stringify({ error: 'Profile not found' })
				});
			}
		});

		await page.goto('/projects/beats');

		// Wait for the credit section to be visible
		await expect(page.getByText(/Credit/i)).toBeVisible();

		// Verify contributor links are present
		await expect(page.getByRole('link', { name: /@jeniusj/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /@chillarybanks/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /@tre/i })).toBeVisible();
	});

	test('navigation back to /projects works', async ({ page }) => {
		await page.goto('/projects/beats');

		// Click back link (the main projects page link)
		await page.click('a[href*="/projects"]:has-text("Projects"), a[href="/projects"]');

		// Should navigate to the projects listing page
		await expect(page).toHaveURL(/\/projects$/);
		await expect(page.locator('h1')).toContainText('Projects');
	});
});
