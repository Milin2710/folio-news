// RSS feeds that get synced into the database. Add a feed here to add a category.
export const FEEDS = [
  { category: "World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { category: "Asia", url: "https://feeds.bbci.co.uk/news/world/asia/rss.xml" },
  { category: "Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { category: "Health", url: "https://feeds.bbci.co.uk/news/health/rss.xml" },
  { category: "Science", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml" },
  { category: "Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml" },
  { category: "Entertainment", url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml" },
];

export const CATEGORIES = FEEDS.map((feed) => feed.category);
