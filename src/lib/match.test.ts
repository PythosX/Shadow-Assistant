import { describe, it, expect } from 'vitest'
import { matchRule, AutomationRule } from './match'
const r = (o:Partial<AutomationRule>):AutomationRule => ({id:'1',name:'n',keyword:'GUIDE',match:'ci',platform:'Demo',response:'x',url:'',active:true,triggers:0,...o})
describe('matchRule',()=>{
  it('matches case-insensitively',()=>expect(matchRule('send me the guide!',[r({})])?.id).toBe('1'))
  it('exact is case-sensitive',()=>expect(matchRule('guide',[r({match:'exact'})])).toBeNull())
  it('exact matches exact case',()=>expect(matchRule('GUIDE please',[r({match:'exact'})])).not.toBeNull())
  it('ignores paused rules',()=>expect(matchRule('GUIDE',[r({active:false})])).toBeNull())
  it('whole words only',()=>expect(matchRule('guidebook',[r({})])).toBeNull())
})
