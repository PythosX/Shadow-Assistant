import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Logo, Field } from '../components/ui'
import { useStore } from '../store'
import { DEMO, isEmail } from '../lib/validate'
export function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [info, setInfo] = useState('')
  const { setAuth, toast } = useStore(); const nv = useNavigate()
  const submit = (e: FormEvent) => {
    e.preventDefault(); if (busy) return; setInfo('')
    if (!email.trim() || !pw) return setErr('Enter both your email and password.')
    setErr(''); setBusy(true)
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO.email && pw === DEMO.password) { setAuth(true); toast('Welcome to the demo workspace'); nv('/app') }
      else { setBusy(false); setErr('Those credentials do not match the demo account. Use the demo account button.') }
    }, 700)
  }
  return <div className="authwrap"><div className="glow" aria-hidden="true" />
    <form className="authcard" onSubmit={submit} noValidate>
      <Link to="/" className="brand"><Logo /><b>Shadow Assistant</b></Link>
      <h1>Welcome back.</h1><p className="muted">Your creator workspace is waiting.</p>
      <Field label="Email"><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
      <Field label="Password"><div className="pw"><input type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} /><button type="button" className="icon" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>
      <div className="spread"><label className="check"><input type="checkbox" /> Remember me (demo UI)</label><button type="button" className="link" onClick={() => setInfo('Password recovery is not available in this demo. Use the demo account.')}>Forgot password?</button></div>
      {err && <p className="err" role="alert">{err}</p>}{info && <p className="muted" role="status">{info}</p>}
      <button className="btn primary full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      <button type="button" className="btn ghostb full" onClick={() => { setEmail(DEMO.email); setPw(DEMO.password); setErr('') }}>Use demo account</button>
      <p className="muted small">Demo only: fixed credentials, not real authentication.</p>
      <div className="spread"><Link to="/">← Back to homepage</Link><Link to="/contact">Contact</Link></div>
    </form></div>
}
export function Contact() {
  const { requests, setRequests } = useStore()
  const [f, setF] = useState({ name: '', email: '', brand: '', platform: 'Telegram', goal: '', more: '' }); const [e, setE] = useState<any>({}); const [done, setDone] = useState(false)
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value })
  const submit = (ev: FormEvent) => { ev.preventDefault(); const x: any = {}
    if (!f.name.trim()) x.name = 'Enter your name.'; if (!f.email.trim()) x.email = 'Enter your email.'; else if (!isEmail(f.email)) x.email = 'Enter a valid email, like name@example.com.'
    if (!f.goal.trim()) x.goal = 'Tell us what you would like to automate.'
    setE(x); if (Object.keys(x).length) return; setRequests([...requests, f]); setDone(true) }
  return <div className="authwrap"><div className="glow" aria-hidden="true" />
    <form className="authcard wide" onSubmit={submit} noValidate>
      <Link to="/" className="brand"><Logo /><b>Shadow Assistant</b></Link>
      {done ? <><h1>Request saved locally.</h1><p className="muted">This is a demo: your request was stored in temporary browser state only. It has not been emailed or sent to the team.</p><Link className="btn primary" to="/">Back to homepage</Link></> : <>
        <h1>Let's connect your workflow.</h1><p className="muted">Tell us which channels you use and what you want Shadow Assistant to help with.</p>
        <Field label="Name" error={e.name}><input value={f.name} onChange={set('name')} /></Field>
        <Field label="Email" error={e.email}><input type="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Creator or brand name"><input value={f.brand} onChange={set('brand')} /></Field>
        <Field label="Platform of interest"><select value={f.platform} onChange={set('platform')}>{['Telegram', 'Instagram', 'YouTube', 'Discord', 'Email', 'Other'].map(p => <option key={p}>{p}</option>)}</select></Field>
        <Field label="What would you like to automate?" error={e.goal}><textarea rows={3} value={f.goal} onChange={set('goal')} /></Field>
        <Field label="Additional details"><textarea rows={3} value={f.more} onChange={set('more')} /></Field>
        <div className="row"><button className="btn primary">Submit request</button><Link className="btn ghostb" to="/">Back to homepage</Link></div></>}
    </form></div>
}
