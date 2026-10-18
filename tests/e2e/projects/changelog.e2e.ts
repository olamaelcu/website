import { test, expect } from '@playwright/test';

const mockEntries = [
	{
		entry_date: '2026-05-12',
		category: 'added',
		description: 'Waitlist registration is now open',
		link_url: 'https://waitlist.example.com',
		link_label: 'Join the waitlist'
	},
	{
		entry_date: '2026-08-12',
		category: 'planned',
		description: 'Waitlist registration closing',
		link_url: 'https://waitlist.example.com',
		link_label: 'Join the waitlist'
	}
];

test('roadmap renders with mocked API', async ({ page }) => {
	await page.route(/\/data\/roadmap\/\w+\.json/, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockEntries)
		});
	});

	await page.goto('/projects/beats');

	await expect(page.locator('.timeline')).toBeVisible();
});

test('error state shows on API failure', async ({ page }) => {
	await page.route(/\/data\/roadmap\/\w+\.json/, async (route) => {
		await route.fulfill({
			status: 500,
			contentType: 'application/json',
			body: JSON.stringify({ error: 'Internal Server Error' })
		});
	});

	await page.goto('/projects/beats');

	await expect(page.getByText('Failed to load roadmap.')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});

test('retry button resets error and refetches', async ({ page }) => {
	let requestCount = 0;

	await page.route(/\/data\/roadmap\/\w+\.json/, async (route) => {
		requestCount++;
		if (requestCount === 1) {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ error: 'Internal Server Error' })
			});
		} else {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockEntries)
			});
		}
	});

	await page.goto('/projects/beats');

	await expect(page.getByText('Failed to load roadmap.')).toBeVisible();

	await page.getByRole('button', { name: 'Retry' }).click();

	await expect(page.locator('.timeline')).toBeVisible();
});
