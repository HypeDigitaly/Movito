from playwright.sync_api import sync_playwright
import os

url = "file:///C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html"
out_dir = "C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots"
os.makedirs(out_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()

    # --- Mobile 390x844 hero area ---
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(url, wait_until='networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(out_dir, "hero_mobile_390.png"), full_page=False)
    print("Saved hero_mobile_390.png")
    page.close()

    # --- Desktop 1440x900 hero area ---
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto(url, wait_until='networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(out_dir, "hero_desktop_1440.png"), full_page=False)
    print("Saved hero_desktop_1440.png")
    page.close()

    # --- Mobile full-page to check scrollbar ---
    # Scrollbar is only visible on scrollable content, so capture full page
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(url, wait_until='networkidle')
    page.wait_for_timeout(1000)
    # Scroll down a bit to trigger scrollbar visibility
    page.evaluate("window.scrollBy(0, 200)")
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(out_dir, "mobile_scrollbar_390.png"), full_page=False)
    print("Saved mobile_scrollbar_390.png")
    page.close()

    browser.close()
    print("All screenshots captured.")
