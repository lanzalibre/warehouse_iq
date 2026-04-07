SHELL := /bin/bash

DIST_DIR := dist
AWS_DEFAULT_REGION := us-east-2

.PHONY: build sync invalidate deploy status

deploy: build sync invalidate
	@echo ""
	@echo "✓ Deployment complete"
	@echo "  S3  : s3://$${S3_BUCKET}/$${S3_PREFIX}/"
	@echo "  URL : $${CF_DOMAIN}"
	@echo ""
	@echo "Distribution may take 5-10 min to propagate globally."
	@echo "Check status: make status"

build:
	npm run build

sync:
	@set -a && source .env && set +a && \
	echo "→ Uploading hashed assets (1-year cache)..." && \
	aws s3 sync $(DIST_DIR)/ s3://$${S3_BUCKET}/$${S3_PREFIX}/ --delete \
	  --exclude "*.html" \
	  --cache-control "public, max-age=31536000, immutable" \
	  --region $(AWS_DEFAULT_REGION) && \
	echo "→ Uploading HTML (no cache)..." && \
	aws s3 sync $(DIST_DIR)/ s3://$${S3_BUCKET}/$${S3_PREFIX}/ \
	  --exclude "*" --include "*.html" \
	  --cache-control "no-cache, no-store, must-revalidate" \
	  --content-type "text/html" \
	  --region $(AWS_DEFAULT_REGION)

invalidate:
	@set -a && source .env && set +a && \
	echo "→ Invalidating CloudFront cache..." && \
	aws cloudfront create-invalidation \
	  --distribution-id $${CF_DISTRIBUTION_ID} \
	  --paths "/*" \
	  --query 'Invalidation.{Id:Id,Status:Status}' \
	  --output table \
	  --region $(AWS_DEFAULT_REGION)

status:
	@set -a && source .env && set +a && \
	aws cloudfront get-distribution \
	  --id $${CF_DISTRIBUTION_ID} \
	  --query 'Distribution.{Status:Status,Domain:DomainName}' \
	  --output table \
	  --region $(AWS_DEFAULT_REGION)
