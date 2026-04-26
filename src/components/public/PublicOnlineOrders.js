import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiX } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const PublicOnlineOrders = ({ card }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    tableNumber: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const order = {
        id: uuidv4(),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        tableNumber: customerInfo.tableNumber,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          category: item.category
        })),
        totalAmount: calculateTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get current orders
      const currentOrders = card.onlineOrders?.orders || [];
      const currentStats = card.onlineOrders?.statistics || {};

      // Update statistics
      const today = new Date().toDateString();
      const todayOrders = currentOrders.filter(o => new Date(o.createdAt).toDateString() === today);
      
      const updatedStats = {
        total: currentOrders.length + 1,
        pending: (currentStats.pending || 0) + 1,
        preparing: currentStats.preparing || 0,
        ready: currentStats.ready || 0,
        delivered: currentStats.delivered || 0,
        cancelled: currentStats.cancelled || 0,
        todayOrders: todayOrders.length + 1,
        todayRevenue: todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + calculateTotal()
      };

      // Update card with new order
      await cardService.updateCard(card.id, {
        onlineOrders: {
          ...card.onlineOrders,
          orders: [...currentOrders, order],
          statistics: updatedStats
        }
      });

      toast.success('Order placed successfully! 🎉');
      
      // Reset form
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      setCustomerInfo({
        name: '',
        phone: '',
        tableNumber: ''
      });

      // Show order confirmation
      alert(`Order #${order.id.slice(0, 8)} placed successfully!\n\nTable: ${order.tableNumber}\nTotal: $${calculateTotal().toFixed(2)}\n\nYour order will be prepared shortly. Thank you!`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!card.onlineOrders?.enabled) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Order Online</h2>
        <p className="text-gray-600 mb-6">Browse our menu and place your order for dine-in</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={scrollToMenu}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-medium"
          >
            View Menu
          </button>
          
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 flex items-center gap-2 font-medium"
          >
            <FiShoppingCart className="w-5 h-5" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      scrollToMenu();
                    }}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">${item.price} each</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-bold text-lg">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Your Order</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Table Number *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-bold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm mb-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicOnlineOrders;
