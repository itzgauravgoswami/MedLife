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
      
      const [appointmentsRes, blogsRes] = await Promise.all([
        fetch(`${API_URL}/api/doctor/appointments`, { headers }),
        fetch(`${API_URL}/api/doctor/blogs`, { headers })
      ])

      const appointmentsData = await appointmentsRes.json()
      const blogsData = await blogsRes.json()

      setAppointments(appointmentsData)
      setBlogs(blogsData)
    } catch (err) {
      console.log('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
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
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'appointments'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'blogs'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blogs ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition ${
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
