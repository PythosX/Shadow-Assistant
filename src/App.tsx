import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import Landing from './pages/Landing'
import { Login, Contact } from './pages/Public'
import Shell from './pages/Shell'
import { Overview, Inbox } from './pages/Inbox'
import { AutoReplies, Keywords } from './pages/Rules'
import { Integrations, Settings } from './pages/Misc'
export default function App() {
  const { auth } = useStore(); const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  const guard = (el: JSX.Element) => auth ? el : <Navigate to="/login" replace />
  return <Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/contact" element={<Contact />} />
    <Route path="/app" element={guard(<Shell />)}>
      <Route index element={<Overview />} /><Route path="inbox" element={<Inbox />} /><Route path="auto-replies" element={<AutoReplies />} />
      <Route path="keywords" element={<Keywords />} /><Route path="integrations" element={<Integrations />} /><Route path="settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
