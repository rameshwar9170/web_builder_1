import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiCheck, FiX, FiClock, FiDollarSign, FiPackage, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const OnlineOrdersEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState({
    enabled: true,
    settings: {
      allowOrders: true,
      minOrderAmount: 10,
      deliveryFee: 5,
      estimatedDeliveryTime: '30-45 minutes',
      acceptingOrders: true,
      paymentMethods: ['Cash on Delivery', 'Card', 'Online Payment'],
      enableTableSelection: true,
      enableDelivery: true,
      enablePickup: true
    },
    orders: [],
    statistics: {
      total: 0,
      pending: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
      todayOrders: 0,
      todayRevenue: 0
    }
  });

  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (card.onlineOrders) {
      setFormData(card.onlineOrders);
    }
  }, [card]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('onlineOrders', formData);
    toast.success('Online Orders settings saved!');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = formData.orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    );

    const stats = calculateStatistics(updatedOrders);

    const updatedData = {
      ...formData,
      orders: updatedOrders,
      statistics: stats
    };

    setFormData(updatedData);

    onSave('onlineOrders', updatedData);

    toast.success(`Order #${orderId.slice(0, 8)} status updated to ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    const updatedOrders = formData.orders.filter(order => order.id !== orderId);
    const stats = calculateStatistics(updatedOrders);

    const updatedData = {
      ...formData,
      orders: updatedOrders,
      statistics: stats
    };

    setFormData(updatedData);

    onSave('onlineOrders', updatedData);

    toast.success('Order deleted');
  };

  const calculateStatistics = (orders) => {
    const today = new Date().toDateString();
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      todayOrders: orders.filter(o => new Date(o.createdAt).toDateString() === today).length,
      todayRevenue: orders
        .filter(o => new Date(o.createdAt).toDateString() === today && o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      preparing: 'bg-blue-100 text-blue-800 border-blue-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      delivered: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock className="w-4 h-4" />,
      preparing: <FiPackage className="w-4 h-4" />,
      ready: <FiCheck className="w-4 h-4" />,
      delivered: <FiTruck className="w-4 h-4" />,
      cancelled: <FiX className="w-4 h-4" />
    };
    return icons[status] || <FiAlertCircle className="w-4 h-4" />;
  };

  const filteredOrders = filterStatus === 'all' 
    ? formData.orders 
    : formData.orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Online Orders Management</h2>
          <p className="text-gray-600">Manage food orders and delivery</p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.enabled !== false}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-5 h-5"
          />
          <span className="font-medium">Enable Online Orders</span>
        </label>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Today's Orders</p>
              <p className="text-2xl font-bold text-blue-900">{formData.statistics.todayOrders}</p>
            </div>
            <FiShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-900">${formData.statistics.todayRevenue.toFixed(2)}</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{formData.statistics.pending}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-purple-900">{formData.statistics.total}</p>
            </div>
            <FiPackage className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'orders' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders ({formData.orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'settings' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({formData.orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Pending ({formData.statistics.pending})
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === 'preparing' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Preparing ({formData.statistics.preparing})
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === 'ready' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Ready ({formData.statistics.ready})
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No orders yet</p>
              <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Customer:</span> {order.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {order.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {order.orderType}
                      </div>
                      {order.tableNumber && (
                        <div>
                          <span className="font-medium">Table:</span> #{order.tableNumber}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="col-span-2">
                          <span className="font-medium">Address:</span> {order.deliveryAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3">
                    <p className="font-medium text-sm mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.specialInstructions && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm"><span className="font-medium">Note:</span> {order.specialInstructions}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          Accept & Prepare
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                      >
                        Delete Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold mb-4">Order Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount ($)
                </label>
                <input
                  type="number"
                  value={formData.settings.minOrderAmount}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, minOrderAmount: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  value={formData.settings.deliveryFee}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, deliveryFee: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.settings.estimatedDeliveryTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, estimatedDeliveryTime: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., 30-45 minutes"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.settings.acceptingOrders}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, acceptingOrders: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="font-medium">Currently Accepting Orders</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.settings.enableTableSelection}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enableTableSelection: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="font-medium">Enable Table Selection (Dine-in)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.settings.enableDelivery}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enableDelivery: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="font-medium">Enable Delivery Orders</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.settings.enablePickup}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enablePickup: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="font-medium">Enable Pickup Orders</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
};

export default OnlineOrdersEditor;
