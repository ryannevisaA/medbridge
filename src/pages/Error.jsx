import { useNavigate } from 'react-router-dom'

function Error() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-16 text-center max-w-md w-full">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-8">The server might be starting up. Please try again in a moment.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-2xl"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default Error