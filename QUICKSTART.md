# Quick Start Guide

Get your Digital Visiting Cards platform up and running in 10 minutes!

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (free tier works)

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
# Navigate to project directory
cd digital-visiting-cards

# Install dependencies
npm install
```

### 2. Firebase Setup (5 minutes)

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "digital-cards" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Enable "Email/Password"
5. Click "Save"

#### Create Firestore Database
1. Click "Firestore Database" in sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (closest to your users)
5. Click "Enable"

#### Update Security Rules
1. In Firestore, click "Rules" tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
    }
    
    match /cards/{cardId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.adminId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
    }
  }
}
```

3. Click "Publish"

#### Enable Storage
1. Click "Storage" in sidebar
2. Click "Get started"
3. Use default security rules
4. Click "Done"

#### Update Storage Rules
1. Click "Rules" tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cards/{cardId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

#### Get Firebase Config
1. Click gear icon ⚙️ > "Project settings"
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name: "Digital Cards"
5. Copy the config object

### 3. Environment Setup (1 minute)

Create `.env` file in project root:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Create Super Admin (2 minutes)

#### Start the app
```bash
npm start
```

#### Register first user
1. Open http://localhost:3000
2. You'll be redirected to login
3. Click "Register" (if you added a register link) or go to `/register`
4. Fill in details:
   - Name: Your Name
   - Email: admin@example.com
   - Password: (secure password)
5. Click "Register"

#### Make user Super Admin
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your project
3. Click "Firestore Database"
4. Click "users" collection
5. Find your user document
6. Click to edit
7. Change `role` field from `user` to `super_admin`
8. Click "Update"

#### Login as Super Admin
1. Go back to app
2. Login with your credentials
3. You should see "Super Admin" dashboard

## You're Ready! 🎉

### What You Can Do Now

#### As Super Admin:
1. Navigate to "Manage Admins"
2. Click "Add Admin"
3. Create admin accounts
4. Set subscription plans and limits

#### As Admin (create test admin):
1. Create an admin account from Super Admin panel
2. Logout and login as admin
3. Click "Create New Card"
4. Fill in basic information
5. Customize sections (About, Services, Products, etc.)
6. Choose theme and colors
7. Click "Publish"
8. View your card at: `http://localhost:3000/card/your-slug`

## Common Issues

### Issue: "Firebase not configured"
**Solution**: Check your `.env` file has all variables and restart the dev server

### Issue: "Permission denied" in Firestore
**Solution**: Verify security rules are published correctly

### Issue: "Can't upload images"
**Solution**: Check Storage rules are set and published

### Issue: "Can't see Super Admin panel"
**Solution**: Verify the `role` field in Firestore is exactly `super_admin`

## Next Steps

1. **Customize Themes**: Edit `src/constants/themes.js`
2. **Add More Features**: Check `FIREBASE_STRUCTURE.md` for data structure
3. **Deploy**: Use Firebase Hosting or Vercel
4. **Custom Domain**: Configure in Firebase Hosting settings

## Production Deployment

### Build for production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

## Support

- Check `README.md` for detailed documentation
- Review `FIREBASE_STRUCTURE.md` for database schema
- Open issues on GitHub for bugs

## Security Checklist

- [ ] Changed default super admin password
- [ ] Updated Firebase security rules
- [ ] Enabled Firebase App Check (recommended)
- [ ] Set up billing alerts
- [ ] Configured backup strategy
- [ ] Added rate limiting (if needed)

Happy building! 🚀
