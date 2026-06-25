// import Tilt from 'react-parallax-tilt';
// import Grow from '@mui/material/Grow';
// import { Box } from '@mui/material';
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// const DailyTaskTool = () => {
//   return (
//       <>
//                  <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
//                      <Grow
//                          in='true'
//                          style={{ transformOrigin: '0 0 0' }}
//                          timeout={1500}
//                      >
//                          <div>
//                              <div style={{ margin: 10, marginLeft: 10 }}>
//                                  <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                                      <Link underline="hover" href='/tools'>Tools</Link>
//                                      {/* <Link underline="hover" href='/trends'>Trend</Link> */}
//                                      <Typography color='text.primary'>Daily Task Review</Typography>
//                                  </Breadcrumbs>
//                              </div>
//                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
     
//                                  <Tilt tiltReverse transitionSpeed={1000}>
//                                      <div style={{
//                                          width: 600, height: "400px", padding: "40px", backgroundColor: "#0093E9",
//                                          backgroundImage: "linear-gradient(160deg, #006e74 0%, #80D0C7 100%)", borderRadius: "10px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
//                                      }}>
//                                          <div style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: 500, marginTop: "100px" }}>
//                                              <span style={{ color: "yellow" }}>Daily Task Review</span > <span style={{textAlign:'center'}}>Tool</span></div>
//                                      </div></Tilt>
//                              </div>
//                          </div>
     
//                      </Grow>
//                  </Box>
//              </>
//     )
//   }

// export default DailyTaskTool

import { useEffect, useRef, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import Grow from '@mui/material/Grow';
import { Box } from '@mui/material';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

/* ─── tiny keyframe injection ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.05); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes dash {
    0%   { stroke-dashoffset: 300; }
    100% { stroke-dashoffset: 0; }
  }

  .feature-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .feature-card:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
  }
  .stat-pill {
    animation: pulse 3s ease-in-out infinite;
  }
  .spin-ring {
    animation: rotateSlow 8s linear infinite;
    transform-origin: center;
  }
`;

/* ─── Animated SVG ring accent ─── */
const RingAccent = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" style={{ position: 'absolute', top: -30, right: -30, opacity: 0.18 }}>
    <circle cx="80" cy="80" r="70" stroke="white" strokeWidth="1.5"
      strokeDasharray="40 10" className="spin-ring" />
    <circle cx="80" cy="80" r="50" stroke="white" strokeWidth="0.8"
      strokeDasharray="20 8"
      style={{ animation: 'rotateSlow 12s linear infinite reverse', transformOrigin: 'center' }} />
  </svg>
);

/* ─── Animated progress bar ─── */
const Bar = ({ value, color, delay }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 900 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 4, background: color,
        width: `${width}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)'
      }} />
    </div>
  );
};

/* ─── Feature card ─── */
const FeatureCard = ({ icon, title, desc, stats, color, delay }) => (
  <div className="feature-card" style={{
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: '22px 20px',
    backdropFilter: 'blur(8px)',
    animation: `fadeUp 0.6s ease both`,
    animationDelay: `${delay}ms`,
    flex: 1,
    minWidth: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0
      }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>{title}</div>
    </div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, marginBottom: 14 }}>{desc}</div>
    {stats.map((s, i) => (
      <div key={i} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
          <span style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.val}</span>
        </div>
        <Bar value={s.pct} color={s.color} delay={i * 200 + delay} />
      </div>
    ))}
  </div>
);

/* ─── Mini floating task chip ─── */
const TaskChip = ({ label, status, style }) => {
  const colors = { done: '#34d399', pending: '#fbbf24', progress: '#60a5fa' };
  return (
    <div style={{
      position: 'absolute', background: 'rgba(255,255,255,0.12)',
      border: `1px solid ${colors[status]}44`,
      backdropFilter: 'blur(10px)',
      borderRadius: 8, padding: '6px 11px',
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, color: '#fff', fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
      ...style
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[status], flexShrink: 0 }} />
      {label}
    </div>
  );
};

/* ─── Main component ─── */
const DailyTaskTool = () => {
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style');
      el.textContent = css;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => styleRef.current?.remove();
  }, []);

  const features = [
    {
      icon: '📊', title: 'Dashboard', color: 'rgba(96,165,250,0.3)',
      desc: 'Live overview of task progress across OEMs, priorities, and time slots. Charts update as work moves.',
      stats: [
        { label: 'Task Completion', pct: 74, val: '74%', color: '#60a5fa' },
        { label: 'On-Time Rate',    pct: 61, val: '61%', color: '#34d399' },
        { label: 'Pending Review',  pct: 28, val: '28%', color: '#fbbf24' },
      ],
      delay: 600,
    },
    {
      icon: '📋', title: 'Assign Task', color: 'rgba(167,139,250,0.3)',
      desc: 'Dispatch tasks to team members with OEM, slot, and priority tags. Track who owns what in real time.',
      stats: [
        { label: 'Assigned Today',  pct: 82, val: '82%', color: '#a78bfa' },
        { label: 'High Priority',   pct: 35, val: '35%', color: '#f87171' },
        { label: 'Awaiting Accept', pct: 18, val: '18%', color: '#fbbf24' },
      ],
      delay: 750,
    },
    {
      icon: '✅', title: 'My Tasks', color: 'rgba(52,211,153,0.3)',
      desc: 'Your personal queue — sorted by due date and slot. Update status, flag blockers, close items fast.',
      stats: [
        { label: 'Completed',   pct: 55, val: '55%', color: '#34d399' },
        { label: 'In Progress', pct: 30, val: '30%', color: '#60a5fa' },
        { label: 'Overdue',     pct: 15, val: '15%', color: '#f87171' },
      ],
      delay: 900,
    },
  ];

  return (
    <Box sx={{ display: { xs: 'none', md: 'inherit' }, fontFamily: 'Inter, sans-serif' }}>
      <Grow in style={{ transformOrigin: '0 0 0' }} timeout={1500}>
        <div>
          {/* Breadcrumb */}
          <div style={{ margin: '10px 10px 0' }}>
            <Breadcrumbs
              aria-label="breadcrumb"
              itemsBeforeCollapse={2}
              maxItems={3}
              separator={<KeyboardArrowRightIcon fontSize="small" />}
            >
              <Link underline="hover" href="/tools">Tools</Link>
              <Typography color="text.primary">Daily Task Review</Typography>
            </Breadcrumbs>
          </div>

          {/* Hero section */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 32px 32px' }}>
            <div style={{ width: '100%', maxWidth: 900 }}>

              {/* Main 3D tilt card */}
              <Tilt tiltReverse tiltMaxAngleDegrees={8} transitionSpeed={1200} perspective={1200}
                glareEnable glareMaxOpacity={0.08} glareColor="#ffffff" glarePosition="all"
                style={{ animation: 'floatY 5s ease-in-out infinite' }}
              >
                <div style={{
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #004d5a 0%, #006e74 45%, #1a8a7a 100%)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
                  padding: '36px 36px 30px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Background grid lines */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.07,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />

                  {/* Glow blob */}
                  <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 240, height: 240, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(128,208,199,0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />

                  <RingAccent />

                  {/* Top row: title + live badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: 2.5,
                        color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 8
                      }}>
                        CommTool · Operations
                      </div>
                      <div style={{
                        fontSize: 38, fontWeight: 600, color: '#fff', lineHeight: 1.15,
                        animation: 'fadeUp 0.7s ease both',
                      }}>
                        Daily Task<br />
                        <span style={{
                          background: 'linear-gradient(90deg, #fde68a, #fbbf24)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>Review</span>
                      </div>
                    </div>

                    {/* Live status pill */}
                    <div className="stat-pill" style={{
                      background: 'rgba(52,211,153,0.15)',
                      border: '1px solid rgba(52,211,153,0.4)',
                      borderRadius: 20, padding: '6px 14px',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 11, color: '#34d399', fontWeight: 600,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                      Live
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 420,
                    lineHeight: 1.7, marginBottom: 24,
                    animation: 'fadeUp 0.7s 0.15s ease both',
                  }}>
                    One place to assign, track, and close field tasks — with analytics that show what's moving and what's stuck.
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: 'flex', gap: 24, marginBottom: 28,
                    animation: 'fadeUp 0.7s 0.3s ease both',
                  }}>
                    {[
                      { label: 'Tasks Today', val: '142', color: '#60a5fa' },
                      { label: 'Completed',   val: '89',  color: '#34d399' },
                      { label: 'Pending',     val: '53',  color: '#fbbf24' },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature cards row */}
                  <div style={{
                    display: 'flex', gap: 14,
                    animation: 'fadeUp 0.7s 0.45s ease both',
                  }}>
                    {features.map(f => (
                      <FeatureCard key={f.title} {...f} />
                    ))}
                  </div>

                  {/* Floating task chips */}
                  <TaskChip label="Nokia BTS · Slot A2" status="done"
                    style={{ bottom: -14, left: 32, animation: 'floatY 4s 0.5s ease-in-out infinite' }} />
                  <TaskChip label="Ericsson MW · P2" status="progress"
                    style={{ bottom: -14, right: 200, animation: 'floatY 4.5s 1s ease-in-out infinite' }} />
                </div>
              </Tilt>

              {/* Bottom micro-hint */}
              <div style={{
                textAlign: 'center', marginTop: 32, fontSize: 11,
                color: 'rgba(0,0,0,0.3)', letterSpacing: 0.5,
                animation: 'fadeUp 0.7s 1.2s ease both',
              }}>
                Navigate with the sidebar · Data refreshes automatically
              </div>
            </div>
          </div>
        </div>
      </Grow>
    </Box>
  );
};

export default DailyTaskTool;