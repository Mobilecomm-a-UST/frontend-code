

// import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar, LinearProgress,
//     ToggleButton, ToggleButtonGroup, Drawer,
// } from "@mui/material";
// import AddIcon                    from "@mui/icons-material/Add";
// import DeleteOutlineIcon          from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon           from "@mui/icons-material/EditOutlined";
// import CloseIcon                  from "@mui/icons-material/Close";
// import RefreshIcon                from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon  from "@mui/icons-material/AssignmentIndOutlined";
// import CalendarTodayOutlinedIcon  from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon        from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon          from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon         from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon        from "@mui/icons-material/WbSunnyOutlined";
// import AccessTimeOutlinedIcon     from "@mui/icons-material/AccessTimeOutlined";
// import FlagOutlinedIcon           from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon          from "@mui/icons-material/EventOutlined";
// import NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
// import GroupAddOutlinedIcon       from "@mui/icons-material/GroupAddOutlined";
// import SearchIcon                 from "@mui/icons-material/Search";
// import FilterListIcon             from "@mui/icons-material/FilterList";
// import HourglassEmptyIcon         from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon      from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon     from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon         from "@mui/icons-material/CancelOutlined";
// import ViewKanbanOutlinedIcon     from "@mui/icons-material/ViewKanbanOutlined";
// import TableRowsOutlinedIcon      from "@mui/icons-material/TableRowsOutlined";
// import BarChartOutlinedIcon       from "@mui/icons-material/BarChartOutlined";
// import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
// import TrendingUpOutlinedIcon     from "@mui/icons-material/TrendingUpOutlined";
// import PersonSearchOutlinedIcon   from "@mui/icons-material/PersonSearchOutlined";
// import BusinessIcon               from "@mui/icons-material/Business";
// import ScheduleIcon               from "@mui/icons-material/Schedule";
// import PersonIcon                 from "@mui/icons-material/Person";
// import AssignmentIcon             from "@mui/icons-material/Assignment";
// import RepeatIcon                 from "@mui/icons-material/Repeat";
// import Breadcrumbs                from "@mui/material/Breadcrumbs";
// import Link                       from "@mui/material/Link";
// import KeyboardArrowRightIcon     from "@mui/icons-material/KeyboardArrowRight";
// import Swal                       from "sweetalert2";
// import { postData, getData, deleteData, putData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate }            from "react-router-dom";

// // ─── theme ───────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// // ─── static options ───────────────────────────────────────────────────────────
// const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

// const SLOT_OPTIONS = [
//     { value: "Morning",   label: "🌤  Morning",   color: "#f57c00" },
//     { value: "Afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "Evening",   label: "🌙  Evening",   color: "#5c6bc0" },
//     { value: "Night",     label: "🌌  Night",     color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High",     color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
// ];

// const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];
// const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];

// const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "One-Time"];

// const KANBAN_COLS = [
//     { key: "Pending",     label: "Pending",     color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
//     { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Completed",   label: "Done",        color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Cancelled",   label: "Cancelled",   color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
// ];


// const API = {
//     CREATE:          "dailytask_review/tasks/create/",
//     GET_ALL:         "dailytask_review/tasks/",
//     UPDATE:          (pk) => `dailytask_review/tasks/update/${pk}/`,
//     DELETE:          (pk) => `dailytask_review/tasks/delete/${pk}/`,
//     GET_TASKS:       "dailytask_review/tasks/get/",
//     GET_USERS:       "dailytask_review/users/",
//     // UPDATE_REMINDER: (pk) => `dailytask_review/assign/reminder/${pk}/`,
//     SEARCH_USERS:    (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
// };

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const nowISO   = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const fmtTime  = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
// const isOverdue = (iso, status) =>
//     iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

// const statusColor = (s) =>
//     ({ Pending: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
// const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());

// const getLoggedInUser = () => {
//     try {
//         const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
//         const obj = JSON.parse(raw);
//         return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
//     } catch { return { name: "", email: "" }; }
// };

// const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// const EMPTY_FORM = {
//     task: "", oem: "", slot: "", priority: "Medium",
//     owner: [],           // array of names
//     ownerInput: "",
//     assigned_by: "",
//     frequency: "Weekly",
//     deadline: "",
//     startdatetime: "",
//     enddatetime: "",
//     remarks: "",
//     status: "Pending",
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
//         const byStatus   = { Pending: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
//         const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//         const byOEM      = {};
//         const bySlot     = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
//         const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;

//         tasks.forEach(t => {
//             if (byStatus[t.status]     !== undefined) byStatus[t.status]++;
//             if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
//             if (t.oem)  byOEM[t.oem]   = (byOEM[t.oem]   || 0) + 1;
//             if (t.slot) bySlot[t.slot] = (bySlot[t.slot]  || 0) + 1;
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
//                         <Typography fontSize={12} color="text.secondary">Live task stats</Typography>
//                     </Box>
//                     <IconButton size="small" onClick={onClose}
//                         sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                         <CloseIcon sx={{ fontSize: 17 }} />
//                     </IconButton>
//                 </Box>
//             </Box>
//             <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>

//                 {/* completion ring */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                         <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Completion Rate
//                     </Typography>
//                     <Box display="flex" alignItems="center" gap={2}>
//                         <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
//                             <svg width="80" height="80">
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
//                                     strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
//                                     strokeLinecap="round" transform="rotate(-90 40 40)" />
//                             </svg>
//                             <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 16, color: TEAL }}>
//                                 {stats.completionRate}%
//                             </Typography>
//                         </Box>
//                         <Box flex={1}>
//                             <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} done</Typography>
//                             {stats.overdueCount > 0 && (
//                                 <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                     label={`${stats.overdueCount} overdue`} size="small"
//                                     sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
//                             )}
//                         </Box>
//                     </Box>
//                 </Paper>

//                 {/* status */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
//                     <ProgressRow label="Pending"     value={stats.byStatus["Pending"]}     max={stats.total} color="#f57c00" />
//                     <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
//                     <ProgressRow label="Completed"   value={stats.byStatus["Completed"]}   max={stats.total} color="#1565c0" />
//                     <ProgressRow label="Cancelled"   value={stats.byStatus["Cancelled"]}   max={stats.total} color="#c62828" />
//                 </Paper>

//                 {/* priority */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
//                     {PRIORITY_OPTIONS.map(p => (
//                         <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
//                     ))}
//                 </Paper>

//                 {/* OEM */}
//                 {Object.keys(stats.byOEM).length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
//                         {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
//                             <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
//                         ))}
//                     </Paper>
//                 )}

//                 {/* slot */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
//                     <Box display="flex" gap={1} flexWrap="wrap">
//                         {SLOT_OPTIONS.map(s => {
//                             const cnt = stats.bySlot[s.value] || 0;
//                             const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
//                             return (
//                                 <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
//                                     bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
//                                     <Typography fontSize={18}>{s.label.split("  ")[0]}</Typography>
//                                     <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
//                                     <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
//                                 </Box>
//                             );
//                         })}
//                     </Box>
//                 </Paper>

//                 {/* top owners */}
//                 {stats.topOwners.length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                             <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Owners
//                         </Typography>
//                         {stats.topOwners.map(([name, cnt]) => (
//                             <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
//                                 <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                     {(name[0] || "?").toUpperCase()}
//                                 </Avatar>
//                                 <Box flex={1} minWidth={0}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                         <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
//                                         <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
//                                     </Box>
//                                     <LinearProgress variant="determinate"
//                                         value={(cnt / (stats.topOwners[0]?.[1] || 1)) * 100}
//                                         sx={{ height: 4, borderRadius: 2, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 } }} />
//                                 </Box>
//                             </Box>
//                         ))}
//                     </Paper>
//                 )}
//             </Box>
//         </Drawer>
//     );
// };

// // ─── Kanban Card ──────────────────────────────────────────────────────────────
// const KanbanCard = ({ row, onEdit, onDelete, onStatusChange }) => {
//     const pm    = priorityMeta(row.priority);
//     const sm    = slotMeta(row.slot);
//     const overdue = isOverdue(row.deadline, row.status);
//     const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

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
//                 <Chip label={row.priority || "—"} size="small"
//                     sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                 <Box display="flex" gap={0.5}>
//                     {overdue && <Tooltip title="Overdue!" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} /></Tooltip>}
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
//                 {sm       && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
//                 {row.frequency && <Chip label={row.frequency} size="small" sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontSize: 10, height: 18 }} />}
//             </Box>

//             <Box display="flex" alignItems="center" justifyContent="space-between">
//                 <Box display="flex" alignItems="center" gap={0.6}>
//                     {owners.length > 0 ? (
//                         <>
//                             <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                 {owners[0][0].toUpperCase()}
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
// const KanbanColumn = ({ col, cards, onEdit, onDelete, onStatusChange }) => {
//     const [dragOver, setDragOver] = useState(false);

//     const handleDrop = (e) => {
//         e.preventDefault(); setDragOver(false);
//         const cardId     = e.dataTransfer.getData("cardId");
//         const fromStatus = e.dataTransfer.getData("fromStatus");
//         if (fromStatus !== col.key) onStatusChange(cardId, col.key);
//     };

//     return (
//         <Box sx={{
//             flex: 1, minWidth: 220, maxWidth: 280,
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
//                 <KanbanCard key={row.id} row={row} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
//             ))}
//         </Box>
//     );
// };

// // ─── fieldSx ─────────────────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         "&:hover fieldset":       { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     const [tasks,      setTasks]      = useState([]);
//     const [users,      setUsers]      = useState([]);
//     const [loading,    setLoading]    = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId,     setEditId]     = useState(null);
//     const [form,       setForm]       = useState(EMPTY_FORM);
//     const [errors,     setErrors]     = useState({});
//     const [saving,     setSaving]     = useState(false);

//     const [tableSearch,    setTableSearch]    = useState("");
//     const [statusFilter,   setStatusFilter]   = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");
//     const [viewMode,       setViewMode]       = useState("table");
//     const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
//     const [myTasksOnly,    setMyTasksOnly]    = useState(false);

//     // owner suggestion state
//     const [ownerSuggestions, setOwnerSuggestions] = useState([]);
//     const [ownerSearching,   setOwnerSearching]   = useState(false);
//     const [showOwnerSuggest, setShowOwnerSuggest] = useState(false);
//     const ownerInputRef    = useRef(null);
//     const ownerSuggestRef  = useRef(null);
//     const ownerSearchTimer = useRef(null);

//     const loggedInUser = useMemo(() => getLoggedInUser(), []);

//     // ── fetch ──────────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const [taskRes, userRes] = await Promise.allSettled([
//                 getData(API.GET_TASKS),
//                 getData(API.GET_USERS),
//             ]);
//             const safe = (r) => r.status === "fulfilled"
//                 ? (Array.isArray(r.value) ? r.value : r.value?.data ?? [])
//                 : [];
//             setTasks(safe(taskRes));
//             setUsers(safe(userRes));
//         } catch (err) { console.error("fetchAll:", err); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     useEffect(() => {
//         const h = (e) => { if (ownerSuggestRef.current && !ownerSuggestRef.current.contains(e.target)) setShowOwnerSuggest(false); };
//         document.addEventListener("mousedown", h);
//         return () => document.removeEventListener("mousedown", h);
//     }, []);

//     // ── stats ──────────────────────────────────────────────────────────────────
//     const stats = useMemo(() => ({
//         total:      tasks.length,
//         pending:    tasks.filter(t => t.status === "Pending").length,
//         inProgress: tasks.filter(t => t.status === "In Progress").length,
//         completed:  tasks.filter(t => t.status === "Completed").length,
//         cancelled:  tasks.filter(t => t.status === "Cancelled").length,
//         overdue:    tasks.filter(t => isOverdue(t.deadline, t.status)).length,
//     }), [tasks]);

//     // ── filtered rows ──────────────────────────────────────────────────────────
//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return tasks.filter((row) => {
//             const taskName    = (row.task ?? "").toLowerCase();
//             const oem         = (row.oem  ?? "").toLowerCase();
//             const ownerStr    = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
//             const assignedBy  = (row.assigned_by ?? "").toLowerCase();
//             const matchQ      = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q);
//             const matchS      = activeStatCard === "All" ? true : row.status === activeStatCard;
//             const matchD      = statusFilter   === "All" ? true : row.status === statusFilter;
//             const matchMe     = !myTasksOnly   || ownerStr.includes(loggedInUser.name.toLowerCase());
//             return matchQ && matchS && matchD && matchMe;
//         });
//     }, [tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

//     // kanban grouped
//     const kanbanCols = useMemo(() => {
//         const grouped = {};
//         KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
//         filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
//         return grouped;
//     }, [filteredRows]);

//     const handleStatClick = (label) => {
//         setActiveStatCard(label);
//         setStatusFilter(label);
//         setTableSearch("");
//     };

//     // ── kanban drag-drop ───────────────────────────────────────────────────────
//     const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
//         const row = tasks.find(t => String(t.id) === String(cardId));
//         if (!row) return;
//         setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
//         try {
//             await postData(API.UPDATE(cardId), { ...row, status: newStatus });
//         } catch (e) {
//             console.error("Status update failed:", e);
//             setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
//         }
//     }, [tasks]);

//     // ── form helpers ───────────────────────────────────────────────────────────
//     const setField = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); };

//     // owner search
//     const searchOwners = (query) => {
//         setField("ownerInput", query);
//         if (!query.trim()) { setOwnerSuggestions([]); setShowOwnerSuggest(false); return; }
//         clearTimeout(ownerSearchTimer.current);
//         ownerSearchTimer.current = setTimeout(async () => {
//             setOwnerSearching(true);
//             try {
//                 const res  = await getData(API.SEARCH_USERS(query));
//                 const list = Array.isArray(res) ? res : res?.data ?? [];
//                 setOwnerSuggestions(list.filter(u => !form.owner.includes(u.name ?? u.username)));
//                 setShowOwnerSuggest(true);
//             } catch { }
//             finally { setOwnerSearching(false); }
//         }, 350);
//     };

//     const pickOwner = (user) => {
//         const name = user.name ?? user.username ?? "";
//         if (!name) return;
//         setForm(p => ({ ...p, owner: [...p.owner, name], ownerInput: "" }));
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         setTimeout(() => ownerInputRef.current?.focus(), 50);
//     };

//     const commitOwnerInput = () => {
//         const val = form.ownerInput.trim();
//         if (!val || form.owner.includes(val)) return;
//         setForm(p => ({ ...p, owner: [...p.owner, val], ownerInput: "" }));
//     };

//     const removeOwner = (name) => setForm(p => ({ ...p, owner: p.owner.filter(o => o !== name) }));

//     const validate = () => {
//         const e = {};
//         if (!form.task.trim())     e.task     = "Task name is required";
//         if (!form.oem)             e.oem      = "OEM is required";
//         if (!form.slot)            e.slot     = "Slot is required";
//         if (form.owner.length === 0) e.owner  = "Add at least one owner";
//         if (!form.deadline)        e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const openCreate = () => {
//         const me = getLoggedInUser();
//         setEditId(null);
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         setForm({
//             ...EMPTY_FORM,
//             assigned_by: me.name,
//             deadline: nowLocal(),
//             startdatetime: nowLocal(),
//             endddatetime: "",
//         });
//         setErrors({}); setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id);
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
//         setForm({
//             task:          row.task          ?? "",
//             oem:           row.oem           ?? "",
//             slot:          row.slot          ?? "",
//             priority:      row.priority      ?? "Medium",
//             owner:         owners,
//             ownerInput:    "",
//             assigned_by:   row.assigned_by   ?? "",
//             frequency:     row.frequency     ?? "Weekly",
//             deadline:      row.deadline      ? row.deadline.slice(0, 10)  : "",
//             startdatetime: row.startdatetime ? row.startdatetime.slice(0, 16) : "",
//             enddatetime:   row.enddatetime   ? row.enddatetime.slice(0, 16)   : "",
//             remarks:       row.remarks       ?? "",
//             status:        row.status        ?? "Pending",
//         });
//         setErrors({}); setDialogOpen(true);
//     };

//     // ── save (create / update) ─────────────────────────────────────────────────
//     const handleSave = async () => {
//         if (form.ownerInput.trim()) commitOwnerInput();
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const payload = {
//                 task:          form.task.trim(),
//                 oem:           form.oem,
//                 slot:          form.slot,
//                 priority:      form.priority,
//                 owner:         form.owner,            // array
//                 assigned_by:   form.assigned_by,
//                 frequency:     form.frequency,
//                 status:        form.status,
//                 deadline:      form.deadline ? new Date(form.deadline).toISOString().slice(0, 10) : null,
//                 startdatetime: form.startdatetime ? new Date(form.startdatetime).toISOString() : null,
//                 enddatetime:   form.enddatetime   ? new Date(form.enddatetime).toISOString()   : null,
//                 remarks:       form.remarks,
//                 assigned_at:   nowISO(),
//             };

//             if (editId) {
//                 await postData(API.UPDATE(editId), payload);
//             } else {
//                 await postData(API.CREATE, payload);
//             }

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Task Updated!" : "Task Assigned!",
//                 html: `<b>${form.task}</b> assigned to <b>${form.owner.join(", ")}</b>`,
//                 timer: 2800, showConfirmButton: false, timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave:", err);
//             Swal.fire("Error", "Failed to save task.", "error");
//         } finally { setSaving(false); }
//     };

//     // ── delete ─────────────────────────────────────────────────────────────────
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Delete Task?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
//             icon: "warning", showCancelButton: true,
//             confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await deleteData(API.DELETE(row.id));
//                 await fetchAll();
//             } catch { Swal.fire("Error", "Failed to delete task.", "error"); }
//         });
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//             {/* breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* ════ main card ════ */}
//             <Paper elevation={0} sx={{
//                 borderRadius: "20px", overflow: "hidden",
//                 border: "1px solid #e8ecf0", bgcolor: "#fff",
//                 boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
//             }}>

//                 {/* ── header ── */}
//                 <Box sx={{
//                     px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5",
//                     background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
//                 }}>
//                     <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
//                         <Box>
//                             <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Assign Task</Typography>
//                             <Typography fontSize={13} color="text.secondary" mt={0.3}>
//                                 Manage daily task assignments · drag kanban cards to update status
//                             </Typography>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
//                             {/* my tasks */}
//                             <Chip icon={<PersonOutlineIcon sx={{ fontSize: "14px !important" }} />}
//                                 label="My Tasks" onClick={() => setMyTasksOnly(p => !p)}
//                                 variant={myTasksOnly ? "filled" : "outlined"}
//                                 sx={{
//                                     fontWeight: 600, fontSize: 12, cursor: "pointer",
//                                     bgcolor: myTasksOnly ? alpha(TEAL, 0.12) : "transparent",
//                                     color: myTasksOnly ? TEAL_DARK : "text.secondary",
//                                     borderColor: myTasksOnly ? TEAL : "#d0d5dd",
//                                     "& .MuiChip-icon": { color: myTasksOnly ? TEAL : "inherit" },
//                                 }} />

//                             {/* analytics */}
//                             <Button variant="outlined"
//                                 startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
//                                 onClick={() => setAnalyticsOpen(true)}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: "#d0d5dd", color: "#374151",
//                                     "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
//                                 Analytics
//                             </Button>

//                             {/* view toggle */}
//                             <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3,
//                                     "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
//                                 <ToggleButton value="table">
//                                     <Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                                 <ToggleButton value="kanban">
//                                     <Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* refresh */}
//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important",
//                                     animation: refreshing ? "spin .8s linear infinite" : "none",
//                                     "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>

//                             {/* assign */}
//                             <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                                 sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                                     fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5,
//                                     boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
//                                 Assign Task
//                             </Button>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {/* ── stat cards ── */}
//                 <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
//                     <Box display="flex" gap={2} flexWrap="wrap">
//                         <StatCard label="Total"       count={stats.total}      icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} active={activeStatCard === "All"}         loading={loading} onClick={() => handleStatClick("All")} />
//                         <StatCard label="Pending"     count={stats.pending}    icon={<HourglassEmptyIcon />}       color="#f57c00" bg="#fff3e0"     active={activeStatCard === "Pending"}     loading={loading} onClick={() => handleStatClick("Pending")} />
//                         <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />}   color="#2e7d32" bg="#e8f5e9"     active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
//                         <StatCard label="Completed"   count={stats.completed}  icon={<CheckCircleOutlineIcon />}  color="#1565c0" bg="#e3f2fd"     active={activeStatCard === "Completed"}   loading={loading} onClick={() => handleStatClick("Completed")} />
//                         <StatCard label="Cancelled"   count={stats.cancelled}  icon={<CancelOutlinedIcon />}      color="#c62828" bg="#fdecea"     active={activeStatCard === "Cancelled"}   loading={loading} onClick={() => handleStatClick("Cancelled")} />
//                         {stats.overdue > 0 && (
//                             <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => {}} />
//                         )}
//                     </Box>
//                 </Box>

//                 {/* ── search + filter ── */}
//                 <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
//                     <TextField size="small" placeholder="Search task, owner, OEM or assigned by…"
//                         value={tableSearch}
//                         onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                         sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                             "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

//                     <TextField select size="small" value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                         sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                             "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
//                         {STATUS_FILTERS.map(s => (
//                             <MenuItem key={s} value={s}>
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}
//                                     {s}
//                                 </Box>
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     {(tableSearch || statusFilter !== "All" || myTasksOnly) && (
//                         <Box display="flex" alignItems="center" gap={1}>
//                             <Typography fontSize={12} color="text.secondary">
//                                 {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
//                             </Typography>
//                             <Chip label="Clear" size="small"
//                                 onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
//                                 sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ════ KANBAN ════ */}
//                 {viewMode === "kanban" && (
//                     <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
//                         {loading ? (
//                             <Box display="flex" gap={2}>
//                                 {[1,2,3,4].map(i => (
//                                     <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
//                                         {[1,2,3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
//                                     </Box>
//                                 ))}
//                             </Box>
//                         ) : (
//                             <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
//                                 {KANBAN_COLS.map(col => (
//                                     <KanbanColumn key={col.key} col={col}
//                                         cards={kanbanCols[col.key] || []}
//                                         onEdit={openEdit}
//                                         onDelete={handleDelete}
//                                         onStatusChange={handleKanbanStatusChange}
//                                     />
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
//                                         {["SN", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Frequency", "Deadline", "Time Window", "Status", "Actions"].map(h => (
//                                             <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading && Array.from({ length: 5 }).map((_, i) => (
//                                         <TableRow key={i}>
//                                             {Array.from({ length: 12 }).map((_, j) => (
//                                                 <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}

//                                     {!loading && filteredRows.length === 0 && (
//                                         <TableRow>
//                                             <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
//                                                 <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                                     <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08),
//                                                         display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                                         <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
//                                                     </Box>
//                                                     <Typography fontWeight={600} fontSize={14} color="text.secondary">
//                                                         {tableSearch || statusFilter !== "All" ? "No tasks match your filters" : "No assignments yet"}
//                                                     </Typography>
//                                                     <Typography fontSize={12.5} color="text.disabled">
//                                                         {tableSearch || statusFilter !== "All" ? "Try adjusting filters" : "Click + Assign Task to get started"}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     )}

//                                     {!loading && filteredRows.map((row, idx) => {
//                                         const pm      = priorityMeta(row.priority);
//                                         const sm      = slotMeta(row.slot);
//                                         const overdue = isOverdue(row.deadline, row.status);
//                                         const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

//                                         return (
//                                             <TableRow key={row.id ?? idx} hover sx={{
//                                                 "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
//                                                 "&:hover":             { bgcolor: alpha(TEAL, 0.025) },
//                                                 bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
//                                                 transition: "background .12s",
//                                             }}>
//                                                 {/* SN */}
//                                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

//                                                 {/* Task */}
//                                                 <TableCell>
//                                                     <Box display="flex" alignItems="center" gap={0.7}>
//                                                         {overdue && (
//                                                             <Tooltip title="Overdue" arrow>
//                                                                 <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} />
//                                                             </Tooltip>
//                                                         )}
//                                                         <Tooltip title={row.task} arrow placement="top">
//                                                             <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 160 }}>
//                                                                 {row.task}
//                                                             </Typography>
//                                                         </Tooltip>
//                                                     </Box>
//                                                     {row.remarks && (
//                                                         <Typography fontSize={11} color="text.disabled" noWrap sx={{ maxWidth: 160, fontStyle: "italic" }}>
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
//                                                                     <Avatar sx={{
//                                                                         width: 26, height: 26, fontSize: 10, fontWeight: 700,
//                                                                         bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK,
//                                                                         border: "2px solid #fff", ml: i > 0 ? -0.8 : 0,
//                                                                     }}>
//                                                                         {(o[0] || "?").toUpperCase()}
//                                                                     </Avatar>
//                                                                 </Tooltip>
//                                                             ))}
//                                                         </Box>
//                                                         <Typography fontSize={12} fontWeight={500} color="#374151" noWrap sx={{ maxWidth: 100 }}>
//                                                             {owners.slice(0, 2).join(", ")}
//                                                             {owners.length > 2 ? ` +${owners.length - 2}` : ""}
//                                                         </Typography>
//                                                     </Box>
//                                                 </TableCell>

//                                                 {/* Assigned By */}
//                                                 <TableCell>
//                                                     <Typography fontSize={12.5} color="#374151" noWrap sx={{ maxWidth: 110 }}>
//                                                         {row.assigned_by || "—"}
//                                                     </Typography>
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

//                                                 {/* Frequency */}
//                                                 <TableCell>
//                                                     {row.frequency
//                                                         ? <Chip label={row.frequency} size="small" sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontWeight: 600, fontSize: 11, border: "1px solid #d1c4e9" }} />
//                                                         : <Typography color="text.disabled" fontSize={12}>—</Typography>
//                                                     }
//                                                 </TableCell>

//                                                 {/* Deadline */}
//                                                 <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                     <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
//                                                         {fmtDate(row.deadline)}
//                                                     </Typography>
//                                                 </TableCell>

//                                                 {/* Time Window */}
//                                                 <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                     {row.startdatetime || row.enddatetime ? (
//                                                         <Box>
//                                                             <Typography fontSize={11.5} color="text.secondary">
//                                                                 {fmtTime(row.startdatetime)} — {fmtTime(row.enddatetime)}
//                                                             </Typography>
//                                                             <Typography fontSize={10.5} color="text.disabled">
//                                                                 {fmtDate(row.startdatetime)}
//                                                             </Typography>
//                                                         </Box>
//                                                     ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                                 </TableCell>

//                                                 {/* Status */}
//                                                 <TableCell>
//                                                     <Chip label={row.status ?? "Pending"} size="small"
//                                                         sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status),
//                                                             fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
//                                                 </TableCell>

//                                                 {/* Actions */}
//                                                 <TableCell>
//                                                     <Box display="flex" gap={0.5}>
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
//                                     Showing <strong>{filteredRows.length}</strong> of <strong>{tasks.length}</strong> tasks
//                                     {stats.overdue > 0 && (
//                                         <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>
//                                             ⚠ {stats.overdue} overdue
//                                         </span>
//                                     )}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.disabled">
//                                     Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove · Kanban for drag-drop
//                                 </Typography>
//                             </Box>
//                         )}
//                     </>
//                 )}
//             </Paper>

//             {/* ════ ANALYTICS DRAWER ════ */}
//             <AnalyticsPanel tasks={tasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

//             {/* ════ DIALOG ════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth disableScrollLock
//                 PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" } }}>

//                 <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

//                 <DialogTitle sx={{ p: 0 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(TEAL, 0.12),
//                                 display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>
//                                     {editId ? "Edit Task Assignment" : "Assign New Task"}
//                                 </Typography>
//                                 <Typography fontSize={12} color="text.secondary">
//                                     {editId ? "Update task details" : "Fill in details to create a task"}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         <Tooltip title="Close" arrow>
//                             <IconButton onClick={() => setDialogOpen(false)}
//                                 sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px",
//                                     transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
//                                 <CloseIcon sx={{ fontSize: 17 }} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* Task Name */}
//                         <TextField label="Task Name" value={form.task}
//                             onChange={(e) => setField("task", e.target.value)}
//                             error={!!errors.task} helperText={errors.task}
//                             size="small" fullWidth sx={fieldSx} placeholder="e.g. SCFT Aging Analysis"
//                             InputProps={{ startAdornment: (<InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

//                         {/* OEM + Slot */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem} onChange={(e) => setField("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot} onChange={(e) => setField("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select Slot —</em></MenuItem>
//                                     {SLOT_OPTIONS.map(s => (
//                                         <MenuItem key={s.value} value={s.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
//                                                 {s.label}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Priority + Frequency */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="Priority" value={form.priority} onChange={(e) => setField("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {PRIORITY_OPTIONS.map(p => (
//                                         <MenuItem key={p.value} value={p.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
//                                                 <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Frequency" value={form.frequency} onChange={(e) => setField("frequency", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><RepeatIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {FREQUENCY_OPTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Owner multi-input */}
//                         <Box ref={ownerSuggestRef} sx={{ position: "relative" }}>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Owner(s)
//                                 <Chip label={`${form.owner.length} added`} size="small"
//                                     sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK }} />
//                             </Typography>
//                             <Paper variant="outlined"
//                                 onClick={() => ownerInputRef.current?.focus()}
//                                 sx={{
//                                     p: "8px 10px", minHeight: 46, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.7,
//                                     borderRadius: "8px", cursor: "text",
//                                     borderColor: errors.owner ? "#c62828" : showOwnerSuggest ? TEAL : "#c4c4c4",
//                                     "&:hover": { borderColor: errors.owner ? "#c62828" : TEAL },
//                                     transition: "border-color .15s",
//                                 }}>
//                                 {form.owner.map(o => (
//                                     <Chip key={o} label={o} size="small" onDelete={() => removeOwner(o)}
//                                         avatar={<Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>{o[0]?.toUpperCase()}</Avatar>}
//                                         sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 12, height: 26,
//                                             "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                                 ))}
//                                 <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 160, gap: 0.5 }}>
//                                     <input ref={ownerInputRef} value={form.ownerInput}
//                                         placeholder={form.owner.length === 0 ? "Search user or type name + Enter…" : "Add more…"}
//                                         onChange={(e) => searchOwners(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (["Enter", "Tab", ","].includes(e.key)) {
//                                                 e.preventDefault();
//                                                 if (ownerSuggestions.length > 0) pickOwner(ownerSuggestions[0]);
//                                                 else commitOwnerInput();
//                                                 setShowOwnerSuggest(false);
//                                             }
//                                             if (e.key === "Escape") setShowOwnerSuggest(false);
//                                             if (e.key === "Backspace" && !form.ownerInput && form.owner.length > 0)
//                                                 removeOwner(form.owner[form.owner.length - 1]);
//                                         }}
//                                         onFocus={() => { if (ownerSuggestions.length > 0) setShowOwnerSuggest(true); }}
//                                         style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", fontFamily: "inherit", color: "inherit" }} />
//                                     {ownerSearching && (
//                                         <Box sx={{ width: 14, height: 14, flexShrink: 0, border: `2px solid ${TEAL}`, borderTopColor: "transparent",
//                                             borderRadius: "50%", animation: "spin .7s linear infinite",
//                                             "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
//                                     )}
//                                 </Box>
//                             </Paper>

//                             {/* suggestions dropdown */}
//                             {showOwnerSuggest && ownerSuggestions.length > 0 && (
//                                 <Paper elevation={6} sx={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1400,
//                                     borderRadius: "10px", overflow: "hidden", border: `1px solid ${TEAL_MID}`,
//                                     maxHeight: 200, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
//                                     <Box sx={{ px: 2, py: 0.8, bgcolor: TEAL_LIGHT, borderBottom: `1px solid ${TEAL_MID}` }}>
//                                         <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
//                                             {ownerSuggestions.length} user{ownerSuggestions.length !== 1 ? "s" : ""} found
//                                         </Typography>
//                                     </Box>
//                                     {ownerSuggestions.map(u => (
//                                         <Box key={u.email ?? u.id}
//                                             onMouseDown={(e) => { e.preventDefault(); pickOwner(u); }}
//                                             sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.2, cursor: "pointer",
//                                                 borderBottom: "1px solid #f5f5f5", transition: "background .12s",
//                                                 "&:hover": { bgcolor: TEAL_LIGHT }, "&:last-child": { borderBottom: "none" } }}>
//                                             <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Avatar>
//                                             <Box flex={1} minWidth={0}>
//                                                 <Typography fontSize={13} fontWeight={600} noWrap>{u.name ?? u.username}</Typography>
//                                                 {u.email && <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>{u.email}</Typography>}
//                                             </Box>
//                                             <Chip label="+ Add" size="small"
//                                                 sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }} />
//                                         </Box>
//                                     ))}
//                                 </Paper>
//                             )}
//                             <Typography fontSize={11} color={errors.owner ? "error.main" : "text.secondary"} mt={0.4} ml={0.5}>
//                                 {errors.owner || "Search users or type name + Enter · Backspace removes last"}
//                             </Typography>
//                         </Box>

//                         {/* Assigned By + Status */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField label="Assigned By" value={form.assigned_by}
//                                     onChange={(e) => setField("assigned_by", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     helperText="Auto-filled from your session"
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {STATUS_OPTIONS.map(s => (
//                                         <MenuItem key={s} value={s}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />
//                                                 {s}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Deadline */}
//                         <TextField label="Deadline" type="date" value={form.deadline}
//                             onChange={(e) => setField("deadline", e.target.value)}
//                             error={!!errors.deadline} helperText={errors.deadline || "Task completion deadline"}
//                             size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                             InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                            

//                         {/* Start + End datetime */}
//                         {/* <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField label="Start Date & Time" type="datetime-local" value={form.startdatetime}
//                                     onChange={(e) => setField("startdatetime", e.target.value)}
//                                     size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField label="End Date & Time" type="datetime-local" value={form.enddatetime}
//                                     onChange={(e) => setField("enddatetime", e.target.value)}
//                                     size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                         </Grid> */}

//                         {/* assigned-at banner */}
//                         <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.2,
//                             bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "8px" }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
//                             </Typography>
//                         </Paper>

//                         {/* Remarks */}
//                         <TextField label="Remarks (optional)" value={form.remarks}
//                             onChange={(e) => setField("remarks", e.target.value)}
//                             placeholder="Add any notes or instructions…"
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />
//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button onClick={() => setDialogOpen(false)}
//                         sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5 }}>
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                             fontWeight: 700, borderRadius: "8px", px: 3, boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                         {saving ? "Saving…" : editId ? "Update Task" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
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
    ListItem, ListItemAvatar, ListItemText,
} from "@mui/material";
import AddIcon                    from "@mui/icons-material/Add";
import DeleteOutlineIcon          from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon           from "@mui/icons-material/EditOutlined";
import CloseIcon                  from "@mui/icons-material/Close";
import RefreshIcon                from "@mui/icons-material/Refresh";
import AssignmentIndOutlinedIcon  from "@mui/icons-material/AssignmentIndOutlined";
import CalendarTodayOutlinedIcon  from "@mui/icons-material/CalendarTodayOutlined";
import TaskAltOutlinedIcon        from "@mui/icons-material/TaskAltOutlined";
import PersonOutlineIcon          from "@mui/icons-material/PersonOutline";
import RouterOutlinedIcon         from "@mui/icons-material/RouterOutlined";
import WbSunnyOutlinedIcon        from "@mui/icons-material/WbSunnyOutlined";
import AccessTimeOutlinedIcon     from "@mui/icons-material/AccessTimeOutlined";
import FlagOutlinedIcon           from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon          from "@mui/icons-material/EventOutlined";
import NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
import GroupAddOutlinedIcon       from "@mui/icons-material/GroupAddOutlined";
import SearchIcon                 from "@mui/icons-material/Search";
import FilterListIcon             from "@mui/icons-material/FilterList";
import HourglassEmptyIcon         from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon      from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon     from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon         from "@mui/icons-material/CancelOutlined";
import ViewKanbanOutlinedIcon     from "@mui/icons-material/ViewKanbanOutlined";
import TableRowsOutlinedIcon      from "@mui/icons-material/TableRowsOutlined";
import BarChartOutlinedIcon       from "@mui/icons-material/BarChartOutlined";
import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
import TrendingUpOutlinedIcon     from "@mui/icons-material/TrendingUpOutlined";
import PersonSearchOutlinedIcon   from "@mui/icons-material/PersonSearchOutlined";
import RepeatIcon                 from "@mui/icons-material/Repeat";
import KeyboardArrowRightIcon     from "@mui/icons-material/KeyboardArrowRight";
import EmailOutlinedIcon          from "@mui/icons-material/EmailOutlined";
import Breadcrumbs                from "@mui/material/Breadcrumbs";
import Link                       from "@mui/material/Link";
import Swal                       from "sweetalert2";
import { postData, getData, deleteData, putData, ServerURL } from "../../../services/FetchNodeServices";
import { useNavigate }            from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";

// ─── theme ───────────────────────────────────────────────────────────────────
const TEAL       = "#228b7f";
const TEAL_DARK  = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID   = "#b2dfdb";

// ─── static options ───────────────────────────────────────────────────────────
const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

const SLOT_OPTIONS = [
    { value: "Morning",   label: "🌤  Morning",   color: "#f57c00" },
    { value: "Afternoon", label: "☀️  Afternoon", color: "#f9a825" },
    { value: "Evening",   label: "🌙  Evening",   color: "#5c6bc0" },
    { value: "Night",     label: "🌌  Night",     color: "#37474f" },
];

const PRIORITY_OPTIONS = [
    { value: "Critical", color: "#c62828", bg: "#fdecea" },
    { value: "High",     color: "#e65100", bg: "#fff3e0" },
    { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
    { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
];

const STATUS_OPTIONS   = ["Pending", "In Progress", "Completed", "Cancelled"];
const STATUS_FILTERS   = ["All", ...STATUS_OPTIONS];
const REMINDER_OPTIONS = ["None", "Daily", "Weekly", "Monthly"];

const KANBAN_COLS = [
    { key: "Pending",     label: "Pending",     color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
    { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Completed",   label: "Done",        color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Cancelled",   label: "Cancelled",   color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
];

const API = {
    CREATE:       "dailytask_review/tasks/create/",
    // GET_ALL:     "dailytask_review/tasks/get/",
    UPDATE:       (pk) => `dailytask_review/tasks/update-task/${pk}/`,
    DELETE:       (pk) => `dailytask_review/tasks/delete-task/${pk}/`,
    GET_TASKS:    "dailytask_review/tasks/get/",
    // GET_TASKS:    "dailytask_review/get-task/",
    GET_USERS:    "dailytask_review/users/",
    SEARCH_USERS: (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
    SEARCH_TASKS: (q)  => `dailytask_review/tasks/?search=${encodeURIComponent(q)}`,
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const nowISO   = () => new Date().toISOString();
const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};
const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime  = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
const isOverdue = (iso, status) =>
    iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

const statusColor = (s) =>
    ({ Pending: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());

const getLoggedInUser = () => {
    try {
        const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
        const obj = JSON.parse(raw);
        return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
    } catch { return { name: "", email: "" }; }
};

const EMPTY_FORM = {
    task:              null,   // selected task object { id, task, ... } or null
    taskInput:         "",
    assignee:          "",
    recipients:        [],     // array of { name, email } objects
    recipientInput:    "",
    oem:               "",
    slot:              "",
    priority:          "Medium",
    status:            "Pending",
    deadline:          "",
    reminderFrequency: "None",
    remarks:           "",
};

// ─── fieldSx ─────────────────────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&:hover fieldset":       { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
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
        const byStatus   = { Pending: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const byOEM      = {};
        const bySlot     = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;

        tasks.forEach(t => {
            if (byStatus[t.status]     !== undefined) byStatus[t.status]++;
            if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
            if (t.oem)  byOEM[t.oem]   = (byOEM[t.oem]   || 0) + 1;
            if (t.slot) bySlot[t.slot] = (bySlot[t.slot]  || 0) + 1;
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
                        <Typography fontSize={12} color="text.secondary">Live task stats</Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose}
                        sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                        <CloseIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>
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
                    <ProgressRow label="Pending"     value={stats.byStatus["Pending"]}     max={stats.total} color="#f57c00" />
                    <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
                    <ProgressRow label="Completed"   value={stats.byStatus["Completed"]}   max={stats.total} color="#1565c0" />
                    <ProgressRow label="Cancelled"   value={stats.byStatus["Cancelled"]}   max={stats.total} color="#c62828" />
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
                                <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
                                    bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
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
            </Box>
        </Drawer>
    );
};

// ─── Kanban Card ──────────────────────────────────────────────────────────────
const KanbanCard = ({ row, onEdit, onDelete, onStatusChange }) => {
    const pm      = priorityMeta(row.priority);
    const sm      = slotMeta(row.slot);
    const overdue = isOverdue(row.deadline, row.status);
    const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

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
                <Chip label={row.priority || "—"} size="small"
                    sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                <Box display="flex" gap={0.5}>
                    {overdue && <Tooltip title="Overdue!" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} /></Tooltip>}
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
                {sm       && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={0.6}>
                    {owners.length > 0 ? (
                        <>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                                {owners[0][0].toUpperCase()}
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
const KanbanColumn = ({ col, cards, onEdit, onDelete, onStatusChange }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const cardId     = e.dataTransfer.getData("cardId");
        const fromStatus = e.dataTransfer.getData("fromStatus");
        if (fromStatus !== col.key) onStatusChange(cardId, col.key);
    };

    return (
        <Box sx={{
            flex: 1, minWidth: 220, maxWidth: 280,
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
                <KanbanCard key={row.id} row={row} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
        </Box>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// ASSIGN TASK DIALOG
// ═════════════════════════════════════════════════════════════════════════════
const AssignTaskDialog = ({ open, onClose, editId, initialForm, onSaved, allTaskOptions }) => {
    const [form,   setForm]   = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const userName = getDecreyptedData("userID")

    // task search
    const [taskOptions,    setTaskOptions]    = useState([]);
    const [taskLoading,    setTaskLoading]    = useState(false);
    const taskSearchTimer = useRef(null);

    // recipient search
    const [recipientOptions,  setRecipientOptions]  = useState([]);
    const [recipientLoading,  setRecipientLoading]  = useState(false);
    const [recipientInputVal, setRecipientInputVal] = useState("");
    const recipientSearchTimer = useRef(null);

    // populate form when opening
    useEffect(() => {
        if (open) {
            if (initialForm) {
                setForm(initialForm);
            } else {
                const me = getLoggedInUser();
                setForm({
                    ...EMPTY_FORM,
                    assignee:  me.name,
                    deadline:  nowLocal(),
                });
            }
            setErrors({});
            setRecipientInputVal("");
            setTaskOptions(allTaskOptions || []);
        }
    }, [open, initialForm, allTaskOptions]);

    const setField = (field, value) => {
        setForm(p => ({ ...p, [field]: value }));
        setErrors(e => ({ ...e, [field]: "" }));
    };

    // ── task search ───────────────────────────────────────────────────────────
    const searchTasks = (query) => {
        setField("taskInput", query);
        clearTimeout(taskSearchTimer.current);
        if (!query.trim()) { setTaskOptions(allTaskOptions || []); return; }
        taskSearchTimer.current = setTimeout(async () => {
            setTaskLoading(true);
            try {
                const res  = await getData(API.SEARCH_TASKS(query));
                const list = Array.isArray(res) ? res : res?.data ?? [];
                setTaskOptions(list);
            } catch { setTaskOptions([]); }
            finally { setTaskLoading(false); }
        }, 350);
    };

    // ── recipient search ──────────────────────────────────────────────────────
    const searchRecipients = (query) => {
        setRecipientInputVal(query);
        clearTimeout(recipientSearchTimer.current);
        if (!query.trim()) { setRecipientOptions([]); return; }
        recipientSearchTimer.current = setTimeout(async () => {
            setRecipientLoading(true);
            try {
                const res  = await getData(API.SEARCH_USERS(query));
                const list = Array.isArray(res) ? res : res?.data ?? [];
                // filter already-added
                const addedEmails = form.recipients.map(r => r.email);
                setRecipientOptions(list.filter(u => !addedEmails.includes(u.email ?? u.emailaddress)));
            } catch { setRecipientOptions([]); }
            finally { setRecipientLoading(false); }
        }, 350);
    };

    const addRecipient = (user) => {
        if (!user) return;
        const email = user.email ?? user.emailaddress ?? "";
        const name  = user.name  ?? user.username     ?? email;
        if (!email) return;
        const alreadyAdded = form.recipients.some(r => r.email === email);
        if (alreadyAdded) return;
        setForm(p => ({ ...p, recipients: [...p.recipients, { name, email }] }));
        setErrors(e => ({ ...e, recipients: "" }));
        setRecipientInputVal("");
        setRecipientOptions([]);
    };

    const removeRecipient = (email) => {
        setForm(p => ({ ...p, recipients: p.recipients.filter(r => r.email !== email) }));
    };

    // ── validate ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.task)               e.task       = "Please select a task";
        if (form.recipients.length === 0) e.recipients = "Add at least one recipient";
        if (!form.deadline)           e.deadline   = "Deadline is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const taskName = typeof form.task === "object" ? form.task?.task ?? "" : form.task;
            const payload = {
                task:               taskName,
                task_id:            typeof form.task === "object" ? form.task?.id : undefined,
                assignee:           form.assignee,
                owner:              form.recipients.map(r => r.name),
                recipient_emails:   form.recipients.map(r => r.email),
                oem:                form.oem,
                slot:               form.slot,
                priority:           form.priority,
                status:             form.status,
                deadline:           form.deadline ? new Date(form.deadline).toISOString() : null,
                reminder_frequency: form.reminderFrequency,
                remarks:            form.remarks,
                assigned_at:        nowISO(),
            };

            if (editId) {
                await postData(API.UPDATE(editId), payload);
            } else {
                await postData(API.CREATE, payload);
            }

            onClose();
            onSaved();
            Swal.fire({
                icon: "success",
                title: editId ? "Task Updated!" : "Task Assigned!",
                html: `<b>${taskName}</b> assigned to <b>${form.recipients.map(r => r.name).join(", ")}</b>`,
                timer: 2800, showConfirmButton: false, timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave:", err);
            Swal.fire("Error", "Failed to save task.", "error");
        } finally { setSaving(false); }
    };

    const fmtAssignedAt = () => {
        const now = new Date();
        return `${now.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            disableScrollLock
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
                    maxHeight: "92vh",
                }
            }}
        >
            {/* gradient bar */}
            <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

            {/* ── title ── */}
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{
                            width: 40, height: 40, borderRadius: "11px",
                            bgcolor: alpha(TEAL, 0.1),
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
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
                        <IconButton
                            onClick={onClose}
                            sx={{
                                width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280",
                                borderRadius: "8px", transition: "all .18s",
                                "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>

            <Divider />

            {/* ── body ── */}
            <DialogContent sx={{ px: 3, pt: 2.5, pb: 1.5, overflowY: "auto" }}>
                <Box display="flex" flexDirection="column" gap={2.2}>

                    {/* ── Select Task (searchable from backend) ── */}
                    <Autocomplete
                        options={taskOptions}
                        getOptionLabel={(opt) => (typeof opt === "object" ? opt.task ?? "" : opt)}
                        value={form.task}
                        onChange={(_, val) => setField("task", val)}
                        onInputChange={(_, val, reason) => {
                            if (reason === "input") searchTasks(val);
                        }}
                        loading={taskLoading}
                        isOptionEqualToValue={(opt, val) => opt?.id === val?.id || opt === val}
                        filterOptions={(x) => x}   // disable client-side filtering, use backend
                        noOptionsText={
                            form.taskInput?.trim()
                                ? "No tasks found"
                                : "Type to search tasks…"
                        }
                        renderOption={(props, opt) => (
                            <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: "8px",
                                        bgcolor: alpha(TEAL, 0.1),
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <TaskAltOutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
                                    </Box>
                                    <Box>
                                        <Typography fontSize={13} fontWeight={600} color="#1a1a2e">{opt.task}</Typography>
                                        {opt.oem && (
                                            <Typography fontSize={11} color="text.secondary">{opt.oem} · {opt.slot ?? ""}</Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Task"
                                size="small"
                                placeholder="Search task name…"
                                error={!!errors.task}
                                helperText={errors.task}
                                sx={fieldSx}
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
                                }}
                            />
                        )}
                    />

                    {/* ── Assignee ── */}
                    <TextField
                        label="Assignee"
                        // value={form.assignee}
                        value={userName}
                        onChange={(e) => setField("assignee", e.target.value)}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                        helperText="Auto-filled from your login session"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* ── Recipients (emails) — searchable ── */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Recipients (emails)
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

                        {/* chips row */}
                        {form.recipients.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
                                {form.recipients.map((r) => (
                                    <Chip
                                        key={r.email}
                                        label={r.name !== r.email ? `${r.name} <${r.email}>` : r.email}
                                        size="small"
                                        onDelete={() => removeRecipient(r.email)}
                                        avatar={
                                            <Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>
                                                {(r.name[0] || "?").toUpperCase()}
                                            </Avatar>
                                        }
                                        sx={{
                                            bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, height: 26,
                                            "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL },
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* autocomplete search */}
                        <Autocomplete
                            options={recipientOptions}
                            getOptionLabel={(opt) =>
                                typeof opt === "object"
                                    ? `${opt.name ?? opt.username ?? ""} ${opt.email ?? opt.emailaddress ?? ""}`
                                    : opt
                            }
                            inputValue={recipientInputVal}
                            onInputChange={(_, val, reason) => {
                                if (reason === "input") searchRecipients(val);
                            }}
                            value={null}
                            onChange={(_, val) => { if (val) addRecipient(val); }}
                            loading={recipientLoading}
                            filterOptions={(x) => x}   // backend search
                            noOptionsText={
                                recipientInputVal.trim()
                                    ? "No users found"
                                    : "Search by name or email…"
                            }
                            clearOnBlur={false}
                            blurOnSelect
                            renderOption={(props, opt) => (
                                <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: alpha(TEAL, 0.15), color: TEAL_DARK, flexShrink: 0 }}>
                                            {((opt.name ?? opt.username ?? "?")[0]).toUpperCase()}
                                        </Avatar>
                                        <Box flex={1} minWidth={0}>
                                            <Typography fontSize={13} fontWeight={600} noWrap>
                                                {opt.name ?? opt.username}
                                            </Typography>
                                            <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>
                                                {opt.email ?? opt.emailaddress}
                                            </Typography>
                                        </Box>
                                        <Chip label="+ Add" size="small"
                                            sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }} />
                                    </Box>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Search name or type email…"
                                    error={!!errors.recipients}
                                    helperText={errors.recipients || "Search by name · or type email + Enter · Backspace removes last"}
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
                                                {recipientLoading ? <CircularProgress color="inherit" size={14} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                        onKeyDown: (e) => {
                                            // allow typing raw email and pressing Enter
                                            if (e.key === "Enter") {
                                                const val = recipientInputVal.trim();
                                                if (val && val.includes("@")) {
                                                    addRecipient({ name: val, email: val });
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }
                                            }
                                            if (e.key === "Backspace" && !recipientInputVal && form.recipients.length > 0) {
                                                removeRecipient(form.recipients[form.recipients.length - 1].email);
                                            }
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>

                    {/* ── OEM + Slot ── */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                select label="OEM" value={form.oem}
                                onChange={(e) => setField("oem", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value=""><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
                                {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select label="Slot" value={form.slot}
                                onChange={(e) => setField("slot", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value=""><em style={{ color: "#aaa" }}>— Select Slot —</em></MenuItem>
                                {SLOT_OPTIONS.map(s => (
                                    <MenuItem key={s.value} value={s.value}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
                                            {s.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Priority + Status ── */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                select label="Priority" value={form.priority}
                                onChange={(e) => setField("priority", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FlagOutlinedIcon sx={{ fontSize: 18, color: priorityMeta(form.priority).color }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
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
                            <TextField
                                select label="Status" value={form.status}
                                onChange={(e) => setField("status", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(form.status), ml: 0.5, flexShrink: 0 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <MenuItem key={s} value={s}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />
                                            {s}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Deadline ── */}
                    <TextField
                        label="Deadline"
                        type="datetime-local"
                        value={form.deadline}
                        onChange={(e) => setField("deadline", e.target.value)}
                        error={!!errors.deadline}
                        helperText={errors.deadline || "Select date and time to complete the task"}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* ── Reminder Frequency ── */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Reminder Frequency
                            <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>
                                (sends to all recipients)
                            </Typography>
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {REMINDER_OPTIONS.map((opt) => {
                                const isActive = form.reminderFrequency === opt;
                                const reminderIcons = {
                                    None:    "🔕",
                                    Daily:   "📅",
                                    Weekly:  "🗓️",
                                    Monthly: "📆",
                                };
                                return (
                                    <Box
                                        key={opt}
                                        onClick={() => setField("reminderFrequency", opt)}
                                        sx={{
                                            display: "flex", alignItems: "center", gap: 0.7,
                                            px: 2, py: 0.9,
                                            borderRadius: "10px",
                                            border: `1.5px solid ${isActive ? TEAL : "#e0e0e0"}`,
                                            bgcolor: isActive ? alpha(TEAL, 0.08) : "#fff",
                                            color: isActive ? TEAL_DARK : "#555",
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: 13,
                                            cursor: "pointer",
                                            transition: "all .15s",
                                            userSelect: "none",
                                            "&:hover": {
                                                borderColor: TEAL,
                                                bgcolor: alpha(TEAL, 0.05),
                                            },
                                        }}
                                    >
                                        <span style={{ fontSize: 15 }}>{reminderIcons[opt]}</span>
                                        <span>{opt}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ── Assigned at banner ── */}
                    <Paper variant="outlined" sx={{
                        display: "flex", alignItems: "center", gap: 1.2,
                        px: 2, py: 1.3,
                        bgcolor: TEAL_LIGHT,
                        border: `1px solid ${TEAL_MID}`,
                        borderRadius: "10px",
                    }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK, flexShrink: 0 }} />
                        <Typography fontSize={13} color={TEAL_DARK}>
                            <strong>Assigned at:</strong> {fmtAssignedAt()}
                        </Typography>
                    </Paper>

                    {/* ── Remarks ── */}
                    <TextField
                        label="Remarks (optional)"
                        value={form.remarks}
                        onChange={(e) => setField("remarks", e.target.value)}
                        placeholder="Add any notes or instructions…"
                        size="small" fullWidth multiline rows={2}
                        sx={fieldSx}
                    />
                </Box>
            </DialogContent>

            {/* ── actions ── */}
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        textTransform: "none", color: "text.secondary",
                        border: "1px solid #e0e0e0", borderRadius: "10px", px: 2.5, fontWeight: 600,
                        "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <span>⚡</span>}
                    sx={{
                        bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK },
                        textTransform: "none", fontWeight: 700,
                        borderRadius: "10px", px: 3,
                        boxShadow: `0 2px 10px ${alpha(TEAL, 0.4)}`,
                        fontSize: 14,
                    }}
                >
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

    const [tasks,      setTasks]      = useState([]);
    const [users,      setUsers]      = useState([]);
    const [loading,    setLoading]    = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId,     setEditId]     = useState(null);
    const [editForm,   setEditForm]   = useState(null);

    const [tableSearch,    setTableSearch]    = useState("");
    const [statusFilter,   setStatusFilter]   = useState("All");
    const [activeStatCard, setActiveStatCard] = useState("All");
    const [viewMode,       setViewMode]       = useState("table");
    const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
    const [myTasksOnly,    setMyTasksOnly]    = useState(false);

    const loggedInUser = useMemo(() => getLoggedInUser(), []);

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const [taskRes, userRes] = await Promise.allSettled([
                getData(API.GET_TASKS),
                getData(API.GET_USERS),
            ]);
            const safe = (r) => r.status === "fulfilled"
                ? (Array.isArray(r.value) ? r.value : r.value?.data ?? [])
                : [];
            setTasks(safe(taskRes));
            setUsers(safe(userRes));
        } catch (err) { console.error("fetchAll:", err); }
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── stats ──────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total:      tasks.length,
        pending:    tasks.filter(t => t.status === "Pending").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        completed:  tasks.filter(t => t.status === "Completed").length,
        cancelled:  tasks.filter(t => t.status === "Cancelled").length,
        overdue:    tasks.filter(t => isOverdue(t.deadline, t.status)).length,
    }), [tasks]);

    // ── filtered rows ──────────────────────────────────────────────────────────
    const filteredRows = useMemo(() => {
        const q = tableSearch.toLowerCase();
        return tasks.filter((row) => {
            const taskName   = (row.task ?? "").toLowerCase();
            const oem        = (row.oem  ?? "").toLowerCase();
            const ownerStr   = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
            const assignedBy = (row.assigned_by ?? row.assignee ?? "").toLowerCase();
            const matchQ     = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q);
            const matchS     = activeStatCard === "All" ? true : row.status === activeStatCard;
            const matchD     = statusFilter   === "All" ? true : row.status === statusFilter;
            const matchMe    = !myTasksOnly   || ownerStr.includes(loggedInUser.name.toLowerCase());
            return matchQ && matchS && matchD && matchMe;
        });
    }, [tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

    const kanbanCols = useMemo(() => {
        const grouped = {};
        KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
        filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
        return grouped;
    }, [filteredRows]);

    const handleStatClick = (label) => {
        setActiveStatCard(label);
        setStatusFilter(label);
        setTableSearch("");
    };

    // ── kanban drag-drop ───────────────────────────────────────────────────────
    const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
        const row = tasks.find(t => String(t.id) === String(cardId));
        if (!row) return;
        setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
        try {
            await postData(API.UPDATE(cardId), { ...row, status: newStatus });
        } catch (e) {
            console.error("Status update failed:", e);
            setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
        }
    }, [tasks]);

    // ── dialog helpers ─────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditId(null);
        setEditForm(null);
        setDialogOpen(true);
    };

    const openEdit = (row) => {
        setEditId(row.id);
        const recipients = Array.isArray(row.recipient_emails)
            ? row.recipient_emails.map((email, i) => ({
                email,
                name: Array.isArray(row.owner) ? (row.owner[i] ?? email) : email,
            }))
            : (Array.isArray(row.owner) ? row.owner.map(n => ({ name: n, email: n })) : []);

        setEditForm({
            task:              row.task ? { id: row.id, task: row.task } : null,
            taskInput:         row.task ?? "",
            assignee:          row.assigned_by ?? row.assignee ?? "",
            recipients,
            recipientInput:    "",
            oem:               row.oem      ?? "",
            slot:              row.slot     ?? "",
            priority:          row.priority ?? "Medium",
            status:            row.status   ?? "Pending",
            deadline:          row.deadline ? new Date(row.deadline).toISOString().slice(0, 16) : "",
            reminderFrequency: row.reminder_frequency ?? row.reminderFrequency ?? "None",
            remarks:           row.remarks  ?? "",
        });
        setDialogOpen(true);
    };

    // ── delete ─────────────────────────────────────────────────────────────────
    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete Task?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
            icon: "warning", showCancelButton: true,
            confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
        }).then(async (res) => {
            if (!res.isConfirmed) return;
            try {
                await deleteData(API.DELETE(row.id));
                await fetchAll();
            } catch { Swal.fire("Error", "Failed to delete task.", "error"); }
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

            {/* breadcrumb */}
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
                </Breadcrumbs>
            </Box>

            {/* ════ main card ════ */}
            <Paper elevation={0} sx={{
                borderRadius: "20px", overflow: "hidden",
                border: "1px solid #e8ecf0", bgcolor: "#fff",
                boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
            }}>

                {/* ── header ── */}
                <Box sx={{
                    px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5",
                    background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
                }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Box>
                            <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Assign Task</Typography>
                            <Typography fontSize={13} color="text.secondary" mt={0.3}>
                                Manage daily task assignments · drag kanban cards to update status
                            </Typography>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            {/* my tasks */}
                            <Chip
                                icon={<PersonOutlineIcon sx={{ fontSize: "14px !important" }} />}
                                label="My Tasks"
                                onClick={() => setMyTasksOnly(p => !p)}
                                variant={myTasksOnly ? "filled" : "outlined"}
                                sx={{
                                    fontWeight: 600, fontSize: 12, cursor: "pointer",
                                    bgcolor: myTasksOnly ? alpha(TEAL, 0.12) : "transparent",
                                    color: myTasksOnly ? TEAL_DARK : "text.secondary",
                                    borderColor: myTasksOnly ? TEAL : "#d0d5dd",
                                    "& .MuiChip-icon": { color: myTasksOnly ? TEAL : "inherit" },
                                }}
                            />

                            {/* analytics */}
                            <Button
                                variant="outlined"
                                startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                                onClick={() => setAnalyticsOpen(true)}
                                sx={{
                                    textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
                                    borderColor: "#d0d5dd", color: "#374151",
                                    "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) },
                                }}
                            >
                                Analytics
                            </Button>

                            {/* view toggle */}
                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                                sx={{
                                    bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3,
                                    "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 },
                                }}>
                                <ToggleButton value="table">
                                    <Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
                                </ToggleButton>
                                <ToggleButton value="kanban">
                                    <Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
                                </ToggleButton>
                            </ToggleButtonGroup>

                            {/* refresh */}
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon sx={{
                                    fontSize: "17px !important",
                                    animation: refreshing ? "spin .8s linear infinite" : "none",
                                    "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                                }} />}
                                onClick={() => fetchAll(true)}
                                disabled={refreshing}
                                sx={{
                                    textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
                                    borderColor: TEAL_MID, color: TEAL,
                                    "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
                                }}
                            >
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </Button>

                            {/* assign */}
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={openCreate}
                                sx={{
                                    bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK },
                                    textTransform: "none", fontWeight: 700, borderRadius: "10px",
                                    px: 2.5, fontSize: 13.5,
                                    boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}`,
                                }}
                            >
                                Assign Task
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* ── stat cards ── */}
                <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <StatCard label="Total"       count={stats.total}      icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} active={activeStatCard === "All"}         loading={loading} onClick={() => handleStatClick("All")} />
                        <StatCard label="Pending"     count={stats.pending}    icon={<HourglassEmptyIcon />}       color="#f57c00" bg="#fff3e0"     active={activeStatCard === "Pending"}     loading={loading} onClick={() => handleStatClick("Pending")} />
                        <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />}   color="#2e7d32" bg="#e8f5e9"     active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
                        <StatCard label="Completed"   count={stats.completed}  icon={<CheckCircleOutlineIcon />}  color="#1565c0" bg="#e3f2fd"     active={activeStatCard === "Completed"}   loading={loading} onClick={() => handleStatClick("Completed")} />
                        <StatCard label="Cancelled"   count={stats.cancelled}  icon={<CancelOutlinedIcon />}      color="#c62828" bg="#fdecea"     active={activeStatCard === "Cancelled"}   loading={loading} onClick={() => handleStatClick("Cancelled")} />
                        {stats.overdue > 0 && (
                            <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => {}} />
                        )}
                    </Box>
                </Box>

                {/* ── search + filter ── */}
                <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField
                        size="small"
                        placeholder="Search task, owner, OEM or assigned by…"
                        value={tableSearch}
                        onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
                        sx={{
                            flex: 1, minWidth: 240,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
                                "&:hover fieldset": { borderColor: TEAL },
                                "&.Mui-focused fieldset": { borderColor: TEAL },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        select size="small" value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
                        sx={{
                            minWidth: 180,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
                                "&:hover fieldset": { borderColor: TEAL },
                                "&.Mui-focused fieldset": { borderColor: TEAL },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {STATUS_FILTERS.map(s => (
                            <MenuItem key={s} value={s}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}
                                    {s}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    {(tableSearch || statusFilter !== "All" || myTasksOnly) && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={12} color="text.secondary">
                                {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
                            </Typography>
                            <Chip
                                label="Clear" size="small"
                                onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
                                sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }}
                            />
                        </Box>
                    )}
                </Box>

                {/* ════ KANBAN ════ */}
                {viewMode === "kanban" && (
                    <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
                        {loading ? (
                            <Box display="flex" gap={2}>
                                {[1,2,3,4].map(i => (
                                    <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
                                        {[1,2,3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
                                {KANBAN_COLS.map(col => (
                                    <KanbanColumn
                                        key={col.key} col={col}
                                        cards={kanbanCols[col.key] || []}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                        onStatusChange={handleKanbanStatusChange}
                                    />
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
                                        {["SN", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Reminder", "Deadline", "Status", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 11 }).map((_, j) => (
                                                <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                    {!loading && filteredRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                                                    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08),
                                                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
                                                    </Box>
                                                    <Typography fontWeight={600} fontSize={14} color="text.secondary">
                                                        {tableSearch || statusFilter !== "All" ? "No tasks match your filters" : "No assignments yet"}
                                                    </Typography>
                                                    <Typography fontSize={12.5} color="text.disabled">
                                                        {tableSearch || statusFilter !== "All" ? "Try adjusting filters" : "Click + Assign Task to get started"}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading && filteredRows.map((row, idx) => {
                                        const pm      = priorityMeta(row.priority);
                                        const sm      = slotMeta(row.slot);
                                        const overdue = isOverdue(row.deadline, row.status);
                                        const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

                                        return (
                                            <TableRow key={row.id ?? idx} hover sx={{
                                                "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                                                "&:hover":             { bgcolor: alpha(TEAL, 0.025) },
                                                bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
                                                transition: "background .12s",
                                            }}>
                                                <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.7}>
                                                        {overdue && (
                                                            <Tooltip title="Overdue" arrow>
                                                                <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} />
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title={row.task} arrow placement="top">
                                                            <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 160 }}>
                                                                {row.task}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Box>
                                                    {row.remarks && (
                                                        <Typography fontSize={11} color="text.disabled" noWrap sx={{ maxWidth: 160, fontStyle: "italic" }}>
                                                            {row.remarks}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.6}>
                                                        <Box display="flex">
                                                            {owners.slice(0, 3).map((o, i) => (
                                                                <Tooltip key={i} title={o} arrow>
                                                                    <Avatar sx={{
                                                                        width: 26, height: 26, fontSize: 10, fontWeight: 700,
                                                                        bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK,
                                                                        border: "2px solid #fff", ml: i > 0 ? -0.8 : 0,
                                                                    }}>
                                                                        {(o[0] || "?").toUpperCase()}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            ))}
                                                        </Box>
                                                        <Typography fontSize={12} fontWeight={500} color="#374151" noWrap sx={{ maxWidth: 100 }}>
                                                            {owners.slice(0, 2).join(", ")}
                                                            {owners.length > 2 ? ` +${owners.length - 2}` : ""}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography fontSize={12.5} color="#374151" noWrap sx={{ maxWidth: 110 }}>
                                                        {row.assigned_by ?? row.assignee ?? "—"}
                                                    </Typography>
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
                                                    {(row.reminder_frequency && row.reminder_frequency !== "None") ? (
                                                        <Chip
                                                            icon={<NotificationsOutlinedIcon sx={{ fontSize: "12px !important" }} />}
                                                            label={row.reminder_frequency} size="small"
                                                            sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11, border: `1px solid ${TEAL_MID}` }}
                                                        />
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
                                                    <Chip label={row.status ?? "Pending"} size="small"
                                                        sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status),
                                                            fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" gap={0.5}>
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
                                    Showing <strong>{filteredRows.length}</strong> of <strong>{tasks.length}</strong> tasks
                                    {stats.overdue > 0 && (
                                        <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>
                                            ⚠ {stats.overdue} overdue
                                        </span>
                                    )}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* ════ ANALYTICS DRAWER ════ */}
            <AnalyticsPanel tasks={tasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

            {/* ════ ASSIGN TASK DIALOG ════ */}
            <AssignTaskDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                editId={editId}
                initialForm={editForm}
                onSaved={fetchAll}
                allTaskOptions={tasks}
            />
        </Box>
    );
};

export default AssignTask;

// import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar, Badge, LinearProgress,
//     ToggleButton, ToggleButtonGroup, Drawer, Tabs, Tab,
// } from "@mui/material";
// import AddIcon                    from "@mui/icons-material/Add";
// import DeleteOutlineIcon          from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon           from "@mui/icons-material/EditOutlined";
// import CloseIcon                  from "@mui/icons-material/Close";
// import RefreshIcon                from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon  from "@mui/icons-material/AssignmentIndOutlined";
// import CalendarTodayOutlinedIcon  from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon        from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon          from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon         from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon        from "@mui/icons-material/WbSunnyOutlined";
// import AccessTimeOutlinedIcon     from "@mui/icons-material/AccessTimeOutlined";
// import FlagOutlinedIcon           from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon          from "@mui/icons-material/EventOutlined";
// import NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
// import GroupAddOutlinedIcon       from "@mui/icons-material/GroupAddOutlined";
// import SearchIcon                 from "@mui/icons-material/Search";
// import FilterListIcon             from "@mui/icons-material/FilterList";
// import HourglassEmptyIcon         from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon      from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon     from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon         from "@mui/icons-material/CancelOutlined";
// import ViewKanbanOutlinedIcon     from "@mui/icons-material/ViewKanbanOutlined";
// import TableRowsOutlinedIcon      from "@mui/icons-material/TableRowsOutlined";
// import BarChartOutlinedIcon       from "@mui/icons-material/BarChartOutlined";
// import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
// import TrendingUpOutlinedIcon     from "@mui/icons-material/TrendingUpOutlined";
// import PersonSearchOutlinedIcon   from "@mui/icons-material/PersonSearchOutlined";
// import DashboardOutlinedIcon      from "@mui/icons-material/DashboardOutlined";
// import Breadcrumbs                from "@mui/material/Breadcrumbs";
// import Link                       from "@mui/material/Link";
// import KeyboardArrowRightIcon     from "@mui/icons-material/KeyboardArrowRight";
// import Swal                       from "sweetalert2";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate }            from "react-router-dom";

// // ─── theme ────────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// // ─── static lists ─────────────────────────────────────────────────────────────
// const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

// const SLOT_OPTIONS = [
//     { value: "morning",   label: "🌤  Morning",   color: "#f57c00" },
//     { value: "afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "evening",   label: "🌙  Evening",   color: "#5c6bc0" },
//     { value: "night",     label: "🌌  Night",     color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High",     color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
// ];

// const REMINDER_OPTIONS = [
//     { value: "none",    label: "None",    icon: "🔕" },
//     { value: "daily",   label: "Daily",   icon: "📅" },
//     { value: "weekly",  label: "Weekly",  icon: "📆" },
//     { value: "monthly", label: "Monthly", icon: "🗓" },
// ];

// const STATUS_FILTERS = ["All", "Pending", "Active", "Completed", "Cancelled"];

// const KANBAN_COLS = [
//     { key: "Pending",   label: "Pending",     color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
//     { key: "Active",    label: "In Progress",  color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Completed", label: "Done",         color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Cancelled", label: "Cancelled",    color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
// ];

// // ─── API paths ────────────────────────────────────────────────────────────────
// const API = {


    
// // const API = {
// //     CREATE:          "dailytask_review/tasks/create/",
// //     GET_ALL:         "dailytask_review/tasks/",
// //     UPDATE:          (pk) => `dailytask_review/tasks/update/${pk}/`,
// //     DELETE:          (pk) => `dailytask_review/tasks/delete/${pk}/`,
// //     GET_TASKS:       "dailytask_review/tasks/get/",
// //     GET_USERS:       "dailytask_review/users/",
// //     // UPDATE_REMINDER: (pk) => `dailytask_review/assign/reminder/${pk}/`,
// //     SEARCH_USERS:    (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
// // };
//     // Assignments (assign task)
//     ASSIGN_CREATE:          "dailytask_review/tasks/create/",
//     ASSIGN_GET_ALL:         "dailytask_review/tasks/",
//     ASSIGN_UPDATE:          (pk) => `dailytask_review/tasks/update/${pk}/`,
//     ASSIGN_DELETE:          (pk) => `dailytask_review/tasks/delete/${pk}/`,
//     ASSIGN_UPDATE_REMINDER: (pk) => `dailytask_review/tasks/reminder/${pk}/`,

//     // Tasks (manage tasks)
//     TASK_CREATE: "dailytask_review/tasks/create/",
//     TASK_GET_ALL:"dailytask_review/tasks/get/",
//     TASK_UPDATE: (pk) => `dailytask_review/tasks/update-task/${pk}/`,
//     TASK_DELETE: (pk) => `dailytask_review/tasks/delete-task/${pk}/`,

//     // Users
//     // GET_USERS:   "dailytask_review/users/",
//     SEARCH_USERS:(q) => `dailytask_review/users/?search=${encodeURIComponent(q)}`,

//     // Email (stub – wire up later)
//     // SEND_EMAIL:  "dailytask_review/send-email/",
// };

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const nowISO   = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const fmtTime  = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
// const isOverdue = (iso, status) => iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

// const statusColor  = (s) => ({ Pending: "#f57c00", Active: "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
// const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value === v);
// const reminderMeta = (v) => REMINDER_OPTIONS.find((o) => o.value === v) ?? REMINDER_OPTIONS[0];

// const getLoggedInUser = () => {
//     try {
//         const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
//         const obj = JSON.parse(raw);
//         return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
//     } catch { return { name: "", email: "" }; }
// };

// const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// // ─── stub email sender (wire to API.SEND_EMAIL later) ─────────────────────────
// const sendEmailNotification = async ({ to, subject, body, taskName, assignee, deadline, reminder }) => {
//     // Stub: replace postData call below once backend email endpoint is ready
//     try {
//         await postData(API.SEND_EMAIL, { to, subject, body, taskName, assignee, deadline, reminder });
//     } catch (e) {
//         // Silently fail – email is non-critical
//         console.warn("Email notification skipped (endpoint not ready):", e?.message);
//     }
// };

// const EMPTY_ASSIGN_FORM = {
//     task_id: "", assignee: "", emails: [], emailInput: "",
//     oem: "", slot: "", priority: "Medium", deadline: "",
//     reminder: "none", remark: "", status: "Pending",
// };

// const EMPTY_TASK_FORM = { task: "", description: "", category: "" };

// // ─── StatCard ─────────────────────────────────────────────────────────────────
// const StatCard = ({ label, count, icon, color, bg, active, onClick, loading, trend }) => (
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
//                 {trend && !loading && (
//                     <Typography fontSize={10.5} color={trend > 0 ? "#2e7d32" : "#c62828"} mt={0.3} fontWeight={600}>
//                         {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% this week
//                     </Typography>
//                 )}
//             </Box>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
//                 <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: active ? alpha(color, 0.15) : bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
//                 </Box>
//             </Box>
//         </Box>
//         {active && <Box sx={{ mt: 1.2, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />}
//     </Paper>
// );

// // ─── AnalyticsPanel ───────────────────────────────────────────────────────────
// const AnalyticsPanel = ({ assignments, tasks, open, onClose }) => {
//     const stats = useMemo(() => {
//         const total = assignments.length;
//         const byStatus = { Pending: 0, Active: 0, Completed: 0, Cancelled: 0 };
//         const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//         const byOEM = {};
//         const bySlot = { morning: 0, afternoon: 0, evening: 0, night: 0 };
//         const overdueCount = assignments.filter(a => isOverdue(a.deadline, a.status)).length;

//         assignments.forEach(a => {
//             if (byStatus[a.status] !== undefined) byStatus[a.status]++;
//             if (byPriority[a.priority] !== undefined) byPriority[a.priority]++;
//             if (a.oem) byOEM[a.oem] = (byOEM[a.oem] || 0) + 1;
//             if (bySlot[a.slot] !== undefined) bySlot[a.slot]++;
//         });

//         const completionRate = total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;
//         const assigneeMap = {};
//         assignments.forEach(a => { if (a.assignee) assigneeMap[a.assignee] = (assigneeMap[a.assignee] || 0) + 1; });
//         const topAssignees = Object.entries(assigneeMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

//         return { total, byStatus, byPriority, byOEM, bySlot, completionRate, overdueCount, topAssignees };
//     }, [assignments]);

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
//             PaperProps={{ sx: { width: 380, p: 0, bgcolor: "#f8fafc", border: "none" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />
//             <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #eee", bgcolor: "#fff" }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Box>
//                         <Typography fontWeight={700} fontSize={16}>Analytics Overview</Typography>
//                         <Typography fontSize={12} color="text.secondary">Live stats from all assignments</Typography>
//                     </Box>
//                     <IconButton size="small" onClick={onClose}
//                         sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                         <CloseIcon sx={{ fontSize: 17 }} />
//                     </IconButton>
//                 </Box>
//             </Box>

//             <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>
//                 {/* completion rate */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                         <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Completion Rate
//                     </Typography>
//                     <Box display="flex" alignItems="center" gap={2}>
//                         <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
//                             <svg width="80" height="80">
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
//                                     strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
//                                     strokeLinecap="round" transform="rotate(-90 40 40)" />
//                             </svg>
//                             <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 16, color: TEAL }}>
//                                 {stats.completionRate}%
//                             </Typography>
//                         </Box>
//                         <Box flex={1}>
//                             <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} tasks done</Typography>
//                             {stats.overdueCount > 0 && (
//                                 <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                     label={`${stats.overdueCount} overdue`} size="small"
//                                     sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
//                             )}
//                         </Box>
//                     </Box>
//                 </Paper>

//                 {/* by status */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
//                     <ProgressRow label="Pending"   value={stats.byStatus.Pending}   max={stats.total} color="#f57c00" />
//                     <ProgressRow label="Active"    value={stats.byStatus.Active}    max={stats.total} color="#2e7d32" />
//                     <ProgressRow label="Completed" value={stats.byStatus.Completed} max={stats.total} color="#1565c0" />
//                     <ProgressRow label="Cancelled" value={stats.byStatus.Cancelled} max={stats.total} color="#c62828" />
//                 </Paper>

//                 {/* by priority */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
//                     {PRIORITY_OPTIONS.map(p => (
//                         <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
//                     ))}
//                 </Paper>

//                 {/* by OEM */}
//                 {Object.keys(stats.byOEM).length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
//                         {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
//                             <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
//                         ))}
//                     </Paper>
//                 )}

//                 {/* slot heatmap */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
//                     <Box display="flex" gap={1} flexWrap="wrap">
//                         {SLOT_OPTIONS.map(s => {
//                             const cnt = stats.bySlot[s.value] || 0;
//                             const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
//                             return (
//                                 <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
//                                     bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
//                                     <Typography fontSize={18}>{s.label.split(" ")[0]}</Typography>
//                                     <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
//                                     <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
//                                 </Box>
//                             );
//                         })}
//                     </Box>
//                 </Paper>

//                 {/* top assignees */}
//                 {stats.topAssignees.length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                             <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Assignees
//                         </Typography>
//                         {stats.topAssignees.map(([name, cnt]) => (
//                             <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
//                                 <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                     {(name[0] || "?").toUpperCase()}
//                                 </Avatar>
//                                 <Box flex={1} minWidth={0}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                         <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
//                                         <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
//                                     </Box>
//                                     <LinearProgress variant="determinate"
//                                         value={(cnt / (stats.topAssignees[0]?.[1] || 1)) * 100}
//                                         sx={{ height: 4, borderRadius: 2, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 } }} />
//                                 </Box>
//                             </Box>
//                         ))}
//                     </Paper>
//                 )}
//             </Box>
//         </Drawer>
//     );
// };

// // ─── KanbanCard ───────────────────────────────────────────────────────────────
// const KanbanCard = ({ row, tasks, onEdit, onDelete }) => {
//     const pm = priorityMeta(row.priority);
//     const taskName = tasks.find(t => String(t.id) === String(row.task_id ?? row.task))?.task ?? "Unnamed Task";
//     const overdue = isOverdue(row.deadline, row.status);

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
//                 <Chip label={row.priority} size="small"
//                     sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                 <Box display="flex" gap={0.5}>
//                     {overdue && (
//                         <Tooltip title="Overdue!" arrow>
//                             <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} />
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

//             <Typography fontSize={13} fontWeight={700} color="#1a1a2e" mb={0.8} lineHeight={1.4} sx={{
//                 display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
//             }}>
//                 {taskName}
//             </Typography>

//             <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
//                 {row.oem && (
//                     <Chip label={row.oem} size="small"
//                         sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18, border: "1px solid #90caf9" }} />
//                 )}
//                 {row.slot && slotMeta(row.slot) && (
//                     <Chip label={slotMeta(row.slot).label} size="small"
//                         sx={{ bgcolor: alpha(slotMeta(row.slot).color, 0.1), color: slotMeta(row.slot).color, fontSize: 10, height: 18 }} />
//                 )}
//             </Box>

//             <Box display="flex" alignItems="center" justifyContent="space-between">
//                 <Box display="flex" alignItems="center" gap={0.6}>
//                     <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                         {(row.assignee ?? "?")[0].toUpperCase()}
//                     </Avatar>
//                     <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 80 }}>{row.assignee}</Typography>
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

// // ─── KanbanColumn ─────────────────────────────────────────────────────────────
// const KanbanColumn = ({ col, cards, tasks, onEdit, onDelete, onStatusChange }) => {
//     const [dragOver, setDragOver] = useState(false);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setDragOver(false);
//         const cardId     = e.dataTransfer.getData("cardId");
//         const fromStatus = e.dataTransfer.getData("fromStatus");
//         if (fromStatus !== col.key) onStatusChange(cardId, col.key);
//     };

//     return (
//         <Box sx={{
//             flex: 1, minWidth: 220, maxWidth: 280,
//             bgcolor: dragOver ? alpha(col.color, 0.06) : col.bg,
//             borderRadius: "14px", border: `2px dashed ${dragOver ? col.color : "transparent"}`,
//             transition: "all .15s", p: 2,
//         }}
//             onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//             onDragLeave={() => setDragOver(false)}
//             onDrop={handleDrop}
//         >
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <Box sx={{ color: col.color }}>{col.icon}</Box>
//                     <Typography fontSize={13} fontWeight={700} color={col.color}>{col.label}</Typography>
//                     <Chip label={cards.length} size="small"
//                         sx={{ height: 18, fontSize: 10.5, fontWeight: 700, bgcolor: alpha(col.color, 0.12), color: col.color, minWidth: 24 }} />
//                 </Box>
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
//                 <KanbanCard key={row.id} row={row} tasks={tasks}
//                     onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
//             ))}
//         </Box>
//     );
// };

// // ─── Dashboard panel ──────────────────────────────────────────────────────────
// const DashboardPanel = ({ assignments, tasks }) => {
//     const stats = useMemo(() => {
//         const total     = assignments.length;
//         const completed = assignments.filter(a => a.status === "Completed").length;
//         const active    = assignments.filter(a => a.status === "Active").length;
//         const pending   = assignments.filter(a => a.status === "Pending").length;
//         const cancelled = assignments.filter(a => a.status === "Cancelled").length;
//         const overdue   = assignments.filter(a => isOverdue(a.deadline, a.status)).length;
//         const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

//         const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//         assignments.forEach(a => { if (priorityCounts[a.priority] !== undefined) priorityCounts[a.priority]++; });

//         const recentActivity = [...assignments]
//             .sort((a, b) => new Date(b.assigned_at || 0) - new Date(a.assigned_at || 0))
//             .slice(0, 8);

//         const taskCompletions = tasks.map(t => {
//             const related = assignments.filter(a => String(a.task_id ?? a.task) === String(t.id));
//             const done    = related.filter(a => a.status === "Completed").length;
//             return { name: t.task ?? t.name ?? "Task", total: related.length, done };
//         }).filter(t => t.total > 0).slice(0, 6);

//         return { total, completed, active, pending, cancelled, overdue, completionRate, priorityCounts, recentActivity, taskCompletions };
//     }, [assignments, tasks]);

//     const taskLabel = (id) => {
//         const t = tasks.find(t => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? "—";
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* ── top kpi row ── */}
//             <Grid container spacing={2} mb={3}>
//                 {[
//                     { label: "Total Assignments", val: stats.total,     color: TEAL,      bg: TEAL_LIGHT, icon: <AssignmentIndOutlinedIcon /> },
//                     { label: "Active",             val: stats.active,    color: "#2e7d32", bg: "#e8f5e9",  icon: <PlayCircleOutlineIcon /> },
//                     { label: "Completed",          val: stats.completed, color: "#1565c0", bg: "#e3f2fd",  icon: <CheckCircleOutlineIcon /> },
//                     { label: "Overdue",            val: stats.overdue,   color: "#e65100", bg: "#fff3e0",  icon: <WarningAmberOutlinedIcon /> },
//                 ].map(kpi => (
//                     <Grid item xs={12} sm={6} md={3} key={kpi.label}>
//                         <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff", position: "relative", overflow: "hidden" }}>
//                             <Box sx={{ position: "absolute", top: -12, right: -12, width: 80, height: 80, borderRadius: "50%", bgcolor: alpha(kpi.color, 0.07), pointerEvents: "none" }} />
//                             <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//                                 <Box>
//                                     <Typography fontSize={12} color="text.secondary" mb={0.5}>{kpi.label}</Typography>
//                                     <Typography fontSize={32} fontWeight={800} color={kpi.color} lineHeight={1}>{kpi.val}</Typography>
//                                 </Box>
//                                 <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                     {React.cloneElement(kpi.icon, { sx: { fontSize: 22, color: kpi.color } })}
//                                 </Box>
//                             </Box>
//                             <LinearProgress variant="determinate"
//                                 value={stats.total > 0 ? (kpi.val / stats.total) * 100 : 0}
//                                 sx={{ mt: 2, height: 4, borderRadius: 2, bgcolor: alpha(kpi.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: kpi.color, borderRadius: 2 } }} />
//                         </Paper>
//                     </Grid>
//                 ))}
//             </Grid>

//             <Grid container spacing={2}>
//                 {/* completion ring */}
//                 <Grid item xs={12} md={4}>
//                     <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff", height: "100%" }}>
//                         <Typography fontWeight={700} fontSize={14} mb={2}>Overall Progress</Typography>
//                         <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={1}>
//                             <Box sx={{ position: "relative", width: 120, height: 120 }}>
//                                 <svg width="120" height="120">
//                                     <circle cx="60" cy="60" r="50" fill="none" stroke="#e8ecf0" strokeWidth="10" />
//                                     <circle cx="60" cy="60" r="50" fill="none" stroke={TEAL} strokeWidth="10"
//                                         strokeDasharray={`${(stats.completionRate / 100) * 314} 314`}
//                                         strokeLinecap="round" transform="rotate(-90 60 60)" />
//                                 </svg>
//                                 <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
//                                     <Typography fontWeight={800} fontSize={22} color={TEAL}>{stats.completionRate}%</Typography>
//                                     <Typography fontSize={10} color="text.secondary">Done</Typography>
//                                 </Box>
//                             </Box>
//                             <Box width="100%" mt={1}>
//                                 {[
//                                     { label: "Pending",   val: stats.pending,   color: "#f57c00" },
//                                     { label: "Active",    val: stats.active,    color: "#2e7d32" },
//                                     { label: "Completed", val: stats.completed, color: "#1565c0" },
//                                     { label: "Cancelled", val: stats.cancelled, color: "#c62828" },
//                                 ].map(s => (
//                                     <Box key={s.label} display="flex" alignItems="center" justifyContent="space-between" mb={0.8}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
//                                             <Typography fontSize={12.5} color="text.secondary">{s.label}</Typography>
//                                         </Box>
//                                         <Typography fontSize={12.5} fontWeight={700} color={s.color}>{s.val}</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </Box>
//                     </Paper>
//                 </Grid>

//                 {/* priority breakdown */}
//                 <Grid item xs={12} md={4}>
//                     <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff", height: "100%" }}>
//                         <Typography fontWeight={700} fontSize={14} mb={2}>Priority Breakdown</Typography>
//                         {PRIORITY_OPTIONS.map(p => {
//                             const cnt = stats.priorityCounts[p.value] || 0;
//                             const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
//                             return (
//                                 <Box key={p.value} mb={2}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.5}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: p.color }} />
//                                             <Typography fontSize={13} fontWeight={600} color={p.color}>{p.value}</Typography>
//                                         </Box>
//                                         <Typography fontSize={12} color="text.secondary">{cnt} · {pct}%</Typography>
//                                     </Box>
//                                     <LinearProgress variant="determinate" value={pct}
//                                         sx={{ height: 8, borderRadius: 4, bgcolor: alpha(p.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: p.color, borderRadius: 4 } }} />
//                                 </Box>
//                             );
//                         })}
//                     </Paper>
//                 </Grid>

//                 {/* task completion rates */}
//                 <Grid item xs={12} md={4}>
//                     <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff", height: "100%" }}>
//                         <Typography fontWeight={700} fontSize={14} mb={2}>Task Completion Rates</Typography>
//                         {stats.taskCompletions.length === 0 && (
//                             <Typography fontSize={13} color="text.disabled" textAlign="center" mt={3}>No task data yet</Typography>
//                         )}
//                         {stats.taskCompletions.map((t, i) => {
//                             const pct = t.total > 0 ? Math.round((t.done / t.total) * 100) : 0;
//                             return (
//                                 <Box key={i} mb={1.8}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.4}>
//                                         <Typography fontSize={12} fontWeight={600} noWrap sx={{ maxWidth: 160 }}>{t.name}</Typography>
//                                         <Typography fontSize={11.5} color="text.secondary">{t.done}/{t.total}</Typography>
//                                     </Box>
//                                     <LinearProgress variant="determinate" value={pct}
//                                         sx={{ height: 6, borderRadius: 3, bgcolor: alpha(TEAL, 0.1), "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 3 } }} />
//                                 </Box>
//                             );
//                         })}
//                     </Paper>
//                 </Grid>

//                 {/* recent activity */}
//                 <Grid item xs={12}>
//                     <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontWeight={700} fontSize={14} mb={2}>Recent Activity</Typography>
//                         {stats.recentActivity.length === 0 && (
//                             <Typography fontSize={13} color="text.disabled" textAlign="center" py={3}>No recent activity</Typography>
//                         )}
//                         <Box>
//                             {stats.recentActivity.map((a, i) => {
//                                 const pm = priorityMeta(a.priority);
//                                 const overdue = isOverdue(a.deadline, a.status);
//                                 return (
//                                     <Box key={a.id ?? i} display="flex" alignItems="center" gap={2} py={1.2}
//                                         sx={{ borderBottom: i < stats.recentActivity.length - 1 ? "1px solid #f5f5f5" : "none" }}>
//                                         <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                             {(a.assignee ?? "?")[0].toUpperCase()}
//                                         </Avatar>
//                                         <Box flex={1} minWidth={0}>
//                                             <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
//                                                 <Typography fontSize={13} fontWeight={600} noWrap>{a.assignee ?? "—"}</Typography>
//                                                 <Typography fontSize={12} color="text.secondary">assigned to</Typography>
//                                                 <Typography fontSize={13} fontWeight={600} color={TEAL} noWrap sx={{ maxWidth: 180 }}>
//                                                     {taskLabel(a.task_id ?? a.task)}
//                                                 </Typography>
//                                             </Box>
//                                             <Box display="flex" alignItems="center" gap={0.8} mt={0.3}>
//                                                 {a.oem && <Chip label={a.oem} size="small" sx={{ height: 17, fontSize: 10, bgcolor: "#e3f2fd", color: "#0d47a1" }} />}
//                                                 <Chip label={a.priority} size="small" sx={{ height: 17, fontSize: 10, bgcolor: pm.bg, color: pm.color, fontWeight: 700 }} />
//                                                 {overdue && <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "11px !important", color: "#e65100 !important" }} />}
//                                                     label="Overdue" size="small" sx={{ height: 17, fontSize: 10, bgcolor: "#fff3e0", color: "#e65100" }} />}
//                                             </Box>
//                                         </Box>
//                                         <Box textAlign="right" flexShrink={0}>
//                                             <Chip label={a.status} size="small"
//                                                 sx={{ bgcolor: alpha(statusColor(a.status), 0.1), color: statusColor(a.status), fontWeight: 700, fontSize: 10.5, mb: 0.3 }} />
//                                             <Typography fontSize={11} color="text.disabled" display="block">{fmtDate(a.deadline)}</Typography>
//                                         </Box>
//                                     </Box>
//                                 );
//                             })}
//                         </Box>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// // ─── ManageTasks (CRUD for tasks list) ────────────────────────────────────────
// const ManageTasks = ({ tasks, loading, onRefresh }) => {
//     const [taskDialogOpen, setTaskDialogOpen] = useState(false);
//     const [editTaskId,     setEditTaskId]     = useState(null);
//     const [taskForm,       setTaskForm]       = useState(EMPTY_TASK_FORM);
//     const [taskErrors,     setTaskErrors]     = useState({});
//     const [saving,         setSaving]         = useState(false);
//     const [search,         setSearch]         = useState("");

//     const setF = (field, value) => { setTaskForm(p => ({ ...p, [field]: value })); setTaskErrors(e => ({ ...e, [field]: "" })); };

//     const openCreate = () => { setEditTaskId(null); setTaskForm(EMPTY_TASK_FORM); setTaskErrors({}); setTaskDialogOpen(true); };
//     const openEdit   = (t)  => {
//         setEditTaskId(t.id);
//         setTaskForm({ task: t.task ?? t.name ?? "", description: t.description ?? "", category: t.category ?? "" });
//         setTaskErrors({});
//         setTaskDialogOpen(true);
//     };

//     const validate = () => {
//         const e = {};
//         if (!taskForm.task.trim()) e.task = "Task name is required";
//         setTaskErrors(e);
//         return !Object.keys(e).length;
//     };

//     const handleSave = async () => {
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const fd = new FormData();
//             fd.append("task",        taskForm.task);
//             fd.append("description", taskForm.description);
//             fd.append("category",    taskForm.category);

//             if (editTaskId) {
//                 await postData(API.TASK_UPDATE(editTaskId), fd);
//             } else {
//                 await postData(API.TASK_CREATE, fd);
//             }
//             setTaskDialogOpen(false);
//             onRefresh();
//             Swal.fire({ icon: "success", title: editTaskId ? "Task Updated!" : "Task Created!", timer: 2000, showConfirmButton: false, timerProgressBar: true });
//         } catch (err) {
//             console.error(err);
//             Swal.fire("Error", "Failed to save task.", "error");
//         } finally { setSaving(false); }
//     };

//     const handleDelete = (t) => {
//         Swal.fire({
//             title: "Delete Task?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${t.task ?? t.name}</b>? This cannot be undone.</span>`,
//             icon: "warning", showCancelButton: true,
//             confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.TASK_DELETE(t.id)}`, { method: "DELETE", headers: { Accept: "application/json" } });
//                 onRefresh();
//             } catch { Swal.fire("Error", "Failed to delete task.", "error"); }
//         });
//     };

//     const filtered = tasks.filter(t =>
//         (t.task ?? t.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
//         (t.category ?? "").toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* toolbar */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5} flexWrap="wrap" gap={1.5}>
//                 <TextField size="small" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)}
//                     sx={{ minWidth: 260, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5 } }}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment> }} />
//                 <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
//                     Add Task
//                 </Button>
//             </Box>

//             <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e8ecf0" }}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow sx={{ bgcolor: TEAL }}>
//                             {["SN", "Task Name", "Description", "Category", "Actions"].map(h => (
//                                 <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em" }}>{h}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading && Array.from({ length: 4 }).map((_, i) => (
//                             <TableRow key={i}>{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton height={22} /></TableCell>)}</TableRow>
//                         ))}
//                         {!loading && filtered.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
//                                     <Typography fontSize={14} color="text.secondary" fontWeight={600}>
//                                         {search ? "No tasks match your search" : "No tasks yet — click Add Task to create one"}
//                                     </Typography>
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filtered.map((t, idx) => (
//                             <TableRow key={t.id ?? idx} hover sx={{ "&:nth-of-type(even)": { bgcolor: "#fafbfc" }, "&:hover": { bgcolor: alpha(TEAL, 0.03) } }}>
//                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>
//                                 <TableCell><Typography fontSize={13} fontWeight={700} color="#1a1a2e">{t.task ?? t.name}</Typography></TableCell>
//                                 <TableCell><Typography fontSize={12.5} color="text.secondary">{t.description ?? "—"}</Typography></TableCell>
//                                 <TableCell>
//                                     {t.category
//                                         ? <Chip label={t.category} size="small" sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11 }} />
//                                         : <Typography fontSize={12} color="text.disabled">—</Typography>
//                                     }
//                                 </TableCell>
//                                 <TableCell>
//                                     <Box display="flex" gap={0.5}>
//                                         <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(t)} sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}><EditOutlinedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
//                                         <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(t)} sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}><DeleteOutlineIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {!loading && (
//                 <Typography variant="caption" color="text.disabled" display="block" mt={1.5} px={0.5}>
//                     {filtered.length} of {tasks.length} tasks shown
//                 </Typography>
//             )}

//             {/* Task dialog */}
//             <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="xs" fullWidth disableScrollLock
//                 PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" } }}>
//                 <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />
//                 <DialogTitle sx={{ p: 0 }}>
//                     <Box display="flex" alignItems="center" justifyContent="space-between" px={3} pt={2.5} pb={1.5}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(TEAL, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <TaskAltOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>{editTaskId ? "Edit Task" : "New Task"}</Typography>
//                                 <Typography fontSize={12} color="text.secondary">{editTaskId ? "Update task details" : "Create a new reviewable task"}</Typography>
//                             </Box>
//                         </Box>
//                         <IconButton onClick={() => setTaskDialogOpen(false)}
//                             sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                             <CloseIcon sx={{ fontSize: 17 }} />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <Divider />
//                 <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>
//                         <TextField label="Task Name" value={taskForm.task} onChange={e => setF("task", e.target.value)}
//                             error={!!taskErrors.task} helperText={taskErrors.task} size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment: <InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment> }} />
//                         <TextField label="Description (optional)" value={taskForm.description} onChange={e => setF("description", e.target.value)}
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />
//                         <TextField label="Category (optional)" value={taskForm.category} onChange={e => setF("category", e.target.value)}
//                             size="small" fullWidth sx={fieldSx} placeholder="e.g. Network, Hardware, Software…" />
//                     </Box>
//                 </DialogContent>
//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button onClick={() => setTaskDialogOpen(false)} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5 }}>Cancel</Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 3, boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                         {saving ? "Saving…" : editTaskId ? "Update Task" : "Create Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// const AssignTask = () => {
//     const navigate = useNavigate();

//     // shared state
//     const [assignments, setAssignments] = useState([]);
//     const [tasks,       setTasks]       = useState([]);
//     const [users,       setUsers]       = useState([]);
//     const [loading,     setLoading]     = useState(false);
//     const [refreshing,  setRefreshing]  = useState(false);

//     // tabs
//     const [activeTab, setActiveTab] = useState(0); // 0=Assign, 1=Dashboard, 2=Manage Tasks

//     // assign-task dialog
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId,     setEditId]     = useState(null);
//     const [form,       setForm]       = useState(EMPTY_ASSIGN_FORM);
//     const [errors,     setErrors]     = useState({});
//     const [saving,     setSaving]     = useState(false);

//     // assign-task filters
//     const [tableSearch,    setTableSearch]    = useState("");
//     const [statusFilter,   setStatusFilter]   = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");
//     const [viewMode,       setViewMode]       = useState("table");
//     const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
//     const [myTasksOnly,    setMyTasksOnly]    = useState(false);
//     const [taskSearch,     setTaskSearch]     = useState("");

//     // email autocomplete
//     const [emailSuggestions, setEmailSuggestions] = useState([]);
//     const [emailSearching,   setEmailSearching]   = useState(false);
//     const [showSuggestions,  setShowSuggestions]  = useState(false);
//     const emailInputRef    = useRef(null);
//     const emailSuggestRef  = useRef(null);
//     const emailSearchTimer = useRef(null);

//     const loggedInUser = useMemo(() => getLoggedInUser(), []);

//     // ── fetch ─────────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const [assignRes, taskRes, userRes] = await Promise.allSettled([
//                 getData(API.ASSIGN_GET_ALL),
//                 getData(API.TASK_GET_ALL),
//                 getData(API.GET_USERS),
//             ]);
//             const safe = (r) => r.status === "fulfilled" ? (Array.isArray(r.value) ? r.value : r.value?.data ?? []) : [];
//             setAssignments(safe(assignRes));
//             setTasks(safe(taskRes));
//             setUsers(safe(userRes));
//         } catch (err) { console.error("fetchAll:", err); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     useEffect(() => {
//         const h = (e) => { if (emailSuggestRef.current && !emailSuggestRef.current.contains(e.target)) setShowSuggestions(false); };
//         document.addEventListener("mousedown", h);
//         return () => document.removeEventListener("mousedown", h);
//     }, []);

//     // ── computed stats ────────────────────────────────────────────────────────
//     const stats = useMemo(() => ({
//         total:     assignments.length,
//         pending:   assignments.filter(a => a.status === "Pending").length,
//         active:    assignments.filter(a => a.status === "Active").length,
//         completed: assignments.filter(a => a.status === "Completed").length,
//         cancelled: assignments.filter(a => a.status === "Cancelled").length,
//         overdue:   assignments.filter(a => isOverdue(a.deadline, a.status)).length,
//     }), [assignments]);

//     // ── filtered rows ─────────────────────────────────────────────────────────
//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return assignments.filter((row) => {
//             const taskName = (tasks.find(t => String(t.id) === String(row.task_id ?? row.task))?.task ?? "").toLowerCase();
//             const assignee = (row.assignee ?? "").toLowerCase();
//             const oem      = (row.oem ?? "").toLowerCase();
//             const matchQ   = !q || taskName.includes(q) || assignee.includes(q) || oem.includes(q);
//             const matchS   = activeStatCard === "All" ? true : row.status === activeStatCard;
//             const matchD   = statusFilter   === "All" ? true : row.status === statusFilter;
//             const matchMe  = !myTasksOnly || assignee === loggedInUser.name.toLowerCase();
//             return matchQ && matchS && matchD && matchMe;
//         });
//     }, [assignments, tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

//     const kanbanCols = useMemo(() => {
//         const grouped = {};
//         KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
//         filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
//         return grouped;
//     }, [filteredRows]);

//     const handleStatClick = (label) => { setActiveStatCard(label); setStatusFilter(label); setTableSearch(""); };

//     // ── kanban drag-drop ──────────────────────────────────────────────────────
//     const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
//         const row = assignments.find(a => String(a.id) === String(cardId));
//         if (!row) return;
//         // optimistic update so UI responds instantly
//         setAssignments(prev => prev.map(a => String(a.id) === String(cardId) ? { ...a, status: newStatus } : a));
//         try {
//             const fd = new FormData();
//             Object.entries({ ...row, status: newStatus }).forEach(([k, v]) => {
//                 if (v !== null && v !== undefined) {
//                     fd.append(k, Array.isArray(v) ? v.join(",") : v);
//                 }
//             });
//             await postData(API.ASSIGN_UPDATE(cardId), fd);
//         } catch (e) {
//             console.error("Status update failed:", e);
//             // roll back
//             setAssignments(prev => prev.map(a => String(a.id) === String(cardId) ? row : a));
//             Swal.fire("Error", "Failed to update status.", "error");
//         }
//     }, [assignments]);

//     // ── form helpers ──────────────────────────────────────────────────────────
//     const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); };

//     const filteredTasks = tasks.filter(t => (t.task ?? t.name ?? "").toLowerCase().includes(taskSearch.toLowerCase()));

//     const searchEmails = (query) => {
//         set("emailInput", query);
//         if (!query.trim()) { setEmailSuggestions([]); setShowSuggestions(false); return; }
//         clearTimeout(emailSearchTimer.current);
//         emailSearchTimer.current = setTimeout(async () => {
//             setEmailSearching(true);
//             try {
//                 const res  = await getData(API.SEARCH_USERS(query));
//                 const list = Array.isArray(res) ? res : res?.data ?? [];
//                 setEmailSuggestions(list.filter(u => u.email && !form.emails.includes(u.email)));
//                 setShowSuggestions(true);
//             } catch (err) { console.error(err); }
//             finally { setEmailSearching(false); }
//         }, 400);
//     };

//     const pickSuggestion = (user) => {
//         if (!user.email) return;
//         setForm(p => ({ ...p, emails: [...p.emails, user.email], emailInput: "" }));
//         setEmailSuggestions([]); setShowSuggestions(false);
//         setTimeout(() => emailInputRef.current?.focus(), 50);
//     };

//     const commitEmail = () => {
//         const val = form.emailInput.trim().replace(/,$/, "");
//         if (!val) return;
//         if (!isValidEmail(val))        { setErrors(e => ({ ...e, emails: "Invalid email address" })); return; }
//         if (form.emails.includes(val)) { setErrors(e => ({ ...e, emails: "Already added" }));         return; }
//         setForm(p => ({ ...p, emails: [...p.emails, val], emailInput: "" }));
//         setErrors(e => ({ ...e, emails: "" }));
//     };

//     const removeEmail = (addr) => setForm(p => ({ ...p, emails: p.emails.filter(e => e !== addr) }));

//     const validate = () => {
//         const e = {};
//         if (!form.task_id)            e.task_id  = "Please select a task";
//         if (!form.assignee.trim())    e.assignee = "Assignee is required";
//         if (form.emails.length === 0) e.emails   = "Add at least one email";
//         if (!form.oem)                e.oem      = "OEM is required";
//         if (!form.slot)               e.slot     = "Slot is required";
//         if (!form.deadline)           e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const openCreate = () => {
//         const me = getLoggedInUser();
//         setEditId(null); setTaskSearch(""); setEmailSuggestions([]); setShowSuggestions(false);
//         setForm({ ...EMPTY_ASSIGN_FORM, assignee: me.name, emails: me.email ? [me.email] : [], emailInput: "", deadline: nowLocal() });
//         setErrors({}); setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id); setTaskSearch(""); setEmailSuggestions([]); setShowSuggestions(false);
//         let emails = [];
//         if (Array.isArray(row.emails))           emails = row.emails;
//         else if (typeof row.emails === "string") emails = row.emails.split(",").map(s => s.trim()).filter(Boolean);
//         else if (row.email)                      emails = [row.email];
//         setForm({
//             task_id: String(row.task_id ?? row.task ?? ""), assignee: row.assignee ?? "",
//             emails, emailInput: "", oem: row.oem ?? "", slot: row.slot ?? "",
//             priority: row.priority ?? "Medium",
//             deadline: row.deadline ? row.deadline.slice(0, 16) : nowLocal(),
//             reminder: row.reminder ?? "none", remark: row.remark ?? "", status: row.status ?? "Pending",
//         });
//         setErrors({}); setDialogOpen(true);
//     };

//     const handleSave = async () => {
//         if (form.emailInput.trim()) commitEmail();
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const fd = new FormData();
//             fd.append("task_id",     form.task_id);
//             fd.append("assignee",    form.assignee);
//             fd.append("emails",      form.emails.join(","));
//             fd.append("email",       form.emails[0] ?? "");
//             fd.append("oem",         form.oem);
//             fd.append("slot",        form.slot);
//             fd.append("priority",    form.priority);
//             fd.append("deadline",    new Date(form.deadline).toISOString());
//             fd.append("reminder",    form.reminder);
//             fd.append("remark",      form.remark);
//             fd.append("status",      form.status);
//             fd.append("assigned_at", nowISO());

//             let savedId = editId;
//             if (editId) {
//                 await postData(API.ASSIGN_UPDATE(editId), fd);
//             } else {
//                 const res = await postData(API.ASSIGN_CREATE, fd);
//                 savedId   = res?.id ?? res?.data?.id ?? null;
//             }

//             // reminder API
//             if (savedId && form.reminder !== "none") {
//                 try { await postData(API.ASSIGN_UPDATE_REMINDER(savedId), { reminder: form.reminder }); }
//                 catch (e) { console.warn("Reminder update failed:", e); }
//             }

//             // email notification (stub – fires even without backend ready)
//             const taskName = tasks.find(t => String(t.id) === String(form.task_id))?.task ?? form.task_id;
//             await sendEmailNotification({
//                 to:        form.emails,
//                 subject:   `Task Assigned: ${taskName}`,
//                 body:      `You have been assigned the task "${taskName}" by ${form.assignee}. Deadline: ${fmtDate(form.deadline)} ${fmtTime(form.deadline)}.`,
//                 taskName,
//                 assignee:  form.assignee,
//                 deadline:  form.deadline,
//                 reminder:  form.reminder,
//             });

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Assignment Updated!" : "Task Assigned!",
//                 html: `Assigned to <b>${form.assignee}</b><br/>
//                        Notifications → <b>${form.emails.join(", ")}</b><br/>
//                        Reminder: <b>${reminderMeta(form.reminder).icon} ${reminderMeta(form.reminder).label}</b>`,
//                 timer: 3000, showConfirmButton: false, timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave:", err);
//             Swal.fire("Error", "Failed to save assignment.", "error");
//         } finally { setSaving(false); }
//     };

//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Remove Assignment?",
//             html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
//             icon: "warning", showCancelButton: true,
//             confirmButtonColor: "#c62828", confirmButtonText: "Yes, remove",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.ASSIGN_DELETE(row.id)}`, { method: "DELETE", headers: { Accept: "application/json" } });
//                 await fetchAll();
//             } catch { Swal.fire("Error", "Failed to remove assignment.", "error"); }
//         });
//     };

//     const taskLabel = (id) => {
//         const t = tasks.find(t => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? id ?? "—";
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>
//             {/* breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* ════ main card ════ */}
//             <Paper elevation={0} sx={{
//                 borderRadius: "20px", overflow: "hidden",
//                 border: "1px solid #e8ecf0", bgcolor: "#fff",
//                 boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
//             }}>
//                 {/* ── header ── */}
//                 <Box sx={{
//                     px: 3, pt: 3, pb: 0, borderBottom: "1px solid #f0f2f5",
//                     background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
//                 }}>
//                     <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
//                         <Box>
//                             <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
//                                 Daily Task Review
//                             </Typography>
//                             <Typography fontSize={13} color="text.secondary" mt={0.3}>
//                                 Assign, track and review tasks · drag Kanban cards to update status
//                             </Typography>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
//                             {activeTab === 0 && (
//                                 <>
//                                     <Chip
//                                         icon={<PersonOutlineIcon sx={{ fontSize: "14px !important" }} />}
//                                         label="My Tasks"
//                                         onClick={() => setMyTasksOnly(p => !p)}
//                                         variant={myTasksOnly ? "filled" : "outlined"}
//                                         sx={{
//                                             fontWeight: 600, fontSize: 12, cursor: "pointer",
//                                             bgcolor: myTasksOnly ? alpha(TEAL, 0.12) : "transparent",
//                                             color: myTasksOnly ? TEAL_DARK : "text.secondary",
//                                             borderColor: myTasksOnly ? TEAL : "#d0d5dd",
//                                             "& .MuiChip-icon": { color: myTasksOnly ? TEAL : "inherit" },
//                                         }}
//                                     />
//                                     <Button variant="outlined"
//                                         startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
//                                         onClick={() => setAnalyticsOpen(true)}
//                                         sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: "#d0d5dd", color: "#374151", "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
//                                         Analytics
//                                     </Button>
//                                     <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                         sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
//                                         <ToggleButton value="table"><Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
//                                         <ToggleButton value="kanban"><Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
//                                     </ToggleButtonGroup>
//                                 </>
//                             )}

//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>

//                             {activeTab === 0 && (
//                                 <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
//                                     Assign Task
//                                 </Button>
//                             )}
//                         </Box>
//                     </Box>

//                     {/* tabs */}
//                     <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
//                         sx={{
//                             "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 13, minHeight: 40, py: 1 },
//                             "& .Mui-selected": { color: TEAL },
//                             "& .MuiTabs-indicator": { bgcolor: TEAL, height: 3, borderRadius: "3px 3px 0 0" },
//                         }}>
//                         <Tab label="Assign Task" icon={<AssignmentIndOutlinedIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
//                         <Tab label="Dashboard"   icon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}   iconPosition="start" />
//                         <Tab label="Manage Tasks" icon={<TaskAltOutlinedIcon sx={{ fontSize: 16 }} />}     iconPosition="start" />
//                     </Tabs>
//                 </Box>

//                 {/* ════ TAB 0 — ASSIGN TASK ════ */}
//                 {activeTab === 0 && (
//                     <>
//                         {/* stat cards */}
//                         <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
//                             <Box display="flex" gap={2} flexWrap="wrap">
//                                 <StatCard label="Total"     count={stats.total}     icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} active={activeStatCard === "All"}       loading={loading} onClick={() => handleStatClick("All")} />
//                                 <StatCard label="Pending"   count={stats.pending}   icon={<HourglassEmptyIcon />}       color="#f57c00" bg="#fff3e0"    active={activeStatCard === "Pending"}   loading={loading} onClick={() => handleStatClick("Pending")} />
//                                 <StatCard label="Active"    count={stats.active}    icon={<PlayCircleOutlineIcon />}    color="#2e7d32" bg="#e8f5e9"    active={activeStatCard === "Active"}    loading={loading} onClick={() => handleStatClick("Active")} />
//                                 <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />}  color="#1565c0" bg="#e3f2fd"    active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
//                                 <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />}      color="#c62828" bg="#fdecea"    active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
//                                 {stats.overdue > 0 && (
//                                     <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => {}} />
//                                 )}
//                             </Box>
//                         </Box>

//                         {/* search + filter */}
//                         <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
//                             <TextField size="small" placeholder="Search task, assignee or OEM…"
//                                 value={tableSearch}
//                                 onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                                 sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

//                             <TextField select size="small" value={statusFilter}
//                                 onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                                 sx={{ minWidth: 170, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                                 InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
//                                 {STATUS_FILTERS.map(s => (
//                                     <MenuItem key={s} value={s}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}
//                                             {s}
//                                         </Box>
//                                     </MenuItem>
//                                 ))}
//                             </TextField>

//                             {(tableSearch || statusFilter !== "All" || myTasksOnly) && (
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     <Typography fontSize={12} color="text.secondary">
//                                         {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
//                                     </Typography>
//                                     <Chip label="Clear" size="small"
//                                         onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
//                                         sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                                 </Box>
//                             )}
//                         </Box>

//                         {/* ── KANBAN ── */}
//                         {viewMode === "kanban" && (
//                             <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
//                                 {loading ? (
//                                     <Box display="flex" gap={2}>
//                                         {[1, 2, 3, 4].map(i => (
//                                             <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
//                                                 {[1, 2, 3].map(j => <Skeleton key={j} height={120} sx={{ borderRadius: "12px", mb: 1 }} />)}
//                                             </Box>
//                                         ))}
//                                     </Box>
//                                 ) : (
//                                     <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
//                                         {KANBAN_COLS.map(col => (
//                                             <KanbanColumn key={col.key} col={col}
//                                                 cards={kanbanCols[col.key] || []}
//                                                 tasks={tasks}
//                                                 onEdit={openEdit}
//                                                 onDelete={handleDelete}
//                                                 onStatusChange={handleKanbanStatusChange}
//                                             />
//                                         ))}
//                                     </Box>
//                                 )}
//                                 <Typography variant="caption" color="text.disabled" display="block" textAlign="center" mt={2}>
//                                     Drag cards between columns to update status instantly
//                                 </Typography>
//                             </Box>
//                         )}

//                         {/* ── TABLE ── */}
//                         {viewMode === "table" && (
//                             <>
//                                 <TableContainer>
//                                     <Table size="small">
//                                         <TableHead>
//                                             <TableRow sx={{ bgcolor: TEAL }}>
//                                                 {["SN", "Task", "Assignee", "Recipients", "OEM", "Slot", "Priority", "Deadline", "Reminder", "Status", "Actions"].map(h => (
//                                                     <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {loading && Array.from({ length: 5 }).map((_, i) => (
//                                                 <TableRow key={i}>{Array.from({ length: 11 }).map((_, j) => <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>)}</TableRow>
//                                             ))}

//                                             {!loading && filteredRows.length === 0 && (
//                                                 <TableRow>
//                                                     <TableCell colSpan={11} align="center" sx={{ py: 7 }}>
//                                                         <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                                             <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                                                 <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
//                                                             </Box>
//                                                             <Typography fontWeight={600} fontSize={14} color="text.secondary">
//                                                                 {tableSearch || statusFilter !== "All" ? "No assignments found" : "No assignments yet"}
//                                                             </Typography>
//                                                             <Typography fontSize={12.5} color="text.disabled">
//                                                                 {tableSearch || statusFilter !== "All" ? "Try adjusting filters" : "Click + Assign Task to get started"}
//                                                             </Typography>
//                                                         </Box>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )}

//                                             {!loading && filteredRows.map((row, idx) => {
//                                                 const pm = priorityMeta(row.priority);
//                                                 const sm = slotMeta(row.slot);
//                                                 const rm = reminderMeta(row.reminder);
//                                                 const overdue = isOverdue(row.deadline, row.status);
//                                                 const rowEmails = Array.isArray(row.emails)
//                                                     ? row.emails
//                                                     : (row.emails ?? row.email ?? "").split(",").map(s => s.trim()).filter(Boolean);
//                                                 return (
//                                                     <TableRow key={row.id ?? idx} hover sx={{
//                                                         "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
//                                                         "&:hover":             { bgcolor: alpha(TEAL, 0.03) },
//                                                         bgcolor: overdue ? alpha("#e65100", 0.03) : undefined,
//                                                         transition: "background .12s",
//                                                     }}>
//                                                         <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

//                                                         <TableCell>
//                                                             <Box display="flex" alignItems="center" gap={0.7}>
//                                                                 {overdue && <Tooltip title="Overdue" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} /></Tooltip>}
//                                                                 <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
//                                                                     <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 130 }}>
//                                                                         {taskLabel(row.task_id ?? row.task)}
//                                                                     </Typography>
//                                                                 </Tooltip>
//                                                             </Box>
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Box display="flex" alignItems="center" gap={0.8}>
//                                                                 <Avatar sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                                                     {(row.assignee ?? "?")[0].toUpperCase()}
//                                                                 </Avatar>
//                                                                 <Typography fontSize={13} fontWeight={500}>{row.assignee ?? "—"}</Typography>
//                                                             </Box>
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Box display="flex" flexWrap="wrap" gap={0.4} maxWidth={180}>
//                                                                 {rowEmails.slice(0, 2).map(em => (
//                                                                     <Chip key={em} label={em} size="small"
//                                                                         sx={{ fontSize: 10.5, height: 20, bgcolor: "#f3f4f6", color: "#374151", fontFamily: "monospace" }} />
//                                                                 ))}
//                                                                 {rowEmails.length > 2 && (
//                                                                     <Tooltip title={rowEmails.slice(2).join(", ")} arrow>
//                                                                         <Chip label={`+${rowEmails.length - 2}`} size="small"
//                                                                             sx={{ fontSize: 10.5, height: 20, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700 }} />
//                                                                     </Tooltip>
//                                                                 )}
//                                                             </Box>
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Chip label={row.oem || "—"} size="small"
//                                                                 sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11, border: "1px solid #90caf9" }} />
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             {sm ? (
//                                                                 <Chip label={sm.label} size="small"
//                                                                     sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11, border: `1px solid ${alpha(sm.color, 0.3)}` }} />
//                                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Chip label={row.priority || "—"} size="small"
//                                                                 sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                                                         </TableCell>

//                                                         <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                             <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
//                                                                 {fmtDate(row.deadline)}
//                                                             </Typography>
//                                                             <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             {row.reminder && row.reminder !== "none" ? (
//                                                                 <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "13px !important" }} />}
//                                                                     label={rm.label} size="small"
//                                                                     sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontWeight: 600, fontSize: 11, border: "1px solid #d1c4e9" }} />
//                                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Chip label={row.status ?? "Pending"} size="small"
//                                                                 sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status), fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <Box display="flex" gap={0.5}>
//                                                                 <Tooltip title="Edit" arrow>
//                                                                     <IconButton size="small" onClick={() => openEdit(row)}
//                                                                         sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}>
//                                                                         <EditOutlinedIcon sx={{ fontSize: 17 }} />
//                                                                     </IconButton>
//                                                                 </Tooltip>
//                                                                 <Tooltip title="Delete" arrow>
//                                                                     <IconButton size="small" onClick={() => handleDelete(row)}
//                                                                         sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                                         <DeleteOutlineIcon sx={{ fontSize: 17 }} />
//                                                                     </IconButton>
//                                                                 </Tooltip>
//                                                             </Box>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>

//                                 {!loading && (
//                                     <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                                         <Typography variant="caption" color="text.disabled">
//                                             Showing <strong>{filteredRows.length}</strong> of <strong>{assignments.length}</strong> assignments
//                                             {stats.overdue > 0 && (
//                                                 <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>
//                                                     ⚠ {stats.overdue} overdue
//                                                 </span>
//                                             )}
//                                         </Typography>
//                                         <Typography variant="caption" color="text.disabled">
//                                             Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove · switch to Kanban for drag-drop
//                                         </Typography>
//                                     </Box>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 )}

//                 {/* ════ TAB 1 — DASHBOARD ════ */}
//                 {activeTab === 1 && (
//                     loading
//                         ? <Box sx={{ p: 3 }}><Grid container spacing={2}>{Array.from({ length: 6 }).map((_, i) => <Grid item xs={12} sm={6} md={4} key={i}><Skeleton height={160} sx={{ borderRadius: "16px" }} /></Grid>)}</Grid></Box>
//                         : <DashboardPanel assignments={assignments} tasks={tasks} />
//                 )}

//                 {/* ════ TAB 2 — MANAGE TASKS ════ */}
//                 {activeTab === 2 && (
//                     <ManageTasks tasks={tasks} loading={loading} onRefresh={() => fetchAll(true)} />
//                 )}
//             </Paper>

//             {/* analytics drawer */}
//             <AnalyticsPanel assignments={assignments} tasks={tasks}
//                 open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

//             {/* ════ ASSIGN TASK DIALOG ════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth disableScrollLock
//                 PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" } }}>

//                 <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

//                 <DialogTitle sx={{ p: 0 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(TEAL, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>{editId ? "Edit Assignment" : "Assign Task"}</Typography>
//                                 <Typography fontSize={12} color="text.secondary">{editId ? "Update assignment details" : "Fill in the details to assign"}</Typography>
//                             </Box>
//                         </Box>
//                         <Tooltip title="Close" arrow>
//                             <IconButton onClick={() => setDialogOpen(false)}
//                                 sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px", transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
//                                 <CloseIcon sx={{ fontSize: 17 }} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* task dropdown */}
//                         <TextField select label="Select Task" value={form.task_id}
//                             onChange={(e) => set("task_id", e.target.value)}
//                             error={!!errors.task_id} helperText={errors.task_id}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment: (<InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}
//                             SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 320 } }, autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true } }}>
//                             <MenuItem disableRipple disableTouchRipple sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "#fff", "&:hover": { bgcolor: "#fff" }, cursor: "default", py: 1 }}>
//                                 <TextField size="small" fullWidth autoFocus placeholder="Search task..."
//                                     value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)}
//                                     onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#aaa" }} /></InputAdornment>) }}
//                                     sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13, bgcolor: "#fff" } }} />
//                             </MenuItem>
//                             <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Choose a task —</em></MenuItem>
//                             {filteredTasks.length === 0 && <MenuItem disabled><Typography fontSize={13} color="text.disabled">No tasks found</Typography></MenuItem>}
//                             {filteredTasks.map(t => (
//                                 <MenuItem key={t.id} value={String(t.id)} sx={{ fontSize: 13, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                     {t.task ?? t.name ?? t.title}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* assignee */}
//                         <TextField label="Assignee" value={form.assignee} onChange={(e) => set("assignee", e.target.value)}
//                             error={!!errors.assignee} helperText={errors.assignee || "Auto-filled from your login session"}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{
//                                 startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>),
//                                 endAdornment: form.assignee ? (
//                                     <InputAdornment position="end">
//                                         <Avatar sx={{ width: 22, height: 22, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.2), color: TEAL_DARK }}>
//                                             {form.assignee[0].toUpperCase()}
//                                         </Avatar>
//                                     </InputAdornment>
//                                 ) : null,
//                             }} />

//                         {/* multi-email */}
//                         <Box ref={emailSuggestRef} sx={{ position: "relative" }}>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Recipients (emails)
//                                 <Chip label={`${form.emails.length} added`} size="small"
//                                     sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK }} />
//                             </Typography>
//                             <Paper variant="outlined"
//                                 onClick={() => emailInputRef.current?.focus()}
//                                 sx={{
//                                     p: "8px 10px", minHeight: 46, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.7,
//                                     borderRadius: "8px", cursor: "text",
//                                     borderColor: errors.emails ? "#c62828" : showSuggestions ? TEAL : "#c4c4c4",
//                                     "&:hover": { borderColor: errors.emails ? "#c62828" : TEAL }, transition: "border-color .15s",
//                                 }}>
//                                 {form.emails.map(em => (
//                                     <Chip key={em} label={em} size="small" onDelete={() => removeEmail(em)}
//                                         sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 500, fontSize: 12, height: 24, fontFamily: "monospace", "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                                 ))}
//                                 <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 180, gap: 0.5 }}>
//                                     <input ref={emailInputRef} value={form.emailInput}
//                                         placeholder={form.emails.length === 0 ? "Search name or type email…" : "Add more…"}
//                                         onChange={(e) => searchEmails(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (["Enter", "Tab", ","].includes(e.key)) {
//                                                 e.preventDefault();
//                                                 if (emailSuggestions.length > 0 && !isValidEmail(form.emailInput)) pickSuggestion(emailSuggestions[0]);
//                                                 else { commitEmail(); setShowSuggestions(false); }
//                                             }
//                                             if (e.key === "Escape") setShowSuggestions(false);
//                                             if (e.key === "Backspace" && !form.emailInput && form.emails.length > 0)
//                                                 removeEmail(form.emails[form.emails.length - 1]);
//                                         }}
//                                         onFocus={() => { if (emailSuggestions.length > 0) setShowSuggestions(true); }}
//                                         style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", fontFamily: "inherit", color: "inherit" }} />
//                                     {emailSearching && (
//                                         <Box sx={{ width: 14, height: 14, flexShrink: 0, border: `2px solid ${TEAL}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
//                                     )}
//                                 </Box>
//                             </Paper>
//                             {showSuggestions && emailSuggestions.length > 0 && (
//                                 <Paper elevation={6} sx={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1400, borderRadius: "10px", overflow: "hidden", border: `1px solid ${TEAL_MID}`, maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
//                                     <Box sx={{ px: 2, py: 0.8, bgcolor: TEAL_LIGHT, borderBottom: `1px solid ${TEAL_MID}` }}>
//                                         <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
//                                             {emailSuggestions.length} result{emailSuggestions.length !== 1 ? "s" : ""} found
//                                         </Typography>
//                                     </Box>
//                                     {emailSuggestions.map(u => (
//                                         <Box key={u.email ?? u.id}
//                                             onMouseDown={(e) => { e.preventDefault(); pickSuggestion(u); }}
//                                             sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.2, cursor: "pointer", borderBottom: "1px solid #f5f5f5", transition: "background .12s", "&:hover": { bgcolor: TEAL_LIGHT }, "&:last-child": { borderBottom: "none" } }}>
//                                             <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Avatar>
//                                             <Box flex={1} minWidth={0}>
//                                                 <Typography fontSize={13} fontWeight={600} noWrap>{u.name ?? u.username}</Typography>
//                                                 <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>{u.email}</Typography>
//                                             </Box>
//                                             <Chip label="+ Add" size="small"
//                                                 sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }} />
//                                         </Box>
//                                     ))}
//                                 </Paper>
//                             )}
//                             <Typography fontSize={11} color={errors.emails ? "error.main" : "text.secondary"} mt={0.4} ml={0.5}>
//                                 {errors.emails || "Search by name · or type email + Enter · Backspace removes last"}
//                             </Typography>
//                         </Box>

//                         {/* OEM + Slot */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem} onChange={(e) => set("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot} onChange={(e) => set("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Morning / Evening —</em></MenuItem>
//                                     {SLOT_OPTIONS.map(s => (
//                                         <MenuItem key={s.value} value={s.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
//                                                 {s.label}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Priority + Status */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="Priority" value={form.priority} onChange={(e) => set("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {PRIORITY_OPTIONS.map(p => (
//                                         <MenuItem key={p.value} value={p.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
//                                                 <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {["Pending", "Active", "Completed", "Cancelled"].map(s => (
//                                         <MenuItem key={s} value={s}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />
//                                                 {s}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Deadline */}
//                         <TextField label="Deadline" type="datetime-local" value={form.deadline}
//                             onChange={(e) => set("deadline", e.target.value)}
//                             error={!!errors.deadline} helperText={errors.deadline || "Select date and time to complete the task"}
//                             size="small" fullWidth InputLabelProps={{ shrink: true }} inputProps={{ min: nowLocal() }} sx={fieldSx}
//                             InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

//                         {/* Reminder */}
//                         <Box>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
//                                 <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Reminder Frequency
//                                 <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>(sends to all recipients)</Typography>
//                             </Typography>
//                             <Box display="flex" gap={1} flexWrap="wrap">
//                                 {REMINDER_OPTIONS.map(r => {
//                                     const active = form.reminder === r.value;
//                                     return (
//                                         <Box key={r.value} onClick={() => set("reminder", r.value)}
//                                             sx={{ display: "flex", alignItems: "center", gap: 0.7, px: 1.8, py: 0.9, borderRadius: "8px", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, border: `1.5px solid ${active ? TEAL : "#e0e0e0"}`, bgcolor: active ? alpha(TEAL, 0.08) : "#fafafa", color: active ? TEAL_DARK : "#555", transition: "all .17s", userSelect: "none", "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                             <span style={{ fontSize: 15 }}>{r.icon}</span>
//                                             {r.label}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>
//                             {form.reminder !== "none" && (
//                                 <Paper variant="outlined" sx={{ mt: 1.2, px: 1.8, py: 1, bgcolor: "#ede7f6", border: "1px solid #d1c4e9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
//                                     <NotificationsOutlinedIcon sx={{ fontSize: 16, color: "#4527a0" }} />
//                                     <Typography fontSize={12.5} color="#4527a0">
//                                         {form.reminder === "daily"   && "A reminder will be sent every day until the deadline."}
//                                         {form.reminder === "weekly"  && "A reminder will be sent every week on the same day."}
//                                         {form.reminder === "monthly" && "A reminder will be sent once every month."}
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </Box>

//                         {/* assigned-at banner */}
//                         <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.2, bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "8px" }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
//                             </Typography>
//                         </Paper>

//                         {/* remark */}
//                         <TextField label="Remark (optional)" value={form.remark}
//                             onChange={(e) => set("remark", e.target.value)}
//                             placeholder="Add any notes for the assignee…"
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />
//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button onClick={() => setDialogOpen(false)}
//                         sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5 }}>
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 3, boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                         {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         "&:hover fieldset":       { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// export default AssignTask;





// import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar, LinearProgress,
//     ToggleButton, ToggleButtonGroup, Drawer,
// } from "@mui/material";
// import AddIcon                    from "@mui/icons-material/Add";
// import DeleteOutlineIcon          from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon           from "@mui/icons-material/EditOutlined";
// import CloseIcon                  from "@mui/icons-material/Close";
// import RefreshIcon                from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon  from "@mui/icons-material/AssignmentIndOutlined";
// import CalendarTodayOutlinedIcon  from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon        from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon          from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon         from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon        from "@mui/icons-material/WbSunnyOutlined";
// import AccessTimeOutlinedIcon     from "@mui/icons-material/AccessTimeOutlined";
// import FlagOutlinedIcon           from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon          from "@mui/icons-material/EventOutlined";
// import NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
// import GroupAddOutlinedIcon       from "@mui/icons-material/GroupAddOutlined";
// import SearchIcon                 from "@mui/icons-material/Search";
// import FilterListIcon             from "@mui/icons-material/FilterList";
// import HourglassEmptyIcon         from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon      from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon     from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon         from "@mui/icons-material/CancelOutlined";
// import ViewKanbanOutlinedIcon     from "@mui/icons-material/ViewKanbanOutlined";
// import TableRowsOutlinedIcon      from "@mui/icons-material/TableRowsOutlined";
// import BarChartOutlinedIcon       from "@mui/icons-material/BarChartOutlined";
// import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
// import TrendingUpOutlinedIcon     from "@mui/icons-material/TrendingUpOutlined";
// import PersonSearchOutlinedIcon   from "@mui/icons-material/PersonSearchOutlined";
// import BusinessIcon               from "@mui/icons-material/Business";
// import ScheduleIcon               from "@mui/icons-material/Schedule";
// import PersonIcon                 from "@mui/icons-material/Person";
// import AssignmentIcon             from "@mui/icons-material/Assignment";
// import RepeatIcon                 from "@mui/icons-material/Repeat";
// import Breadcrumbs                from "@mui/material/Breadcrumbs";
// import Link                       from "@mui/material/Link";
// import KeyboardArrowRightIcon     from "@mui/icons-material/KeyboardArrowRight";
// import Swal                       from "sweetalert2";
// import { postData, getData, deleteData, putData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate }            from "react-router-dom";

// // ─── theme ───────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// // ─── static options ───────────────────────────────────────────────────────────
// const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

// const SLOT_OPTIONS = [
//     { value: "Morning",   label: "🌤  Morning",   color: "#f57c00" },
//     { value: "Afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "Evening",   label: "🌙  Evening",   color: "#5c6bc0" },
//     { value: "Night",     label: "🌌  Night",     color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High",     color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
// ];

// const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];
// const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];

// const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "One-Time"];

// const KANBAN_COLS = [
//     { key: "Pending",     label: "Pending",     color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
//     { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Completed",   label: "Done",        color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
//     { key: "Cancelled",   label: "Cancelled",   color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
// ];

// // ─── API paths ────────────────────────────────────────────────────────────────
// const API = {
//     CREATE:       "dailytask_review/tasks/create/",
//     GET_TASKS:    "dailytask_review/get-task/",
//     UPDATE:       (pk) => `dailytask_review/tasks/update-task/${pk}/`,
//     DELETE:       (pk) => `dailytask_review/tasks/delete-task/${pk}/`,
//     GET_USERS:    "dailytask_review/users/",
//     SEARCH_USERS: (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
//     SEARCH_TASKS: (q)  => `dailytask_review/get-task/?search=${encodeURIComponent(q)}`,
// };

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const nowISO   = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const fmtTime  = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
// const isOverdue = (iso, status) =>
//     iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

// const statusColor = (s) =>
//     ({ Pending: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
// const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());

// const getLoggedInUser = () => {
//     try {
//         const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
//         const obj = JSON.parse(raw);
//         return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
//     } catch { return { name: "", email: "" }; }
// };

// const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// const EMPTY_FORM = {
//     task: "", oem: "", slot: "", priority: "Medium",
//     owner: [],           // array of emails (recipients)
//     ownerInput: "",
//     assigned_by: "",
//     frequency: "Weekly",
//     deadline: "",
//     startdatetime: "",
//     enddatetime: "",
//     remarks: "",
//     status: "Pending",
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
//         const byStatus   = { Pending: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
//         const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
//         const byOEM      = {};
//         const bySlot     = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
//         const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;

//         tasks.forEach(t => {
//             if (byStatus[t.status]     !== undefined) byStatus[t.status]++;
//             if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
//             if (t.oem)  byOEM[t.oem]   = (byOEM[t.oem]   || 0) + 1;
//             if (t.slot) bySlot[t.slot] = (bySlot[t.slot]  || 0) + 1;
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
//                         <Typography fontSize={12} color="text.secondary">Live task stats</Typography>
//                     </Box>
//                     <IconButton size="small" onClick={onClose}
//                         sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                         <CloseIcon sx={{ fontSize: 17 }} />
//                     </IconButton>
//                 </Box>
//             </Box>
//             <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>

//                 {/* completion ring */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                         <TrendingUpOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Completion Rate
//                     </Typography>
//                     <Box display="flex" alignItems="center" gap={2}>
//                         <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
//                             <svg width="80" height="80">
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf0" strokeWidth="8" />
//                                 <circle cx="40" cy="40" r="32" fill="none" stroke={TEAL} strokeWidth="8"
//                                     strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
//                                     strokeLinecap="round" transform="rotate(-90 40 40)" />
//                             </svg>
//                             <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 16, color: TEAL }}>
//                                 {stats.completionRate}%
//                             </Typography>
//                         </Box>
//                         <Box flex={1}>
//                             <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} done</Typography>
//                             {stats.overdueCount > 0 && (
//                                 <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
//                                     label={`${stats.overdueCount} overdue`} size="small"
//                                     sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
//                             )}
//                         </Box>
//                     </Box>
//                 </Paper>

//                 {/* status */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
//                     <ProgressRow label="Pending"     value={stats.byStatus["Pending"]}     max={stats.total} color="#f57c00" />
//                     <ProgressRow label="In Progress" value={stats.byStatus["In Progress"]} max={stats.total} color="#2e7d32" />
//                     <ProgressRow label="Completed"   value={stats.byStatus["Completed"]}   max={stats.total} color="#1565c0" />
//                     <ProgressRow label="Cancelled"   value={stats.byStatus["Cancelled"]}   max={stats.total} color="#c62828" />
//                 </Paper>

//                 {/* priority */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
//                     {PRIORITY_OPTIONS.map(p => (
//                         <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
//                     ))}
//                 </Paper>

//                 {/* OEM */}
//                 {Object.keys(stats.byOEM).length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
//                         {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
//                             <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
//                         ))}
//                     </Paper>
//                 )}

//                 {/* slot */}
//                 <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                     <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
//                     <Box display="flex" gap={1} flexWrap="wrap">
//                         {SLOT_OPTIONS.map(s => {
//                             const cnt = stats.bySlot[s.value] || 0;
//                             const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
//                             return (
//                                 <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
//                                     bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
//                                     <Typography fontSize={18}>{s.label.split("  ")[0]}</Typography>
//                                     <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
//                                     <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
//                                 </Box>
//                             );
//                         })}
//                     </Box>
//                 </Paper>

//                 {/* top owners */}
//                 {stats.topOwners.length > 0 && (
//                     <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
//                         <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
//                             <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Owners
//                         </Typography>
//                         {stats.topOwners.map(([name, cnt]) => (
//                             <Box key={name} display="flex" alignItems="center" gap={1.5} mb={1.2}>
//                                 <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                     {(name[0] || "?").toUpperCase()}
//                                 </Avatar>
//                                 <Box flex={1} minWidth={0}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.3}>
//                                         <Typography fontSize={12.5} fontWeight={600} noWrap>{name}</Typography>
//                                         <Typography fontSize={12} color="text.secondary">{cnt}</Typography>
//                                     </Box>
//                                     <LinearProgress variant="determinate"
//                                         value={(cnt / (stats.topOwners[0]?.[1] || 1)) * 100}
//                                         sx={{ height: 4, borderRadius: 2, bgcolor: TEAL_LIGHT, "& .MuiLinearProgress-bar": { bgcolor: TEAL, borderRadius: 2 } }} />
//                                 </Box>
//                             </Box>
//                         ))}
//                     </Paper>
//                 )}
//             </Box>
//         </Drawer>
//     );
// };

// // ─── Kanban Card ──────────────────────────────────────────────────────────────
// const KanbanCard = ({ row, onEdit, onDelete, onStatusChange }) => {
//     const pm    = priorityMeta(row.priority);
//     const sm    = slotMeta(row.slot);
//     const overdue = isOverdue(row.deadline, row.status);
//     const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

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
//                 <Chip label={row.priority || "—"} size="small"
//                     sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
//                 <Box display="flex" gap={0.5}>
//                     {overdue && <Tooltip title="Overdue!" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} /></Tooltip>}
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
//                 {sm       && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
//                 {row.frequency && <Chip label={row.frequency} size="small" sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontSize: 10, height: 18 }} />}
//             </Box>

//             <Box display="flex" alignItems="center" justifyContent="space-between">
//                 <Box display="flex" alignItems="center" gap={0.6}>
//                     {owners.length > 0 ? (
//                         <>
//                             <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
//                                 {owners[0][0].toUpperCase()}
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
// const KanbanColumn = ({ col, cards, onEdit, onDelete, onStatusChange }) => {
//     const [dragOver, setDragOver] = useState(false);

//     const handleDrop = (e) => {
//         e.preventDefault(); setDragOver(false);
//         const cardId     = e.dataTransfer.getData("cardId");
//         const fromStatus = e.dataTransfer.getData("fromStatus");
//         if (fromStatus !== col.key) onStatusChange(cardId, col.key);
//     };

//     return (
//         <Box sx={{
//             flex: 1, minWidth: 220, maxWidth: 280,
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
//                 <KanbanCard key={row.id} row={row} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
//             ))}
//         </Box>
//     );
// };

// // ─── fieldSx ─────────────────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         "&:hover fieldset":       { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     const [tasks,      setTasks]      = useState([]);
//     const [users,      setUsers]      = useState([]);
//     const [loading,    setLoading]    = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId,     setEditId]     = useState(null);
//     const [form,       setForm]       = useState(EMPTY_FORM);
//     const [errors,     setErrors]     = useState({});
//     const [saving,     setSaving]     = useState(false);

//     const [tableSearch,    setTableSearch]    = useState("");
//     const [statusFilter,   setStatusFilter]   = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");
//     const [viewMode,       setViewMode]       = useState("table");
//     const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
//     const [myTasksOnly,    setMyTasksOnly]    = useState(false);

//     // owner suggestion state (recipients - emails)
//     const [ownerSuggestions, setOwnerSuggestions] = useState([]);
//     const [ownerSearching,   setOwnerSearching]   = useState(false);
//     const [showOwnerSuggest, setShowOwnerSuggest] = useState(false);
//     const ownerInputRef    = useRef(null);
//     const ownerSuggestRef  = useRef(null);
//     const ownerSearchTimer = useRef(null);

//     // task suggestion state (select task - searchable)
//     const [taskSuggestions, setTaskSuggestions] = useState([]);
//     const [taskSearching,   setTaskSearching]   = useState(false);
//     const [showTaskSuggest, setShowTaskSuggest] = useState(false);
//     const taskInputRef    = useRef(null);
//     const taskSuggestRef  = useRef(null);
//     const taskSearchTimer = useRef(null);

//     const loggedInUser = useMemo(() => getLoggedInUser(), []);

//     // ── fetch ──────────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const [taskRes, userRes] = await Promise.allSettled([
//                 getData(API.GET_TASKS),
//                 getData(API.GET_USERS),
//             ]);
//             const safe = (r) => r.status === "fulfilled"
//                 ? (Array.isArray(r.value) ? r.value : r.value?.data ?? [])
//                 : [];
//             setTasks(safe(taskRes));
//             setUsers(safe(userRes));
//         } catch (err) { console.error("fetchAll:", err); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     useEffect(() => {
//         const h = (e) => {
//             if (ownerSuggestRef.current && !ownerSuggestRef.current.contains(e.target)) setShowOwnerSuggest(false);
//             if (taskSuggestRef.current && !taskSuggestRef.current.contains(e.target)) setShowTaskSuggest(false);
//         };
//         document.addEventListener("mousedown", h);
//         return () => document.removeEventListener("mousedown", h);
//     }, []);

//     // ── stats ──────────────────────────────────────────────────────────────────
//     const stats = useMemo(() => ({
//         total:      tasks.length,
//         pending:    tasks.filter(t => t.status === "Pending").length,
//         inProgress: tasks.filter(t => t.status === "In Progress").length,
//         completed:  tasks.filter(t => t.status === "Completed").length,
//         cancelled:  tasks.filter(t => t.status === "Cancelled").length,
//         overdue:    tasks.filter(t => isOverdue(t.deadline, t.status)).length,
//     }), [tasks]);

//     // ── filtered rows ──────────────────────────────────────────────────────────
//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return tasks.filter((row) => {
//             const taskName    = (row.task ?? "").toLowerCase();
//             const oem         = (row.oem  ?? "").toLowerCase();
//             const ownerStr    = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
//             const assignedBy  = (row.assigned_by ?? "").toLowerCase();
//             const matchQ      = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q);
//             const matchS      = activeStatCard === "All" ? true : row.status === activeStatCard;
//             const matchD      = statusFilter   === "All" ? true : row.status === statusFilter;
//             const matchMe     = !myTasksOnly   || ownerStr.includes(loggedInUser.name.toLowerCase());
//             return matchQ && matchS && matchD && matchMe;
//         });
//     }, [tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

//     // kanban grouped
//     const kanbanCols = useMemo(() => {
//         const grouped = {};
//         KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
//         filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
//         return grouped;
//     }, [filteredRows]);

//     const handleStatClick = (label) => {
//         setActiveStatCard(label);
//         setStatusFilter(label);
//         setTableSearch("");
//     };

//     // ── kanban drag-drop ───────────────────────────────────────────────────────
//     const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
//         const row = tasks.find(t => String(t.id) === String(cardId));
//         if (!row) return;
//         setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
//         try {
//             await postData(API.UPDATE(cardId), { ...row, status: newStatus });
//         } catch (e) {
//             console.error("Status update failed:", e);
//             setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
//         }
//     }, [tasks]);

//     // ── form helpers ───────────────────────────────────────────────────────────
//     const setField = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); };

//     // ── task search (Select Task dropdown) ─────────────────────────────────────
//     const searchTasks = (query) => {
//         setField("task", query);
//         if (!query.trim()) { setTaskSuggestions([]); setShowTaskSuggest(false); return; }
//         clearTimeout(taskSearchTimer.current);
//         taskSearchTimer.current = setTimeout(async () => {
//             setTaskSearching(true);
//             try {
//                 const res  = await getData(API.SEARCH_TASKS(query));
//                 const list = Array.isArray(res) ? res : res?.data ?? [];
//                 setTaskSuggestions(list);
//                 setShowTaskSuggest(true);
//             } catch { setTaskSuggestions([]); }
//             finally { setTaskSearching(false); }
//         }, 350);
//     };

//     const pickTask = (t) => {
//         const name = t.task ?? t.name ?? t.title ?? "";
//         if (!name) return;
//         setField("task", name);
//         setTaskSuggestions([]); setShowTaskSuggest(false);
//     };

//     // owner (recipient email) search
//     const searchOwners = (query) => {
//         setField("ownerInput", query);
//         if (!query.trim()) { setOwnerSuggestions([]); setShowOwnerSuggest(false); return; }
//         clearTimeout(ownerSearchTimer.current);
//         ownerSearchTimer.current = setTimeout(async () => {
//             setOwnerSearching(true);
//             try {
//                 const res  = await getData(API.SEARCH_USERS(query));
//                 const list = Array.isArray(res) ? res : res?.data ?? [];
//                 setOwnerSuggestions(list.filter(u => !form.owner.includes(u.email ?? u.emailaddress ?? u.name ?? u.username)));
//                 setShowOwnerSuggest(true);
//             } catch { }
//             finally { setOwnerSearching(false); }
//         }, 350);
//     };

//     const pickOwner = (user) => {
//         const email = user.email ?? user.emailaddress ?? user.name ?? user.username ?? "";
//         if (!email || form.owner.includes(email)) return;
//         setForm(p => ({ ...p, owner: [...p.owner, email], ownerInput: "" }));
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         setTimeout(() => ownerInputRef.current?.focus(), 50);
//     };

//     const commitOwnerInput = () => {
//         const val = form.ownerInput.trim();
//         if (!val) return;
//         if (!isValidEmail(val)) { setErrors(e => ({ ...e, owner: "Enter a valid email address" })); return; }
//         if (form.owner.includes(val)) { setField("ownerInput", ""); return; }
//         setForm(p => ({ ...p, owner: [...p.owner, val], ownerInput: "" }));
//     };

//     const removeOwner = (email) => setForm(p => ({ ...p, owner: p.owner.filter(o => o !== email) }));

//     const validate = () => {
//         const e = {};
//         if (!form.task.trim())     e.task     = "Task name is required";
//         if (!form.oem)             e.oem      = "OEM is required";
//         if (!form.slot)            e.slot     = "Slot is required";
//         if (form.owner.length === 0) e.owner  = "Add at least one recipient email";
//         if (!form.deadline)        e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const openCreate = () => {
//         const me = getLoggedInUser();
//         setEditId(null);
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         setTaskSuggestions([]); setShowTaskSuggest(false);
//         setForm({
//             ...EMPTY_FORM,
//             assigned_by: me.name,
//             deadline: nowLocal(),
//             startdatetime: nowLocal(),
//             endddatetime: "",
//         });
//         setErrors({}); setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id);
//         setOwnerSuggestions([]); setShowOwnerSuggest(false);
//         setTaskSuggestions([]); setShowTaskSuggest(false);
//         const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
//         setForm({
//             task:          row.task          ?? "",
//             oem:           row.oem           ?? "",
//             slot:          row.slot          ?? "",
//             priority:      row.priority      ?? "Medium",
//             owner:         owners,
//             ownerInput:    "",
//             assigned_by:   row.assigned_by   ?? "",
//             frequency:     row.frequency     ?? "Weekly",
//             deadline:      row.deadline      ? row.deadline.slice(0, 10)  : "",
//             startdatetime: row.startdatetime ? row.startdatetime.slice(0, 16) : "",
//             enddatetime:   row.enddatetime   ? row.enddatetime.slice(0, 16)   : "",
//             remarks:       row.remarks       ?? "",
//             status:        row.status        ?? "Pending",
//         });
//         setErrors({}); setDialogOpen(true);
//     };

//     // ── save (create / update) ─────────────────────────────────────────────────
//     const handleSave = async () => {
//         if (form.ownerInput.trim()) commitOwnerInput();
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const payload = {
//                 task:          form.task.trim(),
//                 oem:           form.oem,
//                 slot:          form.slot,
//                 priority:      form.priority,
//                 owner:         form.owner,            // array of emails
//                 assigned_by:   form.assigned_by,
//                 frequency:     form.frequency,
//                 status:        form.status,
//                 deadline:      form.deadline ? new Date(form.deadline).toISOString().slice(0, 10) : null,
//                 startdatetime: form.startdatetime ? new Date(form.startdatetime).toISOString() : null,
//                 enddatetime:   form.enddatetime   ? new Date(form.enddatetime).toISOString()   : null,
//                 remarks:       form.remarks,
//                 assigned_at:   nowISO(),
//             };

//             if (editId) {
//                 await postData(API.UPDATE(editId), payload);
//             } else {
//                 await postData(API.CREATE, payload);
//             }

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Task Updated!" : "Task Assigned!",
//                 html: `<b>${form.task}</b> assigned to <b>${form.owner.join(", ")}</b>`,
//                 timer: 2800, showConfirmButton: false, timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave:", err);
//             Swal.fire("Error", "Failed to save task.", "error");
//         } finally { setSaving(false); }
//     };

//     // ── delete ─────────────────────────────────────────────────────────────────
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Delete Task?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
//             icon: "warning", showCancelButton: true,
//             confirmButtonColor: "#c62828", confirmButtonText: "Yes, delete",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await deleteData(API.DELETE(row.id));
//                 await fetchAll();
//             } catch { Swal.fire("Error", "Failed to delete task.", "error"); }
//         });
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//             {/* breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* ════ main card ════ */}
//             <Paper elevation={0} sx={{
//                 borderRadius: "20px", overflow: "hidden",
//                 border: "1px solid #e8ecf0", bgcolor: "#fff",
//                 boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
//             }}>

//                 {/* ── header ── */}
//                 <Box sx={{
//                     px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5",
//                     background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)`,
//                 }}>
//                     <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
//                         <Box>
//                             <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Assign Task</Typography>
//                             <Typography fontSize={13} color="text.secondary" mt={0.3}>
//                                 Manage daily task assignments · drag kanban cards to update status
//                             </Typography>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
//                             {/* my tasks */}
//                             <Chip icon={<PersonOutlineIcon sx={{ fontSize: "14px !important" }} />}
//                                 label="My Tasks" onClick={() => setMyTasksOnly(p => !p)}
//                                 variant={myTasksOnly ? "filled" : "outlined"}
//                                 sx={{
//                                     fontWeight: 600, fontSize: 12, cursor: "pointer",
//                                     bgcolor: myTasksOnly ? alpha(TEAL, 0.12) : "transparent",
//                                     color: myTasksOnly ? TEAL_DARK : "text.secondary",
//                                     borderColor: myTasksOnly ? TEAL : "#d0d5dd",
//                                     "& .MuiChip-icon": { color: myTasksOnly ? TEAL : "inherit" },
//                                 }} />

//                             {/* analytics */}
//                             <Button variant="outlined"
//                                 startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
//                                 onClick={() => setAnalyticsOpen(true)}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: "#d0d5dd", color: "#374151",
//                                     "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
//                                 Analytics
//                             </Button>

//                             {/* view toggle */}
//                             <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
//                                 sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3,
//                                     "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
//                                 <ToggleButton value="table">
//                                     <Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                                 <ToggleButton value="kanban">
//                                     <Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* refresh */}
//                             <Button variant="outlined"
//                                 startIcon={<RefreshIcon sx={{ fontSize: "17px !important",
//                                     animation: refreshing ? "spin .8s linear infinite" : "none",
//                                     "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
//                                 onClick={() => fetchAll(true)} disabled={refreshing}
//                                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>

//                             {/* assign */}
//                             <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                                 sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                                     fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5,
//                                     boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
//                                 Assign Task
//                             </Button>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {/* ── stat cards ── */}
//                 <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
//                     <Box display="flex" gap={2} flexWrap="wrap">
//                         <StatCard label="Total"       count={stats.total}      icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} active={activeStatCard === "All"}         loading={loading} onClick={() => handleStatClick("All")} />
//                         <StatCard label="Pending"     count={stats.pending}    icon={<HourglassEmptyIcon />}       color="#f57c00" bg="#fff3e0"     active={activeStatCard === "Pending"}     loading={loading} onClick={() => handleStatClick("Pending")} />
//                         <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />}   color="#2e7d32" bg="#e8f5e9"     active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
//                         <StatCard label="Completed"   count={stats.completed}  icon={<CheckCircleOutlineIcon />}  color="#1565c0" bg="#e3f2fd"     active={activeStatCard === "Completed"}   loading={loading} onClick={() => handleStatClick("Completed")} />
//                         <StatCard label="Cancelled"   count={stats.cancelled}  icon={<CancelOutlinedIcon />}      color="#c62828" bg="#fdecea"     active={activeStatCard === "Cancelled"}   loading={loading} onClick={() => handleStatClick("Cancelled")} />
//                         {stats.overdue > 0 && (
//                             <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => {}} />
//                         )}
//                     </Box>
//                 </Box>

//                 {/* ── search + filter ── */}
//                 <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
//                     <TextField size="small" placeholder="Search task, owner, OEM or assigned by…"
//                         value={tableSearch}
//                         onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                         sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                             "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

//                     <TextField select size="small" value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                         sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                             "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
//                         InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
//                         {STATUS_FILTERS.map(s => (
//                             <MenuItem key={s} value={s}>
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     {s !== "All" && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />}
//                                     {s}
//                                 </Box>
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     {(tableSearch || statusFilter !== "All" || myTasksOnly) && (
//                         <Box display="flex" alignItems="center" gap={1}>
//                             <Typography fontSize={12} color="text.secondary">
//                                 {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
//                             </Typography>
//                             <Chip label="Clear" size="small"
//                                 onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
//                                 sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ════ KANBAN ════ */}
//                 {viewMode === "kanban" && (
//                     <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
//                         {loading ? (
//                             <Box display="flex" gap={2}>
//                                 {[1,2,3,4].map(i => (
//                                     <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
//                                         {[1,2,3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
//                                     </Box>
//                                 ))}
//                             </Box>
//                         ) : (
//                             <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
//                                 {KANBAN_COLS.map(col => (
//                                     <KanbanColumn key={col.key} col={col}
//                                         cards={kanbanCols[col.key] || []}
//                                         onEdit={openEdit}
//                                         onDelete={handleDelete}
//                                         onStatusChange={handleKanbanStatusChange}
//                                     />
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
//                                         {["SN", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Frequency", "Deadline", "Time Window", "Status", "Actions"].map(h => (
//                                             <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading && Array.from({ length: 5 }).map((_, i) => (
//                                         <TableRow key={i}>
//                                             {Array.from({ length: 12 }).map((_, j) => (
//                                                 <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}

//                                     {!loading && filteredRows.length === 0 && (
//                                         <TableRow>
//                                             <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
//                                                 <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                                     <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08),
//                                                         display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                                         <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
//                                                     </Box>
//                                                     <Typography fontWeight={600} fontSize={14} color="text.secondary">
//                                                         {tableSearch || statusFilter !== "All" ? "No tasks match your filters" : "No assignments yet"}
//                                                     </Typography>
//                                                     <Typography fontSize={12.5} color="text.disabled">
//                                                         {tableSearch || statusFilter !== "All" ? "Try adjusting filters" : "Click + Assign Task to get started"}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     )}

//                                     {!loading && filteredRows.map((row, idx) => {
//                                         const pm      = priorityMeta(row.priority);
//                                         const sm      = slotMeta(row.slot);
//                                         const overdue = isOverdue(row.deadline, row.status);
//                                         const owners  = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

//                                         return (
//                                             <TableRow key={row.id ?? idx} hover sx={{
//                                                 "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
//                                                 "&:hover":             { bgcolor: alpha(TEAL, 0.025) },
//                                                 bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
//                                                 transition: "background .12s",
//                                             }}>
//                                                 {/* SN */}
//                                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

//                                                 {/* Task */}
//                                                 <TableCell>
//                                                     <Box display="flex" alignItems="center" gap={0.7}>
//                                                         {overdue && (
//                                                             <Tooltip title="Overdue" arrow>
//                                                                 <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} />
//                                                             </Tooltip>
//                                                         )}
//                                                         <Tooltip title={row.task} arrow placement="top">
//                                                             <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 160 }}>
//                                                                 {row.task}
//                                                             </Typography>
//                                                         </Tooltip>
//                                                     </Box>
//                                                     {row.remarks && (
//                                                         <Typography fontSize={11} color="text.disabled" noWrap sx={{ maxWidth: 160, fontStyle: "italic" }}>
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
//                                                                     <Avatar sx={{
//                                                                         width: 26, height: 26, fontSize: 10, fontWeight: 700,
//                                                                         bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK,
//                                                                         border: "2px solid #fff", ml: i > 0 ? -0.8 : 0,
//                                                                     }}>
//                                                                         {(o[0] || "?").toUpperCase()}
//                                                                     </Avatar>
//                                                                 </Tooltip>
//                                                             ))}
//                                                         </Box>
//                                                         <Typography fontSize={12} fontWeight={500} color="#374151" noWrap sx={{ maxWidth: 100 }}>
//                                                             {owners.slice(0, 2).join(", ")}
//                                                             {owners.length > 2 ? ` +${owners.length - 2}` : ""}
//                                                         </Typography>
//                                                     </Box>
//                                                 </TableCell>

//                                                 {/* Assigned By */}
//                                                 <TableCell>
//                                                     <Typography fontSize={12.5} color="#374151" noWrap sx={{ maxWidth: 110 }}>
//                                                         {row.assigned_by || "—"}
//                                                     </Typography>
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

//                                                 {/* Frequency */}
//                                                 <TableCell>
//                                                     {row.frequency
//                                                         ? <Chip label={row.frequency} size="small" sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontWeight: 600, fontSize: 11, border: "1px solid #d1c4e9" }} />
//                                                         : <Typography color="text.disabled" fontSize={12}>—</Typography>
//                                                     }
//                                                 </TableCell>

//                                                 {/* Deadline */}
//                                                 <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                     <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
//                                                         {fmtDate(row.deadline)}
//                                                     </Typography>
//                                                 </TableCell>

//                                                 {/* Time Window */}
//                                                 <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                                     {row.startdatetime || row.enddatetime ? (
//                                                         <Box>
//                                                             <Typography fontSize={11.5} color="text.secondary">
//                                                                 {fmtTime(row.startdatetime)} — {fmtTime(row.enddatetime)}
//                                                             </Typography>
//                                                             <Typography fontSize={10.5} color="text.disabled">
//                                                                 {fmtDate(row.startdatetime)}
//                                                             </Typography>
//                                                         </Box>
//                                                     ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                                 </TableCell>

//                                                 {/* Status */}
//                                                 <TableCell>
//                                                     <Chip label={row.status ?? "Pending"} size="small"
//                                                         sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status),
//                                                             fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
//                                                 </TableCell>

//                                                 {/* Actions */}
//                                                 <TableCell>
//                                                     <Box display="flex" gap={0.5}>
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
//                                     Showing <strong>{filteredRows.length}</strong> of <strong>{tasks.length}</strong> tasks
//                                     {stats.overdue > 0 && (
//                                         <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>
//                                             ⚠ {stats.overdue} overdue
//                                         </span>
//                                     )}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.disabled">
//                                     Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove · Kanban for drag-drop
//                                 </Typography>
//                             </Box>
//                         )}
//                     </>
//                 )}
//             </Paper>

//             {/* ════ ANALYTICS DRAWER ════ */}
//             <AnalyticsPanel tasks={tasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

//             {/* ════ DIALOG ════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth disableScrollLock
//                 PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" } }}>

//                 <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

//                 <DialogTitle sx={{ p: 0 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(TEAL, 0.12),
//                                 display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>
//                                     {editId ? "Edit Task Assignment" : "Assign New Task"}
//                                 </Typography>
//                                 <Typography fontSize={12} color="text.secondary">
//                                     {editId ? "Update task details" : "Fill in details to create a task"}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         <Tooltip title="Close" arrow>
//                             <IconButton onClick={() => setDialogOpen(false)}
//                                 sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px",
//                                     transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
//                                 <CloseIcon sx={{ fontSize: 17 }} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* Select Task — searchable, from backend */}
//                         <Box ref={taskSuggestRef} sx={{ position: "relative" }}>
//                             <TextField label="Select Task" value={form.task}
//                                 onChange={(e) => searchTasks(e.target.value)}
//                                 onFocus={() => { if (taskSuggestions.length > 0) setShowTaskSuggest(true); }}
//                                 error={!!errors.task} helperText={errors.task}
//                                 size="small" fullWidth sx={fieldSx} placeholder="Search task…"
//                                 inputRef={taskInputRef}
//                                 InputProps={{
//                                     startAdornment: (<InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>),
//                                     endAdornment: taskSearching ? (
//                                         <InputAdornment position="end">
//                                             <Box sx={{ width: 14, height: 14, border: `2px solid ${TEAL}`, borderTopColor: "transparent",
//                                                 borderRadius: "50%", animation: "spin .7s linear infinite",
//                                                 "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
//                                         </InputAdornment>
//                                     ) : null,
//                                 }} />

//                             {/* task suggestions dropdown */}
//                             {showTaskSuggest && (
//                                 <Paper elevation={6} sx={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1400,
//                                     borderRadius: "10px", overflow: "hidden", border: `1px solid ${TEAL_MID}`,
//                                     maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
//                                     {taskSuggestions.length > 0 ? (
//                                         <>
//                                             <Box sx={{ px: 2, py: 0.8, bgcolor: TEAL_LIGHT, borderBottom: `1px solid ${TEAL_MID}` }}>
//                                                 <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
//                                                     {taskSuggestions.length} task{taskSuggestions.length !== 1 ? "s" : ""} found
//                                                 </Typography>
//                                             </Box>
//                                             {taskSuggestions.map((t, i) => (
//                                                 <Box key={t.id ?? i}
//                                                     onMouseDown={(e) => { e.preventDefault(); pickTask(t); }}
//                                                     sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.2, cursor: "pointer",
//                                                         borderBottom: "1px solid #f5f5f5", transition: "background .12s",
//                                                         "&:hover": { bgcolor: TEAL_LIGHT }, "&:last-child": { borderBottom: "none" } }}>
//                                                     <TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL, flexShrink: 0 }} />
//                                                     <Typography fontSize={13} fontWeight={600} noWrap>{t.task ?? t.name ?? t.title}</Typography>
//                                                 </Box>
//                                             ))}
//                                         </>
//                                     ) : (
//                                         <Box sx={{ px: 2, py: 1.5 }}>
//                                             <Typography fontSize={12.5} color="text.disabled">No tasks found</Typography>
//                                         </Box>
//                                     )}
//                                 </Paper>
//                             )}
//                         </Box>

//                         {/* OEM + Slot */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem} onChange={(e) => setField("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot} onChange={(e) => setField("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot} size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select Slot —</em></MenuItem>
//                                     {SLOT_OPTIONS.map(s => (
//                                         <MenuItem key={s.value} value={s.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
//                                                 {s.label}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Priority + Frequency */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="Priority" value={form.priority} onChange={(e) => setField("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {PRIORITY_OPTIONS.map(p => (
//                                         <MenuItem key={p.value} value={p.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
//                                                 <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Frequency" value={form.frequency} onChange={(e) => setField("frequency", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><RepeatIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {FREQUENCY_OPTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Recipients (emails) multi-input */}
//                         <Box ref={ownerSuggestRef} sx={{ position: "relative" }}>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Recipients (emails)
//                                 <Chip label={`${form.owner.length} added`} size="small"
//                                     sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK }} />
//                             </Typography>
//                             <Paper variant="outlined"
//                                 onClick={() => ownerInputRef.current?.focus()}
//                                 sx={{
//                                     p: "8px 10px", minHeight: 46, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.7,
//                                     borderRadius: "8px", cursor: "text",
//                                     borderColor: errors.owner ? "#c62828" : showOwnerSuggest ? TEAL : "#c4c4c4",
//                                     "&:hover": { borderColor: errors.owner ? "#c62828" : TEAL },
//                                     transition: "border-color .15s",
//                                 }}>
//                                 {form.owner.map(o => (
//                                     <Chip key={o} label={o} size="small" onDelete={() => removeOwner(o)}
//                                         avatar={<Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>{o[0]?.toUpperCase()}</Avatar>}
//                                         sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 12, height: 26,
//                                             "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
//                                 ))}
//                                 <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 160, gap: 0.5 }}>
//                                     <input ref={ownerInputRef} value={form.ownerInput}
//                                         placeholder={form.owner.length === 0 ? "Search name or type email…" : "Add more…"}
//                                         onChange={(e) => searchOwners(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (["Enter", "Tab", ","].includes(e.key)) {
//                                                 e.preventDefault();
//                                                 if (ownerSuggestions.length > 0) pickOwner(ownerSuggestions[0]);
//                                                 else commitOwnerInput();
//                                                 setShowOwnerSuggest(false);
//                                             }
//                                             if (e.key === "Escape") setShowOwnerSuggest(false);
//                                             if (e.key === "Backspace" && !form.ownerInput && form.owner.length > 0)
//                                                 removeOwner(form.owner[form.owner.length - 1]);
//                                         }}
//                                         onFocus={() => { if (ownerSuggestions.length > 0) setShowOwnerSuggest(true); }}
//                                         style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", fontFamily: "inherit", color: "inherit" }} />
//                                     {ownerSearching && (
//                                         <Box sx={{ width: 14, height: 14, flexShrink: 0, border: `2px solid ${TEAL}`, borderTopColor: "transparent",
//                                             borderRadius: "50%", animation: "spin .7s linear infinite",
//                                             "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
//                                     )}
//                                 </Box>
//                             </Paper>

//                             {/* suggestions dropdown */}
//                             {showOwnerSuggest && ownerSuggestions.length > 0 && (
//                                 <Paper elevation={6} sx={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1400,
//                                     borderRadius: "10px", overflow: "hidden", border: `1px solid ${TEAL_MID}`,
//                                     maxHeight: 200, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
//                                     <Box sx={{ px: 2, py: 0.8, bgcolor: TEAL_LIGHT, borderBottom: `1px solid ${TEAL_MID}` }}>
//                                         <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
//                                             {ownerSuggestions.length} user{ownerSuggestions.length !== 1 ? "s" : ""} found
//                                         </Typography>
//                                     </Box>
//                                     {ownerSuggestions.map(u => (
//                                         <Box key={u.email ?? u.id}
//                                             onMouseDown={(e) => { e.preventDefault(); pickOwner(u); }}
//                                             sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.2, cursor: "pointer",
//                                                 borderBottom: "1px solid #f5f5f5", transition: "background .12s",
//                                                 "&:hover": { bgcolor: TEAL_LIGHT }, "&:last-child": { borderBottom: "none" } }}>
//                                             <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Avatar>
//                                             <Box flex={1} minWidth={0}>
//                                                 <Typography fontSize={13} fontWeight={600} noWrap>{u.name ?? u.username}</Typography>
//                                                 {(u.email ?? u.emailaddress) && <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>{u.email ?? u.emailaddress}</Typography>}
//                                             </Box>
//                                             <Chip label="+ Add" size="small"
//                                                 sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }} />
//                                         </Box>
//                                     ))}
//                                 </Paper>
//                             )}
//                             <Typography fontSize={11} color={errors.owner ? "error.main" : "text.secondary"} mt={0.4} ml={0.5}>
//                                 {errors.owner || "Search by name · or type email + Enter · Backspace removes last"}
//                             </Typography>
//                         </Box>

//                         {/* Assigned By + Status */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField label="Assigned By" value={form.assigned_by}
//                                     onChange={(e) => setField("assigned_by", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     helperText="Auto-filled from your session"
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
//                                     {STATUS_OPTIONS.map(s => (
//                                         <MenuItem key={s} value={s}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(s) }} />
//                                                 {s}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* Deadline */}
//                         <TextField label="Deadline" type="date" value={form.deadline}
//                             onChange={(e) => setField("deadline", e.target.value)}
//                             error={!!errors.deadline} helperText={errors.deadline || "Task completion deadline"}
//                             size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                             InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                            

//                         {/* Start + End datetime */}
//                         {/* <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField label="Start Date & Time" type="datetime-local" value={form.startdatetime}
//                                     onChange={(e) => setField("startdatetime", e.target.value)}
//                                     size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField label="End Date & Time" type="datetime-local" value={form.enddatetime}
//                                     onChange={(e) => setField("enddatetime", e.target.value)}
//                                     size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
//                                     InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
//                             </Grid>
//                         </Grid> */}

//                         {/* assigned-at banner */}
//                         <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.2,
//                             bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "8px" }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
//                             </Typography>
//                         </Paper>

//                         {/* Remarks */}
//                         <TextField label="Remarks (optional)" value={form.remarks}
//                             onChange={(e) => setField("remarks", e.target.value)}
//                             placeholder="Add any notes or instructions…"
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />
//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button onClick={() => setDialogOpen(false)}
//                         sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5 }}>
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                             fontWeight: 700, borderRadius: "8px", px: 3, boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                         {saving ? "Saving…" : editId ? "Update Task" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default AssignTask;