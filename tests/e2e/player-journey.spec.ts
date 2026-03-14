import { expect, test, type Page } from '@playwright/test'

async function completeFirstRoute(page: Page) {
  await page.getByTestId('level-card-fallen-ferry').click()

  await expect(page.getByRole('heading', { name: /Fallen Ferry/i })).toBeVisible()

  await page.getByTestId('advance-route').click()
  await page.getByTestId('approach-bold').click()
  await page.getByTestId('advance-route').click()
  await page.getByTestId('answer-0').click()
  await page.getByTestId('advance-route').click()
  await page.getByTestId('choice-safe').click()
  await page.getByTestId('advance-route').click()
  await page.getByTestId('approach-careful').click()
  await page.getByTestId('complete-route').click()
}

test('starts instantly in demo mode with a live atlas', async ({ page }) => {
  await page.goto('/?demo=1')

  await expect(page.getByRole('heading', { name: /Echo Trail Camp/i })).toBeVisible()
  await expect(page.getByText(/Routes restored/i)).toBeVisible()
  await expect(page.getByTestId('level-card-brass-bridge-hollow')).toBeVisible()
  await expect(page.getByTestId('resume-run')).toHaveCount(0)
})

test('plays through the first route as a pseudo-2d expedition', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Sky of Many Lanterns: Echo Trail/i })).toBeVisible()
  await page.getByTestId('start-story').click()

  await expect(page.getByRole('heading', { name: /Echo Trail Camp/i })).toBeVisible()
  await completeFirstRoute(page)

  await expect(page.getByRole('heading', { name: /Echo Trail Camp/i })).toBeVisible()
  await expect(page.getByText(/1 \/ 20/i)).toBeVisible()
  await expect(page.getByText(/The first lantern answers Mira/i)).toBeVisible()
})

test('persists an in-progress route across reloads with no resume friction', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-story').click()
  await page.getByTestId('level-card-fallen-ferry').click()

  await page.getByTestId('advance-route').click()
  await page.getByTestId('approach-bold').click()

  await page.reload()

  await expect(page.getByRole('heading', { name: /Fallen Ferry/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Cargo Drift/i })).toBeVisible()

  await page.getByTestId('advance-route').click()
  await expect(page.getByTestId('shrine-panel')).toBeVisible()
})
