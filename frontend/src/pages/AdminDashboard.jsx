import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('doctors')
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [verifiedDoctors, setVerifiedDoctors] = useState([])
  const [medicines, setMedicines] = useState([])
  const [appointments, setAppointments] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMedicineForm, setShowMedicineForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(!adminToken)
  const [pendingDeliveryPartners, setPendingDeliveryPartners] = useState([])
  const [verifiedDeliveryPartners, setVerifiedDeliveryPartners] = useState([])
  const [availablePartners, setAvailablePartners] = useState([])

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [medicineFormData, setMedicineFormData] = useState({
    name: '',
    category: '',
    type: '',
    price: '',
    description: '',
    stock: '',
    dosage: '',
    manufacturer: ''
  })

  // Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setAdminToken(data.token)
        setShowLoginForm(false)
        setLoginData({ email: '', password: '' })
        fetchAllData(data.token)
      }
    } catch (err) {
      console.log('Error logging in:', err)
    }
  }

  useEffect(() => {
    if (adminToken) {
      fetchAllData(adminToken)
    }
  }, [adminToken])

  const fetchAllData = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      
      const [pendingRes, verifiedRes, medicinesRes, appointmentsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/doctors/pending`, { headers }),
        fetch(`${API_URL}/api/admin/doctors/verified`, { headers }),
        fetch(`${API_URL}/api/admin/medicines`, { headers }),
        fetch(`${API_URL}/api/admin/appointments`, { headers }),
        fetch(`${API_URL}/api/admin/orders`, { headers })
      ])

      if (pendingRes.ok) setPendingDoctors(await pendingRes.json())
      if (verifiedRes.ok) setVerifiedDoctors(await verifiedRes.json())
      if (medicinesRes.ok) setMedicines(await medicinesRes.json())
      if (appointmentsRes.ok) setAppointments(await appointmentsRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
      
      // Fetch delivery partners
      fetchDeliveryPartners(token)
    } catch (err) {
      console.log('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeliveryPartners = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const response = await fetch(`${API_URL}/api/admin/delivery-partners`, { headers })
      if (response.ok) {
        const data = await response.json()
        setPendingDeliveryPartners(data.filter(p => !p.isVerified))
        setVerifiedDeliveryPartners(data.filter(p => p.isVerified))
        setAvailablePartners(data.filter(p => p.isVerified && p.isAvailable))
      }
    } catch (err) {
      console.log('Error fetching delivery partners:', err)
    }
  }

  const handleVerifyDeliveryPartner = async (partnerId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/delivery-partners/${partnerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isVerified: true })
      })

      if (response.ok) {
        alert('Delivery partner verified successfully!')
        fetchDeliveryPartners(adminToken)
      }
    } catch (err) {
      console.log('Error verifying delivery partner:', err)
    }
  }

  const handleRejectDeliveryPartner = async (partnerId) => {
    if (window.confirm('Are you sure you want to reject this delivery partner?')) {
      try {
        await fetch(`${API_URL}/api/admin/delivery-partners/${partnerId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        fetchDeliveryPartners(adminToken)
      } catch (err) {
        console.log('Error rejecting delivery partner:', err)
      }
    }
  }

  const handleAssignDelivery = async (orderId, partnerId) => {
    try {
      const response = await fetch(`${API_URL}/api/payment/${orderId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ deliveryPartnerId: partnerId })
      })

      if (response.ok) {
        alert('Delivery partner assigned successfully!')
        fetchAllData(adminToken)
      }
    } catch (err) {
      console.log('Error assigning delivery:', err)
    }
  }

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ))
      }
    } catch (err) {
      console.log('Error updating order status:', err)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        setOrders(orders.filter(o => o._id !== orderId))
      } catch (err) {
        console.log('Error deleting order:', err)
      }
    }
  }

  const handleVerifyDoctor = async (doctorId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })

      if (response.ok) {
        const verified = pendingDoctors.find(d => d._id === doctorId)
        setPendingDoctors(pendingDoctors.filter(d => d._id !== doctorId))
        setVerifiedDoctors([...verifiedDoctors, verified])
      }
    } catch (err) {
      console.log('Error verifying doctor:', err)
    }
  }

  const handleRemoveDoctor = async (doctorId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/api/admin/doctors/${doctorId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        setPendingDoctors(pendingDoctors.filter(d => d._id !== doctorId))
        setVerifiedDoctors(verifiedDoctors.filter(d => d._id !== doctorId))
      } catch (err) {
        console.log('Error removing doctor:', err)
      }
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/admin/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(medicineFormData)
      })

      if (response.ok) {
        const newMedicine = await response.json()
        setMedicines([...medicines, newMedicine.medicine])
        setMedicineFormData({ name: '', category: '', type: '', price: '', description: '', stock: '', dosage: '', manufacturer: '' })
        setShowMedicineForm(false)
      }
    } catch (err) {
      console.log('Error adding medicine:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setShowLoginForm(true)
  }

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="goswamigaurav2005@gmail.com"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-20 pt-40">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b bg-white rounded-lg overflow-x-auto">
          {['doctors', 'delivery', 'medicines', 'appointments', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'delivery' ? 'Delivery Partners' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            {/* Pending Doctors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Doctors ({pendingDoctors.length})</h2>
              {pendingDoctors.length === 0 ? (
                <p className="text-gray-600">No pending doctors</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingDoctors.map(doctor => (
                    <div key={doctor._id} className="border rounded-lg p-4">
                      <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.name}</h3>
                      <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                      <p className="text-gray-600 text-sm">Email: {doctor.email}</p>
                      <p className="text-gray-600 text-sm">Registration: {doctor.registrationNumber}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleVerifyDoctor(doctor._id)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleRemoveDoctor(doctor._id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Doctors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verified Doctors ({verifiedDoctors.length})</h2>
              {verifiedDoctors.length === 0 ? (
                <p className="text-gray-600">No verified doctors</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Name</th>
                        <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                        <th className="px-4 py-2 text-left font-semibold">Email</th>
                        <th className="px-4 py-2 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiedDoctors.map(doctor => (
                        <tr key={doctor._id} className="border-b">
                          <td className="px-4 py-3">Dr. {doctor.name}</td>
                          <td className="px-4 py-3">{doctor.specialty}</td>
                          <td className="px-4 py-3">{doctor.email}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemoveDoctor(doctor._id)}
                              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Medicines ({medicines.length})</h2>
              <button
                onClick={() => setShowMedicineForm(!showMedicineForm)}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
              >
                {showMedicineForm ? 'Cancel' : 'Add Medicine'}
              </button>
            </div>

            {showMedicineForm && (
              <form onSubmit={handleAddMedicine} className="bg-gray-50 p-6 rounded-lg mb-6 grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" required onChange={(e) => setMedicineFormData({...medicineFormData, name: e.target.value})} className="px-3 py-2 border rounded" />
                <input type="text" placeholder="Category" required onChange={(e) => setMedicineFormData({...medicineFormData, category: e.target.value})} className="px-3 py-2 border rounded" />
                <input type="text" placeholder="Type" required onChange={(e) => setMedicineFormData({...medicineFormData, type: e.target.value})} className="px-3 py-2 border rounded" />
                <input type="number" placeholder="Price" required onChange={(e) => setMedicineFormData({...medicineFormData, price: e.target.value})} className="px-3 py-2 border rounded" />
                <textarea placeholder="Description" required onChange={(e) => setMedicineFormData({...medicineFormData, description: e.target.value})} className="col-span-2 px-3 py-2 border rounded"></textarea>
                <input type="number" placeholder="Stock" required onChange={(e) => setMedicineFormData({...medicineFormData, stock: e.target.value})} className="px-3 py-2 border rounded" />
                <input type="text" placeholder="Dosage" onChange={(e) => setMedicineFormData({...medicineFormData, dosage: e.target.value})} className="px-3 py-2 border rounded" />
                <input type="text" placeholder="Manufacturer" onChange={(e) => setMedicineFormData({...medicineFormData, manufacturer: e.target.value})} className="px-3 py-2 border rounded" />
                <button type="submit" className="col-span-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2 rounded">Add Medicine</button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med._id} className="border-b">
                      <td className="px-4 py-3">{med.name}</td>
                      <td className="px-4 py-3">{med.category}</td>
                      <td className="px-4 py-3">₹{med.price}</td>
                      <td className="px-4 py-3">{med.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Appointments ({appointments.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Patient</th>
                    <th className="px-4 py-2 text-left">Doctor</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt._id} className="border-b">
                      <td className="px-4 py-3">{apt.patientName}</td>
                      <td className="px-4 py-3">Dr. {apt.doctorId?.name}</td>
                      <td className="px-4 py-3">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${apt.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'}`}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Medicines</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Delivery Partner</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b">
                        <td className="px-4 py-3">{order.customerName}</td>
                        <td className="px-4 py-3 text-xs">{order.customerEmail}</td>
                        <td className="px-4 py-3">{order.customerPhone}</td>
                        <td className="px-4 py-3 text-xs">
                          {order.medicines && order.medicines.length > 0 ? (
                            <div className="bg-gray-100 p-1 rounded max-w-xs">
                              {order.medicines.map((m, i) => (
                                <div key={i}>{m.medicineName} x{m.quantity}</div>
                              ))}
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-semibold">₹{order.totalAmount}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          {order.deliveryPartnerId ? (
                            <span className="text-green-600 text-xs">✓ Assigned</span>
                          ) : (
                            <select
                              onChange={(e) => handleAssignDelivery(order._id, e.target.value)}
                              className="px-2 py-1 rounded text-xs border"
                              defaultValue=""
                            >
                              <option value="">Assign Partner</option>
                              {availablePartners.map(partner => (
                                <option key={partner._id} value={partner._id}>
                                  {partner.name} ({partner.vehicleType})
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Delivery Partners Tab */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            {/* Pending Delivery Partners */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pending Verification ({pendingDeliveryPartners.length})
              </h2>
              {pendingDeliveryPartners.length === 0 ? (
                <p className="text-gray-600">No pending delivery partners</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingDeliveryPartners.map(partner => (
                    <div key={partner._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                          <p className="text-gray-600 text-sm">{partner.email}</p>
                          <p className="text-gray-600 text-sm">{partner.phone}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      </div>
                      <div className="space-y-1 text-sm mb-4">
                        <p><strong>Vehicle:</strong> {partner.vehicleType} - {partner.vehicleNumber}</p>
                        <p><strong>License:</strong> {partner.licenseNumber}</p>
                        <p><strong>Aadhar:</strong> {partner.aadharNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyDeliveryPartner(partner._id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleRejectDeliveryPartner(partner._id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Delivery Partners */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Active Delivery Partners ({verifiedDeliveryPartners.length})
              </h2>
              {verifiedDeliveryPartners.length === 0 ? (
                <p className="text-gray-600">No verified delivery partners yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Vehicle</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Deliveries</th>
                        <th className="px-4 py-2 text-left">Rating</th>
                        <th className="px-4 py-2 text-left">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiedDeliveryPartners.map(partner => (
                        <tr key={partner._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-gray-900">{partner.name}</p>
                              <p className="text-xs text-gray-500">{partner.licenseNumber}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p>{partner.phone}</p>
                            <p className="text-xs text-gray-500">{partner.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold">{partner.vehicleType}</p>
                            <p className="text-xs text-gray-500">{partner.vehicleNumber}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              partner.isAvailable 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {partner.isAvailable ? '🟢 Available' : '⚫ Busy'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">
                            {partner.totalDeliveries || 0}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-yellow-500">★ {partner.rating ? partner.rating.toFixed(1) : 'N/A'}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {new Date(partner.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Analytics Card */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Delivery Analytics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{verifiedDeliveryPartners.length}</p>
                  <p className="text-sm opacity-90">Total Partners</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{availablePartners.length}</p>
                  <p className="text-sm opacity-90">Available Now</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {verifiedDeliveryPartners.reduce((sum, p) => sum + (p.totalDeliveries || 0), 0)}
                  </p>
                  <p className="text-sm opacity-90">Total Deliveries</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

