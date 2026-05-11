import { test, expect } from '@playwright/test';

test.describe('Projects listing page', () => {
	test('page loads without console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/projects');

		// Wait for the page to be fully loaded
		await expect(page.locator('h1')).toContainText('Projects');

		// Filter out known non-critical errors (e.g., favicon, manifest)
		const criticalErrors = errors.filter(
			(e) => !e.includes('favicon') && !e.includes('manifest') && !e.includes('net::ERR')
		);
		expect(criticalErrors).toHaveLength(0);
	});

	test('displays all three projects', async ({ page }) => {
		await page.goto('/projects');

		// Expect all three projects to be visible
		await expect(page.getByRole('link', { name: /Scratchback/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /Beats/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /Livtet/i })).toBeVisible();
	});

	test('each project has correct status badge color', async ({ page }) => {
		await page.goto('/projects');

		// Get all project status badges
		const statusBadges = page.locator('.project-status');

		// There should be 3 status badges (one per project)
		await expect(statusBadges).toHaveCount(3);

		// Verify each project has the correct status class
		// The status badges are within anchor elements that contain the project names
		const scratchbackBadge = page.locator('.projects a:has-text("Scratchback") .project-status');
		await expect(scratchbackBadge).toHaveClass(/incubating/);
		await expect(scratchbackBadge).toContainText(/Incubating/i);

		const beatsBadge = page.locator('.projects a:has-text("Beats") .project-status');
		await expect(beatsBadge).toHaveClass(/alpha/);
		await expect(beatsBadge).toContainText(/Closed Alpha/i);

		const livtetBadge = page.locator('.projects a:has-text("Livtet") .project-status');
		await expect(livtetBadge).toHaveClass(/incubating/);
		await expect(livtetBadge).toContainText(/Incubating/i);
	});

	test('project cards link to correct detail pages', async ({ page }) => {
		await page.goto('/projects');

		// Check that each project card links to the correct detail page
		const scratchbackLink = page.locator('.projects a:has-text("Scratchback")');
		await expect(scratchbackLink).toHaveAttribute('href', /\/projects\/scratchback/);

		const beatsLink = page.locator('.projects a:has-text("Beats")');
		await expect(beatsLink).toHaveAttribute('href', /\/projects\/beats/);

		const livtetLink = page.locator('.projects a:has-text("Livtet")');
		await expect(livtetLink).toHaveAttribute('href', /\/projects\/livtet/);
	});

	test('seat count API responds correctly when mocked', async ({ page }) => {
		// Mock /api/seat-counts to return test data
		let apiCalled = false;
		await page.route('/api/seat-counts', async (route) => {
			apiCalled = true;
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					scratchback: { seatsTaken: 42, maxSeats: null },
					beats: { seatsTaken: 10, maxSeats: null },
					livtet: { seatsTaken: 0, maxSeats: null }
				})
			});
		});

		await page.goto('/projects');

		// Give the page time to potentially call the API
		await page.waitForTimeout(500);

		// The API should have been called (even if listing page doesn't display seat counts)
		expect(apiCalled).toBeTruthy();

		// The page should still load without errors even with mocked seat counts
		await expect(page.locator('h1')).toContainText('Projects');
	});
});
