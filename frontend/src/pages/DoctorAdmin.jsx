import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

export default function DoctorAdmin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [blogs, setBlogs] = useState([])
  const [doctorData, setDoctorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: ''
  })
  const [patients, setPatients] = useState([])
  const [medicines, setMedicines] = useState([])
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [prescriptionData, setPrescriptionData] = useState({
    userId: '',
    appointmentId: '',
    diagnosis: '',
    medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    labTests: [],
    followUpDate: ''
  })
  const [prescriptions, setPrescriptions] = useState([])
  const [patientReports, setPatientReports] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')

  const token = localStorage.getItem('doctorToken')

  useEffect(() => {
    if (!token) {
      navigate('/') 
      return
    }
    const stored = localStorage.getItem('doctorData')
    if (stored) {
      setDoctorData(JSON.parse(stored))
    }
    fetchData()
  }, [token, navigate])

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      
      const [appointmentsRes, blogsRes, medicinesRes] = await Promise.all([
        fetch(`${API_URL}/api/doctor/appointments`, { headers }),
        fetch(`${API_URL}/api/doctor/blogs`, { headers }),
        fetch(`${API_URL}/api/medicine`, { headers })
      ])

      const appointmentsData = await appointmentsRes.json()
      const blogsData = await blogsRes.json()
      const medicinesData = await medicinesRes.json()

      setAppointments(appointmentsData)
      setBlogs(blogsData)
      setMedicines(medicinesData.medicines || [])
      
      // Extract unique patients from appointments
      const uniquePatients = appointmentsData.reduce((acc, apt) => {
        if (!acc.find(p => p._id === apt.userId)) {
          acc.push({
            _id: apt.userId,
            name: apt.patientName,
            email: apt.patientEmail
          })
        }
        return acc
      }, [])
      setPatients(uniquePatients)
    } catch (err) {
      console.log('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientReports = async (patientId) => {
    try {
      const response = await fetch(`${API_URL}/api/reports/patient/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setPatientReports(data)
    } catch (err) {
      console.log('Error fetching patient reports:', err)
    }
  }

  const handleCreatePrescription = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/prescription/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prescriptionData)
      })

      if (response.ok) {
        alert('Prescription created successfully!')
        setPrescriptionData({
          userId: '',
          appointmentId: '',
          diagnosis: '',
          medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }],
          labTests: [],
          followUpDate: ''
        })
        setShowPrescriptionForm(false)
      }
    } catch (err) {
      console.log('Error creating prescription:', err)
      alert('Failed to create prescription')
    }
  }

  const addMedicineField = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    })
  }

  const updateMedicineField = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicines]
    updatedMedicines[index][field] = value
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines })
  }

  const removeMedicineField = (index) => {
    const updatedMedicines = prescriptionData.medicines.filter((_, i) => i !== index)
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines })
  }

  const handleAppointmentUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/doctor/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setAppointments(appointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        ))
      }
    } catch (err) {
      console.log('Error updating appointment:', err)
    }
  }

  const handlePostBlog = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/doctor/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogFormData)
      })

      if (response.ok) {
        const newBlog = await response.json()
        setBlogs([...blogs, newBlog.blog])
        setBlogFormData({ title: '', excerpt: '', content: '', category: '' })
        setShowBlogForm(false)
      }
    } catch (err) {
      console.log('Error posting blog:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('doctorToken')
    localStorage.removeItem('doctorData')
    navigate('/')
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              {doctorData && (
                <p className="text-gray-600 mt-2">Welcome, Dr. {doctorData.name}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
              activeTab === 'prescriptions'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('patient-reports')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
              activeTab === 'patient-reports'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Patient Reports
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
              activeTab === 'blogs'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blogs ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Patient Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Phone</th>
                      <th className="px-4 py-2 text-left font-semibold">Date</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{apt.patientName}</td>
                        <td className="px-4 py-3">{apt.patientEmail}</td>
                        <td className="px-4 py-3">{apt.patientPhone}</td>
                        <td className="px-4 py-3">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            onChange={(e) => handleAppointmentUpdate(apt._id, e.target.value)}
                            className="px-2 py-1 rounded border border-gray-300 text-sm"
                            defaultValue={apt.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Blogs</h2>
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
              >
                {showBlogForm ? 'Cancel' : 'Post New Blog'}
              </button>
            </div>

            {showBlogForm && (
              <form onSubmit={handlePostBlog} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Excerpt</label>
                  <input
                    type="text"
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({...blogFormData, excerpt: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({...blogFormData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Content</label>
                  <textarea
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Post Blog
                </button>
              </form>
            )}

            {blogs.length === 0 ? (
              <p className="text-gray-600">No blogs posted yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <div key={blog._id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{blog.excerpt}</p>
                    <p className="text-xs text-gray-500">Category: {blog.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Create Prescription</h2>
              <button
                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
              >
                {showPrescriptionForm ? 'Cancel' : 'New Prescription'}
              </button>
            </div>

            {showPrescriptionForm && (
              <form onSubmit={handleCreatePrescription} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Patient</label>
                    <select
                      value={prescriptionData.userId}
                      onChange={(e) => setPrescriptionData({...prescriptionData, userId: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient._id} value={patient._id}>{patient.name} - {patient.email}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Appointment (Optional)</label>
                    <select
                      value={prescriptionData.appointmentId}
                      onChange={(e) => setPrescriptionData({...prescriptionData, appointmentId: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">Select Appointment</option>
                      {appointments.filter(apt => apt.userId === prescriptionData.userId).map(apt => (
                        <option key={apt._id} value={apt._id}>{new Date(apt.appointmentDate).toLocaleDateString()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Diagnosis</label>
                  <textarea
                    value={prescriptionData.diagnosis}
                    onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-semibold">Medicines</label>
                    <button
                      type="button"
                      onClick={addMedicineField}
                      className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold"
                    >
                      + Add Medicine
                    </button>
                  </div>
                  {prescriptionData.medicines.map((medicine, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border mb-3">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Medicine Name"
                          value={medicine.medicineName}
                          onChange={(e) => updateMedicineField(index, 'medicineName', e.target.value)}
                          className="px-3 py-2 rounded border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg)"
                          value={medicine.dosage}
                          onChange={(e) => updateMedicineField(index, 'dosage', e.target.value)}
                          className="px-3 py-2 rounded border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Frequency (e.g., 2x daily)"
                          value={medicine.frequency}
                          onChange={(e) => updateMedicineField(index, 'frequency', e.target.value)}
                          className="px-3 py-2 rounded border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 7 days)"
                          value={medicine.duration}
                          onChange={(e) => updateMedicineField(index, 'duration', e.target.value)}
                          className="px-3 py-2 rounded border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeMedicineField(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Instructions (e.g., Take after meals)"
                        value={medicine.instructions}
                        onChange={(e) => updateMedicineField(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Lab Tests (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Blood Test, X-Ray, ECG"
                    onChange={(e) => setPrescriptionData({...prescriptionData, labTests: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Follow-up Date</label>
                  <input
                    type="date"
                    value={prescriptionData.followUpDate}
                    onChange={(e) => setPrescriptionData({...prescriptionData, followUpDate: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Create Prescription
                </button>
              </form>
            )}

            <p className="text-gray-600 text-center">Prescription history will appear here</p>
          </div>
        )}

        {/* Patient Reports Tab */}
        {activeTab === 'patient-reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Reports</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value)
                  if (e.target.value) fetchPatientReports(e.target.value)
                }}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">Choose a patient</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>{patient.name} - {patient.email}</option>
                ))}
              </select>
            </div>

            {selectedPatientId && (
              <div>
                {patientReports.length === 0 ? (
                  <p className="text-gray-600 text-center">No reports found for this patient</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientReports.map((report) => (
                      <div key={report._id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">
                            {report.reportType}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-700 font-semibold"
                          >
                            View Report →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && doctorData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-lg font-semibold text-gray-900">{doctorData.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-900">{doctorData.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Specialty</p>
                <p className="text-lg font-semibold text-gray-900">{doctorData.specialty}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-lg font-semibold text-green-600">Verified</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
