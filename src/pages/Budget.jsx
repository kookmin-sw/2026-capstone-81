import { useState } from 'react'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { Calculator, TrendingUp } from 'lucide-react'

const rates = {
  budget: { flight: 80, hotel: 5, food: 3, activity: 4, transport: 2 },
  mid: { flight: 120, hotel: 10, food: 6, activity: 8, transport: 4 },
  luxury: { flight: 200, hotel: 25, food: 15, activity: 20, transport: 10 },
}

const styleEmoji = { budget: '🎒', mid: '✈️', luxury: '💎' }

export default function Budget() {
  const { tr, lang } = useLang()
  const [days, setDays] = useState(5)
  const [people, setPeople] = useState(2)
  const [style, setStyle] = useState('mid')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const r = rates[style]
    const breakdown = {
      flight: r.flight * people,
      hotel: r.hotel * days * people,
      food: r.food * days * people,
      activity: r.activity * days * people,
      transport: r.transport * days * people,
    }
    breakdown.total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    setResult(breakdown)
  }

  const labelMap = {
    flight: tr('budget_flight'),
    hotel: tr('budget_hotel'),
    food: tr('budget_food'),
    activity: tr('budget_activity'),
    transport: tr('budget_transport'),
  }
  const emoji = { flight: '✈️', hotel: '🏨', food: '🍖', activity: '🐎', transport: '🚐' }

  const styleColors = {
    budget: 'bg-emerald-500 shadow-emerald-200',
    mid: 'bg-blue-500 shadow-blue-200',
    luxury: 'bg-purple-500 shadow-purple-200',
  }

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-4 pt-5 pb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator size={16} className="text-white" />
            </div>
            <span className="text-white font-black text-base">{tr('budget_title')}</span>
          </div>
          <p className="text-emerald-100 text-xs">
            {lang === 'kr' ? '몽골 여행 예산을 미리 계산해보세요' : lang === 'en' ? 'Plan your Mongolia travel budget' : 'Монгол аяллын зардлаа тооцоол'}
          </p>
        </div>

        <div className="px-4 -mt-4">
          <div className="bg-white rounded-3xl shadow-sm p-5 space-y-5">
            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-sm font-bold text-gray-700">{tr('budget_days')}</label>
                <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-0.5 rounded-full">
                  {days} {tr('budget_days_unit')}
                </span>
              </div>
              <input type="range" min={1} max={21} value={days} onChange={e => setDays(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1</span><span>7</span><span>14</span><span>21</span>
              </div>
            </div>

            {/* People */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-sm font-bold text-gray-700">{tr('budget_people')}</label>
                <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-0.5 rounded-full">
                  {people} {tr('budget_people_unit')}
                </span>
              </div>
              <input type="range" min={1} max={10} value={people} onChange={e => setPeople(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1</span><span>3</span><span>5</span><span>10</span>
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2.5">{tr('budget_type')}</label>
              <div className="flex gap-2">
                {['budget', 'mid', 'luxury'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${
                      style === s
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    <span className="text-base">{styleEmoji[s]}</span>
                    {s === 'budget' ? tr('budget_type_budget') : s === 'mid' ? tr('budget_type_mid') : tr('budget_type_luxury')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp size={16} />
              {tr('budget_calculate')}
            </button>
          </div>
        </div>

        {result && (
          <div className="px-4 mt-4 mb-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Result header */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <p className="text-xs text-emerald-700 font-semibold">{tr('budget_result')}</p>
                </div>
                <p className="text-3xl font-black text-emerald-600">${result.total} USD</p>
                <p className="text-xs text-gray-500 mt-1">
                  {days} {tr('budget_days_unit')} · {people} {tr('budget_people_unit')} · {style === 'budget' ? tr('budget_type_budget') : style === 'mid' ? tr('budget_type_mid') : tr('budget_type_luxury')}
                </p>
              </div>

              {/* Breakdown */}
              <div className="p-4 space-y-3">
                {Object.entries(labelMap).map(([key, label]) => {
                  const pct = Math.round((result[key] / result.total) * 100)
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{emoji[key]}</span>
                          <span className="text-sm text-gray-700 font-medium">{label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">${result[key]}</span>
                          <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-emerald-400 rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-between pt-3 border-t border-gray-100 mt-1">
                  <span className="text-sm font-black text-gray-900">{tr('budget_total')}</span>
                  <span className="text-sm font-black text-emerald-600">${result.total} USD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
