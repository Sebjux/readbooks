import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Test clicking a book card on index.html
        print("Testing index.html card click...")
        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_selector(".book-card")
        await page.click(".book-card:first-child")
        await page.wait_for_url("**/book.html?id=*")
        print("Navigated URL:", page.url)
        assert "book.html?id=" in page.url

        # Check book details page elements
        await page.wait_for_selector(".book-details-title")
        title = await page.text_content(".book-details-title")
        print("Book title on details page:", title.strip())

        # Take screenshot of book details page
        await page.screenshot(path="verification_book_details.png")
        print("Saved verification_book_details.png")

        # 2. Test clicking Start/Continue Reading
        print("Testing reader launch from book details page...")
        await page.click("#primaryActionBtn")
        await page.wait_for_selector("#readerView:not([hidden])")
        print("Reader opened successfully!")

        # 3. Test invalid ID
        print("Testing invalid book ID handling...")
        await page.goto("http://localhost:8000/book.html?id=invalid-id-xyz")
        await page.wait_for_selector(".error-box")
        error_text = await page.text_content(".error-box h2")
        print("Error header:", error_text.strip())
        assert "Book Not Found" in error_text

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
