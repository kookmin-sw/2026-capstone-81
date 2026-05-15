import { db } from '../firebase'
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query as fbQuery, orderBy, serverTimestamp,
} from 'firebase/firestore'

// All saved trips for one user live under /users/{uid}/savedTrips/{tripId}.
// Each doc holds the full plan returned by /api/plan plus the user's chosen
// inputs so we can render and re-export the trip later.

function tripsCol(uid) {
  return collection(db, 'users', uid, 'savedTrips')
}

export async function saveTrip(uid, payload) {
  if (!db || !uid) throw new Error('Not signed in')
  const ref = await addDoc(tripsCol(uid), {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteTrip(uid, tripId) {
  if (!db || !uid || !tripId) return
  await deleteDoc(doc(db, 'users', uid, 'savedTrips', tripId))
}

// Subscribe to a user's saved trips, newest first. Returns the unsubscribe fn.
export function watchTrips(uid, onChange) {
  if (!db || !uid) return () => {}
  const q = fbQuery(tripsCol(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    snap => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    () => {}
  )
}

// Helper: derive a short human title from a plan when the user hasn't
// typed one. Falls back to "N-day Mongolia Trip".
export function defaultTripTitle(plan, days, lang = 'kr') {
  const first = plan?.itinerary?.[0]?.title
  if (first) return first.length > 40 ? first.slice(0, 40) + '…' : first
  if (lang === 'kr') return `${days}일 몽골 여행`
  if (lang === 'mn') return `${days} өдрийн Монгол аялал`
  return `${days}-day Mongolia trip`
}
