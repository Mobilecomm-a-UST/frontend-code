import React, { useMemo } from "react";
import {
    Box, Typography, Paper, IconButton, Chip, Avatar,
    LinearProgress, Drawer, alpha,
} from "@mui/material";
import CloseIcon             from "@mui/icons-material/Close";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

import { TEAL, TEAL_DARK, TEAL_LIGHT, TEAL_MID, SLOT_OPTIONS, PRIORITY_OPTIONS } from "../Constants";
import { isOverdue } from "../Helpers";

// ─── Progress Row ─────────────────────────────────────────────────────────────
const ProgressRow = ({ label, value, max, color }) => (
    <Box mb={1.5}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography fontSize={12.5} color="text.secondary">{label}</Typography>
            <Typography fontSize={12.5} fontWeight={700} color={color}>{value}</Typography>
        </Box>
        <LinearProgress
            variant="determinate"
            value={max > 0 ? (value / max) * 100 : 0}
            sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.12),
                "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
            }}
        />
    </Box>
);

// ─── Analytics Panel ──────────────────────────────────────────────────────────
const AnalyticsPanel = ({ tasks, open, onClose }) => {
    const stats = useMemo(() => {
        const total = tasks.length;
        const byStatus   = { Pending: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const byOEM  = {};
        const bySlot = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;

        tasks.forEach(t => {
            if (byStatus[t.status]   !== undefined) byStatus[t.status]++;
            if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
            if (t.oem)  byOEM[t.oem]   = (byOEM[t.oem]   || 0) + 1;
            if (t.slot) bySlot[t.slot] = (bySlot[t.slot] || 0) + 1;
        });

        const completionRate =
            total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;

        const ownerMap = {};
        tasks.forEach(t => {
            const owners = Array.isArray(t.owner)
                ? t.owner
                : t.owner ? [t.owner] : [];
            owners.forEach(o => { ownerMap[o] = (ownerMap[o] || 0) + 1; });
        });
        const topOwners = Object.entries(ownerMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return { total, byStatus, byPriority, byOEM, bySlot, completionRate, overdueCount, topOwners };
    }, [tasks]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 380, bgcolor: "#f8fafc", border: "none" } }}
        >
            {/* top gradient bar */}
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />

            {/* header */}
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #eee", bgcolor: "#fff" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography fontWeight={700} fontSize={16}>Analytics Overview</Typography>
                        <Typography fontSize={12} color="text.secondary">Live task stats</Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            bgcolor: "#f3f4f6",
                            borderRadius: "8px",
                            "&:hover": { bgcolor: "#fdecea", color: "#c62828" },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* scrollable body */}
            <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>

                {/* ── Completion Rate ── */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography
                        fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}
                        display="flex" alignItems="center" gap={0.8}
                    >
                        <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                        Completion Rate
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* circular progress SVG */}
                        <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                            <svg width="80" height="80">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
                                <circle
                                    cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
                                    strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
                                    strokeLinecap="round" transform="rotate(-90 40 40)"
                                />
                            </svg>
                            <Typography sx={{
                                position: "absolute", top: "50%", left: "50%",
                                transform: "translate(-50%,-50%)",
                                fontWeight: 800, fontSize: 16, color: TEAL,
                            }}>
                                {stats.completionRate}%
                            </Typography>
                        </Box>
                        <Box flex={1}>
                            <Typography fontSize={13} color="text.secondary" mb={0.5}>
                                {stats.byStatus.Completed} of {stats.total} done
                            </Typography>
                            {stats.overdueCount > 0 && (
                                <Chip
                                    icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
                                    label={`${stats.overdueCount} overdue`}
                                    size="small"
                                    sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }}
                                />
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* ── Status Breakdown ── */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>
                        Status Breakdown
                    </Typography>
                    <ProgressRow label="Pending"     value={stats.byStatus["Pending"]}     max={stats.total} color="#f57c00" />
                    <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
                    <ProgressRow label="Completed"   value={stats.byStatus["Completed"]}   max={stats.total} color="#1565c0" />
                    <ProgressRow label="Cancelled"   value={stats.byStatus["Cancelled"]}   max={stats.total} color="#c62828" />
                </Paper>

                {/* ── Priority Distribution ── */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>
                        Priority Distribution
                    </Typography>
                    {PRIORITY_OPTIONS.map(p => (
                        <ProgressRow
                            key={p.value}
                            label={p.value}
                            value={stats.byPriority[p.value] || 0}
                            max={stats.total}
                            color={p.color}
                        />
                    ))}
                </Paper>

                {/* ── OEM Distribution ── */}
                {Object.keys(stats.byOEM).length > 0 && (
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>
                            OEM Distribution
                        </Typography>
                        {Object.entries(stats.byOEM)
                            .sort((a, b) => b[1] - a[1])
                            .map(([oem, cnt]) => (
                                <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
                            ))}
                    </Paper>
                )}

                {/* ── Slot Distribution ── */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>
                        Slot Distribution
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {SLOT_OPTIONS.map(s => {
                            const cnt = stats.bySlot[s.value] || 0;
                            const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
                            return (
                                <Box key={s.value} sx={{
                                    flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
                                    bgcolor: alpha(s.color, 0.08),
                                    border: `1px solid ${alpha(s.color, 0.2)}`,
                                    textAlign: "center",
                                }}>
                                    <Typography fontSize={18}>{s.label.split("  ")[0]}</Typography>
                                    <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
                                    <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* ── Top Owners ── */}
                {stats.topOwners.length > 0 && (
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                        <Typography
                            fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}
                            display="flex" alignItems="center" gap={0.8}
                        >
                            <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Top Owners
                        </Typography>
                        {stats.topOwners.map(([name, cnt]) => (
                            <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
                                <Avatar sx={{
                                    width: 30, height: 30, fontSize: 11, fontWeight: 700,
                                    bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK,
                                }}>
                                    {(name[0] || "?").toUpperCase()}
                                </Avatar>
                                <Box flex={1} minWidth={0}>
                                    <Box display="flex" justifyContent="space-between" mb={0.3}>
                                        <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
                                        <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(cnt / (stats.topOwners[0]?.[1] || 1)) * 100}
                                        sx={{
                                            height: 4, borderRadius: 2,
                                            bgcolor: TEAL_LIGHT,
                                            "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 },
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                )}

            </Box>
        </Drawer>
    );
};

export default AnalyticsPanel;