# Security Checklist
## Before Deploying or Sharing

Use this checklist to ensure your setup is secure and shareable.

---

## API Key Security

- [ ] API key is stored only in Vercel environment variables
- [ ] API key is NOT in `package.json`
- [ ] API key is NOT in `api/briefing.js` or any JavaScript file
- [ ] `.gitignore` includes `.env` and `.env.local`
- [ ] GitHub repo does NOT show your API key in commit history
- [ ] Vercel dashboard shows ANTHROPIC_API_KEY as an environment variable

**If you exposed your key:**
1. Go to console.anthropic.com
2. Delete the exposed key
3. Create a new key
4. Update Vercel environment variables
5. Delete any exposed GitHub commits (or rotate the repo if necessary)

---

## Personal Information

### Code (api/briefing.js)
- [ ] No personal names hardcoded in system prompts
- [ ] No personal phone numbers in code
- [ ] No personal email addresses in code
- [ ] No company names or confidential details in code
- [ ] No role titles that identify you specifically

**Generic instead of specific:**
```
✓ "You are a business operations analyst"
✗ "You are Sarah Chen, CFO of TechCo Inc"

✓ "Filter for SaaS industry news"
✗ "Filter for news about our direct competitors: Company X, Y, Z"
```

### Shortcut
- [ ] Shortcut does NOT hardcode personal phone numbers
- [ ] Shortcut uses your contact name or generic "Self"
- [ ] Shortcut does NOT have custom prompts with personal info
- [ ] Shortcut does NOT log or display your email content

### GitHub Repo
- [ ] Repository is private (or has been scrubbed of personal info if public)
- [ ] No comments in code that mention personal details
- [ ] No commit messages that include sensitive info
- [ ] `.gitignore` is configured correctly
- [ ] No secrets in README.md or documentation files

---

## CORS & Request Security

In `api/briefing.js`:
- [ ] CORS is restricted to iPhone Shortcuts origins only
- [ ] Origin validation is in place (not allowing all origins)
- [ ] POST method is enforced
- [ ] Invalid requests return 403/405, not 500
- [ ] Error messages don't expose system details

---

## Data Handling

- [ ] Email summaries are not logged to Vercel logs
- [ ] Weather data is not stored or logged
- [ ] API responses are not cached with personal content
- [ ] No tracking pixels or analytics on briefing content
- [ ] No data sent to third parties

---

## Deployment

- [ ] Vercel project is owned by your account (not shared)
- [ ] Vercel environment variables are only visible to you
- [ ] Vercel logs don't expose sensitive data
- [ ] Function isn't exposed as a public API (if not needed)
- [ ] Rate limiting is in place (if planning to scale)

---

## Sharing This Template

If you want to share with others:

- [ ] Remove all references to your name
- [ ] Remove company-specific customizations
- [ ] Create a template system prompt (generic)
- [ ] Document customization without examples that contain personal info
- [ ] Include this security checklist in the repo
- [ ] Add a note: "This template contains no personal identifying information"

---

## Quarterly Review

Every 3 months:

- [ ] Check that API key is still in use (disable unused keys)
- [ ] Review Vercel logs for suspicious activity
- [ ] Verify CORS configuration is still correct
- [ ] Check that no new personal info was added to code
- [ ] Review recent commits for exposed secrets

---

## If You Find an Issue

**API Key exposed:**
1. Delete it immediately at console.anthropic.com
2. Create a new key
3. Update Vercel
4. Force push to GitHub (if necessary): `git push --force-with-lease`

**Personal info in code:**
1. Remove the sensitive data
2. Commit the fix
3. If sensitive (password, token), revoke/rotate it
4. Amend previous commits if needed

**Suspicious activity:**
1. Check Vercel logs for unusual requests
2. Review API usage at console.anthropic.com
3. If compromised, rotate API key immediately
4. Review GitHub access logs

---

## Tools to Check

Run these locally to verify security:

**Check for secrets in Git history:**
```bash
git log -p | grep -i "api_key\|password\|secret"
```

**Check for hardcoded values:**
```bash
grep -r "sk-ant-" api/
grep -r "phone" api/
grep -r "email.*@" api/
```

**Validate environment variables are set in Vercel:**
```bash
# Can't check this locally, but verify in Vercel dashboard
# that ANTHROPIC_API_KEY shows as ●●●●●● (redacted)
```

---

## Questions?

- Review the SETUP_GUIDE.md for deployment steps
- Check CUSTOMIZATION_GUIDE.md for safe ways to add personal context
- Refer to Anthropic API docs for security best practices
- Test locally before deploying to Vercel
