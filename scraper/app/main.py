from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .scraper import ScrapeError, is_allowed_url, scrape_article

app = FastAPI(
    title="Folio News Scraper",
    description="Extracts the text and images of a news article. Called by the Folio server.",
    version="2.0.0",
)

# Only the Node server (and local tools) talk to this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/scrape")
def scrape(url: str = Query(..., description="Full URL of the article")):
    if not is_allowed_url(url):
        raise HTTPException(status_code=400, detail="Only BBC article URLs are supported")

    try:
        return scrape_article(url)
    except ScrapeError as error:
        raise HTTPException(status_code=502, detail=str(error))
