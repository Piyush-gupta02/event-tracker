# Event Scraper & Analytics Platform

## 📌 Overview

This is a full-stack event analytics system that:

* Scrapes real event data from BookMyShow
* Deduplicates events
* Stores data locally (Excel)
* Syncs data to Google Sheets
* Displays analytics on a live dashboard

---

## 🏗 Architecture

### 1️⃣ Scraper (Python + Selenium)

* Opens BookMyShow events page
* Scrolls dynamically to load events
* Extracts:

  * Event Name
  * URL
  * City
  * Status
  * Timestamp

### 2️⃣ Data Layer

* Data stored in:

  * `events.xlsx`
  * Google Sheets (auto sync)
* Deduplication based on:

  * Event Name
  * Event URL

### 3️⃣ Backend (FastAPI)

Routes:

* `/` → Home route
* `/events` → Returns event list
* `/stats` → Returns analytics stats

### 4️⃣ Frontend (React + Vite)

* Event Analytics Dashboard
* Displays:

  * Total events
  * Upcoming events
  * Expired events
  * Event table with links

---

## 🔄 Deduplication Logic

```python
combined.drop_duplicates(subset=["Event Name", "URL"])
```

This prevents duplicate events across scraper runs.

---

## ☁ Google Sheets Sync

* Uses Service Account credentials
* Writes scraped events automatically
* Clears previous data before update

---

## ⏰ Scheduling / Cron

Scraper can be scheduled using:

* Cron job (Linux)
* Windows Task Scheduler
* Cloud Scheduler (future improvement)

---

## 🚀 Deployment

### Backend

* Hosted on Render
* FastAPI + Uvicorn

### Frontend

* Hosted on Vercel

---

## 🛠 Tech Stack

Frontend:

* React
* Vite
* Axios

Backend:

* FastAPI
* Pandas

Scraper:

* Selenium
* ChromeDriver

Storage:

* Google Sheets API
* Excel

---

## 🌐 Live Links

Frontend Dashboard:
(https://event-tracker-jeemhmpzk-piyushs-projects-454a960e.vercel.app)

Backend API:
(https://event-tracker-backend-6ab7.onrender.com)

Google Sheet:
(https://docs.google.com/spreadsheets/d/1hi68RvOlLdjd2J-P5mO6_rANJYEKvzrX5aSFkOWFtkQ/edit?usp=sharing)
