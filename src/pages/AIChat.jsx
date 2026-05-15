import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles, MapPin, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLang } from '../context/LangContext'
import BottomNav from '../components/BottomNav'
import { chatWithGemini } from '../utils/gemini'

// Parse [MAP_UPDATE]...[/MAP_UPDATE] from AI response text
function parseMapUpdate(text) {
  const match = text.match(/\[MAP_UPDATE\]([\s\S]*?)\[\/MAP_UPDATE\]/)
  if (!match) return { places: null, cleanText: text }
  try {
    const data = JSON.parse(match[1].trim())
    const cleanText = text.replace(/\s*\[MAP_UPDATE\][\s\S]*?\[\/MAP_UPDATE\]/, '').trim()
    return { places: Array.isArray(data.places) && data.places.length > 0 ? data.places : null, cleanText }
  } catch {
    return { places: null, cleanText: text }
  }
}

function createNumberedIcon(n) {
  const svg = `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill="#2F855A"/>
    <text x="14" y="19" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="11" font-weight="bold" font-family="sans-serif">${n}</text>
  </svg>`
  return L.divIcon({ html: svg, iconSize: [28, 36], iconAnchor: [14, 36], className: '' })
}

function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (!places || places.length === 0) return
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 8)
    } else {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [30, 30] })
    }
  }, [places, map])
  return null
}

function TaxiModal({ place, onClose, tr }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
          <MapPin size={26} className="text-white" />
        </div>
        <p className="text-xs text-gray-400 mb-3 font-medium">{tr('taxi_modal_tip')}</p>
        <p className="text-3xl font-black text-gray-900 mb-2 leading-tight">{place.name_mn}</p>
        <p className="text-xl font-bold text-primary mb-4">{place.taxi_phrase}</p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
          <span>{place.name_ko}</span>
          <span>·</span>
          <span>{place.name_en}</span>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 active:bg-gray-200 transition-colors"
        >
          {tr('taxi_modal_close')}
        </button>
      </div>
    </div>
  )
}

function PlaceCard({ place, onTaxi, tr }) {
  return (
    <div className="flex-shrink-0 bg-primary/5 border border-primary/15 rounded-2xl px-3 py-2.5 min-w-[150px] max-w-[160px]">
      <div className="flex items-center gap-1 mb-1.5">
        <MapPin size={10} className="text-primary" />
        <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Place</span>
      </div>
      <p className="text-xs font-bold text-gray-900 truncate">{place.name_ko}</p>
      <p className="text-[10px] text-gray-500 truncate">{place.name_en}</p>
      <p className="text-[10px] text-gray-400 truncate mb-2">{place.name_mn}</p>
      <button
        onClick={onTaxi}
        className="w-full flex items-center justify-center gap-1 py-1.5 bg-primary text-white rounded-xl text-[10px] font-bold active:opacity-80 transition-opacity"
      >
        {tr('taxi_btn')}
      </button>
    </div>
  )
}

export default function AIChat() {
  const navigate = useNavigate()
  const { tr } = useLang()
  const [messages, setMessages] = useState([
    { role: 'ai', msgKey: 'chat_greeting' },
  ])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')
  const [mapPlaces, setMapPlaces] = useState([])
  const [showMap, setShowMap] = useState(true)
  const [taxiPlace, setTaxiPlace] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const resolveText = (msg) => msg.msgKey ? tr(msg.msgKey) : msg.text

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setThinking(true)
    try {
      const rawReply = await chatWithGemini(history, trimmed)
      const { places, cleanText } = parseMapUpdate(rawReply)
      if (places) {
        setMapPlaces(places)
        setShowMap(true)
      }
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: rawReply }] },
      ])
      setMessages(prev => [...prev, { role: 'ai', text: cleanText, places }])
    } catch {
      setError('응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setThinking(false)
    }
  }

  const suggestedQs = [tr('chat_q1'), tr('chat_q2'), tr('chat_q3')]
  const hasMap = mapPlaces.length > 0

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F8F9FB]">
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
          <div key={i}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/20'
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                {resolveText(msg)}
              </div>
            </div>
            {/* Place cards inline under AI messages that have map data */}
            {msg.role === 'ai' && msg.places && msg.places.length > 0 && (
              <div className="mt-2 ml-9 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {msg.places.map((place, pi) => (
                  <PlaceCard
                    key={pi}
                    place={place}
                    onTaxi={() => setTaxiPlace(place)}
                    tr={tr}
                  />
                ))}
              </div>
            )}
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
        {error && (
          <div className="text-center text-xs text-red-400 py-2">{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mini Map Panel — shown when AI mentions places */}
      {hasMap && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => setShowMap(p => !p)}
            className="w-full flex items-center justify-between px-4 py-2.5"
          >
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              <span className="text-xs font-bold text-gray-800">{tr('chat_map_title')}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                {mapPlaces.length}{tr('chat_map_places')}
              </span>
            </div>
            {showMap
              ? <ChevronDown size={14} className="text-gray-400" />
              : <ChevronUp size={14} className="text-gray-400" />
            }
          </button>
          {showMap && (
            <div className="h-[175px] relative">
              <MapContainer
                center={[47.5, 103.5]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                {mapPlaces.map((p, i) => (
                  <Marker
                    key={i}
                    position={[p.lat, p.lng]}
                    icon={createNumberedIcon(i + 1)}
                  />
                ))}
                {mapPlaces.length > 1 && (
                  <Polyline
                    positions={mapPlaces.map(p => [p.lat, p.lng])}
                    color="#2F855A"
                    weight={2}
                    dashArray="6,5"
                    opacity={0.75}
                  />
                )}
                <FitBounds places={mapPlaces} />
              </MapContainer>
            </div>
          )}
        </div>
      )}

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

      {/* Taxi modal overlay */}
      {taxiPlace && (
        <TaxiModal
          place={taxiPlace}
          onClose={() => setTaxiPlace(null)}
          tr={tr}
        />
      )}
    </div>
  )
}
