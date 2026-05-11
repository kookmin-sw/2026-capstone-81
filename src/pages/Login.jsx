import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../utils/authErrors'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { NomadLogoIcon, NomadLogoText } from '../components/NomadLogo'

export default function Login() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()
  const { login, signup, loginWithGoogle, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('')
    if (isReset) { handleReset(); return }
    if (!email.trim() || !password.trim()) { setError(tr('auth_enter_email_password')); return }
    try {
      setLoading(true)
      if (isSignUp) await signup(email, password)
      else await login(email, password)
      navigate('/home')
    } catch (err) { setError(getAuthErrorMessage(err.code, lang, tr)) }
    finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setError(''); setSuccessMsg('')
    try { setLoading(true); await loginWithGoogle(); navigate('/home') }
    catch (err) { setError(getAuthErrorMessage(err.code, lang, tr)) }
    finally { setLoading(false) }
  }

  const handleReset = async () => {
    setError(''); setSuccessMsg('')
    if (!email.trim()) { setError(tr('auth_enter_email')); return }
    try { setLoading(true); await resetPassword(email); setSuccessMsg(tr('auth_reset_email_sent')) }
    catch (err) { setError(getAuthErrorMessage(err.code, lang, tr)) }
    finally { setLoading(false) }
  }

  const title = isReset ? tr('auth_reset_password') : isSignUp ? tr('auth_signup_title') : tr('auth_login_title')
  const btnText = isReset ? tr('auth_reset_password') : isSignUp ? tr('auth_signup_btn') : tr('auth_login_btn')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 flex flex-col items-center">
          <NomadLogoIcon size={56} />
          <div className="mt-2"><NomadLogoText className="text-2xl" /></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 text-center mb-4">{title}</h2>

          {error && <div className="bg-red-50 text-red-500 text-xs px-3 py-2 rounded-lg text-center mb-3">{error}</div>}
          {successMsg && <div className="bg-primary-light text-secondary text-xs px-3 py-2 rounded-lg text-center mb-3">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-primary transition-colors">
              <Mail size={14} className="text-gray-400" />
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="email@example.com"
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" />
            </div>

            {!isReset && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-primary transition-colors">
                <Lock size={14} className="text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="password"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}

            {!isSignUp && !isReset && (
              <div className="text-right">
                <button type="button" onClick={() => { setIsReset(true); setError(''); setSuccessMsg('') }}
                  className="text-xs text-primary font-medium">{tr('auth_forgot_password')}</button>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50 transition-all">
              {loading ? tr('auth_loading') : btnText}
            </button>
          </form>

          {isReset && (
            <button onClick={() => { setIsReset(false); setError(''); setSuccessMsg('') }}
              className="w-full text-center text-xs text-primary font-medium mt-3">{tr('auth_login_btn')}</button>
          )}

          {!isReset && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{tr('or')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-all">
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                Google
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                {isSignUp ? tr('auth_has_account') : tr('auth_no_account')}{' '}
                <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg('') }}
                  className="text-primary font-semibold">
                  {isSignUp ? tr('auth_login_btn') : tr('auth_signup_btn')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

