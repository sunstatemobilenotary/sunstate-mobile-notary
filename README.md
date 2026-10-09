# Sunstate Mobile Notary Website

Professional mobile notary services website built with Astro and deployed on Cloudflare Pages.

## 🌟 Features

- **Static Site**: Built with Astro for fast, SEO-friendly pages
- **Mobile-First Design**: Responsive Tailwind CSS styling
- **Content Management**: Decap CMS for easy editing via web interface
- **Payment Processing**: Stripe Checkout integration (TEST mode by default)
- **Spam Protection**: Cloudflare Turnstile on contact forms
- **SEO Optimized**: LocalBusiness schema, meta tags, sitemap, robots.txt
- **Serverless Functions**: Cloudflare Pages Functions for dynamic features
- **Auto-Deploy**: Push to GitHub main branch to deploy automatically

## 📁 Project Structure

```
sunstate-mobile-notary/
├── src/
│   ├── content/              # Editable content (services, pricing, FAQ, etc.)
│   │   ├── business-info.json
│   │   ├── pricing.json
│   │   ├── services/         # Service markdown files
│   │   ├── faq/             # FAQ markdown files
│   │   └── legal/           # Privacy & Terms markdown
│   ├── layouts/             # Page layouts
│   ├── pages/               # Website pages
│   └── styles/              # Global styles
├── functions/
│   └── api/                 # Cloudflare Pages Functions
│       ├── contact.ts       # Contact form handler
│       ├── create-checkout.ts
│       └── stripe-webhook.ts
├── public/
│   ├── admin/               # Decap CMS files
│   └── images/              # Static images
├── oauth-proxy-worker.js    # Separate worker for Decap CMS OAuth
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or run `nvm use 18` if you have nvm)
- GitHub account: sunstatemobilenotary
- Cloudflare account with Pages access
- Stripe account (TEST keys for now)

### Local Development

1. **Clone the repository** (after pushing to GitHub):
```bash
git clone https://github.com/sunstatemobilenotary/sunstate-mobile-notary.git
cd sunstate-mobile-notary
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Add your credentials to `.env`**:
```env
GITHUB_TOKEN=your_github_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

5. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:4321` to see the site.

## 📤 Deploying to Cloudflare Pages

### Initial Setup

1. **Push code to GitHub**:
```bash
# From the project directory
git remote add origin https://github.com/sunstatemobilenotary/sunstate-mobile-notary.git
git push -u origin main
```

2. **Connect to Cloudflare Pages**:
   - Log in to Cloudflare Dashboard
   - Go to **Pages** → **Create a project**
   - Select **Connect to Git**
   - Choose your GitHub account and the `sunstate-mobile-notary` repository
   - Configure build settings:
     - **Framework preset**: Astro
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click **Save and Deploy**

3. **Add Environment Variables in Cloudflare**:
   - In your Cloudflare Pages project, go to **Settings** → **Environment variables**
   - Add these variables for **Production**:
     ```
     STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     PUBLIC_TURNSTILE_SITE_KEY=...
     TURNSTILE_SECRET_KEY=...
     ```

4. **Set up Custom Domain**:
   - Go to **Custom domains** in your Pages project
   - Click **Set up a custom domain**
   - Add `sunstatemobilenotary.com`
   - Add `www.sunstatemobilenotary.com` (will auto-redirect to apex)
   - Cloudflare will automatically provision SSL certificates

5. **Configure SSL/TLS**:
   - In Cloudflare Dashboard, go to **SSL/TLS** for your domain
   - Set SSL/TLS encryption mode to **Full**
   - Enable **Always Use HTTPS**

### Automatic Deployments

Once connected, every push to the `main` branch will automatically:
1. Trigger a new build
2. Deploy to production at sunstatemobilenotary.com
3. Send you a deployment notification

Preview deployments are created for other branches.

## 📝 Editing Content

### Option 1: Decap CMS (Recommended for Rich)

1. **Complete OAuth Setup** (see Setup Checklist below)
2. Visit `https://sunstatemobilenotary.com/admin`
3. Click "Login with GitHub"
4. Edit content using the friendly web interface
5. Click "Publish" to commit changes to GitHub
6. Cloudflare automatically deploys the changes

### Option 2: Direct File Editing

Edit content files directly in the repository:

- **Business Info**: `src/content/business-info.json`
- **Services**: `src/content/services/*.md`
- **Pricing**: `src/content/pricing.json`
- **FAQ**: `src/content/faq/*.md`
- **Legal**: `src/content/legal/*.md`

Commit and push changes to deploy.

## 🔄 How to Roll Back Changes

If something goes wrong after deploying:

1. Go to Cloudflare Pages → Your project
2. Click **Deployments** tab
3. Find a previous working deployment
4. Click the **⋮** menu → **Rollback to this deployment**

Alternatively, use Git:
```bash
git revert HEAD
git push origin main
```

## 💳 Switching from TEST to LIVE Stripe Keys

**⚠️ DO NOT do this until Rich gives approval**

1. Log in to Stripe Dashboard
2. Toggle from "Test mode" to "Live mode"
3. Get your live API keys from **Developers** → **API keys**
4. In Cloudflare Pages:
   - Go to **Settings** → **Environment variables**
   - Update `STRIPE_PUBLISHABLE_KEY` to `pk_live_...`
   - Update `STRIPE_SECRET_KEY` to `sk_live_...`
5. Redeploy the site (push a commit or use manual deploy)
6. Test a small payment to confirm it's working

## 🛡️ Getting Cloudflare Turnstile Keys

1. Log in to Cloudflare Dashboard
2. Go to **Turnstile** (in left sidebar)
3. Click **Add site**
4. Configure:
   - **Site name**: Sunstate Mobile Notary
   - **Domain**: sunstatemobilenotary.com
   - **Widget Mode**: Managed
5. Copy the **Site Key** (PUBLIC_TURNSTILE_SITE_KEY)
6. Copy the **Secret Key** (TURNSTILE_SECRET_KEY)
7. Add both to Cloudflare Pages environment variables

## 📧 Email Service Integration

The contact form currently logs submissions. To send actual emails:

1. Choose an email service:
   - **Resend** (recommended, easy setup)
   - **SendGrid** (popular, free tier)
   - **Mailgun** (reliable)
   - **Cloudflare Email Workers** (advanced)

2. Edit `functions/api/contact.ts`
3. Replace the `console.log` with actual email sending code
4. Add API keys to environment variables

Example with Resend:
```typescript
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'noreply@sunstatemobilenotary.com',
    to: 'rich@sunstatemobilenotary.com',
    subject: 'New Appointment Request',
    text: emailBody,
  }),
});
```

## 🔐 Stripe Webhook Setup

To receive payment confirmations:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://sunstatemobilenotary.com/api/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret**
6. Add it as `STRIPE_WEBHOOK_SECRET` in Cloudflare Pages environment variables

## 🎨 Customization

### Colors

Edit `tailwind.config.mjs` to change the color scheme:
```javascript
colors: {
  primary: { /* Blue theme */ },
  accent: { /* Gold/yellow theme */ },
}
```

### Business Information

Edit `src/content/business-info.json` - this updates the entire site automatically.

### Adding New Pages

1. Create a new file in `src/pages/` (e.g., `src/pages/blog.astro`)
2. Use the `BaseLayout` component
3. Add navigation links in `src/layouts/BaseLayout.astro`

## 📊 Analytics (Optional)

To add Google Analytics or other tracking:

1. Edit `src/layouts/BaseLayout.astro`
2. Add tracking script in the `<head>` section
3. Use environment variable for the tracking ID

## 🐛 Troubleshooting

### Build fails on Cloudflare
- Check the build logs in Cloudflare Pages
- Ensure all environment variables are set
- Try building locally: `npm run build`

### CMS not loading
- Verify OAuth proxy worker is deployed
- Check that GitHub OAuth app callback URL is correct
- Ensure repository name matches in `config.yml`

### Stripe checkout not working
- Verify Stripe keys are correct (TEST or LIVE)
- Check browser console for errors
- Ensure PUBLIC_TURNSTILE_SITE_KEY is set

### Contact form not submitting
- Check Turnstile keys are configured
- Look at Functions logs in Cloudflare Pages
- Verify CORS settings if testing locally

## 📦 Dependencies

- **Astro**: Static site generator
- **Tailwind CSS**: Styling framework
- **gray-matter**: Parse markdown frontmatter
- **Decap CMS**: Content management
- **Stripe**: Payment processing
- **Cloudflare Turnstile**: Bot protection

## 🤝 Support

For issues with:
- **Website content**: Edit via Decap CMS at /admin
- **Technical problems**: Check Cloudflare Pages deployment logs
- **Payments**: Check Stripe Dashboard
- **DNS/Domain**: Check Cloudflare DNS settings

## 📄 License

Private repository - All rights reserved.

---

**Built with ❤️ using Astro, Tailwind CSS, and Cloudflare Pages**
