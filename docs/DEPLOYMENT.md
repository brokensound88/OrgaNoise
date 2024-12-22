# Deployment Guide

## Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

## Environment Variables
Required:
- `VITE_API_URL`: API endpoint
- `VITE_SITE_URL`: Production URL

## Deployment Checklist
1. Run tests
2. Build application
3. Verify environment variables
4. Deploy to hosting
5. Verify deployment