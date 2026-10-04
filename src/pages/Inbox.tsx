import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Star } from 'lucide-react'
import { useStore } from '../store'
import { Badge, Avatar, Empty } from '../components/ui'
import { suggestions } from '../data/demo'
export function Overview() {
  const { messages, autos } = useStore(); const nv = useNavigate()
  const stats = [['Total messages', messages.length ? 248 : 0], ['Auto-replied', messages.length ? 176 : 0], ['Awaiting review', messages.filter((m: any) => m.status === 'review').length], ['Active keyword rules', autos.filter((a: any) => a.active).length]]
  return <>
    <div className="spread"><div><h1>Good evening, Creator.</h1><p className="muted">Here's what's happening in your workspace.</p></div><span className="badge info">Demo data</span></div>
    <div className="stats">{stats.map(([l, v]) => <div className="card stat" key={l as string}><small>{l}</small><b>{v}</b></div>)}</div>
    <div className="quick">{[['Open inbox', '/app/inbox'], ['Create keyword rule', '/app/keywords'], ['Configure auto replies', '/app/auto-replies'], ['View integrations', '/app/integrations']].map(([l, to]) => <Link key={to} className="btn ghostb" to={to}>{l}</Link>)}</div>
    <div className="two">
      <section className="card"><h3>Recent messages</h3>{messages.length === 0 ? <Empty title="No conversations yet." hint="Restore demo data in Settings." /> :
        <div className="tablewrap"><table><thead><tr><th>Sender</th><th>Message</th><th>Channel</th><th>Intent</th><th>Status</th><th>Time</th></tr></thead><tbody>
          {messages.slice(0, 5).map((m: any) => <tr key={m.id} className="click" tabIndex={0} onClick={() => nv('/app/inbox', { state: { id: m.id } })} onKeyDown={e => e.key === 'Enter' && nv('/app/inbox', { state: { id: m.id } })}>
            <td><span className="who"><Avatar name={m.sender} />{m.sender}</span></td><td className="cut">{m.thread[0].text}</td><td>{m.channel}</td><td><span className="chip">{m.intent}</span></td><td><Badge k={m.status} /></td><td>{m.time}</td></tr>)}</tbody></table></div>}</section>
      <section className="card"><h3>Automation activity <small className="muted">(demo)</small></h3>
        <ul className="act">{['Keyword matched: GUIDE', 'Automatic response prepared', 'Routine question answered', 'Conversation flagged for review'].map((t, i) => <li key={t}><i className={'dot2 ' + (i === 3 ? 'warn' : 'ok')} />{t}<small>{(i + 1) * 7}m ago</small></li>)}</ul></section>
    </div></>
}
export function Inbox() {
  const { messages, setMessages, prefs, toast } = useStore()
  const [q, setQ] = useState(''); const [f, setF] = useState('All'); const [ch, setCh] = useState('All'); const [it, setIt] = useState('All')
  const [sel, setSel] = useState<string | null>((history.state?.usr?.id) || null); const [text, setText] = useState('')
  const list = messages.filter((m: any) => (f === 'All' || (f === 'Unread' && m.unread) || (f === 'Awaiting review' && m.status === 'review') || (f === 'Auto-replied' && m.status === 'auto') || (f === 'Important' && m.important)) && (ch === 'All' || m.channel === ch) && (it === 'All' || m.intent === it) && (m.sender + ' ' + m.thread.map((t: any) => t.text).join(' ')).toLowerCase().includes(q.toLowerCase()))
  const cur = messages.find((m: any) => m.id === sel)
  const upd = (id: string, fn: (m: any) => any) => setMessages((ms: any[]) => ms.map(m => m.id === id ? fn(m) : m))
  const open = (id: string) => { setSel(id); setText(''); upd(id, m => ({ ...m, unread: false })) }
  const send = (t: string, status?: string) => { if (!t.trim()) return; upd(cur.id, m => ({ ...m, status: status || (m.status === 'review' ? 'review' : 'auto'), thread: [...m.thread, { from: 'me', text: t.trim(), time: 'Now', demo: true }] })); setText(''); toast('Demo reply added (nothing was sent)') }
  const chs = ['All', ...Array.from(new Set(messages.map((m: any) => m.channel)))], ints = ['All', ...Array.from(new Set(messages.map((m: any) => m.intent)))]
  return <div className={'inbox' + (cur ? ' showing' : '')}>
    <div className="ilist">
      <input placeholder="Search messages" aria-label="Search messages" value={q} onChange={e => setQ(e.target.value)} />
      <div className="tabs">{['All', 'Unread', 'Awaiting review', 'Auto-replied', 'Important'].map(x => <button key={x} className={f === x ? 'on' : ''} onClick={() => setF(x)}>{x}</button>)}</div>
      <div className="row"><select aria-label="Channel" value={ch} onChange={e => setCh(e.target.value)}>{chs.map(c => <option key={c}>{c}</option>)}</select><select aria-label="Intent" value={it} onChange={e => setIt(e.target.value)}>{ints.map(c => <option key={c}>{c}</option>)}</select></div>
      {list.length === 0 ? <Empty title="No conversations yet." hint="Try clearing filters." /> : list.map((m: any) => <button key={m.id} className={'irow' + (sel === m.id ? ' on' : '')} onClick={() => open(m.id)}>
        <Avatar name={m.sender} /><div><b>{m.sender}{m.unread && <i className="dot" />}{m.important && <Star size={12} className="warnc" />}</b><small className="cut">{m.thread[m.thread.length - 1].text}</small><span className="meta">{m.channel} · <Badge k={m.status} /></span></div><small>{m.time}</small></button>)}
    </div>
    <div className="iconv">{!cur ? <Empty title="Select a conversation" hint="Pick a message to read and reply." /> : <>
      <div className="convh"><button className="icon back" aria-label="Back to list" onClick={() => setSel(null)}><ArrowLeft /></button><Avatar name={cur.sender} /><div><b>{cur.sender}</b><small>{cur.channel} · {cur.intent}</small></div><Badge k={cur.status} /></div>
      {cur.status === 'review' && <div className="review"><b>Needs your attention</b><p>Reason: {cur.intent === 'Unclear' ? 'unclear request' : cur.intent + ' inquiry'} — held for human review.</p>
        {cur.draft && <p className="draft">Draft: {cur.draft}</p>}
        <div className="row"><button className="btn primary sm" onClick={() => send(cur.draft || suggestions[cur.intent], 'auto')}>Approve</button><button className="btn ghostb sm" onClick={() => setText(cur.draft || '')}>Edit</button><button className="btn ghostb sm" onClick={() => { upd(cur.id, m => ({ ...m, status: 'open' })); toast('You took over this conversation') }}>Take over</button></div></div>}
      <div className="thread">{cur.thread.map((t: any, i: number) => <div key={i} className={'bubble ' + t.from}><small>{t.from === 'me' ? 'You' : cur.sender} · {t.time}{t.demo && ' · Demo reply'}</small>{t.text}</div>)}</div>
      <div className="composer">
        {prefs.suggestions && <div className="sug"><Sparkles size={14} /> <span>Demo suggestion: {suggestions[cur.intent]}</span><button className="link" onClick={() => setText(suggestions[cur.intent])}>Insert</button></div>}
        <textarea rows={3} placeholder="Write a reply" aria-label="Reply" value={text} onChange={e => setText(e.target.value)} />
        <div className="row"><button className="btn primary sm" onClick={() => send(text)}><Send size={14} /> Send (demo)</button>
          {prefs.suggestions && <button className="btn ghostb sm" onClick={() => setText(suggestions[cur.intent])}><Sparkles size={14} /> AI suggestion</button>}
          <button className="btn ghostb sm" onClick={() => setText('')}>Clear</button></div></div></>}</div>
  </div>
}
