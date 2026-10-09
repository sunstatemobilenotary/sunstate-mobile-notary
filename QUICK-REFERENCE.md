# Quick Reference Guide

Common tasks for managing sunstatemobilenotary.com

## 📝 Editing Content (Easiest Way)

1. Go to https://sunstatemobilenotary.com/admin
2. Log in with GitHub
3. Click on what you want to edit
4. Make changes
5. Click "Publish"
6. Wait 2-3 minutes for site to update

## 💰 Change Pricing

**Via CMS:**
- Go to /admin → Pricing → Edit

**Via Files:**
- Edit `src/content/pricing.json`
- Commit and push

## ➕ Add New Service

**Via CMS:**
- Go to /admin → Services → New Service
- Fill in title, description, order
- Publish

**Via Files:**
- Create new file in `src/content/services/my-service.md`
- Add frontmatter and content
- Commit and push

## ❓ Add New FAQ

**Via CMS:**
- Go to /admin → FAQ → New FAQ
- Fill in question, category, answer
- Publish

**Via Files:**
- Create new file in `src/content/faq/my-question.md`
- Add frontmatter and content
- Commit and push

## 📞 Update Phone Number or Email

**Via CMS:**
- Go to /admin → Business Information
- Update phone/email fields
- Publish

**Via Files:**
- Edit `src/content/business-info.json`
- Commit and push

## 🔄 Deploy Changes Manually

If you made changes directly in GitHub:

1. Go to Cloudflare Pages
2. Click your project
3. Click "Create deployment"
4. Select "main" branch
5. Click "Save and deploy"

Or just wait - it auto-deploys within 2-3 minutes of any push to main.

## ⏪ Undo a Mistake

**Quick rollback:**
1. Cloudflare Pages → Deployments
2. Find last good deployment
3. Click menu (...) → Rollback

**Via Git:**
```bash
git revert HEAD
git push
```

## 💳 Switch to Live Stripe Payments

**⚠️ Only when ready to accept real money:**

1. Get LIVE keys from Stripe (pk_live_ and sk_live_)
2. Cloudflare Pages → Settings → Environment Variables
3. Update both Stripe keys
4. Redeploy
5. Test with small real payment

## 🔍 View Logs

**Build logs:**
- Cloudflare Pages → Deployments → Click deployment → View logs

**Function logs (contact form, payments):**
- Cloudflare Pages → Functions → Real-time logs

## 📊 Check What's Working

- **Site up?** Visit https://sunstatemobilenotary.com
- **SSL working?** Look for green lock in browser
- **Forms working?** Fill out /book and check email
- **Payments working?** Use test card 4242 4242 4242 4242

## 🆘 Emergency Contacts

- **Site down?** Check Cloudflare status page
- **Payment issues?** Check Stripe Dashboard
- **Email not working?** Check Cloudflare Email Routing
- **Can't edit content?** Check GitHub OAuth app

## 📱 Test Card Numbers (Stripe TEST Mode)

- **Success:** 4242 4242 4242 4242
- **Declined:** 4000 0000 0000 0002
- **Insufficient funds:** 4000 0000 0000 9995

Use any future expiry date and any 3-digit CVC.

## 🌐 Important URLs

- **Website:** https://sunstatemobilenotary.com
- **CMS:** https://sunstatemobilenotary.com/admin
- **GitHub Repo:** https://github.com/sunstatemobilenotary/sunstate-mobile-notary
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Stripe Dashboard:** https://dashboard.stripe.com

## 📧 Email Forwarding

rich@sunstatemobilenotary.com → Gmail

Managed in Cloudflare → Email Routing. Don't touch MX/TXT records.

## 🔐 Where Are My Keys?

Environment variables are in:
- **Cloudflare Pages** → Settings → Environment Variables

Never commit .env file to GitHub!

---

**For detailed instructions, see README.md and SETUP-CHECKLIST.md**
