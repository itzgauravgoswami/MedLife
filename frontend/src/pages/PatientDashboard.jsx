import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [appointmentsRes, reportsRes, prescriptionsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/user/appointments`, { headers }),
        fetch(`${API_URL}/api/user/reports`, { headers }),
        fetch(`${API_URL}/api/user/prescriptions`, { headers }),
        fetch(`${API_URL}/api/user/orders`, { headers })
      ]);

      if (appointmentsRes.ok) setAppointments(await appointmentsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (prescriptionsRes.ok) setPrescriptions(await prescriptionsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'appointments', label: '📅 Appointments', icon: '📅' },
    { id: 'reports', label: '📄 Medical Reports', icon: '📄' },
    { id: 'prescriptions', label: '💊 Prescriptions', icon: '💊' },
    { id: 'orders', label: '📦 Orders', icon: '📦' },
    { id: 'profile', label: '👤 Profile', icon: '👤' }
  ];

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
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-blue-100">Manage your health and appointments</p>
              </div>
              <button
                onClick={logout}
                className="bg-white text-cyan-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
                      : 'text-gray-600 hover:text-cyan-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">📅</div>
                    <div className="text-2xl font-bold mb-1">{appointments.length}</div>
                    <div className="text-blue-100">Total Appointments</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-2xl font-bold mb-1">{reports.length}</div>
                    <div className="text-green-100">Medical Reports</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">💊</div>
                    <div className="text-2xl font-bold mb-1">{prescriptions.length}</div>
                    <div className="text-purple-100">Prescriptions</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">📦</div>
                    <div className="text-2xl font-bold mb-1">{orders.length}</div>
                    <div className="text-orange-100">Orders</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/book-appointment')}
                        className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition"
                      >
                        📅 Book Appointment
                      </button>
                      <button
                        onClick={() => navigate('/upload-report')}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                      >
                        📄 Upload Report
                      </button>
                      <button
                        onClick={() => navigate('/medicines')}
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                      >
                        💊 Buy Medicines
                      </button>
                      <button
                        onClick={() => navigate('/ai-health-coach')}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
                      >
                        🤖 AI Health Coach
                      </button>
                      <button
                        onClick={() => navigate('/emergency')}
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
                      >
                        🚨 Emergency/SOS
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Appointments</h3>
                    {appointments.slice(0, 3).length > 0 ? (
                      <div className="space-y-3">
                        {appointments.slice(0, 3).map((apt) => (
                          <div key={apt._id} className="border-l-4 border-cyan-500 pl-4 py-2">
                            <div className="font-semibold">{apt.doctorId?.name}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(apt.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className={`text-xs font-semibold mt-1 ${
                              apt.status === 'confirmed' ? 'text-green-600' :
                              apt.status === 'pending' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {apt.status.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No appointments yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Appointments</h2>
                  <button
                    onClick={() => navigate('/book-appointment')}
                    className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
                  >
                    + Book New
                  </button>
                </div>

                {appointments.length > 0 ? (
                  <div className="grid gap-4">
                    {appointments.map((apt) => (
                      <div key={apt._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{apt.doctorId?.name}</h3>
                            <p className="text-gray-600 mb-1">{apt.doctorId?.specialty}</p>
                            <p className="text-sm text-gray-500 mb-2">{apt.doctorId?.clinicName}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>📅 {new Date(apt.appointmentDate).toLocaleDateString()}</span>
                              <span>🕒 {apt.timeSlot || 'Not specified'}</span>
                              <span>💬 {apt.consultationType}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Symptoms:</strong> {apt.symptoms}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {apt.status.toUpperCase()}
                            </span>
                            {apt.status === 'confirmed' && apt.consultationType === 'video' && (
                              <button
                                onClick={() => navigate(`/telemedicine/${apt._id}`)}
                                className="mt-3 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition text-sm"
                              >
                                🎥 Join Call
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No appointments found</p>
                    <button
                      onClick={() => navigate('/book-appointment')}
                      className="mt-4 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
                    >
                      Book Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Medical Reports</h2>
                  <button
                    onClick={() => navigate('/upload-report')}
                    className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
                  >
                    + Upload Report
                  </button>
                </div>

                {reports.length > 0 ? (
                  <div className="grid gap-4">
                    {reports.map((report) => (
                      <div key={report._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                            <p className="text-gray-600 mb-2">{report.description}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>📁 {report.reportType}</span>
                              <span>📅 {new Date(report.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(report.fileUrl, '_blank')}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No reports uploaded yet</p>
                    <button
                      onClick={() => navigate('/upload-report')}
                      className="mt-4 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
                    >
                      Upload Your First Report
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Prescriptions</h2>
                {prescriptions.length > 0 ? (
                  <div className="grid gap-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription._id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">Dr. {prescription.doctorId?.name}</h3>
                            <p className="text-sm text-gray-600">{new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {prescription.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="font-semibold mb-2">Diagnosis: {prescription.diagnosis}</p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold mb-2">Medicines:</p>
                            {prescription.medicines.map((med, idx) => (
                              <div key={idx} className="mb-2 pl-4 border-l-2 border-cyan-500">
                                <p className="font-medium">{med.medicineName}</p>
                                <p className="text-sm text-gray-600">
                                  {med.dosage} - {med.frequency} for {med.duration}
                                </p>
                                {med.instructions && (
                                  <p className="text-xs text-gray-500">{med.instructions}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        {!prescription.addedToCart && (
                          <button
                            onClick={() => navigate('/medicines')}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            🛒 Buy Medicines
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No prescriptions yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                {orders.length > 0 ? (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">Order #{order._id.slice(-6)}</h3>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.toUpperCase().replace('_', ' ')}
                            </span>
                            <p className="text-lg font-bold mt-2">₹{order.totalAmount}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.medicines.map((med, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{med.medicineName} x {med.quantity}</span>
                              <span>₹{med.total}</span>
                            </div>
                          ))}
                        </div>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => navigate(`/track-order/${order._id}`)}
                            className="mt-4 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition w-full"
                          >
                            🗺️ Track Order
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No orders yet</p>
                    <button
                      onClick={() => navigate('/medicines')}
                      className="mt-4 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
                    >
                      Browse Medicines
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <p className="text-lg">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <p className="text-lg">{user?.phone}</p>
                    </div>
                    <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition">
                      Edit Profile
                    </button>
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
