import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function History() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('triage_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      setRecords(data || [])
    } catch (err) {
      console.error(err)
      const local = JSON.parse(localStorage.getItem('medbridge_history') || '[]')
      setRecords(local)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    if (confirm('Clear all history?')) {
      localStorage.removeItem('medbridge_history')
      setRecords([])
    }
  }

  const urgencyConfig = {
    EMERGENCY: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', text: 'text-red-700', icon: '🚨' },
    SOON: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700', icon: '📅' },
    HOME: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700', icon: '🏠' },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🩺 MedBridge
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Patient History</h1>
          <p className="text-gray-500 mt-1">All triage records from cloud database</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/triage')}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-2xl shadow hover:scale-105 transition-all duration-200"
          >
            + New Patient
          </button>
          {records.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-6 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all duration-200"
            >
              🗑 Clear Local
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full mx-auto mb-4" style={{ animation: 'spin 1s linear infinite' }}></div>
            <p className="text-gray-400 text-sm">Loading records from database...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No records yet</h3>
            <p className="text-gray-400 text-sm">Triage results will appear here after each diagnosis</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const config = urgencyConfig[record.urgency] || urgencyConfig.SOON
              return (
                <div key={record.id} className={`${config.bg} ${config.border} border-2 rounded-2xl p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`${config.badge} w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-800">{record.name}</div>
                        <div className="text-xs text-gray-500">Age {record.age} · {record.gender}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs font-bold ${config.text}`}>{record.urgency}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(record.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/60">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Symptoms:</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{record.symptoms}</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Summary:</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{record.summary}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${config.badge} text-white`}>
                      {record.urgency_label}
                    </div>
                    <div className="text-xs text-gray-400">🌐 {record.language?.toUpperCase() || 'EN'}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Records synced from cloud database ☁️
        </p>
      </div>
    </div>
  )
}

export default History