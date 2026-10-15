import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Testing book.html?id=scifi-10 ...")
        await page.goto("http://localhost:8000/book.html?id=scifi-10")
        await page.wait_for_selector(".book-details-title")
        title = await page.text_content(".book-details-title")
        print("Book title:", title.strip())

        await page.screenshot(path="scifi10_cover.png")
        print("Saved scifi10_cover.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
