export default function HelpDesk() {
  return (
    <section className="px-4 md:px-16 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Reach our <span className="text-cyan-500">Help Desk</span> for support
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-end md:items-center mb-12">
          <input
            type="text"
            placeholder="Enter your name"
            className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition"
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition"
          />
          <button className="bg-cyan-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-500 transition">
            Contact us →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600">support@medlife.com</p>
          </div>

          <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600">+1 (800) 123-4567</p>
          </div>

          <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600">Available 24/7 on our website</p>
          </div>
        </div>
      </div>
    </section>
  );
}
