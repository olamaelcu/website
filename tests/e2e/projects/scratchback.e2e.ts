import { test, expect } from '@playwright/test';

test.describe('Scratchback project page', () => {
	test('page loads without console errors', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/projects/scratchback');
		await page.waitForLoadState('networkidle');

		expect(consoleErrors).toHaveLength(0);
	});

	test('project title and description render', async ({ page }) => {
		await page.goto('/projects/scratchback');

		await expect(page.locator('h1')).toContainText('Scratchback');
		await expect(page.locator('text=ATProto')).toBeVisible();
	});

	test('status badge shows INCUBATING', async ({ page }) => {
		await page.goto('/projects/scratchback');

		const statusBadge = page.locator('.project-status');
		await expect(statusBadge).toContainText('Incubating');
		await expect(statusBadge).toHaveClass(/incubating/i);
	});

	test('seat count displays with mocked API', async ({ page }) => {
		await page.route('/data/seat-counts.json', async (route) => {
			await route.fulfill({
				json: {
					scratchback: { seatsTaken: 42, maxSeats: null }
				}
			});
		});

		await page.goto('/projects/scratchback');

		await expect(page.locator('.seat-count')).toContainText('42 seats claimed');
	});

	test('navigation back to /projects works', async ({ page }) => {
		await page.goto('/projects/scratchback');

		const backLink = page.locator('a[href="/projects"]').first();
		await expect(backLink).toBeVisible();

		await backLink.click();
		await expect(page).toHaveURL(/\/projects$/);
		await expect(page.locator('h1')).toContainText('Projects');
	});
});
