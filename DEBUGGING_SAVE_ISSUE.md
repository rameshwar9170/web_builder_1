# Debugging Services Save Issue

## Problem
Services are not persisting to Firebase after clicking "Save Changes". Data appears to save temporarily but disappears after page reload.

## Debugging Steps Added

### 1. ServicesEditor.js
Added console logs to track:
- When handleSubmit is called
- What data is being passed to onSave
- If save completes successfully
- When useEffect triggers to reload data

### 2. EditCard.js (handleSave)
Added console logs to track:
- When handleSave receives the save request
- What section and data are being saved
- If Firestore update succeeds
- If card reload completes

### 3. cardService.js (updateCardSection)
Added console logs to track:
- When updateCardSection is called
- What cardId, section, and data are being updated
- If Firestore updateDoc succeeds or fails

## Expected Console Log Flow

When clicking "Save Changes" in Services tab, you should see:

```
1. ServicesEditor handleSubmit called with formData: {items: Array(X), enabled: true}
2. EditCard handleSave called: {section: "services", data: {...}}
3. cardService.updateCardSection called: {cardId: "...", section: "services", data: {...}}
4. Firestore update successful
5. Save successful
6. Save completed successfully
7. ServicesEditor useEffect triggered, card.services: {...}
8. Updating formData from card.services
```

## Possible Issues to Check

### Issue 1: handleSubmit Not Called
**Symptom**: No console logs appear
**Cause**: Form submit event not firing
**Solution**: Check if button type="submit" and form has onSubmit handler

### Issue 2: onSave Not Defined
**Symptom**: Error "onSave is not a function"
**Cause**: ServicesEditor not receiving onSave prop
**Solution**: Check EditCard passes onSave={handleSave} to editor

### Issue 3: Firestore Update Fails
**Symptom**: "Firestore update failed" error in console
**Possible Causes**:
- Firestore rules blocking write
- Invalid data structure
- Network error
- Card ID not found

### Issue 4: Data Not Reloading
**Symptom**: Save succeeds but useEffect doesn't trigger
**Cause**: useEffect dependencies not detecting change
**Solution**: Check if card.services.items.length actually changes

### Issue 5: useEffect Resetting Data
**Symptom**: Data saves but immediately resets
**Cause**: useEffect running with stale data
**Solution**: Ensure loadCard() completes before useEffect runs

## How to Debug

1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Add a service in Services tab
5. Click "Save Changes"
6. Watch console logs
7. Note which logs appear and any errors
8. Refresh page
9. Check if service persists

## Common Fixes

### Fix 1: Firestore Rules
If you see permission denied errors:
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For testing only!
    }
  }
}
```

### Fix 2: useEffect Dependencies
If data doesn't reload after save:
```javascript
// Use JSON.stringify to detect deep changes
useEffect(() => {
  if (card?.services) {
    setFormData(card.services);
  }
}, [JSON.stringify(card?.services)]);
```

### Fix 3: Await loadCard
If data resets immediately:
```javascript
const handleSave = async (section, data) => {
  try {
    await cardService.updateCardSection(cardId, section, data);
    toast.success('Changes saved');
    await loadCard(); // Make sure this awaits!
  } catch (error) {
    toast.error('Failed to save changes');
  }
};
```

## Testing Checklist

- [ ] Console shows "ServicesEditor handleSubmit called"
- [ ] Console shows "EditCard handleSave called"
- [ ] Console shows "cardService.updateCardSection called"
- [ ] Console shows "Firestore update successful"
- [ ] Console shows "Save successful"
- [ ] Toast message "Changes saved" appears
- [ ] Console shows "ServicesEditor useEffect triggered"
- [ ] Data persists after page refresh
- [ ] No errors in console

## Next Steps

1. Run the app and try to save services
2. Check console logs to identify where the flow breaks
3. Look for any error messages
4. Check Firestore console to see if data is actually being written
5. Verify Firestore rules allow writes
6. Check network tab for failed requests

## Firestore Console Check

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Find your card document by ID
4. Check if `services` field exists
5. Check if `services.items` array has your data
6. Check `updatedAt` timestamp to see if it's recent

## Remove Debugging Logs

Once issue is fixed, remove console.log statements:
```bash
# Search for console.log in these files:
- src/components/editors/ServicesEditor.js
- src/pages/admin/EditCard.js
- src/services/cardService.js
```
