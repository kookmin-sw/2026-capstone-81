import { useLang } from '../context/LangContext'

const LANGS = [
  { code: 'kr', label: 'KR' },
  { code: 'en', label: 'EN' },
  { code: 'mn', label: 'MN' },
]

export default function LanguageSwitcher({ dark = false }) {
  const { lang, setLang } = useLang()

  return (
    <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${dark ? 'bg-white/15' : 'bg-gray-100'}`}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
            lang === code
              ? dark
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-white text-gray-900 shadow-sm'
              : dark
              ? 'text-white/60 hover:text-white/90'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
