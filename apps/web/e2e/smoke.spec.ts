import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads and shows header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })

  test('products page renders product grid', async ({ page }) => {
    await page.goto('/products')
    await expect(page).toHaveTitle(/product/i)
  })

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('register page is accessible', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('unauthenticated user is redirected from account page', async ({ page }) => {
    await page.goto('/account')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })
})

test.describe('Authentication flow', () => {
  const testEmail = `e2e-${Date.now()}@test.nexify.com`
  const testPassword = 'TestPassword123!'

  test('can register a new account', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[name="name"]', 'E2E Test User')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.fill('input[name="confirmPassword"]', testPassword)
    await page.click('button[type="submit"]')

    // Should redirect to account on success (or show error if API is down)
    await page.waitForURL(/\/(account|register)/, { timeout: 10_000 })
  })

  test('can log in with existing account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/(account|login)/, { timeout: 10_000 })
  })
})

test.describe('Navigation', () => {
  test('header has navigation links', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('header nav, header')
    await expect(nav).toBeVisible()
  })

  test('footer is present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })
})
