import { useState } from 'react'
import API_URL from '../config/api'

export default function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('medicineCart')
    return saved ? JSON.parse(saved) : []
  })
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    city: '',
    postalCode: ''
  })

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
    } else {
      setCartItems(cartItems.map(item =>
        item._id === medicineId ? { ...item, quantity } : item
      ))
      localStorage.setItem('medicineCart', JSON.stringify(
        cartItems.map(item =>
          item._id === medicineId ? { ...item, quantity } : item
        )
      ))
    }
  }

  const removeFromCart = (medicineId) => {
    const updated = cartItems.filter(item => item._id !== medicineId)
    setCartItems(updated)
    localStorage.setItem('medicineCart', JSON.stringify(updated))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const medicines = cartItems.map(item => ({
        medicineId: item._id,
        quantity: item.quantity
      }))

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          medicines
        })
      })

      if (response.ok) {
        const data = await response.json()
        setOrderPlaced(true)
        setCartItems([])
        localStorage.removeItem('medicineCart')
        setShowOrderForm(false)
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: '',
          city: '',
          postalCode: ''
        })
      } else {
        alert('Error placing order. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold">Shopping Cart</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Cart</span>
          </h1>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {orderPlaced ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h2>
              <p className="text-green-600 mb-6">Your order has been received and is being processed. The admin will confirm your order soon.</p>
              <button
                onClick={() => setOrderPlaced(false)}
                className="bg-green-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add medicines from our pharmacy to get started</p>
              <a
                href="/medicines"
                className="inline-block bg-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-cyan-600 transition"
              >
                Browse Medicines
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items ({cartItems.length})</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.category}</p>
                          <p className="text-cyan-500 font-semibold mt-2">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="px-4 py-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Form */}
                <div>
                  <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name} x {item.quantity}</span>
                          <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                      <span>Total:</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setShowOrderForm(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Form Section - Inline */}
              {showOrderForm && (
                <div className="mt-12 bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Order</h2>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter your city"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter postal code"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Address</label>
                        <textarea
                          name="customerAddress"
                          value={formData.customerAddress}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Enter your delivery address"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                      >
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
