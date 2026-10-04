export const isEmail = (s:string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())
export const isUrl = (s:string) => { try { const u = new URL(s); return /^https?:$/.test(u.protocol) } catch { return false } }
export const DEMO = { email:'demo@shadowassistant.app', password:'ShadowDemo123!' } // demo only, not real auth
