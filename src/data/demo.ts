import type { AutomationRule } from '../lib/match'
export const uid = () => Math.random().toString(36).slice(2,9)
const T = (from:'them'|'me', text:string, time:string, demo=false) => ({ from, text, time, demo })
export const seedMessages = () => [
 { id:'m1', sender:'Aarav Mehta', channel:'Instagram', intent:'Resource', status:'auto', unread:true, important:false, time:'2m', thread:[T('them','Comment: GUIDE','9:41 PM'),T('me','Here\'s the guide you requested: https://example.com/guide','9:41 PM',true)] },
 { id:'m2', sender:'Sana Iyer', channel:'YouTube', intent:'Equipment', status:'open', unread:true, important:false, time:'14m', thread:[T('them','Which microphone do you use for your videos?','9:29 PM')] },
 { id:'m3', sender:'Northwave Audio', channel:'Email', intent:'Sponsorship', status:'review', unread:true, important:true, time:'41m', thread:[T('them','Hi! We\'d love to discuss a paid collaboration for our new studio mic. Is next month open?','9:02 PM')], draft:'Thanks for reaching out! I\'m open to hearing more. Could you share the brief and timeline?' },
 { id:'m4', sender:'Rohan D', channel:'Telegram', intent:'FAQ', status:'open', unread:false, important:false, time:'1h', thread:[T('them','Where can I find all your links?','8:15 PM')] },
 { id:'m5', sender:'Priya Nair', channel:'Discord', intent:'Feedback', status:'auto', unread:false, important:false, time:'2h', thread:[T('them','Loved the last livestream — the editing tips helped a lot!','7:20 PM'),T('me','Thank you, that means a lot! More tips coming soon.','7:22 PM',true)] },
 { id:'m6', sender:'Daily Frame Media', channel:'Email', intent:'Media', status:'review', unread:true, important:true, time:'3h', thread:[T('them','We\'re preparing a feature on rising creators. Could we schedule a short interview?','6:05 PM')], draft:'Thanks for thinking of me! I\'d be glad to chat. What dates work on your side?' },
 { id:'m7', sender:'Kabir S', channel:'Instagram', intent:'Unclear', status:'review', unread:false, important:false, time:'5h', thread:[T('them','can u do the thing from before but different','4:10 PM')], draft:'Could you tell me a bit more about what you\'re looking for?' },
]
export const seedAutos = (): AutomationRule[] => [
 { id:'k1', name:'Guide delivery', keyword:'GUIDE', match:'ci', platform:'Demo', response:'Here\'s the guide you requested:', url:'https://example.com/guide', active:true, triggers:64 },
 { id:'k2', name:'Template delivery', keyword:'TEMPLATE', match:'ci', platform:'Demo', response:'Here is the template:', url:'https://example.com/template', active:true, triggers:41 },
 { id:'k3', name:'Course info', keyword:'COURSE', match:'ci', platform:'Demo', response:'Here is the course information:', url:'https://example.com/course', active:false, triggers:27 },
 { id:'k4', name:'Notes access', keyword:'NOTES', match:'ci', platform:'Demo', response:'You can access the notes here:', url:'https://example.com/notes', active:true, triggers:19 },
]
export const seedReplies = () => [
 { id:'r1', name:'Resource request', example:'Can you send me the guide?', response:'Here\'s the guide: https://example.com/guide', active:true, updated:'Today' },
 { id:'r2', name:'Equipment question', example:'Which microphone do you use?', response:'You can find the equipment list here: https://example.com/gear', active:true, updated:'Yesterday' },
 { id:'r3', name:'General information', example:'Where can I find your links?', response:'All my useful links are collected here: https://example.com/links', active:true, updated:'3 days ago' },
]
export const suggestions: Record<string,string> = {
 Resource:'Here\'s the guide: https://example.com/guide', Equipment:'You can find the equipment list here: https://example.com/gear',
 FAQ:'All my useful links are collected here: https://example.com/links', Feedback:'Thank you, that means a lot!',
 Sponsorship:'Thanks for reaching out! Could you share the brief and timeline?', Media:'Happy to chat — what dates work for you?', Unclear:'Could you tell me a bit more about what you need?' }
export const integrations = [
 { id:'telegram', name:'Telegram', status:'Setup required', cap:'Bot messaging via the Bot API. Needs a server-side bot token and webhook; not connected in this demo.' },
 { id:'instagram', name:'Instagram', status:'Planned', cap:'Automated messaging needs approved Meta API access and permissions. Not available in this demo.' },
 { id:'youtube', name:'YouTube', status:'Planned', cap:'Comment automation needs the YouTube Data API and OAuth permissions. Not available in this demo.' },
 { id:'discord', name:'Discord', status:'Planned', cap:'Could assist with community messages through a Discord bot. Not built yet.' },
 { id:'email', name:'Email', status:'Planned', cap:'Could route sponsorship and press inquiries into the inbox. Not built yet.' },
]
