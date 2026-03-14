import { expect, test, type Page } from '@playwright/test'

async function completeCurrentTask(page: Page) {
  await page.getByTestId('choice-0').click()

  const continueExpedition = page.getByTestId('continue-expedition')
  if (await continueExpedition.isVisible().catch(() => false)) {
    await continueExpedition.click()
    return
  }

  const continueWithSupport = page.getByTestId('continue-with-support')
  if (await continueWithSupport.isVisible().catch(() => false)) {
    await continueWithSupport.click()
    return
  }

  await page.getByTestId('show-final-explanation').click()
  await page.getByTestId('continue-with-support').click()
}

async function completeRun(page: Page, expectedTaskCount: number) {
  for (let index = 0; index < expectedTaskCount; index += 1) {
    await completeCurrentTask(page)
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
})

test('supports a full household journey from onboarding through QA review', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Warm daily logic practice/i })).toBeVisible()
  await page.getByTestId('start-household-setup').click()

  await page.getByTestId('parent-name-input').fill('Nadia')
  await page.getByTestId('parent-email-input').fill('nadia@example.com')
  await page.getByTestId('child-name-input').fill('Mika')
  await page.getByTestId('child-age-input').fill('9')
  await page.getByTestId('family-goal-select').selectOption('Confidence with tricky reasoning')
  await page.getByTestId('create-household').click()

  await expect(
    page.getByRole('heading', { name: /The lantern network needs a calm first reading/i }),
  ).toBeVisible()
  await page.getByTestId('start-diagnostic').click()

  await completeRun(page, 10)

  await expect(page.getByTestId('session-result')).toContainText('Diagnostic complete')
  await expect(page.getByText(/Mika now has a starting route/i)).toBeVisible()

  await page.getByTestId('start-expedition').click()
  await completeRun(page, 6)

  await expect(page.getByTestId('session-result')).toContainText('Session score')
  await expect(page.getByText(/routes restored/i)).toBeVisible()

  await page.getByTestId('nav-parent').click()
  await expect(page.getByRole('heading', { name: /Concrete progress for Nadia/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Recent expedition evidence/i })).toBeVisible()

  await page.getByTestId('nav-qa').click()
  await expect(page.getByRole('heading', { name: /Recent production-style events/i })).toBeVisible()
  await expect(page.getByText(/session_completed/i).first()).toBeVisible()
})

test('lets QA flag output and clears state on reset', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('start-household-setup').click()
  await page.getByTestId('parent-name-input').fill('Ari')
  await page.getByTestId('parent-email-input').fill('ari@example.com')
  await page.getByTestId('child-name-input').fill('Sol')
  await page.getByTestId('create-household').click()
  await page.getByTestId('start-diagnostic').click()

  await page.getByTestId('flag-reason-input').fill('Needs source review wording')
  await page.getByTestId('flag-output').click()
  await completeCurrentTask(page)
  await completeRun(page, 9)

  await page.getByTestId('nav-qa').click()
  await expect(page.getByText(/Needs source review wording/i)).toBeVisible()

  await page.getByTestId('reset-household-state').click()
  await expect(page.getByRole('heading', { name: /Warm daily logic practice/i })).toBeVisible()
})
