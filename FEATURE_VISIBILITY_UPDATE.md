# Feature Visibility System Update

## Problem
When admins removed features during card creation or editing, those features would disappear completely and couldn't be added back. This was frustrating for users who wanted to temporarily hide features.

## Solution
Changed the system from "removing features" to "hiding/showing features" with persistent visibility toggle.

## Key Changes

### 1. Data Structure Update

**Before:**
- Card only stored `enabledFeatures` array
- Removed features were lost forever

**After:**
- Card stores TWO arrays:
  - `templateFeatures`: All available features from the template (never changes)
  - `enabledFeatures`: Currently visible features (can be toggled)

### 2. CreateCard.js Updates

**Changes:**
- Step 2 now shows ALL template features at all times
- Features can be toggled between "Visible" (green) and "Hidden" (gray)
- Added "Enable All" and "Disable All" quick action buttons
- Visual indicators show current state (Visible/Hidden badges)
- All features are saved to `templateFeatures` field
- Only enabled features are saved to `enabledFeatures` field

**User Experience:**
```
Before: Click feature → Feature disappears → Can't get it back
After:  Click feature → Feature turns gray (Hidden) → Click again to show
```

### 3. EditCard.js Updates

**Changes:**
- Feature Manager now displays ALL `templateFeatures`
- Each feature shows current state (Visible/Hidden)
- Added "Enable All" and "Disable All" buttons
- Features can be toggled on/off anytime
- Visual feedback with green (enabled) and gray (disabled) states

**User Experience:**
- Admin can always see all available features
- Can enable/disable features at any time
- No features are permanently lost
- Clear visual indication of feature state

### 4. cardService.js Updates

**Changes:**
- `createCard()` now stores both `templateFeatures` and `enabledFeatures`
- `updateCard()` can update feature visibility
- Added `updateEnabledFeatures()` method for feature-specific updates

### 5. Visual Design

**Color Coding:**
- **Green** = Feature is enabled/visible
  - Green border, green background
  - Green checkmark icon
  - "Visible" badge in green
  
- **Gray** = Feature is disabled/hidden
  - Gray border, gray background
  - Empty checkbox
  - "Hidden" badge in gray

**Interactive Elements:**
- Click any feature card to toggle state
- "Enable All" button - makes all features visible
- "Disable All" button - hides all features
- Smooth transitions and hover effects

## Benefits

### For Admins
1. **No Data Loss**: Features are never permanently removed
2. **Flexibility**: Can enable/disable features anytime
3. **Experimentation**: Try different feature combinations without risk
4. **Quick Actions**: Enable/disable all features with one click
5. **Clear Feedback**: Always know which features are visible/hidden

### For Users
1. **Better UX**: No confusion about missing features
2. **Reversible Actions**: All changes can be undone
3. **Visual Clarity**: Clear indication of feature state
4. **Control**: Full control over card appearance

## Usage Examples

### Example 1: Restaurant Owner
1. Creates card with "Restaurant & Cafe" template
2. Sees 4 features: Digital Menu, Food Gallery, Online Orders, Table Booking
3. Disables "Online Orders" (coming soon) - turns gray
4. Disables "Table Booking" (not available yet) - turns gray
5. Card shows only Digital Menu and Food Gallery tabs
6. Later, clicks "Online Orders" to enable it - turns green
7. Online Orders tab now appears in edit mode

### Example 2: Salon Owner
1. Creates card with all features enabled
2. Realizes they don't need "Online Booking" yet
3. Opens Feature Manager, clicks "Online Booking" - turns gray
4. Booking-related sections are hidden
5. Months later, ready to add booking
6. Opens Feature Manager, clicks "Online Booking" - turns green
7. Booking features are back without recreating anything

### Example 3: Testing Different Layouts
1. Admin wants to see card with minimal features
2. Clicks "Disable All" button
3. Only Basic Info, About, and Theme tabs remain
4. Reviews the minimal design
5. Clicks "Enable All" button
6. All features are back instantly

## Technical Implementation

### File Changes
1. `src/pages/admin/CreateCard.js`
   - Added `templateFeatures` storage
   - Updated UI to show all features
   - Added Enable/Disable All buttons
   - Changed color scheme to green/gray

2. `src/pages/admin/EditCard.js`
   - Updated Feature Manager to use `templateFeatures`
   - Added Enable/Disable All buttons
   - Improved visual feedback
   - Better state management

3. `src/services/cardService.js`
   - Added `templateFeatures` field to card creation
   - Updated data structure
   - Added feature update methods

### Data Flow
```
Template Selection
    ↓
Load template.features → card.templateFeatures (all features)
    ↓
User toggles features → card.enabledFeatures (visible features)
    ↓
Save card with both arrays
    ↓
Edit mode shows all templateFeatures
    ↓
Tabs filtered by enabledFeatures
    ↓
User can toggle anytime
```

## Migration Notes

### Existing Cards
Cards created before this update may not have `templateFeatures` field. The system handles this gracefully:
- Shows message: "No features available for this template"
- Suggests: "This card was created with an older template version"
- Admin can still use the card normally
- To get features, admin would need to recreate the card

### Future Cards
All new cards will have both fields and full feature management capabilities.

## Testing Checklist

- [x] Create new card with template
- [x] All features visible in Step 2
- [x] Toggle features on/off
- [x] Features show Visible/Hidden badges
- [x] Enable All button works
- [x] Disable All button works
- [x] Card saves both templateFeatures and enabledFeatures
- [x] Edit mode shows all templateFeatures
- [x] Feature Manager toggle works
- [x] Tabs update based on enabledFeatures
- [x] Visual feedback is clear
- [x] No features are lost
- [x] Changes persist after refresh

## Summary

The feature visibility system now works like a light switch - you can turn features on or off, but the switch is always there. This gives admins complete control and flexibility without the risk of losing features permanently.

**Key Principle:** Hide, don't delete. Show, don't recreate.
