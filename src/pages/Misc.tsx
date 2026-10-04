import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Badge, Field } from '../components/ui'
import { integrations } from '../data/demo'
export function Integrations() {
  return <>
    <h1>Integrations</h1><p className="muted">Connect the channels you use to communicate with your audience.</p>
    <p className="note2">No live connection is verified in this demo. "Connected" appears only after a real, successful check.</p>
    <div className="grid3">{integrations.map(x => <div className="card" key={x.id}><div className="spread"><h3>{x.name}</h3><Badge k={x.id === 'telegram' ? 'Setup required' : 'Planned'} /></div><p>{x.cap}</p><Link className="btn ghostb sm" to="/contact">Request an integration</Link></div>)}</div>
    <section className="card"><h3>Telegram setup (planned)</h3><ul className="plain">
      <li><b>Bot token:</b> create a bot with BotFather and store the token as a server-side environment variable. Never paste it into this frontend.</li>
      <li><b>Webhook or polling:</b> a small backend must receive Telegram updates (webhook) or poll for them.</li>
      <li><b>Hosting:</b> the backend needs a public HTTPS URL for the webhook.</li>
      <li><b>Limits:</b> bots can only message users who have started the bot, and Telegram rate limits apply.</li>
      <li><b>Verification:</b> a backend health check would confirm the token and webhook before the status changes to Connected.</li></ul></section></>
}
export function Settings() {
  const { profile, setProfile, prefs, setPrefs, toast, clearData, restoreData, setAuth } = useStore(); const nv = useNavigate()
  const P = (k: string) => (e: any) => setPrefs({ ...prefs, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const C = ({ k, l }: { k: string; l: string }) => <label className="check"><input type="checkbox" checked={prefs[k]} onChange={P(k)} /> {l}</label>
  return <><h1>Settings</h1><p className="muted">Changes apply to this browser session only. Nothing is synced across devices.</p>
    <section className="card"><h3>Profile</h3><Field label="Creator display name"><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></Field><Field label="Email"><input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></Field><button className="btn primary" onClick={() => toast('Profile saved for this session')}>Save changes</button></section>
    <section className="card"><h3>Reply preferences</h3><Field label="Preferred tone"><select value={prefs.tone} onChange={P('tone')}>{['Friendly', 'Professional', 'Playful'].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Response length"><select value={prefs.length} onChange={P('length')}><option>Short</option><option>Detailed</option></select></Field><C k="review" l="Require review for uncertain messages" /><C k="suggestions" l="Enable demo reply suggestions" /></section>
    <section className="card"><h3>Notifications</h3><C k="nImportant" l="Important inquiries" /><C k="nMessages" l="New messages" /><C k="nAutomation" l="Automation activity" /></section>
    <section className="card"><h3>Workspace</h3><p><span className="badge info">Demo mode</span> Data lives in this browser tab and resets on refresh.</p><div className="row"><button className="btn ghostb" onClick={clearData}>Clear demo data</button><button className="btn ghostb" onClick={restoreData}>Restore demo data</button><button className="btn danger" onClick={() => { setAuth(false); nv('/') }}>Log out</button></div></section></>
}
