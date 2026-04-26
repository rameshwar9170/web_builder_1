# Deployment Guide

Complete guide for deploying your Digital Visiting Cards platform to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Firebase project created and configured
- [ ] Environment variables set
- [ ] Super admin account created
- [ ] Security rules updated
- [ ] Build tested locally (`npm run build`)
- [ ] Domain name purchased (optional)

## Option 1: Firebase Hosting (Recommended)

### Why Firebase Hosting?
- Seamless integration with Firebase services
- Free SSL certificate
- Global CDN
- Automatic scaling
- Easy rollbacks

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

**Configuration:**
- Select your Firebase project
- Public directory: `build`
- Single-page app: `Yes`
- Automatic builds with GitHub: `No` (or Yes if you want)
- Overwrite index.html: `No`

### Step 4: Build Your App

```bash
npm run build
```

### Step 5: Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Step 6: Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate (can take 24 hours)

### Continuous Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Option 2: Vercel

### Why Vercel?
- Git integration
- Automatic deployments
- Preview deployments for PRs
- Analytics included
- Edge network

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy: `Yes`
- Which scope: Select your account
- Link to existing project: `No`
- Project name: `digital-visiting-cards`
- Directory: `./`
- Override settings: `No`

### Step 4: Add Environment Variables

```bash
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
vercel env add REACT_APP_FIREBASE_APP_ID
```

### Step 5: Production Deploy

```bash
vercel --prod
```

### GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

## Option 3: Netlify

### Why Netlify?
- Drag-and-drop deployment
- Form handling
- Split testing
- Edge functions

### Step 1: Build

```bash
npm run build
```

### Step 2: Deploy via Drag & Drop

1. Go to [netlify.com](https://netlify.com)
2. Drag `build` folder to deploy area
3. Site is live!

### Step 3: Continuous Deployment

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add environment variables in Site Settings

### netlify.toml Configuration

Create `netlify.toml` in root:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Post-Deployment Steps

### 1. Update Firebase Configuration

Add your production domain to Firebase:

1. Firebase Console > Authentication > Settings
2. Authorized domains > Add domain
3. Enter your production domain

### 2. Update CORS Settings

If using custom domain:

```bash
firebase deploy --only storage
```

### 3. Enable Firebase App Check (Recommended)

1. Firebase Console > App Check
2. Register your app
3. Choose provider (reCAPTCHA recommended)
4. Update security rules to require App Check

### 4. Set Up Monitoring

#### Firebase Performance Monitoring

```bash
npm install firebase
```

Add to `src/index.js`:

```javascript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

#### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

Configure in `src/index.js`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 5. Set Up Backups

#### Automated Firestore Backups

```bash
gcloud firestore export gs://your-bucket/backups
```

Create Cloud Scheduler job for daily backups.

### 6. Configure Analytics

#### Google Analytics

Add to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Environment-Specific Configurations

### Development

```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3000
```

### Staging

```env
REACT_APP_ENV=staging
REACT_APP_API_URL=https://staging.yourdomain.com
```

### Production

```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://yourdomain.com
```

## Performance Optimization

### 1. Enable Compression

Firebase Hosting automatically compresses files.

For other hosts, add to build:

```bash
npm install compression
```

### 2. Image Optimization

Use Firebase Storage image resizing:

```javascript
// In cardService.js
const resizedUrl = imageUrl + '_400x400';
```

### 3. Code Splitting

Already implemented with React.lazy (if needed):

```javascript
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
```

### 4. Caching Strategy

Update `public/index.html`:

```html
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

## Security Hardening

### 1. Content Security Policy

Add to `public/index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com; 
               style-src 'self' 'unsafe-inline';">
```

### 2. Environment Variables

Never commit `.env` file. Use platform-specific secret management.

### 3. Rate Limiting

Implement in Firebase Security Rules:

```javascript
allow write: if request.time > resource.data.lastWrite + duration.value(1, 's');
```

### 4. HTTPS Only

Enforce HTTPS in `firebase.json`:

```json
{
  "hosting": {
    "headers": [{
      "source": "**",
      "headers": [{
        "key": "Strict-Transport-Security",
        "value": "max-age=31536000; includeSubDomains"
      }]
    }]
  }
}
```

## Monitoring & Alerts

### 1. Firebase Alerts

Set up in Firebase Console:
- Budget alerts
- Performance alerts
- Crash alerts

### 2. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 3. Log Monitoring

Enable Cloud Logging in Firebase Console.

## Rollback Procedure

### Firebase Hosting

```bash
# List previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Vercel

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
npm install

# Clear build
rm -rf build
npm run build
```

### Environment Variables Not Working

- Restart build after adding variables
- Verify variable names start with `REACT_APP_`
- Check for typos

### Firebase Connection Issues

- Verify Firebase config in `.env`
- Check Firebase project is active
- Verify API keys are correct

### 404 Errors on Refresh

Add redirect rules (already in firebase.json):

```json
{
  "hosting": {
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

## Cost Optimization

### Firebase Free Tier Limits

- 50K reads/day
- 20K writes/day
- 1GB storage
- 10GB/month transfer

### Optimization Tips

1. Enable caching in Redux
2. Use pagination for large lists
3. Optimize images before upload
4. Use Cloud Functions for heavy operations
5. Monitor usage in Firebase Console

## Maintenance

### Regular Tasks

- [ ] Weekly: Check error logs
- [ ] Monthly: Review analytics
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance review
- [ ] Yearly: Backup verification

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update React
npm install react@latest react-dom@latest
```

## Support

For deployment issues:
- Firebase: [firebase.google.com/support](https://firebase.google.com/support)
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)

---

**Deployment Checklist Complete!** ✅

Your Digital Visiting Cards platform is now live and ready for users!
