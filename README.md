# NYC Tech Week '26 Itinerary

A dark-mode, programmer-vibe itinerary page for **Pasley Hill LLC** — built for NYC Tech Week 2026.

Vanilla HTML / CSS / JS, bundled with [Vite](https://vitejs.dev/). Animated gradient background, terminal typing effect, scroll-reveal timeline, and Pasley Hill brand colors.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Deploy

The site is hosted at **https://nyctechweek.pasleyhill.com** (S3 + CloudFront).

```bash
npm run build    # build first — deploy.sh deploys dist/
./deploy.sh
```

`deploy.sh` syncs `dist/` to S3 (long-cache for hashed assets, `no-cache` for HTML) and invalidates the CloudFront distribution.

Requirements:
- **AWS CLI v2** installed and on `PATH`.
- An AWS CLI profile named **`pasley_hill`** (`aws configure --profile pasley_hill`) with permissions for:
  - `s3:*` on bucket `nyctechweek-pasleyhill-com`
  - `cloudfront:CreateInvalidation` on distribution `E2ZR1G8UFUHIO4`

## Structure

```
index.html      markup + fonts + background layers
src/main.js     event data + render + animations
src/style.css   theme, layout, animations
public/logo.png Pasley Hill logo
```
