



import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
    InputAdornment, Divider, alpha, Grid, Avatar, LinearProgress,
    ToggleButton, ToggleButtonGroup, Drawer, Autocomplete, CircularProgress,
    ListItem, ListItemAvatar, ListItemText,
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
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
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
import RepeatIcon from "@mui/icons-material/Repeat";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Swal from "sweetalert2";
import { postData, getData, deleteData, putData, ServerURL } from "../../../services/FetchNodeServices";
import { useNavigate } from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";


// ─── theme ───────────────────────────────────────────────────────────────────
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

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];
const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];
const REMINDER_OPTIONS = ["None", "Daily", "Weekly", "Monthly"];

const KANBAN_COLS = [
    { key: "Pending", label: "Pending", color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
    { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Completed", label: "Done", color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Cancelled", label: "Cancelled", color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
];

const API = {
    CREATE: "dailytask_review/tasks/create/",
    UPDATE: (pk) => `dailytask_review/tasks/update-task/${pk}/`,
    DELETE: (pk) => `dailytask_review/tasks/delete-task/${pk}/`,

    // Table Data
    GET_TASKS: "dailytask_review/tasks/get/",

    // Dropdown Data
    GET_TASK_OPTIONS: "dailytask_review/get-task/",

    GET_USERS: "dailytask_review/users/",
    SEARCH_USERS: (q) =>
        `dailytask_review/users/?search=${encodeURIComponent(q)}`,
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const nowISO = () => new Date().toISOString();
const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
const isOverdue = (iso, status) =>
    iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

const statusColor = (s) =>
    ({ Pending: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const slotMeta = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());

const getLoggedInUser = () => {
    try {
        const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
        const obj = JSON.parse(raw);
        return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
    } catch { return { name: "", email: "" }; }
};

const EMPTY_FORM = {
    task: null,   // selected task object { id, task, ... } or null
    taskInput: "",
    assignee: "",
    recipients: [],     // array of { name, email } objects
    recipientInput: "",
    oem: "",
    slot: "",
    priority: "Medium",
    status: "Pending",
    deadline: "",
    reminderFrequency: "None",
    remarks: "",
};

// ─── fieldSx ─────────────────────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&:hover fieldset": { borderColor: TEAL },
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
        const byStatus = { Pending: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const byOEM = {};
        const bySlot = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;

        tasks.forEach(t => {
            if (byStatus[t.status] !== undefined) byStatus[t.status]++;
            if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
            if (t.oem) byOEM[t.oem] = (byOEM[t.oem] || 0) + 1;
            if (t.slot) bySlot[t.slot] = (bySlot[t.slot] || 0) + 1;
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
                    <ProgressRow label="Pending" value={stats.byStatus["Pending"]} max={stats.total} color="#f57c00" />
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
                                <Box key={s.value} sx={{
                                    flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
                                    bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center"
                                }}>
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
    const pm = priorityMeta(row.priority);
    const sm = slotMeta(row.slot);
    const overdue = isOverdue(row.deadline, row.status);
    const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

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
                {sm && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }} />}
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
        const cardId = e.dataTransfer.getData("cardId");
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
const AssignTaskDialog = ({ open, onClose, editId, initialForm, onSaved, options }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const userName = getDecreyptedData("userID")

    // task search
    const [taskOptions, setTaskOptions] = useState([]);
    const [taskLoading, setTaskLoading] = useState(false);
    const taskSearchTimer = useRef(null);

    // recipient search
    const [recipientOptions, setRecipientOptions] = useState([]);
    const [recipientLoading, setRecipientLoading] = useState(false);
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
                    assignee: userName,
                    deadline: nowLocal(),
                });
            }
            setErrors({});
            setRecipientInputVal("");
            setTaskOptions(options || []);
        }
    }, [open, initialForm, options]);

    const setField = (field, value) => {
        setForm(p => ({ ...p, [field]: value }));
        setErrors(e => ({ ...e, [field]: "" }));
    };

    // ── task search ───────────────────────────────────────────────────────────
    const searchTasks = (query) => {
        setField("taskInput", query);
        clearTimeout(taskSearchTimer.current);
        if (!query.trim()) { setTaskOptions(options || []); return; }
        taskSearchTimer.current = setTimeout(async () => {
            setTaskLoading(true);
            try {
                const res = await getData(API.SEARCH_TASKS(query));
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
                const res = await getData(API.SEARCH_USERS(query));
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
        const name = user.name ?? user.username ?? email;
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
        if (!form.task) e.task = "Please select a task";
        if (form.recipients.length === 0) e.recipients = "Add at least one recipient";
        if (!form.deadline) e.deadline = "Deadline is required";
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
                task: taskName,
                // task_id: typeof form.task === "object" ? form.task?.id : undefined,
                assignee: form.assignee,
                owner: form.recipients.map(r => r.name),
                recipient_emails: form.recipients.map(r => r.email),
                oem: form.oem,
                slot: form.slot,
                priority: form.priority,
                status: form.status,
                deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
                reminder_frequency: form.reminderFrequency,
                remarks: form.remarks,
                assigned_at: nowISO(),
                // updated_by: userName,

            };
            const payloadUpdate = {
                task: taskName,
                task_id: typeof form.task === "object" ? form.task?.id : undefined,
                assignee: form.assignee,
                owner: form.recipients.map(r => r.name),
                recipient_emails: form.recipients.map(r => r.email),
                oem: form.oem,
                slot: form.slot,
                priority: form.priority,
                status: form.status,
                deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
                reminder_frequency: form.reminderFrequency,
                remarks: form.remarks,
                assigned_at: nowISO(),
                updated_by: userName,

            };

            if (editId) {
                await postData(API.UPDATE(editId), payloadUpdate);
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
            // console.error("handleSave:", err);
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
                                    None: "🔕",
                                    Daily: "📅",
                                    Weekly: "🗓️",
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

    const [tasks, setTasks] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]); // task-name options from the other page (GET_TASK_OPTIONS)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const [tableSearch, setTableSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [activeStatCard, setActiveStatCard] = useState("All");
    const [viewMode, setViewMode] = useState("table");
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [myTasksOnly, setMyTasksOnly] = useState(false);

    const loggedInUser = useMemo(() => getLoggedInUser(), []);
    const userName = getDecreyptedData("userID")

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);

        try {
            const formData = new FormData();
            formData.append("userID", userName);
            const [taskRes, userRes, taskOptionRes] =
                await Promise.allSettled([
                    getData(API.GET_TASKS),
                    getData(API.GET_USERS),
                    postData(API.GET_TASK_OPTIONS, formData),
                ]);

            const safe = (r) =>
                r.status === "fulfilled"
                    ? Array.isArray(r.value)
                        ? r.value
                        : r.value?.data ?? []
                    : [];

            setTasks(safe(taskRes));
            setUsers(safe(userRes));
            setTaskOptions(safe(taskOptionRes));
        } catch (err) {
            console.error("fetchAll:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);
    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── stats ──────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total: tasks.length,
        pending: tasks.filter(t => t.status === "Pending").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        completed: tasks.filter(t => t.status === "Completed").length,
        cancelled: tasks.filter(t => t.status === "Cancelled").length,
        overdue: tasks.filter(t => isOverdue(t.deadline, t.status)).length,
    }), [tasks]);

    // ── filtered rows ──────────────────────────────────────────────────────────
    const filteredRows = useMemo(() => {
        const q = tableSearch.toLowerCase();
        return tasks.filter((row) => {
            const taskName = (row.task ?? "").toLowerCase();
            const oem = (row.oem ?? "").toLowerCase();
            const ownerStr = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
            const assignedBy = (row.assigned_by ?? row.assignee ?? "").toLowerCase();
            const matchQ = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q);
            const matchS = activeStatCard === "All" ? true : row.status === activeStatCard;
            const matchD = statusFilter === "All" ? true : row.status === statusFilter;
            const matchMe = !myTasksOnly || ownerStr.includes(loggedInUser.name.toLowerCase());
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
            task: row.task ? { id: row.id, task: row.task } : null,
            taskInput: row.task ?? "",
            assignee: row.assigned_by ?? row.assignee ?? "",
            recipients,
            recipientInput: "",
            oem: row.oem ?? "",
            slot: row.slot ?? "",
            priority: row.priority ?? "Medium",
            status: row.status ?? "Pending",
            deadline: row.deadline ? new Date(row.deadline).toISOString().slice(0, 16) : "",
            reminderFrequency: row.reminder_frequency ?? row.reminderFrequency ?? "None",
            remarks: row.remarks ?? "",
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
                        <StatCard label="Total" count={stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} active={activeStatCard === "All"} loading={loading} onClick={() => handleStatClick("All")} />
                        <StatCard label="Pending" count={stats.pending} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0" active={activeStatCard === "Pending"} loading={loading} onClick={() => handleStatClick("Pending")} />
                        <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9" active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
                        <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd" active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
                        <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea" active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
                        {stats.overdue > 0 && (
                            <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => { }} />
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
                                {[1, 2, 3, 4].map(i => (
                                    <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
                                        {[1, 2, 3].map(j => <Skeleton key={j} height={130} sx={{ borderRadius: "12px", mb: 1 }} />)}
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
                                                    <Box sx={{
                                                        width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08),
                                                        display: "flex", alignItems: "center", justifyContent: "center"
                                                    }}>
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
                                        const pm = priorityMeta(row.priority);
                                        const sm = slotMeta(row.slot);
                                        const overdue = isOverdue(row.deadline, row.status);
                                        const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

                                        return (
                                            <TableRow key={row.id ?? idx} hover sx={{
                                                "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                                                "&:hover": { bgcolor: alpha(TEAL, 0.025) },
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
                                                        sx={{
                                                            bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status),
                                                            fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}`
                                                        }} />
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
               options={taskOptions}
            />
        </Box>
    );
};

export default AssignTask;

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Chip, Tooltip, Table, TableBody,
//     TableCell, TableContainer, TableHead, TableRow, Skeleton, TextField,
//     MenuItem, InputAdornment, Avatar, ToggleButton, ToggleButtonGroup, alpha,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
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
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import Swal from "sweetalert2";

// import { getData, deleteData, postData } from "../../../services/FetchNodeServices";
// import { useNavigate } from "react-router-dom";

// // ── shared constants & helpers ────────────────────────────────────────────────
// import { TEAL, TEAL_LIGHT, TEAL_MID, TEAL_DARK, KANBAN_COLS, STATUS_FILTERS } from "./Constants";
// import {
//     isOverdue, statusColor, priorityMeta, slotMeta,
//     fmtDate, getLoggedInUser,
// } from "./Helpers";
// import API from "./Api";

// // ── sub-components ────────────────────────────────────────────────────────────
// import StatCard from "./Components/StatCard";

// import AnalyticsPanel from "./Components/AnalyticsPanel";
// import KanbanColumn from "./Components/KanbanColumn";
// import AssignTaskDialog from "./Components/AssignTaskDialog";

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     // ── data state ────────────────────────────────────────────────────────────
//     const [tasks, setTasks] = useState([]);
//     const [taskOptions, setTaskOptions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     // ── dialog state ──────────────────────────────────────────────────────────
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [editForm, setEditForm] = useState(null);

//     // ── UI state ──────────────────────────────────────────────────────────────
//     const [tableSearch, setTableSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");
//     const [viewMode, setViewMode] = useState("table");
//     const [analyticsOpen, setAnalyticsOpen] = useState(false);
//     const [myTasksOnly, setMyTasksOnly] = useState(false);

//     const loggedInUser = useMemo(() => getLoggedInUser(), []);

//     // ── fetch all data ────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         try {
//             const [taskRes, , taskOptionRes] = await Promise.allSettled([
//                 getData(API.GET_TASKS),
//                 getData(API.GET_USERS),
//                 getData(API.GET_TASK_OPTIONS),
//             ]);

//             const safe = (r) =>
//                 r.status === "fulfilled"
//                     ? Array.isArray(r.value) ? r.value : r.value?.data ?? []
//                     : [];

//             setTasks(safe(taskRes));
//             setTaskOptions(safe(taskOptionRes));
//         } catch (err) {
//             console.error("fetchAll:", err);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // ── stats ─────────────────────────────────────────────────────────────────
//     const stats = useMemo(() => ({
//         total: tasks.length,
//         pending: tasks.filter(t => t.status === "Pending").length,
//         inProgress: tasks.filter(t => t.status === "In Progress").length,
//         completed: tasks.filter(t => t.status === "Completed").length,
//         cancelled: tasks.filter(t => t.status === "Cancelled").length,
//         overdue: tasks.filter(t => isOverdue(t.deadline, t.status)).length,
//     }), [tasks]);

//     // ── filtered rows ─────────────────────────────────────────────────────────
//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return tasks.filter((row) => {
//             const taskName = (row.task ?? "").toLowerCase();
//             const oem = (row.oem ?? "").toLowerCase();
//             const ownerStr = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
//             const assignedBy = (row.assigned_by ?? row.assignee ?? "").toLowerCase();
//             const matchQ = !q || taskName.includes(q) || oem.includes(q) || ownerStr.includes(q) || assignedBy.includes(q);
//             const matchS = activeStatCard === "All" || row.status === activeStatCard;
//             const matchD = statusFilter === "All" || row.status === statusFilter;
//             const matchMe = !myTasksOnly || ownerStr.includes(loggedInUser.name.toLowerCase());
//             return matchQ && matchS && matchD && matchMe;
//         });
//     }, [tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

//     // ── kanban grouped ────────────────────────────────────────────────────────
//     // const kanbanCols = useMemo(() => {
//     //     const grouped = {};
//     //     KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
//     //     filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
//     //     return grouped;
//     // }, [filteredRows]);

//     const kanbanCols = useMemo(() => {
//         const grouped = {};

//         KANBAN_COLS.forEach(c => {
//             grouped[c.key] = [];
//         });

//         if (!Array.isArray(filteredRows)) {
//             return grouped;
//         }

//         filteredRows.forEach(r => {
//             if (grouped[r.status]) {
//                 grouped[r.status].push(r);
//             }
//         });

//         return grouped;
//     }, [filteredRows]);

//     const handleStatClick = (label) => {
//         setActiveStatCard(label);
//         setStatusFilter(label);
//         setTableSearch("");
//     };

//     // ── kanban drag-drop status update ────────────────────────────────────────
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

//     // ── dialog helpers ────────────────────────────────────────────────────────
//     const openCreate = () => {
//         setEditId(null);
//         setEditForm(null);
//         setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id);
//         const recipients = Array.isArray(row.recipient_emails)
//             ? row.recipient_emails.map((email, i) => ({
//                 email,
//                 name: Array.isArray(row.owner) ? (row.owner[i] ?? email) : email,
//             }))
//             : (Array.isArray(row.owner) ? row.owner.map(n => ({ name: n, email: n })) : []);

//         setEditForm({
//             task: row.task ? { id: row.id, task: row.task } : null,
//             taskInput: row.task ?? "",
//             assignee: row.assigned_by ?? row.assignee ?? "",
//             recipients,
//             recipientInput: "",
//             oem: row.oem ?? "",
//             slot: row.slot ?? "",
//             priority: row.priority ?? "Medium",
//             status: row.status ?? "Pending",
//             deadline: row.deadline ? new Date(row.deadline).toISOString().slice(0, 16) : "",
//             reminderFrequency: row.reminder_frequency ?? row.reminderFrequency ?? "None",
//             remarks: row.remarks ?? "",
//         });
//         setDialogOpen(true);
//     };

//     // ── delete ────────────────────────────────────────────────────────────────
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Delete Task?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.task}</b>?</span>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#c62828",
//             confirmButtonText: "Yes, delete",
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

//             {/* ── breadcrumb ── */}
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
//                             <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
//                                 Assign Task
//                             </Typography>
//                             <Typography fontSize={13} color="text.secondary" mt={0.3}>
//                                 Manage daily task assignments · drag kanban cards to update status
//                             </Typography>
//                         </Box>

//                         <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
//                             {/* My Tasks toggle */}
//                             <Chip
//                                 icon={<PersonOutlineIcon sx={{ fontSize: "14px !important" }} />}
//                                 label="My Tasks"
//                                 onClick={() => setMyTasksOnly(p => !p)}
//                                 variant={myTasksOnly ? "filled" : "outlined"}
//                                 sx={{
//                                     fontWeight: 600, fontSize: 12, cursor: "pointer",
//                                     bgcolor: myTasksOnly ? alpha(TEAL, 0.12) : "transparent",
//                                     color: myTasksOnly ? TEAL_DARK : "text.secondary",
//                                     borderColor: myTasksOnly ? TEAL : "#d0d5dd",
//                                     "& .MuiChip-icon": { color: myTasksOnly ? TEAL : "inherit" },
//                                 }}
//                             />

//                             {/* Analytics */}
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
//                                 onClick={() => setAnalyticsOpen(true)}
//                                 sx={{
//                                     textTransform: "none", fontWeight: 600, borderRadius: "10px",
//                                     fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: "#d0d5dd", color: "#374151",
//                                     "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) },
//                                 }}
//                             >
//                                 Analytics
//                             </Button>

//                             {/* View toggle */}
//                             <ToggleButtonGroup
//                                 value={viewMode} exclusive
//                                 onChange={(_, v) => v && setViewMode(v)}
//                                 size="small"
//                                 sx={{
//                                     bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3,
//                                     "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 },
//                                 }}
//                             >
//                                 <ToggleButton value="table">
//                                     <Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                                 <ToggleButton value="kanban">
//                                     <Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
//                                 </ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* Refresh */}
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<RefreshIcon sx={{
//                                     fontSize: "17px !important",
//                                     animation: refreshing ? "spin .8s linear infinite" : "none",
//                                     "@keyframes spin": { to: { transform: "rotate(360deg)" } },
//                                 }} />}
//                                 onClick={() => fetchAll(true)}
//                                 disabled={refreshing}
//                                 sx={{
//                                     textTransform: "none", fontWeight: 600, borderRadius: "10px",
//                                     fontSize: 13, px: 2, py: 0.9,
//                                     borderColor: TEAL_MID, color: TEAL,
//                                     "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
//                                 }}
//                             >
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>

//                             {/* Assign */}
//                             <Button
//                                 variant="contained"
//                                 startIcon={<AddIcon />}
//                                 onClick={openCreate}
//                                 sx={{
//                                     bgcolor: TEAL, "&:hover": { bgcolor: "#004d40" },
//                                     textTransform: "none", fontWeight: 700,
//                                     borderRadius: "10px", px: 2.5, fontSize: 13.5,
//                                     boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}`,
//                                 }}
//                             >
//                                 Assign Task
//                             </Button>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {/* ── stat cards ── */}
//                 <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
//                     <Box display="flex" gap={2} flexWrap="wrap">
//                         <StatCard label="Total" count={stats.total} icon={<AssignmentIndOutlinedIcon />} color={TEAL} bg={TEAL_LIGHT} active={activeStatCard === "All"} loading={loading} onClick={() => handleStatClick("All")} />
//                         <StatCard label="Pending" count={stats.pending} icon={<HourglassEmptyIcon />} color="#f57c00" bg="#fff3e0" active={activeStatCard === "Pending"} loading={loading} onClick={() => handleStatClick("Pending")} />
//                         <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />} color="#2e7d32" bg="#e8f5e9" active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
//                         <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />} color="#1565c0" bg="#e3f2fd" active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
//                         <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />} color="#c62828" bg="#fdecea" active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
//                         {stats.overdue > 0 && (
//                             <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => { }} />
//                         )}
//                     </Box>
//                 </Box>

//                 {/* ── search + filter bar ── */}
//                 <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
//                     <TextField
//                         size="small"
//                         placeholder="Search task, owner, OEM or assigned by…"
//                         value={tableSearch}
//                         onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                         sx={{
//                             flex: 1, minWidth: 240,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                                 "&:hover fieldset": { borderColor: TEAL },
//                                 "&.Mui-focused fieldset": { borderColor: TEAL },
//                             },
//                         }}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                     <TextField
//                         select size="small" value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                         sx={{
//                             minWidth: 180,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5,
//                                 "&:hover fieldset": { borderColor: TEAL },
//                                 "&.Mui-focused fieldset": { borderColor: TEAL },
//                             },
//                         }}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     >
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
//                             <Chip
//                                 label="Clear" size="small"
//                                 onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
//                                 sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }}
//                             />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ════ KANBAN VIEW ════ */}
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
//                                     <KanbanColumn
//                                         key={col.key}
//                                         col={col}
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

//                 {/* ════ TABLE VIEW ════ */}
//                 {viewMode === "table" && (
//                     <>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow sx={{ bgcolor: TEAL }}>
//                                         {["SN", "Task", "Owner(s)", "Assigned By", "OEM", "Slot", "Priority", "Reminder", "Deadline", "Status", "Actions"].map(h => (
//                                             <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>
//                                                 {h}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {/* skeleton rows while loading */}
//                                     {loading && Array.from({ length: 5 }).map((_, i) => (
//                                         <TableRow key={i}>
//                                             {Array.from({ length: 11 }).map((_, j) => (
//                                                 <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}

//                                     {/* empty state */}
//                                     {!loading && filteredRows.length === 0 && (
//                                         <TableRow>
//                                             <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
//                                                 <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                                     <Box sx={{
//                                                         width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08),
//                                                         display: "flex", alignItems: "center", justifyContent: "center",
//                                                     }}>
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

//                                     {/* data rows */}
//                                     {!loading && filteredRows.map((row, idx) => {
//                                         const pm = priorityMeta(row.priority);
//                                         const sm = slotMeta(row.slot);
//                                         const overdue = isOverdue(row.deadline, row.status);
//                                         const owners = Array.isArray(row.owner)
//                                             ? row.owner
//                                             : row.owner ? [row.owner] : [];

//                                         return (
//                                             <TableRow key={row.id ?? idx} hover sx={{
//                                                 "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
//                                                 "&:hover": { bgcolor: alpha(TEAL, 0.025) },
//                                                 bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
//                                                 transition: "background .12s",
//                                             }}>
//                                                 {/* SN */}
//                                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>
//                                                     {idx + 1}
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
//                                                         {row.assigned_by ?? row.assignee ?? "—"}
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

//                                                 {/* Reminder */}
//                                                 <TableCell>
//                                                     {(row.reminder_frequency && row.reminder_frequency !== "None") ? (
//                                                         <Chip
//                                                             icon={<NotificationsOutlinedIcon sx={{ fontSize: "12px !important" }} />}
//                                                             label={row.reminder_frequency} size="small"
//                                                             sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11, border: `1px solid ${TEAL_MID}` }}
//                                                         />
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
//                                                     <Chip label={row.status ?? "Pending"} size="small"
//                                                         sx={{
//                                                             bgcolor: alpha(statusColor(row.status), 0.1),
//                                                             color: statusColor(row.status),
//                                                             fontWeight: 700, fontSize: 11,
//                                                             border: `1px solid ${alpha(statusColor(row.status), 0.25)}`,
//                                                         }} />
//                                                 </TableCell>

//                                                 {/* Actions */}
//                                                 <TableCell>
//                                                     <Box display="flex" gap={0.5}>
//                                                         <Tooltip title="Edit" arrow>
//                                                             <span>
//                                                                 <EditOutlinedIcon
//                                                                     sx={{ fontSize: 17, cursor: "pointer", color: TEAL }}
//                                                                     onClick={() => openEdit(row)}
//                                                                 />
//                                                             </span>
//                                                         </Tooltip>
//                                                         <Tooltip title="Delete" arrow>
//                                                             <span>
//                                                                 <DeleteOutlineIcon
//                                                                     sx={{ fontSize: 17, cursor: "pointer", color: "#c62828" }}
//                                                                     onClick={() => handleDelete(row)}
//                                                                 />
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

//                         {/* footer */}
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
//                                     Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove
//                                 </Typography>
//                             </Box>
//                         )}
//                     </>
//                 )}
//             </Paper>

//             {/* ════ ANALYTICS DRAWER ════ */}
//             <AnalyticsPanel
//                 tasks={tasks}
//                 open={analyticsOpen}
//                 onClose={() => setAnalyticsOpen(false)}
//             />

//             {/* ════ ASSIGN/EDIT DIALOG ════ */}
//             <AssignTaskDialog
//                 open={dialogOpen}
//                 onClose={() => setDialogOpen(false)}
//                 editId={editId}
//                 initialForm={editForm}
//                 onSaved={fetchAll}
//                 options={taskOptions}
//             />
//         </Box>
//     );
// };

// export default AssignTask;
