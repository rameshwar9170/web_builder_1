# Digital Visiting Cards Platform

A professional, advanced digital visiting card platform with multi-role management system built with React, Firebase, and Tailwind CSS.

## Features

### Multi-Role System
- **Super Admin**: Manage admins, view platform analytics
- **Admin**: Create and customize digital visiting cards
- **User**: View published cards

### Card Customization
- Basic business information (name, title, company, contact)
- About section (description, mission, vision)
- Services showcase
- Products catalog
- Team members
- Photo gallery
- Customizable themes (colors, fonts, layouts)
- SEO optimization
- Analytics tracking

### Technical Features
- Firebase Authentication
- Firestore Database with optimized structure
- Firebase Storage for images
- Redux state management
- React Router for navigation
- Responsive design with Tailwind CSS
- Real-time updates
- Image upload and management

## Project Structure

```
src/
├── components/
│   └── editors/          # Card section editors
├── firebase/
│   ├── config.js         # Firebase configuration
│   └── collections.js    # Database schema
├── layouts/              # Layout components
├── pages/
│   ├── admin/           # Admin panel pages
│   ├── auth/            # Authentication pages
│   ├── public/          # Public pages
│   └── superadmin/      # Super admin pages
├── routes/              # Route configuration
├── services/            # Firebase services
│   ├── authService.js
│   ├── cardService.js
│   └── adminService.js
└── store/               # Redux store
    └── slices/
```

## Firebase Data Structure

### Collections

**users**
- uid, email, name, role, isActive
- subscription (plan, dates, limits)
- createdBy, timestamps

**cards**
- id, adminId, slug, status
- basicInfo (contact details, images)
- about, services, products, team, gallery
- theme (colors, fonts, layout)
- seo, analytics, settings

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password

3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

4. Enable Storage:
   - Go to Storage
   - Get started with default settings

5. Get Firebase config:
   - Project Settings > General
   - Scroll to "Your apps" > Web app
   - Copy configuration

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

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

### 5. Storage Security Rules

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

### 6. Create Super Admin

After setup, manually create a super admin user in Firestore:

1. Register a user through the app
2. Go to Firestore Console
3. Find the user document in `users` collection
4. Update the `role` field to `super_admin`

### 7. Run the Application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Super Admin
1. Login with super admin credentials
2. Navigate to "Manage Admins"
3. Create admin accounts with subscription plans

### Admin
1. Login with admin credentials
2. Create new digital visiting cards
3. Customize all sections (basic info, about, services, etc.)
4. Choose themes and colors
5. Publish cards

### Public Access
- Cards are accessible at: `/card/{slug}`
- Published cards are viewable by anyone

## Key Features Implementation

### Optimized Data Structure
- Nested documents for better organization
- Indexed fields for fast queries
- Minimal data duplication
- Efficient analytics tracking

### Performance
- Lazy loading of images
- Optimistic UI updates
- Cached data with Redux
- Efficient Firestore queries

### Security
- Role-based access control
- Secure Firebase rules
- Protected routes
- Input validation

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## Technologies Used

- React 19
- Firebase (Auth, Firestore, Storage)
- Redux Toolkit
- React Router v6
- Tailwind CSS
- React Icons
- React Toastify
- Formik & Yup

## Future Enhancements

- QR code generation
- vCard download
- Custom domains
- Advanced analytics
- Email templates
- Social media integration
- Payment gateway
- Multi-language support

## License

MIT
