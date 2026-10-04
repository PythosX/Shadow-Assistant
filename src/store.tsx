import { createContext, useContext, useState, ReactNode } from 'react'
import { seedMessages, seedAutos, seedReplies, uid } from './data/demo'
const Ctx = createContext<any>(null)
export const useStore = () => useContext(Ctx)
export function Provider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [messages, setMessages] = useState<any[]>(seedMessages())
  const [autos, setAutos] = useState<any[]>(seedAutos())
  const [replies, setReplies] = useState<any[]>(seedReplies())
  const [profile, setProfile] = useState({ name: 'Creator', email: 'demo@shadowassistant.app' })
  const [prefs, setPrefs] = useState<any>({ tone: 'Friendly', length: 'Short', review: true, suggestions: true, nImportant: true, nMessages: true, nAutomation: false })
  const [toasts, setToasts] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const toast = (t: string, kind = 'ok') => { const id = uid(); setToasts(x => [...x, { id, t, kind }]); setTimeout(() => setToasts(x => x.filter(y => y.id !== id)), 3200) }
  const clearData = () => { setMessages([]); setAutos([]); setReplies([]); toast('Demo data cleared') }
  const restoreData = () => { setMessages(seedMessages()); setAutos(seedAutos()); setReplies(seedReplies()); toast('Demo data restored') }
  return <Ctx.Provider value={{ auth, setAuth, messages, setMessages, autos, setAutos, replies, setReplies, profile, setProfile, prefs, setPrefs, toast, clearData, restoreData, requests, setRequests }}>
    {children}
    <div className="toasts" aria-live="polite">{toasts.map(t => <div key={t.id} className={'toast ' + t.kind}>{t.t}</div>)}</div>
  </Ctx.Provider>
}
