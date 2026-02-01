from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI(
    title="BBC Article Scraper API",
    description="Extracts text and image links from a BBC News article",
    version="1.0.0",
)

# 🔥 ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HEADERS = {"User-Agent": "Mozilla/5.0"}


def scrape_bbc_article(article_url: str) -> dict:
    try:
        response = requests.get(article_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except requests.RequestException:
        raise HTTPException(status_code=400, detail="Failed to fetch the article URL")

    soup = BeautifulSoup(response.text, "lxml")

    data = {
        "url": article_url,
        "title": None,
        "published_time": None,
        "content": "",
        "images": [],
    }

    # Title
    title_tag = soup.find("h1")
    if title_tag:
        data["title"] = title_tag.get_text(strip=True)

    # Publish time
    time_tag = soup.find("time")
    if time_tag and time_tag.has_attr("datetime"):
        data["published_time"] = time_tag["datetime"]

    # Article content
    paragraphs = soup.select("article p")
    if not paragraphs:
        paragraphs = soup.find_all("p")

    data["content"] = "\n".join(p.get_text(strip=True) for p in paragraphs)

    # Image links
    for img in soup.select("article img"):
        src = img.get("src")
        if not src:
            continue

        if src.startswith("//"):
            src = "https:" + src

        data["images"].append({"image_url": src, "alt_text": img.get("alt", "")})

    return data


@app.get("/scrape")
def scrape_article(url: str = Query(..., description="BBC News article URL")):
    if not url.startswith("https://www.bbc.com/news"):
        raise HTTPException(
            status_code=400, detail="Only BBC News article URLs are supported"
        )

    return scrape_bbc_article(url)
