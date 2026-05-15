import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { db } from '../firebase'
import {
  ArrowLeft, Calendar, Backpack, Lightbulb, MapPin, Trash2, Loader,
  Sunrise, Sun, Moon, Wallet, Users, Bed, Gauge,
} from 'lucide-react'

function timeIcon(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return <Sunrise size={13} className="text-amber-400" />
  if (h < 18) return <Sun size={13} className="text-orange-400" />
  return <Moon size={13} className="text-indigo-400" />
}

function timeBg(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return 'bg-amber-50 text-amber-600 border-amber-200'
  if (h < 18) return 'bg-orange-50 text-orange-600 border-orange-200'
  return 'bg-indigo-50 text-indigo-600 border-indigo-200'
}

export default function SavedTrip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang } = useLang()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!user?.uid || !id || !db) return
    setLoading(true)
    getDoc(doc(db, 'users', user.uid, 'savedTrips', id))
      .then(snap => {
        if (snap.exists()) setTrip({ id: snap.id, ...snap.data() })
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [user?.uid, id])

  const handleDelete = async () => {
    if (!user?.uid || !id) return
    const ok = window.confirm(lang === 'kr' ? '이 일정을 삭제할까요?' : 'Delete this trip?')
    if (!ok) return
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'savedTrips', id))
      navigate('/profile')
    } catch (err) {
      console.error('[SavedTrip] delete failed', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <Loader size={28} className="text-primary animate-spin" />
      </div>
    )
  }
  if (notFound || !trip) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6 text-center">
        <p className="text-gray-500 mb-4">{lang === 'kr' ? '일정을 찾을 수 없습니다.' : 'Trip not found.'}</p>
        <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">
          {lang === 'kr' ? '프로필로 돌아가기' : 'Back to profile'}
        </button>
      </div>
    )
  }

  const itinerary = trip.plan?.itinerary ?? []
  const packing = trip.plan?.packing ?? []
  const tips = trip.plan?.tips ?? []

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">
            {lang === 'kr' ? '저장된 AI 일정' : lang === 'en' ? 'Saved Plan' : 'Хадгалсан хуваарь'}
          </p>
          <h1 className="text-base font-black text-gray-900 truncate">{trip.title}</h1>
        </div>
        <button onClick={handleDelete} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="px-4 py-4 pb-12">
        {/* Profile summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-primary" /> {trip.days}{lang === 'kr' ? '일' : ' days'}
          </div>
          {trip.budget && (
            <div className="flex items-center gap-2 text-gray-600">
              <Wallet size={14} className="text-primary" /> {trip.budget}
            </div>
          )}
          {trip.pace && (
            <div className="flex items-center gap-2 text-gray-600">
              <Gauge size={14} className="text-primary" /> {trip.pace}
            </div>
          )}
          {trip.groupType && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={14} className="text-primary" /> {trip.groupType}
            </div>
          )}
          {trip.accommodation && (
            <div className="flex items-center gap-2 text-gray-600">
              <Bed size={14} className="text-primary" /> {trip.accommodation}
            </div>
          )}
          {trip.departureCity && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} className="text-primary" /> {trip.departureCity}
            </div>
          )}
        </div>

        {/* Days */}
        <div className="space-y-3">
          {itinerary.map(day => (
            <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/8 to-transparent border-b border-gray-100">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {day.day}
                </span>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">
                    {lang === 'kr' ? `${day.day}일차` : `Day ${day.day}`}
                  </p>
                  <p className="font-black text-gray-900 text-sm">{day.title}</p>
                </div>
              </div>
              <div className="px-4 py-3 space-y-0">
                {(day.activities ?? []).map((act, i) => (
                  <div key={i} className="flex gap-3 relative py-1.5">
                    {i < (day.activities?.length ?? 0) - 1 && (
                      <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-100" />
                    )}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 w-9">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center bg-white ${timeBg(act.time)}`}>
                        {timeIcon(act.time)}
                      </div>
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${timeBg(act.time)}`}>
                        {act.time}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      {act.location_name && (
                        <p className="text-[10px] font-bold text-primary mb-0.5">{act.location_name}</p>
                      )}
                      <p className="text-xs text-gray-700 leading-relaxed">{act.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Packing + Tips */}
        {packing.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
            <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-2">
              <Backpack size={15} className="text-primary" />
              {lang === 'kr' ? '준비물' : lang === 'en' ? 'Packing' : 'Бэлдэх зүйлс'}
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
              {packing.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}
        {tips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
            <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-2">
              <Lightbulb size={15} className="text-primary" />
              {lang === 'kr' ? '여행 팁' : lang === 'en' ? 'Tips' : 'Зөвлөмж'}
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
              {tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
