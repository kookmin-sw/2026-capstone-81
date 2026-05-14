import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { Search, Bell, Bookmark, ChevronDown, Send, Sparkles, MapPin, X } from 'lucide-react'
import DesktopSidebar from './DesktopSidebar'
import { chatWithGemini } from '../../utils/gemini'

function AIPanel({ onClose }) {
  const { lang } = useLang()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: lang === 'mn'
        ? 'Сайн байна уу! 👋 Монгол аялалын Chatbot байна.\nЮунд туслах вэ?'
        : lang === 'kr'
        ? '안녕하세요! 👋 몽골 여행 Chatbot입니다.\n무엇을 도와드릴까요?'
        : 'Hello! 👋 I\'m your Mongolia travel Chatbot.\nHow can I help you?'
    }
  ])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const locationSuggestions = [
    { mn: 'Хөвсгөл, Увс нуур орчим', kr: '홉스골, 우브스 호수 주변', en: 'Khuvsgul, Uvs Lake area' },
    { mn: 'Төв аймаг, Тэрэлж орчим', kr: '투브 아이막, 테를지 주변', en: 'Tuv aimag, Terelj area' },
    { mn: 'Өмнөговь, говийн бус', kr: '남고비, 고비 일대', en: 'Omnogovi, Gobi area' },
    { mn: 'Бусад (өөр газар)', kr: '기타 (다른 지역)', en: 'Other area' },
  ]

  const quickQs = [
    { mn: 'Зардал хэд болох вэ?', kr: '비용은 얼마나 드나요?', en: 'How much does it cost?' },
    { mn: 'Ямар үед явах тохиромжтой вэ?', kr: '언제 가는 게 좋을까요?', en: 'When is the best time to go?' },
    { mn: 'Хаана байрлах вэ?', kr: '어디서 숙박할까요?', en: 'Where to stay?' },
  ]

  const send = async (text) => {
    const msg = text ?? input
    if (!msg.trim() || thinking) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setThinking(true)
    try {
      const reply = await chatWithGemini(history, msg)
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: msg }] },
        { role: 'model', parts: [{ text: reply }] },
      ])
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: lang === 'mn'
          ? 'Алдаа гарлаа. Дахин оролдоно уу.'
          : lang === 'kr'
          ? '오류가 발생했습니다. 다시 시도해주세요.'
          : 'An error occurred. Please try again.'
      }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ height: '520px' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-black text-gray-900 text-sm">
            {lang === 'mn' ? 'Chatbot' : lang === 'kr' ? 'Chatbot' : 'Chatbot'}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X size={15} className="text-gray-400" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <Sparkles size={11} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
              m.role === 'ai'
                ? 'bg-gray-100 text-gray-700 rounded-tl-sm'
                : 'bg-primary text-white rounded-tr-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <Sparkles size={11} className="text-primary" />
            </div>
            <div className="bg-gray-100 px-3 py-2.5 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 위치 선택 칩 (초기 상태에서만) */}
        {messages.length === 1 && (
          <div className="space-y-1.5 ml-8">
            {locationSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s[lang] ?? s.en)}
                className="w-full text-left flex items-center gap-2 bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/30 rounded-xl px-3 py-2 text-xs text-gray-600 hover:text-primary transition-all"
              >
                <MapPin size={11} className="text-primary flex-shrink-0" />
                {s[lang] ?? s.en}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 질문 */}
      <div className="px-4 py-2 border-t border-gray-50 space-y-1">
        {quickQs.map((q, i) => (
          <button
            key={i}
            onClick={() => send(q[lang] ?? q.en)}
            className="w-full text-left text-xs text-gray-400 hover:text-primary transition-colors py-0.5"
          >
            · {q[lang] ?? q.en}
          </button>
        ))}
      </div>

      {/* 입력창 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={lang === 'mn' ? 'Асуулта бичнэ үү...' : lang === 'kr' ? '질문을 입력하세요...' : 'Type a message...'}
            className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          >
            <Send size={11} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DesktopLayout({ children }) {
  const { lang } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQ, setSearchQ] = useState('')
  const [showAI, setShowAI] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* 좌측 사이드바 */}
      <DesktopSidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* 상단 바 */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(searchQ.trim() ? `/explore?q=${encodeURIComponent(searchQ)}` : '/explore')}
              placeholder={lang === 'mn' ? 'Хаана аялахыг хүсэж байна вэ?' : lang === 'kr' ? '어디로 떠나고 싶으세요?' : 'Where do you want to go?'}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={() => navigate(searchQ.trim() ? `/explore?q=${encodeURIComponent(searchQ)}` : '/explore')}
            className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <Search size={15} className="text-white" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Bell size={16} className="text-gray-500" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Bookmark size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => navigate(user ? '/profile' : '/login')}
            className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-shrink-0"
          >
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
              : <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {user?.displayName?.[0] ?? '?'}
                </div>
            }
            <span className="text-sm font-semibold text-gray-700">
              {user?.displayName ?? (lang === 'mn' ? 'Нэвтрэх' : lang === 'kr' ? '로그인' : 'Login')}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {/* AI 버튼 */}
          <button
            onClick={() => setShowAI(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all ${
              showAI ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-primary text-white shadow-md shadow-primary/25'
            }`}
          >
            <Sparkles size={14} />
            Chatbot
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* 플로팅 챗봇 팝업 */}
        {showAI && <AIPanel onClose={() => setShowAI(false)} />}
      </div>

    </div>
  )
}
