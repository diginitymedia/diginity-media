// ═══════════════════════════════════════════════════════════════
//  DIGINITY MEDIA — Node.js + Express Backend
//  npm install express nodemailer cors helmet express-rate-limit
//  Deploy free: railway.app / render.com / adaptable.io
// ═══════════════════════════════════════════════════════════════
const express   = require('express');
const nodemailer= require('nodemailer');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const fs        = require('fs');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({ windowMs: 60*60*1000, max: 20 }));

// ── Email Transporter (Gmail) ────────────────────────────────────
const mail = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// ── Lead file storage ────────────────────────────────────────────
const LEADS = path.join(__dirname,'leads.json');
const getLeads  = () => { try { return JSON.parse(fs.readFileSync(LEADS,'utf8')); } catch { return []; } };
const putLeads  = (l) => fs.writeFileSync(LEADS, JSON.stringify(l,null,2));

// ══ POST /api/contact ════════════════════════════════════════════
app.post('/api/contact', async (req,res) => {
  const { name,phone,email,company='',services='',budget='',message,source='' } = req.body;
  if (!name||!phone||!email||!message) return res.status(400).json({ok:false,error:'Missing required fields'});

  const ts   = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
  const lead = {id:Date.now(),status:'New',name,phone,email,company,services,budget,message,source,timestamp:ts};

  // Save lead
  try { const l=getLeads(); l.unshift(lead); putLeads(l.slice(0,1000)); } catch(e) {}

  // Email alert
  const rows = [['👤 Name',name],['📱 Phone',phone],['📧 Email',email],['🏢 Company',company||'—'],
                 ['🎯 Services',services||'—'],['💰 Budget',budget||'—'],['🔍 Source',source||'—'],['💬 Message',message],['⏰ Time',ts]];
  try {
    await mail.sendMail({
      from   : `"Diginity Leads" <${process.env.SMTP_USER}>`,
      to     : process.env.ALERT_EMAIL || process.env.SMTP_USER,
      subject: `🎯 New Lead: ${name} — ${services||'General Enquiry'}`,
      html   : `<div style="font-family:Arial;max-width:560px">
        <div style="background:#07090F;padding:20px;border-radius:10px 10px 0 0">
          <h2 style="color:#3DFFA0;margin:0;font-size:18px">🎯 New Lead — Diginity Media</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#0D1117;border:1px solid #1E2A3A">
          ${rows.map(([k,v])=>`<tr><td style="padding:10px 14px;color:#8899AA;border-bottom:1px solid #1E2A3A;white-space:nowrap">${k}</td><td style="padding:10px 14px;color:#EEF2FF;border-bottom:1px solid #1E2A3A;font-weight:600">${v}</td></tr>`).join('')}
        </table>
        <div style="background:#07090F;padding:16px;border-radius:0 0 10px 10px;text-align:center">
          <a href="https://wa.me/${process.env.WHATSAPP||''}?text=${encodeURIComponent('New lead from '+name+': '+phone)}" style="display:inline-block;background:#25D366;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;margin-right:10px">💬 WhatsApp</a>
          <a href="mailto:${email}" style="display:inline-block;background:#4D8EFF;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700">📧 Reply</a>
        </div>
      </div>`
    });
  } catch(e) { console.error('Mail error:',e.message); }

  res.json({ok:true,id:lead.id});
});

// ══ GET /api/leads (protected) ═══════════════════════════════════
app.get('/api/leads', (req,res) => {
  if (req.headers['x-api-key'] !== process.env.API_SECRET) return res.status(401).json({error:'Unauthorized'});
  const leads = getLeads();
  res.json({ok:true,count:leads.length,leads});
});

// ══ PATCH /api/leads/:id — update status ═════════════════════════
app.patch('/api/leads/:id', (req,res) => {
  if (req.headers['x-api-key'] !== process.env.API_SECRET) return res.status(401).json({error:'Unauthorized'});
  const leads = getLeads();
  const i = leads.findIndex(l=>l.id==req.params.id);
  if (i===-1) return res.status(404).json({error:'Not found'});
  leads[i] = {...leads[i],...req.body,id:leads[i].id};
  putLeads(leads);
  res.json({ok:true,lead:leads[i]});
});

app.get('/api/health',(req,res)=>res.json({ok:true,uptime:process.uptime()}));
app.listen(PORT,()=>console.log(`✅  Diginity backend → http://localhost:${PORT}`));
