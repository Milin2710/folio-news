# Folio News 📰

Folio News is a full-stack news aggregation web application that lets users explore news articles from multiple sources.  
It combines a **Next.js frontend**, a **Python-based scraper**, and a **backend server** to fetch, process, and display news in a clean and responsive interface.

---

## 🔍 Project Overview

The project is divided into 3 main parts:

| Part | Description |
|------|-------------|
| **frontend/** | Next.js (React + TypeScript) application for the UI |
| **server/** | Backend service to expose APIs and handle data |
| **pythonscrapping/** | Python scripts to scrape news articles |

> _Each part can be run independently during development._

---

## 🚀 Features

✔ Fetches news articles using web scraping  
✔ Modern Next.js frontend with fast rendering  
✔ Backend API to serve scraped data  
✔ Scalable and easily extensible architecture  

---

## 🛠 Tech Stack

This project uses:

- **Next.js (React + TypeScript)** – Frontend  
- **Node.js / Express** – Backend server  
- **Python** – News scraping  
- **CSS** – Styling
- **Postgres** - Database

---

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Milin2710/folio-news.git
cd folio-news
```

2. Run the Server
```bash
cd server
npm install
npm start
```

3. Run the Frontend
```bash
cd frontend
npm install
npm start
```
Visit http://localhost:3000 in your browser.

5. Scrape News Data
From the root:

```bash
cd pythonscrapping
python3 scraper.py
```

💡 How It Works

Python scraper fetches news and stores them

Server reads data and exposes API endpoints

Frontend calls server API to show news list
