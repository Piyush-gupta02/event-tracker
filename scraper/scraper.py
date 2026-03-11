import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


CITY = "Jaipur"
URL = "https://in.bookmyshow.com/explore/events-jaipur"

HEADERS = [
    "Event Name",
    "City",
    "Venue",
    "Date",
    "URL",
    "Status",
    "Last Updated"
]


# =====================
# FETCH EVENTS
# =====================
def fetch_events():

    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")

    # reduce bot detection
    options.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    driver.get(URL)

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.presence_of_all_elements_located(
            (By.XPATH, "//a[contains(@href,'/events/')]")
        )
    )

    print("Page loaded")

    # SCROLL PAGE
    last_height = driver.execute_script(
        "return document.body.scrollHeight"
    )

    while True:

        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);"
        )

        time.sleep(2)

        new_height = driver.execute_script(
            "return document.body.scrollHeight"
        )

        if new_height == last_height:
            break

        last_height = new_height

    print("Scrolling finished")

    links = driver.find_elements(By.XPATH, "//a[contains(@href,'/events/')]")

    events = []
    unique_urls = set()

    for link in links:

        try:

            href = link.get_attribute("href")

            if not href:
                continue

            if "/explore/events" in href:
                continue

            if href in unique_urls:
                continue

            unique_urls.add(href)

            text = link.text.strip()

            if not text:
                text = href.split("/")[-1].replace("-", " ").title()

            events.append({
                "Event Name": text,
                "City": CITY,
                "Venue": "",
                "Date": "",
                "URL": href,
                "Status": "Upcoming",
                "Last Updated": datetime.now().strftime("%Y-%m-%d %H:%M")
            })

        except:
            continue

    driver.quit()

    return events


# =====================
# UPDATE GOOGLE SHEET
# =====================
def update_google_sheet(events):

    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json",
        scope
    )

    client = gspread.authorize(creds)

    sheet = client.open("Event Data").sheet1

    try:
        existing_records = sheet.get_all_records(expected_headers=HEADERS)
    except:
        sheet.clear()
        sheet.append_row(HEADERS)
        existing_records = []

    existing_url_row = {
        row["URL"]: index + 2
        for index, row in enumerate(existing_records)
    }

    existing_urls = set(existing_url_row.keys())

    rows_to_add = []
    updated_count = 0

    for event in events:

        if event["URL"] not in existing_urls:

            rows_to_add.append([
                event["Event Name"],
                event["City"],
                event["Venue"],
                event["Date"],
                event["URL"],
                event["Status"],
                event["Last Updated"]
            ])

        else:

            row_number = existing_url_row[event["URL"]]

            sheet.update_cell(row_number, 7, event["Last Updated"])

            updated_count += 1

    if rows_to_add:
        sheet.append_rows(rows_to_add)

    print("New events added:", len(rows_to_add))
    print("Events refreshed:", updated_count)


# =====================
# MAIN
# =====================
if __name__ == "__main__":

    print("Fetching events...")

    events = fetch_events()

    print("Events found:", len(events))

    update_google_sheet(events)

    print("Google Sheet updated successfully!")