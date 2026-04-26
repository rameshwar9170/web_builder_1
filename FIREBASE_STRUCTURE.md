# Firebase Firestore Database Structure

## Collections Overview

This document describes the complete database structure for the Digital Visiting Cards platform.

## 1. Users Collection (`users`)

Stores all user accounts including super admins, admins, and regular users.

```javascript
{
  uid: "string",                    // Firebase Auth UID
  email: "string",                  // User email
  name: "string",                   // Full name
  role: "string",                   // 'super_admin' | 'admin' | 'user'
  phone: "string",                  // Optional phone number
  company: "string",                // Optional company name
  isActive: boolean,                // Account status
  createdBy: "string | null",       // UID of creator (for admins)
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Admin-specific fields
  subscription: {
    plan: "string",                 // 'basic' | 'pro' | 'enterprise'
    startDate: timestamp,
    endDate: timestamp | null,
    isActive: boolean
  },
  
  limits: {
    maxCards: number,               // Maximum cards allowed
    maxStorage: number,             // Storage limit in MB
    customDomain: boolean           // Custom domain feature
  }
}
```

### Indexes
- `role` (for filtering by role)
- `email` (for login)
- `isActive` (for filtering active users)

## 2. Cards Collection (`cards`)

Stores all digital visiting cards created by admins.

```javascript
{
  id: "string",                     // Unique card ID
  adminId: "string",                // Creator's UID
  slug: "string",                   // URL-friendly identifier
  status: "string",                 // 'draft' | 'published' | 'archived'
  createdAt: timestamp,
  updatedAt: timestamp,
  publishedAt: timestamp | null,
  
  // Basic Information
  basicInfo: {
    name: "string",
    title: "string",
    company: "string",
    email: "string",
    phone: "string",
    website: "string",
    logo: "string",                 // Storage URL
    profileImage: "string",         // Storage URL
    coverImage: "string"            // Storage URL
  },
  
  // About Section
  about: {
    description: "string",
    mission: "string",
    vision: "string",
    enabled: boolean
  },
  
  // Services Section
  services: {
    items: [
      {
        id: "string",
        title: "string",
        description: "string",
        icon: "string",             // Optional icon URL
        createdAt: "string"
      }
    ],
    enabled: boolean
  },
  
  // Products Section
  products: {
    items: [
      {
        id: "string",
        name: "string",
        description: "string",
        price: number,
        image: "string",            // Storage URL
        category: "string",
        createdAt: "string"
      }
    ],
    enabled: boolean
  },
  
  // Team Section
  team: {
    members: [
      {
        id: "string",
        name: "string",
        position: "string",
        bio: "string",
        photo: "string",            // Storage URL
        email: "string",
        phone: "string",
        socialLinks: {
          linkedin: "string",
          twitter: "string"
        },
        createdAt: "string"
      }
    ],
    enabled: boolean
  },
  
  // Gallery Section
  gallery: {
    images: [
      {
        url: "string",              // Storage URL
        caption: "string",
        order: number
      }
    ],
    enabled: boolean
  },
  
  // Contact Section
  contact: {
    address: "string",
    city: "string",
    state: "string",
    country: "string",
    zipCode: "string",
    socialLinks: {
      facebook: "string",
      twitter: "string",
      linkedin: "string",
      instagram: "string",
      youtube: "string",
      whatsapp: "string"
    },
    enabled: boolean
  },
  
  // Theme & Customization
  theme: {
    themeId: "string",              // 'default' | 'modern' | 'classic' | 'minimal'
    primaryColor: "string",         // Hex color
    secondaryColor: "string",       // Hex color
    fontFamily: "string",           // Font name
    layout: "string",               // Layout type
    customCSS: "string"             // Custom CSS code
  },
  
  // SEO
  seo: {
    title: "string",
    description: "string",
    keywords: ["string"],
    ogImage: "string"               // Storage URL
  },
  
  // Analytics
  analytics: {
    views: number,
    uniqueVisitors: number,
    clicks: number,
    shares: number,
    lastViewed: timestamp
  },
  
  // Settings
  settings: {
    isPublic: boolean,
    allowDownload: boolean,         // Allow vCard download
    showAnalytics: boolean,
    customDomain: "string",
    password: "string"              // Optional password protection
  }
}
```

### Indexes
- `adminId` (for querying admin's cards)
- `slug` (for public access)
- `status` (for filtering)
- `adminId + status` (composite for efficient queries)
- `updatedAt` (for sorting)

## 3. Themes Collection (`themes`) - Optional

Pre-built theme templates that admins can use.

```javascript
{
  id: "string",
  name: "string",
  description: "string",
  preview: "string",                // Preview image URL
  isPremium: boolean,
  config: {
    primaryColor: "string",
    secondaryColor: "string",
    fontFamily: "string",
    layout: "string",
    customCSS: "string"
  },
  createdAt: timestamp
}
```

## 4. Analytics Collection (`analytics`) - Optional

Detailed analytics for cards (can be used for advanced tracking).

```javascript
{
  id: "string",
  cardId: "string",
  date: "string",                   // YYYY-MM-DD
  views: number,
  uniqueVisitors: number,
  clicks: {
    email: number,
    phone: number,
    website: number,
    social: {
      facebook: number,
      twitter: number,
      linkedin: number
    }
  },
  referrers: {
    "domain.com": number
  },
  devices: {
    mobile: number,
    desktop: number,
    tablet: number
  },
  locations: {
    "country": number
  }
}
```

### Indexes
- `cardId + date` (composite for time-series queries)

## 5. Subscriptions Collection (`subscriptions`) - Optional

Track subscription history and payments.

```javascript
{
  id: "string",
  adminId: "string",
  plan: "string",
  status: "string",                 // 'active' | 'expired' | 'cancelled'
  startDate: timestamp,
  endDate: timestamp,
  amount: number,
  currency: "string",
  paymentMethod: "string",
  transactionId: "string",
  createdAt: timestamp
}
```

## Storage Structure

```
/cards
  /{cardId}
    /profile
      - profile_image.jpg
    /logo
      - logo.png
    /gallery
      - image1.jpg
      - image2.jpg
    /team
      - member1.jpg
      - member2.jpg
    /products
      - product1.jpg
      - product2.jpg
```

## Query Patterns

### Get all cards for an admin
```javascript
query(
  collection(db, 'cards'),
  where('adminId', '==', adminId),
  orderBy('updatedAt', 'desc')
)
```

### Get published card by slug
```javascript
query(
  collection(db, 'cards'),
  where('slug', '==', slug),
  where('status', '==', 'published')
)
```

### Get all active admins
```javascript
query(
  collection(db, 'users'),
  where('role', '==', 'admin'),
  where('isActive', '==', true)
)
```

## Performance Optimization

1. **Denormalization**: Store frequently accessed data together
2. **Indexing**: Create composite indexes for common queries
3. **Pagination**: Use `limit()` and `startAfter()` for large datasets
4. **Caching**: Cache frequently accessed cards in Redux
5. **Incremental Updates**: Use `increment()` for analytics counters

## Security Considerations

1. All writes require authentication
2. Users can only modify their own data
3. Super admins have elevated permissions
4. Public cards are read-only
5. Sensitive data (passwords) should be hashed
6. Use Firebase Security Rules to enforce access control

## Backup Strategy

1. Enable Firestore automatic backups
2. Export data regularly using Firebase CLI
3. Store backups in Cloud Storage
4. Test restore procedures periodically
