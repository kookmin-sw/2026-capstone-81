import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { Calculator, TrendingUp } from 'lucide-react'

const rates = {
  budget: { flight: 80, hotel: 5, food: 3, activity: 4, transport: 2 },
  mid: { flight: 120, hotel: 10, food: 6, activity: 8, transport: 4 },
  luxury: { flight: 200, hotel: 25, food: 15, activity: 20, transport: 10 },
}
const styleEmoji = { budget: '🎒', mid: '✈️', luxury: '💎' }

export default function DesktopBudget() {
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

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 pt-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <h1 className="text-white font-black text-2xl">{tr('budget_title')}</h1>
          </div>
          <p className="text-emerald-100 text-sm">
            {lang === 'kr' ? '몽골 여행 예산을 미리 계산해보세요' : lang === 'en' ? 'Plan your Mongolia travel budget in advance' : 'Монгол аяллын зардлаа урьдчилан тооцоол'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700">{tr('budget_days')}</label>
                <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full">
                  {days} {tr('budget_days_unit')}
                </span>
              </div>
              <input type="range" min={1} max={21} value={days} onChange={e => setDays(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1일</span><span>7일</span><span>14일</span><span>21일</span>
              </div>
            </div>

            {/* People */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700">{tr('budget_people')}</label>
                <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full">
                  {people} {tr('budget_people_unit')}
                </span>
              </div>
              <input type="range" min={1} max={10} value={people} onChange={e => setPeople(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span><span>3</span><span>5</span><span>10</span>
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-3">{tr('budget_type')}</label>
              <div className="flex gap-3">
                {['budget', 'mid', 'luxury'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-1 ${
                      style === s
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-xl">{styleEmoji[s]}</span>
                    {s === 'budget' ? tr('budget_type_budget') : s === 'mid' ? tr('budget_type_mid') : tr('budget_type_luxury')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 hover:shadow-xl transition-all"
            >
              <TrendingUp size={18} />
              {tr('budget_calculate')}
            </button>
          </div>

          {/* Result card */}
          {result ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <p className="text-sm text-emerald-700 font-semibold">{tr('budget_result')}</p>
                </div>
                <p className="text-4xl font-black text-emerald-600">${result.total} USD</p>
                <p className="text-sm text-gray-500 mt-1">
                  {days}{tr('budget_days_unit')} · {people}{tr('budget_people_unit')} · {style === 'budget' ? tr('budget_type_budget') : style === 'mid' ? tr('budget_type_mid') : tr('budget_type_luxury')}
                </p>
              </div>
              <div className="p-8 space-y-4">
                {Object.entries(labelMap).map(([key, label]) => {
                  const pct = Math.round((result[key] / result.total) * 100)
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span>{emoji[key]}</span>
                          <span className="text-sm text-gray-700 font-medium">{label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">${result[key]}</span>
                          <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-emerald-400 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <span className="font-black text-gray-900">{tr('budget_total')}</span>
                  <span className="font-black text-emerald-600">${result.total} USD</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-12 text-center">
              <span className="text-6xl mb-4">💰</span>
              <p className="text-gray-500 text-sm">
                {lang === 'kr' ? '왼쪽에서 조건을 선택하고\n계산하기를 눌러보세요' : lang === 'en' ? 'Set your conditions on the left\nand click Calculate' : 'Зүүн талаас нөхцөлөө тохируулж\nтооцоолох товчийг дарна уу'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
