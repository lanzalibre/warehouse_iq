# AWS configuration - use environment variables or set explicitly below
S3_BUCKET := ssca-demfcast
S3_PREFIX := warehouse-iq
CF_DISTRIBUTION_ID := E3NXXXXXXXXXX
CF_DOMAIN := warehouse-iq.spinnaker-sca.com

DIST_DIR := dist

.PHONY: build sync invalidate deploy status

## Full deploy: build → sync → invalidate
deploy: build sync invalidate
	@echo ""
	@echo "✓ Deployment complete"
	@echo "  S3  : s3://$(S3_BUCKET)/$(S3_PREFIX)/"
	@echo "  URL : $(CF_DOMAIN)"
	@echo ""
	@echo "Distribution may take 5–10 min to propagate globally."
	@echo "Check status: make status"

## Build the Vite app
build:
	npm run build

## Sync dist/ to S3 with correct cache headers
sync:
	@echo "→ Uploading hashed assets (1-year cache)..."
	aws s3 sync $(DIST_DIR)/ s3://$(S3_BUCKET)/$(S3_PREFIX)/ --delete \
	  --exclude "*.html" \
	  --cache-control "public, max-age=31536000, immutable" \
	  --region us-east-1
	@echo "→ Uploading HTML (no cache)..."
	aws s3 sync $(DIST_DIR)/ s3://$(S3_BUCKET)/$(S3_PREFIX)/ \
	  --exclude "*" --include "*.html" \
	  --cache-control "no-cache, no-store, must-revalidate" \
	  --content-type "text/html" \
	  --region us-east-1

## Invalidate CloudFront edge cache
invalidate:
	@echo "→ Invalidating CloudFront cache..."
	aws cloudfront create-invalidation \
	  --distribution-id $(CF_DISTRIBUTION_ID) \
	  --paths "/*" \
	  --query 'Invalidation.{Id:Id,Status:Status}' \
	  --output table \
	  --region us-east-1

## Check CloudFront distribution status
status:
	aws cloudfront get-distribution \
	  --id $(CF_DISTRIBUTION_ID) \
	  --query 'Distribution.{Status:Status,Domain:DomainName}' \
	  --output table \
	  --region us-east-1
