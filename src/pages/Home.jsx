import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">🏥</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">MedBridge</h1>
        <p className="text-indigo-600 font-semibold text-lg mb-4">Rural Patient Pre-Diagnosis Assistant</p>
        
        {/* Divider */}
        <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6"></div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Describe your symptoms and get instant AI-powered triage guidance. 
          Know whether to visit the hospital immediately, book an appointment, 
          or treat safely at home.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: '🎤', label: 'Voice Input' },
            { icon: '🌐', label: 'Multilingual' },
            { icon: '📄', label: 'PDF Report' },
            { icon: '📸', label: 'Image Upload' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3">
              <span className="text-xl">{f.icon}</span>
              <span className="text-indigo-700 font-semibold text-sm">{f.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/triage')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mb-4"
        >
          Start Diagnosis →
        </button>

        {/* Stats */}
        <div className="flex justify-around mt-6 pt-6 border-t border-gray-100">
          {[
            { value: '3', label: 'Urgency Levels' },
            { value: '4', label: 'Languages' },
            { value: 'AI', label: 'Powered' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-indigo-600">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-6">
          ⚠️ Not a substitute for professional medical advice
        </p>
      </div>
    </div>
  )
}

export default Home