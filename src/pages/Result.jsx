import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { supabase } from '../supabase'

function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!data) { navigate('/'); return }
    analyzSymptoms(data.symptoms, data.age, data.gender, data.duration)
  }, [])

  const analyzSymptoms = async (symptoms, age, gender, duration) => {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a medical triage assistant. Always respond with valid JSON only, no extra text.'
        },
        {
          role: 'user',
          content: data.base64Image
            ? [
                {
                  type: 'text',
                  text: `Analyze these patient symptoms AND the uploaded image.
Patient Info:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}

Respond ONLY in this exact JSON format:
{
  "urgency": "EMERGENCY" or "SOON" or "HOME",
  "urgency_label": "Go to hospital immediately" or "Book appointment within 3 days" or "Home remedy is fine",
  "urgency_color": "#e53e3e" or "#dd6b20" or "#38a169",
  "image_findings": "What you observe in the image (1-2 sentences)",
  "summary": "2-3 sentence summary including image findings",
  "recommendations": ["rec1", "rec2", "rec3"],
  "home_remedies": ["remedy1", "remedy2"] or [],
  "warning_signs": ["sign1", "sign2"],
  "disclaimer": "This is AI-generated triage guidance only. Please consult a doctor."
}`
                },
                {
                  type: 'image_url',
                  image_url: { url: data.base64Image }
                }
              ]
            : `Analyze these patient symptoms and provide triage guidance.
Patient Info:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}

Respond ONLY in this exact JSON format:
{
  "urgency": "EMERGENCY" or "SOON" or "HOME",
  "urgency_label": "Go to hospital immediately" or "Book appointment within 3 days" or "Home remedy is fine",
  "urgency_color": "#e53e3e" or "#dd6b20" or "#38a169",
  "image_findings": null,
  "summary": "2-3 sentence summary",
  "recommendations": ["rec1", "rec2", "rec3"],
  "home_remedies": ["remedy1", "remedy2"] or [],
  "warning_signs": ["sign1", "sign2"],
  "disclaimer": "This is AI-generated triage guidance only. Please consult a doctor."
}`
        }
      ]

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: data.base64Image ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.1-8b-instant',
          max_tokens: 1000,
          messages
        })
      })

      const resData = await response.json()
      if (!resData.choices || !resData.choices[0]) throw new Error('No choices')
      const text = resData.choices[0].message.content
      const clean = text.replace(/```json|```/g, '').trim()
      setResult(JSON.parse(clean))
    } catch (err) {
      console.error(err)
      setResult({
        urgency: 'SOON',
        urgency_label: 'Book appointment within 3 days',
        urgency_color: '#dd6b20',
        image_findings: null,
        summary: 'Unable to analyze symptoms. Please consult a doctor.',
        recommendations: ['Visit a nearby clinic', 'Describe symptoms clearly to the doctor'],
        home_remedies: ['Rest and stay hydrated'],
        warning_signs: ['High fever', 'Difficulty breathing', 'Chest pain'],
        disclaimer: 'This is AI-generated triage guidance only. Please consult a doctor.'
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFillColor(102, 126, 234)
    doc.rect(0, 0, pageWidth, 35, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('MedBridge', pageWidth / 2, 15, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Rural Patient Pre-Diagnosis Report', pageWidth / 2, 25, { align: 'center' })
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 32, { align: 'center' })
    let y = 45
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Patient Information', 15, y); y += 8
    doc.setFontSize(11); doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${data.name}`, 15, y); y += 7
    doc.text(`Age: ${data.age}  |  Gender: ${data.gender}`, 15, y); y += 7
    doc.text(`Duration: ${data.duration || 'Not specified'}`, 15, y); y += 12
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
    doc.text('Reported Symptoms', 15, y); y += 8
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
    const symLines = doc.splitTextToSize(data.symptoms, pageWidth - 30)
    doc.text(symLines, 15, y); y += symLines.length * 7 + 8
    if (result) {
      if (result.image_findings) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
        doc.text('Image Analysis', 15, y); y += 8
        doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
        const imgLines = doc.splitTextToSize(result.image_findings, pageWidth - 30)
        doc.text(imgLines, 15, y); y += imgLines.length * 7 + 8
      }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
      doc.text('Triage Result', 15, y); y += 8
      doc.setFontSize(12)
      doc.text(`Urgency: ${result.urgency_label}`, 15, y); y += 10
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
      doc.text('Summary', 15, y); y += 8
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
      const sumLines = doc.splitTextToSize(result.summary, pageWidth - 30)
      doc.text(sumLines, 15, y); y += sumLines.length * 7 + 8
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
      doc.text('Recommendations', 15, y); y += 8
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
      result.recommendations.forEach(r => { doc.text(`• ${r}`, 15, y); y += 7 }); y += 5
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
      doc.text('Warning Signs', 15, y); y += 8
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
      result.warning_signs.forEach(w => { doc.text(`! ${w}`, 15, y); y += 7 }); y += 5
      doc.setTextColor(150, 150, 150); doc.setFontSize(9)
      doc.text(doc.splitTextToSize(result.disclaimer, pageWidth - 30), 15, y)
    }
    doc.save(`MedBridge_Report_${data.name}.pdf`)
  }

  useEffect(() => {
    if (result && data) {
      const record = {
        id: Date.now(),
        name: data.name,
        age: data.age,
        gender: data.gender,
        symptoms: data.symptoms,
        duration: data.duration,
        urgency: result.urgency,
        urgency_label: result.urgency_label,
        urgency_color: result.urgency_color,
        summary: result.summary,
        timestamp: new Date().toLocaleString()
      }
      const existing = JSON.parse(localStorage.getItem('medbridge_history') || '[]')
      existing.unshift(record)
      localStorage.setItem('medbridge_history', JSON.stringify(existing.slice(0, 50)))

      const saveToSupabase = async () => {
        const { error } = await supabase
          .from('triage_records')
          .insert([{
            name: data.name,
            age: String(data.age),
            gender: data.gender,
            symptoms: data.symptoms,
            duration: data.duration || '',
            language: data.language,
            urgency: result.urgency,
            urgency_label: result.urgency_label,
            summary: result.summary,
          }])
        if (error) console.error('Supabase error:', error)
        else console.log('Saved to Supabase!')
      }
      saveToSupabase()
    }
  }, [result])

  const urgencyConfig = {
    EMERGENCY: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', icon: '🚨', text: 'text-red-700' },
    SOON: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', icon: '📅', text: 'text-orange-700' },
    HOME: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', icon: '🏠', text: 'text-green-700' },
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full mx-auto mb-6" style={{ animation: 'spin 1s linear infinite' }}></div>
        <h3 className="text-xl font-bold text-gray-800">Analyzing symptoms...</h3>
        <p className="text-gray-400 mt-2 text-sm">AI is reviewing your case</p>
      </div>
    </div>
  )

  const config = urgencyConfig[result?.urgency] || urgencyConfig.SOON

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🩺 MedBridge
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Triage Result</h1>
          <p className="text-gray-500 mt-1">Patient: <span className="font-semibold text-gray-700">{data?.name}</span></p>
        </div>

        <div className="space-y-4">
          {result && (
            <div className={`${config.bg} ${config.border} border-2 rounded-3xl p-6 flex items-center gap-5`}>
              <div className={`${config.badge} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                {config.icon}
              </div>
              <div>
                <div className={`text-xl font-extrabold ${config.text}`}>{result.urgency_label}</div>
                <div className="text-gray-500 text-sm mt-1">Urgency Level: <span className="font-bold">{result.urgency}</span></div>
              </div>
            </div>
          )}

          {result && (
            <>
              {result.image_findings && (
                <div className="bg-blue-50 rounded-2xl shadow-sm p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3">🔍 Image Analysis</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">{result.image_findings}</p>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">📋 Summary</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">✅ Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              {result.home_remedies.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3">🌿 Home Remedies</h3>
                  <ul className="space-y-2">
                    {result.home_remedies.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bg-red-50 rounded-2xl shadow-sm p-6 border border-red-100">
                <h3 className="font-bold text-red-700 mb-3">⚠️ Warning Signs to Watch</h3>
                <ul className="space-y-2">
                  {result.warning_signs.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <span className="font-bold mt-0.5">⚠</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-center text-xs text-gray-400 px-4">{result.disclaimer}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={downloadPDF} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  📄 Download PDF Report
                </button>
                <button onClick={() => navigate('/history')} className="px-6 py-4 rounded-2xl border-2 border-indigo-300 text-indigo-600 font-bold hover:bg-indigo-50 transition-all duration-200">
                  📋 History
                </button>
                <button onClick={() => navigate('/triage')} className="px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all duration-200">
                  ← New
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Result