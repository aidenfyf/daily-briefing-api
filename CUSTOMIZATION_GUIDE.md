# Customization Guide
## Adding Your Own Context Safely

This guide shows how to customize the briefing for your needs without exposing personal information in your GitHub repo.

---

## Two Approaches

### Approach 1: Vercel Environment Variables (Recommended)

Keep all personal context in Vercel, not in your code.

**In Vercel Dashboard:**

1. Go to your project settings
2. Add new environment variables:
   - Key: `CUSTOM_BRIEFING_PROMPT`
   - Value: (your custom prompt, see examples below)

Your API will automatically use this prompt.

**Update your Shortcut:**

In the Dictionary action, add:
```
Key: "customPrompt"
Value: [from environment]
```

But since it's in Vercel already, you can just omit this field and the API will use the env variable.

### Approach 2: Private Repo

If you're keeping your repo private on GitHub:

1. Edit `api/briefing.js`
2. Modify the system prompt in the `generateDailyBriefing` function
3. Add your personal context there

This is fine for private repos. Just remember to keep it private.

---

## Custom Prompt Examples

### For Founders/Product Builders
```
You are an operations analyst supporting a product founder. Create a 
morning briefing that highlights: recent customer feedback, product 
metrics, and the day's key tasks. Flag anything blocking progress.

Tone: Action-oriented, brief, tactical.
```

### For SaaS Leaders
```
You are a business operations analyst for a SaaS company. Highlight: 
- MRR/ARR movements
- Customer churn signals
- Hiring/team updates
- Competitive moves

Keep under 750 characters.
```

### For Agency/Service Business
```
You are a project manager for a service business. Your briefing should 
cover: client deliverables due, team capacity, upcoming proposals, and 
blockers. Prioritize urgent issues.

Include any scheduling conflicts with ⚠️.
```

### For Investors
```
You are an investment analyst. Summarize: sector movements, startup 
funding announcements, M&A activity, and regulatory changes relevant 
to early-stage tech.

Focus: Themes, patterns, opportunities.
```

### For Marketers
```
You are a content strategist. Highlight trending topics, viral content 
themes, and competitor moves from your industry. Flag content opportunities 
and campaign ideas based on the day's news.

Include relevant hashtags or trending keywords.
```

### For Consultants
```
You are a business consultant. Summarize industry trends, client 
landscape changes, and competitive intelligence from the news. Highlight 
anything relevant to current client engagements.

Tone: Insightful, strategic.
```

---

## Customizing Without Exposing Details

**What to avoid in custom prompts:**
```
❌ You are Atlas, working for Aiden Frazier at AI Acquisition...
❌ You are helping John Smith in his post-surgery recovery...
❌ You work for [Full Name] at [Company Name]...
```

**What to do instead:**
```
✓ You are an operations analyst for a SaaS product builder...
✓ You are helping someone in recovery prioritize their day...
✓ You support the leadership team of a B2B software company...
```

Use role-based prompts instead of name-based. This keeps the template shareable while staying personalized.

---

## Adding Industry-Specific News Sources

In `api/briefing.js`, customize the NEWS_SOURCES array:

**For AI/Machine Learning:**
```javascript
const NEWS_SOURCES = [
  { name: "Papers with Code", url: "https://feeds.paperswithcode.com/latest.xml" },
  { name: "Import AI", url: "https://feeds.importai.substack.com/feed" },
  { name: "HackerNews", url: "https://news.ycombinator.com/rss" },
];
```

**For Startups/Entrepreneurship:**
```javascript
const NEWS_SOURCES = [
  { name: "ProductHunt", url: "https://feeds.producthunt.com/posts/rss" },
  { name: "HackerNews", url: "https://news.ycombinator.com/rss" },
  { name: "Indie Hackers", url: "https://feeds.indiehackers.com/latest.xml" },
];
```

**For Marketing/Growth:**
```javascript
const NEWS_SOURCES = [
  { name: "Reddit r/marketing", url: "https://feeds.reddit.com/r/marketing.rss" },
  { name: "VentureBeat", url: "https://feeds.venturebeat.com/categories/ai/feed.xml" },
  { name: "Growth News", url: "https://feeds.growthhackers.com/latest.xml" },
];
```

**For Finance:**
```javascript
const NEWS_SOURCES = [
  { name: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss" },
  { name: "TechCrunch", url: "http://feeds.techcrunch.com/TechCrunch/" },
  { name: "MarketWatch", url: "https://feeds.marketwatch.com/marketwatch/topstories/" },
];
```

---

## Filtering Headlines for Your Industry

The headline filtering happens in the `filterHeadlinesByIndustry` function. 

To customize, edit the filter prompt (around line ~40):

**Current:**
```javascript
const response = await client.messages.create({
  ...
  messages: [
    {
      role: "user",
      content: `You are a news curator... Filter these headlines to find the top 3 most relevant to: 
AI-powered business tools, client retention systems, SaaS acquisition...`
    }
  ]
});
```

**Edit the filter to match your industry:**

For AI Development:
```
...relevant to: machine learning breakthroughs, AI safety, GPU availability, 
language models, training techniques...
```

For E-commerce:
```
...relevant to: checkout optimization, fulfillment trends, customer retention, 
conversion rate optimization, competitive pricing...
```

For Healthcare Tech:
```
...relevant to: healthcare regulations, EHR integrations, patient data privacy, 
telemedicine adoption, clinical workflows...
```

---

## Testing Your Customization

After editing:

1. Deploy to Vercel: `git push origin main`
2. Wait for deployment to complete
3. Test the API manually:
   ```bash
   curl -X POST https://YOUR_VERCEL_URL/api/briefing \
     -H "Content-Type: application/json" \
     -d '{
       "weather": "72°F, sunny",
       "emailSummary": "Sample email"
     }'
   ```
4. Check that briefing matches your tone/focus
5. Run your Shortcut to verify the message format

---

## Keeping It Shareable

If you want to share this template with others:

1. Keep `api/briefing.js` generic (no personal names/details)
2. Document your customization in a `CUSTOMIZATION.md` for your use case
3. Leave example prompts in comments in the code
4. Never commit your actual custom prompt if it contains personal info

Others can then:
- Fork your repo
- Use it as a template
- Customize it for their own needs
- Keep everything secure

---

## Questions?

If you get stuck:
- Check the SETUP_GUIDE.md for deployment help
- Review the daily-briefing-api.js comments
- Test the API independently before testing the Shortcut
- Check Vercel logs for error details
