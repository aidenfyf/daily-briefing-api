import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";

// Validate API key exists at startup
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    "ANTHROPIC_API_KEY environment variable is not set. Add it in Vercel dashboard."
  );
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
const parser = new Parser();

// News sources with RSS feeds (no API keys needed)
const NEWS_SOURCES = [
  { name: "TechCrunch", url: "http://feeds.techcrunch.com/TechCrunch/" },
  { name: "Forbes", url: "https://www.forbes.com/feeds/homepage.xml" },
  { name: "HackerNews", url: "https://news.ycombinator.com/rss" },
];

async function fetchHeadlines() {
  const headlines = [];

  try {
    for (const source of NEWS_SOURCES) {
      const feed = await parser.parseURL(source.url);
      feed.items.slice(0, 5).forEach((item) => {
        headlines.push({
          title: item.title,
          source: source.name,
          link: item.link,
          pubDate: item.pubDate,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching headlines:", error);
  }

  return headlines;
}

async function filterHeadlinesByIndustry(headlines) {
  if (headlines.length === 0) {
    return [];
  }

  const headlineText = headlines
    .map((h) => `- ${h.title} (${h.source})`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20241022",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a news curator for an AI acquisition and client retention specialist. Filter these headlines to find the top 3 most relevant to: AI-powered business tools, client retention systems, SaaS acquisition, revenue operations, and AI product building.

For each headline, provide:
1. The headline
2. Source
3. A 20-word summary

Return ONLY the 3 headlines in this format, numbered 1-3, with one blank line between each:

${headlineText}

If fewer than 3 relevant headlines exist, return only what's relevant. Keep summaries under 20 words.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function generateDailyBriefing(weatherData, emailSummary, customPrompt = null) {
  const headlines = [];
  const headlinesDigest = await filterHeadlinesByIndustry(headlines);

  // Use custom prompt if provided, otherwise use default template
  
async function generateDailyBriefing(weatherData, emailSummary, customPrompt = null) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20241022",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `Weather: ${weatherData}\n\nEmails: ${emailSummary}\n\nCreate a brief morning summary.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
  

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20241022",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: systemPrompt,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export default async function handler(req, res) {
  // Validate request origin (only allow from iPhone Shortcuts)
  // Update this to your actual domain if hosting elsewhere
  const allowedOrigins = [
    "https://www.icloud.com",
    "https://shortcuts.icloud.com",
  ];
  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // CORS headers
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { weather, emailSummary, customPrompt } = req.body;

    if (!weather || !emailSummary) {
      return res.status(400).json({
        error: "Missing required fields: weather, emailSummary",
      });
    }

    const briefing = await generateDailyBriefing(
      weather,
      emailSummary,
      customPrompt
    );

    return res.status(200).json({
      success: true,
      briefing: briefing,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Failed to generate briefing",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
