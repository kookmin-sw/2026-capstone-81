import { createContext, useContext, useState } from 'react'
import { t } from '../data/translations'

const LangContext = createContext(null)

function detectLang() {
  const nav = navigator.language || 'en'
  if (nav.startsWith('ko')) return 'kr'
  if (nav.startsWith('mn')) return 'mn'
  return 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(detectLang)

  const tr = (key) => t[lang]?.[key] ?? t['en'][key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
