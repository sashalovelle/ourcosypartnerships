import React, { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap');`;

const C = {
  parchment: "#F5F0E8",
  cream: "#FAF7F1",
  sand: "#EDE4D3",
  beige: "#E0D5C1",
  tan: "#8A7055",
  gold: "#B8955A",
  goldLight: "#D4AE72",
  amber: "#7A5A20",
  brown: "#3D2800",
  darkBrown: "#1E1200",
  ink: "#150D00",
  fog: "#F2EDE3",
};

const DELIVERABLE_CONFIG = {
  Reel:        { color: "#E8DFC8", dot: "#7A5A20", label: "✦ Reel",       symbol: "◈" },
  IGS:         { color: "#EDE5D5", dot: "#8A7055", label: "◯ Story",      symbol: "○" },
  "Feed Post": { color: "#E5DDD0", dot: "#7A6A50", label: "▣ Feed Post",  symbol: "□" },
};

const STATUS_CONFIG = {
  Scheduled: { bg: "#F2EDE3", text: "#7A5A20", border: "#D4AE72" },
  Filming:   { bg: "#EDE5D5", text: "#7A6050", border: "#C8A880" },
  Editing:   { bg: "#E8E0CC", text: "#6A5830", border: "#B89850" },
  Posted:    { bg: "#DDD8C8", text: "#4A5030", border: "#8A9860" },
};

const PAYMENT_STATUS_CONFIG = {
  Unpaid:   { bg: "#F0E4DC", text: "#7A3A18", border: "#D4A080", dot: "#C07040" },
  Invoiced: { bg: "#EDE8D8", text: "#6A5A18", border: "#C8B860", dot: "#A89040" },
  Paid:     { bg: "#DDE8DC", text: "#2A5A30", border: "#88B890", dot: "#4A9858" },
};

const LINK_CONFIG = [
  { key: "briefLink",   label: "Brief",    placeholder: "https://drive.google.com/…", icon: "✦" },
  { key: "driveLink",   label: "Contract", placeholder: "https://drive.google.com/…", icon: "◈" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }

// Deterministic star positions
function genStars(n, seed) {
  const out = []; let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const x = ((s >>> 0) % 10000) / 100;
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const y = ((s >>> 0) % 10000) / 100;
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const r = 0.5 + ((s >>> 0) % 15) / 20;
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const o = 0.15 + ((s >>> 0) % 50) / 100;
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const dur = 3 + ((s >>> 0) % 5);
    out.push({ x, y, r, o, dur });
  }
  return out;
}
const STARS = genStars(70, 42);

// ── Known brand colours — muted/desaturated to fit cream aesthetic ──
const KNOWN_BRANDS = {
  // Shopping & E-commerce
  "shopee":       { dot: "#E8907A", bg: "#FDF0ED", border: "#F2C4B8", text: "#A05040" },
  "lazada":       { dot: "#9098D0", bg: "#EEEFFE", border: "#C0C4E8", text: "#505888" },
  "zalora":       { dot: "#A0A0A0", bg: "#F4F4F4", border: "#D0D0D0", text: "#686868" },
  "shein":        { dot: "#E89090", bg: "#FDF0F0", border: "#F2C4C4", text: "#A05858" },
  "amazon":       { dot: "#E0B070", bg: "#FDF6E8", border: "#F0D8A8", text: "#906830" },
  "taobao":       { dot: "#E8A080", bg: "#FDF2EC", border: "#F2C8B0", text: "#A05838" },
  // Beauty & Skincare
  "sephora":      { dot: "#D898B0", bg: "#FCEEF4", border: "#EDCAD8", text: "#905870" },
  "laneige":      { dot: "#88B8E0", bg: "#EDF5FC", border: "#BCD8F0", text: "#406888" },
  "innisfree":    { dot: "#88C0A0", bg: "#EEF8F2", border: "#BCDFCC", text: "#407858" },
  "fenty":        { dot: "#E898A8", bg: "#FCEEF2", border: "#EDCAD0", text: "#905868" },
  "glossier":     { dot: "#E0B8B0", bg: "#FCF4F2", border: "#EDD8D4", text: "#907068" },
  "cetaphil":     { dot: "#80A8D0", bg: "#EBF2FA", border: "#B8D0E8", text: "#405878" },
  "sk-ii":        { dot: "#D0B070", bg: "#FAF4E0", border: "#E8D4A0", text: "#806830" },
  "sk2":          { dot: "#D0B070", bg: "#FAF4E0", border: "#E8D4A0", text: "#806830" },
  "sulwhasoo":    { dot: "#D0A0A0", bg: "#FAF0F0", border: "#E8CCCC", text: "#806060" },
  "tatcha":       { dot: "#C8B080", bg: "#FAF4E4", border: "#E4D4A8", text: "#786840" },
  "drunk elephant": { dot: "#E8B090", bg: "#FDF4EE", border: "#F0D0B8", text: "#A06848" },
  "the ordinary": { dot: "#B0B0B0", bg: "#F4F4F4", border: "#D8D8D8", text: "#686868" },
  "kiehl's":      { dot: "#80A0C8", bg: "#EBF0FA", border: "#B8CCE8", text: "#405070" },
  "kiehls":       { dot: "#80A0C8", bg: "#EBF0FA", border: "#B8CCE8", text: "#405070" },
  "lush":         { dot: "#80C098", bg: "#EEF8F2", border: "#B8E0C8", text: "#407050" },
  "aesop":        { dot: "#C0B0A0", bg: "#F8F4EE", border: "#DDD0C0", text: "#787060" },
  "fresh":        { dot: "#D0C090", bg: "#F8F4E4", border: "#E8D8A8", text: "#807040" },
  "clinique":     { dot: "#70C0B0", bg: "#EAF8F4", border: "#B0DDD8", text: "#307060" },
  "estee lauder": { dot: "#8898C8", bg: "#EEF0FA", border: "#BCCCE8", text: "#485070" },
  "mac":          { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "nars":         { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  // Fashion
  "zara":         { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "h&m":          { dot: "#E08890", bg: "#FCF0F0", border: "#ECC0C4", text: "#985060" },
  "uniqlo":       { dot: "#E09090", bg: "#FCF0F0", border: "#ECC4C4", text: "#985858" },
  "loewe":        { dot: "#C8B898", bg: "#FAF6EE", border: "#E0D4BC", text: "#787060" },
  "louis vuitton":{ dot: "#D0B878", bg: "#FAF4E2", border: "#E8D4A0", text: "#806830" },
  "gucci":        { dot: "#88B0A0", bg: "#EEF6F2", border: "#BCD8CC", text: "#406858" },
  "chanel":       { dot: "#989898", bg: "#F4F4F4", border: "#D0D0D0", text: "#585858" },
  "dior":         { dot: "#D0B8A8", bg: "#FAF4EE", border: "#E8D4C4", text: "#806858" },
  "prada":        { dot: "#A0A0A0", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "burberry":     { dot: "#D0A8A8", bg: "#FAF0F0", border: "#E8CCCC", text: "#806060" },
  "coach":        { dot: "#D0A888", bg: "#FAF2EA", border: "#E8CCAC", text: "#806040" },
  "michael kors": { dot: "#D0C088", bg: "#FAF4E2", border: "#E8D4A4", text: "#807040" },
  "cotton on":    { dot: "#E0A880", bg: "#FCF2EA", border: "#EED0B0", text: "#986040" },
  // Tech & Electronics
  "dyson":        { dot: "#B8A8C8", bg: "#F4F0FA", border: "#D8CCEC", text: "#706080" },
  "apple":        { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "samsung":      { dot: "#8890D0", bg: "#EEF0FA", border: "#BCCCE8", text: "#485080" },
  "sony":         { dot: "#989898", bg: "#F4F4F4", border: "#D0D0D0", text: "#585858" },
  "xiaomi":       { dot: "#E0A880", bg: "#FCF2EA", border: "#EED0B0", text: "#986040" },
  // Food & Beverage
  "starbucks":    { dot: "#70C0A8", bg: "#EAF8F4", border: "#AEDDD4", text: "#306858" },
  "mcdonald's":   { dot: "#E89888", bg: "#FCF2EE", border: "#EEC8BC", text: "#985848" },
  "mcdonalds":    { dot: "#E89888", bg: "#FCF2EE", border: "#EEC8BC", text: "#985848" },
  "coca-cola":    { dot: "#E89090", bg: "#FCF0F0", border: "#EEC4C4", text: "#985050" },
  "pepsi":        { dot: "#8098D0", bg: "#EEF2FA", border: "#BCCCE8", text: "#405080" },
  "nestle":       { dot: "#8098D0", bg: "#EEF2FA", border: "#BCCCE8", text: "#405080" },
  // Fitness & Lifestyle
  "nike":         { dot: "#989898", bg: "#F4F4F4", border: "#D0D0D0", text: "#585858" },
  "adidas":       { dot: "#A0A0A0", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "lululemon":    { dot: "#D09090", bg: "#FAF0F0", border: "#E8CCCC", text: "#805050" },
  "gymshark":     { dot: "#A0A0A0", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  // Home & Living
  "ikea":         { dot: "#88A8D8", bg: "#EEF2FA", border: "#BCD0EE", text: "#405878" },
  "muji":         { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  // Travel & Lifestyle
  "airbnb":       { dot: "#E89898", bg: "#FCF0F0", border: "#EEC8C8", text: "#985858" },
  "grab":         { dot: "#78C898", bg: "#EAF8F0", border: "#AEDDC4", text: "#307050" },
  // Social & Digital
  "tiktok":       { dot: "#989898", bg: "#F4F4F4", border: "#D0D0D0", text: "#585858" },
  "instagram":    { dot: "#D898C0", bg: "#FCEEF6", border: "#EDCADE", text: "#906070" },
  "youtube":      { dot: "#E89090", bg: "#FCF0F0", border: "#EEC4C4", text: "#985050" },
  // Local SG
  "fairprice":    { dot: "#E89098", bg: "#FCF0F2", border: "#EEC4C8", text: "#985058" },
  "ntuc":         { dot: "#E89098", bg: "#FCF0F2", border: "#EEC4C8", text: "#985058" },
  "charles & keith": { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "charles and keith": { dot: "#A8A8A8", bg: "#F4F4F4", border: "#D0D0D0", text: "#606060" },
  "love bonito":  { dot: "#E0A0B8", bg: "#FCF0F4", border: "#ECCCD8", text: "#906070" },
  "lovebonito":   { dot: "#E0A0B8", bg: "#FCF0F4", border: "#ECCCD8", text: "#906070" },
};

// ── Fallback palette for unknown brands ──
const BRAND_PALETTES = [
  { bg: "#FDF4EE", dot: "#E8B090", text: "#906848", border: "#F0D4BC" },  // peach
  { bg: "#F0F0FA", dot: "#A0A8D8", text: "#585880", border: "#C8CCE8" },  // periwinkle
  { bg: "#EEF8F2", dot: "#88C4A0", text: "#407858", border: "#B8DEC8" },  // sage
  { bg: "#FDF0F2", dot: "#E8A0A8", text: "#906068", border: "#F0C8CC" },  // rose
  { bg: "#F8F4EC", dot: "#D0C090", text: "#807048", border: "#E8D8B0" },  // gold
  { bg: "#F4F0F8", dot: "#C0A8D0", text: "#706080", border: "#DDD0E8" },  // lavender
  { bg: "#EEF8F6", dot: "#80C8B8", text: "#387068", border: "#B0DDD8" },  // teal
  { bg: "#FFF4EC", dot: "#E8A870", text: "#885030", border: "#F0CCB0" },  // terracotta
  { bg: "#F0F8EE", dot: "#98CC80", text: "#4A7038", border: "#C4E0B8" },  // lime
  { bg: "#F8F0F8", dot: "#D898C8", text: "#885078", border: "#ECC8E8" },  // mauve
  { bg: "#EEF4F8", dot: "#80B0D0", text: "#385870", border: "#B4CDE0" },  // slate blue
  { bg: "#F8EEEE", dot: "#D89090", text: "#884848", border: "#E8C0C0" },  // dusty red
  { bg: "#F4F8EE", dot: "#A8C870", text: "#587030", border: "#CCDFB0" },  // yellow-green
  { bg: "#EEEEF8", dot: "#9090D8", text: "#484888", border: "#C0C0E8" },  // indigo
  { bg: "#F8F4F0", dot: "#C8A880", text: "#785840", border: "#E0CEB0" },  // tan
  { bg: "#EEF8F8", dot: "#78C8C8", text: "#307070", border: "#AEDDDD" },  // cyan
];

const _brandPaletteRegistry = {};
let   _brandPaletteCounter  = 0;

function brandHash(name) {
  if (!name) return BRAND_PALETTES[0];
  const key = name.toLowerCase().trim();
  if (KNOWN_BRANDS[key]) return KNOWN_BRANDS[key];
  for (const known of Object.keys(KNOWN_BRANDS)) {
    if (key.includes(known) || known.includes(key)) return KNOWN_BRANDS[known];
  }
  // Assign a unique palette slot per brand name, never reusing
  if (_brandPaletteRegistry[key] === undefined) {
    _brandPaletteRegistry[key] = _brandPaletteCounter % BRAND_PALETTES.length;
    _brandPaletteCounter++;
  }
  return BRAND_PALETTES[_brandPaletteRegistry[key]];
}

function autoSpread(collab, blackoutDates) {
  const start = new Date(collab.startDate + "T12:00:00");
  const end   = new Date(collab.endDate   + "T12:00:00");
  const avail = [];
  const cur = new Date(start);
  while (cur <= end) {
    const k = cur.toISOString().split("T")[0];
    if (!blackoutDates.includes(k)) avail.push(k);
    cur.setDate(cur.getDate() + 1);
  }
  if (avail.length === 0) return [];

  const items = [];
  collab.deliverables.filter(x => x.count > 0).forEach(({ type, count, maxPerDay }) => {
    const cap = maxPerDay && maxPerDay > 0 ? maxPerDay : null;
    if (!cap) {
      Array.from({ length: count }).forEach((_, i) => {
        const idx = count <= avail.length
          ? (count === 1 ? 0 : Math.round((i / (count - 1)) * (avail.length - 1)))
          : i % avail.length;
        items.push({ type, date: avail[Math.min(idx, avail.length - 1)], status: "Scheduled", id: `${Date.now()}-${Math.random()}` });
      });
    } else {
      const daysNeeded = Math.ceil(count / cap);
      const step = avail.length <= 1 ? 0 : Math.floor((avail.length - 1) / Math.max(daysNeeded - 1, 1));
      let placed = 0;
      for (let di = 0; di < daysNeeded && placed < count; di++) {
        const dateIdx = Math.min(di === 0 ? 0 : di * step, avail.length - 1);
        const onDay = Math.min(cap, count - placed);
        for (let j = 0; j < onDay; j++) {
          items.push({ type, date: avail[dateIdx], status: "Scheduled", id: `${Date.now()}-${Math.random()}` });
        }
        placed += onDay;
      }
    }
  });
  return items;
}

// ── SVG Decorations ──────────────────────────────────────────────────────────
const Moon = ({ size = 28, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
    <circle cx="14" cy="14" r="12" fill={C.sand} stroke={C.tan} strokeWidth="0.7" opacity="0.7"/>
    <path d="M14 2 C9 2 4 7 4 14 C4 21 9 26 14 26 C11 23 9 18.5 9 14 C9 9.5 11 5 14 2Z" fill={C.tan} opacity="0.45"/>
    <circle cx="10" cy="10" r="1.2" fill={C.beige} opacity="0.6"/>
    <circle cx="17" cy="18" r="0.8" fill={C.beige} opacity="0.5"/>
  </svg>
);

const Sparkle = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
    <path d="M8 0 L9 6.2 L15.5 8 L9 9.8 L8 16 L7 9.8 L0.5 8 L7 6.2 Z" fill={C.gold} opacity="0.75"/>
  </svg>
);

const Orbit = ({ size = 110, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="none" style={style}>
    <ellipse cx="55" cy="55" rx="50" ry="20" stroke={C.tan} strokeWidth="0.6" fill="none" opacity="0.35" strokeDasharray="3 5"/>
    <ellipse cx="55" cy="55" rx="34" ry="13" stroke={C.goldLight} strokeWidth="0.4" fill="none" opacity="0.25" strokeDasharray="2 6"/>
    <circle cx="55" cy="55" r="7" fill={C.sand} stroke={C.tan} strokeWidth="0.8" opacity="0.65"/>
    <circle cx="103" cy="51" r="3" fill={C.gold} opacity="0.5"/>
    <circle cx="9"  cy="59" r="2" fill={C.goldLight} opacity="0.4"/>
  </svg>
);

const Constellation = ({ style = {} }) => (
  <svg width="200" height="70" viewBox="0 0 200 70" fill="none" style={style}>
    {[[10,38],[55,12],[100,46],[155,18],[190,42]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i===2?2.5:1.8} fill={C.gold} opacity={0.35+i*0.04}/>
    ))}
    <path d="M10 38 L55 12 L100 46 L155 18 L190 42" stroke={C.tan} strokeWidth="0.5" opacity="0.35"/>
  </svg>
);

// ── Custom Dropdown ──────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, bg="#FAF7F1", textColor="#1E1200", borderColor="#E0D5C1", small=false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);
  const current = options.find(o => (o.value||o) === value);
  const label = current ? (current.label||current) : "—";
  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ display:"flex", alignItems:"center", gap:6, padding:small?"4px 10px":"6px 12px", borderRadius:10, border:`1px solid ${borderColor}`, background:bg, color:textColor, fontFamily:"'Cormorant Garamond', serif", fontSize:small?9:10, letterSpacing:.5, cursor:"pointer", whiteSpace:"nowrap", transition:"all .15s" }}>
        {label}
        <span style={{ fontSize:8, opacity:.6, marginLeft:2 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:999, background:"#FAF7F1", border:`1px solid ${borderColor}`, borderRadius:12, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,.12)", minWidth:"100%", whiteSpace:"nowrap" }}>
          {options.map(opt => {
            const val = opt.value||opt;
            const lbl = opt.label||opt;
            const isActive = val===value;
            return (
              <button key={val} onClick={()=>{ onChange(val); setOpen(false); }}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 14px", fontFamily:"'Cormorant Garamond', serif", fontSize:small?9:10, letterSpacing:.5, color:isActive?textColor:"#6B5132", background:isActive?borderColor+"55":"transparent", cursor:"pointer", border:"none", transition:"background .1s" }}
                onMouseEnter={e=>e.currentTarget.style.background=borderColor+"44"}
                onMouseLeave={e=>e.currentTarget.style.background=isActive?borderColor+"55":"transparent"}>
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Custom Date Picker ───────────────────────────────────────────────────────
function DatePicker({ value, onChange, placeholder="Select date", direction="up", small=false }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split("-")[1])-1 : new Date().getMonth());
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Sync view to value when it changes externally
  useEffect(() => {
    if (value) {
      setViewYear(parseInt(value.split("-")[0]));
      setViewMonth(parseInt(value.split("-")[1])-1);
    }
  }, [value]);

  function adjViewMonth(d) {
    if (d===-1) { viewMonth===0 ? (setViewMonth(11), setViewYear(y=>y-1)) : setViewMonth(m=>m-1); }
    else        { viewMonth===11 ? (setViewMonth(0), setViewYear(y=>y+1)) : setViewMonth(m=>m+1); }
  }

  const daysInM = new Date(viewYear, viewMonth+1, 0).getDate();
  const firstD  = new Date(viewYear, viewMonth, 1).getDay();
  const todayStr = new Date().toISOString().split("T")[0];

  function selectDay(day) {
    const ds = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(ds);
    setOpen(false);
  }

  const displayValue = value ? new Date(value+"T12:00:00").toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}) : placeholder;

  return (
    <div ref={ref} style={{ position:"relative", width:"100%" }}>
      {open && <div onClick={()=>setOpen(false)} style={{ position:"fixed", inset:0, zIndex:1999, background:"rgba(0,0,0,.15)" }}/>}
      <button onClick={()=>setOpen(p=>!p)}
        style={{ width:"100%", padding:small?"6px 10px":"11px 16px", border:`1px solid ${C.beige}`, borderRadius:small?10:14, background:C.parchment, color:value?C.darkBrown:"#B0A898", fontFamily:"'Crimson Pro', serif", fontSize:small?12:15, textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", transition:"border .15s" }}>
        <span>{displayValue}</span>
        <span style={{ fontFamily:"'Cinzel', serif", fontSize:9, color:C.tan, letterSpacing:1 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div className="fi" style={{ position:"absolute", ...(direction==="down" ? {top:"calc(100% + 6px)"} : {bottom:"calc(100% + 6px)"}), left:0, zIndex:9999, background:C.cream, border:`1px solid ${C.beige}`, borderRadius:18, boxShadow:"0 24px 64px rgba(0,0,0,.22)", padding:20, width:300 }}>
          {/* Month nav */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <button onClick={()=>adjViewMonth(-1)} style={{ width:32, height:32, borderRadius:8, background:C.sand, border:`1px solid ${C.beige}`, color:C.amber, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <span style={{ fontFamily:"'Cinzel', serif", fontSize:14, color:C.darkBrown, letterSpacing:.5 }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={()=>adjViewMonth(1)}  style={{ width:32, height:32, borderRadius:8, background:C.sand, border:`1px solid ${C.beige}`, color:C.amber, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>
          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
            {["S","M","T","W","T","F","S"].map((d,i)=>(
              <div key={i} style={{ textAlign:"center", fontFamily:"'Cinzel', serif", fontSize:11, color:C.tan, letterSpacing:.5, padding:"4px 0" }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array.from({length:firstD}).map((_,i)=><div key={i}/>)}
            {Array.from({length:daysInM}).map((_,i)=>{
              const day = i+1;
              const ds = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isSelected = ds===value;
              const isToday = ds===todayStr;
              return (
                <button key={day} onClick={()=>selectDay(day)}
                  style={{ aspectRatio:"1", borderRadius:8, fontFamily:"'Cinzel', serif", fontSize:13, background:isSelected?C.gold:"transparent", color:isSelected?C.cream:C.darkBrown, border:isSelected?`1px solid ${C.gold}`:`1px solid transparent`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .12s", fontWeight:isSelected?600:400 }}
                  onMouseEnter={e=>{ if(!isSelected) e.currentTarget.style.background=C.sand; }}
                  onMouseLeave={e=>{ if(!isSelected) e.currentTarget.style.background="transparent"; }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 8;
function OverviewGrid({ collabs, todayStr, openEdit, duplicateCollab, setConfirmDel, updateLinks, inp }) {
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? collabs : collabs.slice(0, PAGE_SIZE);
  const hidden  = collabs.length - PAGE_SIZE;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
        {visible.map((c, ci) => {
          const bp = brandHash(c.brand);
          return <CollabCard key={c.id} c={c} ci={ci} bp={bp} todayStr={todayStr} openEdit={openEdit} duplicateCollab={duplicateCollab} setConfirmDel={setConfirmDel} updateLinks={updateLinks} inp={inp}/>;
        })}
      </div>
      {collabs.length > PAGE_SIZE && (
        <button onClick={()=>setShowAll(p=>!p)}
          style={{ marginTop:16, width:"100%", fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, color:C.tan, background:"transparent", border:`1px dashed ${C.beige}`, borderRadius:12, padding:"10px 0", cursor:"pointer", fontStyle:"italic" }}>
          {showAll ? "▲ show less" : `▾ show ${hidden} more partnership${hidden!==1?"s":""}`}
        </button>
      )}
    </div>
  );
}

function CollabCard({ c, ci, bp, todayStr, openEdit, duplicateCollab, setConfirmDel, updateLinks, inp }) {
  const [expanded, setExpanded] = React.useState(false);
  const total  = c.items?.length||0;
  const posted = c.items?.filter(i=>i.status==="Posted").length||0;
  const pct    = total ? Math.round((posted/total)*100) : 0;
  const breakdown = Object.keys(DELIVERABLE_CONFIG).map(t=>({ type:t, count:c.items?.filter(i=>i.type===t).length||0 })).filter(x=>x.count>0);
  const ps = PAYMENT_STATUS_CONFIG[c.paymentStatus||"Unpaid"];
  const isOverdue = !c.gifted && c.paymentStatus!=="Paid" && c.paymentDue && new Date(c.paymentDue+"T12:00:00") < new Date(todayStr+"T12:00:00");
  const isDeadlineOver = c.deadline && new Date(c.deadline+"T12:00:00") < new Date(todayStr+"T12:00:00");
  const allPosted = c.items?.length > 0 && c.items.every(i=>i.status==="Posted");
  const showDeadlineFlag = isDeadlineOver && !allPosted;
  return (
    <div className="fi gh"
      style={{ background:`linear-gradient(148deg, ${bp.bg}99, ${C.fog})`, borderRadius:16, border:`1px solid ${bp.border}`, borderLeft:`3px solid ${bp.dot}`, boxShadow:"0 2px 12px rgba(0,0,0,.04)", transition:"all .25s", animationDelay:`${ci*.07}s`, overflow:"hidden" }}>
      {/* ── Compact tile ── */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:19, fontWeight:400, color:C.darkBrown, lineHeight:1.1 }}>{c.brand}</div>
          <div style={{ display:"flex", gap:5, flexShrink:0, marginLeft:8 }}>
            <button onClick={()=>openEdit(c)} className="cb" title="Edit"
              style={{ width:26, height:26, borderRadius:7, border:`1px solid ${C.beige}`, background:C.cream, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✎</button>
            <button onClick={()=>duplicateCollab(c)} className="cb" title="Duplicate"
              style={{ width:26, height:26, borderRadius:7, border:`1px solid ${C.beige}`, background:C.cream, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>⧉</button>
            <button onClick={()=>setConfirmDel(c.id)} className="cb" title="Delete"
              style={{ width:26, height:26, borderRadius:7, border:`1px solid ${C.beige}`, background:C.sand, color:C.tan, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✕</button>
          </div>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan, fontStyle:"italic", marginBottom:10 }}>
          {new Date(c.startDate+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})} → {new Date(c.endDate+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
          {breakdown.map(({type,count})=>(
            <span key={type} style={{ background:bp.bg, color:bp.text, fontSize:10, fontFamily:"'Cormorant Garamond', serif", letterSpacing:.3, padding:"2px 8px", borderRadius:20, border:`1px solid ${bp.border}` }}>
              {DELIVERABLE_CONFIG[type].symbol} {type} ×{count}
            </span>
          ))}
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.5, color:C.tan, marginBottom:4 }}>
            <span>PROGRESS</span><span style={{ color:C.amber }}>{posted}/{total}</span>
          </div>
          <div style={{ height:3, background:C.beige, borderRadius:2 }}>
            <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, borderRadius:2, transition:"width .5s ease" }}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10, alignItems:"center" }}>
          {c.gifted ? (
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.8, color:C.amber, background:C.sand, border:`1px solid ${C.beige}`, borderRadius:20, padding:"2px 8px" }}>✦ Product Exchange</span>
          ) : (
            <>
              <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.8, color: isOverdue?"#C05040":ps.text, background: isOverdue?"#FDE8E4":C.sand, border:`1px solid ${isOverdue?"#F0C0B0":C.beige}`, borderRadius:20, padding:"2px 8px" }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background: isOverdue?"#E08070":ps.dot, display:"inline-block" }}/>
                {isOverdue?"OVERDUE":(c.paymentStatus||"Unpaid")}
              </span>
              {c.fee && <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color: isOverdue?"#C05040":C.amber }}>S${parseFloat(c.fee).toLocaleString("en-US",{minimumFractionDigits:2})}</span>}
            </>
          )}
          {showDeadlineFlag && (
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.8, color:"#C05040", background:"#FDE8E4", border:"1px solid #F0C0B0", borderRadius:20, padding:"2px 8px" }}>DEADLINE PASSED</span>
          )}
        </div>
        <button onClick={()=>setExpanded(p=>!p)}
          style={{ marginTop:10, fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, background:"transparent", border:"none", padding:0, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontStyle:"italic" }}>
          {expanded ? "▲ less" : "▾ more details"}
        </button>
      </div>
      {/* ── Expanded drawer ── */}
      {expanded && (
        <div style={{ padding:"12px 16px 14px", borderTop:`1px solid ${bp.border}`, display:"flex", flexDirection:"column", gap:10 }}>
          {c.deadline && (
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color: showDeadlineFlag?"#C05040":C.tan }}>
              ◷ Deadline: {new Date(c.deadline+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
            </div>
          )}
          {c.paymentDue && !c.gifted && (
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan }}>
              ◷ Payment due: {new Date(c.paymentDue+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
            </div>
          )}
          {c.brief && (
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.tan, marginBottom:4 }}>BRIEF</div>
              <p style={{ fontSize:12, color:C.brown, lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{c.brief}</p>
            </div>
          )}
          {c.notes && <p style={{ fontSize:12, color:C.tan, fontStyle:"italic" }}>{c.notes}</p>}
          <CollabLinks collab={c} updateLinks={updateLinks} inp={inp} tan={C.tan} amber={C.amber} beige={C.beige} sand={C.sand}/>
        </div>
      )}
    </div>
  );
}

function CollabLinks({ collab, updateLinks, inp, tan, amber, beige, sand }) {
  const [showL, setShowL] = React.useState(false);
  const LCONF = [
    { key:"briefLink", label:"Brief",    icon:"✦" },
    { key:"driveLink", label:"Contract", icon:"◈" },
  ];
  const links   = collab.links||{};
  const custom  = links._custom||[];
  const filledStd = LCONF.filter(l=>links[l.key]);
  const filledCustom = custom.filter(cl=>cl.url||cl.label);
  const totalFilled = filledStd.length + filledCustom.length;
  return (
    <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${beige}` }}>
      <button onClick={()=>setShowL(p=>!p)}
        style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, color:totalFilled>0?amber:tan, background:"transparent", border:"none", padding:0, display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}>
        {totalFilled>0 ? `◈ ${totalFilled} link${totalFilled!==1?"s":""}` : "◈ add links"}
        <span style={{ fontSize:8 }}>{showL?"▲":"▾"}</span>
      </button>
      {showL && (
        <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
          {LCONF.map(({key,label,icon})=>{
            const val   = links[key]||"";
            const isUrl = val.startsWith("http");
            return (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:tan, minWidth:64, flexShrink:0 }}>{icon} {label}</span>
                <div style={{ flex:1, position:"relative" }}>
                  {isUrl ? (
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:amber, textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"5px 8px", background:sand, borderRadius:8, border:`1px solid ${beige}`, display:"block" }}>
                        ↗ {val.replace(/^https?:\/\/(www\.)?/,"").split("/")[0]}
                      </a>
                      <button onClick={()=>updateLinks(collab.id,key,"")}
                        style={{ width:22, height:22, borderRadius:5, background:sand, border:`1px solid ${beige}`, color:tan, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>×</button>
                    </div>
                  ) : (
                    <div style={{ position:"relative" }}>
                      <input value={val} onChange={e=>updateLinks(collab.id,key,e.target.value)}
                        placeholder="Paste link…"
                        style={{...inp, fontSize:11, padding:"5px 8px", paddingRight:val?"32px":"8px"}}/>
                      {val && (
                        <button onClick={()=>updateLinks(collab.id,key,"")}
                          style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", width:20, height:20, borderRadius:4, background:sand, border:`1px solid ${beige}`, color:tan, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>×</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {custom.map((cl, i) => {
            if (!cl.label && !cl.url) return null;
            const isUrl = (cl.url||"").startsWith("http");
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:tan, minWidth:64, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>◈ {cl.label||"Link"}</span>
                <div style={{ flex:1 }}>
                  {isUrl ? (
                    <a href={cl.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:amber, textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"5px 8px", background:sand, borderRadius:8, border:`1px solid ${beige}`, display:"block" }}>
                      ↗ {cl.url.replace(/^https?:\/\/(www\.)?/,"").split("/")[0]}
                    </a>
                  ) : (
                    <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:tan }}>{cl.url||"—"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Next7List({ items, todayStr }) {
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? items : items.slice(0, 3);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {visible.map((item, i) => {
          const isToday   = item.date === todayStr;
          const isTomorrow = item.date === (() => { const d = new Date(todayStr+"T12:00:00"); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; })();
          const dateLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : new Date(item.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
          const iconColor = item.type==="payment" ? "#88C0A0" : item.type==="deadline" ? "#E8A080" : item.bp.dot;
          return (
            <div key={i} style={{ background:C.fog, border:`1px solid ${C.beige}`, borderRadius:14, padding:"14px 12px", display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:isToday?C.amber:C.tan, fontWeight:isToday?500:400, fontStyle:isToday?"normal":"italic" }}>{dateLabel}</div>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:item.bp.dot, flexShrink:0 }}/>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:14, color:C.darkBrown }}>{item.brand}</span>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan }}>{item.label}</div>
            </div>
          );
        })}
      </div>
      {items.length > 3 && (
        <button onClick={()=>setShowAll(p=>!p)}
          style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan, background:"transparent", border:"none", cursor:"pointer", textAlign:"left", fontStyle:"italic" }}>
          {showAll ? "▲ show less" : `+ ${items.length-3} more`}
        </button>
      )}
    </div>
  );
}

function MoreLinksToggle({ links, onChange, inp }) {
  const initCustom = links._custom||[];
  const [open, setOpen] = React.useState(initCustom.length > 0);
  const [customLinks, setCustomLinks] = React.useState(initCustom);
  React.useEffect(() => { setCustomLinks(links._custom||[]); }, [links._custom]);
  function addCustom() { const next = [...customLinks, {label:"",url:""}]; setCustomLinks(next); onChange("_custom", next); }
  function updateCustom(i,field,val) {
    setCustomLinks(p=>{ const next=[...p]; next[i]={...next[i],[field]:val}; onChange("_custom", next); return next; });
  }
  function removeCustom(i) {
    setCustomLinks(p=>{ const next=p.filter((_,j)=>j!==i); onChange("_custom", next); return next; });
  }
  return (
    <div>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan, background:"transparent", border:"none", cursor:"pointer", fontStyle:"italic", padding:0, display:"flex", alignItems:"center", gap:4 }}>
        {open ? "▲ fewer fields" : customLinks.length > 0 ? `+ ${customLinks.length} more link${customLinks.length!==1?"s":""}` : "+ add more links"}
      </button>
      {open && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
          {customLinks.map((cl,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input value={cl.label} onChange={e=>updateCustom(i,"label",e.target.value)} placeholder="Label…" style={{...inp,width:90,padding:"8px 10px",fontSize:12,flexShrink:0}}/>
              <input value={cl.url} onChange={e=>updateCustom(i,"url",e.target.value)} placeholder="https://…" style={{...inp,flex:1,padding:"8px 12px",fontSize:12}}/>
              <button onClick={()=>removeCustom(i)} style={{ width:22,height:22,borderRadius:5,background:C.sand,border:`1px solid ${C.beige}`,color:C.tan,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>×</button>
            </div>
          ))}
          <button onClick={addCustom}
            style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan, background:"transparent", border:`1px dashed ${C.beige}`, borderRadius:10, padding:"7px 12px", cursor:"pointer", textAlign:"left" }}>
            + another link
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CollabCelestia() {
  const today     = new Date();
  const todayStr  = today.toISOString().split("T")[0];

  const [winW, setWinW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setWinW(window.innerWidth);
    window.addEventListener("resize", fn);
    // also fire on any resize observer of the root element
    try {
      const ro = new ResizeObserver(entries => {
        for (const e of entries) setWinW(e.contentRect.width);
      });
      ro.observe(document.documentElement);
      return () => { window.removeEventListener("resize", fn); ro.disconnect(); };
    } catch { return () => window.removeEventListener("resize", fn); }
  }, []);
  const isMobile = winW < 540;

  const [view, setView]               = useState("home");
  const [collabs, setCollabs]         = useState([]);
  const [calYear, setCalYear]         = useState(today.getFullYear());
  const [calMonth, setCalMonth]       = useState(today.getMonth());
  const [blackoutDates, setBlackout]  = useState([]);
  const [offDays, setOffDays]         = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [confirmDel, setConfirmDel]   = useState(null);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiTip, setAiTip]             = useState("");
  const [placing, setPlacing]         = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [placeForm, setPlaceForm]     = useState({ collabId: "", type: "Reel" });
  const [editingCollab, setEditingCollab] = useState(null);
  const [editForm, setEditForm]       = useState(null);
  const [dragItem, setDragItem]       = useState(null);
  const [dragOver, setDragOver]       = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus]   = useState("");
  const [payMonth, setPayMonth]       = useState(today.getMonth());
  const [payYear, setPayYear]         = useState(today.getFullYear());
  const [scheduleMode, setScheduleMode] = useState("manual");
  const [formType, setFormType] = useState("partnership"); // "partnership" or "event"
  const [manualSchedule, setManualSchedule] = useState({});
  const [gcalToken, setGcalToken]       = useState(() => localStorage.getItem('ocd-gcal-token') || null);
  const [gcalConnecting, setGcalConnecting] = useState(false);
  const [gcalCalendarId, setGcalCalendarId] = useState(() => localStorage.getItem('ocd-gcal-calid') || 'primary');
  const [gcalCalendars, setGcalCalendars] = useState([]);
  const [showCalPicker, setShowCalPicker] = useState(false);

  // ── Restore Google Calendar connection on mount ──
  useEffect(() => {
    const savedToken = localStorage.getItem('ocd-gcal-token');
    const expiresAt  = parseInt(localStorage.getItem('ocd-gcal-expires') || '0');
    if (savedToken && Date.now() < expiresAt) {
      // Token still valid
      fetchCalendars(savedToken);
    } else {
      // Try to refresh using stored refresh token
      autoRefreshToken();
    }
  }, []);

  async function autoRefreshToken() {
    try {
      const res = await fetch('/api/refresh-token', { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.access_token) {
        const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
        setGcalToken(data.access_token);
        localStorage.setItem('ocd-gcal-token', data.access_token);
        localStorage.setItem('ocd-gcal-expires', expiresAt.toString());
        fetchCalendars(data.access_token);
      }
    } catch {}
  }

  // ── Load from Supabase on mount ──
  useEffect(() => {
    async function loadData() {
      try {
        const r1 = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/partnerships?select=data&order=created_at.asc`, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
        });
        const d1 = await r1.json();
        if (d1 && d1.length > 0) setCollabs(d1.map(r => r.data));
      } catch {}
      try {
        const r2 = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blackouts?select=dates&order=created_at.desc&limit=1`, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
        });
        const d2 = await r2.json();
        if (d2 && d2.length > 0) setBlackout(d2[0].dates);
      } catch {}
      try {
        const r3 = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/offdays?select=days&order=created_at.desc&limit=1`, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
        });
        const d3 = await r3.json();
        if (d3 && d3.length > 0) setOffDays(d3[0].days);
      } catch {}
      setStorageReady(true);
    }
    loadData();
  }, []);

  // ── Save partnerships whenever they change ──
  useEffect(() => {
    if (!storageReady) return;
    setSaveStatus("saving");
    async function savePartnerships() {
      try {
        // Delete all and re-insert to keep in sync
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/partnerships?id=neq.00000000-0000-0000-0000-000000000000`, {
          method: "DELETE",
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, Prefer: "return=minimal" },
        });
        if (collabs.length > 0) {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/partnerships`, {
            method: "POST",
            headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify(collabs.map(c => ({ data: c })))
          });
        }
        setSaveStatus("saved"); setTimeout(() => setSaveStatus(""), 2000);
      } catch { setSaveStatus(""); }
    }
    savePartnerships();
  }, [collabs, storageReady]);

  // ── Save blackout dates whenever they change ──
  useEffect(() => {
    if (!storageReady) return;
    async function saveBlackouts() {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blackouts?id=neq.00000000-0000-0000-0000-000000000000`, {
          method: "DELETE",
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, Prefer: "return=minimal" },
        });
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blackouts`, {
          method: "POST",
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify([{ dates: blackoutDates }])
        });
      } catch {}
    }
    saveBlackouts();
  }, [blackoutDates, storageReady]);

  // ── Save off days whenever they change ──
  useEffect(() => {
    if (!storageReady) return;
    async function saveOffDays() {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/offdays?id=neq.00000000-0000-0000-0000-000000000000`, {
          method: "DELETE",
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, Prefer: "return=minimal" },
        });
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/offdays`, {
          method: "POST",
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify([{ days: offDays }])
        });
      } catch {}
    }
    saveOffDays();
  }, [offDays, storageReady]);
  const [form, setForm]               = useState({
    brand: "", startDate: "", endDate: "", singleDay: false, notes: "", fee: "",
    feeBreakdown: { cash: "", storeCredit: "", voucher: "" },
    paymentStatus: "Unpaid", gifted: false, brief: "", paymentDue: "", deadline: "",
    deliverables: [{ type: "Reel", count: 0, maxPerDay: 0 }, { type: "IGS", count: 0, maxPerDay: 0 }, { type: "Feed Post", count: 0, maxPerDay: 0 }],
    links: { briefLink: "", driveLink: "" },
  });

  const allItems   = collabs.flatMap(c => (c.items||[]).map(i => ({ ...i, brand: c.brand, collabId: c.id })));
  const dayItems   = (d) => {
    const items = allItems.filter(i => i.date === d);
    // Also include events (no deliverables) that fall on this date
    collabs.forEach(c => {
      if (c.collabType === 'event') {
        const start = c.startDate;
        const end = c.endDate || c.startDate;
        if (d >= start && d <= end) {
          // Only add event chip if no deliverable already covers this date for this collab
          const hasDelivOnDate = (c.items||[]).some(i => i.date === d);
          if (!hasDelivOnDate) {
            items.push({ id: c.id+'-event', brand: c.brand, type: 'Event', date: d, status: 'Scheduled', collabId: c.id, isEventChip: true });
          }
        }
      }
    });
    return items;
  };
  const toggleBlk  = (d) => setBlackout(p => p.includes(d) ? p.filter(x => x!==d) : [...p, d]);
  const toggleOffDay = async (d) => {
    const isRemoving = offDays.includes(d);
    setOffDays(p => isRemoving ? p.filter(x => x!==d) : [...p, d]);
    if (gcalToken) {
      if (isRemoving) {
        // Delete Off Day event from Google Calendar
        try {
          const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events?privateExtendedProperty=offDayDate%3D${d}`, {
            headers: { Authorization: `Bearer ${gcalToken}` }
          });
          const data = await res.json();
          if (data.items) {
            for (const ev of data.items) {
              await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events/${ev.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${gcalToken}` }
              });
            }
          }
        } catch {}
      } else {
        // Create Off Day event in Google Calendar
        try {
          await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${gcalToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              summary: 'Off Day',
              start: { date: d },
              end: { date: d },
              extendedProperties: { private: { offDayDate: d } }
            })
          });
        } catch {}
      }
    }
  };
  function updateLinks(collabId, key, value) {
    setCollabs(p => p.map(c => c.id!==collabId ? c : { ...c, links: { ...(c.links||{}), [key]: value } }));
  }
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay    = getFirstDay(calYear, calMonth);

  // ── Google Calendar helpers ──
  function connectGoogleCalendar() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&prompt=consent&access_type=offline`;
    setGcalConnecting(true);
    const popup = window.open(authUrl, 'gcal_auth', 'width=500,height=600');
    const check = setInterval(async () => {
      try {
        if (popup && popup.location && popup.location.search) {
          const params = new URLSearchParams(popup.location.search.substring(1));
          const code = params.get('code');
          if (code) {
            clearInterval(check);
            popup.close();
            // Exchange code for tokens via our serverless function
            const res = await fetch('/api/google-auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, redirect_uri: redirectUri }),
            });
            const data = await res.json();
            if (data.access_token) {
              const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
              setGcalToken(data.access_token);
              localStorage.setItem('ocd-gcal-token', data.access_token);
              localStorage.setItem('ocd-gcal-expires', expiresAt.toString());
              fetchCalendars(data.access_token);
            }
            setGcalConnecting(false);
          }
        }
        if (popup && popup.closed) { clearInterval(check); setGcalConnecting(false); }
      } catch {}
    }, 500);
  }

  async function fetchCalendars(token) {
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.items) {
        setGcalCalendars(data.items.filter(c => c.accessRole === 'owner' || c.accessRole === 'writer'));
        setShowCalPicker(true);
      }
    } catch {}
  }

  async function getOrCreateTaskList(token) {
    try {
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const existing = data.items?.find(l => l.title === 'Our Cosy Partnerships');
      if (existing) return existing.id;
      const created = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Our Cosy Partnerships' })
      });
      const list = await created.json();
      return list.id;
    } catch { return '@default'; }
  }

  async function createGcalEvents(collab, token) {
    if (!token) return;
    const listId = await getOrCreateTaskList(token);
    const items = collab.items || [];
    // Group items by date + type to stack them
    const grouped = {};
    items.forEach(item => {
      const key = `${item.date}||${item.type}`;
      if (!grouped[key]) grouped[key] = { date: item.date, type: item.type, count: 0, ids: [] };
      grouped[key].count++;
      grouped[key].ids.push(item.id);
    });
    for (const group of Object.values(grouped)) {
      const title = group.count > 1 ? `${collab.brand} • ${group.type} x${group.count}` : `${collab.brand} • ${group.type}`;
      const due = new Date(group.date + 'T00:00:00.000Z').toISOString();
      try {
        await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            due,
            notes: `Partnership ID: ${collab.id} | Item IDs: ${group.ids.join(',')}`
          })
        });
      } catch {}
    }
  }

  async function deleteGcalEvents(collabId, token) {
    if (!token) return;
    const listId = await getOrCreateTaskList(token);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.items) {
        for (const task of data.items) {
          if (task.notes?.includes(`Partnership ID: ${collabId}`)) {
            await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${task.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }
      }
    } catch {}
  }

  async function updateGcalEventStatus(itemId, collabId, brand, type, status, date, token) {
    if (!token) return;
    const listId = await getOrCreateTaskList(token);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.items) {
        const task = data.items.find(t => t.notes?.includes(`Item ID: ${itemId}`) || t.notes?.includes(`Item IDs: ${itemId}`) || t.notes?.includes(`,${itemId}`) || t.notes?.includes(`${itemId},`));
        if (task) {
          await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: status === 'Posted' ? 'completed' : 'needsAction',
              completed: status === 'Posted' ? new Date().toISOString() : null
            })
          });
        }
      }
    } catch {}
  }

  function adjMonth(delta) {
    if (delta === -1) { calMonth === 0 ? (setCalMonth(11), setCalYear(y=>y-1)) : setCalMonth(m=>m-1); }
    else              { calMonth === 11 ? (setCalMonth(0), setCalYear(y=>y+1)) : setCalMonth(m=>m+1); }
  }

  const resetForm = () => setForm({
    brand: "", startDate: "", endDate: "", singleDay: false, notes: "", fee: "",
    feeBreakdown: { cash: "", storeCredit: "", voucher: "" },
    paymentStatus: "Unpaid", gifted: false, brief: "", paymentDue: "", deadline: "",
    deliverables: [{ type: "Reel", count: 0, maxPerDay: 0 }, { type: "IGS", count: 0, maxPerDay: 0 }, { type: "Feed Post", count: 0, maxPerDay: 0 }],
    links: { briefLink: "", driveLink: "" },
  });

  async function createCalendarEvent(collab, token) {
    if (!token) return;
    try {
      const hasTime = collab.startTime && collab.endTime;
      const eventBody = {
        summary: collab.brand,
        description: collab.notes || '',
        location: collab.location || '',
        extendedProperties: { private: { collabId: collab.id, type: 'event' } }
      };
      if (hasTime) {
        eventBody.start = { dateTime: `${collab.startDate}T${collab.startTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
        eventBody.end   = { dateTime: `${collab.endDate || collab.startDate}T${collab.endTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      } else {
        eventBody.start = { date: collab.startDate };
        eventBody.end   = { date: collab.endDate || collab.startDate };
      }
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody)
      });
    } catch {}
  }

  async function handleAdd() {
    const endDate = form.singleDay ? form.startDate : form.endDate;
    const delivs  = form.deliverables.filter(d => d.count > 0);
    const newId   = Date.now().toString();

    if (formType === 'event') {
      const items = [];
      if (scheduleMode === 'manual') {
        Object.entries(manualSchedule).forEach(([date, typeMap]) => {
          Object.entries(typeMap).forEach(([type, count]) => {
            for (let i = 0; i < count; i++)
              items.push({ type, date, status: 'Scheduled', id: `${Date.now()}-${Math.random()}` });
          });
        });
      }
      const newCollab = { ...form, endDate, id: newId, items, collabType: 'event' };
      setCollabs(p => [...p, newCollab]);
      if (gcalToken) {
        createCalendarEvent({ ...newCollab, startDate: form.startDate, endDate: endDate || form.startDate, startTime: form.startTime||'', endTime: form.endTime||'' }, gcalToken);
        if (items.length > 0) createGcalEvents(newCollab, gcalToken);
      }
      resetForm(); setManualSchedule({}); setFormType('partnership'); setShowModal(false); setView('overview');
      return;
    }

    if (scheduleMode === "manual") {
      const items = [];
      Object.entries(manualSchedule).forEach(([date, typeMap]) => {
        Object.entries(typeMap).forEach(([type, count]) => {
          for (let i = 0; i < count; i++)
            items.push({ type, date, status: "Scheduled", id: `${Date.now()}-${Math.random()}` });
        });
      });
      const newCollab = { ...form, endDate, id: newId, items, collabType: 'partnership' };
      setCollabs(p => [...p, newCollab]);
      if (gcalToken) createGcalEvents(newCollab, gcalToken);
      resetForm(); setManualSchedule({}); setFormType("partnership"); setShowModal(false); setView("overview");
    } else {
      setAiLoading(true); setAiTip("");
      const items = autoSpread({ ...form, endDate, deliverables: delivs }, blackoutDates);
      try {
        const total  = delivs.reduce((s, d) => s + d.count, 0);
        const prompt = `Content creator collab with "${form.brand}" from ${form.startDate} to ${endDate}. Deliverables: ${delivs.map(d=>`${d.count} ${d.type}(s)`).join(", ")} (${total} total). Give ONE short practical tip (2 sentences max) for managing this workload. Warm, direct tone.`;
        const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
        const data = await res.json();
        setAiTip(data.content?.[0]?.text || "");
      } catch {}
      const newCollab = { ...form, endDate, id: newId, items, collabType: 'partnership' };
      setCollabs(p => [...p, newCollab]);
      if (gcalToken) createGcalEvents(newCollab, gcalToken);
      resetForm(); setManualSchedule({}); setFormType("partnership"); setAiLoading(false); setShowModal(false); setView("overview");
    }
  }

  function updStatus(cId, iId, status) {
    setCollabs(p => p.map(c => {
      if (c.id!==cId) return c;
      const item = c.items.find(i => i.id===iId);
      if (item && gcalToken) updateGcalEventStatus(iId, cId, c.brand, item.type, status, item.date, gcalToken);
      return { ...c, items: c.items.map(i => i.id!==iId ? i : { ...i, status }) };
    }));
  }
  async function updateTaskDate(itemId, newDate, token) {
    if (!token) return;
    const listId = await getOrCreateTaskList(token);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.items) {
        const task = data.items.find(t => t.notes?.includes(`Item ID: ${itemId}`));
        if (task) {
          await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ due: new Date(newDate + 'T00:00:00.000Z').toISOString() })
          });
        }
      }
    } catch {}
  }

  function nudge(cId, iId, delta) {
    setCollabs(p => p.map(c => c.id!==cId ? c : {
      ...c, items: c.items.map(i => {
        if (i.id!==iId) return i;
        const d = new Date(i.date+"T12:00:00"); d.setDate(d.getDate()+delta);
        const newDate = d.toISOString().split("T")[0];
        if (gcalToken) updateTaskDate(iId, newDate, gcalToken);
        return { ...i, date: newDate };
      })
    }));
  }
  async function delCollab(id) {
    const collab = collabs.find(c => c.id === id);
    if (gcalToken) {
      // Delete tasks for all deliverables
      deleteGcalEvents(id, gcalToken);
      // If it was an event type, also delete the Google Calendar event
      if (collab?.collabType === 'event') {
        try {
          const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events?privateExtendedProperty=collabId%3D${id}`, {
            headers: { Authorization: `Bearer ${gcalToken}` }
          });
          const data = await res.json();
          if (data.items) {
            for (const ev of data.items) {
              await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events/${ev.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${gcalToken}` }
              });
            }
          }
        } catch {}
      }
    }
    setCollabs(p => p.filter(c => c.id!==id));
  }
  function moveItemToDate(cId, iId, newDate) {
    if (!newDate) return;
    if (gcalToken) updateTaskDate(iId, newDate, gcalToken);
    setCollabs(p => p.map(c => c.id!==cId ? c : {
      ...c, items: c.items.map(i => i.id!==iId ? i : { ...i, date: newDate })
    }));
  }
  function moveGroupToDate(cId, type, fromDate, newDate) {
    if (!newDate) return;
    setCollabs(p => p.map(c => c.id!==cId ? c : {
      ...c, items: c.items.map(i => {
        if (i.type===type && i.date===fromDate) {
          if (gcalToken) updateTaskDate(i.id, newDate, gcalToken);
          return { ...i, date: newDate };
        }
        return i;
      })
    }));
  }
  function updateItemNote(cId, iId, note) {
    setCollabs(p => p.map(c => c.id!==cId ? c : {
      ...c, items: c.items.map(i => i.id!==iId ? i : { ...i, note })
    }));
  }
  function updateGroupNote(cId, type, date, note) {
    setCollabs(p => p.map(c => c.id!==cId ? c : {
      ...c, items: c.items.map(i => i.type===type && i.date===date ? { ...i, note } : i)
    }));
  }
  function placeItem(dateStr, collabId, type) {
    if (!collabId) return;
    const newItem = { type, date: dateStr, status: "Scheduled", id: `${Date.now()}-${Math.random()}` };
    setCollabs(p => p.map(c => c.id!==collabId ? c : { ...c, items: [...(c.items||[]), newItem] }));
    setPlacing(false);
    setPlaceForm({ collabId: "", type: "Reel" });
  }

  function openEdit(c) {
    // rebuild deliverables from item counts
    const deliverables = Object.keys(DELIVERABLE_CONFIG).map(type => ({
      type, count: c.items?.filter(i=>i.type===type).length||0, maxPerDay: 0
    }));
    setEditForm({ brand: c.brand, startDate: c.startDate, endDate: c.endDate, singleDay: c.singleDay||false, notes: c.notes||"", fee: c.fee||"", feeBreakdown: c.feeBreakdown||{cash:"",storeCredit:"",voucher:""}, paymentStatus: c.paymentStatus||"Unpaid", gifted: c.gifted||false, brief: c.brief||"", paymentDue: c.paymentDue||"", deadline: c.deadline||"", links: c.links||{}, deliverables });
    setEditingCollab(c);
  }

  async function saveEdit() {
    if (!editForm || !editingCollab) return;
    const c = editingCollab;
    const newDelivs = editForm.deliverables.filter(d=>d.count>0);
    const existingItems = c.items||[];
    const newItems = autoSpread({ ...editForm, deliverables: newDelivs }, blackoutDates);
    const statusMap = {};
    existingItems.forEach((item,i) => { if (!statusMap[item.type]) statusMap[item.type]=[]; statusMap[item.type].push(item.status); });
    newItems.forEach(item => {
      const queue = statusMap[item.type];
      if (queue && queue.length) item.status = queue.shift();
    });
    setCollabs(p => p.map(col => col.id!==c.id ? col : { ...col, ...editForm, items: newItems, links: editForm.links||{} }));

    // Sync to Google
    if (gcalToken) {
      // Update task dates for deliverables
      newItems.forEach(item => {
        const old = existingItems.find(i => i.id === item.id);
        if (old && old.date !== item.date) updateTaskDate(item.id, item.date, gcalToken);
      });
      // If event type, update the Google Calendar event date too
      if (c.collabType === 'event') {
        try {
          const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events?privateExtendedProperty=collabId%3D${c.id}`, {
            headers: { Authorization: `Bearer ${gcalToken}` }
          });
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const ev = data.items[0];
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(gcalCalendarId)}/events/${ev.id}`, {
              method: 'PATCH',
              headers: { Authorization: `Bearer ${gcalToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                summary: editForm.brand,
                location: editForm.location || '',
                ...(editForm.startTime && editForm.endTime ? {
                  start: { dateTime: `${editForm.startDate}T${editForm.startTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                  end:   { dateTime: `${editForm.endDate||editForm.startDate}T${editForm.endTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
                } : {
                  start: { date: editForm.startDate },
                  end:   { date: editForm.endDate || editForm.startDate }
                })
              })
            });
          }
        } catch {}
      }
    }

    setEditingCollab(null); setEditForm(null);
  }

  function markAllPosted(collabId, type, date) {
    setCollabs(p => p.map(c => c.id!==collabId ? c : {
      ...c, items: c.items.map(i => {
        if (i.type===type && i.date===date) {
          if (gcalToken) updateGcalEventStatus(i.id, collabId, c.brand, type, "Posted", date, gcalToken);
          return { ...i, status:"Posted" };
        }
        return i;
      })
    }));
  }

  function markGroupStatus(collabId, type, date, status) {
    setCollabs(p => p.map(c => c.id!==collabId ? c : {
      ...c, items: c.items.map(i => {
        if (i.type===type && i.date===date) {
          if (gcalToken) updateGcalEventStatus(i.id, collabId, c.brand, type, status, date, gcalToken);
          return { ...i, status };
        }
        return i;
      })
    }));
  }

  function updatePayment(collabId, field, value) {
    setCollabs(p => p.map(c => c.id!==collabId ? c : { ...c, [field]: value }));
  }

  function duplicateCollab(c) {
    const deliverables = Object.keys(DELIVERABLE_CONFIG).map(type => ({
      type, count: c.items?.filter(i=>i.type===type).length||0
    }));
    setForm({ brand: c.brand, startDate: "", endDate: "", notes: c.notes||"", fee: c.fee||"", paymentStatus: "Unpaid", gifted: c.gifted||false, brief: c.brief||"", deliverables });
    setShowModal(true);
  }

  // shared input style
  const inp = { width:"100%", padding:"11px 16px", border:`1px solid ${C.beige}`, borderRadius:14, fontSize:15, background:C.parchment, color:C.ink, outline:"none", fontFamily:"'Crimson Pro', serif" };
  const lbl = { display:"block", fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:2, color:C.tan, marginBottom:7 };

  return (
    <div style={{ fontFamily:"'Crimson Pro', Georgia, serif", background:C.parchment, minHeight:"100vh", color:C.ink, position:"relative", overflowX:"hidden" }}>
      <style>{FONTS}{`
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;background:none;font-family:inherit}
        input,select,textarea{font-family:inherit}
        .fi{animation:fi .5s cubic-bezier(.22,1,.36,1)}
        @keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .gh:hover{box-shadow:0 0 28px rgba(184,149,90,.18),0 8px 32px rgba(0,0,0,.08)!important;transform:translateY(-2px)}
        .nb:hover{background:${C.sand}!important}
        .cc:hover{background:${C.sand}!important}
        .cb:hover{opacity:.82;transform:translateY(-1px)}
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
        input[type="date"]{color-scheme:light;accent-color:#B8955A}
        input[type="date"]::-webkit-calendar-picker-indicator{opacity:.4;cursor:pointer;filter:sepia(1) hue-rotate(10deg) saturate(.5)}
        input[type="date"]:focus{border-color:#8A7055!important;outline:none}
        ::-webkit-scrollbar{width:0px;background:transparent}
        .date-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:600px){
          .date-grid{grid-template-columns:1fr!important;gap:10px}
          .header-inner{flex-wrap:wrap;height:auto!important;padding:10px 16px!important;gap:10px}
          .header-nav{order:3;width:100%;justify-content:center}
          .header-brand{flex:1}
          .header-btn{order:2}
        }
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:transparent}
      `}</style>

      {/* ── Starfield background ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
          {STARS.map((s,i) => (
            <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill={C.gold} opacity={s.o}>
              <animate attributeName="opacity" values={`${s.o};${s.o*.35};${s.o}`} dur={`${s.dur}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>
        <Orbit size={190} style={{ position:"absolute", top:-40, right:60, opacity:.3 }}/>
        <Constellation style={{ position:"absolute", bottom:50, left:30, opacity:.38 }}/>
        <Moon size={64} style={{ position:"absolute", top:110, left:"14%", opacity:.22 }}/>
        <Sparkle size={12} style={{ position:"absolute", top:"25%", right:"20%", opacity:.3 }}/>
        <Sparkle size={8}  style={{ position:"absolute", top:"60%", left:"8%",  opacity:.25 }}/>
        {/* subtle warm gradient glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 18% 8%, rgba(184,149,90,.06) 0%, transparent 55%), radial-gradient(ellipse at 82% 85%, rgba(200,185,154,.07) 0%, transparent 50%)" }}/>
      </div>

      {/* ── Header ── */}
      <header className="header-inner" style={{ position:"relative", zIndex:10, borderBottom:`1px solid ${C.beige}`, background:`${C.cream}D8`, backdropFilter:"blur(10px)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
        <div className="header-brand" style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Sparkle size={18}/>
          <span style={{ fontFamily:"'Crimson Pro', serif", fontSize:22, fontStyle:"italic", color:C.amber, letterSpacing:1 }}>ourcosydays</span>
        </div>
        <nav className="header-nav" style={{ display:"flex", gap:3 }}>
          {[["home","✦ Home"],["overview","◯ Overview"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} className="nb"
              style={{ padding:"6px 14px", borderRadius:20, fontSize:12, letterSpacing:.5, fontFamily:"'Cormorant Garamond', serif", background:view===v?C.sand:"transparent", color:view===v?C.amber:C.tan, border:view===v?`1px solid ${C.beige}`:"1px solid transparent", transition:"all .2s" }}>
              {label}
            </button>
          ))}
          {/* Calendar dropdown */}
          {(()=>{
            const calActive = view==="calendar"||view==="blackout";
            const [hovering, setHovering] = React.useState(false);
            return (
              <div style={{ position:"relative" }}
                onMouseEnter={()=>setHovering(true)}
                onMouseLeave={()=>setHovering(false)}>
                <button onClick={()=>setView("calendar")} className="nb"
                  style={{ padding:"6px 14px", borderRadius:20, fontSize:12, letterSpacing:.5, fontFamily:"'Cormorant Garamond', serif", background:calActive?C.sand:"transparent", color:calActive?C.amber:C.tan, border:calActive?`1px solid ${C.beige}`:"1px solid transparent", transition:"all .2s", display:"flex", alignItems:"center", gap:5 }}>
                  ▣ Calendar
                  <span style={{ fontSize:7, opacity:.6 }}>▾</span>
                </button>
                {hovering && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:999, background:C.cream, border:`1px solid ${C.beige}`, borderRadius:12, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,.08)", minWidth:"100%", whiteSpace:"nowrap" }}>
                    <button onClick={()=>{ setView("calendar"); setHovering(false); }}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 16px", fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:.5, color:view==="calendar"?C.amber:C.tan, background:view==="calendar"?C.sand:"transparent", border:"none", cursor:"pointer", transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.sand}
                      onMouseLeave={e=>e.currentTarget.style.background=view==="calendar"?C.sand:"transparent"}>
                      ▣ Calendar
                    </button>
                    <button onClick={()=>{ setView("blackout"); setHovering(false); }}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 16px", fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:.5, color:view==="blackout"?C.amber:C.tan, background:view==="blackout"?C.sand:"transparent", border:"none", cursor:"pointer", borderTop:`1px solid ${C.beige}`, transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.sand}
                      onMouseLeave={e=>e.currentTarget.style.background=view==="blackout"?C.sand:"transparent"}>
                      ✦ Off Days
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
          <button onClick={()=>setView("payments")} className="nb"
            style={{ padding:"6px 14px", borderRadius:20, fontSize:12, letterSpacing:.5, fontFamily:"'Cormorant Garamond', serif", background:view==="payments"?C.sand:"transparent", color:view==="payments"?C.amber:C.tan, border:view==="payments"?`1px solid ${C.beige}`:"1px solid transparent", transition:"all .2s" }}>
            $ Payments
          </button>
        </nav>
        <div className="header-btn" style={{ display:"flex", alignItems:"center", gap:10 }}>
          {saveStatus && (
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color: saveStatus==="saving" ? C.tan : C.amber, opacity:.8, transition:"all .3s" }}>
              {saveStatus==="saving" ? "SAVING…" : "✦ SAVED"}
            </span>
          )}
          <button onClick={()=>setShowModal(true)} className="cb"
            style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.amber})`, color:C.cream, padding:"8px 18px", borderRadius:20, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1.5, boxShadow:`0 4px 20px ${C.gold}45`, transition:"all .2s", whiteSpace:"nowrap" }}>
            + NEW
          </button>
        </div>
      </header>

      <main style={{ position:"relative", zIndex:5, maxWidth:1080, margin:"0 auto", padding:"24px 16px" }}>

        {/* AI Tip */}
        {aiTip && (
          <div className="fi" style={{ background:`linear-gradient(135deg, ${C.sand}, ${C.fog})`, border:`1px solid ${C.beige}`, borderRadius:18, padding:"18px 24px", marginBottom:28, display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
            <Sparkle size={16} style={{ marginTop:2, flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2.5, color:C.amber, marginBottom:6 }}>CELESTIAL GUIDANCE</div>
              <div style={{ fontSize:15, color:C.darkBrown, lineHeight:1.75 }}>{aiTip}</div>
            </div>
            <button onClick={()=>setAiTip("")} style={{ marginLeft:"auto", color:C.tan, fontSize:20, flexShrink:0 }}>×</button>
          </div>
        )}

        {/* ════ HOME ════ */}
        {view==="home" && (
          <div className="fi" style={{ maxWidth:580, margin:"0 auto", padding:"48px 0" }}>
            <div style={{ textAlign:"center", marginBottom:36 }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
                <Orbit size={90} style={{ opacity:.6 }}/>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:3, color:C.tan, marginBottom:10 }}>WELCOME TO</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:32, fontWeight:300, color:C.darkBrown, marginBottom:12, letterSpacing:.5 }}>ourcosydays</h2>
              <p style={{ fontSize:15, color:C.tan, fontStyle:"italic", lineHeight:1.8 }}>Your cosy space to manage brand partnerships,<br/>track deliverables, and stay on top of payments.</p>
            </div>

            {/* Upcoming deadlines widget — always visible */}
            {(()=>{
              const in7 = new Date(); in7.setDate(in7.getDate() + 7);
              const in7Str = in7.toISOString().split("T")[0];
              const upcoming = [];
              collabs.forEach(c => {
                const bp = brandHash(c.brand);
                (c.items||[]).filter(i => i.status!=="Posted" && i.date >= todayStr && i.date <= in7Str).forEach(i => {
                  upcoming.push({ date: i.date, label: `${DELIVERABLE_CONFIG[i.type]?.symbol} ${i.type}`, brand: c.brand, bp, type:"content" });
                });
                if (c.deadline && c.deadline >= todayStr && c.deadline <= in7Str) {
                  const allPosted = c.items?.length > 0 && c.items.every(i=>i.status==="Posted");
                  if (!allPosted) upcoming.push({ date: c.deadline, label:"Content deadline", brand: c.brand, bp, type:"deadline" });
                }
                if (!c.gifted && c.paymentDue && c.paymentDue >= todayStr && c.paymentDue <= in7Str && c.paymentStatus!=="Paid") {
                  upcoming.push({ date: c.paymentDue, label:"Payment due", brand: c.brand, bp, type:"payment" });
                }
              });
              upcoming.sort((a,b) => a.date.localeCompare(b.date));
              return (
                <div style={{ background:`${C.cream}E0`, borderRadius:18, border:`1px solid ${C.beige}`, padding:"20px 24px", marginBottom:36 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:2, color:C.tan, marginBottom:14 }}>COMING UP</div>
                  {upcoming.length === 0 ? (
                    <div style={{ fontSize:13, color:C.tan, fontStyle:"italic", textAlign:"center", padding:"8px 0" }}>Nothing due — enjoy the quiet ✦</div>
                  ) : (
                    <Next7List items={upcoming} todayStr={todayStr}/>
                  )}
                </div>
              );
            })()}

            {collabs.length === 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
              {[
                { num:"01", title:"Add a partnership", desc:"Hit + NEW to add a brand deal. Set the date range, deliverables, fee, and paste in your brief." },
                { num:"02", title:"AI schedules your content", desc:"The AI spreads your Reels, Stories, and Feed Posts evenly across the campaign period, skipping any blackout dates." },
                { num:"03", title:"Track on the calendar", desc:"Head to Calendar to see your schedule. Click a day to update statuses, or drag chips to reschedule." },
                { num:"04", title:"Stay on top of payments", desc:"Use the Payments tab to log fees and track what's unpaid, invoiced, or paid — filtered by month." },
              ].map(step => (
                <div key={step.num} style={{ display:"flex", gap:18, alignItems:"flex-start", padding:"18px 22px", background:`${C.cream}E0`, borderRadius:18, border:`1px solid ${C.beige}` }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:300, color:C.gold, opacity:.8, flexShrink:0, lineHeight:1 }}>{step.num}</div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:14, fontWeight:500, color:C.darkBrown, marginBottom:4, letterSpacing:.3 }}>{step.title}</div>
                    <div style={{ fontSize:13, color:C.tan, lineHeight:1.7 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            )}

            <div style={{ textAlign:"center" }}>
              <button onClick={()=>setShowModal(true)} className="cb"
                style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.amber})`, color:C.cream, padding:"14px 36px", borderRadius:20, fontFamily:"'Cormorant Garamond', serif", fontSize:13, letterSpacing:1.5, boxShadow:`0 4px 20px ${C.gold}45`, transition:"all .2s" }}>
                ✦ ADD PARTNERSHIP
              </button>

            </div>
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {view==="overview" && (
          <div className="fi">
            <div style={{ marginBottom:36, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Crimson Pro', serif", fontSize:15, fontStyle:"italic", color:C.tan, marginBottom:8 }}>@ourcosydays</div>
                <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:34, fontWeight:300, color:C.darkBrown }}>Partnerships</h1>
              </div>
              <Orbit size={78} style={{ opacity:.45 }}/>
            </div>

            {/* Brand colour legend */}
            {collabs.length > 0 && (
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
                {[...new Map(collabs.map(c=>[c.brand.trim().toLowerCase(), c.brand.trim()])).values()].map(brand => {
                  const bp = brandHash(brand);
                  return (
                    <div key={brand} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 12px", borderRadius:20, background:bp.bg, border:`1px solid ${bp.border}` }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:bp.dot }}/>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, color:bp.text }}>{brand}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {collabs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <p style={{ fontSize:15, color:C.tan, fontStyle:"italic", marginBottom:24 }}>No partnerships yet.</p>
                <button onClick={()=>setShowModal(true)} className="cb"
                  style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.amber})`, color:C.cream, padding:"12px 30px", borderRadius:20, fontFamily:"'Cormorant Garamond', serif", fontSize:12, letterSpacing:1.5, boxShadow:`0 4px 20px ${C.gold}45`, transition:"all .2s" }}>
                  + ADD PARTNERSHIP
                </button>
              </div>
            ) : (
              <OverviewGrid collabs={collabs} todayStr={todayStr} openEdit={openEdit} duplicateCollab={duplicateCollab} setConfirmDel={setConfirmDel} updateLinks={updateLinks} inp={inp}/>
            )}
          </div>
        )}

        {/* ════ CALENDAR ════ */}
        {view==="calendar" && (
          <div className="fi">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:3, color:C.tan, marginBottom:6 }}>CONTENT SCHEDULE</div>
                <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:30, fontWeight:300, color:C.darkBrown }}>
                  {MONTHS[calMonth]} <span style={{ color:C.amber }}>{calYear}</span>
                </h1>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ display:"flex", gap:12, marginRight:8 }}>
                  {Object.entries(DELIVERABLE_CONFIG).map(([type, cfg]) => (
                    <div key={type} style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.5, color:C.tan }}>
                      <span style={{ color:cfg.dot }}>{cfg.symbol}</span>
                      {type}
                    </div>
                  ))}
                </div>
                {[-1,1].map(d=>(
                  <button key={d} onClick={()=>adjMonth(d)}
                    style={{ width:36, height:36, borderRadius:12, background:C.sand, border:`1px solid ${C.beige}`, fontSize:16, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {d===-1?"‹":"›"}
                  </button>
                ))}
                {(calMonth!==today.getMonth()||calYear!==today.getFullYear()) && (
                  <button onClick={()=>{ setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); }} className="cb"
                    style={{ padding:"6px 14px", borderRadius:12, background:C.sand, border:`1px solid ${C.gold}`, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:.5, color:C.amber, transition:"all .2s" }}>
                    Today
                  </button>
                )}
              </div>
            </div>

            {/* Brand colour legend on calendar */}
            {collabs.length > 0 && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16, alignItems:"center" }}>
                {[...new Map(collabs.map(c=>[c.brand.trim().toLowerCase(), c.brand.trim()])).values()].map(brand => {
                  const bp = brandHash(brand);
                  return (
                    <div key={brand} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, background:bp.bg, border:`1px solid ${bp.border}` }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:bp.dot }}/>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.5, color:bp.text }}>{brand}</span>
                    </div>
                  );
                })}
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.5, color:C.tan, marginLeft:"auto", fontStyle:"italic" }}>✦ drag chips to reschedule</span>
              </div>
            )}

            {/* ── Mobile list view ── */}
            {isMobile && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {Array.from({length:daysInMonth}).map((_,i) => {
                  const day = i+1;
                  const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const isToday = dateStr===todayStr;
                  const isOff = offDays.includes(dateStr);
                  const isSel = selectedDay===dateStr;
                  const items = dayItems(dateStr);
                  const groups = {};
                  items.forEach(item => {
                    const key = item.brand+"||"+item.type;
                    if (!groups[key]) groups[key] = { brand:item.brand, type:item.type, count:0, collabId:item.collabId, itemId:item.id, isEventChip:item.isEventChip||false };
                    groups[key].count++;
                  });
                  const chips = Object.values(groups);
                  const dayLabel = new Date(dateStr+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",day:"numeric"});
                  return (
                    <div key={day} onClick={()=>{ setSelectedDay(isSel?null:dateStr); setPlacing(false); }}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:14, background:isSel?C.sand:isToday?`${C.goldLight}18`:isOff?`${C.beige}30`:chips.length>0?C.cream:"transparent", border:`1px solid ${isSel?C.gold:chips.length>0?C.beige:"transparent"}`, cursor:"pointer", transition:"background .15s" }}>
                      <div style={{ minWidth:52, flexShrink:0 }}>
                        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:isToday?12:11, fontWeight:isToday?600:400, color:isToday?C.amber:chips.length>0?C.darkBrown:C.tan,
                          ...(isToday?{ background:C.gold, color:C.cream, borderRadius:20, padding:"2px 8px" }:{}) }}>
                          {dayLabel}
                        </span>
                      </div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap", flex:1 }}>
                        {chips.map(g => { const bp = brandHash(g.brand); return (
                          <div key={g.brand+g.type} style={{ fontSize:10, fontFamily:"'Cormorant Garamond', serif", background:bp.bg, borderRadius:6, padding:"2px 8px", color:bp.text, border:`1px solid ${bp.border}`, whiteSpace:"nowrap" }}>
                            {g.isEventChip ? "◆" : DELIVERABLE_CONFIG[g.type]?.symbol} {g.brand}{g.count>1?` ×${g.count}`:""}
                          </div>
                        );})}
                        {isOff && chips.length===0 && <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, fontStyle:"italic" }}>off day</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Desktop grid view ── */}
            {!isMobile && <div style={{ background:`${C.cream}F0`, borderRadius:22, border:`1px solid ${C.beige}`, boxShadow:"0 8px 40px rgba(0,0,0,.06)", overflowX:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:C.sand, borderBottom:`1px solid ${C.beige}` }}>
                {DAYS_SHORT.map(d=>(
                  <div key={d} style={{ padding:"12px 8px", textAlign:"center", fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.amber }}>{d}</div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
                {Array.from({length:firstDay}).map((_,i)=>(
                  <div key={`e${i}`} style={{ minHeight:isMobile?56:88, borderRight:`1px solid ${C.beige}`, borderBottom:`1px solid ${C.beige}`, background:`${C.sand}28` }}/>
                ))}
                {Array.from({length:daysInMonth}).map((_,i)=>{
                  const day     = i+1;
                  const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const isToday   = dateStr===todayStr;
                  const isBlk     = blackoutDates.includes(dateStr);
                  const isOff     = offDays.includes(dateStr);
                  const isSel     = selectedDay===dateStr;
                  const items     = dayItems(dateStr);
                  return (
                    <div key={day} className="cc"
                      onClick={()=>{ setSelectedDay(isSel?null:dateStr); setPlacing(false); }}
                      onDragOver={e=>{ e.preventDefault(); setDragOver(dateStr); }}
                      onDragLeave={()=>setDragOver(null)}
                      onDrop={e=>{ e.preventDefault(); setDragOver(null); if(dragItem){ moveItemToDate(dragItem.collabId, dragItem.itemId, dateStr); setDragItem(null); } }}
                      style={{ minHeight:isMobile?56:88, padding:isMobile?"4px 3px":"8px 6px", borderRight:`1px solid ${C.beige}`, borderBottom:`1px solid ${C.beige}`, background:dragOver===dateStr?`${C.goldLight}30`:isBlk?`${C.beige}70`:isSel?C.sand:isToday?`${C.goldLight}18`:isOff?`${C.beige}30`:"transparent", cursor:"pointer", transition:"background .15s", outline: dragOver===dateStr?`2px dashed ${C.gold}`:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, fontWeight:isToday?600:400, color:isToday?C.cream:isBlk?C.tan:C.brown,
                          ...(isToday?{background:C.gold,borderRadius:"50%",width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9}:{}) }}>
                          {day}
                        </span>
                        {isBlk&&<span style={{ fontSize:9, color:C.tan }}>—</span>}
                        {!isBlk&&isOff&&<span style={{ fontSize:9, color:C.tan, opacity:.6 }}>✦</span>}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                        {(()=>{
                          // group by brand+type, show one chip each
                          const groups = {};
                          items.forEach(item => {
                            const key = item.brand + "||" + item.type;
                            if (!groups[key]) groups[key] = { brand:item.brand, type:item.type, count:0, collabId:item.collabId, itemId:item.id, isEventChip:item.isEventChip||false };
                            groups[key].count++;
                          });
                          const chips = Object.values(groups);
                          return (<>
                            {chips.slice(0,3).map(g => { const bp = brandHash(g.brand); return (
                              <div key={g.brand+g.type}
                                draggable
                                onDragStart={e=>{ e.stopPropagation(); setDragItem({ collabId:g.collabId, itemId:g.itemId, brand:g.brand, type:g.type }); e.dataTransfer.effectAllowed="move"; }}
                                onDragEnd={()=>{ setDragItem(null); setDragOver(null); }}
                                style={{ fontSize:isMobile?8:9, fontFamily:"'Cormorant Garamond', serif", letterSpacing:.2, background:bp.bg, borderRadius:4, padding:isMobile?"1px 3px":"2px 5px", color:bp.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", border:`1px solid ${bp.border}`, cursor:"grab", opacity: dragItem?.itemId===g.itemId ? 0.45 : 1, transition:"opacity .15s" }}>
                                {g.isEventChip ? "◆" : DELIVERABLE_CONFIG[g.type]?.symbol} {g.brand}{g.count>1?` ×${g.count}`:""}
                              </div>
                            );})}
                            {chips.length>3&&<div style={{ fontSize:9, color:C.tan, fontFamily:"'Cormorant Garamond', serif" }}>+{chips.length-3}</div>}
                          </>);
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>}

            {/* Day detail */}
            {selectedDay && (()=>{
              const items = dayItems(selectedDay);
              return (
                <div className="fi" style={{ marginTop:20, background:`linear-gradient(135deg,${C.cream},${C.fog})`, borderRadius:22, padding:26, border:`1px solid ${C.beige}`, boxShadow:"0 8px 32px rgba(0,0,0,.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                    <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:17, fontWeight:400, color:C.darkBrown, letterSpacing:.4 }}>
                      {new Date(selectedDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                    </h3>
                    <button onClick={()=>toggleOffDay(selectedDay)} className="cb"
                      style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:1, padding:"6px 16px", borderRadius:14, background:offDays.includes(selectedDay)?`${C.tan}33`:C.sand, color:offDays.includes(selectedDay)?C.brown:C.amber, border:`1px solid ${offDays.includes(selectedDay)?C.tan:C.beige}`, transition:"all .2s" }}>
                      {offDays.includes(selectedDay)?"✦ OFF DAY":"OFF DAY"}
                    </button>
                  </div>
                  {/* Scheduled items — grouped by brand+type */}
                  {items.length > 0 && (()=>{
                    const groups = {};
                    items.forEach(item => {
                      const key = item.collabId + "||" + item.type;
                      if (!groups[key]) groups[key] = { collabId:item.collabId, brand:item.brand, type:item.type, items:[] };
                      groups[key].items.push(item);
                    });
                    return (
                      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                        {Object.values(groups).map(g => {
                          const bp = brandHash(g.brand);
                          const count = g.items.length;
                          const allSameStatus = g.items.every(i=>i.status===g.items[0].status);
                          const groupStatus = allSameStatus ? g.items[0].status : "Mixed";
                          return (
                            <div key={g.collabId+g.type} style={{ background:bp.bg, borderRadius:14, border:`1px solid ${bp.border}`, position:"relative" }}>
                              {/* Row top: brand info + status + notes toggle */}
                              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px" }}>
                                <div style={{ width:8, height:8, borderRadius:2, background:bp.dot, flexShrink:0 }}/>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div>
                                    <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:13, color:C.darkBrown }}>{g.brand}</span>
                                    <span style={{ color:C.tan, fontSize:13 }}> · {DELIVERABLE_CONFIG[g.type]?.label}</span>
                                    {count>1 && <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:bp.text, background:bp.border+"55", borderRadius:10, padding:"1px 7px", marginLeft:6 }}>×{count}</span>}
                                  </div>
                                  {g.items[0].note && <div style={{ fontSize:12, color:bp.text, fontStyle:"italic", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.items[0].note}</div>}
                                </div>
                                {/* Status dropdown */}
                                {(()=>{
                                  const sc = STATUS_CONFIG[groupStatus==="Mixed"?"Scheduled":groupStatus];
                                  const opts = [
                                    ...(groupStatus==="Mixed"?[{value:"",label:"— Mixed —"}]:[]),
                                    ...Object.keys(STATUS_CONFIG).map(s=>({value:s, label:count>1?s+" all":s}))
                                  ];
                                  return <Dropdown value={groupStatus==="Mixed"?"":groupStatus} onChange={v=>{ if(!v) return; count>1?markGroupStatus(g.collabId,g.type,selectedDay,v):updStatus(g.collabId,g.items[0].id,v); }} options={opts} bg={sc?.bg||"#F2EDE3"} textColor={sc?.text||C.amber} borderColor={sc?.border||C.beige} small/>;
                                })()}
                                {/* Notes toggle */}
                                <button onClick={()=>setExpandedGroup(p => p===(g.collabId+g.type) ? null : (g.collabId+g.type))} className="cb"
                                  style={{ width:26, height:26, borderRadius:7, background:expandedGroup===(g.collabId+g.type)?C.gold:C.cream, border:`1px solid ${C.beige}`, color:expandedGroup===(g.collabId+g.type)?C.cream:C.amber, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                                  ✎
                                </button>
                              </div>
                              {/* Row bottom: reschedule — individual rows when stacked */}
                              {count > 1 ? (
                                <div style={{ borderTop:`1px solid ${bp.border}55`, background:bp.bg+"99" }}>
                                  <div style={{ padding:"6px 16px 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan }}>MOVE INDIVIDUAL</div>
                                  {g.items.map((item, idx) => (
                                    <div key={item.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 16px 6px" }}>
                                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, color:bp.text, flexShrink:0, minWidth:40 }}>#{idx+1}</span>
                                      <div style={{ flex:1 }}>
                                        <DatePicker value={item.date} onChange={v => moveItemToDate(g.collabId, item.id, v)} small/>
                                      </div>
                                    </div>
                                  ))}
                                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 16px 8px", borderTop:`1px dashed ${bp.border}` }}>
                                    <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1, color:C.tan, flexShrink:0 }}>MOVE ALL</span>
                                    <div style={{ flex:1 }}>
                                      <DatePicker value={g.items[0].date} onChange={v => moveGroupToDate(g.collabId, g.type, g.items[0].date, v)} small/>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderTop:`1px solid ${bp.border}55`, background:bp.bg+"99" }}>
                                  <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, flexShrink:0 }}>MOVE TO</span>
                                  <div style={{ flex:1 }}>
                                    <DatePicker value={g.items[0].date} onChange={v => moveItemToDate(g.collabId, g.items[0].id, v)} small/>
                                  </div>
                                </div>
                              )}
                              {/* Notes dropdown */}
                              {expandedGroup===(g.collabId+g.type) && (
                                <div className="fi" style={{ padding:"12px 16px", borderTop:`1px solid ${bp.border}`, background:bp.bg }}>
                                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:bp.text, marginBottom:6 }}>NOTES</div>
                                  <textarea
                                    value={count>1 ? (g.items[0].note||"") : (g.items[0].note||"")}
                                    onChange={e => count>1 ? updateGroupNote(g.collabId,g.type,selectedDay,e.target.value) : updateItemNote(g.collabId,g.items[0].id,e.target.value)}
                                    placeholder="e.g. Include discount code, film in natural light, tag @brand…"
                                    rows={2}
                                    style={{ width:"100%", padding:"8px 12px", border:`1px solid ${bp.border}`, borderRadius:10, fontSize:13, background:C.cream, color:C.ink, outline:"none", resize:"vertical", fontFamily:"'Crimson Pro', serif", lineHeight:1.6 }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Manual placement */}
                  {collabs.length > 0 && !placing && (
                    <button onClick={()=>{ setPlacing(true); setPlaceForm({ collabId: collabs[0].id, type:"Reel" }); }} className="cb"
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:14, background:C.sand, border:`1px dashed ${C.tan}`, color:C.amber, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, transition:"all .2s", width:"100%" }}>
                      <Sparkle size={12}/> ASSIGN CONTENT TO THIS DAY
                    </button>
                  )}

                  {placing && (
                    <div className="fi" style={{ background:C.sand, borderRadius:16, padding:"16px 18px", border:`1px solid ${C.beige}`, display:"flex", flexDirection:"column", gap:12 }}>
                      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:2, color:C.amber }}>ASSIGN CONTENT</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5 }}>PARTNER</div>
                          <Dropdown value={placeForm.collabId} onChange={v=>setPlaceForm(p=>({...p,collabId:v}))} options={collabs.map(c=>({value:c.id,label:c.brand}))} bg={C.cream} textColor={C.darkBrown} borderColor={C.beige}/>
                        </div>
                        <div>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5 }}>TYPE</div>
                          <Dropdown value={placeForm.type} onChange={v=>setPlaceForm(p=>({...p,type:v}))} options={Object.keys(DELIVERABLE_CONFIG).map(t=>({value:t,label:DELIVERABLE_CONFIG[t].label}))} bg={C.cream} textColor={C.darkBrown} borderColor={C.beige}/>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={()=>setPlacing(false)} className="cb"
                          style={{ flex:1, padding:"9px", borderRadius:12, fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, background:C.fog, color:C.tan, border:`1px solid ${C.beige}`, transition:"all .2s" }}>
                          CANCEL
                        </button>
                        <button onClick={()=>placeItem(selectedDay, placeForm.collabId, placeForm.type)} className="cb"
                          style={{ flex:2, padding:"9px", borderRadius:12, fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, background:`linear-gradient(135deg,${C.gold},${C.amber})`, color:C.cream, boxShadow:`0 3px 12px ${C.gold}45`, transition:"all .2s" }}>
                          ✦ PLACE HERE
                        </button>
                      </div>
                    </div>
                  )}

                  {items.length===0 && !placing && collabs.length===0 && (
                    <p style={{ color:C.tan, fontSize:14, fontStyle:"italic" }}>No content scheduled for this day.</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ════ PAYMENTS ════ */}
        {view==="payments" && (()=>{
          function adjPayMonth(d) {
            if (d===-1) { payMonth===0 ? (setPayMonth(11), setPayYear(y=>y-1)) : setPayMonth(m=>m-1); }
            else        { payMonth===11 ? (setPayMonth(0), setPayYear(y=>y+1)) : setPayMonth(m=>m+1); }
          }
          // Filter collabs whose date range overlaps the selected month
          const monthStart = new Date(payYear, payMonth, 1);
          const monthEnd   = new Date(payYear, payMonth+1, 0);
          const filtered   = collabs.filter(c => {
            const s = new Date(c.startDate+"T12:00:00");
            const e = new Date(c.endDate+"T12:00:00");
            return s <= monthEnd && e >= monthStart;
          });
          const totalFee      = filtered.filter(c=>!c.gifted).reduce((s,c)=>s+(parseFloat(c.fee)||0),0);
          const totalPaid     = filtered.filter(c=>!c.gifted&&c.paymentStatus==="Paid").reduce((s,c)=>s+(parseFloat(c.fee)||0),0);
          const totalInvoiced = filtered.filter(c=>!c.gifted&&c.paymentStatus==="Invoiced").reduce((s,c)=>s+(parseFloat(c.fee)||0),0);
          const totalUnpaid   = filtered.filter(c=>!c.gifted&&c.paymentStatus==="Unpaid").reduce((s,c)=>s+(parseFloat(c.fee)||0),0);
          const fmt = (n) => n > 0 ? `$${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "—";
          const isCurrentMonth = payMonth===today.getMonth() && payYear===today.getFullYear();
          return (
            <div className="fi">
              <div style={{ marginBottom:28, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:3, color:C.tan, marginBottom:6 }}>FINANCIAL OVERVIEW</div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:30, fontWeight:300, color:C.darkBrown }}>Payments</h1>
                </div>
                {/* Month navigator */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={()=>adjPayMonth(-1)} style={{ width:34, height:34, borderRadius:10, background:C.sand, border:`1px solid ${C.beige}`, fontSize:16, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
                  <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:15, color:C.darkBrown, minWidth:130, textAlign:"center" }}>{MONTHS[payMonth]} {payYear}</span>
                  <button onClick={()=>adjPayMonth(1)}  style={{ width:34, height:34, borderRadius:10, background:C.sand, border:`1px solid ${C.beige}`, fontSize:16, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
                  {!isCurrentMonth && (
                    <button onClick={()=>{ setPayMonth(today.getMonth()); setPayYear(today.getFullYear()); }} className="cb"
                      style={{ padding:"6px 14px", borderRadius:10, background:C.sand, border:`1px solid ${C.gold}`, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:.5, color:C.amber, transition:"all .2s" }}>
                      Today
                    </button>
                  )}
                </div>
              </div>

              {/* Summary cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14, marginBottom:36 }}>
                {[
                  { label:"TOTAL CONTRACTED", value: fmt(totalFee), bg: C.sand, border: C.beige, text: C.darkBrown, dot: C.gold },
                  { label:"PAID", value: fmt(totalPaid), ...PAYMENT_STATUS_CONFIG.Paid },
                  { label:"INVOICED", value: fmt(totalInvoiced), ...PAYMENT_STATUS_CONFIG.Invoiced },
                  { label:"OUTSTANDING", value: fmt(totalUnpaid), ...PAYMENT_STATUS_CONFIG.Unpaid },
                ].map(card => (
                  <div key={card.label} style={{ background:card.bg, border:`1px solid ${card.border}`, borderRadius:20, padding:"22px 24px", boxShadow:"0 4px 16px rgba(0,0,0,.04)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:card.dot }}/>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:card.text, opacity:.7 }}>{card.label}</span>
                    </div>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:400, color:card.text, letterSpacing:.3 }}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Per-partnership list */}
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:C.tan, fontStyle:"italic", fontSize:15 }}>No partnerships active in {MONTHS[payMonth]} {payYear}.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:14, padding:"8px 20px", fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.tan }}>
                    <span>PARTNERSHIP</span><span style={{ textAlign:"right", minWidth:110 }}>AGREED FEE</span><span style={{ minWidth:100, textAlign:"right" }}>DUE DATE</span><span style={{ minWidth:120, textAlign:"right" }}>STATUS</span>
                  </div>
                  {filtered.map((c,ci) => {
                    const bp = brandHash(c.brand);
                    const ps = PAYMENT_STATUS_CONFIG[c.paymentStatus||"Unpaid"];
                    const total = c.items?.length||0;
                    const posted = c.items?.filter(i=>i.status==="Posted").length||0;
                    const isOverdue = !c.gifted && c.paymentStatus!=="Paid" && c.paymentDue && new Date(c.paymentDue+"T12:00:00") < new Date(todayStr+"T12:00:00");
                    return (
                      <div key={c.id} className="fi gh" style={{ background:`linear-gradient(148deg,${isOverdue?"#FDF0EE":bp.bg+"99"},${C.fog})`, border:`1px solid ${isOverdue?"#F0C4B8":bp.border}`, borderLeft:`4px solid ${isOverdue?"#E08070":bp.dot}`, borderRadius:18, padding:"18px 20px", display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:14, alignItems:"center", animationDelay:`${ci*.05}s`, transition:"all .25s", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:15, color:C.darkBrown, fontWeight:400 }}>{c.brand}</div>
                            {isOverdue && <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1, color:"#C05040", background:"#FDE8E4", border:"1px solid #F0C0B0", borderRadius:8, padding:"2px 8px" }}>OVERDUE</span>}
                          </div>
                          <div style={{ fontSize:12, color:C.tan, fontStyle:"italic", marginBottom:6 }}>
                            {new Date(c.startDate+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} → {new Date(c.endDate+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                          </div>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:.5, color:bp.text, opacity:.7 }}>{posted}/{total} POSTED</div>
                        </div>
                        {/* Fee input or gifted badge */}
                        {c.gifted ? (
                          <div style={{ textAlign:"right", minWidth:110 }}>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5 }}>FEE</div>
                            <div style={{ padding:"7px 12px", borderRadius:10, background:C.sand, border:`1px solid ${C.gold}`, fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, color:C.amber, display:"inline-block" }}>✦ Gifted</div>
                          </div>
                        ) : (
                          <div style={{ textAlign:"right", minWidth:110 }}>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5 }}>FEE (SGD)</div>
                            <input type="number" min="0" step="any" value={c.fee||""} onChange={e=>updatePayment(c.id,"fee",e.target.value)} placeholder="0.00"
                              style={{ width:110, padding:"7px 10px", border:`1px solid ${bp.border}`, borderRadius:10, background:C.cream, color:C.darkBrown, fontFamily:"'Cormorant Garamond', serif", fontSize:13, textAlign:"right", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}/>
                          </div>
                        )}
                        {/* Due date */}
                        <div style={{ minWidth:100, textAlign:"right" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5, textAlign:"right" }}>DUE</div>
                          {c.gifted ? (
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, fontStyle:"italic" }}>N/A</div>
                          ) : c.paymentDue ? (
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color: isOverdue ? "#C05040" : C.darkBrown, fontWeight: isOverdue ? 500 : 400 }}>
                              {new Date(c.paymentDue+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                            </div>
                          ) : (
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, fontStyle:"italic" }}>—</div>
                          )}
                        </div>
                        {/* Payment status */}
                        {c.gifted ? (
                          <div style={{ minWidth:120, textAlign:"right" }}>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5, textAlign:"right" }}>PAYMENT</div>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, color:C.tan, fontStyle:"italic" }}>N/A</div>
                          </div>
                        ) : (
                          <div style={{ minWidth:120, textAlign:"right" }}>
                            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, marginBottom:5, textAlign:"right" }}>PAYMENT</div>
                            <Dropdown value={c.paymentStatus||"Unpaid"} onChange={v=>updatePayment(c.id,"paymentStatus",v)} options={Object.keys(PAYMENT_STATUS_CONFIG)} bg={ps.bg} textColor={ps.text} borderColor={ps.border}/>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ════ OFF DAYS ════ */}
        {view==="blackout" && (
          <div className="fi">
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:3, color:C.tan, marginBottom:6 }}>YOUR SCHEDULE</div>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:30, fontWeight:300, color:C.darkBrown, marginBottom:8 }}>Off Days</h1>
                  <p style={{ fontSize:15, color:C.tan, fontStyle:"italic" }}>Visual reminder only — AI schedules freely on these days.</p>
                </div>
                {/* Google Calendar Connect Button */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  {!gcalToken ? (
                    <button onClick={connectGoogleCalendar} disabled={gcalConnecting} className="cb"
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:16, background:C.sand, border:`1px solid ${C.beige}`, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:.5, color:C.brown, transition:"all .2s" }}>
                      <span style={{ fontSize:14 }}>📅</span>
                      {gcalConnecting ? "Connecting…" : "Connect Google Calendar"}
                    </button>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background:"#DDE8DC", border:"1px solid #88B890" }}>
                        <span style={{ fontSize:12 }}>✓</span>
                        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:"#2A5A30" }}>Google Calendar connected</span>
                      </div>
                      {gcalCalendars.length > 0 && (
                        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                          <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1.5, color:C.tan, textAlign:"right" }}>SYNCING TO</span>
                          <select value={gcalCalendarId} onChange={e=>{ setGcalCalendarId(e.target.value); localStorage.setItem('ocd-gcal-calid', e.target.value); }}
                            style={{ padding:"6px 12px", borderRadius:10, border:`1px solid ${C.beige}`, background:C.parchment, fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.brown, outline:"none" }}>
                            {gcalCalendars.map(cal=>(
                              <option key={cal.id} value={cal.id}>{cal.summary}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <button onClick={()=>{ setGcalToken(null); setGcalCalendars([]); localStorage.removeItem('ocd-gcal-token'); localStorage.removeItem('ocd-gcal-calid'); }}
                        style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, letterSpacing:.5, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ background:`${C.cream}F0`, borderRadius:22, overflow:"hidden", border:`1px solid ${C.beige}`, boxShadow:"0 4px 24px rgba(0,0,0,.05)", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${C.beige}`, background:C.sand }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:14, letterSpacing:1, color:C.darkBrown }}>{MONTHS[calMonth]} {calYear}</span>
                <div style={{ display:"flex", gap:8 }}>
                  {[-1,1].map(d=>(
                    <button key={d} onClick={()=>adjMonth(d)}
                      style={{ width:32, height:32, borderRadius:10, background:C.cream, border:`1px solid ${C.beige}`, color:C.amber, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {d===-1?"‹":"›"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:`1px solid ${C.beige}`, background:`${C.sand}60` }}>
                {DAYS_SHORT.map(d=><div key={d} style={{ padding:"10px", textAlign:"center", fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.amber }}>{d}</div>)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, padding:12 }}>
                {Array.from({length:firstDay}).map((_,i)=><div key={i}/>)}
                {Array.from({length:daysInMonth}).map((_,i)=>{
                  const day = i+1;
                  const ds  = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const isOff = offDays.includes(ds);
                  return (
                    <button key={day} onClick={()=>toggleOffDay(ds)} className="cb"
                      style={{ aspectRatio:"1", borderRadius:10, fontFamily:"'Cormorant Garamond', serif", fontSize:11, fontWeight:isOff?600:400, background:isOff?`${C.tan}28`:C.fog, color:C.brown, border:`1px solid ${isOff?C.tan:C.beige}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .18s" }}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            {offDays.length>0 ? (
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.tan, marginBottom:12 }}>{offDays.length} OFF DAY{offDays.length>1?"S":""}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[...offDays].sort().map(d=>(
                    <span key={d} style={{ background:C.sand, border:`1px solid ${C.beige}`, borderRadius:20, padding:"4px 12px", fontSize:11, fontFamily:"'Cormorant Garamond', serif", letterSpacing:.4, color:C.amber, display:"flex", alignItems:"center", gap:8 }}>
                      ✦ {new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                      <button onClick={()=>toggleOffDay(d)} style={{ color:C.tan, fontSize:14, lineHeight:1 }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:14, color:C.tan, fontStyle:"italic" }}>No off days marked yet. Tap any day to flag it.</p>
            )}
          </div>
        )}
      </main>

      {/* ════ EDIT PARTNER MODAL ════ */}
      {editingCollab && editForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(42,31,14,.48)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:150, padding:20, backdropFilter:"blur(5px)" }}>
          <div className="fi" style={{ background:`linear-gradient(148deg,${C.cream},${C.fog})`, borderRadius:26, padding:38, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.22)", border:`1px solid ${C.beige}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:3, color:C.tan, marginBottom:6 }}>EDITING</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:24, fontWeight:300, color:C.darkBrown }}>{editingCollab.brand}</h2>
              </div>
              <button onClick={()=>{ setEditingCollab(null); setEditForm(null); }} style={{ fontSize:22, color:C.tan, width:36, height:36, borderRadius:10, background:C.sand, border:`1px solid ${C.beige}`, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div>
                <label style={lbl}>BRAND NAME</label>
                <input value={editForm.brand} onChange={e=>setEditForm(p=>({...p,brand:e.target.value}))} style={inp}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {["startDate","endDate"].map(f=>(
                  <div key={f}>
                    <label style={lbl}>{f==="startDate"?"START DATE":"END DATE"}</label>
                    <DatePicker value={editForm[f]} onChange={v=>setEditForm(p=>({...p,[f]:v}))} placeholder={f==="startDate"?"Pick start date…":"Pick end date…"} direction="down"/>
                  </div>
                ))}
                <div>
                  <label style={lbl}>CONTENT DEADLINE — OPTIONAL</label>
                  <DatePicker value={editForm.deadline||""} onChange={v=>setEditForm(p=>({...p,deadline:v}))} placeholder="When must all content be delivered?" direction="down"/>
                </div>
              </div>
              <div>
                <label style={lbl}>DELIVERABLES</label>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {editForm.deliverables.map((d,idx)=>(
                    <div key={d.type} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", background:DELIVERABLE_CONFIG[d.type].color, borderRadius:16, border:`1px solid ${C.beige}` }}>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.amber, letterSpacing:.4 }}>{DELIVERABLE_CONFIG[d.type].label}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        {[-1,1].map(delta=>(
                          <button key={delta} onClick={()=>setEditForm(p=>({...p,deliverables:p.deliverables.map((x,i)=>i===idx?{...x,count:Math.max(0,x.count+delta)}:x)}))}
                            style={{ width:30, height:30, borderRadius:8, background:C.cream, border:`1px solid ${C.beige}`, fontSize:18, color:C.amber, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {delta===-1?"−":"+"}
                          </button>
                        ))}
                        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:600, color:C.darkBrown, minWidth:20, textAlign:"center", order:-1 }}>{d.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>BRIEF / SCRIPT</label>
                <textarea value={editForm.brief||""} onChange={e=>setEditForm(p=>({...p,brief:e.target.value}))} placeholder="Paste the brand's brief, key messages, dos & don'ts…" rows={3} style={{ ...inp, resize:"vertical" }}/>
              </div>
              <div>
                <label style={lbl}>NOTES</label>
                <textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={2} style={{ ...inp, resize:"vertical" }}/>
              </div>
              <div>
                <label style={lbl}>AGREED FEE (SGD)</label>
                <div style={{ display:"flex", gap:8, marginBottom: editForm.gifted ? 0 : 8 }}>
                  {!editForm.gifted && <input type="number" min="0" step="any" value={editForm.fee||""} onChange={e=>setEditForm(p=>({...p,fee:e.target.value}))} placeholder="e.g. 500" style={{...inp, flex:1}}/>}
                  <button onClick={()=>setEditForm(p=>({...p,gifted:!p.gifted,fee:p.gifted?p.fee:""}))} className="cb"
                    style={{ padding:"7px 14px", borderRadius:10, fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1, background:editForm.gifted?C.sand:C.cream, color:editForm.gifted?C.amber:C.tan, border:`1.5px solid ${editForm.gifted?C.gold:C.beige}`, transition:"all .2s", whiteSpace:"nowrap" }}>
                    {editForm.gifted ? "✦ PRODUCT EXCHANGE" : "PRODUCT EXCHANGE"}
                  </button>
                </div>
                {editForm.gifted && <div style={{ fontSize:12, color:C.tan, fontStyle:"italic", marginTop:6 }}>Marked as product exchange — no payment will be tracked.</div>}
              </div>
              <div>
                <label style={lbl}>PAYMENT STATUS</label>
                <div style={{ display:"flex", gap:8 }}>
                  {Object.keys(PAYMENT_STATUS_CONFIG).map(s => {
                    const ps = PAYMENT_STATUS_CONFIG[s];
                    const active = (editForm.paymentStatus||"Unpaid") === s;
                    return (
                      <button key={s} onClick={()=>setEditForm(p=>({...p,paymentStatus:s}))} className="cb"
                        style={{ flex:1, padding:"9px 6px", borderRadius:12, fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:.5, background:active?ps.bg:C.sand, color:active?ps.text:C.tan, border:`1.5px solid ${active?ps.border:C.beige}`, transition:"all .2s" }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              {!editForm.gifted && (
                <div>
                  <label style={lbl}>PAYMENT DUE DATE</label>
                  <DatePicker value={editForm.paymentDue||""} onChange={v=>setEditForm(p=>({...p,paymentDue:v}))} placeholder="Pick due date…" direction="down"/>
                </div>
              )}
              <div>
                <label style={lbl}>LINKS</label>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[{key:"briefLink",label:"Brief",icon:"✦",ph:"https://drive.google.com/…"},{key:"driveLink",label:"Contract",icon:"◈",ph:"https://drive.google.com/…"}].map(({key,label,icon,ph})=>(
                    <div key={key} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.tan, minWidth:90, flexShrink:0 }}>{icon} {label}</span>
                      <input value={editForm.links?.[key]||""} onChange={e=>setEditForm(p=>({...p,links:{...(p.links||{}),[key]:e.target.value}}))} placeholder={ph} style={{...inp,flex:1,padding:"8px 12px",fontSize:12}}/>
                    </div>
                  ))}
                  <MoreLinksToggle links={editForm.links||{}} onChange={(key,val)=>setEditForm(p=>({...p,links:{...(p.links||{}),[key]:val}}))} inp={inp}/>
                </div>
              </div>
              <div style={{ padding:"11px 15px", background:C.sand, borderRadius:12, fontSize:13, color:C.tan, fontStyle:"italic", border:`1px solid ${C.beige}` }}>
                ✦ Schedule will be rebuilt and existing progress statuses preserved where possible.
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>{ setEditingCollab(null); setEditForm(null); }} className="cb"
                  style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, background:C.sand, color:C.brown, border:`1px solid ${C.beige}`, transition:"all .2s" }}>
                  CANCEL
                </button>
                <button onClick={saveEdit} className="cb"
                  style={{ flex:2, padding:"13px", borderRadius:14, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, background:`linear-gradient(135deg,${C.gold},${C.amber})`, color:C.cream, boxShadow:`0 4px 16px ${C.gold}45`, transition:"all .2s" }}>
                  SAVE CHANGES →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {confirmDel&&(()=>{
        const c = collabs.find(x=>x.id===confirmDel);
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(42,31,14,.48)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20, backdropFilter:"blur(5px)" }}>
            <div className="fi" style={{ background:`linear-gradient(148deg,${C.cream},${C.fog})`, borderRadius:26, padding:42, width:"100%", maxWidth:400, boxShadow:"0 32px 80px rgba(0,0,0,.22)", textAlign:"center", border:`1px solid ${C.beige}` }}>
              
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:3, color:C.tan, marginBottom:8 }}>CONFIRM REMOVAL</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:400, color:C.darkBrown, marginBottom:12 }}>Delete Partnership?</h3>
              <p style={{ fontSize:14, color:C.tan, lineHeight:1.75, marginBottom:30, fontStyle:"italic" }}>
                This will permanently remove <strong style={{ color:C.amber, fontStyle:"normal" }}>{c?.brand}</strong> and all {c?.items?.length||0} scheduled items. This cannot be undone.
              </p>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>setConfirmDel(null)} className="cb"
                  style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, background:C.sand, color:C.brown, border:`1px solid ${C.beige}`, transition:"all .2s" }}>
                  CANCEL
                </button>
                <button onClick={()=>{delCollab(confirmDel);setConfirmDel(null);}} className="cb"
                  style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:1, background:`linear-gradient(135deg,${C.amber},${C.brown})`, color:C.cream, boxShadow:`0 4px 16px ${C.amber}45`, transition:"all .2s" }}>
                  YES, REMOVE
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════ ADD PARTNER MODAL ════ */}
      {showModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(42,31,14,.48)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:100, padding:"40px 20px 20px", backdropFilter:"blur(5px)", overflowY:"auto" }}>
          <div style={{ background:`linear-gradient(148deg,${C.cream},${C.fog})`, borderRadius:26, width:"min(520px, calc(100vw - 40px))", maxHeight:"90vh", boxShadow:"0 32px 80px rgba(0,0,0,.22)", border:`1px solid ${C.beige}`, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
            {/* Header */}
            <div style={{ padding:"24px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:3, color:C.tan, marginBottom:7 }}>{formType==="event"?"NEW EVENT":"NEW PARTNERSHIP"}</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:300, color:C.darkBrown, letterSpacing:.4 }}>{formType==="event"?"Add Event":"Add Partnership"}</h2>
              </div>
              <button onClick={()=>setShowModal(false)} style={{ fontSize:22, color:C.tan, width:36, height:36, borderRadius:10, background:C.sand, border:`1px solid ${C.beige}`, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </div>
            {/* Scrollable body */}
            <div style={{ overflowY:"auto", padding:"0 20px 20px", flex:1, overflowX:"hidden" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

                {/* Type toggle */}
                <div style={{ display:"flex", gap:8 }}>
                  {[["partnership","◈ Partnership"],["event","✦ Event"]].map(([type,label])=>(
                    <button key={type} onClick={()=>setFormType(type)} className="cb"
                      style={{ flex:1,padding:"10px 8px",borderRadius:12,fontFamily:"'Cormorant Garamond', serif",fontSize:10,letterSpacing:1,background:formType===type?C.sand:C.cream,color:formType===type?C.amber:C.tan,border:`1.5px solid ${formType===type?C.gold:C.beige}`,transition:"all .2s" }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Brand */}
                <div>
                  <label style={lbl}>{formType==="event"?"BRAND / HOST NAME":"BRAND NAME"}</label>
                  <input value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))} placeholder={formType==="event"?"e.g. Loewe, Sephora…":"e.g. Aesop, Loewe…"} style={inp}/>
                </div>

                {/* Location — events only */}
                {formType==="event" && (
                  <div>
                    <label style={lbl}>LOCATION (OPTIONAL)</label>
                    <input value={form.location||""} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Raffles Hotel, Singapore" style={inp}/>
                  </div>
                )}

                {/* Time — events only */}
                {formType==="event" && (
                  <div>
                    <label style={lbl}>TIME (OPTIONAL)</label>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <input type="time" value={form.startTime||""} onChange={e=>setForm(p=>({...p,startTime:e.target.value}))}
                        style={{...inp, flex:1, padding:"10px 12px", color:form.startTime?C.ink:C.tan, colorScheme:"light"}}/>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.tan }}>to</span>
                      <input type="time" value={form.endTime||""} onChange={e=>setForm(p=>({...p,endTime:e.target.value}))}
                        style={{...inp, flex:1, padding:"10px 12px", color:form.endTime?C.ink:C.tan, colorScheme:"light"}}/>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div>
                    <label style={lbl}>START DATE</label>
                    <DatePicker value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v,endDate:p.singleDay?v:p.endDate}))} placeholder="Pick start date…" direction="down"/>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <button onClick={()=>setForm(p=>({...p,singleDay:!p.singleDay,endDate:!p.singleDay?p.startDate:p.endDate}))} className="cb"
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 12px", borderRadius:10, fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1, background:form.singleDay?C.sand:C.cream, color:form.singleDay?C.amber:C.tan, border:`1.5px solid ${form.singleDay?C.gold:C.beige}`, transition:"all .2s" }}>
                      <span style={{ width:13,height:13,borderRadius:3,border:`1.5px solid ${form.singleDay?C.gold:C.beige}`,background:form.singleDay?C.gold:"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.cream,flexShrink:0 }}>{form.singleDay?"✓":""}</span>
                      SAME DAY
                    </button>
                    <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, color:C.tan, fontStyle:"italic" }}>start & end on the same date</span>
                  </div>
                  {!form.singleDay && (
                    <div>
                      <label style={lbl}>END DATE</label>
                      <DatePicker value={form.endDate} onChange={v=>setForm(p=>({...p,endDate:v}))} placeholder="Pick end date…" direction="down"/>
                    </div>
                  )}
                  <div>
                    <label style={lbl}>CONTENT DEADLINE — OPTIONAL</label>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <div style={{ flex:1 }}>
                        <DatePicker value={form.deadline||""} onChange={v=>setForm(p=>({...p,deadline:v}))} placeholder="When must all content be delivered?" direction="down"/>
                      </div>
                      {form.deadline && (
                        <button onClick={()=>setForm(p=>({...p,deadline:""}))} style={{ width:30,height:30,borderRadius:8,background:C.sand,border:`1px solid ${C.beige}`,color:C.tan,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>×</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <label style={lbl}>DELIVERABLES</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {form.deliverables.map((d,idx)=>(
                      <div key={d.type} style={{ background:DELIVERABLE_CONFIG[d.type].color, borderRadius:16, border:`1px solid ${C.beige}`, overflow:"hidden" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px" }}>
                          <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.amber, letterSpacing:.4 }}>{DELIVERABLE_CONFIG[d.type].label}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:600, color:C.darkBrown, minWidth:20, textAlign:"center" }}>{d.count}</span>
                            {[-1,1].map(delta=>(
                              <button key={delta} onClick={()=>setForm(p=>({...p,deliverables:p.deliverables.map((x,i)=>i===idx?{...x,count:Math.max(0,x.count+delta)}:x)}))}
                                style={{ width:30,height:30,borderRadius:8,background:C.cream,border:`1px solid ${C.beige}`,fontSize:18,color:C.amber,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>
                                {delta===-1?"−":"+"}
                              </button>
                            ))}
                          </div>
                        </div>
                        {scheduleMode==="ai" && d.count>0 && (
                          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 18px 11px", borderTop:`1px solid ${C.beige}44` }}>
                            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:10, color:C.tan, letterSpacing:.5, flex:1 }}>per day</span>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <button onClick={()=>setForm(p=>({...p,deliverables:p.deliverables.map((x,i)=>i===idx?{...x,maxPerDay:Math.max(0,(x.maxPerDay||0)-1)}:x)}))}
                                style={{ width:24,height:24,borderRadius:6,background:C.cream,border:`1px solid ${C.beige}`,fontSize:14,color:C.amber,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:13, fontWeight:600, color:C.darkBrown, minWidth:24, textAlign:"center" }}>{d.maxPerDay>0?d.maxPerDay:"—"}</span>
                              <button onClick={()=>setForm(p=>({...p,deliverables:p.deliverables.map((x,i)=>i===idx?{...x,maxPerDay:Math.min(d.count,(x.maxPerDay||0)+1)}:x)}))}
                                style={{ width:24,height:24,borderRadius:6,background:C.cream,border:`1px solid ${C.beige}`,fontSize:14,color:C.amber,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee — partnerships only */}
                {formType==="partnership" && <div>
                  <label style={lbl}>AGREED FEE (SGD) — OPTIONAL</label>
                  <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <button onClick={()=>setForm(p=>({...p,gifted:!p.gifted,fee:"",feeBreakdown:{cash:"",storeCredit:"",voucher:""}}))} className="cb"
                      style={{ padding:"7px 14px", borderRadius:10, fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:1, background:form.gifted?C.sand:C.cream, color:form.gifted?C.amber:C.tan, border:`1.5px solid ${form.gifted?C.gold:C.beige}`, transition:"all .2s", whiteSpace:"nowrap" }}>
                      {form.gifted?"✦ PRODUCT EXCHANGE":"PRODUCT EXCHANGE"}
                    </button>
                  </div>
                  {form.gifted ? (
                    <div style={{ fontSize:12, color:C.tan, fontStyle:"italic" }}>Marked as product exchange — no payment will be tracked.</div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {[{key:"cash",label:"Cash (SGD)",ph:"e.g. 300"},{key:"storeCredit",label:"Store Credit (SGD)",ph:"e.g. 100"},{key:"voucher",label:"Vouchers (SGD)",ph:"e.g. 50"}].map(({key,label,ph})=>(
                        <div key={key} style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.tan, minWidth:130, flexShrink:0 }}>{label}</span>
                          <input type="number" min="0" step="any" value={form.feeBreakdown?.[key]||""} placeholder={ph}
                            onChange={e=>setForm(p=>{ const fb={...p.feeBreakdown,[key]:e.target.value}; const total=[fb.cash,fb.storeCredit,fb.voucher].filter(Boolean).reduce((s,v)=>s+parseFloat(v||0),0); return {...p,feeBreakdown:fb,fee:total>0?String(total):""}; })}
                            style={{...inp,flex:1,padding:"8px 12px",fontSize:13}}/>
                        </div>
                      ))}
                      {(()=>{ const fb=form.feeBreakdown||{}; const parts=[]; if(fb.cash&&parseFloat(fb.cash)>0) parts.push(`$${parseFloat(fb.cash).toLocaleString()} cash`); if(fb.storeCredit&&parseFloat(fb.storeCredit)>0) parts.push(`$${parseFloat(fb.storeCredit).toLocaleString()} store credit`); if(fb.voucher&&parseFloat(fb.voucher)>0) parts.push(`$${parseFloat(fb.voucher).toLocaleString()} vouchers`); const total=parts.length>0?[fb.cash,fb.storeCredit,fb.voucher].filter(Boolean).reduce((s,v)=>s+parseFloat(v||0),0):0; return parts.length>0?(<div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:C.sand,borderRadius:10,border:`1px solid ${C.beige}` }}><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:C.tan }}>{parts.join(" + ")}</span><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:12,color:C.amber,fontWeight:500 }}>= ${total.toLocaleString()}</span></div>):null; })()}
                    </div>
                  )}
                </div>}

                {/* Payment status — partnerships only */}
                {formType==="partnership" && <div>
                  <label style={lbl}>PAYMENT STATUS</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {Object.keys(PAYMENT_STATUS_CONFIG).map(s=>{
                      const ps=PAYMENT_STATUS_CONFIG[s]; const active=(form.paymentStatus||"Unpaid")===s;
                      return (<button key={s} onClick={()=>setForm(p=>({...p,paymentStatus:s}))} className="cb" style={{ flex:1,padding:"9px 6px",borderRadius:12,fontFamily:"'Cormorant Garamond', serif",fontSize:10,letterSpacing:.5,background:active?ps.bg:C.sand,color:active?ps.text:C.tan,border:`1.5px solid ${active?ps.border:C.beige}`,transition:"all .2s" }}>{s}</button>);
                    })}
                  </div>
                </div>}

                {/* Payment due — partnerships only */}
                {formType==="partnership" && !form.gifted && (
                  <div>
                    <label style={lbl}>PAYMENT DUE DATE — OPTIONAL</label>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <div style={{ flex:1 }}>
                        <DatePicker value={form.paymentDue} onChange={v=>setForm(p=>({...p,paymentDue:v}))} placeholder="Pick due date…" direction="down"/>
                      </div>
                      {form.paymentDue && (
                        <button onClick={()=>setForm(p=>({...p,paymentDue:""}))} style={{ width:30,height:30,borderRadius:8,background:C.sand,border:`1px solid ${C.beige}`,color:C.tan,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>×</button>
                      )}
                    </div>
                  </div>
                )}

                {/* Brief */}
                <div>
                  <label style={lbl}>BRIEF / SCRIPT</label>
                  <textarea value={form.brief} onChange={e=>setForm(p=>({...p,brief:e.target.value}))} placeholder="Paste the brand's brief, key messages, dos & don'ts…" rows={3} style={{...inp,resize:"vertical"}}/>
                </div>

                {/* Notes */}
                <div>
                  <label style={lbl}>NOTES (OPTIONAL)</label>
                  <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Anything else to remember…" rows={2} style={{...inp,resize:"vertical"}}/>
                </div>

                {/* Links */}
                <div>
                  <label style={lbl}>LINKS (OPTIONAL)</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[{key:"briefLink",label:"Brief",icon:"✦",ph:"https://drive.google.com/…"},{key:"driveLink",label:"Contract",icon:"◈",ph:"https://drive.google.com/…"}].map(({key,label,icon,ph})=>(
                      <div key={key} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:C.tan, minWidth:90, flexShrink:0 }}>{icon} {label}</span>
                        <input value={form.links?.[key]||""} onChange={e=>setForm(p=>({...p,links:{...(p.links||{}),[key]:e.target.value}}))} placeholder={ph} style={{...inp,flex:1,padding:"8px 12px",fontSize:12}}/>
                      </div>
                    ))}
                    <MoreLinksToggle links={form.links||{}} onChange={(key,val)=>setForm(p=>({...p,links:{...(p.links||{}),[key]:val}}))} inp={inp}/>
                  </div>
                </div>

                {/* Scheduling mode — only show if has deliverables or is partnership */}
                {(formType==="partnership" || form.deliverables.some(d=>d.count>0)) && <div>
                  <label style={lbl}>SCHEDULING MODE</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {[["manual","◈ Manual"],["ai","✦ AI Schedule"]].map(([mode,label])=>(
                      <button key={mode} onClick={()=>{ setScheduleMode(mode); setManualSchedule({}); }} className="cb"
                        style={{ flex:1,padding:"10px 8px",borderRadius:12,fontFamily:"'Cormorant Garamond', serif",fontSize:10,letterSpacing:1,background:scheduleMode===mode?C.sand:C.cream,color:scheduleMode===mode?C.amber:C.tan,border:`1.5px solid ${scheduleMode===mode?C.gold:C.beige}`,transition:"all .2s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>}

                {/* AI hint */}
                {scheduleMode==="ai" && (
                  <div style={{ padding:"12px 16px", background:C.sand, borderRadius:14, fontSize:13, color:C.tan, display:"flex", gap:10, alignItems:"center", border:`1px solid ${C.beige}` }}>
                    <Sparkle size={13} style={{ flexShrink:0 }}/>
                    <span style={{ fontStyle:"italic" }}>AI will spread your deliverables evenly across the period. Set a per day count above to batch them.</span>
                  </div>
                )}

                {/* Manual calendar picker */}
                {scheduleMode==="manual" && (()=>{
                  const activeDelivs = form.deliverables.filter(d=>d.count>0);
                  const endDate = form.singleDay ? form.startDate : form.endDate;
                  if (!form.startDate || !endDate) return (
                    <div style={{ padding:"12px 16px", background:C.sand, borderRadius:14, fontSize:13, color:C.tan, fontStyle:"italic", border:`1px solid ${C.beige}` }}>
                      Set a start and end date above first.
                    </div>
                  );
                  if (activeDelivs.length===0 && formType!=="event") return (
                    <div style={{ padding:"12px 16px", background:C.sand, borderRadius:14, fontSize:13, color:C.tan, fontStyle:"italic", border:`1px solid ${C.beige}` }}>
                      Add at least one deliverable above first.
                    </div>
                  );
                  if (activeDelivs.length===0 && formType==="event") return null;
                  const allDates = [];
                  const cur = new Date(form.startDate+"T12:00:00");
                  const end = new Date(endDate+"T12:00:00");
                  while(cur<=end){ allDates.push(cur.toISOString().split("T")[0]); cur.setDate(cur.getDate()+1); }
                  const monthGroups = {};
                  allDates.forEach(ds=>{ const [y,m]=ds.split("-"); const key=y+"-"+m; if(!monthGroups[key]) monthGroups[key]={year:parseInt(y),month:parseInt(m)-1,dates:[]}; monthGroups[key].dates.push(ds); });
                  const selectedDates = Object.keys(manualSchedule).sort();
                  const totalByType = {};
                  activeDelivs.forEach(d=>{ totalByType[d.type]=Object.values(manualSchedule).reduce((s,day)=>s+(day[d.type]||0),0); });
                  function toggleDate(ds){ setManualSchedule(p=>{ const next={...p}; if(next[ds]){ delete next[ds]; } else { const defaults={}; activeDelivs.forEach(d=>{ defaults[d.type]=1; }); next[ds]=defaults; } return next; }); }
                  function setDayCount(ds,type,delta){ setManualSchedule(p=>{ const day={...(p[ds]||{})}; day[type]=Math.max(0,(day[type]||0)+delta); return {...p,[ds]:day}; }); }
                  return (
                    <div style={{ display:"flex", flexDirection:"column", gap:14, contain:"none" }}>
                      {/* Per-type progress pills */}
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {activeDelivs.map(d=>{ const dc=DELIVERABLE_CONFIG[d.type]; const assigned=totalByType[d.type]||0; const ok=assigned===d.count; return (<div key={d.type} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:dc.color,border:`1px solid ${ok?C.gold:C.beige}` }}><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:C.amber }}>{dc.symbol}</span><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:C.brown }}>{d.type}</span><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:ok?C.amber:C.tan }}>{assigned}/{d.count}</span>{ok&&<span style={{ fontSize:9,color:C.amber }}>✦</span>}</div>); })}
                      </div>
                      {/* Mini calendars */}
                      {Object.values(monthGroups).map(({year,month,dates})=>{
                        const fd=new Date(year,month,1).getDay(); const dim=new Date(year,month+1,0).getDate();
                        return (
                          <div key={year+"-"+month} style={{ background:C.parchment, borderRadius:16, border:`1px solid ${C.beige}`, overflow:"hidden", width:"100%", boxSizing:"border-box", contain:"layout" }}>
                            <div style={{ padding:"10px 14px", background:C.sand, borderBottom:`1px solid ${C.beige}` }}>
                              <span style={{ fontFamily:"'Cinzel', serif", fontSize:12, color:C.darkBrown, letterSpacing:.5 }}>{MONTHS[month]} {year}</span>
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"6px 4px 2px" }}>
                              {["S","M","T","W","T","F","S"].map((d,i)=>(
                                <div key={i} style={{ textAlign:"center", fontFamily:"'Cinzel', serif", fontSize:9, color:C.tan, letterSpacing:.5, padding:"3px 0" }}>{d}</div>
                              ))}
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:0, padding:"2px 4px 10px" }}>
                              {Array.from({length:fd}).map((_,i)=><div key={"e"+i}/>)}
                              {Array.from({length:dim}).map((_,i)=>{
                                const day=i+1; const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                                const inRange=dates.includes(ds); const isSelected=!!manualSchedule[ds]; const dayData=manualSchedule[ds]||{};
                                if(!inRange) return (<div key={day} style={{ aspectRatio:"1",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ fontFamily:"'Cinzel', serif",fontSize:11,color:C.beige }}>{day}</span></div>);
                                return (
                                  <div key={day} style={{ position:"relative", width:"100%", aspectRatio:"1" }}>
                                    <button onClick={()=>toggleDate(ds)}
                                      style={{ position:"absolute",inset:2,borderRadius:6,border:"none",background:isSelected?C.gold:C.sand,color:isSelected?C.cream:C.darkBrown,fontFamily:"'Cinzel', serif",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:400,outline:"none" }}>
                                      {day}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      {/* Selected dates spinners */}
                      {selectedDates.length>0 && (
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:9, letterSpacing:2, color:C.tan }}>SELECTED DATES</div>
                          {selectedDates.map(ds=>{
                            const dayData=manualSchedule[ds]||{};
                            const label=new Date(ds+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
                            return (
                              <div key={ds} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:C.sand,borderRadius:12,border:`1px solid ${C.beige}` }}>
                                <span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:11,color:C.brown,minWidth:80,flexShrink:0 }}>{label}</span>
                                <div style={{ display:"flex",gap:10,flex:1,flexWrap:"wrap" }}>
                                  {activeDelivs.map(d=>{ const dc=DELIVERABLE_CONFIG[d.type]; const cnt=dayData[d.type]||0; return (<div key={d.type} style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:C.tan }}>{dc.symbol}</span><button onClick={()=>setDayCount(ds,d.type,-1)} style={{ width:20,height:20,borderRadius:5,background:C.cream,border:`1px solid ${C.beige}`,fontSize:13,color:C.amber,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>−</button><span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:12,fontWeight:600,color:C.darkBrown,minWidth:14,textAlign:"center" }}>{cnt}</span><button onClick={()=>setDayCount(ds,d.type,1)} style={{ width:20,height:20,borderRadius:5,background:C.cream,border:`1px solid ${C.beige}`,fontSize:13,color:C.amber,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>+</button></div>); })}
                                </div>
                                <button onClick={()=>toggleDate(ds)} style={{ width:22,height:22,borderRadius:6,background:C.cream,border:`1px solid ${C.beige}`,color:C.tan,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>×</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Submit */}
                {scheduleMode==="ai" ? (
                  <button onClick={handleAdd} disabled={!form.brand||!form.startDate||((!form.singleDay)&&!form.endDate)||aiLoading} className="cb"
                    style={{ background:`linear-gradient(135deg,${C.gold},${C.amber})`,color:C.cream,padding:"15px",borderRadius:16,fontFamily:"'Cormorant Garamond', serif",fontSize:12,letterSpacing:2,opacity:(!form.brand||!form.startDate)?0.5:1,boxShadow:`0 6px 24px ${C.gold}55`,transition:"opacity .2s" }}>
                    {aiLoading?"✦ PLANNING YOUR SCHEDULE…":(formType==="event"?"SAVE EVENT  →":"SCHEDULE WITH AI  →")}
                  </button>
                ) : (()=>{
                  const totalNeeded=form.deliverables.filter(d=>d.count>0).reduce((s,d)=>s+d.count,0);
                  const totalAssigned=Object.values(manualSchedule).reduce((s,dayMap)=>s+Object.values(dayMap).reduce((a,b)=>a+b,0),0);
                  const ready=form.brand&&(formType==="event"?true:totalAssigned>0);
                  return (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {totalNeeded>0&&totalAssigned<totalNeeded&&(
                        <div style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:10,color:C.tan,textAlign:"center",letterSpacing:.5 }}>
                          {totalNeeded-totalAssigned} deliverable{totalNeeded-totalAssigned!==1?"s":""} not yet scheduled — you can still save and reschedule later.
                        </div>
                      )}
                      <button onClick={handleAdd} disabled={!ready} className="cb"
                        style={{ background:`linear-gradient(135deg,${C.gold},${C.amber})`,color:C.cream,padding:"15px",borderRadius:16,fontFamily:"'Cormorant Garamond', serif",fontSize:12,letterSpacing:2,opacity:ready?1:0.5,boxShadow:`0 6px 24px ${C.gold}55` }}>
                        {formType==="event"?"SAVE EVENT  →":"SAVE PARTNERSHIP  →"}
                      </button>
                    </div>
                  );
                })()}

                {aiTip && (
                  <div style={{ padding:"12px 16px",background:C.sand,borderRadius:14,border:`1px solid ${C.beige}`,display:"flex",gap:10,alignItems:"flex-start" }}>
                    <Sparkle size={12} style={{ flexShrink:0,marginTop:2 }}/>
                    <span style={{ fontFamily:"'Cormorant Garamond', serif",fontSize:13,color:C.tan,fontStyle:"italic" }}>{aiTip}</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
