import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { generatePlanWithAI } from '../../utils/api'
import { saveTrip, defaultTripTitle } from '../../utils/trips'
import { Sparkles, Clock, Heart, MapPin, X, Backpack, Lightbulb, Sunrise, Sun, Moon, BookmarkPlus, Check, Loader } from 'lucide-react'

function timeIcon(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return <Sunrise size={14} className="text-amber-400" />
  if (h < 18) return <Sun size={14} className="text-orange-400" />
  return <Moon size={14} className="text-indigo-400" />
}

function timeBg(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return 'bg-amber-50 text-amber-600 border-amber-200'
  if (h < 18) return 'bg-orange-50 text-orange-600 border-orange-200'
  return 'bg-indigo-50 text-indigo-600 border-indigo-200'
}

const interestKeys = ['int_nature', 'int_culture', 'int_food', 'int_adventure', 'int_photo', 'int_history']
const interestEmojis = {
  int_nature: '🏔️', int_culture: '🏛️', int_food: '🍖',
  int_adventure: '🐎', int_photo: '📸', int_history: '📜',
}
const langLabels = { kr: '한국어', en: 'English', mn: 'Mongolian' }

export default function DesktopPlanner() {
  const { tr, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  // support both ?locations=A,B,C (multi) and legacy ?location=X
  const rawLocations = searchParams.get('locations') || searchParams.get('location') || ''
  const focusLocations = rawLocations ? rawLocations.split(',').map(s => s.trim()).filter(Boolean) : []

  const [days, setDays] = useState(5)
  const [interests, setInterests] = useState(['int_nature'])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [savingTrip, setSavingTrip] = useState(false)
  const [savedTripId, setSavedTripId] = useState(null)
  const { user } = useAuth()

  const handleSaveTrip = async () => {
    if (!result || !user?.uid || savingTrip || savedTripId) return
    setSavingTrip(true)
    try {
      const id = await saveTrip(user.uid, {
        title: defaultTripTitle(result, days, lang),
        days,
        interests,
        locations: focusLocations,
        plan: result,
      })
      setSavedTripId(id)
    } catch (err) {
      console.error('[Planner] save failed', err)
      setGenError(err.message)
    } finally {
      setSavingTrip(false)
    }
  }

  const clearLocations = () => setSearchParams({})

  const toggleInterest = (key) => {
    setInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setGenError('')
    setSavedTripId(null)
    try {
      const interestLabels = interests.map(k => tr(k))
      const plan = await generatePlanWithAI(days, interestLabels, langLabels[lang] || 'Korean', focusLocations.length ? focusLocations : null)
      setResult(plan)
    } catch {
      setGenError(
        lang === 'mn' ? 'Хуваарь гаргах амжилтгүй боллоо. Дахин оролдоно уу.' :
        lang === 'en' ? 'Failed to generate. Please try again.' :
        '일정 생성에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy via-primary-dark to-primary py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={22} className="text-yellow-300" />
            <h1 className="text-2xl font-black text-white">{tr('planner_title')}</h1>
          </div>
          <p className="text-white/70 text-base">{tr('planner_sub')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
            <h2 className="text-lg font-black text-gray-900">{tr('planner_settings_title')}</h2>

            {/* Selected locations from map */}
            {focusLocations.length > 0 && (
              <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-violet-600" />
                    <p className="text-[11px] text-violet-500 font-semibold">
                      {lang === 'kr' ? '지도에서 선택한 장소' : lang === 'mn' ? 'Газрын зургаас сонгосон' : 'Selected from map'}
                    </p>
                  </div>
                  <button onClick={clearLocations} className="text-violet-300 hover:text-violet-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {focusLocations.map((name, i) => (
                    <span key={i} className="text-xs font-bold text-violet-800 bg-violet-100 px-2.5 py-1 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {tr('planner_days')}
                </label>
                <span className="text-primary font-black text-lg">{days} {tr('planner_days_unit')}</span>
              </div>
              <input type="range" min={1} max={14} value={days} onChange={e => setDays(Number(e.target.value))} className="w-full accent-primary h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{tr('range_day_1')}</span><span>{tr('range_day_7')}</span><span>{tr('range_day_14')}</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Heart size={16} className="text-primary" />
                {tr('planner_interests')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {interestKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => toggleInterest(key)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                      interests.includes(key)
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{interestEmojis[key]}</span>
                    {tr(key)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || interests.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 text-base"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{tr('planner_generating')}</>
              ) : (
                <><Sparkles size={18} />{tr('planner_generate')}</>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 text-base mb-2">{tr('planner_placeholder_line1')}</p>
                <p className="text-gray-400 text-sm">{tr('planner_placeholder_line2')}</p>
                {genError && <p className="text-red-400 text-sm mt-4">{genError}</p>}
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">{tr('planner_generating')}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-gray-900">
                    🗓️ {days}{tr('planner_days_unit')} {tr('custom_itinerary')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {result.itinerary?.length ?? 0} {lang === 'kr' ? '일' : lang === 'mn' ? 'өдөр' : 'days'}
                    </span>
                    {user && (
                      <button
                        onClick={handleSaveTrip}
                        disabled={savingTrip || !!savedTripId}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          savedTripId
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : savingTrip
                              ? 'bg-gray-100 border-gray-200 text-gray-400'
                              : 'bg-primary text-white border-primary hover:bg-primary-dark active:scale-95'
                        }`}
                      >
                        {savedTripId ? <><Check size={13} /> {lang === 'kr' ? '저장됨' : 'Saved'}</>
                          : savingTrip ? <><Loader size={13} className="animate-spin" /> {lang === 'kr' ? '저장 중' : 'Saving'}</>
                          : <><BookmarkPlus size={13} /> {lang === 'kr' ? '저장' : 'Save'}</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Day cards */}
                {(result.itinerary ?? []).map(day => (
                  <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Day header */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary/8 to-transparent border-b border-gray-100">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-black flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                        {day.day}
                      </span>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          {lang === 'kr' ? `${day.day}일차` : lang === 'mn' ? `${day.day} өдөр` : `Day ${day.day}`}
                        </p>
                        <p className="font-black text-gray-900 text-sm leading-tight">{day.title}</p>
                      </div>
                    </div>

                    {/* Activities timeline */}
                    <div className="px-5 py-4 space-y-0">
                      {day.activities.map((act, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {/* Timeline line */}
                          {i < day.activities.length - 1 && (
                            <div className="absolute left-[22px] top-10 bottom-0 w-px bg-gray-100" />
                          )}
                          {/* Time + icon column */}
                          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-11">
                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 bg-white ${timeBg(act.time)}`}>
                              {timeIcon(act.time)}
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${timeBg(act.time)}`}>
                              {act.time}
                            </span>
                          </div>
                          {/* Activity text */}
                          <div className={`flex-1 ${i < day.activities.length - 1 ? 'pb-5' : 'pb-1'}`}>
                            <p className="text-sm text-gray-700 leading-relaxed pt-1.5">
                              {act.text.replace(/\*\*/g, '')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Packing list */}
                {result.packing && result.packing.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Backpack size={16} className="text-emerald-600" />
                      </div>
                      <h3 className="font-black text-gray-900 text-sm">
                        {lang === 'kr' ? '준비물 체크리스트' : lang === 'mn' ? 'Бэлтгэх зүйлс' : 'Packing Checklist'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {result.packing.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                          <span className="w-4 h-4 rounded-full border-2 border-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-gray-700 font-medium leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-amber-500" />
                      <h3 className="font-black text-gray-900 text-sm">
                        {lang === 'kr' ? '현지 꿀팁' : lang === 'mn' ? 'Орон нутгийн зөвлөмж' : 'Local Tips'}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-amber-800 leading-relaxed">
                          <span className="text-amber-400 font-black mt-0.5">✦</span>
                          <span>{tip.replace(/\*\*/g, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
