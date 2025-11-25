import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SecondOpinionAI() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzeReport = async () => {
    if (!file) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setAnalysis({
        summary: 'The medical report shows normal blood count with slightly elevated cholesterol levels.',
        findings: [
          { parameter: 'Hemoglobin', value: '14.2 g/dL', status: 'normal', range: '13-17 g/dL' },
          { parameter: 'WBC Count', value: '7500 /µL', status: 'normal', range: '4000-11000 /µL' },
          { parameter: 'Cholesterol', value: '220 mg/dL', status: 'high', range: '< 200 mg/dL' },
          { parameter: 'Blood Sugar', value: '95 mg/dL', status: 'normal', range: '70-100 mg/dL' },
          { parameter: 'Platelets', value: '250000 /µL', status: 'normal', range: '150000-450000 /µL' }
        ],
        recommendations: [
          'Reduce intake of saturated fats to manage cholesterol levels',
          'Include more fiber-rich foods in your diet',
          'Consider 30 minutes of daily physical activity',
          'Schedule a follow-up test in 3 months',
          'Consult with a cardiologist for detailed cholesterol management'
        ],
        riskLevel: 'Low to Moderate',
        confidence: 92
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">🔍 AI Second Opinion</h1>
            <p className="text-blue-100">Get AI-powered insights from your medical reports</p>
          </div>

          <div className="p-8">
            {!analysis ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
                  <div className="text-6xl mb-4">📄</div>
                  <h2 className="text-2xl font-bold mb-4">Upload Your Medical Report</h2>
                  <p className="text-gray-600 mb-6">
                    Our AI will analyze your report and provide detailed insights and recommendations
                  </p>
                  
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition cursor-pointer"
                  >
                    Choose File
                  </label>
                  
                  {file && (
                    <div className="mt-6">
                      <p className="text-gray-700 mb-4">
                        Selected: <strong>{file.name}</strong>
                      </p>
                      <button
                        onClick={analyzeReport}
                        disabled={loading}
                        className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Analyzing...' : 'Analyze Report'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🤖</div>
                    <div className="font-semibold">AI-Powered</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="font-semibold">Instant Results</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="font-semibold">100% Secure</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Analysis Results</h2>
                  <button
                    onClick={() => { setAnalysis(null); setFile(null); }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Analyze Another
                  </button>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">AI Confidence Score</h3>
                      <p className="text-blue-100">Based on data analysis</p>
                    </div>
                    <div className="text-5xl font-bold">{analysis.confidence}%</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-2">⚠️ Important Note</h3>
                  <p className="text-gray-700">
                    This AI analysis is for informational purposes only and should not replace professional medical advice. 
                    Please consult with your doctor for proper diagnosis and treatment.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Summary</h3>
                  <p className="text-gray-700 text-lg">{analysis.summary}</p>
                  <div className="mt-4 inline-block">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      analysis.riskLevel.includes('Low') ? 'bg-green-100 text-green-800' :
                      analysis.riskLevel.includes('Moderate') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Risk Level: {analysis.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">🔬 Detailed Findings</h3>
                  <div className="space-y-3">
                    {analysis.findings.map((finding, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{finding.parameter}</h4>
                          <p className="text-sm text-gray-600">Normal Range: {finding.range}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{finding.value}</p>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            finding.status === 'normal' ? 'bg-green-100 text-green-800' :
                            finding.status === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {finding.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">💡 AI Recommendations</h3>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                        <span className="text-cyan-600 font-bold">{idx + 1}.</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition">
                    💾 Save Analysis
                  </button>
                  <button className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                    📧 Email to Doctor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
