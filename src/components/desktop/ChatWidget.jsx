import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { chatWithGemini } from '../../utils/gemini'

const GREETING = '안녕하세요! 몽골 여행 전문 AI 가이드 Nomadiq입니다. 여행 계획, 맛집, 비자, 날씨 등 무엇이든 물어보세요! 😊'

const SUGGESTIONS = [
  '몽골 여행 최적 시기는?',
  '비자 없이 입국 가능한가요?',
  '고비 사막 투어 비용은?',
  '꼭 먹어봐야 할 음식은?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'ai', text: GREETING }])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || thinking) return
    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setThinking(true)
    try {
      const reply = await chatWithGemini(history, trimmed)
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: reply }] },
      ])
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (e) {
      setError('응답을 가져오지 못했습니다: ' + e.message)
    } finally {
      setThinking(false)
    }
  }

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-navy to-primary flex-shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles size={17} className="text-yellow-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm leading-tight">Nomadiq AI</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-white/60 text-[10px]">온라인</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={10} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-2xl rounded-br-sm shadow-sm'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <p className="text-center text-xs text-red-400">{error}</p>}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only at start) */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 bg-gray-50 border-t border-gray-100">
              {SUGGESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="px-3 py-1.5 bg-white text-primary text-xs font-semibold rounded-full whitespace-nowrap border border-primary/20 hover:bg-primary/5 transition-colors flex-shrink-0 shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="몽골 여행에 대해 물어보세요..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || thinking}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-all hover:bg-primary-dark flex-shrink-0"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-yellow-900" />
          </span>
        )}
      </button>
    </>
  )
}
