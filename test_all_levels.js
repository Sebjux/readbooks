const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(8101, async () => {
  console.log('All levels test server running on port 8101');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  page.on('request', req => requests.push(req.url()));

  await page.goto('http://localhost:8101/index.html');
  await page.waitForSelector('.book-card');

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const lvl of levels) {
    await page.click(`#levelPills [data-level="${lvl}"]`);
    await page.waitForTimeout(200);

    const cardsCount = await page.$$eval('#levelGrid .book-card', cards => cards.length);
    console.log(`Level ${lvl} cards count on index.html:`, cardsCount);
    if (cardsCount === 0) throw new Error(`Expected cards for level ${lvl}`);

    const levelChipText = await page.textContent('#levelGrid .book-card .level-chip');
    console.log(`First card level chip for filter ${lvl}:`, levelChipText.trim());
    if (!levelChipText.includes(lvl)) {
      throw new Error(`Expected card level chip to display ${lvl}`);
    }
  }

  // Open C2 book and verify C2 content file downloaded
  await page.click('#levelPills [data-level="C2"]');
  await page.waitForTimeout(200);
  await page.click('#levelGrid .book-card');
  await page.waitForSelector('.reader.entered');

  const subText = await page.textContent('#readerSub');
  console.log('Reader subtitle for C2 book:', subText);
  if (!subText.includes('C2')) throw new Error('Expected C2 in reader subtitle');

  const c2ContentReq = requests.filter(r => r.includes('-c2.json'));
  console.log('Downloaded C2 content JSONs count:', c2ContentReq.length);
  if (c2ContentReq.length === 0) throw new Error('Expected -c2.json to be downloaded');

  await browser.close();
  server.close();
  console.log('All 6 CEFR level verification tests PASSED successfully!');
});
