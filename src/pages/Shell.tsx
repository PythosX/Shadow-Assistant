import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Inbox, MessageSquareReply, KeyRound, Plug, Settings, LogOut, Menu, Bell, Search, HelpCircle } from 'lucide-react'
import { Logo, Avatar } from '../components/ui'
import { useStore } from '../store'
const nav = [['/app', 'Overview', LayoutDashboard], ['/app/inbox', 'Inbox', Inbox], ['/app/auto-replies', 'Auto Replies', MessageSquareReply], ['/app/keywords', 'Keyword Automations', KeyRound], ['/app/integrations', 'Integrations', Plug], ['/app/settings', 'Settings', Settings]] as const
export default function Shell() {
  const [open, setOpen] = useState(false); const nv = useNavigate(); const loc = useLocation()
  const { setAuth, profile, messages, toast } = useStore()
  const unread = messages.filter((m: any) => m.unread).length
  const title = (nav.find(n => n[0] === loc.pathname) || nav[0])[1]
  return <div className="shell">
    <aside className={'side' + (open ? ' open' : '')}>
      <div className="brand"><Logo /><b>Shadow Assistant</b></div>
      <nav>{nav.map(([to, l, I]) => <NavLink key={to} to={to} end={to === '/app'} onClick={() => setOpen(false)}><I size={18} />{l}{l === 'Inbox' && unread > 0 && <i className="count">{unread}</i>}</NavLink>)}</nav>
      <div className="sidefoot"><span className="badge info">Demo workspace</span>
        <Link to="/contact"><HelpCircle size={16} /> Help / contact</Link>
        <button className="ghost" onClick={() => { setAuth(false); nv('/'); toast('Logged out') }}><LogOut size={16} /> Log out</button></div>
    </aside>
    {open && <div className="scrim" onClick={() => setOpen(false)} />}
    <div className="main">
      <header className="top">
        <button className="icon menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
        <h2>{title}</h2>
        <button className="search-btn" onClick={() => nv('/app/inbox')}><Search size={16} /> Search messages</button>
        <button className="icon" aria-label="Notifications" onClick={() => toast(`${messages.filter((m: any) => m.status === 'review').length} conversations await review`)}><Bell size={18} />{unread > 0 && <i className="dot" />}</button>
        <Avatar name={profile.name || 'C'} />
      </header>
      <main className="page"><Outlet /></main>
    </div>
  </div>
}
