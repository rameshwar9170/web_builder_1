# Online Food Ordering System

## Overview
A complete, fully functional online food ordering system for restaurants and cafes. Customers can browse products, add items to cart, select order type (dine-in/delivery/pickup), and place orders. Admins can manage all orders with real-time status updates.

## Features

### Customer Features (Public)
1. **Product Browsing**
   - View all available food items with images, descriptions, and prices
   - Filter products by category
   - Responsive grid layout

2. **Shopping Cart**
   - Add/remove items
   - Adjust quantities with +/- buttons
   - Real-time price calculation
   - Persistent cart during session
   - Cart badge showing item count

3. **Order Types**
   - **Dine-in**: Select table number
   - **Delivery**: Enter delivery address with delivery fee
   - **Pickup**: No additional charges

4. **Checkout Process**
   - Customer information (name, phone, email)
   - Order type selection
   - Table number (for dine-in)
   - Delivery address (for delivery)
   - Payment method selection
   - Special instructions/notes
   - Order summary with itemized list
   - Total calculation with delivery fees

5. **Order Confirmation**
   - Unique order ID
   - Estimated delivery/preparation time
   - Order details summary

### Admin Features (Dashboard)
1. **Order Management**
   - View all orders in real-time
   - Filter by status (All, Pending, Preparing, Ready, Delivered, Cancelled)
   - Detailed order information:
     - Customer details
     - Order items with quantities
     - Order type and table/address
     - Payment method
     - Special instructions
     - Timestamps

2. **Order Status Workflow**
   - **Pending** → Accept & Prepare or Cancel
   - **Preparing** → Mark as Ready
   - **Ready** → Mark as Delivered
   - **Delivered/Cancelled** → Delete Order

3. **Statistics Dashboard**
   - Today's Orders count
   - Today's Revenue
   - Pending orders count
   - Total orders count
   - Real-time updates

4. **Settings Configuration**
   - Minimum order amount
   - Delivery fee
   - Estimated delivery time
   - Accept/Stop accepting orders toggle
   - Enable/Disable order types:
     - Table selection (dine-in)
     - Delivery orders
     - Pickup orders
   - Payment methods configuration

## Data Structure

### Order Object
```javascript
{
  id: "unique-uuid",
  customerName: "John Doe",
  customerPhone: "+1 234 567 8900",
  customerEmail: "john@example.com",
  orderType: "dine-in" | "delivery" | "pickup",
  tableNumber: "5", // for dine-in
  deliveryAddress: "123 Main St...", // for delivery
  items: [
    {
      id: "product-id",
      name: "Product Name",
      price: 12.99,
      quantity: 2,
      category: "Main Course"
    }
  ],
  subtotal: 25.98,
  deliveryFee: 5.00,
  totalAmount: 30.98,
  paymentMethod: "Cash on Delivery",
  specialInstructions: "Extra spicy",
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled",
  createdAt: "2024-01-31T10:30:00Z",
  updatedAt: "2024-01-31T10:35:00Z"
}
```

### Settings Object
```javascript
{
  allowOrders: true,
  minOrderAmount: 10,
  deliveryFee: 5,
  estimatedDeliveryTime: "30-45 minutes",
  acceptingOrders: true,
  paymentMethods: ["Cash on Delivery", "Card", "Online Payment"],
  enableTableSelection: true,
  enableDelivery: true,
  enablePickup: true
}
```

### Statistics Object
```javascript
{
  total: 150,
  pending: 5,
  preparing: 3,
  ready: 2,
  delivered: 135,
  cancelled: 5,
  todayOrders: 12,
  todayRevenue: 456.78
}
```

## User Flow

### Customer Journey
1. Visit restaurant website
2. Navigate to "Order Online" section
3. Select order type (Dine-in/Delivery/Pickup)
4. Browse products by category
5. Add items to cart
6. Review cart and adjust quantities
7. Proceed to checkout
8. Fill in customer information
9. Enter table number or delivery address
10. Add special instructions (optional)
11. Select payment method
12. Place order
13. Receive order confirmation with ID and estimated time

### Admin Journey
1. Login to admin panel
2. Navigate to "Online Orders" tab
3. View statistics dashboard
4. Filter orders by status
5. Click on order to view details
6. Update order status:
   - Accept pending orders
   - Mark as preparing
   - Mark as ready
   - Mark as delivered
   - Cancel if needed
7. Delete completed/cancelled orders
8. Configure settings as needed
9. Enable/disable order acceptance

## Integration Points

### With Products System
- Reads from `card.products.items` for menu items
- Displays product images, names, descriptions, prices, categories
- Filters products by category

### With Card Service
- Updates `card.onlineOrders` in Firestore
- Saves orders array
- Updates statistics in real-time
- Persists settings

### With Template System
- Automatically enabled for "Restaurant & Cafe" template
- Appears in feature list
- Dynamic tab in EditCard
- Public section in ViewCard

## Files Created/Modified

### New Files
1. `src/components/editors/OnlineOrdersEditor.js` - Admin order management
2. `src/components/public/PublicOnlineOrders.js` - Customer ordering interface
3. `ONLINE_ORDERS_SYSTEM.md` - This documentation

### Modified Files
1. `src/constants/featureConfigs.js` - Added Online Orders configuration
2. `src/pages/admin/EditCard.js` - Added OnlineOrdersEditor import and rendering
3. `src/pages/public/ViewCard.js` - Added PublicOnlineOrders import and section

## UI/UX Features

### Admin Interface
- Color-coded status badges (Yellow=Pending, Blue=Preparing, Green=Ready, Gray=Delivered, Red=Cancelled)
- Status icons for visual clarity
- Statistics cards with icons
- Filter buttons for quick access
- Responsive design
- Action buttons based on current status
- Confirmation dialogs for destructive actions

### Customer Interface
- Shopping cart sidebar
- Product grid with images
- Category filters
- Order type selection buttons
- Quantity controls (+/-)
- Real-time price calculations
- Checkout modal with form validation
- Order summary before submission
- Success confirmation with order details
- Responsive mobile-friendly design

## Business Logic

### Order Validation
- Cart must not be empty
- Total must meet minimum order amount
- Customer name and phone required
- Table number required for dine-in
- Delivery address required for delivery
- Restaurant must be accepting orders

### Price Calculation
- Subtotal = Sum of (item price × quantity)
- Delivery Fee = Applied only for delivery orders
- Total = Subtotal + Delivery Fee

### Statistics Updates
- Automatically calculated on order creation/update
- Today's orders filtered by date
- Today's revenue excludes cancelled orders
- Status counts updated in real-time

## Future Enhancements
- Real-time order notifications (WebSocket/Firebase Realtime)
- Order history for customers
- Repeat previous orders
- Favorite items
- Promo codes and discounts
- Multiple payment gateway integration
- Order tracking with live status
- SMS/Email notifications
- Print order receipts
- Kitchen display system (KDS)
- Delivery driver assignment
- Customer ratings and reviews
- Analytics and reports
- Peak hours analysis
- Popular items tracking

## Testing Checklist
- [ ] Add products to cart
- [ ] Update quantities
- [ ] Remove items from cart
- [ ] Switch order types
- [ ] Filter by category
- [ ] Submit order with all required fields
- [ ] Verify order appears in admin panel
- [ ] Update order status through workflow
- [ ] Check statistics update correctly
- [ ] Test minimum order validation
- [ ] Test with/without delivery fee
- [ ] Configure settings and verify changes
- [ ] Test enable/disable order types
- [ ] Test stop accepting orders
- [ ] Delete completed orders
- [ ] Test responsive design on mobile
- [ ] Test with empty products list
- [ ] Test with multiple simultaneous orders

## Security Considerations
- Input validation on all form fields
- Sanitize special instructions
- Validate order amounts server-side (future)
- Rate limiting for order submissions (future)
- Authentication for admin actions
- Firestore security rules for order data

## Performance Optimizations
- Lazy load product images
- Debounce quantity updates
- Optimize Firestore queries
- Cache product data
- Minimize re-renders with React.memo (future)
- Pagination for large order lists (future)

## Accessibility
- Keyboard navigation support
- ARIA labels for buttons and forms
- Color contrast compliance
- Screen reader friendly
- Focus management in modals
- Error messages for form validation
