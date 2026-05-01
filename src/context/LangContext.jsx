import { createContext, useContext, useState } from 'react'
import { t } from '../data/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('kr')

  const tr = (key) => t[lang]?.[key] ?? t['kr'][key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
