import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import BottomNav from '../components/BottomNav'

const mockReplies = {
  kr: [
    '몽골의 최고 여행 시즌은 6~8월 여름입니다. 나담 축제(7월 11~13일)를 포함한 여행을 강력 추천해요! 🎉',
    '테를지 국립공원은 울란바토르에서 약 1시간 거리로, 당일치기 또는 1박 2일 일정으로 딱입니다. 기암괴석과 넓은 초원이 정말 아름다워요 🏔️',
    '몽골 입국 시 한국 여권 소지자는 비자 없이 최대 30일 체류 가능합니다. 여행자 보험은 꼭 챙기세요! 🛂',
    '고비 사막 투어는 보통 3~5일 일정으로, 울란바토르에서 국내선이나 지프로 이동합니다. 예산은 약 80~150만원 정도 예상하세요 💰',
    '꼭 먹어봐야 할 음식은 허르헉(Khorkhog), 보즈(Buuz), 수테차이(밀크티)입니다. 현지 게르 캠프에서 맛보는 허르헉은 잊을 수 없어요! 🍖',
  ],
  en: [
    "Mongolia's best travel season is June-August. I strongly recommend including the Naadam Festival (July 11-13) in your trip! 🎉",
    'Terelj National Park is about 1 hour from Ulaanbaatar, perfect for a day trip or overnight stay. The rock formations and vast steppes are stunning! 🏔️',
    'Korean passport holders can enter Mongolia visa-free for up to 30 days. Do not forget to get travel insurance! 🛂',
    'Gobi Desert tours typically take 3-5 days, traveling by domestic flight or 4WD from Ulaanbaatar. Budget around $600–1200 USD. 💰',
    'Must-try foods: Khorkhog, Buuz dumplings, and Suutei tsai (salted milk tea). Trying Khorkhog in a local ger camp is unforgettable! 🍖',
  ],
  mn: [
    'Монголд аялах хамгийн сайн цаг бол 6–8 дугаар сарын зун юм. Наадамыг (7/11-13) оролцуулсан аялал зөвлөж байна! 🎉',
    'Тэрэлжийн байгалийн цогцолбор Улаанбаатараас ойролцоогоор 1 цагийн зайд байдаг. Өдрийн аялал эсвэл 1 шөнийн аялалд тохиромжтой! 🏔️',
    'Монголд зочлох Солонгос иргэд 30 хүртэл хоног визгүй байж болно. Аяллын даатгал авахаа мартуузай! 🛂',
    'Говийн аялал ерөнхийдөө 3-5 өдрийн хуваариар явагддаг. Улаанбаатараас дотоодын нислэгээр явна. 💰',
    'Заавал амтлах хоолнуудад хорхог, бууз, сүүтэй цай орно. Гэрт хийсэн хорхог мартагдашгүй! 🍖',
  ],
}

export default function AIChat() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()
  // Store greeting as a key so it re-renders correctly when lang changes
  const [messages, setMessages] = useState([
    { role: 'ai', msgKey: 'chat_greeting' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const resolveText = (msg) => msg.msgKey ? tr(msg.msgKey) : msg.text

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setThinking(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700))
    const replies = mockReplies[lang] || mockReplies.kr
    setMessages(prev => [...prev, { role: 'ai', text: replies[Math.floor(Math.random() * replies.length)] }])
    setThinking(false)
  }

  const suggestedQs = [tr('chat_q1'), tr('chat_q2'), tr('chat_q3')]

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{tr('chat_title')}</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <p className="text-[10px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
              }`}
            >
              {resolveText(msg)}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {suggestedQs.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            className="px-3 py-1.5 bg-primary/8 text-primary text-xs font-semibold rounded-full whitespace-nowrap border border-primary/20 hover:bg-primary/15 transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-2 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={tr('chat_placeholder')}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-all active:scale-95 shadow-sm shadow-primary/30"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
