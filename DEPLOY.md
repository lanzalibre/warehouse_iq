# Deployment Guide — SpinnakerSCA Warehouse IQ

Deploys the Vite React SPA as a static site on **AWS S3 + CloudFront**.

---

## Infrastructure

| Resource | Value |
|----------|-------|
| S3 bucket | `ssca-demfcast` (us-east-1) |
| S3 prefix | `warehouse-iq/` |
| CloudFront distribution ID | `E2570CHYFFGKFP` |
| CloudFront domain | `https://d9p3fj3jgp9b9.cloudfront.net` |
| CloudFront OAC ID | `E2DCLDTK8H6XXE` |

---

## First-time setup

These steps only need to be done once. The infrastructure already exists — skip to [Re-deploy](#re-deploy) for subsequent deployments.

### Prerequisites

- AWS CLI installed (`brew install awscli`)
- AWS credentials with access to `ssca-demfcast` and CloudFront

### Steps that were already completed

1. CloudFront Origin Access Control created (`spinnakersca-oac`)
2. CloudFront distribution created pointing to `ssca-demfcast/warehouse-iq/`
3. S3 bucket policy attached to allow CloudFront OAC read access
4. Custom error responses configured: 403 and 404 → `index.html` (HTTP 200), enabling SPA client-side routing

---

## Re-deploy

Use this for every new release.

### 1. Get AWS credentials

Obtain temporary STS credentials for the `769863964477` account and update the three rotating values in `.env`:

```
AWS_ACCESS_KEY_ID="ASIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_SESSION_TOKEN="..."
```

> **Note:** STS session tokens expire. Run all steps below in a single shell session before the token expires. All other values in `.env` (`S3_BUCKET`, `CF_DISTRIBUTION_ID`, etc.) are stable and never need to change.

### 2. Run the deploy

```bash
make deploy
```

That's it. The Makefile runs build → S3 sync → CloudFront invalidation in one shot.

---

## Makefile reference

| Command | What it does |
|---------|-------------|
| `make deploy` | Full pipeline: build → sync → invalidate |
| `make build` | Vite production build only |
| `make sync` | Upload `dist/` to S3 (two passes for cache headers) |
| `make invalidate` | Purge CloudFront edge cache |
| `make status` | Check if distribution is `Deployed` or `InProgress` |

All infrastructure constants are read from `.env` automatically — no need to export anything manually.

---

## Verify

```bash
make status
```

Then open https://d9p3fj3jgp9b9.cloudfront.net in a browser.

- App loads on first visit
- Tab navigation works (client-side routing)
- Hard-refresh on any tab still loads the app (custom error responses handle 403/404 → index.html)

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `403 Forbidden` from CloudFront | Bucket policy or OAC misconfigured | Verify bucket policy grants `s3:GetObject` to the distribution ARN |
| Old version still showing after deploy | CloudFront edge cache not invalidated | Re-run step 4 (invalidation) |
| `ExpiredTokenException` during sync | STS token expired mid-deploy | Re-export fresh credentials and re-run steps 3–4 |
| Blank page after hard-refresh | Custom error responses not set | Verify 403/404 → `/index.html` with HTTP 200 on the distribution |
