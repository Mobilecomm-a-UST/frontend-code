import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
    Box, Typography, Paper, Button, Chip, IconButton, Tooltip, Avatar,
    LinearProgress, ToggleButton, ToggleButtonGroup, alpha, Skeleton,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";
import Swal from "sweetalert2";
import {
    Chart as ChartJS,
    ArcElement, Tooltip as ChartTooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Filler,
} from "chart.js";
import { Doughnut, Bar, Line, PolarArea } from "react-chartjs-2";

ChartJS.register(
    ArcElement, ChartTooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Filler
);

// ─── theme ─────────────────────────────────────────────────────────────────
const TEAL = "#228b7f";
const TEAL_DARK = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

const BASE_URL = "https://commtoolapi.mcpspmis.com/";

const API = {
    GET_ASSIGNED_TASKS: "dailytask_review/assign_task/get/",
    GET_MY_TASKS: "dailytask_review/mytask/get/",
};

// ─── colors ────────────────────────────────────────────────────────────────
const STATUS_COLORS = { Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" };
const PRIO_COLORS = { Critical: "#c62828", High: "#e65100", Medium: "#f57c00", Low: "#2e7d32" };
const SLOT_COLORS = { Morning: "#f9a825", Afternoon: "#d85a30", Evening: "#5c6bc0", Night: "#37474f" };
const OEM_PALETTE = ["#228b7f", "#1565c0", "#e65100", "#c62828", "#7c3aed", "#2e7d32"];

// ─── helpers ───────────────────────────────────────────────────────────────
const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { start: fmt(mon), end: fmt(sun) };
};

const getMonthRange = () => {
    const now = new Date();
    const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const end = todayStr();
    return { start, end };
};

const getYearRange = () => {
    const now = new Date();
    return { start: `${now.getFullYear()}-01-01`, end: todayStr() };
};

const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const isOverdue = (iso, status) =>
    iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

const getFrequency = (row) => row.frequency ?? row.reminder_frequency ?? "None";

// ─── Metric Card ────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, icon, color, bg, pct, loading }) => (
    <Paper elevation={0} sx={{
        p: 2, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff",
        position: "relative", overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
    }}>
        <Box sx={{ position: "absolute", top: -12, right: -12, width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(color, 0.06) }} />
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography fontSize={11.5} fontWeight={500} color="text.secondary" letterSpacing=".02em">{label}</Typography>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: bg || alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
            </Box>
        </Box>
        {loading
            ? <Skeleton width={50} height={30} />
            : <Typography fontSize={28} fontWeight={800} color="#1a1a2e" lineHeight={1}>{value}</Typography>
        }
        {pct !== undefined && (
            <Box mt={1}>
                <LinearProgress variant="determinate" value={Math.min(pct, 100)}
                    sx={{ height: 3, borderRadius: 2, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 2 } }} />
            </Box>
        )}
    </Paper>
);

// ─── Section Header ─────────────────────────────────────────────────────────
const SectionTitle = ({ icon, title }) => (
    <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
        {React.cloneElement(icon, { sx: { fontSize: 16, color: TEAL } })}
        <Typography fontSize={13} fontWeight={700} color="#1a1a2e">{title}</Typography>
    </Box>
);

// ─── Progress Row ────────────────────────────────────────────────────────────
const ProgressRow = ({ label, value, max, color, showPct = true }) => (
    <Box mb={1.2}>
        <Box display="flex" justifyContent="space-between" mb={0.4}>
            <Typography fontSize={12} color="text.secondary">{label}</Typography>
            <Typography fontSize={12} fontWeight={700} color={color}>
                {value}{showPct && max > 0 ? ` (${Math.round(value / max * 100)}%)` : ""}
            </Typography>
        </Box>
        <LinearProgress variant="determinate" value={max > 0 ? Math.min((value / max) * 100, 100) : 0}
            sx={{ height: 5, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
    </Box>
);

// ─── Donut Center Plugin ─────────────────────────────────────────────────────
const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
        if (chart.config.type !== "doughnut") return;
        const { width, height, ctx } = chart;
        const total = chart.data.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1a1a2e";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(total, width / 2, height / 2 - 8);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#888";
        ctx.fillText("total", width / 2, height / 2 + 12);
        ctx.restore();
    },
};
ChartJS.register(centerTextPlugin);

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════
const processData = (taskList) => {
    const result = {
        total: taskList.length,
        byStatus: { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 },
        byPriority: { Critical: 0, High: 0, Medium: 0, Low: 0 },
        byOEM: {},
        bySlot: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 },
        byUser: {},
        overdue: 0,
        completionRate: 0,
    };

    taskList.forEach((t) => {
        if (result.byStatus[t.status] !== undefined) result.byStatus[t.status]++;
        if (result.byPriority[t.priority] !== undefined) result.byPriority[t.priority]++;
        if (t.oem) result.byOEM[t.oem] = (result.byOEM[t.oem] || 0) + 1;
        const slot = t.slot ? t.slot.charAt(0).toUpperCase() + t.slot.slice(1).toLowerCase() : "";
        if (result.bySlot[slot] !== undefined) result.bySlot[slot]++;
        const owners = Array.isArray(t.owner) ? t.owner : (t.owner ? [t.owner] : []);
        owners.forEach((o) => { result.byUser[o] = (result.byUser[o] || 0) + 1; });
        if (isOverdue(t.deadline, t.status)) result.overdue++;
    });

    result.completionRate = result.total > 0
        ? Math.round((result.byStatus.Completed / result.total) * 100)
        : 0;

    return result;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
    const navigate = useNavigate();

    const userEmail = useMemo(() => {
        const val = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail") || "";
        return val;
    }, []);

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [viewMode, setViewMode] = useState("assigned"); // "assigned" | "my" | "overall"
    const [period, setPeriod] = useState("day"); // "day" | "week" | "month" | "year"

    // ── Date range from period ──────────────────────────────────────────────
    const dateRange = useMemo(() => {
        if (period === "day") return { start: todayStr(), end: todayStr() };
        if (period === "week") return getWeekRange();
        if (period === "month") return getMonthRange();
        return getYearRange();
    }, [period]);

    // ── Fetch both datasets ─────────────────────────────────────────────────
    const fetchAll = useCallback(async (isRefresh = false) => {
        if (!userEmail) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const [assignRes, myRes] = await Promise.allSettled([
                fetch(`${BASE_URL}${API.GET_ASSIGNED_TASKS}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ assigned_by: userEmail, assigned_at: dateRange.start }),
                }),
                fetch(`${BASE_URL}${API.GET_MY_TASKS}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ owner: userEmail, assigned_at: dateRange.start }),
                }),
            ]);

            const parseList = (result) => {
                if (result.status !== "fulfilled") return [];
                return result.value.json().then((data) => {
                    if (Array.isArray(data)) return data;
                    if (Array.isArray(data?.data)) return data.data;
                    if (Array.isArray(data?.results)) return data.results;
                    if (Array.isArray(data?.tasks)) return data.tasks;
                    return [];
                }).catch(() => []);
            };

            const [assigned, my] = await Promise.all([parseList(assignRes), parseList(myRes)]);
            setAssignedTasks(assigned);
            setMyTasks(my);
        } catch (err) {
            console.error("Dashboard fetchAll:", err);
            Swal.fire("Error", "Failed to load dashboard data.", "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userEmail, dateRange.start]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Active dataset ──────────────────────────────────────────────────────
    const activeTasks = useMemo(() => {
        if (viewMode === "assigned") return assignedTasks;
        if (viewMode === "my") return myTasks;
        // overall: merge unique by id, or just concat
        const combined = [...assignedTasks, ...myTasks];
        const seen = new Set();
        return combined.filter((t) => {
            if (seen.has(t.id)) return false;
            seen.add(t.id);
            return true;
        });
    }, [viewMode, assignedTasks, myTasks]);

    const stats = useMemo(() => processData(activeTasks), [activeTasks]);

    // ── Chart data ──────────────────────────────────────────────────────────
    const donutData = useMemo(() => ({
        labels: ["Active", "In Progress", "Completed", "Cancelled"],
        datasets: [{
            data: [stats.byStatus.Active, stats.byStatus["In Progress"], stats.byStatus.Completed, stats.byStatus.Cancelled],
            backgroundColor: [STATUS_COLORS.Active, STATUS_COLORS["In Progress"], STATUS_COLORS.Completed, STATUS_COLORS.Cancelled],
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 6,
        }],
    }), [stats]);

    const prioData = useMemo(() => ({
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [{
            data: [stats.byPriority.Critical, stats.byPriority.High, stats.byPriority.Medium, stats.byPriority.Low],
            backgroundColor: [PRIO_COLORS.Critical, PRIO_COLORS.High, PRIO_COLORS.Medium, PRIO_COLORS.Low],
            borderRadius: 6,
            borderWidth: 0,
        }],
    }), [stats]);

    const oemEntries = useMemo(() =>
        Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]), [stats]);

    const oemBarData = useMemo(() => ({
        labels: oemEntries.map((e) => e[0]),
        datasets: [{
            data: oemEntries.map((e) => e[1]),
            backgroundColor: oemEntries.map((_, i) => OEM_PALETTE[i % OEM_PALETTE.length] + "cc"),
            borderRadius: 5,
            borderWidth: 0,
        }],
    }), [oemEntries]);

    const slotData = useMemo(() => ({
        labels: ["Morning", "Afternoon", "Evening", "Night"],
        datasets: [{
            data: [stats.bySlot.Morning, stats.bySlot.Afternoon, stats.bySlot.Evening, stats.bySlot.Night],
            backgroundColor: [
                SLOT_COLORS.Morning + "cc", SLOT_COLORS.Afternoon + "cc",
                SLOT_COLORS.Evening + "cc", SLOT_COLORS.Night + "cc",
            ],
            borderColor: [SLOT_COLORS.Morning, SLOT_COLORS.Afternoon, SLOT_COLORS.Evening, SLOT_COLORS.Night],
            borderWidth: 1.5,
        }],
    }), [stats]);

    const topUsers = useMemo(() =>
        Object.entries(stats.byUser).sort((a, b) => b[1] - a[1]).slice(0, 6), [stats]);

    const donutOpts = {
        responsive: true, maintainAspectRatio: false,
        cutout: "65%",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } } },
    };

    const barOpts = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } },
    };

    const hBarOpts = {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } },
    };

    const polarOpts = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { ticks: { display: false }, grid: { color: "rgba(0,0,0,0.06)" } } },
    };

    const periodLabel = { day: "Today", week: "This week", month: "This month", year: "This year" }[period];

    return (
        <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

            {/* Breadcrumb */}
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Dashboard</Typography>
                </Breadcrumbs>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

                {/* ── Header ── */}
                <Box sx={{
                    px: 3, pt: 3, pb: 2.5,
                    borderBottom: "1px solid #f0f2f5",
                    background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
                }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{
                                width: 48, height: 48, borderRadius: "13px",
                                background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: `0 4px 14px ${alpha(TEAL, 0.35)}`, flexShrink: 0,
                            }}>
                                <BarChartOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
                                    Daily Task Review
                                </Typography>
                                <Typography fontSize={13} color="text.secondary" mt={0.2}>
                                    Analytics dashboard · {periodLabel}
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">

                            {/* Period Toggle */}
                            <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small"
                                sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5, fontSize: 12.5, fontWeight: 600, color: "#6b7280", "&.Mui-selected": { bgcolor: TEAL, color: "#fff" } } }}>
                                {["day", "week", "month", "year"].map((p) => (
                                    <ToggleButton key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            {/* View Toggle */}
                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                                sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5, fontSize: 12.5, fontWeight: 600, color: "#6b7280", "&.Mui-selected": { bgcolor: "#1a1a2e", color: "#fff" } } }}>
                                <ToggleButton value="assigned"><AssignmentTurnedInOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Assigned</ToggleButton>
                                <ToggleButton value="my"><TaskAltOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />My Tasks</ToggleButton>
                                <ToggleButton value="overall"><BarChartOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Overall</ToggleButton>
                            </ToggleButtonGroup>

                            {/* Refresh */}
                            <Button variant="outlined"
                                startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
                                onClick={() => fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                {refreshing ? "…" : "Refresh"}
                            </Button>
                        </Box>
                    </Box>

                    {userEmail && (
                        <Box mt={1.5} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography fontSize={12} color="text.secondary">User:</Typography>
                            <Chip label={userEmail} size="small" sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                            <Typography fontSize={12} color="text.secondary">·</Typography>
                            <Chip
                                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "12px !important" }} />}
                                label={`${fmtDate(dateRange.start)}${dateRange.start !== dateRange.end ? ` – ${fmtDate(dateRange.end)}` : ""}`}
                                size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }}
                            />
                            <Chip
                                label={viewMode === "assigned" ? "Assigned Tasks" : viewMode === "my" ? "My Tasks" : "Overall"}
                                size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: "#1a1a2e", color: "#fff" }}
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ p: 3 }}>

                    {/* ── Metric Cards ── */}
                    <Box display="grid" sx={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1.5, mb: 3 }}>
                        <MetricCard label="Total Tasks" value={loading ? "—" : stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} pct={100} loading={loading} />
                        <MetricCard label="Active" value={loading ? "—" : stats.byStatus.Active} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0" pct={stats.total > 0 ? Math.round(stats.byStatus.Active / stats.total * 100) : 0} loading={loading} />
                        <MetricCard label="In Progress" value={loading ? "—" : stats.byStatus["In Progress"]} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9" pct={stats.total > 0 ? Math.round(stats.byStatus["In Progress"] / stats.total * 100) : 0} loading={loading} />
                        <MetricCard label="Completed" value={loading ? "—" : stats.byStatus.Completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd" pct={stats.total > 0 ? Math.round(stats.byStatus.Completed / stats.total * 100) : 0} loading={loading} />
                        <MetricCard label="Cancelled" value={loading ? "—" : stats.byStatus.Cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea" pct={stats.total > 0 ? Math.round(stats.byStatus.Cancelled / stats.total * 100) : 0} loading={loading} />
                        <MetricCard label="Overdue" value={loading ? "—" : stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" pct={stats.total > 0 ? Math.round(stats.overdue / stats.total * 100) : 0} loading={loading} />
                        <MetricCard label="Completion %" value={loading ? "—" : `${stats.completionRate}%`} icon={<TrendingUpOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} pct={stats.completionRate} loading={loading} />
                    </Box>

                    {/* ── Row 1: Donut + Priority Bar ── */}
                    <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

                        {/* Status Donut */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<BarChartOutlinedIcon />} title="Task status breakdown" />
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
                                {Object.entries(STATUS_COLORS).map(([s, c]) => (
                                    <Box key={s} display="flex" alignItems="center" gap={0.5}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: c }} />
                                        <Typography fontSize={11} color="text.secondary">{s} ({stats.byStatus[s] || 0})</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ height: 220, position: "relative" }}>
                                {loading
                                    ? <Skeleton variant="circular" width={220} height={220} sx={{ mx: "auto" }} />
                                    : <Doughnut data={donutData} options={donutOpts} />
                                }
                            </Box>
                        </Paper>

                        {/* Priority Bar */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<FlagOutlinedIcon />} title="Priority distribution" />
                            <Box sx={{ height: 200, position: "relative", mb: 1 }}>
                                {loading
                                    ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                                    : <Bar data={prioData} options={barOpts} />
                                }
                            </Box>
                            <Box display="flex" gap={1.5} flexWrap="wrap">
                                {Object.entries(PRIO_COLORS).map(([p, c]) => (
                                    <Box key={p} sx={{ flex: 1, minWidth: 60, p: 1, borderRadius: "8px", bgcolor: alpha(c, 0.08), textAlign: "center", border: `1px solid ${alpha(c, 0.2)}` }}>
                                        <Typography fontSize={16} fontWeight={800} color={c}>{stats.byPriority[p] || 0}</Typography>
                                        <Typography fontSize={10} color="text.secondary">{p}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    {/* ── Row 2: OEM bar + Slot polar ── */}
                    <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

                        {/* OEM Horizontal Bar */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<RouterOutlinedIcon />} title="Tasks by OEM" />
                            {loading
                                ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                                : oemEntries.length === 0
                                    ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
                                    : (
                                        <Box sx={{ height: Math.max(180, oemEntries.length * 44 + 20), position: "relative" }}>
                                            <Bar data={oemBarData} options={hBarOpts} />
                                        </Box>
                                    )
                            }
                        </Paper>

                        {/* Slot Polar */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<WbSunnyOutlinedIcon />} title="Slot distribution" />
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                {Object.entries(SLOT_COLORS).map(([s, c]) => (
                                    <Box key={s} display="flex" alignItems="center" gap={0.5}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
                                        <Typography fontSize={11} color="text.secondary">{s} ({stats.bySlot[s] || 0})</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ height: 200, position: "relative" }}>
                                {loading
                                    ? <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto" }} />
                                    : <PolarArea data={slotData} options={polarOpts} />
                                }
                            </Box>
                        </Paper>
                    </Box>

                    {/* ── Row 3: User workload + Completion rate ── */}
                    <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2 }}>

                        {/* User Workload */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<PersonOutlineIcon />} title="User workload" />
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 1, borderRadius: 2 }} />)
                                : topUsers.length === 0
                                    ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
                                    : topUsers.map(([name, cnt], i) => {
                                        const initials = name.split(/[@.]/)[0].slice(0, 2).toUpperCase();
                                        const maxCnt = topUsers[0]?.[1] || 1;
                                        return (
                                            <Box key={name} display="flex" alignItems="center" gap={1.2} mb={1.2}>
                                                <Avatar sx={{ width: 30, height: 30, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
                                                    {initials}
                                                </Avatar>
                                                <Box flex={1} minWidth={0}>
                                                    <Box display="flex" justifyContent="space-between" mb={0.3}>
                                                        <Tooltip title={name} arrow>
                                                            <Typography fontSize={12} fontWeight={600} noWrap sx={{ maxWidth: 160 }}>{name}</Typography>
                                                        </Tooltip>
                                                        <Typography fontSize={11.5} color="text.secondary">{cnt} tasks</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={Math.round(cnt / maxCnt * 100)}
                                                        sx={{ height: 5, borderRadius: 3, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: OEM_PALETTE[i % OEM_PALETTE.length], borderRadius: 3 } }} />
                                                </Box>
                                            </Box>
                                        );
                                    })
                            }
                        </Paper>

                        {/* Completion rate card */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
                            <SectionTitle icon={<TrendingUpOutlinedIcon />} title="Completion summary" />

                            {/* Donut-style completion rate */}
                            <Box display="flex" alignItems="center" gap={3} mb={2.5}>
                                <Box sx={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                                    <svg width="90" height="90">
                                        <circle cx="45" cy="45" r="36" fill="none" stroke="#e8ecf0" strokeWidth="9" />
                                        <circle cx="45" cy="45" r="36" fill="none" stroke={TEAL} strokeWidth="9"
                                            strokeDasharray={`${(stats.completionRate / 100) * 226} 226`}
                                            strokeLinecap="round" transform="rotate(-90 45 45)" />
                                    </svg>
                                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                                        <Typography fontWeight={800} fontSize={18} color={TEAL} lineHeight={1}>{stats.completionRate}%</Typography>
                                        <Typography fontSize={9} color="text.secondary">done</Typography>
                                    </Box>
                                </Box>
                                <Box flex={1}>
                                    <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} tasks completed</Typography>
                                    {stats.overdue > 0 && (
                                        <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
                                            label={`${stats.overdue} overdue`} size="small"
                                            sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ borderTop: "1px solid #f0f2f5", pt: 1.5 }}>
                                <ProgressRow label="Active" value={stats.byStatus.Active} max={stats.total} color="#f57c00" />
                                <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
                                <ProgressRow label="Completed" value={stats.byStatus.Completed} max={stats.total} color="#1565c0" />
                                <ProgressRow label="Cancelled" value={stats.byStatus.Cancelled} max={stats.total} color="#c62828" />
                            </Box>
                        </Paper>
                    </Box>

                </Box>

                {/* Footer */}
                <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.disabled">
                        Daily Task Review · Analytics Dashboard
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        {stats.total} total tasks · {periodLabel}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Dashboard;