"""Downloads a news article page and extracts its text and images."""

from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; FolioNews/2.0)"}
TIMEOUT_SECONDS = 10

# Only these sites may be scraped (also stops the service being used to fetch arbitrary URLs)
ALLOWED_HOSTS = ("bbc.com", "bbc.co.uk")


class ScrapeError(Exception):
    """Raised when an article cannot be fetched."""


def is_allowed_url(url: str) -> bool:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    return parsed.scheme in ("http", "https") and any(
        host == allowed or host.endswith("." + allowed) for allowed in ALLOWED_HOSTS
    )


def scrape_article(url: str) -> dict:
    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT_SECONDS)
        response.raise_for_status()
    except requests.RequestException as error:
        raise ScrapeError("Failed to fetch the article") from error

    return parse_article(response.text, url)


def parse_article(html: str, url: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    title_tag = soup.find("h1")
    time_tag = soup.find("time")

    # Prefer paragraphs inside <article>, fall back to every paragraph on the page
    paragraphs = soup.select("article p") or soup.find_all("p")
    texts = [p.get_text(strip=True) for p in paragraphs]
    content = "\n\n".join(text for text in texts if text)

    images = []
    for img in soup.select("article img"):
        src = img.get("src")
        if not src:
            continue
        if src.startswith("//"):
            src = "https:" + src
        images.append({"image_url": src, "alt_text": img.get("alt", "")})

    return {
        "url": url,
        "title": title_tag.get_text(strip=True) if title_tag else None,
        "published_time": time_tag["datetime"] if time_tag and time_tag.has_attr("datetime") else None,
        "content": content,
        "images": images,
    }
