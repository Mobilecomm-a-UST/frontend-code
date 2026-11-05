import React, { useMemo } from 'react';
import { Box, Typography, GlobalStyles } from '@mui/material';

const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const SPARKLE_COLORS = ['#FFD700', '#FF7043', '#FFF3B0', '#FFB300'];

const KEYFRAMES = `
  @keyframes dcFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes dcPop {
    0%   { transform: scale(0.6); opacity: 0; }
    60%  { transform: scale(1.04); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes dcFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes dcGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(255,193,7,0.35), 0 30px 80px rgba(0,0,0,0.5); }
    50%      { box-shadow: 0 0 80px rgba(255,112,67,0.6), 0 30px 80px rgba(0,0,0,0.5); }
  }
  @keyframes dcShine { to { background-position: 200% center; } }
  @keyframes dcRise {
    0%   { transform: translateY(0) scale(0.6); opacity: 0; }
    15%  { opacity: 1; }
    100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
  }
  @keyframes dcBurst {
    0%   { transform: rotate(var(--a)) translateY(0) scale(0.2); opacity: 0; }
    10%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: rotate(var(--a)) translateY(-120px) scale(1); opacity: 0; }
  }
`;

export default function DiwaliCelebration({ open, onClose, name }) {
    const sparkles = useMemo(
        () => Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: 5 + Math.random() * 9,
            delay: Math.random() * 4,
            duration: 4 + Math.random() * 4,
            color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
        })),
        []
    );

    const bursts = useMemo(() => [
        { left: '12%', top: '24%', delay: 0,   color: '#FFD54F' },
        { left: '84%', top: '20%', delay: 0.7, color: '#FF8A65' },
        { left: '18%', top: '74%', delay: 1.3, color: '#FFF176' },
        { left: '82%', top: '72%', delay: 1.9, color: '#FFAB40' },
    ], []);

    if (!open) return null;

    return (
        <Box
            onClick={onClose}
            sx={{
                position: 'fixed', inset: 0, zIndex: 2000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 40%, #3B1D08 0%, #1A0F07 45%, #05030A 100%)',
                animation: 'dcFade .4s ease-out',
                overflow: 'hidden', cursor: 'pointer',
            }}
        >
            <GlobalStyles styles={KEYFRAMES} />

            {/* Rising sparkles */}
            {sparkles.map((s) => (
                <Box
                    key={s.id}
                    sx={{
                        position: 'absolute', bottom: -40, left: `${s.left}%`,
                        width: s.size, height: s.size, borderRadius: '50%',
                        bgcolor: s.color, boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                        opacity: 0,
                        animation: `dcRise ${s.duration}s linear ${s.delay}s infinite`,
                    }}
                />
            ))}

            {/* Firework bursts */}
            {bursts.map((b, i) => (
                <Box key={i} sx={{ position: 'absolute', left: b.left, top: b.top, width: 0, height: 0 }}>
                    {BURST_ANGLES.map((a) => (
                        <Box
                            key={a}
                            style={{ '--a': `${a}deg` }}
                            sx={{
                                position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                                bgcolor: b.color, boxShadow: `0 0 12px ${b.color}`,
                                animation: `dcBurst 2.4s ease-out ${b.delay}s infinite`,
                            }}
                        />
                    ))}
                </Box>
            ))}

            {/* Glass card */}
            <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                    position: 'relative', textAlign: 'center', maxWidth: 620, mx: 2,
                    px: { xs: 3, md: 6 }, py: { xs: 4, md: 5 }, borderRadius: 6,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
                    border: '1px solid rgba(255,215,0,0.35)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                    animation: 'dcPop .8s cubic-bezier(.2,.9,.3,1.2), dcGlow 3s ease-in-out infinite',
                }}
            >
                <Typography
                    sx={{
                        fontSize: 76, lineHeight: 1,
                        animation: 'dcFloat 3s ease-in-out infinite',
                        filter: 'drop-shadow(0 10px 20px rgba(255,140,0,0.6))',
                    }}
                >
                    🪔
                </Typography>

                <Typography
                    sx={{
                        mt: 2, fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                        fontSize: { xs: 40, md: 60 }, lineHeight: 1.1, letterSpacing: '-1px',
                        background: 'linear-gradient(90deg, #FFD700, #FFF3B0, #FF8A3D, #FFD700)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'dcShine 3s linear infinite',
                    }}
                >
                    Happy Diwali
                </Typography>

                <Typography sx={{ mt: 2, color: '#FFE9B3', fontWeight: 600, fontSize: { xs: 15, md: 17 } }}>
                    Dear {name || 'friend'},
                </Typography>

                <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.88)', fontSize: { xs: 14, md: 16 }, lineHeight: 1.8 }}>
                    May the festival of lights fill your life with happiness, prosperity and success.
                    Wishing you and your team a bright, peaceful and joyful Diwali! ✨
                </Typography>

                <Typography sx={{ mt: 3, fontSize: 26, letterSpacing: 6 }}>
                    🪔 ✨ 🎆 ✨ 🪔
                </Typography>

                <Typography sx={{ mt: 2, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    Tap anywhere to continue
                </Typography>
            </Box>
        </Box>
    );
}