export interface AutomationRule { id:string; name:string; keyword:string; match:'exact'|'ci'; platform:string; response:string; url:string; active:boolean; triggers:number }
const words = (s:string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
/** Returns the first ACTIVE rule whose keyword appears as a whole word in the comment. */
export function matchRule(comment:string, rules:AutomationRule[]): AutomationRule|null {
  for (const r of rules) {
    if (!r.active) continue
    const k = r.keyword.trim(); if (!k) continue
    const w = words(comment)
    const hit = r.match==='exact' ? w.includes(k) : w.map(x=>x.toLowerCase()).includes(k.toLowerCase())
    if (hit) return r
  }
  return null
}
export const buildResponse = (r:AutomationRule) => r.url && !r.response.includes(r.url) ? `${r.response} ${r.url}` : r.response
