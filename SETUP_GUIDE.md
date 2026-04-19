# Daily Briefing Automation Setup Guide
## Claude + Vercel + iPhone Shortcuts

This guide walks you through deploying a daily briefing automation. The system pulls weather, email recaps, top 3 news headlines, and generates a personalized morning message via Claude Haiku.

**This is an open-source template.** You can share this with others and customize it for your own needs.

---

## Prerequisites

Before you start, have these ready:
- Anthropic API key (get at https://console.anthropic.com)
- Vercel account (free tier works, sign up at https://vercel.com)
- GitHub account (required for Vercel deployment)
- iPhone with Shortcuts app

**Estimated time:** 20-30 minutes

---

## Security & Privacy

This setup is designed to protect your data:
- Your API key is stored only in Vercel environment variables, never in code
- Email recaps and weather data are processed server-side and not logged
- CORS is restricted to iPhone Shortcuts origin only
- The template includes no personal identifying information
- You can customize the system prompt with your own context (see Part 4)

---

## Part 1: Deploy to Vercel

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name it `daily-briefing-api`
3. Choose "Private" (your API key will be here)
4. Click "Create repository"

### Step 2: Add Files to GitHub

1. Clone your new repo locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/daily-briefing-api.git
   cd daily-briefing-api
   ```

2. Create `package.json`:
   ```json
   {
     "name": "daily-briefing-api",
     "version": "1.0.0",
     "type": "module",
     "dependencies": {
       "@anthropic-ai/sdk": "^0.24.0",
       "rss-parser": "^3.13.0"
     },
     "engines": {
       "node": "18.x"
     }
   }
   ```

3. Create `api/briefing.js` (paste the Vercel function code from the artifact)

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit: daily briefing API"
   git push origin main
   ```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `daily-briefing-api` repo
4. Under "Environment Variables", add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (paste your API key from console.anthropic.com)
5. Click "Deploy"

**Save your Vercel URL** (looks like `https://daily-briefing-api-xyz.vercel.app`)

Your API endpoint is: `https://daily-briefing-api-xyz.vercel.app/api/briefing`

---

## Part 2: Set Up iPhone Shortcut

### Step 4: Create the Shortcut

1. Open the **Shortcuts** app on iPhone
2. Tap "+" to create a new shortcut
3. Build the automation with these actions (in order):

**Action 1: Get Weather**
- Add action: "Get Weather Conditions"
- Location: "Current Location"
- Store in variable: `weather_data`

**Action 2: Get Emails**
- Add action: "Find Messages"
- Filter: "Date Received" is in last 12 hours
- Filter: "Not Read"
- Limit: 3 items
- Store in variable: `recent_emails`

**Action 3: Format Email Data**
- Add action: "Text"
- Input: Create a formatted text block with sender and subject from `recent_emails`
- Store in variable: `email_summary`

Example format:
```
1. [Sender]: [Subject]
2. [Sender]: [Subject]
3. [Sender]: [Subject]
```

**Action 4: Call API**
- Add action: "Get contents of URL"
- Method: POST
- URL: `https://YOUR_VERCEL_URL/api/briefing`
- Headers:
  - Key: `Content-Type`
  - Value: `application/json`
- Request body (form):
  - `weather`: (select `weather_data` variable)
  - `emailSummary`: (select `email_summary` variable)
- Store response in variable: `api_response`

**Action 5: Extract Briefing**
- Add action: "Get dictionary value"
- Dictionary: (select `api_response`)
- Key: `briefing`
- Store in variable: `briefing_text`

**Action 6: Send iMessage**
- Add action: "Send Message"
- To: (your phone number or contact name)
- Message: (select `briefing_text` variable)

### Step 5: Create the Automation

1. Tap "Automation" at the bottom
2. Tap "+" and select "Time of Day"
3. Set time: 7:00 AM (or whenever you want)
4. Toggle "Ask Before Running" to OFF
5. Select your shortcut
6. Save

Your briefing will now send every morning at 7 AM.

---

## Important: Securing Your Repo

Before you push to GitHub:

1. **Make repo private** (if you don't want to share publicly)
2. **Add `.gitignore`** to prevent accidental secrets:
   ```
   .env
   .env.local
   node_modules/
   .vercel/
   ```
3. **Never commit your API key** (keep it in Vercel environment variables only)
4. **Review the code** before deploying to ensure no personal info is hardcoded

If you want to share this template publicly:
- Keep the repo as-is (it has no personal identifying info)
- Don't hardcode custom prompts with your name/details
- Use environment variables for custom configuration

---

### Test the API directly (optional):

Use curl or Postman to test:
```bash
curl -X POST https://YOUR_VERCEL_URL/api/briefing \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "66°F, clear skies",
    "emailSummary": "1. John: Project update\n2. Jane: Budget review"
  }'
```

You should get back:
```json
{
  "success": true,
  "briefing": "[Your generated briefing text]",
  "timestamp": "2024-04-16T12:00:00Z"
}
```

### Test the Shortcut:

1. Open Shortcuts app
2. Find your briefing shortcut
3. Tap the play button (don't wait for automation trigger)
4. Check for the iMessage

---

## Part 4: Customize Your Briefing

The API uses a generic default system prompt. You can customize it in two ways:

**Option A: Customize via environment variable (recommended for privacy)**

Add a new environment variable in Vercel:
- Key: `CUSTOM_BRIEFING_PROMPT`
- Value: (your custom system prompt, see examples below)

Update your Shortcut to send this in the request:
```
{
  "weather": "[weather data]",
  "emailSummary": "[emails]",
  "customPrompt": "[your custom prompt]"
}
```

This keeps personal context out of the public repo.

**Option B: Edit the code directly (if repo is private)**

Edit `api/briefing.js` line ~28 and replace the default prompt.

**Example custom prompts:**

*For founders:*
```
You are an operations analyst for a founder building an AI SaaS product. 
Create a briefing that highlights: product metrics, customer feedback, 
and tactical next steps. Keep tone action-focused and brief.
```

*For marketers:*
```
You are a content strategist for a marketing agency. Highlight trending 
topics from news, social, and industry feeds. Flag opportunities for 
client campaigns.
```

*For investors:*
```
You are an investment analyst. Summarize market movements, startup news, 
and sector trends relevant to early-stage tech. Flag notable funding rounds.
```

**News sources to customize:**

Edit lines in `api/briefing.js`:
```javascript
const NEWS_SOURCES = [
  { name: "TechCrunch", url: "http://feeds.techcrunch.com/TechCrunch/" },
  { name: "Forbes", url: "https://www.forbes.com/feeds/homepage.xml" },
  { name: "HackerNews", url: "https://news.ycombinator.com/rss" },
];
```

Replace with sources relevant to your industry:
- Marketing: `https://feeds.reddit.com/r/marketing.rss`
- Startups: `https://news.ycombinator.com/rss`
- AI: `https://feeds.thealgorithmicbridge.com/feed.xml`
- Finance: `https://feeds.bloomberg.com/markets/news.rss`

---

## Troubleshooting

**"Failed to generate briefing" in response**
- Check ANTHROPIC_API_KEY is set in Vercel environment variables
- Verify API key is active at console.anthropic.com

**Shortcut returns empty briefing**
- Ensure your Vercel URL is correct (no trailing slash)
- Test the API directly with curl first
- Check Shortcuts has permission to send Messages

**Emails not being fetched**
- Ensure "Not Read" filter is set correctly
- Verify you have unread emails from the last 12 hours
- Check Messages app permissions in Settings > Shortcuts

**News headlines not appearing**
- This is fine. The API gracefully falls back if feeds are slow
- Refresh Vercel logs for error details at vercel.com/dashboard

---

## Cost Breakdown

- **Vercel:** Free tier covers this (under 100 requests/day)
- **Claude Haiku:** ~12,000 tokens/month = ~$0.025/month
- **Total monthly cost:** Essentially free

---

## Next Steps

Once this is live, you can:
1. Add LinkedIn feed parsing (requires LinkedIn API access)
2. Integrate Airtable to log briefings for analytics
3. Add sentiment analysis on emails
4. Integrate calendar conflicts detection

---

## Support

If something breaks:
1. Check Vercel logs: vercel.com/dashboard > [project] > Logs
2. Test API with curl independently
3. Verify Shortcuts permissions in iPhone Settings
4. Check that weather/email data is being collected properly

You've got this.
