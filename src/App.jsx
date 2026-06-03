import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Triage from './pages/Triage'
import Result from './pages/Result'
import History from './pages/History'
import Error from './pages/Error'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App