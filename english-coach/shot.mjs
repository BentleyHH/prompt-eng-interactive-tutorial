import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import path from 'path';

const file = 'file://' + path.resolve('preview.html');
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});
const page = await ctx.newPage();
await page.goto(file);
await page.waitForTimeout(500);

// 1) Themen-Auswahl
await page.screenshot({ path: 'shots/1-topics.png' });

// 2) Gespräch mit Orb + erster Coach-Nachricht
await page.locator('.topic-card').first().click();
await page.waitForTimeout(1100);
// Eine Nutzer-Runde simulieren, damit Bubbles/Vokabeln/Feedback sichtbar sind
await page.fill('#msg-input', 'I had a really hectic week, lots of meetings.');
await page.click('#send-btn');
await page.waitForTimeout(1200);
// Orb in den "speaking"-Zustand zwingen (kein echtes TTS im Headless)
await page.evaluate(() => {
  document.getElementById('orb').classList.add('speaking');
  document.getElementById('orb-status').textContent = 'Coach spricht …';
});
await page.evaluate(() => { document.querySelector('.content').scrollTop = 0; });
await page.waitForTimeout(300);
await page.screenshot({ path: 'shots/2-conversation.png' });

// 3) Vokabel-Wiederholung
await page.click('.tab[data-view="vocab"]');
await page.waitForTimeout(400);
await page.click('#reveal');
await page.waitForTimeout(300);
await page.screenshot({ path: 'shots/3-vocab.png' });

// 4) Lernplan
await page.click('.tab[data-view="plan"]');
await page.waitForTimeout(400);
await page.click('#make-plan');
await page.waitForTimeout(1400);
await page.screenshot({ path: 'shots/4-plan.png' });

// 5) Fortschritt
await page.click('.tab[data-view="progress"]');
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/5-progress.png' });

await browser.close();
console.log('done');
