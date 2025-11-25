import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API_URL from '../config/api';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    fetchOrders();
    startLocationTracking();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/delivery/orders/assigned`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          updateLocation(newLocation);
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const updateLocation = async (loc) => {
    try {
      await fetch(`${API_URL}/api/delivery/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(loc)
      });
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/delivery/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          latitude: location.latitude,
          longitude: location.longitude,
          note: `Status updated to ${status}`
        })
      });

      if (response.ok) {
        fetchOrders();
        alert('Order status updated successfully');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">🏍️ Delivery Dashboard</h1>
                <p className="text-blue-100">Welcome, {user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-white text-cyan-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl p-6 text-white">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold mb-1">{orders.length}</div>
                <div className="text-green-100">Assigned Orders</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl p-6 text-white">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-sm font-semibold mb-1">Current Location</div>
                <div className="text-xs text-blue-100">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Assigned Deliveries</h2>
            {orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">Order #{order._id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Customer:</strong> {order.customerName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Phone:</strong> {order.customerPhone}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Address:</strong> {order.customerAddress}, {order.city} - {order.postalCode}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="font-semibold text-sm mb-2">Items:</p>
                          {order.medicines.map((med, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              • {med.medicineName} x {med.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.toUpperCase().replace('_', ' ')}
                        </span>
                        <p className="text-lg font-bold mt-2">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {order.status === 'assigned' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'picked')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                        >
                          ✓ Mark Picked
                        </button>
                      )}
                      {order.status === 'picked' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                          🚚 Out for Delivery
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
                        >
                          ✓ Mark Delivered
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition text-sm"
                      >
                        🗺️ View on Map
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No assigned deliveries</p>
              </div>
            )}

            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Delivery Map</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-96 rounded-xl overflow-hidden">
                    <MapContainer
                      center={[location.latitude || 0, location.longitude || 0]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={[location.latitude || 0, location.longitude || 0]}>
                        <Popup>Your Location</Popup>
                      </Marker>
                      {selectedOrder.deliveryLocation && (
                        <Marker position={[selectedOrder.deliveryLocation.latitude, selectedOrder.deliveryLocation.longitude]}>
                          <Popup>Delivery Location</Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
