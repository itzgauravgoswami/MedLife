import { useState, useRef, useEffect } from 'react'
import API_URL from '../config/api'

export default function MedBotChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MedBot, your AI health assistant. Feel free to ask me about any medical symptoms, health concerns, or wellness tips. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/medbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage = {
          id: messages.length + 2,
          text: data.reply,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        setError(data.message || 'Error getting response')
      }
    } catch (err) {
      setError('Error connecting to MedBot: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* MedBot Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 group"
        title="Open MedBot Chatbot"
      >
        <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer group-hover:scale-110">
          {/* Icon */}
          <div className="text-3xl">🤖</div>
          
          {/* "We Are Here" Text - appears on hover */}
          <div className="absolute -top-12 right-0 bg-white rounded-full px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-2 border-cyan-400">
            <span className="text-sm font-bold text-cyan-600">We Are Here</span>
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-20 animate-pulse"></div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-96 z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">MedBot</h3>
              <p className="text-xs opacity-90">AI Health Assistant - We Are Here</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:bg-white hover:bg-opacity-20 w-8 h-8 flex items-center justify-center rounded-lg transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your health question..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none text-sm disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-1"
              >
                <span>Send</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
