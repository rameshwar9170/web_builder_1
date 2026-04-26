# Vercel Deployment Guide

## Step 1: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `crystalr01/digital-cards`
5. Configure the project settings (keep defaults)
6. **DO NOT DEPLOY YET** - First add environment variables

## Step 2: Add Environment Variables

Before deploying, you MUST add these environment variables in Vercel:

### Go to: Project Settings → Environment Variables

Add the following variables (copy-paste these exact values):

```
REACT_APP_FIREBASE_API_KEY=AIzaSyDSA9eYdtVzF-8OhVQ0kK2kP8oZLSOMNFs
REACT_APP_FIREBASE_AUTH_DOMAIN=digital-cards-38a1d.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=digital-cards-38a1d
REACT_APP_FIREBASE_STORAGE_BUCKET=digital-cards-38a1d.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=73437948325
REACT_APP_FIREBASE_APP_ID=1:73437948325:web:3c928b689022beeea8604c
```

### Optional (if you have Gemini AI):
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 3: Environment Selection

For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

## Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 5: Verify Deployment

After deployment, test these features:
- ✅ Login/Register works
- ✅ Create new card
- ✅ Edit card features
- ✅ View public card
- ✅ Image uploads work

## Troubleshooting

### If you see "Firebase not initialized" error:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all variables are added correctly
3. Redeploy the project

### If images don't upload:
1. Check Firebase Storage rules in Firebase Console
2. Ensure storage bucket name is correct
3. Verify Firebase Storage is enabled in your Firebase project

### If authentication fails:
1. Go to Firebase Console → Authentication
2. Enable Email/Password authentication
3. Add your Vercel domain to authorized domains:
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add: `your-project-name.vercel.app`

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase authorized domains

## Important Notes

- ⚠️ Never commit `.env` file to GitHub (it's already in .gitignore)
- ⚠️ Environment variables in Vercel are separate from your local `.env`
- ⚠️ After adding/changing environment variables, you must redeploy
- ✅ The `.env.example` file is safe to commit (contains no real keys)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Firebase Console for any restrictions
4. Ensure all environment variables are set correctly
