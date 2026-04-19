# iPhone Shortcut: Daily Briefing (Claude + Headlines)

This file contains the complete Shortcut workflow. You have two options:

## Option A: Manual Build (Recommended for first-time)

Follow the step-by-step instructions in SETUP_GUIDE.md Part 2 to build this in the Shortcuts app.

## Option B: Import from iCloud Link

Once you build it, share it via iCloud Link:
1. In Shortcuts app, tap the shortcut
2. Tap "..." (more)
3. Tap "Share"
4. "Share via iCloud Link"
5. Copy link and save it

---

## Complete Shortcut Workflow

Here's the exact sequence of actions:

### 1. Get Current Weather
- Action: "Get Weather Conditions"
- Location: "Current Location"
- Format: Temperature and conditions only
- Variable: `weather_output`

### 2. Fetch Recent Emails
- Action: "Find Messages"
- Service: Messages
- Filters:
  - "Date Received" is in the last "12 Hours"
  - "Unread" is "Yes"
- Limit: "3 Items"
- Variable: `recent_emails`

### 3. Format Email Summary
- Action: "Text"
- Output template:
  ```
  [repeat with each email from recent_emails]
  [Sender Name]: [Subject Line]
  [end repeat]
  ```
- Variable: `email_summary`

Tip: Use "Ask Each Time" if you want to manually add context, or leave empty if no recent emails.

### 4. Prepare API Request
- Action: "Dictionary"
  - Key: "weather"
  - Value: [weather_output variable]
  - Key: "emailSummary"
  - Value: [email_summary variable]
  - Key: "customPrompt" (optional)
  - Value: [your custom system prompt if needed]
- Variable: `request_body`

Note: If you're using a custom prompt stored in Vercel environment variables, omit the customPrompt key.

### 5. Call Vercel API
- Action: "Get Contents of URL"
  - URL: `https://YOUR_VERCEL_URL/api/briefing`
  - Method: "POST"
  - Headers:
    - "Content-Type": "application/json"
  - Request Body: [request_body variable]
  - Show Result: OFF
- Variable: `api_response`

### 6. Parse Response
- Action: "Get Dictionary Value"
  - Dictionary: [api_response]
  - Key: "briefing"
- Variable: `briefing_message`

### 7. Send iMessage
- Action: "Send Message"
  - Show When Run: OFF
  - Recipient: [Your phone number]
  - Message: [briefing_message variable]

### 8. (Optional) Log to Notes
- Action: "Add to Notes"
  - Notes: "Daily Briefing Log"
  - Text: [briefing_message variable]

---

## Setting Up the Daily Automation

After building the shortcut:

1. Tap "Automation" (bottom of Shortcuts app)
2. Tap "Create Personal Automation"
3. Select "Time of Day"
4. Set time: 7:00 AM (or preferred time)
5. Tap "Ask Before Running" toggle to OFF
6. Choose your "Daily Briefing" shortcut
7. Save

The shortcut will now run automatically every morning.

---

## Testing Checklist

Before relying on the automation:

- [ ] Run the shortcut manually and verify iMessage sends
- [ ] Check that weather data is accurate
- [ ] Verify email parsing captures recent unread emails correctly
- [ ] Confirm API response includes headlines digest
- [ ] Test with different email counts (0, 1, 3+)
- [ ] Verify character limit is respected (under 750 chars)
- [ ] Check that no duplicate messages are sent

---

## URL Substitution

When you build this, replace:
- `https://YOUR_VERCEL_URL/api/briefing`

With your actual Vercel deployment URL. Example:
- `https://daily-briefing-api-abc123.vercel.app/api/briefing`

---

## Privacy & Security

- Your email content is only processed server-side and never logged or stored
- Weather data is fetched from your device, not sent elsewhere
- The API returns only the generated briefing text
- Your API key is never exposed in the Shortcut or network traffic
- CORS is restricted to iPhone Shortcuts origin only

---

**Change the send time:**
Tap the automation > Time of Day > adjust hour/minute

**Send to a different contact:**
Edit "Send Message" > Recipient field

**Add more email filters:**
In "Find Messages" action, tap "Add Filter"

**Change character limit:**
Edit the API function in Vercel, change `750 characters` to desired limit

**Add calendar conflicts:**
Insert "Find Events" action after weather, pass to API as additional context

---

## Troubleshooting in Shortcuts

**"URL cannot be reached" error:**
- Verify your Vercel URL is correct (test in Safari first)
- Check that ANTHROPIC_API_KEY is set in Vercel environment
- Ensure CORS headers are set (they are, but double-check api/briefing.js)

**Empty briefing received:**
- Check email_summary variable is being populated
- Verify weather data is not null
- Test API directly: https://YOUR_VERCEL_URL/api/briefing

**Message sends but content is wrong:**
- Check that briefing_message variable is being extracted correctly
- Log the raw api_response by adding a "Show Result" step temporarily

**Automation doesn't run:**
- Verify "Ask Before Running" is toggled OFF
- Check that iPhone isn't in Do Not Disturb
- Ensure Shortcuts app has notification permissions
- Verify time is set to future time (won't run for past times)

---

Done. Your morning briefing is live.
