from playwright.sync_api import sync_playwright

# with sync_playwright() as p:
#     browser = p.chromium.launch(
#         headless=True,
#         args=["--disable-blink-features=AutomationControlled"]
#     )

#     context = browser.new_context(
#         user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
#                    "AppleWebKit/537.36 (KHTML, like Gecko) "
#                    "Chrome/120.0.0.0 Safari/537.36"
#     )

#     page = context.new_page()

#     page.goto("https://www.nepalstock.com/", wait_until="domcontentloaded")

#     print(page.title())

#     status = page.locator("span.index__market--status", has_text="Market Open")
#     print(status.inner_text())

#     # status = page.locator("span.index__market--open--live")
#     # print(status.inner_text())

#     browser.close()

class NepseScraper:
    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None

    def start(self):
        self.browser = sync_playwright().start().chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        self.context = self.browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/120.0.0.0 Safari/537.36")
        
    def stop(self):
        if self.browser:
            self.browser.close()
    
    def check_market_status(self):
        self.page = self.context.new_page()
        self.page.goto("https://www.nepalstock.com/", wait_until="domcontentloaded")
        status = self.page.locator("span.index__market--status", has_text="Market Open")
        if status:
            return {"status": "open"}
        return {"status": "closed"}
    
    def get_live_data(self):
        self.page = self.context.new_page()
        self.page.goto("https://www.nepalstock.com/live-market", wait_until="domcontentloaded")
        
        table = self.page.locator("app-live-market table")
        print(table.inner_html())
        rows = table.locator("tbody tr")
        row_count = rows.count()
        print("Row count:", row_count)

        data = []

        for i in range(row_count):
            row = rows.nth(i)
            columns = row.locator("td")
            column_count = columns.count()
            print(f"Row {i} has {column_count} columns")
            for j in range(column_count):
                cell_text = columns.nth(j).inner_text()
                data.append(cell_text)
                print(f"Row {i}, Column {j}: {cell_text}")

        return data

if __name__ == "__main__":
    scraper = NepseScraper()
    scraper.start()
    market_status = scraper.check_market_status()
    print(market_status)
    live_data = scraper.get_live_data()
    print(live_data)
    scraper.stop()
