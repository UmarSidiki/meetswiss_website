# Deployment Guide

This project is split across two hosting platforms:

| Service   | Platform          | Directory  |
|-----------|-------------------|------------|
| **Strapi** (CMS) | VPS via Dokploy   | `strapi/`  |
| **Next.js** (Frontend) | Vercel     | `next/`    |

---

## 1. Strapi on Dokploy (VPS)

### Prerequisites
- A VPS with [Dokploy](https://dokploy.com) installed
- A domain pointing to your VPS (e.g. `api.meetswiss.com`)
- A PostgreSQL database (Dokploy can spin one up for you)

### Setup Steps

1. **Create a new Application** in Dokploy
2. **Connect your Git repository**
3. **Set the build path** to `strapi/` (Dokploy will find the `Dockerfile` there)
4. **Set up a PostgreSQL database** via Dokploy's database panel (or use an external one)
5. **Configure environment variables** in Dokploy:

| Variable | Example | Required |
|---|---|---|
| `HOST` | `0.0.0.0` | ✅ |
| `PORT` | `1337` | ✅ |
| `PUBLIC_URL` | `https://api.meetswiss.com` | ✅ |
| `APP_KEYS` | `key1,key2` (generate random) | ✅ |
| `API_TOKEN_SALT` | (generate random) | ✅ |
| `ADMIN_JWT_SECRET` | (generate random) | ✅ |
| `TRANSFER_TOKEN_SALT` | (generate random) | ✅ |
| `JWT_SECRET` | (generate random) | ✅ |
| `DATABASE_CLIENT` | `postgres` | ✅ |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/strapi` | ✅ |
| `CLIENT_URL` | `https://meetswiss.com` | ✅ |
| `PREVIEW_SECRET` | (shared secret with Next.js) | ✅ |
| `NEXT_REVALIDATE_URL` | `https://meetswiss.com/api/revalidate` | ✅ |
| `REVALIDATE_WEBHOOK_SECRET` | (shared secret with Next.js) | ✅ |

6. **Set up a domain** in Dokploy (e.g. `api.meetswiss.com`) with HTTPS
7. **Deploy** — Dokploy will build from the Dockerfile

### Generate Secrets

```bash
# Generate random keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this 5 times for: `APP_KEYS` (x2, comma-separated), `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`.

### Persistent Storage

> **Important**: Mount a volume at `/app/public/uploads` in Dokploy so uploaded media files survive container restarts and redeployments.

---

## 2. Next.js on Vercel

### Setup Steps

1. **Import the repository** into Vercel
2. **Set the Root Directory** to `next/` in **Settings → General → Root Directory**
3. **Framework Preset** should auto-detect as **Next.js**
4. **Configure environment variables** in Vercel dashboard:

| Variable | Example | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.meetswiss.com` | ✅ |
| `IMAGE_HOSTNAME` | `api.meetswiss.com` | ✅ |
| `ENVIRONMENT` | `production` | ✅ |
| `WEBSITE_URL` | `https://meetswiss.com` | ✅ |
| `PREVIEW_SECRET` | (same as Strapi) | ✅ |
| `REVALIDATE_WEBHOOK_SECRET` | (same as Strapi) | ✅ |
| `SMTP_HOST` | `smtp.example.com` | For contact form |
| `SMTP_PORT` | `587` | For contact form |
| `SMTP_SECURE` | `false` | For contact form |
| `SMTP_USER` | `smtp-user` | For contact form |
| `SMTP_PASS` | `smtp-password` | For contact form |
| `SMTP_FROM` | `no-reply@meetswiss.com` | For contact form |
| `SMTP_TO` | `contact@meetswiss.com` | For contact form |
| `CONTACT_SUBJECT_PREFIX` | `Meetswiss Transfers` | For contact form |

5. **Deploy**

---

## 3. Connecting Them

### How Data Flows

```
┌──────────────────┐       Build-time fetch        ┌──────────────────┐
│                  │ ─────────────────────────────► │                  │
│   Vercel         │       (API data + pages)       │   Dokploy VPS    │
│   (Next.js)      │                                │   (Strapi)       │
│                  │ ◄───────────────────────────── │                  │
│                  │    Webhook (on content change)  │                  │
└──────────────────┘                                └──────────────────┘
        │                                                    │
        │  Serves HTML/JS                    Serves images   │
        ▼                                    (/uploads/...)  ▼
    ┌──────────┐                            ┌──────────────────┐
    │  Users   │ ────── image requests ───► │  Strapi public   │
    └──────────┘                            └──────────────────┘
```

### Revalidation (ISR)

When you edit content in Strapi:
1. Strapi's lifecycle hooks fire a webhook to `NEXT_REVALIDATE_URL`
2. Vercel receives the webhook and invalidates the relevant cache tags
3. The next visitor gets fresh content

**Shared secrets**: `PREVIEW_SECRET` and `REVALIDATE_WEBHOOK_SECRET` must match between Strapi and Next.js.

### Image Serving

Images are served **directly from Strapi** (your VPS). When a user loads a page:
1. Next.js renders `<Image src="https://api.meetswiss.com/uploads/photo.jpg" />`
2. The browser fetches the image directly from your VPS
3. Next.js Image Optimization proxies and caches the image through Vercel's edge CDN

### Preview / Draft Mode

Strapi's preview button opens the Next.js site in draft mode:
1. Strapi redirects to `CLIENT_URL/api/preview?secret=...&url=...`
2. Next.js validates the secret and enables draft mode
3. Draft content is fetched directly from Strapi (bypassing cache)

---

## 4. Domain Configuration

### Strapi (VPS)
- Point `api.meetswiss.com` (A record) to your VPS IP
- Configure SSL in Dokploy (automatic via Let's Encrypt)

### Next.js (Vercel)
- Point `meetswiss.com` to Vercel (follow Vercel's domain setup)
- Configure in Vercel dashboard → Settings → Domains

---

## Troubleshooting

### Images not loading
- Verify `IMAGE_HOSTNAME` is set in Vercel env vars (just hostname, no `https://`)
- Verify `PUBLIC_URL` is set in Strapi env vars (full URL with `https://`)
- Check that Strapi's uploads directory has a persistent volume mounted

### Revalidation not working
- Verify `REVALIDATE_WEBHOOK_SECRET` matches on both sides
- Verify `NEXT_REVALIDATE_URL` in Strapi points to `https://your-domain.com/api/revalidate`
- Check Strapi logs for webhook errors

### CORS errors
- Verify `CLIENT_URL` in Strapi env vars matches your Vercel domain exactly
- Check browser console for the specific blocked origin

### Build fails on Vercel
- Verify `NEXT_PUBLIC_API_URL` is set and Strapi is reachable from Vercel's build servers
- Check that the root directory is set to `next/` in Vercel settings
