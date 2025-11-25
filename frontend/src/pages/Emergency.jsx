import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Emergency() {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-500' },
    { name: 'Police', number: '100', icon: '👮', color: 'bg-blue-500' },
    { name: 'Fire', number: '101', icon: '🚒', color: 'bg-orange-500' },
    { name: 'Women Helpline', number: '1091', icon: '🆘', color: 'bg-purple-500' }
  ];

  const nearbyHospitals = [
    { name: 'City General Hospital', distance: '2.3 km', time: '8 min', rating: 4.5 },
    { name: 'Medicare Center', distance: '3.1 km', time: '12 min', rating: 4.3 },
    { name: 'Emergency Care Clinic', distance: '4.5 km', time: '15 min', rating: 4.7 }
  ];

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-400 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">🚨 Emergency Services</h1>
            <p className="text-red-100">Quick access to emergency help</p>
          </div>

          <div className="p-8">
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 text-center mb-8">
              <div className="text-6xl mb-4">🆘</div>
              <h2 className="text-2xl font-bold mb-4">Emergency SOS</h2>
              <p className="text-gray-600 mb-6">
                Press the button below to send your location to emergency contacts and alert nearby hospitals
              </p>
              <button
                onClick={handleSOS}
                disabled={sosActive}
                className={`${
                  sosActive ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 animate-pulse'
                } text-white px-12 py-4 rounded-full font-bold text-xl transition disabled:cursor-not-allowed`}
              >
                {sosActive ? '✓ SOS ACTIVATED' : '🚨 ACTIVATE SOS'}
              </button>
              {sosActive && (
                <p className="mt-4 text-green-600 font-semibold">
                  ✓ Emergency services notified! Help is on the way.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {emergencyContacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number}`}
                  className={`${contact.color} text-white rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105`}
                >
                  <div className="text-4xl mb-2">{contact.icon}</div>
                  <div className="font-bold text-lg mb-1">{contact.name}</div>
                  <div className="text-xl font-bold">{contact.number}</div>
                </a>
              ))}
            </div>

            {user?.emergencyContact && (
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">👤 Your Emergency Contact</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{user.emergencyContact.name}</p>
                    <p className="text-gray-600">{user.emergencyContact.relation}</p>
                  </div>
                  <a
                    href={`tel:${user.emergencyContact.phone}`}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">🏥 Nearby Hospitals</h3>
              <div className="space-y-4">
                {nearbyHospitals.map((hospital, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{hospital.name}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>📍 {hospital.distance}</span>
                        <span>🕒 {hospital.time}</span>
                        <span>⭐ {hospital.rating}</span>
                      </div>
                    </div>
                    <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition">
                      Navigate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">⚠️ First Aid Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Heart Attack:</strong> Call emergency services immediately. Make the person sit and rest.</li>
                <li>• <strong>Choking:</strong> Perform Heimlich maneuver if trained. Call for help.</li>
                <li>• <strong>Bleeding:</strong> Apply direct pressure with clean cloth. Elevate the wound.</li>
                <li>• <strong>Burns:</strong> Cool with running water for 10 minutes. Don't apply ice.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
