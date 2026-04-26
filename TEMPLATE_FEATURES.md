# Template Features System

## Overview
The Digital Visiting Cards project now includes an advanced template customization system that allows both Super Admins and Admins to have full control over card features.

## How It Works

### 1. Super Admin - Template Management

Super Admins can create and manage templates with customizable features:

**Access:** `/super-admin/templates`

**Capabilities:**
- Create new templates from scratch
- Edit existing templates
- Define template features (e.g., "Online Booking", "Service Menu", "Photo Gallery")
- Customize theme colors, fonts, and layouts
- Set template category and description
- Activate/deactivate templates

**Template Editor Features:**
- Basic Information (name, category, description, icon)
- Theme & Design (colors, fonts, layout styles)
- Feature Management (add/remove features dynamically)
- Display order control

### 2. Admin - Card Creation with Feature Selection

Admins create cards in a 3-step process:

**Step 1: Choose Template**
- Browse available templates by category
- View template preview and features
- Select the template that best fits their business

**Step 2: Select Features**
- View all features available in the selected template
- Enable/disable specific features
- All features are enabled by default
- Visual checkbox interface for easy selection

**Step 3: Basic Information**
- Enter business details (name, title, company, etc.)
- Set unique URL slug with real-time availability checking
- Auto-suggestions for taken slugs

### 3. Admin - Feature Management in Edit Mode

After creating a card, admins can manage features:

**Access:** `/admin/cards/edit/:cardId`

**Feature Manager:**
- Click "Manage Features" button in the top toolbar
- Toggle features on/off
- Changes are saved immediately
- Disabled features hide related sections

**Dynamic Tab Visibility:**
- Only tabs for enabled features are shown
- Basic Info, About, and Theme tabs are always visible
- Other tabs (Services, Products, Team, Gallery) appear based on enabled features

## Feature to Section Mapping

The system automatically maps features to card sections:

| Feature | Section |
|---------|---------|
| Service Menu, Online Booking, Appointment Booking | Services |
| Product Catalog, Digital Menu, Room Showcase | Products |
| Team Profiles, Doctor Profiles, Trainer Profiles | Team |
| Photo Gallery, Before/After Gallery, Portfolio Gallery | Gallery |
| Store Location, Achievements, Experience Timeline | About |

## Data Structure

### Template Object
```javascript
{
  id: 'template-id',
  name: 'Template Name',
  category: 'Business Category',
  description: 'Template description',
  icon: '💼',
  order: 1,
  isActive: true,
  theme: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0369a1',
    accentColor: '#075985',
    fontFamily: 'Inter',
    layout: 'modern',
    headerStyle: 'clean',
    cardStyle: 'rounded',
    buttonStyle: 'rounded'
  },
  features: [
    'Online Booking',
    'Service Menu',
    'Team Profiles',
    'Photo Gallery'
  ],
  sections: {
    hero: { enabled: true, style: 'modern' },
    about: { enabled: true, style: 'two-column' },
    // ... other sections
  }
}
```

### Card Object (with features)
```javascript
{
  id: 'card-id',
  adminId: 'admin-uid',
  templateId: 'template-id',
  enabledFeatures: [
    'Online Booking',
    'Service Menu',
    'Team Profiles'
  ],
  // ... other card data
}
```

## User Flow Examples

### Example 1: Salon Owner
1. Super Admin creates "Salon & Spa" template with features:
   - Online Booking
   - Service Menu
   - Before/After Gallery
   - Team Profiles

2. Salon owner (Admin) selects "Salon & Spa" template

3. Admin enables only needed features:
   - ✅ Service Menu
   - ✅ Team Profiles
   - ✅ Before/After Gallery
   - ❌ Online Booking (not needed yet)

4. Card shows only Services, Team, and Gallery tabs

5. Later, admin can enable "Online Booking" from Feature Manager

### Example 2: Restaurant Owner
1. Super Admin creates "Restaurant & Cafe" template with features:
   - Digital Menu
   - Food Gallery
   - Online Orders
   - Table Booking

2. Restaurant owner selects template and enables:
   - ✅ Digital Menu
   - ✅ Food Gallery
   - ❌ Online Orders (coming soon)
   - ❌ Table Booking (not available)

3. Card shows only Products and Gallery tabs

## Benefits

### For Super Admins
- Create industry-specific templates
- Define relevant features for each business type
- Full control over template design and capabilities
- Easy template management and updates

### For Admins
- Choose templates that match their business
- Enable only needed features
- Cleaner, focused interface
- Flexibility to add features later
- No clutter from unused sections

### For End Users
- Professional, industry-specific designs
- Relevant features for each business type
- Better user experience
- Faster loading (only enabled features)

## Technical Implementation

### Files Modified
1. `src/pages/admin/CreateCard.js` - Added 3-step creation with feature selection
2. `src/pages/admin/EditCard.js` - Added feature manager and dynamic tab filtering
3. `src/services/cardService.js` - Added enabledFeatures field and update methods
4. `src/pages/superadmin/TemplateEditor.js` - Full template editor with feature management
5. `src/data/defaultTemplates.js` - 10 pre-built templates with features

### Key Features
- Real-time feature toggling
- Persistent feature state in Firestore
- Dynamic UI based on enabled features
- Feature-to-section mapping system
- Visual feedback for enabled/disabled features

## Future Enhancements

Potential improvements:
1. Feature categories (e.g., "Booking Features", "Display Features")
2. Feature dependencies (e.g., "Online Orders" requires "Product Catalog")
3. Feature usage analytics
4. Template preview with feature toggles
5. Bulk feature enable/disable
6. Feature recommendations based on business type
7. Custom feature creation by Super Admin
8. Feature pricing tiers (premium features)

## Testing Checklist

- [ ] Super Admin can create templates with features
- [ ] Super Admin can edit template features
- [ ] Admin sees all active templates
- [ ] Admin can select template during card creation
- [ ] Admin sees template features in Step 2
- [ ] Admin can toggle features on/off
- [ ] Card creation saves enabled features
- [ ] Edit page shows only enabled feature tabs
- [ ] Feature Manager works in edit mode
- [ ] Toggling features updates tabs immediately
- [ ] Basic, About, Theme tabs always visible
- [ ] Feature changes persist after page refresh
- [ ] Multiple cards can have different feature sets
- [ ] Template updates don't affect existing cards

## Support

For issues or questions about the template features system, contact the development team.
