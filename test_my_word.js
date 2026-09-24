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

server.listen(8105, async () => {
  console.log('My Word test server running on port 8105');
  const browser = await chromium.launch({ headless: true });

  const pages = ['index.html', 'discover.html'];

  for (const pageName of pages) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://localhost:8105/${pageName}`);
    await page.waitForSelector('.book-card');

    // Click My Word button
    await page.click('#navVocabBtn');
    await page.waitForTimeout(300);

    // Verify vocab drawer is open
    const isDrawerOpen = await page.$eval('#vocabDrawer', el => el.classList.contains('open'));
    console.log(`[${pageName}] My Vocabulary drawer open:`, isDrawerOpen);
    if (!isDrawerOpen) throw new Error(`Expected My Vocabulary drawer to open on ${pageName}`);

    // Verify reader view is still hidden (NO book opened)
    const isReaderHidden = await page.$eval('#readerView', el => el.hidden);
    console.log(`[${pageName}] Reader view hidden (no book opened):`, isReaderHidden);
    if (!isReaderHidden) throw new Error(`Reader view should NOT open when clicking My Word on ${pageName}`);

    // Close drawer
    await page.click('#drawerCloseBtn');
    await page.waitForTimeout(300);

    // Now explicitly click a book card and verify book opens
    await page.click('.book-card');
    await page.waitForSelector('.reader.entered');

    const isReaderEntered = await page.$eval('#readerView', el => el.classList.contains('entered'));
    console.log(`[${pageName}] Book opens on explicit card click:`, isReaderEntered);
    if (!isReaderEntered) throw new Error(`Expected book to open on card click on ${pageName}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('All My Word / My Vocabulary tests PASSED successfully!');
});
