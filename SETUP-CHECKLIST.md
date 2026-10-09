# Setup Checklist for Sunstate Mobile Notary Website

Complete these tasks to get your website fully operational.

## ✅ Before You Start

- [x] Domain registered: sunstatemobilenotary.com (Cloudflare)
- [x] Email forwarding active: rich@sunstatemobilenotary.com → Gmail
- [x] GitHub account created: sunstatemobilenotary
- [x] GitHub fine-grained token created
- [x] Cloudflare API token created
- [x] Stripe account with TEST keys

## 📝 Step 1: Update Content Placeholders

All placeholder content is marked with `[PLACEHOLDER: ...]`. Update these files:

### Business Information
File: `src/content/business-info.json`

- [ ] Add business phone number
- [ ] List specific counties served
- [ ] List major cities served
- [ ] Add service radius (e.g., "50 miles from Miami")
- [ ] Add business hours (weekdays/weekends)
- [ ] Add social media URLs (or remove if not applicable)
- [ ] Add Florida Notary Commission Number
- [ ] List certifications (NNA Certified, NSA, etc.)

### Services
Files: `src/content/services/*.md`

- [ ] Review loan-signing.md - add certifications or DELETE if not offering
- [ ] Review remote-online.md - DELETE if not offering RON
- [ ] Customize service descriptions as needed

### Pricing
File: `src/content/pricing.json`

- [ ] Set standard notarization fee (Florida max is $10/signature as of 2024)
- [ ] Set mobile service base fee and mileage rate
- [ ] Set after-hours fee
- [ ] Set loan signing fee
- [ ] Set RON fee or DELETE if not offering
- [ ] Set witness service fee
- [ ] Define base service radius for travel
- [ ] Set deposit amount and policy
- [ ] Update payment methods list

### About Page
File: `src/pages/about.astro`

- [ ] Write personal bio about Rich (experience, background, commitment)

### Legal Documents
Files: `src/content/legal/privacy.md` and `src/content/legal/terms.md`

- [ ] Add "Last Updated" date
- [ ] Add phone number to both documents
- [ ] Add cancellation policy timeframe (e.g., 24 hours)
- [ ] **IMPORTANT**: Have an attorney review both documents for compliance

## 🚀 Step 2: Create GitHub Repository

```bash
# You should be in the project directory
cd /home/owner/Documents/Projects/sunstatemobilenotary.com

# Create repository on GitHub
gh repo create sunstate-mobile-notary --public --source=. --remote=origin --push

# OR do it manually:
# 1. Go to https://github.com/sunstatemobilenotary
# 2. Click "New repository"
# 3. Name: sunstate-mobile-notary
# 4. Make it PUBLIC (required for Decap CMS free tier)
# 5. Don't initialize with README
# 6. Create repository
# 7. Then run:
git remote add origin https://github.com/sunstatemobilenotary/sunstate-mobile-notary.git
git push -u origin main
```

- [ ] Repository created and code pushed

## ☁️ Step 3: Deploy to Cloudflare Pages

1. **Connect Repository**
   - [ ] Log in to Cloudflare Dashboard
   - [ ] Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
   - [ ] Authorize Cloudflare to access your GitHub account
   - [ ] Select the `sunstate-mobile-notary` repository
   - [ ] Click **Begin setup**

2. **Configure Build Settings**
   - [ ] Project name: `sunstate-mobile-notary` (or any name you prefer)
   - [ ] Production branch: `main`
   - [ ] Framework preset: **Astro**
   - [ ] Build command: `npm run build`
   - [ ] Build output directory: `dist`
   - [ ] Click **Save and Deploy**

3. **Wait for Initial Deployment**
   - [ ] First build completes successfully
   - [ ] Note your temporary URL: `sunstate-mobile-notary.pages.dev`

## 🔧 Step 4: Configure Environment Variables

In Cloudflare Pages → Settings → Environment Variables, add:

### Production Variables
- [ ] `STRIPE_PUBLISHABLE_KEY` = `pk_test_...` (your Stripe TEST publishable key)
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...` (your Stripe TEST secret key)
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` = (create in Step 5)
- [ ] `TURNSTILE_SECRET_KEY` = (create in Step 5)

**Note**: Start with TEST keys. Only switch to LIVE when Rich approves.

## 🛡️ Step 5: Set Up Cloudflare Turnstile

1. **Create Turnstile Site**
   - [ ] In Cloudflare Dashboard, go to **Turnstile**
   - [ ] Click **Add site**
   - [ ] Site name: `Sunstate Mobile Notary`
   - [ ] Domain: `sunstatemobilenotary.com`
   - [ ] Widget mode: **Managed** (recommended)
   - [ ] Click **Create**

2. **Copy Keys**
   - [ ] Copy **Site Key** → Add as `PUBLIC_TURNSTILE_SITE_KEY` in Cloudflare Pages
   - [ ] Copy **Secret Key** → Add as `TURNSTILE_SECRET_KEY` in Cloudflare Pages

3. **Redeploy**
   - [ ] Go to Cloudflare Pages → Deployments
   - [ ] Click **Create deployment** to rebuild with new environment variables

## 🌐 Step 6: Connect Custom Domain

1. **Add Domain to Pages**
   - [ ] In Cloudflare Pages project, go to **Custom domains**
   - [ ] Click **Set up a custom domain**
   - [ ] Enter: `sunstatemobilenotary.com`
   - [ ] Click **Continue** → **Activate domain**
   - [ ] Add `www.sunstatemobilenotary.com` as well
   - [ ] Cloudflare will auto-configure DNS (wait for SSL)

2. **Configure SSL**
   - [ ] In Cloudflare Dashboard (main domain settings), go to **SSL/TLS**
   - [ ] Set encryption mode to **Full** (not Full Strict, not Flexible)
   - [ ] Go to **SSL/TLS** → **Edge Certificates**
   - [ ] Enable **Always Use HTTPS**
   - [ ] Enable **Automatic HTTPS Rewrites**

3. **Verify Setup**
   - [ ] Wait 5-10 minutes for SSL to activate
   - [ ] Visit `https://sunstatemobilenotary.com` - should load correctly
   - [ ] Visit `http://www.sunstatemobilenotary.com` - should redirect to HTTPS apex

## 📧 Step 7: Set Up Email Service (Contact Form)

The contact form currently just logs submissions. Choose an email provider:

### Option A: Resend (Recommended - Easy)
1. **Sign up**
   - [ ] Go to https://resend.com/signup
   - [ ] Create account

2. **Verify Domain**
   - [ ] Add `sunstatemobilenotary.com` in Resend
   - [ ] Add the DNS records Resend provides to Cloudflare DNS
   - [ ] Wait for verification

3. **Get API Key**
   - [ ] Create API key in Resend dashboard
   - [ ] Add as `RESEND_API_KEY` in Cloudflare Pages environment variables

4. **Update Code**
   - [ ] Edit `functions/api/contact.ts`
   - [ ] Uncomment/add Resend integration code (see README)
   - [ ] Commit and push to deploy

### Option B: SendGrid, Mailgun, or Other
- [ ] Follow similar process: sign up, verify domain, get API key, update code

## 🎨 Step 8: Set Up Decap CMS (Content Editor)

### 8.1: Create GitHub OAuth App
- [ ] Go to https://github.com/settings/developers
- [ ] Click **New OAuth App**
- [ ] Fill in:
  - Application name: `Sunstate Mobile Notary CMS`
  - Homepage URL: `https://sunstatemobilenotary.com`
  - Authorization callback URL: `https://oauth-proxy.[YOUR-WORKER].workers.dev/callback`
    (You'll update this after creating the worker in step 8.2)
- [ ] Click **Register application**
- [ ] Copy **Client ID** - save for later
- [ ] Click **Generate a new client secret**
- [ ] Copy **Client Secret** - save for later

### 8.2: Deploy OAuth Proxy Worker

1. **Create Worker**
   - [ ] In Cloudflare Dashboard, go to **Workers & Pages**
   - [ ] Click **Create application** → **Create Worker**
   - [ ] Name it: `oauth-proxy` (or `sunstate-oauth-proxy`)
   - [ ] Click **Deploy** (with default code for now)

2. **Add Worker Code**
   - [ ] Click **Edit code**
   - [ ] Delete all existing code
   - [ ] Copy/paste contents of `oauth-proxy-worker.js` from your project
   - [ ] Click **Save and deploy**

3. **Set Environment Variables**
   - [ ] Go to **Settings** → **Variables**
   - [ ] Add `OAUTH_CLIENT_ID` = (GitHub OAuth Client ID from step 8.1)
   - [ ] Add `OAUTH_CLIENT_SECRET` = (GitHub OAuth Client Secret from step 8.1)
   - [ ] Click **Deploy** to redeploy with variables

4. **Get Worker URL**
   - [ ] Note your worker URL: `https://oauth-proxy.[YOUR-WORKER].workers.dev`
   - [ ] Go back to GitHub OAuth App settings
   - [ ] Update **Authorization callback URL** to: `https://oauth-proxy.[YOUR-WORKER].workers.dev/callback`
   - [ ] Click **Update application**

5. **Update CMS Config**
   - [ ] Edit `public/admin/config.yml` in your project
   - [ ] Update `base_url` to your worker URL (without `/auth`)
   - [ ] Example: `base_url: https://oauth-proxy.yourworker.workers.dev`
   - [ ] Commit and push to deploy

### 8.3: Test Decap CMS
- [ ] Visit `https://sunstatemobilenotary.com/admin`
- [ ] Click **Login with GitHub**
- [ ] Authorize the app
- [ ] You should see the content editor interface!
- [ ] Try editing some content and publishing

## 💳 Step 9: Configure Stripe Webhook (Optional but Recommended)

1. **Create Webhook**
   - [ ] Go to Stripe Dashboard → **Developers** → **Webhooks**
   - [ ] Click **Add endpoint**
   - [ ] Endpoint URL: `https://sunstatemobilenotary.com/api/stripe-webhook`
   - [ ] Events to send:
     - [ ] `checkout.session.completed`
     - [ ] `checkout.session.expired`
     - [ ] `payment_intent.succeeded`
     - [ ] `payment_intent.payment_failed`
   - [ ] Click **Add endpoint**

2. **Add Signing Secret**
   - [ ] Copy the **Signing secret** from the webhook details
   - [ ] Add as `STRIPE_WEBHOOK_SECRET` in Cloudflare Pages environment variables
   - [ ] Redeploy site

## 🖼️ Step 10: Add Images (Optional)

- [ ] Add business logo to `public/images/logo.png`
- [ ] Add Open Graph image for social sharing: `public/images/og-image.jpg` (1200x630px recommended)
- [ ] Update image references in `src/layouts/BaseLayout.astro` if needed

## 🧪 Step 11: Testing

### Test All Pages
- [ ] Home page loads correctly
- [ ] Services page displays all services
- [ ] Pricing page shows all pricing info
- [ ] Service Area page shows coverage
- [ ] About page displays bio
- [ ] FAQ page shows all questions
- [ ] Privacy and Terms pages load

### Test Contact Form
- [ ] Fill out booking form at /book
- [ ] Complete Turnstile challenge
- [ ] Submit form - should see success message
- [ ] Check that email arrives (if email service configured)

### Test Stripe (TEST Mode)
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Expiry: any future date, CVC: any 3 digits
- [ ] Complete payment
- [ ] Should redirect to /payment-success

### Test CMS
- [ ] Log in to /admin
- [ ] Edit business info
- [ ] Publish changes
- [ ] Verify changes appear on live site after deployment

### Test Mobile
- [ ] Open site on phone
- [ ] Check all pages are responsive
- [ ] Test navigation menu
- [ ] Test forms

## 📊 Step 12: SEO & Analytics (Optional)

### Google Search Console
- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `sunstatemobilenotary.com`
- [ ] Verify ownership (DNS TXT record method via Cloudflare)
- [ ] Submit sitemap: `https://sunstatemobilenotary.com/sitemap.xml`

### Google Business Profile
- [ ] Create/claim Google Business Profile
- [ ] Add website link
- [ ] Verify business

### Google Analytics (Optional)
- [ ] Create GA4 property
- [ ] Add tracking code to `src/layouts/BaseLayout.astro`

## 🔐 Step 13: Security & Backups

- [ ] Enable 2FA on GitHub account
- [ ] Enable 2FA on Cloudflare account
- [ ] Enable 2FA on Stripe account
- [ ] Keep local backup of `.env` file (DON'T commit to git)
- [ ] Document all credentials in a password manager

## 🎉 Step 14: Go Live Checklist

Before announcing the site:
- [ ] All placeholder content replaced with real content
- [ ] Contact form tested and working
- [ ] Phone number and email tested
- [ ] Privacy policy and terms reviewed by attorney
- [ ] Test payment with TEST Stripe keys successful
- [ ] Mobile responsiveness verified
- [ ] All links work (no 404s)
- [ ] SSL certificate active (green lock in browser)
- [ ] Google Search Console submitted

## 💰 When Ready to Accept Real Payments

**⚠️ Only do this when Rich approves:**

1. **Stripe Live Mode**
   - [ ] In Stripe Dashboard, switch from Test to Live mode
   - [ ] Copy LIVE API keys (starts with `pk_live_` and `sk_live_`)
   - [ ] In Cloudflare Pages, update environment variables:
     - Replace `STRIPE_PUBLISHABLE_KEY` with live key
     - Replace `STRIPE_SECRET_KEY` with live key
   - [ ] Redeploy site
   - [ ] Update webhook endpoint in Stripe to use live mode
   - [ ] Test with a small real payment

2. **Announce Launch**
   - [ ] Update social media
   - [ ] Email existing clients
   - [ ] Update Google Business Profile

---

## 🆘 Support Resources

- **README**: Detailed documentation in `README.md`
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Astro Docs**: https://docs.astro.build/
- **Stripe Docs**: https://stripe.com/docs
- **Decap CMS Docs**: https://decapcms.org/docs/

---

**Questions?** Email me at the address we've been using, or open an issue in the GitHub repository.
