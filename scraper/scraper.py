import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


CITY = "Jaipur"
URL = "https://in.bookmyshow.com/explore/events-jaipur"


def fetch_events():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    driver.get(URL)
    time.sleep(5)

    # Scroll page
    for _ in range(5):
        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);"
        )
        time.sleep(2)

    events = []

    links = driver.find_elements(By.TAG_NAME, "a")

    for link in links:
        href = link.get_attribute("href")
        text = link.text

        if href and "/events/" in href and text:
            events.append({
                "Event Name": text.strip(),
                "City": CITY,
                "Venue": "",
                "Date": "",
                "URL": href,
                "Status": "Upcoming",
                "Last Updated": datetime.now().strftime("%Y-%m-%d %H:%M")
            })

    driver.quit()

    # Deduplicate by URL
    unique_events = {e["URL"]: e for e in events}
    return list(unique_events.values())


def update_google_sheet(events):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )

    client = gspread.authorize(creds)

    sheet = client.open("Event Data").sheet1

    sheet.clear()

    header = [
        "Event Name",
        "City",
        "Venue",
        "Date",
        "URL",
        "Status",
        "Last Updated"
    ]

    sheet.append_row(header)

    for event in events:
        sheet.append_row([
            event["Event Name"],
            event["City"],
            event["Venue"],
            event["Date"],
            event["URL"],
            event["Status"],
            event["Last Updated"]
        ])


if __name__ == "__main__":
    print("Fetching events...")
    events = fetch_events()

    print("Events found:", len(events))

    update_google_sheet(events)

    print("Google Sheet updated successfully!")
