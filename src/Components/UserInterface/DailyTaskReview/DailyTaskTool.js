import Tilt from 'react-parallax-tilt';
import Grow from '@mui/material/Grow';
import { Box } from '@mui/material';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const DailyTaskTool = () => {
  return (
      <>
                 <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
                     <Grow
                         in='true'
                         style={{ transformOrigin: '0 0 0' }}
                         timeout={1500}
                     >
                         <div>
                             <div style={{ margin: 10, marginLeft: 10 }}>
                                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                                     <Link underline="hover" href='/tools'>Tools</Link>
                                     {/* <Link underline="hover" href='/trends'>Trend</Link> */}
                                     <Typography color='text.primary'>Daily Task Review</Typography>
                                 </Breadcrumbs>
                             </div>
                             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
     
                                 <Tilt tiltReverse transitionSpeed={1000}>
                                     <div style={{
                                         width: 600, height: "400px", padding: "40px", backgroundColor: "#0093E9",
                                         backgroundImage: "linear-gradient(160deg, #006e74 0%, #80D0C7 100%)", borderRadius: "10px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
                                     }}>
                                         <div style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: 500, marginTop: "100px" }}>
                                             <span style={{ color: "yellow" }}>Daily Task Review</span > <span style={{textAlign:'center'}}>Tool</span></div>
                                     </div></Tilt>
                             </div>
                         </div>
     
                     </Grow>
                 </Box>
             </>
    )
  }

export default DailyTaskTool


// import { useEffect, useRef, useState } from 'react';
// import Tilt from 'react-parallax-tilt';
// import Grow from '@mui/material/Grow';
// import { Box } from '@mui/material';
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// /* ─── tiny keyframe injection ─── */
// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

//   @keyframes floatY {
//     0%, 100% { transform: translateY(0px); }
//     50%       { transform: translateY(-10px); }
//   }
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(24px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes shimmer {
//     0%   { background-position: -400px 0; }
//     100% { background-position: 400px 0; }
//   }
//   @keyframes pulse {
//     0%, 100% { opacity: 0.6; transform: scale(1); }
//     50%       { opacity: 1;   transform: scale(1.05); }
//   }
//   @keyframes rotateSlow {
//     from { transform: rotate(0deg); }
//     to   { transform: rotate(360deg); }
//   }
//   @keyframes dash {
//     0%   { stroke-dashoffset: 300; }
//     100% { stroke-dashoffset: 0; }
//   }

//   .feature-card {
//     transition: transform 0.25s ease, box-shadow 0.25s ease;
//   }
//   .feature-card:hover {
//     transform: translateY(-4px) scale(1.015);
//     box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
//   }
//   .stat-pill {
//     animation: pulse 3s ease-in-out infinite;
//   }
//   .spin-ring {
//     animation: rotateSlow 8s linear infinite;
//     transform-origin: center;
//   }
// `;

// /* ─── Animated SVG ring accent ─── */
// const RingAccent = () => (
//   <svg width="160" height="160" viewBox="0 0 160 160" fill="none" style={{ position: 'absolute', top: -30, right: -30, opacity: 0.18 }}>
//     <circle cx="80" cy="80" r="70" stroke="white" strokeWidth="1.5"
//       strokeDasharray="40 10" className="spin-ring" />
//     <circle cx="80" cy="80" r="50" stroke="white" strokeWidth="0.8"
//       strokeDasharray="20 8"
//       style={{ animation: 'rotateSlow 12s linear infinite reverse', transformOrigin: 'center' }} />
//   </svg>
// );

// /* ─── Animated progress bar ─── */
// const Bar = ({ value, color, delay }) => {
//   const [width, setWidth] = useState(0);
//   useEffect(() => {
//     const t = setTimeout(() => setWidth(value), 900 + delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return (
//     <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
//       <div style={{
//         height: '100%', borderRadius: 4, background: color,
//         width: `${width}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)'
//       }} />
//     </div>
//   );
// };

// /* ─── Feature card ─── */
// const FeatureCard = ({ icon, title, desc, stats, color, delay }) => (
//   <div className="feature-card" style={{
//     background: 'rgba(255,255,255,0.06)',
//     border: '1px solid rgba(255,255,255,0.12)',
//     borderRadius: 16,
//     padding: '22px 20px',
//     backdropFilter: 'blur(8px)',
//     animation: `fadeUp 0.6s ease both`,
//     animationDelay: `${delay}ms`,
//     flex: 1,
//     minWidth: 0,
//   }}>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
//       <div style={{
//         width: 36, height: 36, borderRadius: 10,
//         background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: 18, flexShrink: 0
//       }}>{icon}</div>
//       <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>{title}</div>
//     </div>
//     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, marginBottom: 14 }}>{desc}</div>
//     {stats.map((s, i) => (
//       <div key={i} style={{ marginBottom: 8 }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
//           <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
//           <span style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.val}</span>
//         </div>
//         <Bar value={s.pct} color={s.color} delay={i * 200 + delay} />
//       </div>
//     ))}
//   </div>
// );

// /* ─── Mini floating task chip ─── */
// const TaskChip = ({ label, status, style }) => {
//   const colors = { done: '#34d399', pending: '#fbbf24', progress: '#60a5fa' };
//   return (
//     <div style={{
//       position: 'absolute', background: 'rgba(255,255,255,0.12)',
//       border: `1px solid ${colors[status]}44`,
//       backdropFilter: 'blur(10px)',
//       borderRadius: 8, padding: '6px 11px',
//       display: 'flex', alignItems: 'center', gap: 6,
//       fontSize: 11, color: '#fff', fontFamily: 'Inter, sans-serif',
//       whiteSpace: 'nowrap',
//       ...style
//     }}>
//       <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[status], flexShrink: 0 }} />
//       {label}
//     </div>
//   );
// };

// /* ─── Main component ─── */
// const DailyTaskTool = () => {
//   const styleRef = useRef(null);

//   useEffect(() => {
//     if (!styleRef.current) {
//       const el = document.createElement('style');
//       el.textContent = css;
//       document.head.appendChild(el);
//       styleRef.current = el;
//     }
//     return () => styleRef.current?.remove();
//   }, []);

//   const features = [
//     {
//       icon: '📊', title: 'Dashboard', color: 'rgba(96,165,250,0.3)',
//       desc: 'Live overview of task progress across OEMs, priorities, and time slots. Charts update as work moves.',
//       stats: [
//         { label: 'Task Completion', pct: 74, val: '74%', color: '#60a5fa' },
//         { label: 'On-Time Rate',    pct: 61, val: '61%', color: '#34d399' },
//         { label: 'Pending Review',  pct: 28, val: '28%', color: '#fbbf24' },
//       ],
//       delay: 600,
//     },
//     {
//       icon: '📋', title: 'Assign Task', color: 'rgba(167,139,250,0.3)',
//       desc: 'Dispatch tasks to team members with OEM, slot, and priority tags. Track who owns what in real time.',
//       stats: [
//         { label: 'Assigned Today',  pct: 82, val: '82%', color: '#a78bfa' },
//         { label: 'High Priority',   pct: 35, val: '35%', color: '#f87171' },
//         { label: 'Awaiting Accept', pct: 18, val: '18%', color: '#fbbf24' },
//       ],
//       delay: 750,
//     },
//     {
//       icon: '✅', title: 'My Tasks', color: 'rgba(52,211,153,0.3)',
//       desc: 'Your personal queue — sorted by due date and slot. Update status, flag blockers, close items fast.',
//       stats: [
//         { label: 'Completed',   pct: 55, val: '55%', color: '#34d399' },
//         { label: 'In Progress', pct: 30, val: '30%', color: '#60a5fa' },
//         { label: 'Overdue',     pct: 15, val: '15%', color: '#f87171' },
//       ],
//       delay: 900,
//     },
//   ];

//   return (
//     <Box sx={{ display: { xs: 'none', md: 'inherit' }, fontFamily: 'Inter, sans-serif' }}>
//       <Grow in style={{ transformOrigin: '0 0 0' }} timeout={1500}>
//         <div>
//           {/* Breadcrumb */}
//           <div style={{ margin: '10px 10px 0' }}>
//             <Breadcrumbs
//               aria-label="breadcrumb"
//               itemsBeforeCollapse={2}
//               maxItems={3}
//               separator={<KeyboardArrowRightIcon fontSize="small" />}
//             >
//               <Link underline="hover" href="/tools">Tools</Link>
//               <Typography color="text.primary">Daily Task Review</Typography>
//             </Breadcrumbs>
//           </div>

//           {/* Hero section */}
//           <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 32px 32px' }}>
//             <div style={{ width: '100%', maxWidth: 900 }}>

//               {/* Main 3D tilt card */}
//               <Tilt tiltReverse tiltMaxAngleDegrees={8} transitionSpeed={1200} perspective={1200}
//                 glareEnable glareMaxOpacity={0.08} glareColor="#ffffff" glarePosition="all"
//                 style={{ animation: 'floatY 5s ease-in-out infinite' }}
//               >
//                 <div style={{
//                   borderRadius: 20,
//                   background: 'linear-gradient(135deg, #004d5a 0%, #006e74 45%, #1a8a7a 100%)',
//                   boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
//                   padding: '36px 36px 30px',
//                   position: 'relative',
//                   overflow: 'hidden',
//                 }}>
//                   {/* Background grid lines */}
//                   <div style={{
//                     position: 'absolute', inset: 0, opacity: 0.07,
//                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
//                     backgroundSize: '40px 40px',
//                   }} />

//                   {/* Glow blob */}
//                   <div style={{
//                     position: 'absolute', top: -60, right: -60,
//                     width: 240, height: 240, borderRadius: '50%',
//                     background: 'radial-gradient(circle, rgba(128,208,199,0.3) 0%, transparent 70%)',
//                     pointerEvents: 'none',
//                   }} />

//                   <RingAccent />

//                   {/* Top row: title + live badge */}
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
//                     <div>
//                       <div style={{
//                         fontSize: 11, fontWeight: 600, letterSpacing: 2.5,
//                         color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 8
//                       }}>
//                         CommTool · Operations
//                       </div>
//                       <div style={{
//                         fontSize: 38, fontWeight: 600, color: '#fff', lineHeight: 1.15,
//                         animation: 'fadeUp 0.7s ease both',
//                       }}>
//                         Daily Task<br />
//                         <span style={{
//                           background: 'linear-gradient(90deg, #fde68a, #fbbf24)',
//                           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
//                         }}>Review</span>
//                       </div>
//                     </div>

//                     {/* Live status pill */}
//                     <div className="stat-pill" style={{
//                       background: 'rgba(52,211,153,0.15)',
//                       border: '1px solid rgba(52,211,153,0.4)',
//                       borderRadius: 20, padding: '6px 14px',
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       fontSize: 11, color: '#34d399', fontWeight: 600,
//                     }}>
//                       <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
//                       Live
//                     </div>
//                   </div>

//                   {/* Subtitle */}
//                   <div style={{
//                     fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 420,
//                     lineHeight: 1.7, marginBottom: 24,
//                     animation: 'fadeUp 0.7s 0.15s ease both',
//                   }}>
//                     One place to assign, track, and close field tasks — with analytics that show what's moving and what's stuck.
//                   </div>

//                   {/* Stats row */}
//                   <div style={{
//                     display: 'flex', gap: 24, marginBottom: 28,
//                     animation: 'fadeUp 0.7s 0.3s ease both',
//                   }}>
//                     {[
//                       { label: 'Tasks Today', val: '142', color: '#60a5fa' },
//                       { label: 'Completed',   val: '89',  color: '#34d399' },
//                       { label: 'Pending',     val: '53',  color: '#fbbf24' },
//                     ].map(s => (
//                       <div key={s.label}>
//                         <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
//                         <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Feature cards row */}
//                   <div style={{
//                     display: 'flex', gap: 14,
//                     animation: 'fadeUp 0.7s 0.45s ease both',
//                   }}>
//                     {features.map(f => (
//                       <FeatureCard key={f.title} {...f} />
//                     ))}
//                   </div>

//                   {/* Floating task chips */}
//                   <TaskChip label="Nokia BTS · Slot A2" status="done"
//                     style={{ bottom: -14, left: 32, animation: 'floatY 4s 0.5s ease-in-out infinite' }} />
//                   <TaskChip label="Ericsson MW · P2" status="progress"
//                     style={{ bottom: -14, right: 200, animation: 'floatY 4.5s 1s ease-in-out infinite' }} />
//                 </div>
//               </Tilt>

//               {/* Bottom micro-hint */}
//               <div style={{
//                 textAlign: 'center', marginTop: 32, fontSize: 11,
//                 color: 'rgba(0,0,0,0.3)', letterSpacing: 0.5,
//                 animation: 'fadeUp 0.7s 1.2s ease both',
//               }}>
//                 Navigate with the sidebar · Data refreshes automatically
//               </div>
//             </div>
//           </div>
//         </div>
//       </Grow>
//     </Box>
//   );
// };

// export default DailyTaskTool;

// import { useEffect, useRef, useState } from 'react';
// import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// const INJECT_CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Serif+Display&display=swap');

// @keyframes dtt-float {
//   0%,100% { transform: translateY(0px); }
//   50%      { transform: translateY(-7px); }
// }
// @keyframes dtt-spin-slow {
//   from { transform: rotate(0deg); }
//   to   { transform: rotate(360deg); }
// }
// @keyframes dtt-spin-rev {
//   from { transform: rotate(0deg); }
//   to   { transform: rotate(-360deg); }
// }
// @keyframes dtt-fade-up {
//   from { opacity:0; transform:translateY(16px); }
//   to   { opacity:1; transform:translateY(0); }
// }
// @keyframes dtt-shimmer {
//   0%   { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }
// @keyframes dtt-ticker {
//   0%,8%   { opacity:0; transform:translateY(5px); }
//   18%,82% { opacity:1; transform:translateY(0); }
//   92%,100%{ opacity:0; transform:translateY(-5px); }
// }
// @keyframes dtt-flow-h {
//   0%   { stroke-dashoffset: 80; opacity:0.18; }
//   50%  { opacity:1; }
//   100% { stroke-dashoffset: 0; opacity:0.18; }
// }
// @keyframes dtt-pulse {
//   0%,100% { box-shadow:0 0 0 0 rgba(0,100,80,0.5); }
//   50%      { box-shadow:0 0 0 6px rgba(0,100,80,0); }
// }
// @keyframes dtt-count {
//   from { opacity:0; transform:translateY(6px) scale(0.85); }
//   to   { opacity:1; transform:translateY(0) scale(1); }
// }
// @keyframes dtt-orb-enter {
//   from { opacity:0; transform:scale(0.7); }
//   to   { opacity:1; transform:scale(1); }
// }

// .dtt-card {
//   transition: transform 0.26s cubic-bezier(.34,1.48,.64,1), box-shadow 0.26s ease;
//   will-change: transform;
// }
// .dtt-card:hover {
//   transform: translateY(-6px) scale(1.02) !important;
//   box-shadow: 0 20px 48px rgba(0,100,80,0.15), 0 6px 18px rgba(0,0,0,0.07) !important;
// }
// .dtt-card:hover .dtt-hglow { opacity:1 !important; }

// .dtt-mod {
//   transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
//   cursor: default;
// }
// .dtt-mod:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 8px 22px rgba(0,100,80,0.1) !important;
// }
// `;

// /* ── Data ─────────────────────────────────────────────────────────────────── */
// const STAGES = [
//   { key:'created',    label:'Created',     icon:'✦', color:'#6352ff', light:'#ede9ff', mid:'#c4b8ff',  pct:100, desc:'Drafted with title, OEM, priority & due date', tags:['Title','OEM','Date'] },
//   { key:'assigned',   label:'Assigned',    icon:'⇢', color:'#9333ea', light:'#f3e8ff', mid:'#d8b4fe',  pct:83,  desc:'Dispatched to owner with slot & reminder set', tags:['Owner','Slot'] },
//   { key:'active',     label:'Active',      icon:'◉', color:'#f59e0b', light:'#fffbeb', mid:'#fde68a',  pct:66,  desc:"Acknowledged — sitting in assignee's queue",  tags:['Queued','Live'] },
//   { key:'inprogress', label:'In Progress', icon:'▶', color:'#10b981', light:'#ecfdf5', mid:'#a7f3d0',  pct:47,  desc:'Work started — updates & blockers logged',      tags:['Updates','Live'] },
//   { key:'completed',  label:'Completed',   icon:'✓', color:'#ef4444', light:'#fff1f2', mid:'#fecdd3',   pct:63,  desc:'Closed with remarks, feeds SLA & analytics',   tags:['Remarks','SLA'] },
// ];

// const MODULES = [
//   { label:'Admin Panel', icon:'⚙', color:'#006450', desc:'Add tasks, configure OEM & reminders' },
//   { label:'Assign Task', icon:'⇢', color:'#9333ea', desc:'Route to member with priority & slot' },
//   { label:'My Tasks',    icon:'✓', color:'#10b981', desc:'Personal queue — update & log blockers' },
//   { label:'Dashboard',   icon:'◉', color:'#f59e0b', desc:'Live charts: completion, SLA, OEM split' },
// ];

// const TICKS = [
//   'Nokia BTS assigned → AP circle',
//   'Ericsson MW completed ✓',
//   'Huawei RRU moved to In Progress',
//   'ZTE Core flagged overdue ⚠',
//   'Samsung 5G dispatched → TN',
// ];

// /* ── Animated bar ─────────────────────────────────────────────────────────── */
// const Bar = ({ pct, color, delay = 0 }) => {
//   const [go, setGo] = useState(false);
//   useEffect(() => { const t = setTimeout(() => setGo(true), 700 + delay); return () => clearTimeout(t); }, []);
//   return (
//     <div style={{ height: 3, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
//       <div style={{
//         height: '100%', width: `${pct}%`, background: color, borderRadius: 4,
//         transform: go ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left',
//         transition: `transform 1.1s ${delay}ms cubic-bezier(.4,0,.2,1)`
//       }} />
//     </div>
//   );
// };

// /* ── Live ticker ──────────────────────────────────────────────────────────── */
// const Ticker = () => {
//   const [i, setI] = useState(0);
//   useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % TICKS.length), 3000); return () => clearInterval(t); }, []);
//   return (
//     <div key={i} style={{
//       fontSize: 11, color: '#006450', fontWeight: 600,
//       background: 'linear-gradient(90deg,rgba(0,100,80,0.08),rgba(16,185,129,0.1))',
//       border: '1px solid rgba(0,100,80,0.25)',
//       borderRadius: 20, padding: '4px 13px',
//       animation: 'dtt-ticker 3s ease both',
//       whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 270,
//       fontFamily: 'Inter,sans-serif',
//     }}>● {TICKS[i]}</div>
//   );
// };

// /* ── Horizontal arrow connector ───────────────────────────────────────────── */
// const ConnH = ({ toColor, delay }) => (
//   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, flexShrink: 0 }}>
//     <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
//       <line x1="2" y1="7" x2="30" y2="7" stroke={toColor} strokeWidth="2"
//         strokeDasharray="4 3"
//         style={{ animation: `dtt-flow-h 2.2s ${delay}s linear infinite` }} />
//       <polygon points="40,7 28,2 28,12" fill={toColor} opacity="0.75" />
//     </svg>
//   </div>
// );

// /* ── Stage card ───────────────────────────────────────────────────────────── */
// const StageCard = ({ s, idx, delay }) => {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       className="dtt-card"
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         position: 'relative',
//         flex: '1 1 0',
//         minWidth: 0,
//         background: 'rgba(255,255,255,0.84)',
//         backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
//         border: `1.5px solid ${hov ? s.mid : 'rgba(255,255,255,0.97)'}`,
//         borderRadius: 20, padding: '16px 14px 14px',
//         boxShadow: '0 4px 20px rgba(0,100,80,0.06), 0 2px 8px rgba(0,0,0,0.04)',
//         animation: `dtt-fade-up 0.45s ${delay}ms ease both`,
//         overflow: 'hidden',
//         transition: 'border-color 0.22s ease',
//       }}>

//       <div style={{
//         position: 'absolute', top: 0, right: 0, width: 55, height: 55,
//         background: `radial-gradient(circle at top right, ${s.light} 0%, transparent 75%)`,
//         pointerEvents: 'none'
//       }} />
//       <div className="dtt-hglow" style={{
//         position: 'absolute', inset: 0, borderRadius: 20,
//         background: `radial-gradient(ellipse at 50% -5%, ${s.light} 0%, transparent 65%)`,
//         opacity: hov ? 1 : 0, transition: 'opacity .22s ease', pointerEvents: 'none'
//       }} />
//       <div style={{
//         position: 'absolute', top: 10, right: 12,
//         fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: s.color, opacity: 0.45,
//         fontFamily: 'Inter,sans-serif'
//       }}>{String(idx + 1).padStart(2, '0')}</div>

//       <div style={{
//         display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
//         width: 36, height: 36, borderRadius: 11,
//         background: `linear-gradient(135deg,${s.light},${s.mid})`,
//         border: `1.5px solid ${s.mid}`,
//         fontSize: 16, color: s.color,
//         boxShadow: `0 3px 10px ${s.color}22`,
//         marginBottom: 9,
//       }}>{s.icon}</div>

//       <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1533', letterSpacing: -0.3, marginBottom: 4, lineHeight: 1.2, fontFamily: 'Inter,sans-serif' }}>{s.label}</div>
//       <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.55, marginBottom: 9, fontFamily: 'Inter,sans-serif' }}>{s.desc}</div>

//       <div style={{ marginBottom: 6 }}>
//         <span style={{
//           fontSize: 21, fontWeight: 800, color: s.color, fontFamily: 'Inter,sans-serif',
//           lineHeight: 1, animation: `dtt-count 0.45s ${delay + 280}ms ease both`, display: 'inline-block'
//         }}>{s.count}</span>
//         <span style={{ fontSize: 9, color: '#9ca3af', marginLeft: 4, fontFamily: 'Inter' }}>tasks</span>
//       </div>

//       <Bar pct={s.pct} color={s.color} delay={delay} />

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 9 }}>
//         {s.tags.map(t => (
//           <span key={t} style={{
//             fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
//             color: s.color, background: s.light,
//             borderRadius: 5, padding: '2px 6px', fontFamily: 'Inter,sans-serif',
//           }}>{t}</span>
//         ))}
//       </div>
//     </div>
//   );
// };

// /* ── Floating stat orb ────────────────────────────────────────────────────── */
// const Orb = ({ value, label, color, light, floatDelay, enterDelay }) => (
//   <div style={{
//     display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//     width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
//     background: `radial-gradient(circle at 35% 30%, ${light}, rgba(255,255,255,0.65))`,
//     backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
//     border: `2px solid ${light}`,
//     boxShadow: `0 6px 20px ${color}22, 0 2px 8px rgba(0,0,0,0.05)`,
//     animation: `dtt-float 5s ${floatDelay}s ease-in-out infinite, dtt-orb-enter 0.5s ${enterDelay}ms ease both`,
//   }}>
//     <div style={{ fontSize: 17, fontWeight: 900, color, lineHeight: 1, fontFamily: 'Inter' }}>{value}</div>
//     <div style={{ fontSize: 8.5, color: '#6b7280', fontWeight: 600, letterSpacing: 0.3, marginTop: 2, textTransform: 'uppercase', fontFamily: 'Inter' }}>{label}</div>
//   </div>
// );

// /* ── Main component ───────────────────────────────────────────────────────── */
// const DailyTaskTool = () => {
//   const styleRef = useRef(null);
//   useEffect(() => {
//     if (!styleRef.current) {
//       const el = document.createElement('style');
//       el.textContent = INJECT_CSS;
//       document.head.appendChild(el);
//       styleRef.current = el;
//     }
//     return () => { styleRef.current?.remove(); styleRef.current = null; };
//   }, []);

//   return (
//     /* Page bg: very light teal-white so there is zero blue "panel" showing */
//     <Box sx={{
//       fontFamily: 'Inter,sans-serif',
//       minHeight: '100vh',
//       background: 'linear-gradient(150deg, #edfaf6 0%, #f4f8ff 40%, #f9f7ff 70%, #edfaf6 100%)',
//     }}>
//       {/* Breadcrumb */}
//       <div style={{ padding: '10px 20px 0' }}>
//         <Breadcrumbs maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//           <Link underline="hover" href="/tools" style={{ color: '#006450', fontSize: 13 }}>Tools</Link>
//           <Typography color="text.primary" style={{ fontSize: 13 }}>Daily Task Review</Typography>
//         </Breadcrumbs>
//       </div>

//       {/* ── OUTER CARD ── */}
//       <div style={{ padding: '10px 16px 16px' }}>
//         <div style={{
//           position: 'relative',
//           borderRadius: 24,
//           overflow: 'hidden',
//           /*
//             White-glass on left → teal-green on right.
//             No solid colour backdrop → nothing looks "pasted on".
//           */
//           background: `linear-gradient(
//             130deg,
//             rgba(255,255,255,0.93) 0%,
//             rgba(240,250,246,0.90) 30%,
//             rgba(210,244,232,0.85) 65%,
//             rgba(160,228,205,0.78) 100%
//           )`,
//           border: '1.5px solid rgba(0,100,80,0.11)',
//           boxShadow: '0 8px 40px rgba(0,100,80,0.07), 0 2px 12px rgba(99,82,255,0.05)',
//           display: 'flex',
//           flexDirection: 'column',
//         }}>

//           {/* Decorative blobs */}
//           <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 24 }}>
//             <div style={{
//               position: 'absolute', width: 360, height: 360, borderRadius: '50%',
//               background: 'radial-gradient(circle,rgba(99,82,255,0.08) 0%,transparent 68%)',
//               top: -100, left: -80, animation: 'dtt-spin-slow 28s linear infinite'
//             }} />
//             <div style={{
//               position: 'absolute', width: 420, height: 420, borderRadius: '50%',
//               background: 'radial-gradient(circle,rgba(0,100,80,0.13) 0%,transparent 65%)',
//               bottom: -100, right: -80, animation: 'dtt-spin-rev 22s linear infinite'
//             }} />
//             <div style={{
//               position: 'absolute', width: 220, height: 220, borderRadius: '50%',
//               background: 'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 68%)',
//               top: '35%', right: '22%'
//             }} />
//             <div style={{
//               position: 'absolute', inset: 0,
//               backgroundImage: `linear-gradient(rgba(0,100,80,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,100,80,0.025) 1px,transparent 1px)`,
//               backgroundSize: '34px 34px'
//             }} />
//           </div>

//           {/* ── TOP ROW ── */}
//           <div style={{
//             display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
//             padding: '22px 28px 0', position: 'relative',
//             animation: 'dtt-fade-up 0.4s ease both',
//           }}>
//             <div>
//               <div style={{
//                 fontSize: 9.5, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
//                 color: '#009070', marginBottom: 5, fontFamily: 'Inter,sans-serif'
//               }}>CommTool · Operations</div>
//               <div style={{ fontFamily: 'DM Serif Display,serif', lineHeight: 1.05, marginBottom: 6 }}>
//                 <span style={{ fontSize: 30, color: '#1a1533', display: 'block' }}>Daily Task</span>
//                 <span style={{
//                   fontSize: 30, display: 'block',
//                   background: 'linear-gradient(90deg,#006450 0%,#10b981 45%,#6352ff 100%)',
//                   WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//                   backgroundSize: '200% 100%', animation: 'dtt-shimmer 4s linear infinite',
//                 }}>Review</span>
//               </div>
//               <div style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: 'Inter,sans-serif', maxWidth: 320 }}>
//                 End-to-end visibility — see exactly where every task sits right now.
//               </div>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9, flexShrink: 0 }}>
//               <div style={{
//                 display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px',
//                 background: 'rgba(0,100,80,0.07)', border: '1.5px solid rgba(0,100,80,0.22)',
//                 borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#006450', fontFamily: 'Inter',
//               }}>
//                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#006450', animation: 'dtt-pulse 1.8s ease-in-out infinite' }} />
//                 LIVE
//               </div>
//               <Ticker />
//               {/* <div style={{ display: 'flex', gap: 9, marginTop: 2 }}>
//                 <Orb value="142" label="Today"   color="#6352ff" light="#ede9ff" floatDelay={0}   enterDelay={200} />
//                 <Orb value="89"  label="Done"    color="#006450" light="#d1fae5" floatDelay={0.5} enterDelay={300} />
//                 <Orb value="74%" label="On-time" color="#f59e0b" light="#fffbeb" floatDelay={1}   enterDelay={400} />
//               </div> */}
//             </div>
//           </div>

//           {/* ── DIVIDER ── */}
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 12,
//             padding: '16px 28px 6px', position: 'relative',
//             animation: 'dtt-fade-up 0.4s 100ms ease both',
//           }}>
//             <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,rgba(0,100,80,0.22),transparent)' }} />
//             <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 3, color: '#009070', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>
//               5-stage task lifecycle
//             </span>
//             <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,transparent,rgba(99,82,255,0.22))' }} />
//           </div>

//           {/* ── PIPELINE — fills full card width ── */}
//           <div style={{
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             padding: '4px 20px 0',
//             animation: 'dtt-fade-up 0.45s 180ms ease both',
//             position: 'relative',
//           }}>
//             {STAGES.map((s, i) => (
//               <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 0 }}>
//                 <StageCard s={s} idx={i} delay={220 + i * 90} />
//                 {i < STAGES.length - 1 && <ConnH toColor={STAGES[i + 1].color} delay={i * 0.45} />}
//               </div>
//             ))}
//           </div>

//           {/* ── MODULE STRIP ── */}
//           <div style={{
//             display: 'flex',
//             margin: '14px 20px 0',
//             borderRadius: 16, overflow: 'hidden',
//             border: '1.5px solid rgba(0,100,80,0.1)',
//             background: 'rgba(255,255,255,0.60)',
//             backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
//             animation: 'dtt-fade-up 0.4s 580ms ease both', position: 'relative',
//           }}>
//             {MODULES.map((m, i) => (
//               <div key={m.label} className="dtt-mod"
//                 style={{
//                   flex: 1, padding: '13px 16px',
//                   borderRight: i < MODULES.length - 1 ? '1px solid rgba(0,100,80,0.08)' : 'none',
//                   display: 'flex', flexDirection: 'column', gap: 4,
//                   boxShadow: 'none', background: 'transparent',
//                 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//                   <span style={{
//                     display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
//                     width: 26, height: 26, borderRadius: 8,
//                     background: `linear-gradient(135deg,${m.color}18,${m.color}32)`,
//                     border: `1px solid ${m.color}30`, fontSize: 13, color: m.color,
//                   }}>{m.icon}</span>
//                   <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1533', fontFamily: 'Inter,sans-serif' }}>{m.label}</span>
//                 </div>
//                 <div style={{ fontSize: 10.5, color: '#9ca3af', lineHeight: 1.45, paddingLeft: 33, fontFamily: 'Inter,sans-serif' }}>{m.desc}</div>
//               </div>
//             ))}
//           </div>

//           {/* ── FOOTER ── */}
//           <div style={{
//             textAlign: 'center', padding: '9px 0 12px',
//             fontSize: 10, color: '#009070', letterSpacing: 0.7,
//             fontFamily: 'Inter,sans-serif', position: 'relative', opacity: 0.7,
//           }}>
//             Navigate with the sidebar · Pipeline refreshes automatically
//           </div>

//         </div>
//       </div>
//     </Box>
//   );
// };

// export default DailyTaskTool;