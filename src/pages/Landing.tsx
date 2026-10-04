import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Repeat, EyeOff, Link2, Inbox, Sparkles, KeyRound, ShieldCheck, ArrowRight, Check } from 'lucide-react'
import { Logo, Reveal, Badge } from '../components/ui'
import { integrations } from '../data/demo'
const sections = ['product', 'features', 'how', 'integrations']
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const kw: Record<string, [string, string]> = { GUIDE: ['Here\'s the guide you requested: example.com/guide', 'Guide link'], TEMPLATE: ['Here is the template: example.com/template', 'Template link'], COURSE: ['Here is the course information: example.com/course', 'Course information'] }
export default function Landing() {
  const [scrolled, setScrolled] = useState(false); const [menu, setMenu] = useState(false); const [active, setActive] = useState(''); const [k, setK] = useState('GUIDE'); const nv = useNavigate()
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 24); s(); window.addEventListener('scroll', s)
    const o = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach(i => { const el = document.getElementById(i); el && o.observe(el) })
    return () => { window.removeEventListener('scroll', s); o.disconnect() }
  }, [])
  const links = [['product', 'Product'], ['features', 'Features'], ['how', 'How it works'], ['integrations', 'Integrations']]
  return <div className="landing">
    <div className="glow" aria-hidden="true" />
    <nav className={'lnav' + (scrolled || menu ? ' solid' : '')}>
      <Link to="/" className="brand"><Logo /><b>Shadow Assistant</b></Link>
      <div className={'links' + (menu ? ' open' : '')}>
        {links.map(([id, l]) => <button key={id} className={active === id ? 'on' : ''} onClick={() => { go(id); setMenu(false) }}>{l}</button>)}
        <button onClick={() => nv('/contact')}>Contact</button>
        <Link className="btn ghostb" to="/login">Log in</Link><Link className="btn primary" to="/login">Launch demo</Link>
      </div>
      <button className="icon burger" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </nav>

    <section className="hero" id="product">
      <div className="heroText">
        <h1>Your audience is growing. Your inbox shouldn't slow you down.</h1>
        <p className="lead">Meet Shadow Assistant — the AI-powered workspace that helps creators manage messages, automate routine replies and share resources without repeating themselves.</p>
        <div className="row"><Link className="btn primary lg" to="/login">Explore the demo</Link><button className="btn ghostb lg" onClick={() => go('how')}>See how it works</button></div>
        <small className="note">Built for creators who have more to do than answer the same DM.</small>
      </div>
      <div className="preview" aria-label="Product preview (demo)">
        <div className="pv pv1"><div className="pvh"><Inbox size={14} /> Inbox <span className="badge info">3 new</span></div>
          {[['Aarav M.', 'Comment: GUIDE', 'Auto-replied'], ['Sana I.', 'Which microphone do you use?', 'Open'], ['Northwave Audio', 'Paid collaboration inquiry', 'Review']].map(r => <div className="pvrow" key={r[0]}><span className="avatar sm">{r[0][0]}</span><div><b>{r[0]}</b><small>{r[1]}</small></div><i>{r[2]}</i></div>)}</div>
        <div className="pv pv2"><div className="pvh"><Sparkles size={14} /> Suggested reply</div><p>You can find the equipment list here: example.com/gear</p><div className="row"><span className="chip">Edit</span><span className="chip ok">Approve</span></div></div>
        <div className="pv pv3"><div className="pvh"><KeyRound size={14} /> Keyword matched</div><p><b className="kw">GUIDE</b> → Here's the guide you requested: example.com/guide</p><small className="muted">Demo data</small></div>
      </div>
    </section>

    <section className="sec" id="problem"><Reveal><h2>Less repetition. More creation.</h2></Reveal>
      <div className="grid3">
        {[[Repeat, 'Repetitive questions', 'Answering the same questions and sending the same links takes time away from creating.'], [EyeOff, 'Missed conversations', 'Important inquiries can get buried beneath routine messages.'], [Link2, 'Manual resource sharing', 'Followers often comment a specific word to request a guide, template or link. Sending every resource manually becomes repetitive.']].map(([I, t, d]: any, i) => <Reveal key={t} d={i * 90}><div className="card"><I size={22} className="ac" /><h3>{t}</h3><p>{d}</p></div></Reveal>)}
      </div>
      <Reveal><p className="center muted">Shadow Assistant organizes incoming messages, suggests replies, automates the keyword responses you configure, and keeps important conversations visible.</p></Reveal></section>

    <section className="sec" id="features"><Reveal><h2>Four ways it keeps you in control.</h2></Reveal>
      <div className="grid2">
        {[[Inbox, 'Every conversation, organized.', 'Review incoming messages in one workspace, understand their status and find conversations that need attention.', ['Priority labels', 'Unread indicators', 'Search and filters']],
        [Sparkles, 'Replies that start with context.', 'Use AI-assisted suggestions for common questions and review responses before sending when needed.', ['Suggested reply', 'Edit before sending', 'Human review indicator']],
        [KeyRound, 'One word. The right resource.', 'Configure a keyword and its corresponding message or link. When a matching comment is received on a supported integration, the automation can respond with the resource.', ['Keyword → response', 'Pause any rule', 'Preview before activating']],
        [ShieldCheck, 'Automation with a human in control.', 'Keep important, unusual or sensitive conversations available for manual review instead of treating every message the same.', ['Escalation indicator', 'Draft response', 'Take-over action']]].map(([I, t, d, b]: any, i) => <Reveal key={t} d={i * 80}><div className="card feat"><I size={22} className="ac" /><h3>{t}</h3><p>{d}</p><ul>{b.map((x: string) => <li key={x}><Check size={14} />{x}</li>)}</ul></div></Reveal>)}
      </div></section>

    <section className="sec" id="how"><Reveal><h2>How it works</h2></Reveal>
      <div className="steps">{[['Connect your workspace', 'Choose an available integration or explore the demo workspace.'], ['Configure your assistant', 'Set up reply preferences, create keyword rules and choose which messages should be reviewed.'], ['Manage conversations', 'Review incoming messages, use reply suggestions and monitor your automations.']].map(([t, d], i) => <Reveal key={t} d={i * 120}><div className="step"><span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></section>

    <section className="sec" id="keywords"><Reveal><h2>Turn comments into resource delivery.</h2><p className="center muted">Let followers request a resource using a specific word, then match that word to a response you've configured.</p></Reveal>
      <div className="kwdemo">
        <div className="kwpick">{Object.keys(kw).map(x => <button key={x} className={'kwb' + (k === x ? ' on' : '')} onClick={() => setK(x)}>{x}</button>)}</div>
        <div className="kwflow"><div className="bubble them"><small>Follower comment</small>{k}</div><span className="wire" aria-hidden="true" /><div className="bubble me" key={k}><small>{kw[k][1]} · example URL, illustrative only</small>{kw[k][0]}</div></div></div>
      <div className="center"><Link className="btn primary lg" to="/login">Create your first automation</Link></div></section>

    <section className="sec" id="integrations"><Reveal><h2>Designed to work with your creator workflow.</h2></Reveal>
      <div className="grid3">{integrations.map((x, i) => <Reveal key={x.id} d={i * 60}><div className="card"><div className="spread"><h3>{x.name}</h3><Badge k={x.id === 'telegram' ? 'Setup required' : 'Planned'} /></div><p>{x.cap}</p></div></Reveal>)}</div>
      <div className="center"><Link className="btn ghostb" to="/contact">Request an integration</Link></div></section>

    <section className="sec cta"><h2>Make room for your next idea.</h2><p className="muted">Explore a creator workspace designed to reduce repetitive inbox work.</p><div className="row c"><Link className="btn primary lg" to="/login">Explore demo</Link><Link className="btn ghostb lg" to="/contact">Contact</Link></div></section>

    <footer className="foot"><div><div className="brand"><Logo /><b>Shadow Assistant</b></div><p className="muted">Shadow Assistant — Built for creators.</p></div>
      <div className="flinks"><button onClick={() => go('product')}>Product</button><Link to="/contact">Contact</Link><Link to="/contact">Integrations</Link><Link to="/login">Demo</Link></div><small className="muted">© {new Date().getFullYear()} Shadow Assistant. Hackathon demo.</small></footer>
  </div>
}
