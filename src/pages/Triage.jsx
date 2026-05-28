import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Triage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState('en')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState(null)
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)

  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'ta', label: '🇮🇳 Tamil' },
    { code: 'hi', label: '🇮🇳 Hindi' },
    { code: 'te', label: '🇮🇳 Telugu' },
  ]

  const placeholders = {
    en: { symptoms: 'e.g. I have headache and fever since 2 days', name: 'Enter your name', age: 'Age', duration: 'e.g. 2 days, 1 week', submitBtn: 'Get Triage Result →', processing: 'Analyzing...' },
    ta: { symptoms: 'உங்கள் அறிகுறிகளை விவரிக்கவும்...', name: 'உங்கள் பெயர்', age: 'வயது', duration: 'எ.கா. 2 நாட்கள்', submitBtn: 'முடிவை பெறுக →', processing: 'செயலாக்கம்...' },
    hi: { symptoms: 'अपने लक्षण यहाँ बताएं...', name: 'अपना नाम दर्ज करें', age: 'आयु', duration: 'जैसे 2 दिन', submitBtn: 'परिणाम प्राप्त करें →', processing: 'प्रक्रिया...' },
    te: { symptoms: 'మీ లక్షణాలను వివరించండి...', name: 'మీ పేరు నమోదు చేయండి', age: 'వయసు', duration: 'ఉదా. 2 రోజులు', submitBtn: 'ఫలితం పొందండి →', processing: 'ప్రాసెస్...' },
  }

  const labels = {
    en: { title: 'Patient Symptom Form', subtitle: 'Fill in your details to get triage guidance', lang: 'Select Language', name: 'Full Name', age: 'Age', gender: 'Gender', symptoms: 'Describe Symptoms', duration: 'Duration of Symptoms', image: 'Upload Image (optional)', voice: '🎤 Speak Symptoms', listening: '🔴 Listening...' },
    ta: { title: 'நோயாளி அறிகுறி படிவம்', subtitle: 'உங்கள் விவரங்களை நிரப்பவும்', lang: 'மொழி தேர்வு', name: 'முழு பெயர்', age: 'வயது', gender: 'பாலினம்', symptoms: 'அறிகுறிகளை விவரிக்கவும்', duration: 'அறிகுறி காலம்', image: 'படம் பதிவேற்றவும்', voice: '🎤 பேசவும்', listening: '🔴 கேட்கிறது...' },
    hi: { title: 'रोगी लक्षण फॉर्म', subtitle: 'ट्राइएज मार्गदर्शन के लिए विवरण भरें', lang: 'भाषा चुनें', name: 'पूरा नाम', age: 'आयु', gender: 'लिंग', symptoms: 'लक्षण बताएं', duration: 'लक्षण की अवधि', image: 'छवि अपलोड करें', voice: '🎤 बोलें', listening: '🔴 सुन रहा है...' },
    te: { title: 'రోగి లక్షణ ఫారమ్', subtitle: 'వివరాలు నమోదు చేయండి', lang: 'భాష ఎంచుకోండి', name: 'పూర్తి పేరు', age: 'వయసు', gender: 'లింగం', symptoms: 'లక్షణాలు వివరించండి', duration: 'లక్షణాల వ్యవధి', image: 'చిత్రం అప్లోడ్ చేయండి', voice: '🎤 చెప్పండి', listening: '🔴 వింటోంది...' },
  }

  const genderLabels = {
    en: ['Male', 'Female', 'Other'],
    ta: ['ஆண்', 'பெண்', 'மற்றவர்'],
    hi: ['पुरुष', 'महिला', 'अन्य'],
    te: ['పురుషుడు', 'స్త్రీ', 'ఇతర'],
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Please use Chrome for voice input.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.start()
    setListening(true)
    recognition.onresult = (e) => { setSymptoms(prev => prev + ' ' + e.results[0][0].transcript); setListening(false) }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
  }

  const handleSubmit = () => {
    if (!name || !age || !gender || !symptoms) { alert('Please fill all required fields!'); return }
    setLoading(true)

    if (image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result
        navigate('/result', { state: { name, age, gender, symptoms, duration, language, image, base64Image } })
      }
      reader.readAsDataURL(image)
    } else {
      setTimeout(() => navigate('/result', { state: { name, age, gender, symptoms, duration, language, image } }), 500)
    }
  }

  const l = labels[language]
  const p = placeholders[language]
  const g = genderLabels[language]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🩺 MedBridge
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">{l.title}</h1>
          <p className="text-gray-500 mt-2">{l.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">🌐 {l.lang}</label>
            <div className="flex gap-2 flex-wrap">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${language === lang.code ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">👤 {l.name} *</label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-sm transition-all"
                value={name} onChange={e => setName(e.target.value)} placeholder={p.name}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🎂 {l.age} *</label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-sm transition-all"
                type="number" value={age} onChange={e => setAge(e.target.value)} placeholder={p.age}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">⚧ {l.gender} *</label>
            <div className="flex gap-2 flex-wrap">
              {g.map((gLabel, i) => (
                <button
                  key={i}
                  onClick={() => setGender(gLabel)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${gender === gLabel ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                >
                  {gLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🤒 {l.symptoms} *</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-sm transition-all resize-none"
              rows={4} value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder={p.symptoms}
            />
            <button
              onClick={startVoice}
              className={`mt-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
              {listening ? l.listening : l.voice}
            </button>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">⏱ {l.duration}</label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-sm transition-all"
              value={duration} onChange={e => setDuration(e.target.value)} placeholder={p.duration}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📸 {l.image}</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <span className="text-2xl mb-1">📁</span>
              <span className="text-sm text-gray-500">{image ? `✅ ${image.name}` : 'Click to upload image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) setImage(e.target.files[0]) }} />
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? p.processing : p.submitBtn}
          </button>

        </div>

        <p className="text-center text-xs text-gray-400 mt-4">⚠️ Not a substitute for professional medical advice</p>
      </div>
    </div>
  )
}

export default Triage