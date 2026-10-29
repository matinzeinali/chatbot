import { createServer } from 'node:http';
import { GEMINI_MODELS, PAASTA_MODELS } from './models.mjs';

const PORT = Number(process.env.PORT || 8787);
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
// GEMINI_API_KEY wins when both keys are set; both providers speak the OpenAI chat format.
const PROVIDER = process.env.GEMINI_API_KEY
  ? { name: 'Gemini', key: process.env.GEMINI_API_KEY, upstream: 'https://generativelanguage.googleapis.com/v1beta/openai', models: GEMINI_MODELS }
  : process.env.PAASTA_AI_KEY
    ? { name: 'Paasta', key: process.env.PAASTA_AI_KEY, upstream: 'https://console.paasta.cloud/api/ai/v1', models: PAASTA_MODELS }
    : null;
if (!PROVIDER) { console.error('Set GEMINI_API_KEY or PAASTA_AI_KEY in .env.'); process.exit(1); }
const { name: PROVIDER_NAME, key: KEY, upstream: UPSTREAM, models: MODELS } = PROVIDER;
const allowed = new Set(MODELS.map(m=>m.id));
const DEFAULT_MODEL = MODELS[0].id;
const buckets = new Map();
const json = (res, status, obj, headers={}) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8',...headers}); res.end(JSON.stringify(obj)); };
function limited(ip) {
  const now=Date.now(), b=buckets.get(ip)||{start:now,count:0};
  if(now-b.start>=60000){b.start=now;b.count=0;}
  b.count++; buckets.set(ip,b); return b.count>30;
}
const server=createServer(async (req,res)=>{
  const origin=req.headers.origin;
  if(origin && origin!==ORIGIN) return json(res,403,{error:'Origin not allowed'});
  const cors={'Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if(req.method==='OPTIONS'){res.writeHead(204,cors);res.end();return;}
  const send=(status,data)=>json(res,status,data,cors);
  if(req.url==='/api/health' && req.method==='GET') return send(200,{ok:true});
  if(req.url==='/api/models' && req.method==='GET') return send(200,{provider:PROVIDER_NAME,models:MODELS,default:DEFAULT_MODEL});
  if(req.url!=='/api/chat'||req.method!=='POST') return send(404,{error:'Not found'});
  if(limited(req.socket.remoteAddress||'unknown')) return send(429,{error:'Too many requests'});
  let body='';
  try { for await (const chunk of req) {body+=chunk; if(Buffer.byteLength(body)>256*1024) throw new Error('Payload too large');} }
  catch {return send(413,{error:'Payload too large'});}
  let input; try{input=JSON.parse(body);}catch{return send(400,{error:'Invalid JSON'});}
  const {messages}=input||{};
  // A missing or stale model (e.g. one saved for another provider) falls back to the default.
  const model=allowed.has(input?.model)?input.model:DEFAULT_MODEL;
  if(!Array.isArray(messages)||!messages.length||messages.length>40||!messages.every(m=>m&&['system','user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length<=20000)) return send(400,{error:'Invalid messages: use up to 40 text messages'});
  try {
    const upstream=await fetch(`${UPSTREAM}/chat/completions`,{
      method:'POST',headers:{Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({model,messages,max_tokens:Math.min(2048,Math.max(1,Number(input.max_tokens)||1024))}),
      signal:AbortSignal.timeout(90000)
    });
    const raw=await upstream.json().catch(()=>({error:'Invalid provider response'}));
    const data=Array.isArray(raw)?raw[0]:raw; // Gemini wraps errors in an array
    if(!upstream.ok) return send(upstream.status,{error: data?.error?.message||data?.message||`${PROVIDER_NAME} request failed`,code:data?.error?.code||undefined});
    return send(200,{model:data.model||model,message:data.choices?.[0]?.message?.content??'',usage:data.usage??null,finish_reason:data.choices?.[0]?.finish_reason??null});
  } catch(e) {return send(502,{error:e?.name==='TimeoutError'?'Provider timed out':'Provider connection failed'});}
});
server.listen(PORT,()=>console.log(`Backend running on http://localhost:${PORT} (${PROVIDER_NAME}, default model ${DEFAULT_MODEL})`));
