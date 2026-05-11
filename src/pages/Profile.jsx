import { useState } from 'react'
import { ChevronRight, LogOut, Globe, Edit3, Mail, User as UserIcon, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../utils/authErrors'
import { auth } from '../firebase'
import { updateProfile } from 'firebase/auth'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const flags = { kr: '\u{1F1F0}\u{1F1F7}', en: '\u{1F1FA}\u{1F1F8}', mn: '\u{1F1F2}\u{1F1F3}' }
const langNames = { kr: '\uD55C\uAD6D\uC5B4', en: 'English', mn: '\u041C\u043E\u043D\u0433\u043E\u043B' }
const defaultNames = { kr: '\uC5EC\uD589\uC790', en: 'Traveler', mn: '\u0410\u044F\u043B\u0430\u0433\u0447' }

export default function Profile() {
  const navigate = useNavigate()
  const { tr, lang, setLang } = useLang()
  const { user, logout } = useAuth()
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const L = {
    kr: { mypage: '\uB9C8\uC774\uD398\uC774\uC9C0', info: '\uB0B4 \uC815\uBCF4', name: '\uC774\uB984', email: '\uC774\uBA54\uC77C', uid: '\uD68C\uC6D0 ID', joined: '\uAC00\uC785\uC77C', edit: '\uC218\uC815', save: '\uC800\uC7A5', cancel: '\uCDE8\uC18C', editProfile: '\uAC1C\uC778\uC815\uBCF4 \uC218\uC815', langLabel: '\uC5B8\uC5B4 \uC124\uC815', logout: '\uB85C\uADF8\uC544\uC6C3', login: '\uB85C\uADF8\uC778\uD558\uC138\uC694', loginSub: '\uB85C\uADF8\uC778\uD558\uBA74 \uB354 \uB9CE\uC740 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694', loginBtn: '\uB85C\uADF8\uC778 / \uD68C\uC6D0\uAC00\uC785' },
    en: { mypage: 'My Page', info: 'My Info', name: 'Name', email: 'Email', uid: 'User ID', joined: 'Joined', edit: 'Edit', save: 'Save', cancel: 'Cancel', editProfile: 'Edit Profile', langLabel: 'Language', logout: 'Log Out', login: 'Please log in', loginSub: 'Log in to access all features', loginBtn: 'Log In / Sign Up' },
    mn: { mypage: '\u041C\u0438\u043D\u0438\u0439 \u0445\u0443\u0443\u0434\u0430\u0441', info: '\u041C\u0438\u043D\u0438\u0439 \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B', name: '\u041D\u044D\u0440', email: '\u0418-\u043C\u044D\u0439\u043B', uid: 'ID', joined: '\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u0441\u044D\u043D', edit: '\u0417\u0430\u0441\u0430\u0445', save: '\u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0445', cancel: '\u0426\u0443\u0446\u043B\u0430\u0445', editProfile: '\u041C\u044D\u0434\u044D\u044D\u043B\u044D\u043B \u0437\u0430\u0441\u0430\u0445', langLabel: '\u0425\u044D\u043B', logout: '\u0413\u0430\u0440\u0430\u0445', login: '\u041D\u044D\u0432\u0442\u0440\u044D\u043D\u044D \u04AF\u04AF', loginSub: '\u041D\u044D\u0432\u0442\u0440\u044D\u0436 \u0431\u04AF\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0438\u0439\u0433 \u0430\u0448\u0438\u0433\u043B\u0430\u0430\u0440\u0430\u0439', loginBtn: '\u041D\u044D\u0432\u0442\u0440\u044D\u0445 / \u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445' },
  }
  const l = L[lang] || L.en

  const startEdit = () => { setEditName(user?.displayName || ''); setEditing(true) }

  const saveProfile = async () => {
    if (!auth.currentUser) return
    try { setSaving(true); await updateProfile(auth.currentUser, { displayName: editName.trim() || null }); setEditing(false) }
    catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleLogout = async () => {
    try { setLogoutError(''); await logout(); navigate('/') }
    catch (err) { setLogoutError(getAuthErrorMessage(err.code, lang, tr)) }
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <UserIcon size={32} className="text-gray-300" />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-1">{l.login}</h2>
          <p className="text-sm text-gray-400 mb-6">{l.loginSub}</p>
          <button onClick={() => navigate('/login')}
            className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 text-sm">
            {l.loginBtn}
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const displayName = user.displayName || defaultNames[lang]
  const createdDate = user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '-'

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile hero */}
        <div className="bg-white px-5 pt-6 pb-5">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-2xl border-2 border-primary/20">
                🧳
              </div>
            )}
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    className="flex-1 text-lg font-bold text-gray-900 border-b-2 border-primary outline-none bg-transparent py-0.5" autoFocus />
                  <button onClick={saveProfile} disabled={saving} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><Check size={14} /></button>
                  <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-lg font-black text-gray-900">{displayName}</p>
                  <button onClick={startEdit} className="text-gray-400 hover:text-primary transition-colors"><Edit3 size={14} /></button>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* My Info */}
        <div className="px-5 mt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{l.info}</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
              <UserIcon size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500 w-16">{l.name}</span>
              <span className="text-sm font-semibold text-gray-900 flex-1">{displayName}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500 w-16">{l.email}</span>
              <span className="text-sm font-semibold text-gray-900 flex-1 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-gray-400 text-sm">📅</span>
              <span className="text-sm text-gray-500 w-16">{l.joined}</span>
              <span className="text-sm text-gray-700 flex-1">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="px-5 mt-3">
          <button onClick={startEdit} className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100 active:scale-[0.99] transition-all">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center"><Edit3 size={16} className="text-primary" /></div>
            <span className="flex-1 text-sm font-semibold text-gray-800 text-left">{l.editProfile}</span>
            <ChevronRight size={15} className="text-gray-300" />
          </button>
        </div>

        {/* Language */}
        <div className="px-5 mt-3">
          <button onClick={() => setShowLangPicker(!showLangPicker)} className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-lg">{flags[lang]}</div>
            <span className="flex-1 text-sm font-semibold text-gray-800 text-left">{l.langLabel}</span>
            <span className="text-xs text-gray-400 font-medium">{langNames[lang]}</span>
            <ChevronRight size={15} className={`text-gray-300 transition-transform ${showLangPicker ? 'rotate-90' : ''}`} />
          </button>
          {showLangPicker && (
            <div className="bg-white rounded-2xl border border-gray-100 mt-1.5 overflow-hidden">
              {Object.entries(langNames).map(([code, name]) => (
                <button key={code} onClick={() => { setLang(code); setShowLangPicker(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${lang === code ? 'bg-primary-light/50' : 'hover:bg-gray-50'}`}>
                  <span className="text-xl">{flags[code]}</span>
                  <span className={`text-sm font-semibold flex-1 text-left ${lang === code ? 'text-primary' : 'text-gray-700'}`}>{name}</span>
                  {lang === code && <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="px-5 mt-3 mb-4">
          {logoutError && <div className="bg-red-50 text-red-500 text-xs rounded-xl px-3 py-2 mb-2 text-center">{logoutError}</div>}
          <button onClick={handleLogout} className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100 active:scale-[0.99] transition-all">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><LogOut size={16} className="text-red-400" /></div>
            <span className="flex-1 text-sm font-semibold text-red-400 text-left">{l.logout}</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
