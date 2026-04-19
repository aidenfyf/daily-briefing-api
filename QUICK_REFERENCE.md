# Quick Reference Card
## Daily Briefing Automation Setup

Keep this open while you're setting everything up.

---

## ⚠️ Security First

- **Never commit your API key** to GitHub
- **Always** store it in Vercel environment variables
- **Verify** CORS is configured correctly in Vercel logs
- **Keep your repo private** if you don't want to share with others
- **Don't hardcode** personal identifying information in the code

---

## Step 1: Get Your API Key
- Go to: https://console.anthropic.com
- Click "API Keys" (left sidebar)
- Click "Create Key"
- Copy the key immediately (you won't see it again)
- **SAVE THIS:** Your API Key = `sk-ant-...`

---

## Step 2: Create GitHub Repo
- Go to: https://github.com/new
- Repo name: `daily-briefing-api`
- Visibility: Private
- Create repository

---

## Step 3: Deploy to Vercel
- Go to: https://vercel.com/new
- Import your GitHub repo
- Add Environment Variable:
  - Key: `ANTHROPIC_API_KEY`
  - Value: (paste your API key from Step 1)
- Click Deploy
- **SAVE THIS:** Your Vercel URL = `https://daily-briefing-api-xyz.vercel.app`

---

## Step 4: Build Shortcut on iPhone
Open Shortcuts app and add these actions in order:

| # | Action | Key Settings | Variable |
|---|--------|--------------|----------|
| 1 | Get Weather Conditions | Location: Current Location | `weather_output` |
| 2 | Find Messages | Filters: Last 12 hrs + Unread, Limit 3 | `recent_emails` |
| 3 | Text | Format emails as list | `email_summary` |
| 4 | Get Contents of URL | POST to: `https://YOUR_VERCEL_URL/api/briefing` | `api_response` |
| 5 | Get Dictionary Value | Key: "briefing" from response | `briefing_message` |
| 6 | Send Message | To: Your phone number, Message: `briefing_message` | — |

---

## Step 5: Create Automation
- Shortcuts app > Automation tab > "+"
- Time of Day: 7:00 AM
- Ask Before Running: OFF
- Select your briefing shortcut
- Save

---

## Test It
1. Open Shortcuts > find your briefing shortcut
2. Tap play button
3. Check iPhone for iMessage in 5-10 seconds

---

## Your URLs & Keys

**Anthropic API Key:**
```
[PASTE HERE AFTER STEP 1]
```

**GitHub Repo:**
```
https://github.com/YOUR_USERNAME/daily-briefing-api
```

**Vercel Deployment URL:**
```
[PASTE HERE AFTER STEP 3]
```

**Shortcut API Endpoint:**
```
[PASTE HERE WITH YOUR VERCEL URL]/api/briefing
```

**iMessage Recipient:**
```
[Your phone number or contact name]
```

---

## Files You'll Create

```
daily-briefing-api/
├── package.json                    (dependencies)
├── api/
│   └── briefing.js                (Vercel function)
└── README.md                       (optional)
```

---

## Cost Check
- Vercel: Free
- Claude Haiku: ~$0.025/month
- **Total: Basically free**

---

## If Something Breaks

**Check Vercel Logs:**
https://vercel.com/dashboard > [daily-briefing-api] > Logs

**Test API Manually:**
```bash
curl -X POST https://YOUR_VERCEL_URL/api/briefing \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "66°F, clear",
    "emailSummary": "John: Update"
  }'
```

**Reset Shortcut:**
Shortcuts app > Long press shortcut > "Edit" > Start over

---

## Support Checklist

- [ ] API key created and valid
- [ ] GitHub repo is private
- [ ] Vercel deployed successfully
- [ ] ANTHROPIC_API_KEY set in Vercel env vars
- [ ] Shortcut built with all 6 actions
- [ ] Shortcut tested manually (sends message)
- [ ] Automation created (time set to 7 AM)
- [ ] "Ask Before Running" is OFF
- [ ] iPhone has Messages permission for Shortcuts

---

Done. You're set.
