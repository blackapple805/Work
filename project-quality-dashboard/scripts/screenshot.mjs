// scripts/screenshot.mjs
//
// Captures the README screenshots from a running instance of the dashboard,
// so the images always reflect your real repos and the current design.
//
// One-time setup (Playwright is not a dependency of the app itself, to keep
// the install lean):
//
//   npm install -D playwright
//   npx playwright install chromium
//
// Then, with the app running in another terminal (`npm run dev`):
//
//   npm run screenshot
//
// Override the target URL if you serve it elsewhere:
//
//   APP_URL=http://localhost:4173 npm run screenshot
//
// Output: docs/dashboard.png and docs/health-breakdown.png

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = process.env.APP_URL || 'http://localhost:3000'

await mkdir('docs', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1180, height: 1400 },
  deviceScaleFactor: 2,
})

console.log(`Loading ${URL} …`)
await page.goto(URL, { waitUntil: 'networkidle' })

// Wait for real repo rows (not the loading skeletons) before shooting.
try {
  await page.waitForSelector('.row:not(.skeleton)', { timeout: 15000 })
} catch {
  console.error(
    'No repos rendered. Is the app running, and did the repos load?'
  )
  await browser.close()
  process.exit(1)
}
await page.waitForTimeout(600)

// 1) Overview — the whole dashboard.
await page.screenshot({ path: 'docs/dashboard.png', fullPage: true })
console.log('Wrote docs/dashboard.png')

// 2) Health breakdown — expand the first repo to show how the score is built.
await page.locator('.row-main').first().click()
await page.waitForTimeout(500)
await page.screenshot({ path: 'docs/health-breakdown.png', fullPage: true })
console.log('Wrote docs/health-breakdown.png')

await browser.close()
console.log('Done. Commit the docs/ images and the README will show them.')
