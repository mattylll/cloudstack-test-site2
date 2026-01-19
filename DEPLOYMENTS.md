# Deployment URLs

## Production Deployments

### Vercel
- **URL**: https://cloudstack-test-site.vercel.app/
- **Status**: ✅ Working
- **Region**: London (lhr1)
- **Method**: Git-based (automatic)

### Netlify
- **URL**: TBD (after GitHub Actions deploy)
- **Status**: ⚠️ Pending first deploy
- **Region**: UK Edge
- **Method**: GitHub Actions

### Cloudflare Pages
- **URL**: TBD (after GitHub Actions deploy)
- **Status**: ⚠️ Pending first deploy
- **Region**: UK PoPs
- **Method**: GitHub Actions

## GitHub Actions Setup Required

Add these secrets to the GitHub repository:

```
NETLIFY_AUTH_TOKEN=<from .env>
NETLIFY_SITE_ID=<get from Netlify dashboard>
CLOUDFLARE_API_TOKEN=<from .env>
CLOUDFLARE_ACCOUNT_ID=<from .env>
```

## Next Steps

1. Add GitHub secrets
2. Push workflows to trigger deployments
3. Verify all 3 platforms deploy successfully
4. Update this file with final URLs
