// import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import {
//     Box, Typography, Paper, Button, Chip, IconButton, Tooltip, Avatar,
//     LinearProgress, ToggleButton, ToggleButtonGroup, alpha, Skeleton,
// } from "@mui/material";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
// import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import { useNavigate } from "react-router-dom";
// import { getDecreyptedData } from "../../../utils/localstorage";
// import Swal from "sweetalert2";
// import {
//     Chart as ChartJS,
//     ArcElement, Tooltip as ChartTooltip, Legend,
//     CategoryScale, LinearScale, BarElement, PointElement, LineElement,
//     RadialLinearScale, Filler,
// } from "chart.js";
// import { Doughnut, Bar, Line, PolarArea } from "react-chartjs-2";

// ChartJS.register(
//     ArcElement, ChartTooltip, Legend,
//     CategoryScale, LinearScale, BarElement, PointElement, LineElement,
//     RadialLinearScale, Filler
// );

// // ─── theme ─────────────────────────────────────────────────────────────────
// const TEAL = "#228b7f";
// const TEAL_DARK = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// const BASE_URL = "https://commtoolapi.mcpspmis.com/";

// const API = {
//     GET_ASSIGNED_TASKS: "dailytask_review/assign_task/get/",
//     GET_MY_TASKS: "dailytask_review/mytask/get/",
// };

// // ─── colors ────────────────────────────────────────────────────────────────
// const STATUS_COLORS = { Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" };
// const PRIO_COLORS = { Critical: "#c62828", High: "#e65100", Medium: "#f57c00", Low: "#2e7d32" };
// const SLOT_COLORS = { Morning: "#f9a825", Afternoon: "#d85a30", Evening: "#5c6bc0", Night: "#37474f" };
// const OEM_PALETTE = ["#228b7f", "#1565c0", "#e65100", "#c62828", "#7c3aed", "#2e7d32"];

// // ─── helpers ───────────────────────────────────────────────────────────────
// const todayStr = () => {
//     const d = new Date();
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// const getWeekRange = () => {
//     const now = new Date();
//     const day = now.getDay();
//     const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
//     const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
//     const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//     return { start: fmt(mon), end: fmt(sun) };
// };

// const getMonthRange = () => {
//     const now = new Date();
//     const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
//     const end = todayStr();
//     return { start, end };
// };

// const getYearRange = () => {
//     const now = new Date();
//     return { start: `${now.getFullYear()}-01-01`, end: todayStr() };
// };

// const fmtDate = (iso) =>
//     iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// const isOverdue = (iso, status) =>
//     iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

// const getFrequency = (row) => row.frequency ?? row.reminder_frequency ?? "None";

// // ─── Metric Card ────────────────────────────────────────────────────────────
// const MetricCard = ({ label, value, icon, color, bg, pct, loading }) => (
//     <Paper elevation={0} sx={{
//         p: 2, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff",
//         position: "relative", overflow: "hidden",
//         boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
//     }}>
//         <Box sx={{ position: "absolute", top: -12, right: -12, width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(color, 0.06) }} />
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
//             <Typography fontSize={11.5} fontWeight={500} color="text.secondary" letterSpacing=".02em">{label}</Typography>
//             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: bg || alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
//             </Box>
//         </Box>
//         {loading
//             ? <Skeleton width={50} height={30} />
//             : <Typography fontSize={28} fontWeight={800} color="#1a1a2e" lineHeight={1}>{value}</Typography>
//         }
//         {pct !== undefined && (
//             <Box mt={1}>
//                 <LinearProgress variant="determinate" value={Math.min(pct, 100)}
//                     sx={{ height: 3, borderRadius: 2, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 2 } }} />
//             </Box>
//         )}
//     </Paper>
// );

// // ─── Section Header ─────────────────────────────────────────────────────────
// const SectionTitle = ({ icon, title }) => (
//     <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
//         {React.cloneElement(icon, { sx: { fontSize: 16, color: TEAL } })}
//         <Typography fontSize={13} fontWeight={700} color="#1a1a2e">{title}</Typography>
//     </Box>
// );

// // ─── Progress Row ────────────────────────────────────────────────────────────
// const ProgressRow = ({ label, value, max, color, showPct = true }) => (
//     <Box mb={1.2}>
//         <Box display="flex" justifyContent="space-between" mb={0.4}>
//             <Typography fontSize={12} color="text.secondary">{label}</Typography>
//             <Typography fontSize={12} fontWeight={700} color={color}>
//                 {value}{showPct && max > 0 ? ` (${Math.round(value / max * 100)}%)` : ""}
//             </Typography>
//         </Box>
//         <LinearProgress variant="determinate" value={max > 0 ? Math.min((value / max) * 100, 100) : 0}
//             sx={{ height: 5, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
//     </Box>
// );

// // ─── Donut Center Plugin ─────────────────────────────────────────────────────
// const centerTextPlugin = {
//     id: "centerText",
//     afterDraw(chart) {
//         if (chart.config.type !== "doughnut") return;
//         const { width, height, ctx } = chart;
//         const total = chart.data.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
//         ctx.save();
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillStyle = "#1a1a2e";
//         ctx.font = "bold 22px sans-serif";
//         ctx.fillText(total, width / 2, height / 2 - 8);
//         ctx.font = "12px sans-serif";
//         ctx.fillStyle = "#888";
//         ctx.fillText("total", width / 2, height / 2 + 12);
//         ctx.restore();
//     },
// };
// ChartJS.register(centerTextPlugin);

// // ═══════════════════════════════════════════════════════════════════════════
// // ANALYTICS PROCESSOR
// // ═══════════════════════════════════════════════════════════════════════════
// const processData = (taskList) => {
//     const result = {
//         total: taskList.length,
//         byStatus: { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 },
//         byPriority: { Critical: 0, High: 0, Medium: 0, Low: 0 },
//         byOEM: {},
//         bySlot: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 },
//         byUser: {},
//         overdue: 0,
//         completionRate: 0,
//     };

//     taskList.forEach((t) => {
//         if (result.byStatus[t.status] !== undefined) result.byStatus[t.status]++;
//         if (result.byPriority[t.priority] !== undefined) result.byPriority[t.priority]++;
//         if (t.oem) result.byOEM[t.oem] = (result.byOEM[t.oem] || 0) + 1;
//         const slot = t.slot ? t.slot.charAt(0).toUpperCase() + t.slot.slice(1).toLowerCase() : "";
//         if (result.bySlot[slot] !== undefined) result.bySlot[slot]++;
//         const owners = Array.isArray(t.owner) ? t.owner : (t.owner ? [t.owner] : []);
//         owners.forEach((o) => { result.byUser[o] = (result.byUser[o] || 0) + 1; });
//         if (isOverdue(t.deadline, t.status)) result.overdue++;
//     });

//     result.completionRate = result.total > 0
//         ? Math.round((result.byStatus.Completed / result.total) * 100)
//         : 0;

//     return result;
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════
// const Dashboard = () => {
//     const navigate = useNavigate();

//     const userEmail = useMemo(() => {
//         const val = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail") || "";
//         return val;
//     }, []);

//     const [assignedTasks, setAssignedTasks] = useState([]);
//     const [myTasks, setMyTasks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const [viewMode, setViewMode] = useState("assigned"); // "assigned" | "my" | "overall"
//     const [period, setPeriod] = useState("day"); // "day" | "week" | "month" | "year"

//     // ── Date range from period ──────────────────────────────────────────────
//     const dateRange = useMemo(() => {
//         if (period === "day") return { start: todayStr(), end: todayStr() };
//         if (period === "week") return getWeekRange();
//         if (period === "month") return getMonthRange();
//         return getYearRange();
//     }, [period]);

//     // ── Fetch both datasets ─────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         if (!userEmail) return;
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const [assignRes, myRes] = await Promise.allSettled([
//                 fetch(`${BASE_URL}${API.GET_ASSIGNED_TASKS}`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ assigned_by: userEmail, assigned_at: dateRange.start }),
//                 }),
//                 fetch(`${BASE_URL}${API.GET_MY_TASKS}`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ owner: userEmail, assigned_at: dateRange.start }),
//                 }),
//             ]);

//             const parseList = (result) => {
//                 if (result.status !== "fulfilled") return [];
//                 return result.value.json().then((data) => {
//                     if (Array.isArray(data)) return data;
//                     if (Array.isArray(data?.data)) return data.data;
//                     if (Array.isArray(data?.results)) return data.results;
//                     if (Array.isArray(data?.tasks)) return data.tasks;
//                     return [];
//                 }).catch(() => []);
//             };

//             const [assigned, my] = await Promise.all([parseList(assignRes), parseList(myRes)]);
//             setAssignedTasks(assigned);
//             setMyTasks(my);
//         } catch (err) {
//             console.error("Dashboard fetchAll:", err);
//             Swal.fire("Error", "Failed to load dashboard data.", "error");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [userEmail, dateRange.start]);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // ── Active dataset ──────────────────────────────────────────────────────
//     const activeTasks = useMemo(() => {
//         if (viewMode === "assigned") return assignedTasks;
//         if (viewMode === "my") return myTasks;
//         // overall: merge unique by id, or just concat
//         const combined = [...assignedTasks, ...myTasks];
//         const seen = new Set();
//         return combined.filter((t) => {
//             if (seen.has(t.id)) return false;
//             seen.add(t.id);
//             return true;
//         });
//     }, [viewMode, assignedTasks, myTasks]);

//     const stats = useMemo(() => processData(activeTasks), [activeTasks]);

//     // ── Chart data ──────────────────────────────────────────────────────────
//     const donutData = useMemo(() => ({
//         labels: ["Active", "In Progress", "Completed", "Cancelled"],
//         datasets: [{
//             data: [stats.byStatus.Active, stats.byStatus["In Progress"], stats.byStatus.Completed, stats.byStatus.Cancelled],
//             backgroundColor: [STATUS_COLORS.Active, STATUS_COLORS["In Progress"], STATUS_COLORS.Completed, STATUS_COLORS.Cancelled],
//             borderWidth: 2,
//             borderColor: "#fff",
//             hoverOffset: 6,
//         }],
//     }), [stats]);

//     const prioData = useMemo(() => ({
//         labels: ["Critical", "High", "Medium", "Low"],
//         datasets: [{
//             data: [stats.byPriority.Critical, stats.byPriority.High, stats.byPriority.Medium, stats.byPriority.Low],
//             backgroundColor: [PRIO_COLORS.Critical, PRIO_COLORS.High, PRIO_COLORS.Medium, PRIO_COLORS.Low],
//             borderRadius: 6,
//             borderWidth: 0,
//         }],
//     }), [stats]);

//     const oemEntries = useMemo(() =>
//         Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]), [stats]);

//     const oemBarData = useMemo(() => ({
//         labels: oemEntries.map((e) => e[0]),
//         datasets: [{
//             data: oemEntries.map((e) => e[1]),
//             backgroundColor: oemEntries.map((_, i) => OEM_PALETTE[i % OEM_PALETTE.length] + "cc"),
//             borderRadius: 5,
//             borderWidth: 0,
//         }],
//     }), [oemEntries]);

//     const slotData = useMemo(() => ({
//         labels: ["Morning", "Afternoon", "Evening", "Night"],
//         datasets: [{
//             data: [stats.bySlot.Morning, stats.bySlot.Afternoon, stats.bySlot.Evening, stats.bySlot.Night],
//             backgroundColor: [
//                 SLOT_COLORS.Morning + "cc", SLOT_COLORS.Afternoon + "cc",
//                 SLOT_COLORS.Evening + "cc", SLOT_COLORS.Night + "cc",
//             ],
//             borderColor: [SLOT_COLORS.Morning, SLOT_COLORS.Afternoon, SLOT_COLORS.Evening, SLOT_COLORS.Night],
//             borderWidth: 1.5,
//         }],
//     }), [stats]);

//     const topUsers = useMemo(() =>
//         Object.entries(stats.byUser).sort((a, b) => b[1] - a[1]).slice(0, 6), [stats]);

//     const donutOpts = {
//         responsive: true, maintainAspectRatio: false,
//         cutout: "65%",
//         plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } } },
//     };

//     const barOpts = {
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { display: false } },
//         scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } },
//     };

//     const hBarOpts = {
//         indexAxis: "y",
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { display: false } },
//         scales: { x: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } },
//     };

//     const polarOpts = {
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { display: false } },
//         scales: { r: { ticks: { display: false }, grid: { color: "rgba(0,0,0,0.06)" } } },
//     };

//     const periodLabel = { day: "Today", week: "This week", month: "This month", year: "This year" }[period];

//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//             {/* Breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Dashboard</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

//                 {/* ── Header ── */}
//                 <Box sx={{
//                     px: 3, pt: 3, pb: 2.5,
//                     borderBottom: "1px solid #f0f2f5",
//                     background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
//                 }}>
//                     <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{
//                                 width: 48, height: 48, borderRadius: "13px",
//                                 background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`,
//                                 display: "flex", alignItems: "center", justifyContent: "center",
//                                 boxShadow: `0 4px 14px ${alpha(TEAL, 0.35)}`, flexShrink: 0,
//                             }}>
//                                 <BarChartOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
//                                     Daily Task Review
//                                 </Typography>
//                                 <Typography fontSize={13} color="text.secondary" mt={0.2}>
//                                     Analytics dashboard · {periodLabel}
//                                 </Typography>
//                             </Box>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">

//                             {/* Period Toggle */}
//                             <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5, fontSize: 12.5, fontWeight: 600, color: "#6b7280", "&.Mui-selected": { bgcolor: TEAL, color: "#fff" } } }}>
//                                 {["day", "week", "month", "year"].map((p) => (
//                                     <ToggleButton key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</ToggleButton>
//                                 ))}
//                             </ToggleButtonGroup>

//                             {/* View Toggle */}
//                             <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5, fontSize: 12.5, fontWeight: 600, color: "#6b7280", "&.Mui-selected": { bgcolor: "#1a1a2e", color: "#fff" } } }}>
//                                 <ToggleButton value="assigned"><AssignmentTurnedInOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Assigned</ToggleButton>
//                                 <ToggleButton value="my"><TaskAltOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />My Tasks</ToggleButton>
//                                 <ToggleButton value="overall"><BarChartOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Overall</ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* Refresh */}
//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "…" : "Refresh"}
//                             </Button>
//                         </Box>
//                     </Box>

//                     {userEmail && (
//                         <Box mt={1.5} display="flex" alignItems="center" gap={1} flexWrap="wrap">
//                             <Typography fontSize={12} color="text.secondary">User:</Typography>
//                             <Chip label={userEmail} size="small" sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                             <Typography fontSize={12} color="text.secondary">·</Typography>
//                             <Chip
//                                 icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "12px !important" }} />}
//                                 label={`${fmtDate(dateRange.start)}${dateRange.start !== dateRange.end ? ` – ${fmtDate(dateRange.end)}` : ""}`}
//                                 size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }}
//                             />
//                             <Chip
//                                 label={viewMode === "assigned" ? "Assigned Tasks" : viewMode === "my" ? "My Tasks" : "Overall"}
//                                 size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: "#1a1a2e", color: "#fff" }}
//                             />
//                         </Box>
//                     )}
//                 </Box>

//                 <Box sx={{ p: 3 }}>

//                     {/* ── Metric Cards ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1.5, mb: 3 }}>
//                         <MetricCard label="Total Tasks" value={loading ? "—" : stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} pct={100} loading={loading} />
//                         <MetricCard label="Active" value={loading ? "—" : stats.byStatus.Active} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0" pct={stats.total > 0 ? Math.round(stats.byStatus.Active / stats.total * 100) : 0} loading={loading} />
//                         <MetricCard label="In Progress" value={loading ? "—" : stats.byStatus["In Progress"]} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9" pct={stats.total > 0 ? Math.round(stats.byStatus["In Progress"] / stats.total * 100) : 0} loading={loading} />
//                         <MetricCard label="Completed" value={loading ? "—" : stats.byStatus.Completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd" pct={stats.total > 0 ? Math.round(stats.byStatus.Completed / stats.total * 100) : 0} loading={loading} />
//                         <MetricCard label="Cancelled" value={loading ? "—" : stats.byStatus.Cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea" pct={stats.total > 0 ? Math.round(stats.byStatus.Cancelled / stats.total * 100) : 0} loading={loading} />
//                         <MetricCard label="Overdue" value={loading ? "—" : stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" pct={stats.total > 0 ? Math.round(stats.overdue / stats.total * 100) : 0} loading={loading} />
//                         <MetricCard label="Completion %" value={loading ? "—" : `${stats.completionRate}%`} icon={<TrendingUpOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} pct={stats.completionRate} loading={loading} />
//                     </Box>

//                     {/* ── Row 1: Donut + Priority Bar ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

//                         {/* Status Donut */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<BarChartOutlinedIcon />} title="Task status breakdown" />
//                             <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
//                                 {Object.entries(STATUS_COLORS).map(([s, c]) => (
//                                     <Box key={s} display="flex" alignItems="center" gap={0.5}>
//                                         <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: c }} />
//                                         <Typography fontSize={11} color="text.secondary">{s} ({stats.byStatus[s] || 0})</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box sx={{ height: 220, position: "relative" }}>
//                                 {loading
//                                     ? <Skeleton variant="circular" width={220} height={220} sx={{ mx: "auto" }} />
//                                     : <Doughnut data={donutData} options={donutOpts} />
//                                 }
//                             </Box>
//                         </Paper>

//                         {/* Priority Bar */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<FlagOutlinedIcon />} title="Priority distribution" />
//                             <Box sx={{ height: 200, position: "relative", mb: 1 }}>
//                                 {loading
//                                     ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//                                     : <Bar data={prioData} options={barOpts} />
//                                 }
//                             </Box>
//                             <Box display="flex" gap={1.5} flexWrap="wrap">
//                                 {Object.entries(PRIO_COLORS).map(([p, c]) => (
//                                     <Box key={p} sx={{ flex: 1, minWidth: 60, p: 1, borderRadius: "8px", bgcolor: alpha(c, 0.08), textAlign: "center", border: `1px solid ${alpha(c, 0.2)}` }}>
//                                         <Typography fontSize={16} fontWeight={800} color={c}>{stats.byPriority[p] || 0}</Typography>
//                                         <Typography fontSize={10} color="text.secondary">{p}</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </Paper>
//                     </Box>

//                     {/* ── Row 2: OEM bar + Slot polar ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

//                         {/* OEM Horizontal Bar */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<RouterOutlinedIcon />} title="Tasks by OEM" />
//                             {loading
//                                 ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//                                 : oemEntries.length === 0
//                                     ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
//                                     : (
//                                         <Box sx={{ height: Math.max(180, oemEntries.length * 44 + 20), position: "relative" }}>
//                                             <Bar data={oemBarData} options={hBarOpts} />
//                                         </Box>
//                                     )
//                             }
//                         </Paper>

//                         {/* Slot Polar */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<WbSunnyOutlinedIcon />} title="Slot distribution" />
//                             <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
//                                 {Object.entries(SLOT_COLORS).map(([s, c]) => (
//                                     <Box key={s} display="flex" alignItems="center" gap={0.5}>
//                                         <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
//                                         <Typography fontSize={11} color="text.secondary">{s} ({stats.bySlot[s] || 0})</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box sx={{ height: 200, position: "relative" }}>
//                                 {loading
//                                     ? <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto" }} />
//                                     : <PolarArea data={slotData} options={polarOpts} />
//                                 }
//                             </Box>
//                         </Paper>
//                     </Box>

//                     {/* ── Row 3: User workload + Completion rate ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2 }}>

//                         {/* User Workload */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<PersonOutlineIcon />} title="User workload" />
//                             {loading
//                                 ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 1, borderRadius: 2 }} />)
//                                 : topUsers.length === 0
//                                     ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
//                                     : topUsers.map(([name, cnt], i) => {
//                                         const initials = name.split(/[@.]/)[0].slice(0, 2).toUpperCase();
//                                         const maxCnt = topUsers[0]?.[1] || 1;
//                                         return (
//                                             <Box key={name} display="flex" alignItems="center" gap={1.2} mb={1.2}>
//                                                 <Avatar sx={{ width: 30, height: 30, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                                     {initials}
//                                                 </Avatar>
//                                                 <Box flex={1} minWidth={0}>
//                                                     <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                                         <Tooltip title={name} arrow>
//                                                             <Typography fontSize={12} fontWeight={600} noWrap sx={{ maxWidth: 160 }}>{name}</Typography>
//                                                         </Tooltip>
//                                                         <Typography fontSize={11.5} color="text.secondary">{cnt} tasks</Typography>
//                                                     </Box>
//                                                     <LinearProgress variant="determinate" value={Math.round(cnt / maxCnt * 100)}
//                                                         sx={{ height: 5, borderRadius: 3, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: OEM_PALETTE[i % OEM_PALETTE.length], borderRadius: 3 } }} />
//                                                 </Box>
//                                             </Box>
//                                         );
//                                     })
//                             }
//                         </Paper>

//                         {/* Completion rate card */}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<TrendingUpOutlinedIcon />} title="Completion summary" />

//                             {/* Donut-style completion rate */}
//                             <Box display="flex" alignItems="center" gap={3} mb={2.5}>
//                                 <Box sx={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
//                                     <svg width="90" height="90">
//                                         <circle cx="45" cy="45" r="36" fill="none" stroke="#e8ecf0" strokeWidth="9" />
//                                         <circle cx="45" cy="45" r="36" fill="none" stroke={TEAL} strokeWidth="9"
//                                             strokeDasharray={`${(stats.completionRate / 100) * 226} 226`}
//                                             strokeLinecap="round" transform="rotate(-90 45 45)" />
//                                     </svg>
//                                     <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
//                                         <Typography fontWeight={800} fontSize={18} color={TEAL} lineHeight={1}>{stats.completionRate}%</Typography>
//                                         <Typography fontSize={9} color="text.secondary">done</Typography>
//                                     </Box>
//                                 </Box>
//                                 <Box flex={1}>
//                                     <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} tasks completed</Typography>
//                                     {stats.overdue > 0 && (
//                                         <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                             label={`${stats.overdue} overdue`} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
//                                     )}
//                                 </Box>
//                             </Box>

//                             <Box sx={{ borderTop: "1px solid #f0f2f5", pt: 1.5 }}>
//                                 <ProgressRow label="Active" value={stats.byStatus.Active} max={stats.total} color="#f57c00" />
//                                 <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
//                                 <ProgressRow label="Completed" value={stats.byStatus.Completed} max={stats.total} color="#1565c0" />
//                                 <ProgressRow label="Cancelled" value={stats.byStatus.Cancelled} max={stats.total} color="#c62828" />
//                             </Box>
//                         </Paper>
//                     </Box>

//                 </Box>

//                 {/* Footer */}
//                 <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                     <Typography variant="caption" color="text.disabled">
//                         Daily Task Review · Analytics Dashboard
//                     </Typography>
//                     <Typography variant="caption" color="text.disabled">
//                         {stats.total} total tasks · {periodLabel}
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default Dashboard;


// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Chip, IconButton, Tooltip, Avatar,
//     LinearProgress, ToggleButton, ToggleButtonGroup, alpha, Skeleton, TextField,
// } from "@mui/material";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import TrendingUpOutlinedIcon         from "@mui/icons-material/TrendingUpOutlined";
// import HourglassEmptyIcon             from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon          from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon         from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon             from "@mui/icons-material/CancelOutlined";
// import WarningAmberOutlinedIcon       from "@mui/icons-material/WarningAmberOutlined";
// import RouterOutlinedIcon             from "@mui/icons-material/RouterOutlined";
// import PersonOutlineIcon              from "@mui/icons-material/PersonOutline";
// import WbSunnyOutlinedIcon            from "@mui/icons-material/WbSunnyOutlined";
// import FlagOutlinedIcon               from "@mui/icons-material/FlagOutlined";
// import BarChartOutlinedIcon           from "@mui/icons-material/BarChartOutlined";
// import RefreshIcon                    from "@mui/icons-material/Refresh";
// import CalendarTodayOutlinedIcon      from "@mui/icons-material/CalendarTodayOutlined";
// import AssignmentIndOutlinedIcon      from "@mui/icons-material/AssignmentIndOutlined";
// import TaskAltOutlinedIcon            from "@mui/icons-material/TaskAltOutlined";
// import KeyboardArrowRightIcon         from "@mui/icons-material/KeyboardArrowRight";
// import Breadcrumbs                    from "@mui/material/Breadcrumbs";
// import Link                           from "@mui/material/Link";
// import { useNavigate }                from "react-router-dom";
// import { getDecreyptedData }          from "../../../utils/localstorage";
// import Swal                           from "sweetalert2";
// import {
//     Chart as ChartJS,
//     ArcElement, Tooltip as ChartTooltip, Legend,
//     CategoryScale, LinearScale, BarElement, PointElement, LineElement,
//     RadialLinearScale, Filler,
// } from "chart.js";
// import { Doughnut, Bar, PolarArea } from "react-chartjs-2";

// ChartJS.register(
//     ArcElement, ChartTooltip, Legend,
//     CategoryScale, LinearScale, BarElement, PointElement, LineElement,
//     RadialLinearScale, Filler
// );

// // ─── theme ───────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// const API = {
//     ASSIGNED: "dailytask_review/analytics/assigned/",
//     MYTASKS:  "dailytask_review/analytics/mytasks/",
// };

// // ─── colors ──────────────────────────────────────────────────────────────────
// const STATUS_COLORS = {
//     Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828",
// };
// const PRIO_COLORS  = { Critical: "#c62828", High: "#e65100", Medium: "#f57c00", Low: "#2e7d32" };
// const SLOT_COLORS  = { Morning: "#f9a825", Afternoon: "#d85a30", Evening: "#5c6bc0", Night: "#37474f" };
// const OEM_PALETTE  = ["#228b7f", "#1565c0", "#e65100", "#c62828", "#7c3aed", "#2e7d32"];

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const todayStr = () => {
//     const d = new Date();
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };
// const getDefaultFrom = () => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };
// const fmtDate = (iso) =>
//     iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// // ─── EMPTY shape ──────────────────────────────────────────────────────────────
// const EMPTY = {
//     summary:      { total: 0, completion_rate: 0, overdue: 0 },
//     by_status:    { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 },
//     by_priority:  { Critical: 0, High: 0, Medium: 0, Low: 0 },
//     by_oem:       {},
//     by_slot:      { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 },
//     user_workload: [],
//     meta:         {},
// };

// // ─── Normalise ANY API response into a unified stats shape ───────────────────
// //
// //  The two endpoints return different shapes:
// //
// //  assigned/  →  { meta, user_performance: [ { user, total, completed,
// //                    in_progress, active, cancelled, overdue,
// //                    by_priority?, by_oem?, by_slot? }, … ] }
// //
// //  mytasks/   →  { meta, summary, by_status, by_priority, by_oem, by_slot,
// //                  user_workload }
// //
// //  We detect which shape we have and normalise to a common structure.
// // ─────────────────────────────────────────────────────────────────────────────
// const normaliseApiResponse = (apiData) => {
//     if (!apiData || typeof apiData !== "object") return { ...EMPTY };

//     // ── Shape B: flat summary (mytasks/) ──────────────────────────────────
//     // Detected when the response has a top-level "summary" key
//     if (apiData.summary) {
//         const s  = apiData.summary   || {};
//         const bs = apiData.by_status || {};
//         const bp = apiData.by_priority || {};
//         const bo = apiData.by_oem    || {};
//         const bl = apiData.by_slot   || {};
//         const uw = apiData.user_workload || [];

//         return {
//             summary: {
//                 total:           s.total           ?? (bs.Active + bs["In Progress"] + bs.Completed + bs.Cancelled) ?? 0,
//                 completion_rate: s.completion_rate ?? 0,
//                 overdue:         s.overdue         ?? 0,
//             },
//             by_status: {
//                 Active:        bs.Active        || 0,
//                 "In Progress": bs["In Progress"]|| 0,
//                 Completed:     bs.Completed     || 0,
//                 Cancelled:     bs.Cancelled     || 0,
//             },
//             by_priority: {
//                 Critical: bp.Critical || 0,
//                 High:     bp.High     || 0,
//                 Medium:   bp.Medium   || 0,
//                 Low:      bp.Low      || 0,
//             },
//             by_oem:  { ...bo },
//             by_slot: {
//                 Morning:   bl.Morning   || 0,
//                 Afternoon: bl.Afternoon || 0,
//                 Evening:   bl.Evening   || 0,
//                 Night:     bl.Night     || 0,
//             },
//             user_workload: [...uw].sort((a, b) => b.task_count - a.task_count),
//             meta: apiData.meta || {},
//         };
//     }

//     // ── Shape A: user_performance array (assigned/) ───────────────────────
//     const perf = apiData.user_performance || [];

//     const byStatus   = { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
//     const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//     const byOem      = {};
//     const bySlot     = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
//     let totalTasks    = 0;
//     let totalOverdue  = 0;
//     let totalCompleted = 0;

//     perf.forEach((u) => {
//         byStatus.Active         += u.active      || 0;
//         byStatus["In Progress"] += u.in_progress || 0;
//         byStatus.Completed      += u.completed   || 0;
//         byStatus.Cancelled      += u.cancelled   || 0;

//         totalTasks     += u.total     || 0;
//         totalOverdue   += u.overdue   || 0;
//         totalCompleted += u.completed || 0;

//         if (u.by_priority) {
//             Object.entries(u.by_priority).forEach(([k, v]) => {
//                 if (byPriority[k] !== undefined) byPriority[k] += v || 0;
//             });
//         }
//         if (u.by_oem) {
//             Object.entries(u.by_oem).forEach(([k, v]) => {
//                 byOem[k] = (byOem[k] || 0) + (v || 0);
//             });
//         }
//         if (u.by_slot) {
//             Object.entries(u.by_slot).forEach(([k, v]) => {
//                 if (bySlot[k] !== undefined) bySlot[k] += v || 0;
//             });
//         }
//     });

//     const completionRate = totalTasks > 0
//         ? Math.round((totalCompleted / totalTasks) * 100)
//         : 0;

//     const userWorkload = perf
//         .map((u) => ({ user: u.user, task_count: u.total || 0 }))
//         .sort((a, b) => b.task_count - a.task_count);

//     return {
//         summary:      { total: totalTasks, completion_rate: completionRate, overdue: totalOverdue },
//         by_status:    byStatus,
//         by_priority:  byPriority,
//         by_oem:       byOem,
//         by_slot:      bySlot,
//         user_workload: userWorkload,
//         meta: apiData.meta || {},
//     };
// };

// // ─── Merge two normalised stats objects (Overall view) ───────────────────────
// const mergeStats = (a, b) => {
//     const addObj = (x, y) => {
//         const r = { ...x };
//         Object.keys(y).forEach((k) => { r[k] = (r[k] || 0) + (y[k] || 0); });
//         return r;
//     };

//     const totalA = a.summary.total, totalB = b.summary.total;
//     const totalM = totalA + totalB;
//     const completedA = Math.round((a.summary.completion_rate / 100) * totalA);
//     const completedB = Math.round((b.summary.completion_rate / 100) * totalB);

//     const wMap = {};
//     [...(a.user_workload || []), ...(b.user_workload || [])].forEach(({ user, task_count }) => {
//         wMap[user] = (wMap[user] || 0) + task_count;
//     });

//     return {
//         summary: {
//             total:           totalM,
//             completion_rate: totalM > 0 ? Math.round(((completedA + completedB) / totalM) * 100) : 0,
//             overdue:         (a.summary.overdue || 0) + (b.summary.overdue || 0),
//         },
//         by_status:    addObj(a.by_status,   b.by_status),
//         by_priority:  addObj(a.by_priority, b.by_priority),
//         by_oem:       addObj(a.by_oem,      b.by_oem),
//         by_slot:      addObj(a.by_slot,     b.by_slot),
//         user_workload: Object.entries(wMap)
//             .map(([user, task_count]) => ({ user, task_count }))
//             .sort((x, y) => y.task_count - x.task_count),
//         meta: {},
//     };
// };

// // ─── Donut center plugin ──────────────────────────────────────────────────────
// const centerTextPlugin = {
//     id: "centerText",
//     afterDraw(chart) {
//         if (chart.config.type !== "doughnut") return;
//         const { width, height, ctx } = chart;
//         const total = chart.data.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
//         ctx.save();
//         ctx.textAlign = "center"; ctx.textBaseline = "middle";
//         ctx.fillStyle = "#1a1a2e"; ctx.font = "bold 22px sans-serif";
//         ctx.fillText(total, width / 2, height / 2 - 8);
//         ctx.font = "12px sans-serif"; ctx.fillStyle = "#888";
//         ctx.fillText("total", width / 2, height / 2 + 12);
//         ctx.restore();
//     },
// };
// ChartJS.register(centerTextPlugin);

// // ─── MetricCard ───────────────────────────────────────────────────────────────
// const MetricCard = ({ label, value, icon, color, bg, pct, loading }) => (
//     <Paper elevation={0} sx={{
//         p: 2, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff",
//         position: "relative", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
//     }}>
//         <Box sx={{ position: "absolute", top: -12, right: -12, width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(color, 0.06) }} />
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
//             <Typography fontSize={11.5} fontWeight={500} color="text.secondary">{label}</Typography>
//             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: bg || alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
//             </Box>
//         </Box>
//         {loading
//             ? <Skeleton width={50} height={30} />
//             : <Typography fontSize={28} fontWeight={800} color="#1a1a2e" lineHeight={1}>{value}</Typography>
//         }
//         {pct !== undefined && (
//             <Box mt={1}>
//                 <LinearProgress variant="determinate" value={Math.min(pct, 100)}
//                     sx={{ height: 3, borderRadius: 2, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 2 } }} />
//             </Box>
//         )}
//     </Paper>
// );

// // ─── SectionTitle ─────────────────────────────────────────────────────────────
// const SectionTitle = ({ icon, title }) => (
//     <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
//         {React.cloneElement(icon, { sx: { fontSize: 16, color: TEAL } })}
//         <Typography fontSize={13} fontWeight={700} color="#1a1a2e">{title}</Typography>
//     </Box>
// );

// // ─── ProgressRow ──────────────────────────────────────────────────────────────
// const ProgressRow = ({ label, value, max, color }) => (
//     <Box mb={1.2}>
//         <Box display="flex" justifyContent="space-between" mb={0.4}>
//             <Typography fontSize={12} color="text.secondary">{label}</Typography>
//             <Typography fontSize={12} fontWeight={700} color={color}>
//                 {value}{max > 0 ? ` (${Math.round(value / max * 100)}%)` : ""}
//             </Typography>
//         </Box>
//         <LinearProgress variant="determinate" value={max > 0 ? Math.min((value / max) * 100, 100) : 0}
//             sx={{ height: 5, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
//     </Box>
// );

// // ════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════
// const Dashboard = () => {
//     const navigate = useNavigate();

//     const userEmail = useMemo(() => (
//         getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail") || ""
//     ), []);

//     const [dateFrom, setDateFrom] = useState(getDefaultFrom());
//     const [dateTo,   setDateTo]   = useState(todayStr());
//     const [viewMode, setViewMode] = useState("assigned");

//     const [assignedStats, setAssignedStats] = useState(EMPTY);
//     const [myTaskStats,   setMyTaskStats]   = useState(EMPTY);
//     const [loading,       setLoading]       = useState(false);
//     const [refreshing,    setRefreshing]    = useState(false);

//     // ── Fetch ─────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         if (!userEmail) return;
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const headers = { "Content-Type": "application/json" };

//             const [assignRes, myRes] = await Promise.allSettled([
//                 fetch(`${BASE_URL}${API.ASSIGNED}`, {
//                     method: "POST", headers,
//                     body: JSON.stringify({ assigned_by: userEmail, date_from: dateFrom, date_to: dateTo }),
//                 }),
//                 fetch(`${BASE_URL}${API.MYTASKS}`, {
//                     method: "POST", headers,
//                     body: JSON.stringify({ owner: userEmail, date_from: dateFrom, date_to: dateTo }),
//                 }),
//             ]);

//             const parse = async (result) => {
//                 if (result.status !== "fulfilled") return {};
//                 try { return await result.value.json(); }
//                 catch { return {}; }
//             };

//             const [assignedRaw, myRaw] = await Promise.all([parse(assignRes), parse(myRes)]);

//             // normaliseApiResponse handles both shapes automatically
//             setAssignedStats(normaliseApiResponse(assignedRaw));
//             setMyTaskStats(normaliseApiResponse(myRaw));
//         } catch (err) {
//             console.error("Dashboard fetchAll:", err);
//             Swal.fire("Error", "Failed to load dashboard data.", "error");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [userEmail, dateFrom, dateTo]);

//     useEffect(() => {
//         const t = setTimeout(() => fetchAll(), 400);
//         return () => clearTimeout(t);
//     }, [fetchAll]);

//     // ── Active stats based on viewMode ────────────────────────────────────
//     const stats = useMemo(() => {
//         if (viewMode === "assigned") return assignedStats;
//         if (viewMode === "my")       return myTaskStats;
//         return mergeStats(assignedStats, myTaskStats);
//     }, [viewMode, assignedStats, myTaskStats]);

//     const summary      = stats.summary      || EMPTY.summary;
//     const byStatus     = stats.by_status    || EMPTY.by_status;
//     const byPriority   = stats.by_priority  || EMPTY.by_priority;
//     const byOem        = stats.by_oem       || {};
//     const bySlot       = stats.by_slot      || EMPTY.by_slot;
//     const userWorkload = stats.user_workload || [];
//     const total        = summary.total || 0;

//     // ── Chart data ────────────────────────────────────────────────────────
//     const donutData = useMemo(() => ({
//         labels: ["Active", "In Progress", "Completed", "Cancelled"],
//         datasets: [{
//             data: [byStatus.Active, byStatus["In Progress"], byStatus.Completed, byStatus.Cancelled],
//             backgroundColor: [STATUS_COLORS.Active, STATUS_COLORS["In Progress"], STATUS_COLORS.Completed, STATUS_COLORS.Cancelled],
//             borderWidth: 2, borderColor: "#fff", hoverOffset: 6,
//         }],
//     }), [byStatus]);

//     const prioData = useMemo(() => ({
//         labels: ["Critical", "High", "Medium", "Low"],
//         datasets: [{
//             data: [byPriority.Critical, byPriority.High, byPriority.Medium, byPriority.Low],
//             backgroundColor: [PRIO_COLORS.Critical, PRIO_COLORS.High, PRIO_COLORS.Medium, PRIO_COLORS.Low],
//             borderRadius: 6, borderWidth: 0,
//         }],
//     }), [byPriority]);

//     const oemEntries = useMemo(() => Object.entries(byOem).sort((a, b) => b[1] - a[1]), [byOem]);
//     const oemBarData = useMemo(() => ({
//         labels: oemEntries.map((e) => e[0]),
//         datasets: [{
//             data: oemEntries.map((e) => e[1]),
//             backgroundColor: oemEntries.map((_, i) => OEM_PALETTE[i % OEM_PALETTE.length] + "cc"),
//             borderRadius: 5, borderWidth: 0,
//         }],
//     }), [oemEntries]);

//     const slotData = useMemo(() => ({
//         labels: ["Morning", "Afternoon", "Evening", "Night"],
//         datasets: [{
//             data: [bySlot.Morning, bySlot.Afternoon, bySlot.Evening, bySlot.Night],
//             backgroundColor: [SLOT_COLORS.Morning+"cc", SLOT_COLORS.Afternoon+"cc", SLOT_COLORS.Evening+"cc", SLOT_COLORS.Night+"cc"],
//             borderColor: [SLOT_COLORS.Morning, SLOT_COLORS.Afternoon, SLOT_COLORS.Evening, SLOT_COLORS.Night],
//             borderWidth: 1.5,
//         }],
//     }), [bySlot]);

//     const topUsers = useMemo(() =>
//         [...userWorkload].sort((a, b) => b.task_count - a.task_count).slice(0, 6),
//         [userWorkload]
//     );

//     // ── Chart options ─────────────────────────────────────────────────────
//     const donutOpts = { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } } } };
//     const barOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } } };
//     const hBarOpts  = { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } } };
//     const polarOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { ticks: { display: false }, grid: { color: "rgba(0,0,0,0.06)" } } } };

//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//             {/* Breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Dashboard</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

//                 {/* ── Header ── */}
//                 <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5", background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)` }}>
//                     <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>

//                         {/* Title */}
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width: 48, height: 48, borderRadius: "13px", background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${alpha(TEAL, 0.35)}`, flexShrink: 0 }}>
//                                 <BarChartOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Daily Task Review</Typography>
//                                 <Typography fontSize={13} color="text.secondary" mt={0.2}>Analytics dashboard</Typography>
//                             </Box>
//                         </Box>

//                         {/* Controls */}
//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">

//                             {/* Date pickers */}
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <TextField
//                                     size="small" label="From" type="date" value={dateFrom}
//                                     onChange={(e) => { if (e.target.value <= dateTo) setDateFrom(e.target.value); }}
//                                     inputProps={{ max: dateTo }}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minWidth: 148, "& .MuiOutlinedInput-root": { borderRadius: "10px", "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } }, "& label.Mui-focused": { color: TEAL } }}
//                                 />
//                                 <Typography color="text.secondary" fontWeight={700}>→</Typography>
//                                 <TextField
//                                     size="small" label="To" type="date" value={dateTo}
//                                     onChange={(e) => { if (e.target.value >= dateFrom) setDateTo(e.target.value); }}
//                                     inputProps={{ min: dateFrom, max: todayStr() }}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minWidth: 148, "& .MuiOutlinedInput-root": { borderRadius: "10px", "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } }, "& label.Mui-focused": { color: TEAL } }}
//                                 />
//                             </Box>

//                             {/* View toggle */}
//                             <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5, fontSize: 12.5, fontWeight: 600, color: "#6b7280", "&.Mui-selected": { bgcolor: "#1a1a2e", color: "#fff" } } }}>
//                                 <ToggleButton value="assigned"><AssignmentTurnedInOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Assigned</ToggleButton>
//                                 <ToggleButton value="my"><TaskAltOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />My Tasks</ToggleButton>
//                                 <ToggleButton value="overall"><BarChartOutlinedIcon sx={{ fontSize: 15, mr: 0.5 }} />Overall</ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* Refresh */}
//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "…" : "Refresh"}
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Info strip */}
//                     {userEmail && (
//                         <Box mt={1.5} display="flex" alignItems="center" gap={1} flexWrap="wrap">
//                             <Typography fontSize={12} color="text.secondary">User:</Typography>
//                             <Chip label={userEmail} size="small" sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                             <Typography fontSize={12} color="text.secondary">·</Typography>
//                             <Chip icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "12px !important" }} />}
//                                 label={`${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`} size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                             <Chip label={viewMode === "assigned" ? "Assigned Tasks" : viewMode === "my" ? "My Tasks" : "Overall"} size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: "#1a1a2e", color: "#fff" }} />
//                             {stats.meta?.total_users > 0 && (
//                                 <Chip label={`${stats.meta.total_users} users`} size="small"
//                                     sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 <Box sx={{ p: 3 }}>

//                     {/* ── Metric Cards ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1.5, mb: 3 }}>
//                         <MetricCard label="Total Tasks"  value={loading ? "—" : total}                         icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} pct={100}                                                                   loading={loading} />
//                         <MetricCard label="Active"       value={loading ? "—" : byStatus.Active}               icon={<HourglassEmptyIcon />}        color="#f57c00" bg="#fff3e0"    pct={total > 0 ? Math.round(byStatus.Active         / total * 100) : 0}     loading={loading} />
//                         <MetricCard label="In Progress"  value={loading ? "—" : byStatus["In Progress"]}       icon={<PlayCircleOutlineIcon />}      color="#2e7d32" bg="#e8f5e9"    pct={total > 0 ? Math.round(byStatus["In Progress"] / total * 100) : 0}     loading={loading} />
//                         <MetricCard label="Completed"    value={loading ? "—" : byStatus.Completed}            icon={<CheckCircleOutlineIcon />}     color="#1565c0" bg="#e3f2fd"    pct={total > 0 ? Math.round(byStatus.Completed      / total * 100) : 0}     loading={loading} />
//                         <MetricCard label="Cancelled"    value={loading ? "—" : byStatus.Cancelled}            icon={<CancelOutlinedIcon />}         color="#c62828" bg="#fdecea"    pct={total > 0 ? Math.round(byStatus.Cancelled      / total * 100) : 0}     loading={loading} />
//                         <MetricCard label="Overdue"      value={loading ? "—" : summary.overdue}               icon={<WarningAmberOutlinedIcon />}   color="#e65100" bg="#fff3e0"    pct={total > 0 ? Math.round(summary.overdue         / total * 100) : 0}     loading={loading} />
//                         <MetricCard label="Completion %" value={loading ? "—" : `${summary.completion_rate}%`} icon={<TrendingUpOutlinedIcon />}     color={TEAL}    bg={TEAL_LIGHT} pct={summary.completion_rate}                                              loading={loading} />
//                     </Box>

//                     {/* ── Row 1: Donut + Priority ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<BarChartOutlinedIcon />} title="Task status breakdown" />
//                             <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
//                                 {Object.entries(STATUS_COLORS).map(([s, c]) => (
//                                     <Box key={s} display="flex" alignItems="center" gap={0.5}>
//                                         <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: c }} />
//                                         <Typography fontSize={11} color="text.secondary">{s} ({byStatus[s] || 0})</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box sx={{ height: 220, position: "relative" }}>
//                                 {loading
//                                     ? <Skeleton variant="circular" width={220} height={220} sx={{ mx: "auto" }} />
//                                     : <Doughnut data={donutData} options={donutOpts} />
//                                 }
//                             </Box>
//                         </Paper>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<FlagOutlinedIcon />} title="Priority distribution" />
//                             <Box sx={{ height: 200, position: "relative", mb: 1 }}>
//                                 {loading
//                                     ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//                                     : <Bar data={prioData} options={barOpts} />
//                                 }
//                             </Box>
//                             <Box display="flex" gap={1.5} flexWrap="wrap">
//                                 {Object.entries(PRIO_COLORS).map(([p, c]) => (
//                                     <Box key={p} sx={{ flex: 1, minWidth: 60, p: 1, borderRadius: "8px", bgcolor: alpha(c, 0.08), textAlign: "center", border: `1px solid ${alpha(c, 0.2)}` }}>
//                                         <Typography fontSize={16} fontWeight={800} color={c}>{byPriority[p] || 0}</Typography>
//                                         <Typography fontSize={10} color="text.secondary">{p}</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </Paper>
//                     </Box>

//                     {/* ── Row 2: OEM + Slot ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<RouterOutlinedIcon />} title="Tasks by OEM" />
//                             {loading
//                                 ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//                                 : oemEntries.length === 0
//                                     ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
//                                     : <Box sx={{ height: Math.max(180, oemEntries.length * 44 + 20), position: "relative" }}><Bar data={oemBarData} options={hBarOpts} /></Box>
//                             }
//                         </Paper>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<WbSunnyOutlinedIcon />} title="Slot distribution" />
//                             <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
//                                 {Object.entries(SLOT_COLORS).map(([s, c]) => (
//                                     <Box key={s} display="flex" alignItems="center" gap={0.5}>
//                                         <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
//                                         <Typography fontSize={11} color="text.secondary">{s} ({bySlot[s] || 0})</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box sx={{ height: 200, position: "relative" }}>
//                                 {loading
//                                     ? <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto" }} />
//                                     : <PolarArea data={slotData} options={polarOpts} />
//                                 }
//                             </Box>
//                         </Paper>
//                     </Box>

//                     {/* ── Row 3: User Workload + Completion ── */}
//                     <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", gap: 2 }}>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<PersonOutlineIcon />} title="User workload" />
//                             {loading
//                                 ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 1, borderRadius: 2 }} />)
//                                 : topUsers.length === 0
//                                     ? <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>
//                                     : topUsers.map(({ user, task_count }, i) => {
//                                         const initials = user.split(/[@.]/)[0].slice(0, 2).toUpperCase();
//                                         const maxCnt   = topUsers[0]?.task_count || 1;
//                                         return (
//                                             <Box key={user} display="flex" alignItems="center" gap={1.2} mb={1.2}>
//                                                 <Avatar sx={{ width: 30, height: 30, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                                     {initials}
//                                                 </Avatar>
//                                                 <Box flex={1} minWidth={0}>
//                                                     <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                                         <Tooltip title={user} arrow>
//                                                             <Typography fontSize={12} fontWeight={600} noWrap sx={{ maxWidth: 160 }}>{user}</Typography>
//                                                         </Tooltip>
//                                                         <Typography fontSize={11.5} color="text.secondary">{task_count} tasks</Typography>
//                                                     </Box>
//                                                     <LinearProgress variant="determinate" value={Math.round(task_count / maxCnt * 100)}
//                                                         sx={{ height: 5, borderRadius: 3, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: OEM_PALETTE[i % OEM_PALETTE.length], borderRadius: 3 } }} />
//                                                 </Box>
//                                             </Box>
//                                         );
//                                     })
//                             }
//                         </Paper>

//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                             <SectionTitle icon={<TrendingUpOutlinedIcon />} title="Completion summary" />
//                             <Box display="flex" alignItems="center" gap={3} mb={2.5}>
//                                 <Box sx={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
//                                     <svg width="90" height="90">
//                                         <circle cx="45" cy="45" r="36" fill="none" stroke="#e8ecf0" strokeWidth="9" />
//                                         <circle cx="45" cy="45" r="36" fill="none" stroke={TEAL} strokeWidth="9"
//                                             strokeDasharray={`${(summary.completion_rate / 100) * 226} 226`}
//                                             strokeLinecap="round" transform="rotate(-90 45 45)" />
//                                     </svg>
//                                     <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
//                                         <Typography fontWeight={800} fontSize={18} color={TEAL} lineHeight={1}>{summary.completion_rate}%</Typography>
//                                         <Typography fontSize={9} color="text.secondary">done</Typography>
//                                     </Box>
//                                 </Box>
//                                 <Box flex={1}>
//                                     <Typography fontSize={13} color="text.secondary" mb={0.5}>
//                                         {byStatus.Completed} of {total} tasks completed
//                                     </Typography>
//                                     {summary.overdue > 0 && (
//                                         <Chip
//                                             icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                             label={`${summary.overdue} overdue`} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }}
//                                         />
//                                     )}
//                                 </Box>
//                             </Box>
//                             <Box sx={{ borderTop: "1px solid #f0f2f5", pt: 1.5 }}>
//                                 <ProgressRow label="Active"      value={byStatus.Active}         max={total} color="#f57c00" />
//                                 <ProgressRow label="In Progress" value={byStatus["In Progress"]} max={total} color="#2e7d32" />
//                                 <ProgressRow label="Completed"   value={byStatus.Completed}       max={total} color="#1565c0" />
//                                 <ProgressRow label="Cancelled"   value={byStatus.Cancelled}       max={total} color="#c62828" />
//                             </Box>
//                         </Paper>
//                     </Box>

//                 </Box>

//                 {/* Footer */}
//                 <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                     <Typography variant="caption" color="text.disabled">Daily Task Review · Analytics Dashboard</Typography>
//                     <Typography variant="caption" color="text.disabled">{total} total tasks · {fmtDate(dateFrom)} – {fmtDate(dateTo)}</Typography>
//                 </Box>

//             </Paper>
//         </Box>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Chip, Tooltip, Avatar,
    LinearProgress, ToggleButton, ToggleButtonGroup, alpha, Skeleton, TextField,
    Table, TableBody, TableCell, TableHead, TableRow,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import TrendingUpOutlinedIcon         from "@mui/icons-material/TrendingUpOutlined";
import HourglassEmptyIcon             from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon          from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon         from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon             from "@mui/icons-material/CancelOutlined";
import WarningAmberOutlinedIcon       from "@mui/icons-material/WarningAmberOutlined";
import RouterOutlinedIcon             from "@mui/icons-material/RouterOutlined";
import WbSunnyOutlinedIcon            from "@mui/icons-material/WbSunnyOutlined";
import FlagOutlinedIcon               from "@mui/icons-material/FlagOutlined";
import BarChartOutlinedIcon           from "@mui/icons-material/BarChartOutlined";
import RefreshIcon                    from "@mui/icons-material/Refresh";
import CalendarTodayOutlinedIcon      from "@mui/icons-material/CalendarTodayOutlined";
import AssignmentIndOutlinedIcon      from "@mui/icons-material/AssignmentIndOutlined";
import TaskAltOutlinedIcon            from "@mui/icons-material/TaskAltOutlined";
import KeyboardArrowRightIcon         from "@mui/icons-material/KeyboardArrowRight";
import PeopleOutlinedIcon             from "@mui/icons-material/PeopleOutlined";
import Breadcrumbs                    from "@mui/material/Breadcrumbs";
import Link                           from "@mui/material/Link";
import { useNavigate }                from "react-router-dom";
import { getDecreyptedData }          from "../../../utils/localstorage";
import Swal                           from "sweetalert2";
import {
    Chart as ChartJS,
    ArcElement, Tooltip as ChartTooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Filler,
} from "chart.js";
import { Doughnut, Bar, PolarArea } from "react-chartjs-2";

ChartJS.register(
    ArcElement, ChartTooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Filler
);

// ─── theme ───────────────────────────────────────────────────────────────────
const TEAL       = "#228b7f";
const TEAL_DARK  = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID   = "#b2dfdb";

const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const API = {
    ASSIGNED: "dailytask_review/analytics/assigned/",
    MYTASKS:  "dailytask_review/analytics/mytasks/",
};

// ─── colors ──────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828",
};
const PRIO_COLORS  = { Critical: "#c62828", High: "#e65100", Medium: "#f57c00", Low: "#2e7d32" };
const SLOT_COLORS  = { Morning: "#f9a825", Afternoon: "#d85a30", Evening: "#5c6bc0", Night: "#37474f" };
const OEM_PALETTE  = ["#228b7f", "#1565c0", "#e65100", "#c62828", "#7c3aed", "#2e7d32"];
const AVATAR_COLORS = [
    "#228b7f","#1565c0","#7c3aed","#e65100","#2e7d32",
    "#c62828","#d85a30","#5c6bc0","#f9a825","#37474f",
];

// ─── helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const getDefaultFrom = () => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-01`;
};
const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

const getInitials = (email="") => {
    const name  = email.split("@")[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0]+(parts[1][0]||"")).toUpperCase();
    return name.slice(0,2).toUpperCase();
};
const getDisplayName = (email="") => {
    const name = email.split("@")[0];
    return name.split(/[._-]/).map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" ");
};
const getDomain = (email="") => email.split("@")[1] || "";

// ─── EMPTY shape ──────────────────────────────────────────────────────────────
const EMPTY = {
    summary:          { total:0, completion_rate:0, overdue:0 },
    by_status:        { Active:0, "In Progress":0, Completed:0, Cancelled:0 },
    by_priority:      { Critical:0, High:0, Medium:0, Low:0 },
    by_oem:           {},
    by_slot:          { Morning:0, Afternoon:0, Evening:0, Night:0 },
    user_workload:    [],
    user_performance: [],
    meta:             {},
};

// ─── Normalise ANY API response ───────────────────────────────────────────────
const normaliseApiResponse = (apiData) => {
    if (!apiData || typeof apiData !== "object") return { ...EMPTY };

    // Shape B: flat summary (mytasks/)
    if (apiData.summary) {
        const s  = apiData.summary      || {};
        const bs = apiData.by_status    || {};
        const bp = apiData.by_priority  || {};
        const bo = apiData.by_oem       || {};
        const bl = apiData.by_slot      || {};
        const uw = apiData.user_workload || [];
        return {
            summary: {
                total:           s.total           ?? 0,
                completion_rate: s.completion_rate ?? 0,
                overdue:         s.overdue         ?? 0,
            },
            by_status: {
                Active:        bs.Active         || 0,
                "In Progress": bs["In Progress"] || 0,
                Completed:     bs.Completed      || 0,
                Cancelled:     bs.Cancelled      || 0,
            },
            by_priority: { Critical:bp.Critical||0, High:bp.High||0, Medium:bp.Medium||0, Low:bp.Low||0 },
            by_oem:  { ...bo },
            by_slot: { Morning:bl.Morning||0, Afternoon:bl.Afternoon||0, Evening:bl.Evening||0, Night:bl.Night||0 },
            user_workload:    [...uw].sort((a,b)=>b.task_count-a.task_count),
            user_performance: [],
            meta: apiData.meta || {},
        };
    }

    // Shape A: user_performance array (assigned/)
    const perf = apiData.user_performance || [];
    const byStatus   = { Active:0, "In Progress":0, Completed:0, Cancelled:0 };
    const byPriority = { Critical:0, High:0, Medium:0, Low:0 };
    const byOem      = {};
    const bySlot     = { Morning:0, Afternoon:0, Evening:0, Night:0 };
    let totalTasks=0, totalOverdue=0, totalCompleted=0;

    perf.forEach((u) => {
        byStatus.Active         += u.active      || 0;
        byStatus["In Progress"] += u.in_progress || 0;
        byStatus.Completed      += u.completed   || 0;
        byStatus.Cancelled      += u.cancelled   || 0;
        totalTasks     += u.total     || 0;
        totalOverdue   += u.overdue   || 0;
        totalCompleted += u.completed || 0;
        if (u.by_priority) Object.entries(u.by_priority).forEach(([k,v])=>{ if(k in byPriority) byPriority[k]+=v||0; });
        if (u.by_oem)      Object.entries(u.by_oem).forEach(([k,v])=>{ byOem[k]=(byOem[k]||0)+(v||0); });
        if (u.by_slot)     Object.entries(u.by_slot).forEach(([k,v])=>{ if(k in bySlot) bySlot[k]+=v||0; });
    });

    const completionRate = totalTasks>0 ? Math.round((totalCompleted/totalTasks)*100) : 0;
    const userPerf = perf.map((u)=>({
        user:            u.user || "",
        total:           u.total       || 0,
        completed:       u.completed   || 0,
        in_progress:     u.in_progress || 0,
        active:          u.active      || 0,
        cancelled:       u.cancelled   || 0,
        overdue:         u.overdue     || 0,
        completion_rate: u.completion_rate ?? (u.total>0 ? Math.round((u.completed/u.total)*100) : 0),
    })).sort((a,b)=>b.total-a.total);

    return {
        summary:          { total:totalTasks, completion_rate:completionRate, overdue:totalOverdue },
        by_status:        byStatus,
        by_priority:      byPriority,
        by_oem:           byOem,
        by_slot:          bySlot,
        user_workload:    userPerf.map(u=>({ user:u.user, task_count:u.total })),
        user_performance: userPerf,
        meta:             apiData.meta || {},
    };
};

// ─── Merge two normalised stats (Overall view) ───────────────────────────────
const mergeStats = (a, b) => {
    const addObj = (x,y) => { const r={...x}; Object.keys(y).forEach(k=>{ r[k]=(r[k]||0)+(y[k]||0); }); return r; };
    const totalA=a.summary.total, totalB=b.summary.total, totalM=totalA+totalB;
    const completedA=Math.round((a.summary.completion_rate/100)*totalA);
    const completedB=Math.round((b.summary.completion_rate/100)*totalB);
    const wMap={};
    [...(a.user_workload||[]),...(b.user_workload||[])].forEach(({user,task_count})=>{ wMap[user]=(wMap[user]||0)+task_count; });
    const perfMap={};
    [...(a.user_performance||[]),...(b.user_performance||[])].forEach((u)=>{
        if (!perfMap[u.user]) { perfMap[u.user]={...u}; }
        else {
            const p=perfMap[u.user];
            p.total+=u.total||0; p.completed+=u.completed||0; p.in_progress+=u.in_progress||0;
            p.active+=u.active||0; p.cancelled+=u.cancelled||0; p.overdue+=u.overdue||0;
            p.completion_rate=p.total>0?Math.round((p.completed/p.total)*100):0;
        }
    });
    return {
        summary:{ total:totalM, completion_rate:totalM>0?Math.round(((completedA+completedB)/totalM)*100):0, overdue:(a.summary.overdue||0)+(b.summary.overdue||0) },
        by_status:   addObj(a.by_status,  b.by_status),
        by_priority: addObj(a.by_priority,b.by_priority),
        by_oem:      addObj(a.by_oem,     b.by_oem),
        by_slot:     addObj(a.by_slot,    b.by_slot),
        user_workload:    Object.entries(wMap).map(([user,task_count])=>({user,task_count})).sort((x,y)=>y.task_count-x.task_count),
        user_performance: Object.values(perfMap).sort((x,y)=>y.total-x.total),
        meta:{},
    };
};

// ─── Donut center plugin ──────────────────────────────────────────────────────
const centerTextPlugin = {
    id:"centerText",
    afterDraw(chart) {
        if (chart.config.type !== "doughnut") return;
        const { width, height, ctx } = chart;
        const total = chart.data.datasets[0]?.data?.reduce((a,b)=>a+b,0)||0;
        ctx.save();
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillStyle="#1a1a2e"; ctx.font="bold 22px sans-serif";
        ctx.fillText(total,width/2,height/2-8);
        ctx.font="12px sans-serif"; ctx.fillStyle="#888";
        ctx.fillText("total",width/2,height/2+12);
        ctx.restore();
    },
};
ChartJS.register(centerTextPlugin);

// ─── MetricCard ───────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, icon, color, bg, pct, loading }) => (
    <Paper elevation={0} sx={{ p:2, borderRadius:"14px", border:"1px solid #e8ecf0", bgcolor:"#fff", position:"relative", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
        <Box sx={{ position:"absolute", top:-12, right:-12, width:64, height:64, borderRadius:"50%", bgcolor:alpha(color,0.06) }} />
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography fontSize={11.5} fontWeight={500} color="text.secondary">{label}</Typography>
            <Box sx={{ width:36, height:36, borderRadius:"10px", bgcolor:bg||alpha(color,0.1), display:"flex", alignItems:"center", justifyContent:"center" }}>
                {React.cloneElement(icon,{ sx:{ fontSize:20, color } })}
            </Box>
        </Box>
        {loading ? <Skeleton width={50} height={30}/> : <Typography fontSize={28} fontWeight={800} color="#1a1a2e" lineHeight={1}>{value}</Typography>}
        {pct!==undefined && (
            <Box mt={1}>
                <LinearProgress variant="determinate" value={Math.min(pct,100)}
                    sx={{ height:3, borderRadius:2, bgcolor:alpha(color,0.12), "& .MuiLinearProgress-bar":{ bgcolor:color, borderRadius:2 } }}/>
            </Box>
        )}
    </Paper>
);

// ─── SectionTitle ─────────────────────────────────────────────────────────────
const SectionTitle = ({ icon, title }) => (
    <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
        {React.cloneElement(icon,{ sx:{ fontSize:16, color:TEAL } })}
        <Typography fontSize={13} fontWeight={700} color="#1a1a2e">{title}</Typography>
    </Box>
);

// ─── ProgressRow ──────────────────────────────────────────────────────────────
const ProgressRow = ({ label, value, max, color }) => (
    <Box mb={1.2}>
        <Box display="flex" justifyContent="space-between" mb={0.4}>
            <Typography fontSize={12} color="text.secondary">{label}</Typography>
            <Typography fontSize={12} fontWeight={700} color={color}>{value}{max>0?` (${Math.round(value/max*100)}%)`:""}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={max>0?Math.min((value/max)*100,100):0}
            sx={{ height:5, borderRadius:3, bgcolor:alpha(color,0.12), "& .MuiLinearProgress-bar":{ bgcolor:color, borderRadius:3 } }}/>
    </Box>
);

// ─── Stacked Bar ──────────────────────────────────────────────────────────────
const StackedBar = ({ completed, in_progress, active, cancelled, total }) => {
    if (total===0) return <Box sx={{ height:8, borderRadius:4, bgcolor:"#e8ecf0" }}/>;
    const pct = (v) => Math.round((v/total)*100);
    const segments = [
        { value:completed,   color:STATUS_COLORS.Completed },
        { value:in_progress, color:STATUS_COLORS["In Progress"] },
        { value:active,      color:STATUS_COLORS.Active },
        { value:cancelled,   color:STATUS_COLORS.Cancelled },
    ].filter(s=>s.value>0);
    return (
        <Box sx={{ display:"flex", height:8, borderRadius:4, overflow:"hidden", bgcolor:"#e8ecf0", width:"100%" }}>
            {segments.map((s,i)=>(
                <Box key={i} sx={{ width:`${pct(s.value)}%`, bgcolor:s.color, minWidth:s.value>0?4:0 }}/>
            ))}
        </Box>
    );
};

// ─── User Workload Table ──────────────────────────────────────────────────────
const UserWorkloadTable = ({ rows, loading }) => {
    if (loading) return <Box>{Array.from({length:5}).map((_,i)=><Skeleton key={i} height={52} sx={{ mb:0.5, borderRadius:2 }}/>)}</Box>;
    if (!rows || rows.length===0) return <Typography fontSize={12} color="text.disabled" py={4} textAlign="center">No data</Typography>;

    return (
        <Box sx={{ overflowX:"auto" }}>
            <Table size="small" sx={{ minWidth:520 }}>
                <TableHead>
                    <TableRow sx={{ "& th":{ borderBottom:"1px solid #f0f2f5", pb:1.2, pt:0.5 } }}>
                        <TableCell sx={{ fontSize:12, fontWeight:600, color:"text.secondary", pl:0 }}>User</TableCell>
                        <TableCell align="center" sx={{ fontSize:12, fontWeight:600, color:"text.secondary" }}>Total</TableCell>
                        <TableCell align="center" sx={{ fontSize:12, fontWeight:700, color:STATUS_COLORS.Completed }}>Done</TableCell>
                        <TableCell align="center" sx={{ fontSize:12, fontWeight:700, color:STATUS_COLORS["In Progress"] }}>In prog</TableCell>
                        <TableCell align="center" sx={{ fontSize:12, fontWeight:700, color:STATUS_COLORS.Active }}>Active</TableCell>
                        <TableCell align="center" sx={{ fontSize:12, fontWeight:700, color:"#e65100" }}>Overdue</TableCell>
                        <TableCell sx={{ fontSize:12, fontWeight:600, color:"text.secondary", minWidth:200 }}>Completion rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((u,idx)=>{
                        const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                        const rate        = u.completion_rate ?? 0;
                        const rateColor   = rate>=75 ? "#2e7d32" : rate>=40 ? "#f57c00" : "#c62828";
                        return (
                            <TableRow key={u.user} sx={{ "&:last-child td":{ border:0 }, "& td":{ borderBottom:"1px solid #f7f8fa", py:1.4 }, "&:hover":{ bgcolor:alpha(TEAL,0.02) } }}>
                                <TableCell sx={{ pl:0 }}>
                                    <Box display="flex" alignItems="center" gap={1.2}>
                                        <Avatar sx={{ width:36, height:36, fontSize:11, fontWeight:700, bgcolor:alpha(avatarColor,0.15), color:avatarColor, border:`1.5px solid ${alpha(avatarColor,0.25)}`, flexShrink:0 }}>
                                            {getInitials(u.user)}
                                        </Avatar>
                                        <Box>
                                            <Tooltip title={u.user} arrow placement="top">
                                                <Typography fontSize={12.5} fontWeight={600} color="#1a1a2e" noWrap sx={{ maxWidth:160 }}>
                                                    {getDisplayName(u.user)}
                                                </Typography>
                                            </Tooltip>
                                            <Typography fontSize={11} color="text.disabled">{getDomain(u.user)}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center"><Typography fontSize={13} fontWeight={700} color="#1a1a2e">{u.total}</Typography></TableCell>
                                <TableCell align="center"><Typography fontSize={13} fontWeight={600} color={STATUS_COLORS.Completed}>{u.completed}</Typography></TableCell>
                                <TableCell align="center"><Typography fontSize={13} fontWeight={600} color={STATUS_COLORS["In Progress"]}>{u.in_progress}</Typography></TableCell>
                                <TableCell align="center"><Typography fontSize={13} fontWeight={600} color={STATUS_COLORS.Active}>{u.active}</Typography></TableCell>
                                <TableCell align="center">
                                    {u.overdue>0
                                        ? <Box display="flex" alignItems="center" justifyContent="center" gap={0.4}><WarningAmberOutlinedIcon sx={{ fontSize:13, color:"#e65100" }}/><Typography fontSize={13} fontWeight={600} color="#e65100">{u.overdue}</Typography></Box>
                                        : <Typography fontSize={13} color="text.disabled">—</Typography>
                                    }
                                </TableCell>
                                <TableCell>
                                    <StackedBar completed={u.completed} in_progress={u.in_progress} active={u.active} cancelled={u.cancelled||0} total={u.total}/>
                                    <Typography fontSize={11.5} fontWeight={700} color={rateColor} mt={0.5}>{rate}%</Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
    const navigate = useNavigate();

    const userEmail = useMemo(()=>(
        getDecreyptedData("userID")||getDecreyptedData("email")||getDecreyptedData("userEmail")||""
    ),[]);

    const [dateFrom, setDateFrom] = useState(getDefaultFrom());
    const [dateTo,   setDateTo]   = useState(todayStr());
    const [viewMode, setViewMode] = useState("assigned");
    const [assignedStats, setAssignedStats] = useState(EMPTY);
    const [myTaskStats,   setMyTaskStats]   = useState(EMPTY);
    const [loading,    setLoading]    = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAll = useCallback(async (isRefresh=false) => {
        if (!userEmail) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const headers = { "Content-Type":"application/json" };
            const [assignRes, myRes] = await Promise.allSettled([
                fetch(`${BASE_URL}${API.ASSIGNED}`,{ method:"POST", headers, body:JSON.stringify({ assigned_by:userEmail, date_from:dateFrom, date_to:dateTo }) }),
                fetch(`${BASE_URL}${API.MYTASKS}`, { method:"POST", headers, body:JSON.stringify({ owner:userEmail,      date_from:dateFrom, date_to:dateTo }) }),
            ]);
            const parse = async (r) => { if(r.status!=="fulfilled") return {}; try{ return await r.value.json(); }catch{ return {}; } };
            const [assignedRaw, myRaw] = await Promise.all([parse(assignRes),parse(myRes)]);
            setAssignedStats(normaliseApiResponse(assignedRaw));
            setMyTaskStats(normaliseApiResponse(myRaw));
        } catch(err) {
            console.error("Dashboard fetchAll:",err);
            Swal.fire("Error","Failed to load dashboard data.","error");
        } finally { setLoading(false); setRefreshing(false); }
    },[userEmail,dateFrom,dateTo]);

    useEffect(()=>{ const t=setTimeout(()=>fetchAll(),400); return ()=>clearTimeout(t); },[fetchAll]);

    const stats = useMemo(()=>{
        if(viewMode==="assigned") return assignedStats;
        if(viewMode==="my")       return myTaskStats;
        return mergeStats(assignedStats,myTaskStats);
    },[viewMode,assignedStats,myTaskStats]);

    const summary    = stats.summary         || EMPTY.summary;
    const byStatus   = stats.by_status       || EMPTY.by_status;
    const byPriority = stats.by_priority     || EMPTY.by_priority;
    const byOem      = stats.by_oem          || {};
    const bySlot     = stats.by_slot         || EMPTY.by_slot;
    const userPerf   = stats.user_performance || [];
    const total      = summary.total || 0;

    const donutData = useMemo(()=>({
        labels:["Active","In Progress","Completed","Cancelled"],
        datasets:[{ data:[byStatus.Active,byStatus["In Progress"],byStatus.Completed,byStatus.Cancelled], backgroundColor:[STATUS_COLORS.Active,STATUS_COLORS["In Progress"],STATUS_COLORS.Completed,STATUS_COLORS.Cancelled], borderWidth:2, borderColor:"#fff", hoverOffset:6 }],
    }),[byStatus]);

    const prioData = useMemo(()=>({
        labels:["Critical","High","Medium","Low"],
        datasets:[{ data:[byPriority.Critical,byPriority.High,byPriority.Medium,byPriority.Low], backgroundColor:[PRIO_COLORS.Critical,PRIO_COLORS.High,PRIO_COLORS.Medium,PRIO_COLORS.Low], borderRadius:6, borderWidth:0 }],
    }),[byPriority]);

    const oemEntries = useMemo(()=>Object.entries(byOem).sort((a,b)=>b[1]-a[1]),[byOem]);
    const oemBarData = useMemo(()=>({
        labels:oemEntries.map(e=>e[0]),
        datasets:[{ data:oemEntries.map(e=>e[1]), backgroundColor:oemEntries.map((_,i)=>OEM_PALETTE[i%OEM_PALETTE.length]+"cc"), borderRadius:5, borderWidth:0 }],
    }),[oemEntries]);

    const slotData = useMemo(()=>({
        labels:["Morning","Afternoon","Evening","Night"],
        datasets:[{ data:[bySlot.Morning,bySlot.Afternoon,bySlot.Evening,bySlot.Night], backgroundColor:[SLOT_COLORS.Morning+"cc",SLOT_COLORS.Afternoon+"cc",SLOT_COLORS.Evening+"cc",SLOT_COLORS.Night+"cc"], borderColor:[SLOT_COLORS.Morning,SLOT_COLORS.Afternoon,SLOT_COLORS.Evening,SLOT_COLORS.Night], borderWidth:1.5 }],
    }),[bySlot]);

    const donutOpts = { responsive:true, maintainAspectRatio:false, cutout:"65%", plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:(ctx)=>` ${ctx.label}: ${ctx.raw}` } } } };
    const barOpts   = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, grid:{ color:"rgba(0,0,0,0.04)" }, ticks:{ font:{ size:11 } } }, x:{ grid:{ display:false }, ticks:{ font:{ size:11 } } } } };
    const hBarOpts  = { indexAxis:"y", responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true, grid:{ color:"rgba(0,0,0,0.04)" }, ticks:{ font:{ size:11 } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:11 } } } } };
    const polarOpts = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ r:{ ticks:{ display:false }, grid:{ color:"rgba(0,0,0,0.06)" } } } };

    const hasPriority = Object.values(byPriority).some(v=>v>0);
    const hasOem      = oemEntries.length>0;
    const hasSlot     = Object.values(bySlot).some(v=>v>0);
    const noBreakdownNote = viewMode==="assigned" && !hasPriority && !hasOem && !hasSlot && !loading;

    const EmptyChart = ({ icon, msg }) => (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={1}>
            {React.cloneElement(icon,{ sx:{ fontSize:32, color:"#e8ecf0" } })}
            <Typography fontSize={12} color="text.disabled" textAlign="center">{msg}</Typography>
        </Box>
    );

    const noDataMsg = viewMode==="assigned"
        ? "Not returned by assigned API — add by_oem / by_priority / by_slot to each user_performance row in the backend"
        : "No data";

    return (
        <Box sx={{ p:3, bgcolor:"#f4f6f9", minHeight:"100vh" }}>
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small"/>} sx={{ fontSize:13 }}>
                    <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={()=>navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={()=>navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Dashboard</Typography>
                </Breadcrumbs>
            </Box>

            <Paper elevation={0} sx={{ borderRadius:"20px", overflow:"hidden", border:"1px solid #e8ecf0", bgcolor:"#fff", boxShadow:"0 2px 20px rgba(0,0,0,0.07)" }}>

                {/* ── Header ── */}
                <Box sx={{ px:3, pt:3, pb:2.5, borderBottom:"1px solid #f0f2f5", background:`linear-gradient(135deg,#fff 60%,${alpha(TEAL,0.03)} 100%)` }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ width:48, height:48, borderRadius:"13px", background:`linear-gradient(135deg,${TEAL} 0%,#26a69a 100%)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 14px ${alpha(TEAL,0.35)}`, flexShrink:0 }}>
                                <BarChartOutlinedIcon sx={{ color:"#fff", fontSize:26 }}/>
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Daily Task Review</Typography>
                                <Typography fontSize={13} color="text.secondary" mt={0.2}>Analytics dashboard</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            <Box display="flex" alignItems="center" gap={1}>
                                <TextField size="small" label="From" type="date" value={dateFrom}
                                    onChange={(e)=>{ if(e.target.value<=dateTo) setDateFrom(e.target.value); }}
                                    inputProps={{ max:dateTo }} InputLabelProps={{ shrink:true }}
                                    sx={{ minWidth:148, "& .MuiOutlinedInput-root":{ borderRadius:"10px", "&:hover fieldset":{ borderColor:TEAL }, "&.Mui-focused fieldset":{ borderColor:TEAL } }, "& label.Mui-focused":{ color:TEAL } }}/>
                                <Typography color="text.secondary" fontWeight={700}>→</Typography>
                                <TextField size="small" label="To" type="date" value={dateTo}
                                    onChange={(e)=>{ if(e.target.value>=dateFrom) setDateTo(e.target.value); }}
                                    inputProps={{ min:dateFrom, max:todayStr() }} InputLabelProps={{ shrink:true }}
                                    sx={{ minWidth:148, "& .MuiOutlinedInput-root":{ borderRadius:"10px", "&:hover fieldset":{ borderColor:TEAL }, "&.Mui-focused fieldset":{ borderColor:TEAL } }, "& label.Mui-focused":{ color:TEAL } }}/>
                            </Box>
                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_,v)=>v&&setViewMode(v)} size="small"
                                sx={{ bgcolor:"#f3f4f6", borderRadius:"10px", p:0.3, "& .MuiToggleButton-root":{ border:"none", borderRadius:"8px !important", px:1.5, fontSize:12.5, fontWeight:600, color:"#6b7280", "&.Mui-selected":{ bgcolor:"#1a1a2e", color:"#fff" } } }}>
                                <ToggleButton value="assigned"><AssignmentTurnedInOutlinedIcon sx={{ fontSize:15, mr:0.5 }}/>Assigned</ToggleButton>
                                <ToggleButton value="my"><TaskAltOutlinedIcon sx={{ fontSize:15, mr:0.5 }}/>My Tasks</ToggleButton>
                                <ToggleButton value="overall"><BarChartOutlinedIcon sx={{ fontSize:15, mr:0.5 }}/>Overall</ToggleButton>
                            </ToggleButtonGroup>
                            <Button variant="outlined"
                                startIcon={<RefreshIcon sx={{ fontSize:"17px !important", animation:refreshing?"spin .8s linear infinite":"none", "@keyframes spin":{ to:{ transform:"rotate(360deg)" } } }}/>}
                                onClick={()=>fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform:"none", fontWeight:600, borderRadius:"10px", fontSize:13, px:2, height:36, borderColor:TEAL_MID, color:TEAL, "&:hover":{ borderColor:TEAL, bgcolor:alpha(TEAL,0.05) } }}>
                                {refreshing?"…":"Refresh"}
                            </Button>
                        </Box>
                    </Box>
                    {userEmail && (
                        <Box mt={1.5} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography fontSize={12} color="text.secondary">User:</Typography>
                            <Chip label={userEmail} size="small" sx={{ height:22, fontSize:11.5, fontWeight:600, bgcolor:alpha(TEAL,0.08), color:TEAL_DARK, border:`1px solid ${TEAL_MID}` }}/>
                            <Typography fontSize={12} color="text.secondary">·</Typography>
                            <Chip icon={<CalendarTodayOutlinedIcon sx={{ fontSize:"12px !important" }}/>}
                                label={`${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`} size="small"
                                sx={{ height:22, fontSize:11.5, fontWeight:600, bgcolor:alpha(TEAL,0.08), color:TEAL_DARK, border:`1px solid ${TEAL_MID}` }}/>
                            <Chip label={viewMode==="assigned"?"Assigned Tasks":viewMode==="my"?"My Tasks":"Overall"} size="small"
                                sx={{ height:22, fontSize:11.5, fontWeight:600, bgcolor:"#1a1a2e", color:"#fff" }}/>
                            {stats.meta?.total_users>0 && (
                                <Chip label={`${stats.meta.total_users} users`} size="small"
                                    sx={{ height:22, fontSize:11.5, fontWeight:600, bgcolor:alpha(TEAL,0.08), color:TEAL_DARK, border:`1px solid ${TEAL_MID}` }}/>
                            )}
                        </Box>
                    )}
                </Box>

                <Box sx={{ p:3 }}>

                    {/* ── Metric Cards ── */}
                    <Box display="grid" sx={{ gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:1.5, mb:3 }}>
                        <MetricCard label="Total Tasks"  value={loading?"—":total}                         icon={<AssignmentIndOutlinedIcon/>} color={TEAL}    bg={TEAL_LIGHT} pct={100}                                                                    loading={loading}/>
                        <MetricCard label="Active"       value={loading?"—":byStatus.Active}               icon={<HourglassEmptyIcon/>}        color="#f57c00" bg="#fff3e0"    pct={total>0?Math.round(byStatus.Active/total*100):0}                         loading={loading}/>
                        <MetricCard label="In Progress"  value={loading?"—":byStatus["In Progress"]}       icon={<PlayCircleOutlineIcon/>}      color="#2e7d32" bg="#e8f5e9"    pct={total>0?Math.round(byStatus["In Progress"]/total*100):0}                 loading={loading}/>
                        <MetricCard label="Completed"    value={loading?"—":byStatus.Completed}            icon={<CheckCircleOutlineIcon/>}     color="#1565c0" bg="#e3f2fd"    pct={total>0?Math.round(byStatus.Completed/total*100):0}                      loading={loading}/>
                        <MetricCard label="Cancelled"    value={loading?"—":byStatus.Cancelled}            icon={<CancelOutlinedIcon/>}         color="#c62828" bg="#fdecea"    pct={total>0?Math.round(byStatus.Cancelled/total*100):0}                      loading={loading}/>
                        <MetricCard label="Overdue"      value={loading?"—":summary.overdue}               icon={<WarningAmberOutlinedIcon/>}   color="#e65100" bg="#fff3e0"    pct={total>0?Math.round(summary.overdue/total*100):0}                         loading={loading}/>
                        <MetricCard label="Completion %" value={loading?"—":`${summary.completion_rate}%`} icon={<TrendingUpOutlinedIcon/>}     color={TEAL}    bg={TEAL_LIGHT} pct={summary.completion_rate}                                               loading={loading}/>
                    </Box>

                    {/* ── Row 1: Donut + Priority ── */}
                    <Box display="grid" sx={{ gridTemplateColumns:"1fr 1fr", gap:2, mb:2 }}>
                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<BarChartOutlinedIcon/>} title="Task status breakdown"/>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
                                {Object.entries(STATUS_COLORS).map(([s,c])=>(
                                    <Box key={s} display="flex" alignItems="center" gap={0.5}>
                                        <Box sx={{ width:10, height:10, borderRadius:"2px", bgcolor:c }}/>
                                        <Typography fontSize={11} color="text.secondary">{s} ({byStatus[s]||0})</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ height:220, position:"relative" }}>
                                {loading ? <Skeleton variant="circular" width={220} height={220} sx={{ mx:"auto" }}/> : <Doughnut data={donutData} options={donutOpts}/>}
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<FlagOutlinedIcon/>} title="Priority distribution"/>
                            <Box sx={{ height:200, position:"relative", mb:1 }}>
                                {loading
                                    ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius:2 }}/>
                                    : !hasPriority
                                        ? <EmptyChart icon={<FlagOutlinedIcon/>} msg={noDataMsg}/>
                                        : <Bar data={prioData} options={barOpts}/>
                                }
                            </Box>
                            <Box display="flex" gap={1.5} flexWrap="wrap">
                                {Object.entries(PRIO_COLORS).map(([p,c])=>(
                                    <Box key={p} sx={{ flex:1, minWidth:60, p:1, borderRadius:"8px", bgcolor:alpha(c,0.08), textAlign:"center", border:`1px solid ${alpha(c,0.2)}` }}>
                                        <Typography fontSize={16} fontWeight={800} color={c}>{byPriority[p]||0}</Typography>
                                        <Typography fontSize={10} color="text.secondary">{p}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    {/* ── Row 2: OEM + Slot ── */}
                    <Box display="grid" sx={{ gridTemplateColumns:"1fr 1fr", gap:2, mb:2 }}>
                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<RouterOutlinedIcon/>} title="Tasks by OEM"/>
                            {loading
                                ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius:2 }}/>
                                : !hasOem
                                    ? <Box sx={{ height:180 }}><EmptyChart icon={<RouterOutlinedIcon/>} msg={noDataMsg}/></Box>
                                    : <Box sx={{ height:Math.max(180,oemEntries.length*44+20), position:"relative" }}><Bar data={oemBarData} options={hBarOpts}/></Box>
                            }
                        </Paper>

                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<WbSunnyOutlinedIcon/>} title="Slot distribution"/>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                {Object.entries(SLOT_COLORS).map(([s,c])=>(
                                    <Box key={s} display="flex" alignItems="center" gap={0.5}>
                                        <Box sx={{ width:10, height:10, borderRadius:"50%", bgcolor:c }}/>
                                        <Typography fontSize={11} color="text.secondary">{s} ({bySlot[s]||0})</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ height:200, position:"relative" }}>
                                {loading
                                    ? <Skeleton variant="circular" width={200} height={200} sx={{ mx:"auto" }}/>
                                    : !hasSlot
                                        ? <EmptyChart icon={<WbSunnyOutlinedIcon/>} msg={noDataMsg}/>
                                        : <PolarArea data={slotData} options={polarOpts}/>
                                }
                            </Box>
                        </Paper>
                    </Box>

                    {/* ── Backend note for assigned view ── */}
                    {noBreakdownNote && (
                        <Paper elevation={0} sx={{ p:2, mb:2, borderRadius:"12px", border:"1px solid #fff3e0", bgcolor:"#fffbf0", display:"flex", alignItems:"flex-start", gap:1 }}>
                            <WarningAmberOutlinedIcon sx={{ fontSize:18, color:"#f57c00", mt:0.2, flexShrink:0 }}/>
                            <Typography fontSize={12.5} color="#b45309" lineHeight={1.7}>
                                The <strong>Assigned</strong> API does not return OEM, slot or priority breakdowns.
                                To enable these charts, add <code style={{background:"#fef3c7",padding:"1px 4px",borderRadius:3}}>by_oem</code>, <code style={{background:"#fef3c7",padding:"1px 4px",borderRadius:3}}>by_priority</code>, and <code style={{background:"#fef3c7",padding:"1px 4px",borderRadius:3}}>by_slot</code> to each <code style={{background:"#fef3c7",padding:"1px 4px",borderRadius:3}}>user_performance</code> row in your Django view.
                                Switch to <strong>My Tasks</strong> or <strong>Overall</strong> to see them now.
                            </Typography>
                        </Paper>
                    )}

                    {/* ── Row 3: User Workload Table + Completion ── */}
                    <Box display="grid" sx={{ gridTemplateColumns:"1.7fr 1fr", gap:2 }}>
                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<PeopleOutlinedIcon/>} title="User workload"/>
                            <UserWorkloadTable rows={userPerf} loading={loading}/>
                        </Paper>

                        <Paper elevation={0} sx={{ p:2.5, borderRadius:"14px", border:"1px solid #e8ecf0" }}>
                            <SectionTitle icon={<TrendingUpOutlinedIcon/>} title="Completion summary"/>
                            <Box display="flex" alignItems="center" gap={3} mb={2.5}>
                                <Box sx={{ position:"relative", width:90, height:90, flexShrink:0 }}>
                                    <svg width="90" height="90">
                                        <circle cx="45" cy="45" r="36" fill="none" stroke="#e8ecf0" strokeWidth="9"/>
                                        <circle cx="45" cy="45" r="36" fill="none" stroke={TEAL} strokeWidth="9"
                                            strokeDasharray={`${(summary.completion_rate/100)*226} 226`}
                                            strokeLinecap="round" transform="rotate(-90 45 45)"/>
                                    </svg>
                                    <Box sx={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                                        <Typography fontWeight={800} fontSize={18} color={TEAL} lineHeight={1}>{summary.completion_rate}%</Typography>
                                        <Typography fontSize={9} color="text.secondary">done</Typography>
                                    </Box>
                                </Box>
                                <Box flex={1}>
                                    <Typography fontSize={13} color="text.secondary" mb={0.5}>{byStatus.Completed} of {total} tasks completed</Typography>
                                    {summary.overdue>0 && (
                                        <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize:"13px !important", color:"#e65100 !important" }}/>}
                                            label={`${summary.overdue} overdue`} size="small"
                                            sx={{ bgcolor:"#fff3e0", color:"#e65100", fontWeight:600, fontSize:11, border:"1px solid #ffcc80" }}/>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{ borderTop:"1px solid #f0f2f5", pt:1.5 }}>
                                <ProgressRow label="Active"      value={byStatus.Active}         max={total} color="#f57c00"/>
                                <ProgressRow label="In Progress" value={byStatus["In Progress"]} max={total} color="#2e7d32"/>
                                <ProgressRow label="Completed"   value={byStatus.Completed}       max={total} color="#1565c0"/>
                                <ProgressRow label="Cancelled"   value={byStatus.Cancelled}       max={total} color="#c62828"/>
                            </Box>
                            <Box mt={2} pt={1.5} sx={{ borderTop:"1px solid #f0f2f5" }}>
                                <Typography fontSize={11} fontWeight={600} color="text.secondary" mb={1}>Bar legend</Typography>
                                {Object.entries(STATUS_COLORS).map(([s,c])=>(
                                    <Box key={s} display="flex" alignItems="center" gap={0.8} mb={0.6}>
                                        <Box sx={{ width:24, height:7, borderRadius:2, bgcolor:c }}/>
                                        <Typography fontSize={11} color="text.secondary">{s}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                </Box>

                {/* Footer */}
                <Box sx={{ px:3, py:1.5, borderTop:"1px solid #f0f2f5", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <Typography variant="caption" color="text.disabled">Daily Task Review · Analytics Dashboard</Typography>
                    <Typography variant="caption" color="text.disabled">{total} total tasks · {fmtDate(dateFrom)} – {fmtDate(dateTo)}</Typography>
                </Box>

            </Paper>
        </Box>
    );
};

export default Dashboard;
