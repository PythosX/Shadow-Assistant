import { useEffect, useRef, useState, ReactNode } from 'react'
export const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B5CF6"/><stop offset="1" stopColor="#22D3EE"/></linearGradient></defs>
    <path d="M22 4a12 12 0 1 0 0 24A10 10 0 0 1 22 4z" fill="url(#lg)"/><path d="M14 12h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 3v-3h-3a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" fill="#08090D" stroke="#C4B5FD" strokeWidth="1.5"/></svg>)
export function Reveal({ children, d = 0 }: { children: ReactNode; d?: number }) {
  const r = useRef<HTMLDivElement>(null); const [v, setV] = useState(false)
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect() } }, { threshold: .15 }); r.current && o.observe(r.current); return () => o.disconnect() }, [])
  return <div ref={r} className={'reveal' + (v ? ' in' : '')} style={{ transitionDelay: d + 'ms' }}>{children}</div>
}
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-label={title}><h3>{title}</h3>{children}</div></div>
}
export const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => <label className="field"><span>{label}</span>{children}{error && <em className="err" role="alert">{error}</em>}</label>
const tone: Record<string, string> = { auto: 'ok', review: 'warn', open: 'info', Active: 'ok', Paused: 'mute', 'Demo available': 'ok', 'Setup required': 'warn', Planned: 'mute', Connected: 'ok' }
const label: Record<string, string> = { auto: 'Auto-replied', review: 'Awaiting review', open: 'Open' }
export const Badge = ({ k }: { k: string }) => <span className={'badge ' + (tone[k] || 'mute')}>{label[k] || k}</span>
export const Empty = ({ title, hint }: { title: string; hint?: string }) => <div className="empty"><b>{title}</b>{hint && <p>{hint}</p>}</div>
export const Avatar = ({ name }: { name: string }) => <span className="avatar">{name.split(' ').map(s => s[0]).slice(0, 2).join('')}</span>
