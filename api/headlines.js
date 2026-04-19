import Parser from "rss-parser";
import Anthropic from "@anthropic-ai/sdk";

const parser = new Parser();
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const NEWS_SOURCES = [
  { name: "TechCrunch", url: "http://feeds.techcrunch.com/TechCrunch/" },
  { name: "Forbes", url: "https://www.forbes.com/feeds/homepage.xml" },
  { name: "HackerNews", url: "https://news.ycombinator.com/rss" },
];

async function fetchHeadlines() {
  const headlines = [];
  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      feed.items.slice(0, 5).forEach((item) => {
        headlines.push({
          title: item.title,
          source: source.name,
        });
      });
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
    }
  }
  return headlines;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const headlines = await fetchHeadlines();

    const headlineText = headlines
      .map((h) => `- ${h.title} (${h.source})`)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Filter these headlines and return ONLY the top 3 most relevant to AI, business, technology, and SaaS. For each, provide the headline and a 15-word summary. Format as plain text with line breaks, no markdown.

${headlineText}`,
        },
      ],
    });

    const briefing = response.content[0].type === "text" ? response.content[0].text : "No headlines";

    return res.status(200).json({
      success: true,
      briefing: briefing,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Headlines failed",
      details: error.message,
    });
  }
}
