import { useState } from 'react'

export default function Medicines() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const medicines = [
    {
      name: "Aspirin 500mg",
      category: "Pain Relief",
      type: "Tablet",
      price: "$5.99",
      description: "Effective for mild to moderate pain relief and fever reduction.",
      inStock: true
    },
    {
      name: "Ibuprofen 200mg",
      category: "Pain Relief",
      type: "Tablet",
      price: "$4.99",
      description: "Anti-inflammatory pain reliever for muscle aches and arthritis.",
      inStock: true
    },
    {
      name: "Omeprazole 20mg",
      category: "Digestive",
      type: "Capsule",
      price: "$8.99",
      description: "Reduces stomach acid for heartburn and acid reflux relief.",
      inStock: true
    },
    {
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      type: "Tablet",
      price: "$3.99",
      description: "Safe pain reliever and fever reducer for adults and children.",
      inStock: true
    },
    {
      name: "Ranitidine 150mg",
      category: "Digestive",
      type: "Tablet",
      price: "$6.99",
      description: "Treats heartburn and gastric ulcers effectively.",
      inStock: false
    },
    {
      name: "Cetirizine 10mg",
      category: "Allergies",
      type: "Tablet",
      price: "$5.49",
      description: "Non-drowsy antihistamine for allergy relief.",
      inStock: true
    },
    {
      name: "Loratadine 10mg",
      category: "Allergies",
      type: "Tablet",
      price: "$6.49",
      description: "Long-acting antihistamine for seasonal allergies.",
      inStock: true
    },
    {
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      type: "Capsule",
      price: "$7.99",
      description: "Broad-spectrum antibiotic for bacterial infections.",
      inStock: true
    },
    {
      name: "Metformin 500mg",
      category: "Diabetes",
      type: "Tablet",
      price: "$4.49",
      description: "Primary medication for type 2 diabetes management.",
      inStock: true
    },
    {
      name: "Vitamin D3 1000IU",
      category: "Vitamins",
      type: "Capsule",
      price: "$9.99",
      description: "Essential for bone health and immune system support.",
      inStock: true
    },
    {
      name: "Multivitamin Complex",
      category: "Vitamins",
      type: "Tablet",
      price: "$12.99",
      description: "Complete nutritional support with essential vitamins and minerals.",
      inStock: true
    },
    {
      name: "Vitamin C 500mg",
      category: "Vitamins",
      type: "Tablet",
      price: "$6.99",
      description: "Boosts immunity and supports overall health.",
      inStock: true
    }
  ]

  const categories = ['All', 'Pain Relief', 'Digestive', 'Allergies', 'Antibiotics', 'Diabetes', 'Vitamins']

  const filteredMedicines = medicines.filter(medicine => {
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 -ml-36 -mb-36"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold">Pharmacy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Our <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Medicines</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Browse our comprehensive selection of over-the-counter and prescription medications delivered safely to your home.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search medicines by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{medicine.name}</h3>
                      <p className="text-sm text-cyan-500 font-semibold">{medicine.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      medicine.inStock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{medicine.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Type</p>
                      <p className="text-sm font-semibold text-gray-700">{medicine.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <p className="text-2xl font-bold text-cyan-500">{medicine.price}</p>
                    </div>
                  </div>

                  <button
                    disabled={!medicine.inStock}
                    className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 ${
                      medicine.inStock
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {medicine.inStock ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No medicines found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 md:px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose MedLife Pharmacy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Medicines</h3>
              <p className="text-gray-600">All our medicines are verified and sourced from licensed suppliers.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="15" height="7"></rect>
                  <path d="M16 2v11"></path>
                  <path d="M21 15H3"></path>
                  <path d="M4 20h16"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Same-day or next-day delivery available in most areas.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">Your medical information is encrypted and completely confidential.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
