# 🏥 MedBridge — Rural Patient Pre-Diagnosis Assistant

[![Live Demo](https://img.shields.io/badge/Live%20Demo-medbridge--sigma.vercel.app-brightgreen)](https://medbridge-sigma.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-ryannevisaA%2Fmedbridge-blue)](https://github.com/ryannevisaA/medbridge)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-orange)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)](https://supabase.com/)

> An AI-powered multilingual pre-diagnosis triage assistant designed for rural patients — helping them decide whether to rush to a hospital, book an appointment, or treat safely at home.

---

## 🌍 Problem Statement

People in rural areas face two critical challenges:
- They **travel hours to hospitals** for minor issues that could be treated at home
- They **delay serious conditions** due to lack of awareness or access to medical guidance

MedBridge bridges this gap by providing instant, AI-powered triage guidance in multiple languages — accessible to anyone with a smartphone.

---

## 🚀 Live Demo

👉 **[medbridge-sigma.vercel.app](https://medbridge-sigma.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤒 **AI Triage** | LLaMA 3.1 analyzes symptoms and returns urgency level |
| 🎤 **Voice Input** | Speak symptoms in your language using Web Speech API |
| 🌐 **Multilingual** | Supports English, Tamil, Hindi, and Telugu |
| 📸 **Image Analysis** | Upload wound/rash photos for AI visual diagnosis |
| 📄 **PDF Report** | Generates structured clinical report for doctor handoff |
| 📋 **Patient History** | Stores past triage records locally and in cloud database |
| 🗄️ **Cloud Database** | All records saved to Supabase PostgreSQL |

---

## 🏗️ Tech Stack

### Frontend
- **React** (Vite) — UI framework
- **Tailwind CSS** — Styling
- **React Router DOM** — Navigation
- **jsPDF** — PDF report generation
- **Web Speech API** — Voice input

### AI & Backend Services
- **Groq API** (LLaMA 3.1) — Medical triage AI
- **Groq Vision** (LLaMA 4 Scout) — Image analysis
- **Supabase** — PostgreSQL database

### Deployment
- **Vercel** — Frontend hosting
- **GitHub** — Version control

---

## 📱 Screenshots

### Landing Page
> Clean, professional landing page with feature highlights

### Triage Form
> Multilingual symptom input form with voice support

### Triage Result
> Color-coded urgency result with AI analysis, recommendations, and PDF download

### Patient History
> Past triage records with urgency indicators

---

## 🔄 How It Works

---

## 🚦 Triage Levels

| Level | Color | Meaning |
|---|---|---|
| 🚨 EMERGENCY | Red | Go to hospital immediately |
| 📅 SOON | Orange | Book appointment within 3 days |
| 🏠 HOME | Green | Home remedy is fine |

---

## 🌐 Supported Languages

| Language | Voice Input | UI Translation |
|---|---|---|
| English | ✅ | ✅ |
| Tamil (தமிழ்) | ✅ | ✅ |
| Hindi (हिंदी) | ✅ | ✅ |
| Telugu (తెలుగు) | ✅ | ✅ |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js v22+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Supabase account (free at [supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/ryannevisaA/medbridge.git
cd medbridge

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE triage_records (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  name text,
  age text,
  gender text,
  symptoms text,
  duration text,
  language text,
  urgency text,
  urgency_label text,
  summary text
);
```

---

## 📊 Project Structure
---

## 🎯 Use Cases

- **Rural health workers** — Quick triage before referring patients
- **Low-literacy patients** — Voice input removes typing barrier
- **Community health centers** — Digital record keeping
- **Telemedicine platforms** — Pre-screening before doctor consultation

---

## ⚠️ Disclaimer

MedBridge is an AI-assisted pre-diagnosis tool intended to help patients make informed decisions about seeking medical care. It is **not a substitute for professional medical advice, diagnosis, or treatment**. Always consult a qualified healthcare provider for medical decisions.

---

## 👨‍💻 Author

**Ryan Nevisa A S**
- GitHub: [@ryannevisaA](https://github.com/ryannevisaA)
- Project: [MedBridge](https://medbridge-sigma.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for rural healthcare access*
