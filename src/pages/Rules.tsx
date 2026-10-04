import { useState } from 'react'
import { Plus, Pencil, Trash2, Copy } from 'lucide-react'
import { useStore } from '../store'
import { Modal, Field, Badge, Empty } from '../components/ui'
import { uid } from '../data/demo'
import { matchRule, buildResponse, AutomationRule } from '../lib/match'
import { isUrl } from '../lib/validate'
const Toggle = ({ on, set, label }: { on: boolean; set: () => void; label: string }) => <button role="switch" aria-checked={on} aria-label={label} className={'sw' + (on ? ' on' : '')} onClick={set}><i /></button>
export function AutoReplies() {
  const { replies, setReplies, toast } = useStore(); const [q, setQ] = useState(''); const [st, setSt] = useState('All'); const [ed, setEd] = useState<any>(null); const [del, setDel] = useState<any>(null); const [er, setEr] = useState<any>({})
  const list = replies.filter((r: any) => (st === 'All' || (st === 'Enabled') === r.active) && (r.name + r.example + r.response).toLowerCase().includes(q.toLowerCase()))
  const save = () => { const x: any = {}; if (!ed.name.trim()) x.name = 'Enter a rule name.'; if (!ed.response.trim()) x.response = 'Enter a response.'; setEr(x); if (Object.keys(x).length) return
    setReplies((rs: any[]) => rs.some(r => r.id === ed.id) ? rs.map(r => r.id === ed.id ? { ...ed, updated: 'Just now' } : r) : [{ ...ed, updated: 'Just now' }, ...rs]); setEd(null); toast('Reply rule saved') }
  return <>
    <div className="spread"><div><h1>Auto Replies</h1><p className="muted">Manage the responses your assistant can suggest or use for routine messages.</p></div><button className="btn primary" onClick={() => { setEr({}); setEd({ id: uid(), name: '', example: '', response: '', active: true }) }}><Plus size={16} /> Create reply rule</button></div>
    <p className="note2">Demo only: these rules are not active on any real social platform.</p>
    <div className="row"><input placeholder="Search rules" aria-label="Search rules" value={q} onChange={e => setQ(e.target.value)} /><select aria-label="Status" value={st} onChange={e => setSt(e.target.value)}><option>All</option><option>Enabled</option><option>Disabled</option></select></div>
    {list.length === 0 ? <Empty title="Create your first rule." hint="Rules appear here once added." /> : <div className="stack">{list.map((r: any) => <div className="card rule" key={r.id}>
      <div><div className="spread"><h3>{r.name}</h3><Badge k={r.active ? 'Active' : 'Paused'} /></div><small className="muted">Example: "{r.example}"</small><p>{r.response}</p><small className="muted">Updated {r.updated}</small></div>
      <div className="acts"><Toggle on={r.active} label={`Toggle ${r.name}`} set={() => setReplies(replies.map((x: any) => x.id === r.id ? { ...x, active: !x.active } : x))} /><button className="icon" aria-label="Edit" onClick={() => { setEr({}); setEd(r) }}><Pencil size={16} /></button><button className="icon" aria-label="Delete" onClick={() => setDel(r)}><Trash2 size={16} /></button></div></div>)}</div>}
    {ed && <Modal title={replies.some((r: any) => r.id === ed.id) ? 'Edit reply rule' : 'Create reply rule'} onClose={() => setEd(null)}>
      <Field label="Rule name" error={er.name}><input value={ed.name} onChange={e => setEd({ ...ed, name: e.target.value })} /></Field>
      <Field label="Example question"><input value={ed.example} onChange={e => setEd({ ...ed, example: e.target.value })} /></Field>
      <Field label="Response" error={er.response}><textarea rows={3} value={ed.response} onChange={e => setEd({ ...ed, response: e.target.value })} /></Field>
      <div className="row"><button className="btn primary" onClick={save}>Save rule</button><button className="btn ghostb" onClick={() => setEd(null)}>Cancel</button></div></Modal>}
    {del && <Modal title="Delete this rule?" onClose={() => setDel(null)}><p className="muted">"{del.name}" will be removed from this demo workspace.</p><div className="row"><button className="btn danger" onClick={() => { setReplies(replies.filter((r: any) => r.id !== del.id)); setDel(null); toast('Rule deleted') }}>Delete rule</button><button className="btn ghostb" onClick={() => setDel(null)}>Cancel</button></div></Modal>}
  </>
}
const blank = (): AutomationRule => ({ id: uid(), name: '', keyword: '', match: 'ci', platform: 'Demo', response: '', url: '', active: true, triggers: 0 })
export function Keywords() {
  const { autos, setAutos, toast } = useStore(); const [q, setQ] = useState(''); const [st, setSt] = useState('All'); const [ed, setEd] = useState<AutomationRule | null>(null); const [er, setEr] = useState<any>({}); const [del, setDel] = useState<any>(null)
  const [sample, setSample] = useState('Can I get the GUIDE please?'); const hit = matchRule(sample, autos)
  const list = autos.filter((r: AutomationRule) => (st === 'All' || (st === 'Active') === r.active) && (r.keyword + r.name + r.response).toLowerCase().includes(q.toLowerCase()))
  const top = [...autos].sort((a: any, b: any) => b.triggers - a.triggers)[0]
  const dupe = ed && autos.some((r: AutomationRule) => r.id !== ed.id && r.platform === ed.platform && r.keyword.trim().toLowerCase() === ed.keyword.trim().toLowerCase() && ed.keyword.trim())
  const save = () => { const x: any = {}; if (!ed!.keyword.trim()) x.keyword = 'Enter a trigger keyword.'; if (!ed!.response.trim()) x.response = 'Enter a response message.'; if (ed!.url && !isUrl(ed!.url)) x.url = 'Enter a valid URL starting with http:// or https://.'; setEr(x); if (Object.keys(x).length) return
    const r = { ...ed!, name: ed!.name.trim() || ed!.keyword.trim() + ' automation', keyword: ed!.keyword.trim() }
    setAutos(autos.some((a: any) => a.id === r.id) ? autos.map((a: any) => a.id === r.id ? r : a) : [r, ...autos]); setEd(null); toast('Rule saved') }
  const dup = (r: AutomationRule) => { setAutos([{ ...r, id: uid(), name: r.name + ' (copy)', active: false, triggers: 0 }, ...autos]); toast('Rule duplicated (paused)') }
  return <>
    <div className="spread"><div><h1>Keyword Automations</h1><p className="muted">Give followers the resource they're asking for.</p></div><button className="btn primary" onClick={() => { setEr({}); setEd(blank()) }}><Plus size={16} /> Create automation</button></div>
    <div className="stats">{[['Total rules', autos.length], ['Active rules', autos.filter((a: any) => a.active).length], ['Responses in demo', autos.reduce((s: number, a: any) => s + a.triggers, 0)], ['Most-used keyword', top ? top.keyword : '—']].map(([l, v]) => <div className="card stat" key={l as string}><small>{l}</small><b>{v}</b></div>)}</div>
    <div className="row"><input placeholder="Search rules" aria-label="Search rules" value={q} onChange={e => setQ(e.target.value)} /><select aria-label="Status" value={st} onChange={e => setSt(e.target.value)}><option>All</option><option>Active</option><option>Paused</option></select></div>
    <div className="card tablewrap">{list.length === 0 ? <Empty title="Create your first rule." hint="Add a keyword and the resource it should deliver." /> :
      <table><thead><tr><th>Keyword</th><th>Response preview</th><th>Platform</th><th>Status</th><th>Triggers</th><th>Actions</th></tr></thead><tbody>
        {list.map((r: AutomationRule) => <tr key={r.id}><td><b className="kw">{r.keyword}</b></td><td className="cut">{buildResponse(r)}</td><td>{r.platform}</td><td><Badge k={r.active ? 'Active' : 'Paused'} /></td><td>{r.triggers}</td>
          <td><div className="acts"><Toggle on={r.active} label={`Toggle ${r.keyword}`} set={() => { setAutos(autos.map((a: any) => a.id === r.id ? { ...a, active: !a.active } : a)); toast(r.active ? 'Automation paused' : 'Automation active') }} /><button className="icon" aria-label="Edit" onClick={() => { setEr({}); setEd(r) }}><Pencil size={16} /></button><button className="icon" aria-label="Duplicate" onClick={() => dup(r)}><Copy size={16} /></button><button className="icon" aria-label="Delete" onClick={() => setDel(r)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>}</div>
    <section className="card"><h3>Preview a keyword rule</h3><p className="muted">Type a sample comment to see which saved, active rule would match. Nothing is sent.</p>
      <input aria-label="Sample comment" value={sample} onChange={e => setSample(e.target.value)} />
      <div className={'result' + (hit ? ' hit' : '')} aria-live="polite">{hit ? <><small>Keyword matched: <b className="kw">{hit.keyword}</b> ({hit.match === 'exact' ? 'exact' : 'case-insensitive'})</small><div className="bubble me">{buildResponse(hit)}</div></> : <span>No active keyword rule matched.</span>}</div></section>
    {ed && <Modal title={autos.some((a: any) => a.id === ed.id) ? 'Edit automation' : 'Create automation'} onClose={() => setEd(null)}>
      <Field label="Automation name"><input value={ed.name} onChange={e => setEd({ ...ed, name: e.target.value })} /></Field>
      <Field label="Trigger keyword" error={er.keyword}><input value={ed.keyword} onChange={e => setEd({ ...ed, keyword: e.target.value })} /></Field>
      {dupe && <p className="warnc small" role="status">A rule with this keyword already exists for {ed.platform}.</p>}
      <div className="row"><Field label="Match type"><select value={ed.match} onChange={e => setEd({ ...ed, match: e.target.value as any })}><option value="exact">Exact keyword</option><option value="ci">Case-insensitive keyword</option></select></Field>
        <Field label="Platform"><select value={ed.platform} onChange={e => setEd({ ...ed, platform: e.target.value })}><option>Demo</option></select></Field></div>
      <Field label="Response message" error={er.response}><textarea rows={3} value={ed.response} onChange={e => setEd({ ...ed, response: e.target.value })} /></Field>
      <Field label="Resource URL (optional)" error={er.url}><input value={ed.url} onChange={e => setEd({ ...ed, url: e.target.value })} placeholder="https://example.com/guide" /></Field>
      <label className="check"><input type="checkbox" checked={ed.active} onChange={e => setEd({ ...ed, active: e.target.checked })} /> Active</label>
      <div className="result"><small>Preview · follower comment: <b className="kw">{ed.keyword || '…'}</b></small><div className="bubble me">{ed.response ? buildResponse(ed) : 'Your response appears here.'}</div></div>
      <div className="row"><button className="btn primary" onClick={save}>Save rule</button><button className="btn ghostb" onClick={() => setEd(null)}>Cancel</button></div></Modal>}
    {del && <Modal title="Delete this automation?" onClose={() => setDel(null)}><p className="muted">"{del.keyword}" will be removed from this demo workspace.</p><div className="row"><button className="btn danger" onClick={() => { setAutos(autos.filter((a: any) => a.id !== del.id)); setDel(null); toast('Automation deleted') }}>Delete automation</button><button className="btn ghostb" onClick={() => setDel(null)}>Cancel</button></div></Modal>}
  </>
}
