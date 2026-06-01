#!/usr/bin/env bash
# Deploy dist/ to S3 + invalidate CloudFront for nyctechweek.pasleyhill.com
set -euo pipefail

PROFILE=pasley_hill
BUCKET=nyctechweek-pasleyhill-com
DISTRIBUTION_ID=E2ZR1G8UFUHIO4
DIST_DIR="$(cd "$(dirname "$0")" && pwd)/dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "dist/ not found at $DIST_DIR — run the build first." >&2
  exit 1
fi

echo "Syncing $DIST_DIR -> s3://$BUCKET ..."

# Hashed/static assets: long cache. Everything except the HTML entrypoints.
aws s3 sync "$DIST_DIR" "s3://$BUCKET" \
  --profile "$PROFILE" \
  --delete \
  --exclude "*.html" \
  --cache-control "public,max-age=31536000,immutable"

# HTML: no long cache so new deploys are picked up immediately.
aws s3 sync "$DIST_DIR" "s3://$BUCKET" \
  --profile "$PROFILE" \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache" \
  --content-type "text/html; charset=utf-8"

echo "Invalidating CloudFront ($DISTRIBUTION_ID) ..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$PROFILE" \
  --query 'Invalidation.{Id:Id,Status:Status}'

echo "Done. https://nyctechweek.pasleyhill.com"
