
// import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar, LinearProgress,
//     ToggleButton, ToggleButtonGroup, Drawer, Autocomplete, CircularProgress,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import CloseIcon from "@mui/icons-material/Close";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
// import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
// import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
// import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
// import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import Swal from "sweetalert2";
// import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useNavigate } from "react-router-dom";
// import { getDecreyptedData } from "../../../utils/localstorage";

// // ─── theme ────────────────────────────────────────────────────────────────────
// const TEAL = "#228b7f";
// const TEAL_DARK = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── static options ───────────────────────────────────────────────────────────
// const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

// const SLOT_OPTIONS = [
//     { value: "Morning", label: "🌤  Morning", color: "#f57c00" },
//     { value: "Afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "Evening", label: "🌙  Evening", color: "#5c6bc0" },
//     { value: "Night", label: "🌌  Night", color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High", color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium", color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low", color: "#2e7d32", bg: "#e8f5e9" },
// ];

// const STATUS_OPTIONS = ["Active", "In Progress", "Completed", "Cancelled"];
// const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];
// const REMINDER_OPTIONS = ["None", "Daily", "Weekly", "Monthly"];

// const KANBAN_COLS = [
//     { key: "Active", label: "Active", color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
//     { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Completed", label: "Done", color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Cancelled", label: "Cancelled", color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
// ];

// const BASE_URL = "https://commtoolapi.mcpspmis.com/";

// const API = {
//     CREATE: "dailytask_review/assign_task/create/",
//     UPDATE: (pk) => `dailytask_review/assign_task/update-task/${pk}/`,
//     DELETE: (pk) => `dailytask_review/assign_task/delete-task/${pk}/`,
//     SEND_REMINDER: (pk) => `dailytask_review/tasks/send-reminder/${pk}/`,
//     GET_TASKS: "dailytask_review/assign_task/get/",
//     // ✅ FIX: This matches AddTask's GET_ALL — uses POST with userID (FormData)
//     GET_TASK_OPTIONS: "dailytask_review/get-task/",
// };

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const nowISO = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate = (iso) =>
//     iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// const toLocalDateStr = (date) => {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// };

// const todayStr = () => toLocalDateStr(new Date());

// const isOverdue = (iso, status) =>
//     iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();
// const statusColor = (s) =>
//     ({ Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
// const slotMeta = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());
// const getFrequency = (row) => row.frequency ?? row.reminder_frequency ?? "None";

// // ─── Get logged-in user email from localStorage ────────────────────────────
// const getLoggedInUserEmail = () => {
//     try {
//         const keys = ["user", "userInfo", "userData", "loginData"];
//         for (const key of keys) {
//             const raw = localStorage.getItem(key);
//             if (raw) {
//                 const obj = JSON.parse(raw);
//                 const email = obj.email ?? obj.emailaddress ?? obj.username ?? obj.Email ?? "";
//                 if (email && email.includes("@")) return email;
//             }
//         }
//         return "";
//     } catch {
//         return "";
//     }
// };

// const EMPTY_FORM = {
//     task: null, taskInput: "",
//     assignee: "",
//     recipients: [], recipientInput: "",
//     oem: "", slot: "",
//     priority: "Medium", status: "Active",
//     deadline: "",
//     reminderFrequency: "None",
//     remarks: "",
// };

// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "10px",
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// // ─── Direct API fetch helper ──────────────────────────────────────────────────
// const apiFetch = async (endpoint, method = "GET", body = null) => {
//     const url = `${BASE_URL}${endpoint}`;
//     const options = {
//         method,
//         headers: { "Content-Type": "application/json" },
//     };
//     if (body) options.body = JSON.stringify(body);
//     const res = await fetch(url, options);
//     if (!res.ok) throw new Error(`API error ${res.status}`);
//     return res.json();
// };

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// const StatCard = ({ label, count, icon, color, bg, active, onClick, loading }) => (
//     <Paper onClick={onClick} elevation={0} sx={{
//         flex: 1, minWidth: 150, p: 2.2, borderRadius: "16px", cursor: "pointer",
//         border: `1.5px solid ${active ? color : "#e8ecf0"}`,
//         bgcolor: active ? alpha(color, 0.05) : "#fff",
//         transition: "all .2s ease",
//         "&:hover": { borderColor: color, bgcolor: alpha(color, 0.04), transform: "translateY(-2px)", boxShadow: `0 6px 24px ${alpha(color, 0.18)}` },
//         boxShadow: active ? `0 4px 20px ${alpha(color, 0.2)}` : "0 1px 4px rgba(0,0,0,0.05)",
//         position: "relative", overflow: "hidden",
//     }}>
//         <Box sx={{ position: "absolute", top: -10, right: -10, width: 70, height: 70, borderRadius: "50%", bgcolor: alpha(color, 0.06), pointerEvents: "none" }} />
//         <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
//             <Box>
//                 <Typography fontSize={11.5} fontWeight={500} color="text.secondary" mb={0.5} letterSpacing=".02em">{label}</Typography>
//                 {loading
//                     ? <Skeleton width={40} height={32} />
//                     : <Typography fontSize={28} fontWeight={800} color={active ? color : "#1a1a2e"} lineHeight={1}>{count}</Typography>
//                 }
//             </Box>
//             <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: active ? alpha(color, 0.15) : bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
//             </Box>
//         </Box>
//         {active && <Box sx={{ mt: 1.2, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />}
//     </Paper>
// );

// // ─── Analytics Panel ──────────────────────────────────────────────────────────
// const AnalyticsPanel = ({ tasks, open, onClose }) => {
//     const stats = useMemo(() => {
//         const total = tasks.length;
//         const byStatus = { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
//         const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//         const byOEM = {};
//         const bySlot = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
//         const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;
//         tasks.forEach(t => {
//             if (byStatus[t.status] !== undefined) byStatus[t.status]++;
//             if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
//             if (t.oem) byOEM[t.oem] = (byOEM[t.oem] || 0) + 1;
//             const slot = t.slot ? t.slot.charAt(0).toUpperCase() + t.slot.slice(1).toLowerCase() : "";
//             if (bySlot[slot] !== undefined) bySlot[slot]++;
//         });
//         const completionRate = total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;
//         const ownerMap = {};
//         tasks.forEach(t => {
//             const owners = Array.isArray(t.owner) ? t.owner : (t.owner ? [t.owner] : []);
//             owners.forEach(o => { ownerMap[o] = (ownerMap[o] || 0) + 1; });
//         });
//         const topOwners = Object.entries(ownerMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
//         return { total, byStatus, byPriority, byOEM, bySlot, completionRate, overdueCount, topOwners };
//     }, [tasks]);

//     const ProgressRow = ({ label, value, max, color }) => (
//         <Box mb={1.5}>
//             <Box display="flex" justifyContent="space-between" mb={0.5}>
//                 <Typography fontSize={12.5} color="text.secondary">{label}</Typography>
//                 <Typography fontSize={12.5} fontWeight={700} color={color}>{value}</Typography>
//             </Box>
//             <LinearProgress variant="determinate" value={max > 0 ? (value / max) * 100 : 0}
//                 sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
//         </Box>
//     );

//     return (
//         <Drawer anchor="right" open={open} onClose={onClose}
//             PaperProps={{ sx: { width: 380, bgcolor: "#f8fafc", border: "none" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />
//             <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #eee", bgcolor: "#fff" }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Box>
//                         <Typography fontWeight={700} fontSize={16}>Analytics Overview</Typography>
//                         <Typography fontSize={12} color="text.secondary">Live task stats · {stats.total} total tasks</Typography>
//                     </Box>
//                     <IconButton size="small" onClick={onClose}
//                         sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                         <CloseIcon sx={{ fontSize: 17 }} />
//                     </IconButton>
//                 </Box>
//             </Box>
//             <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>
//                 {stats.total === 0 ? (
//                     <Box textAlign="center" py={6}>
//                         <Typography fontSize={13} color="text.secondary">No tasks to analyse for this date.</Typography>
//                     </Box>
//                 ) : (
//                     <>
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                             <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                                 <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Completion Rate
//                             </Typography>
//                             <Box display="flex" alignItems="center" gap={2}>
//                                 <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
//                                     <svg width="80" height="80">
//                                         <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
//                                         <circle cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
//                                             strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
//                                             strokeLinecap="round" transform="rotate(-90 40 40)" />
//                                     </svg>
//                                     <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 16, color: TEAL }}>
//                                         {stats.completionRate}%
//                                     </Typography>
//                                 </Box>
//                                 <Box flex={1}>
//                                     <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} done</Typography>
//                                     {stats.overdueCount > 0 && (
//                                         <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                             label={`${stats.overdueCount} overdue`} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
//                                     )}
//                                 </Box>
//                             </Box>
//                         </Paper>
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                             <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
//                             <ProgressRow label="Active" value={stats.byStatus["Active"]} max={stats.total} color="#f57c00" />
//                             <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
//                             <ProgressRow label="Completed" value={stats.byStatus["Completed"]} max={stats.total} color="#1565c0" />
//                             <ProgressRow label="Cancelled" value={stats.byStatus["Cancelled"]} max={stats.total} color="#c62828" />
//                         </Paper>
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                             <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
//                             {PRIORITY_OPTIONS.map(p => (
//                                 <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
//                             ))}
//                         </Paper>
//                         {Object.keys(stats.byOEM).length > 0 && (
//                             <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                                 <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
//                                 {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
//                                     <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
//                                 ))}
//                             </Paper>
//                         )}
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                             <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
//                             <Box display="flex" gap={1} flexWrap="wrap">
//                                 {SLOT_OPTIONS.map(s => {
//                                     const cnt = stats.bySlot[s.value] || 0;
//                                     const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
//                                     return (
//                                         <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px", bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
//                                             <Typography fontSize={18}>{s.label.split("  ")[0]}</Typography>
//                                             <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
//                                             <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>
//                         </Paper>
//                         {stats.topOwners.length > 0 && (
//                             <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                                 <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                                     <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Owners
//                                 </Typography>
//                                 {stats.topOwners.map(([name, cnt]) => (
//                                     <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
//                                         <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                             {(name[0] || "?").toUpperCase()}
//                                         </Avatar>
//                                         <Box flex={1} minWidth={0}>
//                                             <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                                 <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
//                                                 <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
//                                             </Box>
//                                             <LinearProgress variant="determinate"
//                                                 value={(cnt / (stats.topOwners[0]?.[1] || 1)) * 100}
//                                                 sx={{ height: 4, borderRadius: 2, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 } }} />
//                                         </Box>
//                                     </Box>
//                                 ))}
//                             </Paper>
//                         )}
//                     </>
//                 )}
//             </Box>
//         </Drawer>
//     );
// };

// // ─── Kanban Card ──────────────────────────────────────────────────────────────
// const KanbanCard = ({ row, onEdit, onDelete, onSendReminder, onStatusChange }) => {
//     const pm = priorityMeta(row.priority);
//     const sm = slotMeta(row.slot);
//     const overdue = isOverdue(row.deadline, row.status);
//     const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
//     const freq = getFrequency(row);

//     return (
//         <Paper elevation={0} sx={{
//             p: 2, borderRadius: "12px", mb: 1.5, cursor: "grab",
//             border: `1px solid ${overdue ? alpha("#c62828", 0.4) : "#e8ecf0"}`,
//             bgcolor: overdue ? "#fff9f9" : "#fff",
//             transition: "all .15s",
//             "&:hover": { borderColor: TEAL_MID, boxShadow: `0 4px 12px ${alpha(TEAL, 0.1)}`, transform: "translateY(-1px)" },
//         }}
//             draggable
//             onDragStart={(e) => { e.dataTransfer.setData("cardId", row.id); e.dataTransfer.setData("fromStatus", row.status); }}
//         >
//             <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
//                 <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
//                     <Chip label={row.priority || "—"} size="small"
//                         sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                     {row.id && (
//                         <Chip label={`#${row.id}`} size="small"
//                             sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 700, fontSize: 10, height: 18 }} />
//                     )}
//                     {/* ✅ FIX: Show task_id (DTR... format) on kanban card */}
//                     {row.task_id && (
//                         <Chip label={row.task_id} size="small"
//                             sx={{ bgcolor: alpha("#7c3aed", 0.08), color: "#5b21b6", fontWeight: 700, fontSize: 10, height: 18, fontFamily: "monospace" }} />
//                     )}
//                 </Box>
//                 <Box display="flex" gap={0.5}>
//                     {overdue && <Tooltip title="Overdue!" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} /></Tooltip>}
//                     {freq && freq !== "None" && (
//                         <Tooltip title={`Send ${freq} reminder`} arrow>
//                             <IconButton size="small" onClick={() => onSendReminder(row)}
//                                 sx={{ p: 0.3, color: "#7c3aed", "&:hover": { bgcolor: "#f3e8ff" } }}>
//                                 <NotificationsActiveOutlinedIcon sx={{ fontSize: 14 }} />
//                             </IconButton>
//                         </Tooltip>
//                     )}
//                     <Tooltip title="Edit" arrow>
//                         <IconButton size="small" onClick={() => onEdit(row)} sx={{ p: 0.3, color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                             <EditOutlinedIcon sx={{ fontSize: 14 }} />
//                         </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete" arrow>
//                         <IconButton size="small" onClick={() => onDelete(row)} sx={{ p: 0.3, color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                             <DeleteOutlineIcon sx={{ fontSize: 14 }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>
//             <Typography fontSize={13} fontWeight={700} color="#1a1a2e" mb={0.8} lineHeight={1.4}
//                 sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//                 {row.task}
//             </Typography>
//             <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
//                 {row.oem && <Chip label={row.oem} size="small" sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18 }} />}
//                 {sm && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
//             </Box>
//             <Box display="flex" alignItems="center" justifyContent="space-between">
//                 <Box display="flex" alignItems="center" gap={0.6}>
//                     {owners.length > 0 ? (
//                         <>
//                             <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                 {(owners[0][0] || "?").toUpperCase()}
//                             </Avatar>
//                             <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 90 }}>
//                                 {owners[0]}{owners.length > 1 ? ` +${owners.length - 1}` : ""}
//                             </Typography>
//                         </>
//                     ) : <Typography fontSize={11} color="text.disabled">No owner</Typography>}
//                 </Box>
//                 {row.deadline && (
//                     <Typography fontSize={10.5} color={overdue ? "#c62828" : "text.disabled"} fontWeight={overdue ? 700 : 400}>
//                         {fmtDate(row.deadline)}
//                     </Typography>
//                 )}
//             </Box>
//         </Paper>
//     );
// };

// // ─── Kanban Column ────────────────────────────────────────────────────────────
// const KanbanColumn = ({ col, cards, onEdit, onDelete, onSendReminder, onStatusChange }) => {
//     const [dragOver, setDragOver] = useState(false);
//     const handleDrop = (e) => {
//         e.preventDefault(); setDragOver(false);
//         const cardId = e.dataTransfer.getData("cardId");
//         const fromStatus = e.dataTransfer.getData("fromStatus");
//         if (fromStatus !== col.key) onStatusChange(cardId, col.key);
//     };
//     return (
//         <Box sx={{
//             flex: 1, minWidth: 220, maxWidth: 300,
//             bgcolor: dragOver ? alpha(col.color, 0.06) : col.bg,
//             borderRadius: "14px", border: `2px dashed ${dragOver ? col.color : "transparent"}`,
//             transition: "all .15s", p: 2,
//         }}
//             onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//             onDragLeave={() => setDragOver(false)}
//             onDrop={handleDrop}
//         >
//             <Box display="flex" alignItems="center" gap={1} mb={2}>
//                 <Box sx={{ color: col.color }}>{col.icon}</Box>
//                 <Typography fontSize={13} fontWeight={700} color={col.color}>{col.label}</Typography>
//                 <Chip label={cards.length} size="small"
//                     sx={{ height: 18, fontSize: 10.5, fontWeight: 700, bgcolor: alpha(col.color, 0.12), color: col.color, minWidth: 24 }} />
//             </Box>
//             {dragOver && (
//                 <Box sx={{ border: `2px dashed ${col.color}`, borderRadius: "10px", p: 2, mb: 1.5, textAlign: "center", opacity: 0.6 }}>
//                     <Typography fontSize={12} color={col.color}>Drop here</Typography>
//                 </Box>
//             )}
//             {cards.length === 0 && !dragOver && (
//                 <Box sx={{ textAlign: "center", py: 4, opacity: 0.4 }}>
//                     <Typography fontSize={12} color="text.secondary">No tasks</Typography>
//                 </Box>
//             )}
//             {cards.map(row => (
//                 <KanbanCard key={row.id} row={row}
//                     onEdit={onEdit} onDelete={onDelete}
//                     onSendReminder={onSendReminder}
//                     onStatusChange={onStatusChange} />
//             ))}
//         </Box>
//     );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // ASSIGN TASK DIALOG
// // ═════════════════════════════════════════════════════════════════════════════
// const AssignTaskDialog = ({ open, onClose, editId, initialForm, onSaved, taskOptionsList, userEmail, userID }) => {
//     const [form, setForm] = useState(EMPTY_FORM);
//     const [errors, setErrors] = useState({});
//     const [saving, setSaving] = useState(false);

//     const [taskOptions, setTaskOptions] = useState([]);
//     const [taskLoading, setTaskLoading] = useState(false);

//     useEffect(() => {
//         if (open) {
//             setForm(initialForm
//                 ? initialForm
//                 : { ...EMPTY_FORM, assignee: userEmail, deadline: nowLocal() }
//             );
//             setErrors({});
//         }
//     }, [open, initialForm, userEmail]);

//     // ✅ FIX: Load task options on dialog open using POST + FormData with userID
//     // This matches exactly how AddTask.jsx fetches tasks (postData with userID)
//     useEffect(() => {
//         if (open) {
//             fetchTaskOptions();
//         }
//     }, [open]);

//     const fetchTaskOptions = async () => {
//         setTaskLoading(true);
//         try {
//             // ✅ FIX: Use FormData with userID — same as AddTask's fetchModules
//             const formData = new FormData();
//             formData.append("userID", userID || userEmail);

//             const res = await fetch(`${BASE_URL}${API.GET_TASK_OPTIONS}`, {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await res.json();
//             console.log("Task options response:", data);

//             const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
//             setTaskOptions(list);
//         } catch (err) {
//             console.error("fetchTaskOptions error:", err);
//             // Fallback to passed-in list
//             setTaskOptions(taskOptionsList || []);
//         } finally {
//             setTaskLoading(false);
//         }
//     };

//     const setField = (field, value) => {
//         setForm(p => ({ ...p, [field]: value }));
//         setErrors(e => ({ ...e, [field]: "" }));
//     };

//     const [recipientInput, setRecipientInput] = useState("");

//     const addRecipient = (emailStr) => {
//         const email = (emailStr || "").trim();
//         if (!email || !email.includes("@")) return;
//         if (form.recipients.some(r => r.email === email)) return;
//         setForm(p => ({ ...p, recipients: [...p.recipients, { name: email, email }] }));
//         setErrors(e => ({ ...e, recipients: "" }));
//         setRecipientInput("");
//     };

//     const removeRecipient = (email) =>
//         setForm(p => ({ ...p, recipients: p.recipients.filter(r => r.email !== email) }));

//     const validate = () => {
//         const e = {};
//         if (!form.task) e.task = "Please select a task";
//         if (form.recipients.length === 0) e.recipients = "Add at least one recipient email";
//         if (!form.deadline) e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const handleSave = async () => {
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const taskName = typeof form.task === "object" ? (form.task?.task ?? "") : form.task;

//             const payload = {
//                 task: taskName,
//                 oem: form.oem || "",
//                 slot: form.slot || "",
//                 priority: form.priority,
//                 status: form.status,
//                 owner: form.recipients.map(r => r.email),
//                 assigned_by: form.assignee || userEmail,
//                 frequency: form.reminderFrequency === "None" ? "" : form.reminderFrequency,
//                 deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
//                 remarks: form.remarks || "",
//                 assigned_at: nowISO(),
//                 updated_by: form.assignee || userEmail,
//             };

//             if (editId) {
//                 await apiFetch(API.UPDATE(editId), "PUT", {
//                     status: payload.status,
//                     remarks: payload.remarks,
//                     updated_by: payload.updated_by,
//                     task: payload.task,
//                     oem: payload.oem,
//                     slot: payload.slot,
//                     priority: payload.priority,
//                     owner: payload.owner,
//                     frequency: payload.frequency,
//                     deadline: payload.deadline,
//                 });
//             } else {
//                 await apiFetch(API.CREATE, "POST", payload);
//             }

//             onClose();
//             onSaved();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Task Updated!" : "Task Assigned!",
//                 html: `<b>${taskName}</b> assigned to <b>${form.recipients.map(r => r.email).join(", ")}</b>`,
//                 timer: 2800, showConfirmButton: false, timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave error:", err);
//             Swal.fire("Error", `Failed to save task: ${err.message}`, "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const fmtAssignedAt = () => {
//         const now = new Date();
//         return `${now.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", maxHeight: "92vh" } }}>
//             <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />
//             <DialogTitle sx={{ p: 0 }}>
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                         <Box sx={{ width: 40, height: 40, borderRadius: "11px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                             <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 22 }} />
//                         </Box>
//                         <Box>
//                             <Typography fontWeight={700} fontSize={17} lineHeight={1.2} color="#1a1a2e">
//                                 {editId ? "Edit Task Assignment" : "Assign Task"}
//                             </Typography>
//                             <Typography fontSize={12} color="text.secondary">
//                                 {editId ? "Update task details" : "Fill in the details to assign"}
//                             </Typography>
//                         </Box>
//                     </Box>
//                     <Tooltip title="Close" arrow>
//                         <IconButton onClick={onClose} sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px", transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
//                             <CloseIcon sx={{ fontSize: 17 }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </DialogTitle>
//             <Divider />
//             <DialogContent sx={{ px: 3, pt: 2.5, pb: 1.5, overflowY: "auto" }}>
//                 <Box display="flex" flexDirection="column" gap={2.2}>

//                     {/* Select Task — ✅ FIX: filterOptions uses x (server-filtered), no client filtering */}
//                     <Autocomplete
//                         options={taskOptions}
//                         getOptionLabel={(opt) => (typeof opt === "object" ? opt.task ?? "" : opt)}
//                         value={form.task}
//                         onChange={(_, val) => setField("task", val)}
//                         loading={taskLoading}
//                         isOptionEqualToValue={(opt, val) =>
//                             opt?.id === val?.id || opt?.task === val?.task
//                         }
//                         noOptionsText={taskLoading ? "Loading tasks…" : "No tasks found"}
//                         renderOption={(props, opt) => (
//                             <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
//                                 <Box display="flex" alignItems="center" gap={1.5}>
//                                     <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                         <TaskAltOutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
//                                     </Box>
//                                     <Box>
//                                         <Typography fontSize={13} fontWeight={600} color="#1a1a2e">{opt.task}</Typography>
//                                         {opt.oem && <Typography fontSize={11} color="text.secondary">{opt.oem}{opt.slot ? ` · ${opt.slot}` : ""}</Typography>}
//                                     </Box>
//                                 </Box>
//                             </Box>
//                         )}
//                         renderInput={(params) => (
//                             <TextField {...params} label="Select Task" size="small" placeholder="Search task name…"
//                                 error={!!errors.task} helperText={errors.task} sx={fieldSx}
//                                 InputProps={{
//                                     ...params.InputProps,
//                                     startAdornment: (
//                                         <>
//                                             <InputAdornment position="start">
//                                                 <TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                             </InputAdornment>
//                                             {params.InputProps.startAdornment}
//                                         </>
//                                     ),
//                                     endAdornment: (
//                                         <>
//                                             {taskLoading ? <CircularProgress color="inherit" size={14} /> : null}
//                                             {params.InputProps.endAdornment}
//                                         </>
//                                     ),
//                                 }} />
//                         )}
//                     />

//                     {/* Assignee */}
//                     <TextField label="Assigned By" value={form.assignee || userEmail}
//                         size="small" fullWidth sx={fieldSx}
//                         helperText="Auto-filled from your login session"
//                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

//                     {/* Recipients */}
//                     <Box>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
//                             sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
//                             <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                             Owner Emails
//                             <Chip label={`${form.recipients.length} added`} size="small"
//                                 sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: form.recipients.length > 0 ? alpha(TEAL, 0.12) : "#f3f4f6", color: form.recipients.length > 0 ? TEAL_DARK : "text.secondary" }} />
//                         </Typography>
//                         {form.recipients.length > 0 && (
//                             <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
//                                 {form.recipients.map((r) => (
//                                     <Chip key={r.email}
//                                         label={r.email}
//                                         size="small" onDelete={() => removeRecipient(r.email)}
//                                         avatar={<Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>{(r.email[0] || "?").toUpperCase()}</Avatar>}
//                                         sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, height: 26, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                                 ))}
//                             </Box>
//                         )}
//                         <TextField
//                             size="small" fullWidth
//                             placeholder="Type email and press Enter…"
//                             value={recipientInput}
//                             onChange={(e) => setRecipientInput(e.target.value)}
//                             error={!!errors.recipients}
//                             helperText={errors.recipients || "Type email + press Enter to add · Backspace removes last"}
//                             sx={fieldSx}
//                             InputProps={{
//                                 startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>),
//                                 onKeyDown: (e) => {
//                                     if (e.key === "Enter") { e.preventDefault(); addRecipient(recipientInput); }
//                                     if (e.key === "Backspace" && !recipientInput && form.recipients.length > 0) {
//                                         removeRecipient(form.recipients[form.recipients.length - 1].email);
//                                     }
//                                 },
//                             }}
//                         />
//                     </Box>

//                     {/* OEM + Slot */}
//                     <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                             <TextField select label="OEM" value={form.oem} onChange={(e) => setField("oem", e.target.value)}
//                                 size="small" fullWidth sx={fieldSx}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                 <MenuItem value=""><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
//                                 {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                             </TextField>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField select label="Slot" value={form.slot} onChange={(e) => setField("slot", e.target.value)}
//                                 size="small" fullWidth sx={fieldSx}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                 <MenuItem value=""><em style={{ color: "#aaa" }}>— Select Slot —</em></MenuItem>
//                                 {SLOT_OPTIONS.map(s => (
//                                     <MenuItem key={s.value} value={s.value}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />{s.label}
//                                         </Box>
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                     </Grid>

//                     {/* Priority + Status */}
//                     <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                             <TextField select label="Priority" value={form.priority} onChange={(e) => setField("priority", e.target.value)}
//                                 size="small" fullWidth sx={fieldSx}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: priorityMeta(form.priority).color }} /></InputAdornment>) }}>
//                                 {PRIORITY_OPTIONS.map(p => (
//                                     <MenuItem key={p.value} value={p.value}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
//                                             <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
//                                         </Box>
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}
//                                 size="small" fullWidth sx={fieldSx}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(form.status), ml: 0.5, flexShrink: 0 }} /></InputAdornment>) }}>
//                                 {STATUS_OPTIONS.map(s => (
//                                     <MenuItem key={s} value={s}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />{s}
//                                         </Box>
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>
//                     </Grid>

//                     {/* Deadline */}
//                     <TextField label="Deadline" type="datetime-local" value={form.deadline}
//                         onChange={(e) => setField("deadline", e.target.value)}
//                         error={!!errors.deadline} helperText={errors.deadline || "Select date and time to complete the task"}
//                         size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

//                     {/* Reminder Frequency */}
//                     <Box>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1}
//                             sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
//                             <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                             Reminder Frequency
//                         </Typography>
//                         <Box display="flex" gap={1} flexWrap="wrap">
//                             {REMINDER_OPTIONS.map((opt) => {
//                                 const isActive = form.reminderFrequency === opt;
//                                 const reminderIcons = { None: "🔕", Daily: "📅", Weekly: "🗓️", Monthly: "📆" };
//                                 return (
//                                     <Box key={opt} onClick={() => setField("reminderFrequency", opt)} sx={{
//                                         display: "flex", alignItems: "center", gap: 0.7,
//                                         px: 2, py: 0.9, borderRadius: "10px",
//                                         border: `1.5px solid ${isActive ? TEAL : "#e0e0e0"}`,
//                                         bgcolor: isActive ? alpha(TEAL, 0.08) : "#fff",
//                                         color: isActive ? TEAL_DARK : "#555",
//                                         fontWeight: isActive ? 700 : 500, fontSize: 13,
//                                         cursor: "pointer", transition: "all .15s", userSelect: "none",
//                                         "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
//                                     }}>
//                                         <span style={{ fontSize: 15 }}>{reminderIcons[opt]}</span>
//                                         <span>{opt}</span>
//                                     </Box>
//                                 );
//                             })}
//                         </Box>
//                     </Box>

//                     {/* Assigned at */}
//                     <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.3, bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "10px" }}>
//                         <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK, flexShrink: 0 }} />
//                         <Typography fontSize={13} color={TEAL_DARK}><strong>Assigned at:</strong> {fmtAssignedAt()}</Typography>
//                     </Paper>

//                     {/* Remarks */}
//                     <TextField label="Remarks (optional)" value={form.remarks}
//                         onChange={(e) => setField("remarks", e.target.value)}
//                         placeholder="Add any notes or instructions…"
//                         size="small" fullWidth multiline rows={2} sx={fieldSx} />
//                 </Box>
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "10px", px: 2.5, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
//                     Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <span>⚡</span>}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 3, boxShadow: `0 2px 10px ${alpha(TEAL, 0.4)}`, fontSize: 14 }}>
//                     {saving ? "Saving…" : editId ? "Update Task" : "Assign Task"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     // ✅ FIX: Get both userID (for task options API) and userEmail (display + assigned_by)
//     const userID = useMemo(() => getDecreyptedData("userID") || "", []);
//     const userEmail = useMemo(() => {
//         const fromDecrypt = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail");
//         if (fromDecrypt && fromDecrypt.includes("@")) return fromDecrypt;
//         return getLoggedInUserEmail();
//     }, []);

//     const [tasks, setTasks] = useState([]);
//     const [taskOptionsList, setTaskOptionsList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [editForm, setEditForm] = useState(null);
//     const [sendingReminderId, setSendingReminderId] = useState(null);

//     const [tableSearch, setTableSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");
//     const [viewMode, setViewMode] = useState("table");
//     const [analyticsOpen, setAnalyticsOpen] = useState(false);

//     const [selectedDate, setSelectedDate] = useState(todayStr());

//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const body = {
//                 assigned_by: userEmail,
//                 assigned_at: selectedDate,
//             };

//             console.log("Fetching tasks with:", body);

//             const res = await fetch(`${BASE_URL}${API.GET_TASKS}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(body),
//             });

//             const data = await res.json();
//             console.log("Raw API response:", data);

//             let taskList = [];
//             if (Array.isArray(data)) taskList = data;
//             else if (Array.isArray(data?.data)) taskList = data.data;
//             else if (Array.isArray(data?.results)) taskList = data.results;
//             else if (Array.isArray(data?.tasks)) taskList = data.tasks;

//             console.log("Parsed task list:", taskList);
//             setTasks(taskList);

//             // ✅ FIX: Fetch task options with FormData + userID (mirrors AddTask.jsx)
//             try {
//                 const formData = new FormData();
//                 formData.append("userID", userID || userEmail);
//                 const optRes = await fetch(`${BASE_URL}${API.GET_TASK_OPTIONS}`, {
//                     method: "POST",
//                     body: formData,
//                 });
//                 const optData = await optRes.json();
//                 const opts = Array.isArray(optData) ? optData : optData?.data ?? optData?.results ?? [];
//                 console.log("Task options loaded:", opts.length, "items");
//                 setTaskOptionsList(opts);
//             } catch (e) {
//                 console.warn("Task options fetch failed:", e);
//             }

//         } catch (err) {
//             console.error("fetchAll error:", err);
//             Swal.fire("Error", `Failed to load tasks: ${err.message}`, "error");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [userEmail, userID, selectedDate]);

//     useEffect(() => {
//         fetchAll();
//     }, [fetchAll]);

//     const dateFilteredTasks = useMemo(() => tasks, [tasks]);

//     const stats = useMemo(() => ({
//         total: dateFilteredTasks.length,
//         active: dateFilteredTasks.filter(t => t.status === "Active").length,
//         inProgress: dateFilteredTasks.filter(t => t.status === "In Progress").length,
//         completed: dateFilteredTasks.filter(t => t.status === "Completed").length,
//         cancelled: dateFilteredTasks.filter(t => t.status === "Cancelled").length,
//         overdue: dateFilteredTasks.filter(t => isOverdue(t.deadline, t.status)).length,
//     }), [dateFilteredTasks]);

//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return dateFilteredTasks.filter((row) => {
//             const taskName = (row.task ?? "").toLowerCase();
//             const oem = (row.oem ?? "").toLowerCase();
//             const ownerStr = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
//             const assignedBy = (row.assigned_by ?? "").toLowerCase();
//             const id = String(row.id ?? "").toLowerCase();
//             // ✅ FIX: Also search by task_id (DTR... format)
//             const taskId = (row.task_id ?? "").toLowerCase();
//             const matchQ = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q) || id.includes(q) || taskId.includes(q);
//             const matchS = activeStatCard === "All" ? true : row.status === activeStatCard;
//             const matchD = statusFilter === "All" ? true : row.status === statusFilter;
//             return matchQ && matchS && matchD;
//         });
//     }, [dateFilteredTasks, tableSearch, activeStatCard, statusFilter]);

//     const kanbanCols = useMemo(() => {
//         const grouped = {};
//         KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
//         filteredRows.forEach(r => {
//             const key = r.status;
//             if (grouped[key]) grouped[key].push(r);
//         });
//         return grouped;
//     }, [filteredRows]);

//     const handleStatClick = (label) => {
//         setActiveStatCard(label);
//         setStatusFilter(label);
//         setTableSearch("");
//     };

//     const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
//         const row = tasks.find(t => String(t.id) === String(cardId));
//         if (!row) return;
//         setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
//         try {
//             await apiFetch(API.UPDATE(cardId), "PUT", {
//                 status: newStatus,
//                 updated_by: userEmail,
//             });
//         } catch (e) {
//             console.error("Status update failed:", e);
//             setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
//             Swal.fire("Error", "Failed to update status.", "error");
//         }
//     }, [tasks, userEmail]);

//     const handleSendReminder = useCallback(async (row) => {
//         const freq = getFrequency(row);
//         const owners = Array.isArray(row.owner) ? row.owner.join(", ") : (row.owner ?? "—");
//         const result = await Swal.fire({
//             title: "Send Reminder?",
//             html: `<div style="text-align:left;font-size:13.5px;color:#444;line-height:1.8">
//                 <div><b>Task:</b> ${row.task}</div>
//                 <div><b>Owner(s):</b> ${owners}</div>
//                 <div><b>Frequency:</b> ${freq}</div>
//                 <div><b>Deadline:</b> ${fmtDate(row.deadline)}</div>
//             </div><p style="margin-top:10px;font-size:12.5px;color:#888">A reminder email will be sent now.</p>`,
//             icon: "info", showCancelButton: true,
//             confirmButtonColor: TEAL, confirmButtonText: "Send Now", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         setSendingReminderId(row.id);
//         try {
//             await apiFetch(API.SEND_REMINDER(row.id), "POST", {});
//             Swal.fire({ icon: "success", title: "Reminder Sent!", html: `Reminder for <b>${row.task}</b> dispatched.`, timer: 2500, showConfirmButton: false, timerProgressBar: true });
//         } catch (err) {
//             Swal.fire("Error", "Failed to send reminder.", "error");
//         } finally {
//             setSendingReminderId(null);
//         }
//     }, []);

//     const openCreate = () => { setEditId(null); setEditForm(null); setDialogOpen(true); };

//     const openEdit = (row) => {
//         setEditId(row.id);
//         const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
//         const recipients = owners.map(email => ({ name: email, email }));
//         setEditForm({
//             // task: row.task ? { id: row.id, task: row.task } : null,
//             taskInput: row.task ?? "",
//             assignee: row.assigned_by ?? userEmail,
//             recipients,
//             recipientInput: "",
//             oem: row.oem ?? "",
//             slot: row.slot ?? "",
//             priority: row.priority ?? "Medium",
//             status: row.status ?? "Active",
//             deadline: row.deadline ? new Date(row.deadline).toISOString().slice(0, 16) : "",
//             reminderFrequency: getFrequency(row) || "None",
//             remarks: row.remarks ?? "",
//         });
//         setDialogOpen(true);
//     };

//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Delete Task?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
//             icon: "warning", showCancelButton: true,
//             confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await apiFetch(API.DELETE(row.id), "DELETE");
//                 Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
//                 await fetchAll();
//             } catch (err) {
//                 Swal.fire("Error", `Failed to delete: ${err.message}`, "error");
//             }
//         });
//     };

//     const fmtSelectedDate = (dateStr) => {
//         if (!dateStr) return "All dates";
//         const today = todayStr();
//         const yesterday = toLocalDateStr(new Date(Date.now() - 86400000));
//         if (dateStr === today) return "Today";
//         if (dateStr === yesterday) return "Yesterday";
//         const d = new Date(dateStr + "T00:00:00");
//         return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//     };

//     // ✅ FIX: Added "Task ID" column to show DTR... format
//     const TABLE_HEADERS = ["SN", "Task ID", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Reminder", "Deadline", "Status", "Actions"];

//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//             {/* Breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

//                 {/* ── Header ── */}
//                 <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5", background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)` }}>
//                     <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{
//                                 width: 44, height: 44, borderRadius: "12px",
//                                 background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`,
//                                 display: "flex", alignItems: "center", justifyContent: "center",
//                                 boxShadow: `0 4px 12px ${alpha(TEAL, 0.35)}`, flexShrink: 0,
//                             }}>
//                                 <AssignmentTurnedInOutlinedIcon sx={{ color: "#fff", fontSize: 24 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Assign Task</Typography>
//                                 <Typography fontSize={13} color="text.secondary" mt={0.2}>
//                                     Manage daily task assignments · drag kanban cards to update status
//                                 </Typography>
//                             </Box>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
//                             <TextField
//                                 type="date" size="small" value={selectedDate}
//                                 onChange={(e) => {
//                                     setSelectedDate(e.target.value);
//                                     setActiveStatCard("All");
//                                     setStatusFilter("All");
//                                     setTableSearch("");
//                                 }}
//                                 inputProps={{ max: todayStr() }}
//                                 InputLabelProps={{ shrink: true }}
//                                 sx={{
//                                     minWidth: 160,
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: "10px", bgcolor: "#fff", fontSize: 13.5, fontWeight: 600, color: TEAL_DARK,
//                                         "&:hover fieldset": { borderColor: TEAL },
//                                         "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: 2 },
//                                         "& fieldset": { borderColor: TEAL_MID },
//                                     },
//                                     "& input[type='date']::-webkit-calendar-picker-indicator": {
//                                         filter: `invert(30%) sepia(80%) saturate(400%) hue-rotate(140deg)`,
//                                         cursor: "pointer", opacity: 0.8,
//                                     },
//                                 }}
//                             />

//                             <Button variant="outlined"
//                                 startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
//                                 onClick={() => setAnalyticsOpen(true)}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: "#d0d5dd", color: "#374151", height: 36, "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
//                                 Analytics
//                             </Button>

//                             <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, height: 36, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
//                                 <ToggleButton value="table"><Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
//                                 <ToggleButton value="kanban"><Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
//                             </ToggleButtonGroup>

//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>

//                             <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                                 sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, height: 36, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
//                                 Assign Task
//                             </Button>
//                         </Box>
//                     </Box>

//                     {userEmail && (
//                         <Box mt={1.5} display="flex" alignItems="center" gap={1}>
//                             <Typography fontSize={12} color="text.secondary">Showing tasks assigned by:</Typography>
//                             <Chip label={userEmail} size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                             <Typography fontSize={12} color="text.secondary">on</Typography>
//                             <Chip label={fmtSelectedDate(selectedDate)} size="small"
//                                 sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ── Stat cards ── */}
//                 <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
//                     <Box display="flex" gap={2} flexWrap="wrap">
//                         <StatCard label="Total" count={stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT}
//                             active={activeStatCard === "All"} loading={loading} onClick={() => handleStatClick("All")} />
//                         <StatCard label="Active" count={stats.active} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0"
//                             active={activeStatCard === "Active"} loading={loading} onClick={() => handleStatClick("Active")} />
//                         <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9"
//                             active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
//                         <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd"
//                             active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
//                         <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea"
//                             active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
//                         {stats.overdue > 0 && (
//                             <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0"
//                                 active={false} loading={loading} onClick={() => { }} />
//                         )}
//                     </Box>
//                 </Box>

//                 {/* ── Search + filter ── */}
//                 <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
//                     <TextField size="small" placeholder="Search task, ID, Task ID (DTR…), owner, OEM…"
//                         value={tableSearch}
//                         onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                         sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

//                     <TextField select size="small" value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                         sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
//                         {STATUS_FILTERS.map(s => (
//                             <MenuItem key={s} value={s}>
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}{s}
//                                 </Box>
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     {(tableSearch || statusFilter !== "All") && (
//                         <Box display="flex" alignItems="center" gap={1}>
//                             <Typography fontSize={12} color="text.secondary">{filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}</Typography>
//                             <Chip label="Clear" size="small"
//                                 onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); }}
//                                 sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ════ KANBAN ════ */}
//                 {viewMode === "kanban" && (
//                     <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
//                         {loading ? (
//                             <Box display="flex" gap={2}>
//                                 {[1, 2, 3, 4].map(i => (
//                                     <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
//                                         {[1, 2, 3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
//                                     </Box>
//                                 ))}
//                             </Box>
//                         ) : (
//                             <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
//                                 {KANBAN_COLS.map(col => (
//                                     <KanbanColumn key={col.key} col={col}
//                                         cards={kanbanCols[col.key] || []}
//                                         onEdit={openEdit} onDelete={handleDelete}
//                                         onSendReminder={handleSendReminder}
//                                         onStatusChange={handleKanbanStatusChange} />
//                                 ))}
//                             </Box>
//                         )}
//                         <Typography variant="caption" color="text.disabled" display="block" textAlign="center" mt={2}>
//                             Drag cards between columns to update status instantly
//                         </Typography>
//                     </Box>
//                 )}

//                 {/* ════ TABLE ════ */}
//                 {viewMode === "table" && (
//                     <>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow sx={{ bgcolor: TEAL }}>
//                                         {TABLE_HEADERS.map(h => (
//                                             <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading && Array.from({ length: 5 }).map((_, i) => (
//                                         <TableRow key={i}>
//                                             {Array.from({ length: TABLE_HEADERS.length }).map((_, j) => (
//                                                 <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}

//                                     {!loading && filteredRows.length === 0 && (
//                                         <TableRow>
//                                             <TableCell colSpan={TABLE_HEADERS.length} align="center" sx={{ py: 8 }}>
//                                                 <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                                     <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                                         <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
//                                                     </Box>
//                                                     <Typography fontWeight={600} fontSize={14} color="text.secondary">
//                                                         {tableSearch || statusFilter !== "All"
//                                                             ? "No tasks match your filters"
//                                                             : `No tasks found for ${fmtSelectedDate(selectedDate)}`}
//                                                     </Typography>
//                                                     <Typography fontSize={12.5} color="text.disabled">
//                                                         {tableSearch || statusFilter !== "All"
//                                                             ? "Try adjusting filters"
//                                                             : "Try a different date or click + Assign Task"}
//                                                     </Typography>
//                                                     {!userEmail && (
//                                                         <Typography fontSize={12} color="error.main" fontWeight={600}>
//                                                             ⚠ Could not detect logged-in user email. Check localStorage keys.
//                                                         </Typography>
//                                                     )}
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     )}

//                                     {!loading && filteredRows.map((row, idx) => {
//                                         const pm = priorityMeta(row.priority);
//                                         const sm = slotMeta(row.slot);
//                                         const overdue = isOverdue(row.deadline, row.status);
//                                         const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
//                                         const freq = getFrequency(row);
//                                         const isSendingThis = sendingReminderId === row.id;

//                                         return (
//                                             <TableRow key={row.id ?? idx} hover sx={{
//                                                 "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
//                                                 "&:hover": { bgcolor: alpha(TEAL, 0.025) },
//                                                 bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
//                                                 transition: "background .12s",
//                                             }}>
//                                                 {/* SN */}
//                                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 36, fontWeight: 600 }}>{idx + 1}</TableCell>

//                                                 {/* ID (numeric) */}
//                                                 {/* <TableCell>
//                                                     <Chip label={`#${row.id}`} size="small"
//                                                         sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(TEAL, 0.2)}`, fontFamily: "monospace" }} />
//                                                 </TableCell> */}

//                                                 {/* ✅ FIX: Task ID column (DTR... format from API) */}
//                                                 <TableCell>
//                                                     {row.task_id ? (
//                                                         <Tooltip title={row.task_id} arrow>
//                                                             <Chip
//                                                                 icon={<TagOutlinedIcon sx={{ fontSize: "13px !important", color: "#5b21b6 !important" }} />}
//                                                                 label={row.task_id}
//                                                                 size="small"
//                                                                 sx={{
//                                                                     bgcolor: alpha("#7c3aed", 0.08),
//                                                                     color: "#5b21b6",
//                                                                     fontWeight: 700,
//                                                                     fontSize: 10.5,
//                                                                     fontFamily: "monospace",
//                                                                     border: `1px solid ${alpha("#7c3aed", 0.25)}`,
//                                                                     maxWidth: 160,
//                                                                     "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }
//                                                                 }}
//                                                             />
//                                                         </Tooltip>
//                                                     ) : (
//                                                         <Typography color="text.disabled" fontSize={12}>—</Typography>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Task */}
//                                                 <TableCell>
//                                                     <Box display="flex" alignItems="center" gap={0.7}>
//                                                         {overdue && (
//                                                             <Tooltip title="Overdue" arrow>
//                                                                 <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} />
//                                                             </Tooltip>
//                                                         )}
//                                                         <Tooltip title={row.task} arrow placement="top">
//                                                             <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 180 }}>
//                                                                 {row.task}
//                                                             </Typography>
//                                                         </Tooltip>
//                                                     </Box>
//                                                     {row.remarks && (
//                                                         <Typography fontSize={11} color="text.disabled" noWrap sx={{ maxWidth: 180, fontStyle: "italic" }}>
//                                                             {row.remarks}
//                                                         </Typography>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Owner(s) */}
//                                                 <TableCell>
//                                                     <Box display="flex" alignItems="center" gap={0.6}>
//                                                         <Box display="flex">
//                                                             {owners.slice(0, 3).map((o, i) => (
//                                                                 <Tooltip key={i} title={o} arrow>
//                                                                     <Avatar sx={{ width: 26, height: 26, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, border: "2px solid #fff", ml: i > 0 ? -0.8 : 0 }}>
//                                                                         {(o[0] || "?").toUpperCase()}
//                                                                     </Avatar>
//                                                                 </Tooltip>
//                                                             ))}
//                                                         </Box>
//                                                         <Typography fontSize={12} fontWeight={500} color="#374151" noWrap sx={{ maxWidth: 120 }}>
//                                                             {owners.slice(0, 2).join(", ")}{owners.length > 2 ? ` +${owners.length - 2}` : ""}
//                                                         </Typography>
//                                                     </Box>
//                                                 </TableCell>

//                                                 {/* Assigned By */}
//                                                 <TableCell>
//                                                     <Box display="flex" alignItems="center" gap={0.8}>
//                                                         {row.assigned_by ? (
//                                                             <>
//                                                                 <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha("#7c3aed", 0.15), color: "#5b21b6" }}>
//                                                                     {(row.assigned_by[0] || "?").toUpperCase()}
//                                                                 </Avatar>
//                                                                 <Typography fontSize={12.5} color="#374151" fontWeight={500} noWrap sx={{ maxWidth: 120 }}>
//                                                                     {row.assigned_by}
//                                                                 </Typography>
//                                                             </>
//                                                         ) : <Typography fontSize={12.5} color="text.disabled">—</Typography>}
//                                                     </Box>
//                                                 </TableCell>

//                                                 {/* OEM */}
//                                                 <TableCell>
//                                                     <Chip label={row.oem || "—"} size="small"
//                                                         sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11, border: "1px solid #90caf9" }} />
//                                                 </TableCell>

//                                                 {/* Slot */}
//                                                 <TableCell>
//                                                     {sm
//                                                         ? <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11, border: `1px solid ${alpha(sm.color, 0.3)}` }} />
//                                                         : <Typography color="text.disabled" fontSize={12}>{row.slot || "—"}</Typography>
//                                                     }
//                                                 </TableCell>

//                                                 {/* Priority */}
//                                                 <TableCell>
//                                                     <Chip label={row.priority || "—"} size="small"
//                                                         sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                                                 </TableCell>

//                                                 {/* Reminder */}
//                                                 <TableCell>
//                                                     {freq && freq !== "None" ? (
//                                                         <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "12px !important" }} />}
//                                                             label={freq} size="small"
//                                                             sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11, border: `1px solid ${TEAL_MID}` }} />
//                                                     ) : (
//                                                         <Typography color="text.disabled" fontSize={12}>None</Typography>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Deadline */}
//                                                 <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                     <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
//                                                         {fmtDate(row.deadline)}
//                                                     </Typography>
//                                                 </TableCell>

//                                                 {/* Status */}
//                                                 <TableCell>
//                                                     <Chip label={row.status ?? "Active"} size="small"
//                                                         sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status), fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
//                                                 </TableCell>

//                                                 {/* Actions */}
//                                                 <TableCell>
//                                                     <Box display="flex" gap={0.5} alignItems="center">
//                                                         <Tooltip title="Edit" arrow>
//                                                             <IconButton size="small" onClick={() => openEdit(row)}
//                                                                 sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}>
//                                                                 <EditOutlinedIcon sx={{ fontSize: 17 }} />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                         <Tooltip title="Delete" arrow>
//                                                             <IconButton size="small" onClick={() => handleDelete(row)}
//                                                                 sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                                 <DeleteOutlineIcon sx={{ fontSize: 17 }} />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                         <Tooltip title={freq && freq !== "None" ? `Send ${freq} reminder` : "No reminder set"} arrow>
//                                                             <span>
//                                                                 <IconButton size="small"
//                                                                     onClick={() => handleSendReminder(row)}
//                                                                     disabled={!freq || freq === "None" || isSendingThis}
//                                                                     sx={{ color: freq && freq !== "None" ? "#7c3aed" : "#d1d5db", "&:hover": { bgcolor: freq && freq !== "None" ? "#f3e8ff" : "transparent" }, "&.Mui-disabled": { color: "#d1d5db" } }}>
//                                                                     {isSendingThis
//                                                                         ? <CircularProgress size={15} sx={{ color: "#7c3aed" }} />
//                                                                         : <NotificationsActiveOutlinedIcon sx={{ fontSize: 17 }} />
//                                                                     }
//                                                                 </IconButton>
//                                                             </span>
//                                                         </Tooltip>
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         );
//                                     })}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

//                         {!loading && (
//                             <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                                 <Typography variant="caption" color="text.disabled">
//                                     Showing <strong>{filteredRows.length}</strong> of <strong>{dateFilteredTasks.length}</strong> tasks
//                                     <span style={{ marginLeft: 8, color: TEAL, fontWeight: 600 }}>for {fmtSelectedDate(selectedDate)}</span>
//                                     {stats.overdue > 0 && (
//                                         <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>⚠ {stats.overdue} overdue</span>
//                                     )}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.disabled">
//                                     ✎ edit · 🗑 remove · 🔔 send reminder
//                                 </Typography>
//                             </Box>
//                         )}
//                     </>
//                 )}
//             </Paper>

//             <AnalyticsPanel tasks={dateFilteredTasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

//             <AssignTaskDialog
//                 open={dialogOpen}
//                 onClose={() => setDialogOpen(false)}
//                 editId={editId}
//                 initialForm={editForm}
//                 onSaved={fetchAll}
//                 taskOptionsList={taskOptionsList}
//                 userEmail={userEmail}
//                 userID={userID}  // ✅ FIX: Pass userID so dialog can POST with FormData
//             />
//         </Box>
//     );
// };

// export default AssignTask;


import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
    InputAdornment, Divider, alpha, Grid, Avatar, LinearProgress,
    ToggleButton, ToggleButtonGroup, Drawer, Autocomplete, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Swal from "sweetalert2";
import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
import { useNavigate } from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";

// ─── theme ────────────────────────────────────────────────────────────────────
const TEAL = "#228b7f";
const TEAL_DARK = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

// ─── static options ───────────────────────────────────────────────────────────
const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

const SLOT_OPTIONS = [
    { value: "Morning", label: "🌤  Morning", color: "#f57c00" },
    { value: "Afternoon", label: "☀️  Afternoon", color: "#f9a825" },
    { value: "Evening", label: "🌙  Evening", color: "#5c6bc0" },
    { value: "Night", label: "🌌  Night", color: "#37474f" },
];

const PRIORITY_OPTIONS = [
    { value: "Critical", color: "#c62828", bg: "#fdecea" },
    { value: "High", color: "#e65100", bg: "#fff3e0" },
    { value: "Medium", color: "#f57c00", bg: "#fff8e1" },
    { value: "Low", color: "#2e7d32", bg: "#e8f5e9" },
];

const STATUS_OPTIONS = ["Active", "In Progress", "Completed", "Cancelled"];
const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];
const REMINDER_OPTIONS = ["None", "Daily", "Weekly", "Monthly"];

const KANBAN_COLS = [
    { key: "Active", label: "Active", color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
    { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Completed", label: "Done", color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Cancelled", label: "Cancelled", color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
];

const BASE_URL = "https://commtoolapi.mcpspmis.com/";

const API = {
    CREATE: "dailytask_review/assign_task/create/",
    UPDATE: (pk) => `dailytask_review/assign_task/update-task/${pk}/`,
    DELETE: (pk) => `dailytask_review/assign_task/delete-task/${pk}/`,
    SEND_REMINDER: (pk) => `dailytask_review/tasks/send-reminder/${pk}/`,
    GET_TASKS: "dailytask_review/assign_task/get/",
    GET_TASK_OPTIONS: "dailytask_review/get-task/",
    // ── NEW: email hierarchy endpoints ──────────────────────────────────────
    GET_EMAIL_OPTIONS: "dailytask_review/reporting-email-hierarchy/get/",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const nowISO = () => new Date().toISOString();
const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};
const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const toLocalDateStr = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const todayStr = () => toLocalDateStr(new Date());

const isOverdue = (iso, status) =>
    iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();
const statusColor = (s) =>
    ({ Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const slotMeta = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());
const getFrequency = (row) => row.frequency ?? row.reminder_frequency ?? "None";

// ─── Get logged-in user email from localStorage ────────────────────────────
const getLoggedInUserEmail = () => {
    try {
        const keys = ["user", "userInfo", "userData", "loginData"];
        for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (raw) {
                const obj = JSON.parse(raw);
                const email = obj.email ?? obj.emailaddress ?? obj.username ?? obj.Email ?? "";
                if (email && email.includes("@")) return email;
            }
        }
        return "";
    } catch {
        return "";
    }
};

const EMPTY_FORM = {
    task: null, taskInput: "",
    assignee: "",
    recipients: [], recipientInput: "",
    oem: "", slot: "",
    priority: "Medium", status: "Active",
    deadline: "",
    reminderFrequency: "None",
    remarks: "",
};

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

// ─── Direct API fetch helper ──────────────────────────────────────────────────
const apiFetch = async (endpoint, method = "GET", body = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, icon, color, bg, active, onClick, loading }) => (
    <Paper onClick={onClick} elevation={0} sx={{
        flex: 1, minWidth: 150, p: 2.2, borderRadius: "16px", cursor: "pointer",
        border: `1.5px solid ${active ? color : "#e8ecf0"}`,
        bgcolor: active ? alpha(color, 0.05) : "#fff",
        transition: "all .2s ease",
        "&:hover": { borderColor: color, bgcolor: alpha(color, 0.04), transform: "translateY(-2px)", boxShadow: `0 6px 24px ${alpha(color, 0.18)}` },
        boxShadow: active ? `0 4px 20px ${alpha(color, 0.2)}` : "0 1px 4px rgba(0,0,0,0.05)",
        position: "relative", overflow: "hidden",
    }}>
        <Box sx={{ position: "absolute", top: -10, right: -10, width: 70, height: 70, borderRadius: "50%", bgcolor: alpha(color, 0.06), pointerEvents: "none" }} />
        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
            <Box>
                <Typography fontSize={11.5} fontWeight={500} color="text.secondary" mb={0.5} letterSpacing=".02em">{label}</Typography>
                {loading
                    ? <Skeleton width={40} height={32} />
                    : <Typography fontSize={28} fontWeight={800} color={active ? color : "#1a1a2e"} lineHeight={1}>{count}</Typography>
                }
            </Box>
            <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: active ? alpha(color, 0.15) : bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
            </Box>
        </Box>
        {active && <Box sx={{ mt: 1.2, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />}
    </Paper>
);

// ─── Analytics Panel ──────────────────────────────────────────────────────────
const AnalyticsPanel = ({ tasks, open, onClose }) => {
    const stats = useMemo(() => {
        const total = tasks.length;
        const byStatus = { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const byOEM = {};
        const bySlot = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;
        tasks.forEach(t => {
            if (byStatus[t.status] !== undefined) byStatus[t.status]++;
            if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
            if (t.oem) byOEM[t.oem] = (byOEM[t.oem] || 0) + 1;
            const slot = t.slot ? t.slot.charAt(0).toUpperCase() + t.slot.slice(1).toLowerCase() : "";
            if (bySlot[slot] !== undefined) bySlot[slot]++;
        });
        const completionRate = total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;
        const ownerMap = {};
        tasks.forEach(t => {
            const owners = Array.isArray(t.owner) ? t.owner : (t.owner ? [t.owner] : []);
            owners.forEach(o => { ownerMap[o] = (ownerMap[o] || 0) + 1; });
        });
        const topOwners = Object.entries(ownerMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return { total, byStatus, byPriority, byOEM, bySlot, completionRate, overdueCount, topOwners };
    }, [tasks]);

    const ProgressRow = ({ label, value, max, color }) => (
        <Box mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography fontSize={12.5} color="text.secondary">{label}</Typography>
                <Typography fontSize={12.5} fontWeight={700} color={color}>{value}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={max > 0 ? (value / max) * 100 : 0}
                sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
        </Box>
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}
            PaperProps={{ sx: { width: 380, bgcolor: "#f8fafc", border: "none" } }}>
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #eee", bgcolor: "#fff" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography fontWeight={700} fontSize={16}>Analytics Overview</Typography>
                        <Typography fontSize={12} color="text.secondary">Live task stats · {stats.total} total tasks</Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose}
                        sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                        <CloseIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>
                {stats.total === 0 ? (
                    <Box textAlign="center" py={6}>
                        <Typography fontSize={13} color="text.secondary">No tasks to analyse for this date.</Typography>
                    </Box>
                ) : (
                    <>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                            <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
                                <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Completion Rate
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                                    <svg width="80" height="80">
                                        <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
                                        <circle cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
                                            strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
                                            strokeLinecap="round" transform="rotate(-90 40 40)" />
                                    </svg>
                                    <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 16, color: TEAL }}>
                                        {stats.completionRate}%
                                    </Typography>
                                </Box>
                                <Box flex={1}>
                                    <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} done</Typography>
                                    {stats.overdueCount > 0 && (
                                        <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
                                            label={`${stats.overdueCount} overdue`} size="small"
                                            sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                            <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
                            <ProgressRow label="Active" value={stats.byStatus["Active"]} max={stats.total} color="#f57c00" />
                            <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
                            <ProgressRow label="Completed" value={stats.byStatus["Completed"]} max={stats.total} color="#1565c0" />
                            <ProgressRow label="Cancelled" value={stats.byStatus["Cancelled"]} max={stats.total} color="#c62828" />
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                            <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
                            {PRIORITY_OPTIONS.map(p => (
                                <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
                            ))}
                        </Paper>
                        {Object.keys(stats.byOEM).length > 0 && (
                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                                <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
                                {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
                                    <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
                                ))}
                            </Paper>
                        )}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                            <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {SLOT_OPTIONS.map(s => {
                                    const cnt = stats.bySlot[s.value] || 0;
                                    const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
                                    return (
                                        <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px", bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
                                            <Typography fontSize={18}>{s.label.split("  ")[0]}</Typography>
                                            <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
                                            <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                        {stats.topOwners.length > 0 && (
                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                                <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
                                    <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Owners
                                </Typography>
                                {stats.topOwners.map(([name, cnt]) => (
                                    <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
                                        <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                                            {(name[0] || "?").toUpperCase()}
                                        </Avatar>
                                        <Box flex={1} minWidth={0}>
                                            <Box display="flex" justifyContent="space-between" mb={0.3}>
                                                <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
                                                <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
                                            </Box>
                                            <LinearProgress variant="determinate"
                                                value={(cnt / (stats.topOwners[0]?.[1] || 1)) * 100}
                                                sx={{ height: 4, borderRadius: 2, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 } }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>
                        )}
                    </>
                )}
            </Box>
        </Drawer>
    );
};

// ─── Kanban Card ──────────────────────────────────────────────────────────────
const KanbanCard = ({ row, onEdit, onDelete, onSendReminder, onStatusChange }) => {
    const pm = priorityMeta(row.priority);
    const sm = slotMeta(row.slot);
    const overdue = isOverdue(row.deadline, row.status);
    const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
    const freq = getFrequency(row);

    return (
        <Paper elevation={0} sx={{
            p: 2, borderRadius: "12px", mb: 1.5, cursor: "grab",
            border: `1px solid ${overdue ? alpha("#c62828", 0.4) : "#e8ecf0"}`,
            bgcolor: overdue ? "#fff9f9" : "#fff",
            transition: "all .15s",
            "&:hover": { borderColor: TEAL_MID, boxShadow: `0 4px 12px ${alpha(TEAL, 0.1)}`, transform: "translateY(-1px)" },
        }}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("cardId", row.id); e.dataTransfer.setData("fromStatus", row.status); }}
        >
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
                    <Chip label={row.priority || "—"} size="small"
                        sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                    {row.id && (
                        <Chip label={`#${row.id}`} size="small"
                            sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 700, fontSize: 10, height: 18 }} />
                    )}
                    {row.task_id && (
                        <Chip label={row.task_id} size="small"
                            sx={{ bgcolor: alpha("#7c3aed", 0.08), color: "#5b21b6", fontWeight: 700, fontSize: 10, height: 18, fontFamily: "monospace" }} />
                    )}
                </Box>
                <Box display="flex" gap={0.5}>
                    {overdue && <Tooltip title="Overdue!" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} /></Tooltip>}
                    {freq && freq !== "None" && (
                        <Tooltip title={`Send ${freq} reminder`} arrow>
                            <IconButton size="small" onClick={() => onSendReminder(row)}
                                sx={{ p: 0.3, color: "#7c3aed", "&:hover": { bgcolor: "#f3e8ff" } }}>
                                <NotificationsActiveOutlinedIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Edit" arrow>
                        <IconButton size="small" onClick={() => onEdit(row)} sx={{ p: 0.3, color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton size="small" onClick={() => onDelete(row)} sx={{ p: 0.3, color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
                            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Typography fontSize={13} fontWeight={700} color="#1a1a2e" mb={0.8} lineHeight={1.4}
                sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {row.task}
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                {row.oem && <Chip label={row.oem} size="small" sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18 }} />}
                {sm && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={0.6}>
                    {owners.length > 0 ? (
                        <>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                                {(owners[0][0] || "?").toUpperCase()}
                            </Avatar>
                            <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 90 }}>
                                {owners[0]}{owners.length > 1 ? ` +${owners.length - 1}` : ""}
                            </Typography>
                        </>
                    ) : <Typography fontSize={11} color="text.disabled">No owner</Typography>}
                </Box>
                {row.deadline && (
                    <Typography fontSize={10.5} color={overdue ? "#c62828" : "text.disabled"} fontWeight={overdue ? 700 : 400}>
                        {fmtDate(row.deadline)}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

// ─── Kanban Column ────────────────────────────────────────────────────────────
const KanbanColumn = ({ col, cards, onEdit, onDelete, onSendReminder, onStatusChange }) => {
    const [dragOver, setDragOver] = useState(false);
    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const cardId = e.dataTransfer.getData("cardId");
        const fromStatus = e.dataTransfer.getData("fromStatus");
        if (fromStatus !== col.key) onStatusChange(cardId, col.key);
    };
    return (
        <Box sx={{
            flex: 1, minWidth: 220, maxWidth: 300,
            bgcolor: dragOver ? alpha(col.color, 0.06) : col.bg,
            borderRadius: "14px", border: `2px dashed ${dragOver ? col.color : "transparent"}`,
            transition: "all .15s", p: 2,
        }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box sx={{ color: col.color }}>{col.icon}</Box>
                <Typography fontSize={13} fontWeight={700} color={col.color}>{col.label}</Typography>
                <Chip label={cards.length} size="small"
                    sx={{ height: 18, fontSize: 10.5, fontWeight: 700, bgcolor: alpha(col.color, 0.12), color: col.color, minWidth: 24 }} />
            </Box>
            {dragOver && (
                <Box sx={{ border: `2px dashed ${col.color}`, borderRadius: "10px", p: 2, mb: 1.5, textAlign: "center", opacity: 0.6 }}>
                    <Typography fontSize={12} color={col.color}>Drop here</Typography>
                </Box>
            )}
            {cards.length === 0 && !dragOver && (
                <Box sx={{ textAlign: "center", py: 4, opacity: 0.4 }}>
                    <Typography fontSize={12} color="text.secondary">No tasks</Typography>
                </Box>
            )}
            {cards.map(row => (
                <KanbanCard key={row.id} row={row}
                    onEdit={onEdit} onDelete={onDelete}
                    onSendReminder={onSendReminder}
                    onStatusChange={onStatusChange} />
            ))}
        </Box>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// ASSIGN TASK DIALOG
// ═════════════════════════════════════════════════════════════════════════════
const AssignTaskDialog = ({ open, onClose, editId, initialForm, onSaved, taskOptionsList, userEmail, userID }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [taskOptions, setTaskOptions] = useState([]);
    const [taskLoading, setTaskLoading] = useState(false);

    // ── NEW: email options from reporting-email-hierarchy API ──────────────
    const [emailOptions, setEmailOptions] = useState([]);
    const [emailLoading, setEmailLoading] = useState(false);
    // Current value in the Autocomplete input box (for free-text fallback)
    const [emailInputValue, setEmailInputValue] = useState("");

    useEffect(() => {
        if (open) {
            setForm(initialForm
                ? initialForm
                : { ...EMPTY_FORM, assignee: userEmail, deadline: nowLocal() }
            );
            setErrors({});
            setEmailInputValue("");
        }
    }, [open, initialForm, userEmail]);

    useEffect(() => {
        if (open) {
            fetchTaskOptions();
            fetchEmailOptions();   // ── NEW
        }
    }, [open]);

    // ── Fetch task dropdown options ────────────────────────────────────────
    const fetchTaskOptions = async () => {
        setTaskLoading(true);
        try {
            const formData = new FormData();
            formData.append("userID", userID || userEmail);
            const res = await fetch(`${BASE_URL}${API.GET_TASK_OPTIONS}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("Task options response:", data);
            const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
            setTaskOptions(list);
        } catch (err) {
            console.error("fetchTaskOptions error:", err);
            setTaskOptions(taskOptionsList || []);
        } finally {
            setTaskLoading(false);
        }
    };

    // ── NEW: Fetch email options from reporting-email-hierarchy/get/ ───────
    const fetchEmailOptions = async () => {
        setEmailLoading(true);
        try {
            const formData = new FormData();
            formData.append("userID", userID || userEmail);
            const res = await fetch(`${BASE_URL}${API.GET_EMAIL_OPTIONS}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("Email options response:", data);
            // API returns array of objects: { id, userID, assigned_to, ... }
            const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
            setEmailOptions(list);
        } catch (err) {
            console.error("fetchEmailOptions error:", err);
            setEmailOptions([]);
        } finally {
            setEmailLoading(false);
        }
    };

    const setField = (field, value) => {
        setForm(p => ({ ...p, [field]: value }));
        setErrors(e => ({ ...e, [field]: "" }));
    };

    // ── NEW: Add a recipient from email option object or plain string ──────
    const addRecipient = (emailOrObj) => {
        // Accept either a string or an object with assigned_to field
        const email = (
            typeof emailOrObj === "object"
                ? emailOrObj?.assigned_to ?? ""
                : emailOrObj ?? ""
        ).trim().toLowerCase();

        if (!email || !email.includes("@")) return;
        // Avoid duplicates
        if (form.recipients.some(r => r.email === email)) return;

        setForm(p => ({ ...p, recipients: [...p.recipients, { name: email, email }] }));
        setErrors(e => ({ ...e, recipients: "" }));
        setEmailInputValue("");
    };

    const removeRecipient = (email) =>
        setForm(p => ({ ...p, recipients: p.recipients.filter(r => r.email !== email) }));

    const validate = () => {
        const e = {};
        if (!form.task) e.task = "Please select a task";
        if (form.recipients.length === 0) e.recipients = "Add at least one recipient email";
        if (!form.deadline) e.deadline = "Deadline is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const taskName = typeof form.task === "object" ? (form.task?.task ?? "") : form.task;

            const payload = {
                task: taskName,
                oem: form.oem || "",
                slot: form.slot || "",
                priority: form.priority,
                status: form.status,
                owner: form.recipients.map(r => r.email),
                assigned_by: form.assignee || userEmail,
                frequency: form.reminderFrequency === "None" ? "" : form.reminderFrequency,
                deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
                remarks: form.remarks || "",
                assigned_at: nowISO(),
                updated_by: form.assignee || userEmail,
            };

            if (editId) {
                await apiFetch(API.UPDATE(editId), "PUT", {
                    status: payload.status,
                    remarks: payload.remarks,
                    updated_by: payload.updated_by,
                    task: payload.task,
                    oem: payload.oem,
                    slot: payload.slot,
                    priority: payload.priority,
                    owner: payload.owner,
                    frequency: payload.frequency,
                    deadline: payload.deadline,
                });
            } else {
                await apiFetch(API.CREATE, "POST", payload);
            }

            onClose();
            onSaved();
            Swal.fire({
                icon: "success",
                title: editId ? "Task Updated!" : "Task Assigned!",
                html: `<b>${taskName}</b> assigned to <b>${form.recipients.map(r => r.email).join(", ")}</b>`,
                timer: 2800, showConfirmButton: false, timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave error:", err);
            Swal.fire("Error", `Failed to save task: ${err.message}`, "error");
        } finally {
            setSaving(false);
        }
    };

    const fmtAssignedAt = () => {
        const now = new Date();
        return `${now.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", maxHeight: "92vh" } }}>
            <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "11px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={17} lineHeight={1.2} color="#1a1a2e">
                                {editId ? "Edit Task Assignment" : "Assign Task"}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {editId ? "Update task details" : "Fill in the details to assign"}
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Close" arrow>
                        <IconButton onClick={onClose} sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px", transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
                            <CloseIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ px: 3, pt: 2.5, pb: 1.5, overflowY: "auto" }}>
                <Box display="flex" flexDirection="column" gap={2.2}>

                    {/* ── Select Task ─────────────────────────────────────────────────── */}
                    <Autocomplete
                        options={taskOptions}
                        getOptionLabel={(opt) => (typeof opt === "object" ? opt.task ?? "" : opt)}
                        value={form.task}
                        onChange={(_, val) => setField("task", val)}
                        loading={taskLoading}
                        isOptionEqualToValue={(opt, val) =>
                            opt?.id === val?.id || opt?.task === val?.task
                        }
                        noOptionsText={taskLoading ? "Loading tasks…" : "No tasks found"}
                        renderOption={(props, opt) => (
                            <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <TaskAltOutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
                                    </Box>
                                    <Box>
                                        <Typography fontSize={13} fontWeight={600} color="#1a1a2e">{opt.task}</Typography>
                                        {opt.oem && <Typography fontSize={11} color="text.secondary">{opt.oem}{opt.slot ? ` · ${opt.slot}` : ""}</Typography>}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Task" size="small" placeholder="Search task name…"
                                error={!!errors.task} helperText={errors.task} sx={fieldSx}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <InputAdornment position="start">
                                                <TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
                                            </InputAdornment>
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {taskLoading ? <CircularProgress color="inherit" size={14} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }} />
                        )}
                    />

                    {/* ── Assignee (read-only) ────────────────────────────────────────── */}
                    <TextField label="Assigned By" value={form.assignee || userEmail}
                        size="small" fullWidth sx={fieldSx}
                        helperText="Auto-filled from your login session"
                        InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                    {/* ══ NEW: Owner Emails — searchable Autocomplete ════════════════════
                        - Options come from reporting-email-hierarchy/get/ API
                        - Selecting an option adds it as a chip (multi-select behaviour)
                        - User can also type a free-form email and press Enter
                        - Already-added recipients are filtered out from the dropdown
                    ════════════════════════════════════════════════════════════════════ */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Owner Emails
                            <Chip
                                label={`${form.recipients.length} added`}
                                size="small"
                                sx={{
                                    ml: 0.5, height: 18, fontSize: 10.5,
                                    bgcolor: form.recipients.length > 0 ? alpha(TEAL, 0.12) : "#f3f4f6",
                                    color: form.recipients.length > 0 ? TEAL_DARK : "text.secondary",
                                }}
                            />
                        </Typography>

                        {/* Selected recipient chips */}
                        {form.recipients.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
                                {form.recipients.map((r) => (
                                    <Chip
                                        key={r.email}
                                        label={r.email}
                                        size="small"
                                        onDelete={() => removeRecipient(r.email)}
                                        avatar={
                                            <Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>
                                                {(r.email[0] || "?").toUpperCase()}
                                            </Avatar>
                                        }
                                        sx={{
                                            bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600,
                                            fontSize: 11.5, height: 26,
                                            "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL },
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Searchable Autocomplete for emails */}
                        <Autocomplete
                            options={emailOptions.filter(
                                // Hide emails already added as recipients
                                (opt) => !form.recipients.some(r => r.email === (opt.assigned_to ?? "").toLowerCase())
                            )}
                            getOptionLabel={(opt) =>
                                typeof opt === "object" ? opt.assigned_to ?? "" : opt
                            }
                            // Controlled input text
                            inputValue={emailInputValue}
                            onInputChange={(_, val, reason) => {
                                // Keep the typed text unless user cleared or selected
                                if (reason !== "reset") setEmailInputValue(val);
                            }}
                            // When user selects an option from dropdown
                            onChange={(_, val) => {
                                if (val) {
                                    addRecipient(val);
                                }
                            }}
                            // value is always null — we never "lock" the Autocomplete to a value;
                            // selection immediately converts to a chip above
                            value={null}
                            loading={emailLoading}
                            freeSolo  // allows typing an email not in the list
                            clearOnBlur={false}
                            blurOnSelect
                            isOptionEqualToValue={(opt, val) =>
                                opt?.assigned_to === val?.assigned_to
                            }
                            noOptionsText={
                                emailLoading
                                    ? "Loading emails…"
                                    : emailInputValue
                                        ? `Press Enter to add "${emailInputValue}"`
                                        : "No emails found"
                            }
                            filterOptions={(options, { inputValue }) => {
                                const q = inputValue.toLowerCase();
                                return options.filter(o =>
                                    (o.assigned_to ?? "").toLowerCase().includes(q)
                                );
                            }}
                            renderOption={(props, opt) => (
                                <Box component="li" {...props} sx={{ py: 0.8, px: 1.5 }}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{
                                            width: 30, height: 30, fontSize: 11, fontWeight: 700,
                                            bgcolor: alpha(TEAL, 0.15), color: TEAL_DARK,
                                        }}>
                                            {(opt.assigned_to?.[0] || "?").toUpperCase()}
                                        </Avatar>
                                        <Typography fontSize={13} fontWeight={500} color="#1a1a2e">
                                            {opt.assigned_to}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    placeholder="Search or type email, then press Enter…"
                                    error={!!errors.recipients}
                                    helperText={
                                        errors.recipients ||
                                        "Search from saved emails or type a new one · Enter to add · Backspace removes last"
                                    }
                                    sx={fieldSx}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <>
                                                {emailLoading
                                                    ? <CircularProgress color="inherit" size={14} />
                                                    : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                        onKeyDown: (e) => {
                                            if (e.key === "Enter") {
                                                // freeSolo: add whatever is typed
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (emailInputValue.trim()) {
                                                    addRecipient(emailInputValue.trim());
                                                }
                                            }
                                            // Backspace with empty input → remove last chip
                                            if (e.key === "Backspace" && !emailInputValue && form.recipients.length > 0) {
                                                removeRecipient(form.recipients[form.recipients.length - 1].email);
                                            }
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>

                    {/* ── OEM + Slot ──────────────────────────────────────────────────── */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField select label="OEM" value={form.oem} onChange={(e) => setField("oem", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                <MenuItem value=""><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
                                {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField select label="Slot" value={form.slot} onChange={(e) => setField("slot", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                <MenuItem value=""><em style={{ color: "#aaa" }}>— Select Slot —</em></MenuItem>
                                {SLOT_OPTIONS.map(s => (
                                    <MenuItem key={s.value} value={s.value}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />{s.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Priority + Status ───────────────────────────────────────────── */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField select label="Priority" value={form.priority} onChange={(e) => setField("priority", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: priorityMeta(form.priority).color }} /></InputAdornment>) }}>
                                {PRIORITY_OPTIONS.map(p => (
                                    <MenuItem key={p.value} value={p.value}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
                                            <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(form.status), ml: 0.5, flexShrink: 0 }} /></InputAdornment>) }}>
                                {STATUS_OPTIONS.map(s => (
                                    <MenuItem key={s} value={s}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />{s}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Deadline ────────────────────────────────────────────────────── */}
                    <TextField label="Deadline" type="datetime-local" value={form.deadline}
                        onChange={(e) => setField("deadline", e.target.value)}
                        error={!!errors.deadline} helperText={errors.deadline || "Select date and time to complete the task"}
                        size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                    {/* ── Reminder Frequency ──────────────────────────────────────────── */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Reminder Frequency
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {REMINDER_OPTIONS.map((opt) => {
                                const isActive = form.reminderFrequency === opt;
                                const reminderIcons = { None: "🔕", Daily: "📅", Weekly: "🗓️", Monthly: "📆" };
                                return (
                                    <Box key={opt} onClick={() => setField("reminderFrequency", opt)} sx={{
                                        display: "flex", alignItems: "center", gap: 0.7,
                                        px: 2, py: 0.9, borderRadius: "10px",
                                        border: `1.5px solid ${isActive ? TEAL : "#e0e0e0"}`,
                                        bgcolor: isActive ? alpha(TEAL, 0.08) : "#fff",
                                        color: isActive ? TEAL_DARK : "#555",
                                        fontWeight: isActive ? 700 : 500, fontSize: 13,
                                        cursor: "pointer", transition: "all .15s", userSelect: "none",
                                        "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
                                    }}>
                                        <span style={{ fontSize: 15 }}>{reminderIcons[opt]}</span>
                                        <span>{opt}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ── Assigned at info ────────────────────────────────────────────── */}
                    <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.3, bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "10px" }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK, flexShrink: 0 }} />
                        <Typography fontSize={13} color={TEAL_DARK}><strong>Assigned at:</strong> {fmtAssignedAt()}</Typography>
                    </Paper>

                    {/* ── Remarks ─────────────────────────────────────────────────────── */}
                    <TextField label="Remarks (optional)" value={form.remarks}
                        onChange={(e) => setField("remarks", e.target.value)}
                        placeholder="Add any notes or instructions…"
                        size="small" fullWidth multiline rows={2} sx={fieldSx} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "10px", px: 2.5, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <span>⚡</span>}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 3, boxShadow: `0 2px 10px ${alpha(TEAL, 0.4)}`, fontSize: 14 }}>
                    {saving ? "Saving…" : editId ? "Update Task" : "Assign Task"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
const AssignTask = () => {
    const navigate = useNavigate();

    const userID = useMemo(() => getDecreyptedData("userID") || "", []);
    const userEmail = useMemo(() => {
        const fromDecrypt = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail");
        if (fromDecrypt && fromDecrypt.includes("@")) return fromDecrypt;
        return getLoggedInUserEmail();
    }, []);

    const [tasks, setTasks] = useState([]);
    const [taskOptionsList, setTaskOptionsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [sendingReminderId, setSendingReminderId] = useState(null);

    const [tableSearch, setTableSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [activeStatCard, setActiveStatCard] = useState("All");
    const [viewMode, setViewMode] = useState("table");
    const [analyticsOpen, setAnalyticsOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(todayStr());

    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const body = {
                assigned_by: userEmail,
                assigned_at: selectedDate,
            };

            console.log("Fetching tasks with:", body);

            const res = await fetch(`${BASE_URL}${API.GET_TASKS}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            console.log("Raw API response:", data);

            let taskList = [];
            if (Array.isArray(data)) taskList = data;
            else if (Array.isArray(data?.data)) taskList = data.data;
            else if (Array.isArray(data?.results)) taskList = data.results;
            else if (Array.isArray(data?.tasks)) taskList = data.tasks;

            console.log("Parsed task list:", taskList);
            setTasks(taskList);

            try {
                const formData = new FormData();
                formData.append("userID", userID || userEmail);
                const optRes = await fetch(`${BASE_URL}${API.GET_TASK_OPTIONS}`, {
                    method: "POST",
                    body: formData,
                });
                const optData = await optRes.json();
                const opts = Array.isArray(optData) ? optData : optData?.data ?? optData?.results ?? [];
                console.log("Task options loaded:", opts.length, "items");
                setTaskOptionsList(opts);
            } catch (e) {
                console.warn("Task options fetch failed:", e);
            }

        } catch (err) {
            console.error("fetchAll error:", err);
            Swal.fire("Error", `Failed to load tasks: ${err.message}`, "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userEmail, userID, selectedDate]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const dateFilteredTasks = useMemo(() => tasks, [tasks]);

    const stats = useMemo(() => ({
        total: dateFilteredTasks.length,
        active: dateFilteredTasks.filter(t => t.status === "Active").length,
        inProgress: dateFilteredTasks.filter(t => t.status === "In Progress").length,
        completed: dateFilteredTasks.filter(t => t.status === "Completed").length,
        cancelled: dateFilteredTasks.filter(t => t.status === "Cancelled").length,
        overdue: dateFilteredTasks.filter(t => isOverdue(t.deadline, t.status)).length,
    }), [dateFilteredTasks]);

    const filteredRows = useMemo(() => {
        const q = tableSearch.toLowerCase();
        return dateFilteredTasks.filter((row) => {
            const taskName = (row.task ?? "").toLowerCase();
            const oem = (row.oem ?? "").toLowerCase();
            const ownerStr = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
            const assignedBy = (row.assigned_by ?? "").toLowerCase();
            const id = String(row.id ?? "").toLowerCase();
            const taskId = (row.task_id ?? "").toLowerCase();
            const matchQ = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q) || id.includes(q) || taskId.includes(q);
            const matchS = activeStatCard === "All" ? true : row.status === activeStatCard;
            const matchD = statusFilter === "All" ? true : row.status === statusFilter;
            return matchQ && matchS && matchD;
        });
    }, [dateFilteredTasks, tableSearch, activeStatCard, statusFilter]);

    const kanbanCols = useMemo(() => {
        const grouped = {};
        KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
        filteredRows.forEach(r => {
            const key = r.status;
            if (grouped[key]) grouped[key].push(r);
        });
        return grouped;
    }, [filteredRows]);

    const handleStatClick = (label) => {
        setActiveStatCard(label);
        setStatusFilter(label);
        setTableSearch("");
    };

    const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
        const row = tasks.find(t => String(t.id) === String(cardId));
        if (!row) return;
        setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
        try {
            await apiFetch(API.UPDATE(cardId), "PUT", {
                status: newStatus,
                updated_by: userEmail,
            });
        } catch (e) {
            console.error("Status update failed:", e);
            setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
            Swal.fire("Error", "Failed to update status.", "error");
        }
    }, [tasks, userEmail]);

    const handleSendReminder = useCallback(async (row) => {
        const freq = getFrequency(row);
        const owners = Array.isArray(row.owner) ? row.owner.join(", ") : (row.owner ?? "—");
        const result = await Swal.fire({
            title: "Send Reminder?",
            html: `<div style="text-align:left;font-size:13.5px;color:#444;line-height:1.8">
                <div><b>Task:</b> ${row.task}</div>
                <div><b>Owner(s):</b> ${owners}</div>
                <div><b>Frequency:</b> ${freq}</div>
                <div><b>Deadline:</b> ${fmtDate(row.deadline)}</div>
            </div><p style="margin-top:10px;font-size:12.5px;color:#888">A reminder email will be sent now.</p>`,
            icon: "info", showCancelButton: true,
            confirmButtonColor: TEAL, confirmButtonText: "Send Now", cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        setSendingReminderId(row.id);
        try {
            await apiFetch(API.SEND_REMINDER(row.id), "POST", {});
            Swal.fire({ icon: "success", title: "Reminder Sent!", html: `Reminder for <b>${row.task}</b> dispatched.`, timer: 2500, showConfirmButton: false, timerProgressBar: true });
        } catch (err) {
            Swal.fire("Error", "Failed to send reminder.", "error");
        } finally {
            setSendingReminderId(null);
        }
    }, []);

    const openCreate = () => { setEditId(null); setEditForm(null); setDialogOpen(true); };

    const openEdit = (row) => {
        setEditId(row.id);
        const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
        const recipients = owners.map(email => ({ name: email, email }));
        setEditForm({
            taskInput: row.task ?? "",
            assignee: row.assigned_by ?? userEmail,
            recipients,
            recipientInput: "",
            oem: row.oem ?? "",
            slot: row.slot ?? "",
            priority: row.priority ?? "Medium",
            status: row.status ?? "Active",
            deadline: row.deadline ? new Date(row.deadline).toISOString().slice(0, 16) : "",
            reminderFrequency: getFrequency(row) || "None",
            remarks: row.remarks ?? "",
        });
        setDialogOpen(true);
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete Task?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
            icon: "warning", showCancelButton: true,
            confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
        }).then(async (res) => {
            if (!res.isConfirmed) return;
            try {
                await apiFetch(API.DELETE(row.id), "DELETE");
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
                await fetchAll();
            } catch (err) {
                Swal.fire("Error", `Failed to delete: ${err.message}`, "error");
            }
        });
    };

    const fmtSelectedDate = (dateStr) => {
        if (!dateStr) return "All dates";
        const today = todayStr();
        const yesterday = toLocalDateStr(new Date(Date.now() - 86400000));
        if (dateStr === today) return "Today";
        if (dateStr === yesterday) return "Yesterday";
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const TABLE_HEADERS = ["SN", "Task ID", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Reminder", "Deadline", "Status", "Actions"];

    return (
        <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

            {/* Breadcrumb */}
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
                </Breadcrumbs>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

                {/* ── Header ── */}
                <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5", background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)` }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: "12px",
                                background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: `0 4px 12px ${alpha(TEAL, 0.35)}`, flexShrink: 0,
                            }}>
                                <AssignmentTurnedInOutlinedIcon sx={{ color: "#fff", fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Assign Task</Typography>
                                <Typography fontSize={13} color="text.secondary" mt={0.2}>
                                    Manage daily task assignments · drag kanban cards to update status
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            <TextField
                                type="date" size="small" value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setActiveStatCard("All");
                                    setStatusFilter("All");
                                    setTableSearch("");
                                }}
                                inputProps={{ max: todayStr() }}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    minWidth: 160,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px", bgcolor: "#fff", fontSize: 13.5, fontWeight: 600, color: TEAL_DARK,
                                        "&:hover fieldset": { borderColor: TEAL },
                                        "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: 2 },
                                        "& fieldset": { borderColor: TEAL_MID },
                                    },
                                    "& input[type='date']::-webkit-calendar-picker-indicator": {
                                        filter: `invert(30%) sepia(80%) saturate(400%) hue-rotate(140deg)`,
                                        cursor: "pointer", opacity: 0.8,
                                    },
                                }}
                            />

                            <Button variant="outlined"
                                startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                                onClick={() => setAnalyticsOpen(true)}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: "#d0d5dd", color: "#374151", height: 36, "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                                Analytics
                            </Button>

                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                                sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, height: 36, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
                                <ToggleButton value="table"><Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                                <ToggleButton value="kanban"><Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                            </ToggleButtonGroup>

                            <Button variant="outlined"
                                startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
                                onClick={() => fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </Button>

                            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                                sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, height: 36, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
                                Assign Task
                            </Button>
                        </Box>
                    </Box>

                    {userEmail && (
                        <Box mt={1.5} display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={12} color="text.secondary">Showing tasks assigned by:</Typography>
                            <Chip label={userEmail} size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                            <Typography fontSize={12} color="text.secondary">on</Typography>
                            <Chip label={fmtSelectedDate(selectedDate)} size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                        </Box>
                    )}
                </Box>

                {/* ── Stat cards ── */}
                <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <StatCard label="Total" count={stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT}
                            active={activeStatCard === "All"} loading={loading} onClick={() => handleStatClick("All")} />
                        <StatCard label="Active" count={stats.active} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0"
                            active={activeStatCard === "Active"} loading={loading} onClick={() => handleStatClick("Active")} />
                        <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9"
                            active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
                        <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd"
                            active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
                        <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea"
                            active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
                        {stats.overdue > 0 && (
                            <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0"
                                active={false} loading={loading} onClick={() => { }} />
                        )}
                    </Box>
                </Box>

                {/* ── Search + filter ── */}
                <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField size="small" placeholder="Search task, ID, Task ID (DTR…), owner, OEM…"
                        value={tableSearch}
                        onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
                        sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

                    <TextField select size="small" value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
                        sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
                        {STATUS_FILTERS.map(s => (
                            <MenuItem key={s} value={s}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}{s}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    {(tableSearch || statusFilter !== "All") && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={12} color="text.secondary">{filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}</Typography>
                            <Chip label="Clear" size="small"
                                onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); }}
                                sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
                        </Box>
                    )}
                </Box>

                {/* ════ KANBAN ════ */}
                {viewMode === "kanban" && (
                    <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
                        {loading ? (
                            <Box display="flex" gap={2}>
                                {[1, 2, 3, 4].map(i => (
                                    <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
                                        {[1, 2, 3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
                                {KANBAN_COLS.map(col => (
                                    <KanbanColumn key={col.key} col={col}
                                        cards={kanbanCols[col.key] || []}
                                        onEdit={openEdit} onDelete={handleDelete}
                                        onSendReminder={handleSendReminder}
                                        onStatusChange={handleKanbanStatusChange} />
                                ))}
                            </Box>
                        )}
                        <Typography variant="caption" color="text.disabled" display="block" textAlign="center" mt={2}>
                            Drag cards between columns to update status instantly
                        </Typography>
                    </Box>
                )}

                {/* ════ TABLE ════ */}
                {viewMode === "table" && (
                    <>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: TEAL }}>
                                        {TABLE_HEADERS.map(h => (
                                            <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: TABLE_HEADERS.length }).map((_, j) => (
                                                <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                    {!loading && filteredRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={TABLE_HEADERS.length} align="center" sx={{ py: 8 }}>
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                                                    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
                                                    </Box>
                                                    <Typography fontWeight={600} fontSize={14} color="text.secondary">
                                                        {tableSearch || statusFilter !== "All"
                                                            ? "No tasks match your filters"
                                                            : `No tasks found for ${fmtSelectedDate(selectedDate)}`}
                                                    </Typography>
                                                    <Typography fontSize={12.5} color="text.disabled">
                                                        {tableSearch || statusFilter !== "All"
                                                            ? "Try adjusting filters"
                                                            : "Try a different date or click + Assign Task"}
                                                    </Typography>
                                                    {!userEmail && (
                                                        <Typography fontSize={12} color="error.main" fontWeight={600}>
                                                            ⚠ Could not detect logged-in user email. Check localStorage keys.
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading && filteredRows.map((row, idx) => {
                                        const pm = priorityMeta(row.priority);
                                        const sm = slotMeta(row.slot);
                                        const overdue = isOverdue(row.deadline, row.status);
                                        const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
                                        const freq = getFrequency(row);
                                        const isSendingThis = sendingReminderId === row.id;

                                        return (
                                            <TableRow key={row.id ?? idx} hover sx={{
                                                "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                                                "&:hover": { bgcolor: alpha(TEAL, 0.025) },
                                                bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
                                                transition: "background .12s",
                                            }}>
                                                <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 36, fontWeight: 600 }}>{idx + 1}</TableCell>

                                                <TableCell>
                                                    {row.task_id ? (
                                                        <Tooltip title={row.task_id} arrow>
                                                            <Chip
                                                                icon={<TagOutlinedIcon sx={{ fontSize: "13px !important", color: "#5b21b6 !important" }} />}
                                                                label={row.task_id}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha("#7c3aed", 0.08),
                                                                    color: "#5b21b6",
                                                                    fontWeight: 700,
                                                                    fontSize: 10.5,
                                                                    fontFamily: "monospace",
                                                                    border: `1px solid ${alpha("#7c3aed", 0.25)}`,
                                                                    maxWidth: 160,
                                                                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography color="text.disabled" fontSize={12}>—</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.7}>
                                                        {overdue && (
                                                            <Tooltip title="Overdue" arrow>
                                                                <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} />
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title={row.task} arrow placement="top">
                                                            <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 180 }}>
                                                                {row.task}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Box>
                                                    {row.remarks && (
                                                        <Typography fontSize={11} color="text.disabled" noWrap sx={{ maxWidth: 180, fontStyle: "italic" }}>
                                                            {row.remarks}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.6}>
                                                        <Box display="flex">
                                                            {owners.slice(0, 3).map((o, i) => (
                                                                <Tooltip key={i} title={o} arrow>
                                                                    <Avatar sx={{ width: 26, height: 26, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, border: "2px solid #fff", ml: i > 0 ? -0.8 : 0 }}>
                                                                        {(o[0] || "?").toUpperCase()}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            ))}
                                                        </Box>
                                                        <Typography fontSize={12} fontWeight={500} color="#374151" noWrap sx={{ maxWidth: 120 }}>
                                                            {owners.slice(0, 2).join(", ")}{owners.length > 2 ? ` +${owners.length - 2}` : ""}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.8}>
                                                        {row.assigned_by ? (
                                                            <>
                                                                <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha("#7c3aed", 0.15), color: "#5b21b6" }}>
                                                                    {(row.assigned_by[0] || "?").toUpperCase()}
                                                                </Avatar>
                                                                <Typography fontSize={12.5} color="#374151" fontWeight={500} noWrap sx={{ maxWidth: 120 }}>
                                                                    {row.assigned_by}
                                                                </Typography>
                                                            </>
                                                        ) : <Typography fontSize={12.5} color="text.disabled">—</Typography>}
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.oem || "—"} size="small"
                                                        sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11, border: "1px solid #90caf9" }} />
                                                </TableCell>

                                                <TableCell>
                                                    {sm
                                                        ? <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11, border: `1px solid ${alpha(sm.color, 0.3)}` }} />
                                                        : <Typography color="text.disabled" fontSize={12}>{row.slot || "—"}</Typography>
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.priority || "—"} size="small"
                                                        sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                                                </TableCell>

                                                <TableCell>
                                                    {freq && freq !== "None" ? (
                                                        <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "12px !important" }} />}
                                                            label={freq} size="small"
                                                            sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11, border: `1px solid ${TEAL_MID}` }} />
                                                    ) : (
                                                        <Typography color="text.disabled" fontSize={12}>None</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                    <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
                                                        {fmtDate(row.deadline)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.status ?? "Active"} size="small"
                                                        sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status), fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" gap={0.5} alignItems="center">
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton size="small" onClick={() => openEdit(row)}
                                                                sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}>
                                                                <EditOutlinedIcon sx={{ fontSize: 17 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" arrow>
                                                            <IconButton size="small" onClick={() => handleDelete(row)}
                                                                sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
                                                                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={freq && freq !== "None" ? `Send ${freq} reminder` : "No reminder set"} arrow>
                                                            <span>
                                                                <IconButton size="small"
                                                                    onClick={() => handleSendReminder(row)}
                                                                    disabled={!freq || freq === "None" || isSendingThis}
                                                                    sx={{ color: freq && freq !== "None" ? "#7c3aed" : "#d1d5db", "&:hover": { bgcolor: freq && freq !== "None" ? "#f3e8ff" : "transparent" }, "&.Mui-disabled": { color: "#d1d5db" } }}>
                                                                    {isSendingThis
                                                                        ? <CircularProgress size={15} sx={{ color: "#7c3aed" }} />
                                                                        : <NotificationsActiveOutlinedIcon sx={{ fontSize: 17 }} />
                                                                    }
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {!loading && (
                            <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="caption" color="text.disabled">
                                    Showing <strong>{filteredRows.length}</strong> of <strong>{dateFilteredTasks.length}</strong> tasks
                                    <span style={{ marginLeft: 8, color: TEAL, fontWeight: 600 }}>for {fmtSelectedDate(selectedDate)}</span>
                                    {stats.overdue > 0 && (
                                        <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>⚠ {stats.overdue} overdue</span>
                                    )}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    ✎ edit · 🗑 remove · 🔔 send reminder
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            <AnalyticsPanel tasks={dateFilteredTasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

            <AssignTaskDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                editId={editId}
                initialForm={editForm}
                onSaved={fetchAll}
                taskOptionsList={taskOptionsList}
                userEmail={userEmail}
                userID={userID}
            />
        </Box>
    );
};

export default AssignTask;