import { MdPersonAdd, MdAssignment, MdVerified } from 'react-icons/md';

export default function HowItWorks() {
  return (
    <section className="px-4 md:px-16 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            How our <span className="text-cyan-500">platform</span> works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple, intuitive, and designed for your convenience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Steps */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-cyan-500 text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h3>
                <p className="text-gray-600">Sign up with your basic information and complete your medical profile to get started with our platform.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-cyan-500 text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Service</h3>
                <p className="text-gray-600">Browse through our extensive list of specialists and services available in your area.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-cyan-500 text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Meet Your Doctor</h3>
                <p className="text-gray-600">Connect with qualified healthcare professionals through video, phone, or in-person consultations.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-lg">
              <img 
                src="/p2.png" 
                alt="Healthcare Platform"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
