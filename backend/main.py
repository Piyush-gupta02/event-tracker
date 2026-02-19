from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_sheet_data():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "../credentials.json", scope
    )

    client = gspread.authorize(creds)

    sheet = client.open("Event Data").sheet1

    data = sheet.get_all_records()
    return data


@app.get("/events")
def get_events():
    return get_sheet_data()


@app.get("/stats")
def get_stats():
    data = get_sheet_data()

    total = len(data)
    upcoming = len([e for e in data if e["Status"] == "Upcoming"])
    expired = len([e for e in data if e["Status"] == "Expired"])

    return {
        "total_events": total,
        "upcoming": upcoming,
        "expired": expired
    }
