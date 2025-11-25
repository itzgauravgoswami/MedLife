import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AIHealthCoach() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('diet');
  const [healthScore, setHealthScore] = useState(78);
  const [metrics, setMetrics] = useState({
    steps: 8500,
    calories: 2100,
    water: 6,
    sleep: 7.5
  });

  const dietPlan = [
    { time: 'Breakfast (8:00 AM)', meal: 'Oatmeal with fruits, nuts, and green tea', calories: 350 },
    { time: 'Mid-Morning (11:00 AM)', meal: 'Fresh fruit smoothie', calories: 200 },
    { time: 'Lunch (1:30 PM)', meal: 'Grilled chicken, brown rice, vegetables', calories: 550 },
    { time: 'Evening Snack (4:30 PM)', meal: 'Mixed nuts and herbal tea', calories: 150 },
    { time: 'Dinner (7:30 PM)', meal: 'Fish curry, quinoa, salad', calories: 500 }
  ];

  const exercisePlan = [
    { exercise: 'Morning Walk', duration: '30 min', calories: 150, icon: '🚶' },
    { exercise: 'Yoga/Stretching', duration: '20 min', calories: 80, icon: '🧘' },
    { exercise: 'Cardio Workout', duration: '25 min', calories: 200, icon: '🏃' },
    { exercise: 'Strength Training', duration: '30 min', calories: 180, icon: '💪' },
    { exercise: 'Evening Walk', duration: '20 min', calories: 100, icon: '🚶' }
  ];

  const recommendations = [
    { title: 'Hydration', message: 'Drink 2 more glasses of water today', priority: 'high' },
    { title: 'Sleep', message: 'Try to sleep 30 minutes earlier tonight', priority: 'medium' },
    { title: 'Activity', message: 'Great job! You exceeded your step goal', priority: 'low' },
    { title: 'Diet', message: 'Consider adding more green vegetables', priority: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">🤖 AI Health Coach</h1>
            <p className="text-blue-100">Your personalized health companion</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">{healthScore}</div>
                <div className="text-green-100">Health Score</div>
                <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: `${healthScore}%` }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl p-6 text-white">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold mb-1">{metrics.calories}</div>
                <div className="text-blue-100">Calories Today</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl p-6 text-white">
                <div className="text-3xl mb-2">👟</div>
                <div className="text-2xl font-bold mb-1">{metrics.steps}</div>
                <div className="text-purple-100">Steps Today</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">💧</div>
                <div className="text-lg font-bold">{metrics.water}/8</div>
                <div className="text-sm text-gray-600">Glasses of Water</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">😴</div>
                <div className="text-lg font-bold">{metrics.sleep}h</div>
                <div className="text-sm text-gray-600">Sleep Last Night</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">❤️</div>
                <div className="text-lg font-bold">72</div>
                <div className="text-sm text-gray-600">Heart Rate (bpm)</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-bold">85%</div>
                <div className="text-sm text-gray-600">Goal Achievement</div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-4">
                {['diet', 'exercise', 'recommendations'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold capitalize ${
                      activeTab === tab
                        ? 'text-cyan-600 border-b-2 border-cyan-600'
                        : 'text-gray-600 hover:text-cyan-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'diet' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🍽️ Today's Diet Plan</h2>
                <div className="space-y-4">
                  {dietPlan.map((meal, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{meal.time}</h3>
                          <p className="text-gray-700">{meal.meal}</p>
                        </div>
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {meal.calories} cal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'exercise' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">💪 Exercise Routine</h2>
                <div className="grid gap-4">
                  {exercisePlan.map((ex, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 flex items-center gap-4">
                      <div className="text-4xl">{ex.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{ex.exercise}</h3>
                        <p className="text-gray-600">{ex.duration}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {ex.calories} cal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">💡 AI Recommendations</h2>
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className={`rounded-xl p-6 border-l-4 ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
                      <p className="text-gray-700">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
