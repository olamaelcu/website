import { test, expect } from '@playwright/test';

test.describe('Livtet project page', () => {
	test('page loads without console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/projects/livtet');

		// Wait for the page to be fully loaded
		await expect(page.locator('h1')).toContainText('Livtet');

		// Filter out known non-critical errors (e.g., resource loading that doesn't affect functionality)
		const criticalErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('manifest'));
		expect(criticalErrors).toHaveLength(0);
	});

	test('project title and description render', async ({ page }) => {
		await page.goto('/projects/livtet');

		// Expect title contains "Livtet"
		await expect(page.locator('h1')).toContainText('Livtet');

		// Expect description about book management is visible
		await expect(page.getByText(/book management/i)).toBeVisible();
		await expect(page.getByText(/ATProto/i)).toBeVisible();
	});

	test('status badge shows INCUBATING', async ({ page }) => {
		await page.goto('/projects/livtet');

		// Badge should show "Incubating" (INCUBATING status shows "Incubating")
		const badge = page.locator('.project-status.incubating');
		await expect(badge).toBeVisible();
		await expect(badge).toContainText(/incubating/i);
	});

	test('seat count displays with mocked API', async ({ page }) => {
		// Mock /api/seat-counts returning { "livtet": 0, ... }
		await page.route('/api/seat-counts', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					livtet: { seatsTaken: 0, maxSeats: null }
				})
			});
		});

		await page.goto('/projects/livtet');

		// Should show the mocked seat count (0 seats claimed)
		await expect(page.getByText(/0 seats claimed/i)).toBeVisible();
	});

	test('navigation back to /projects works', async ({ page }) => {
		await page.goto('/projects/livtet');

		// Click back link (the main projects page link)
		await page.click('a[href*="/projects"]:has-text("Projects"), a[href="/projects"]');

		// Should navigate to the projects listing page
		await expect(page).toHaveURL(/\/projects$/);
		await expect(page.locator('h1')).toContainText('Projects');
	});
});
