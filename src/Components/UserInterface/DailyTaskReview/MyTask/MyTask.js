import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
    InputAdornment, Divider, alpha, Avatar, LinearProgress,
    ToggleButton, ToggleButtonGroup, Drawer, CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";

// ─── theme ────────────────────────────────────────────────────────────────────
const TEAL = "#228b7f";
const TEAL_DARK = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

const BASE_URL = "https://commtoolapi.mcpspmis.com/";

// ─── API endpoints ─────────────────────────────────────────────────────────────
const API = {
    GET_MY_TASKS: "dailytask_review/mytask/get/",
    UPDATE: (pk) => `dailytask_review/mytask/update/${pk}/`,
};

// ─── static options ───────────────────────────────────────────────────────────
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

const MY_STATUS_OPTIONS = ["Active", "In Progress", "Completed", "Cancelled"];
const STATUS_FILTERS    = ["All", ...MY_STATUS_OPTIONS];

const KANBAN_COLS = [
    { key: "Active",      label: "Active",      color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon    sx={{ fontSize: 16 }} /> },
    { key: "In Progress", label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon  sx={{ fontSize: 16 }} /> },
    { key: "Completed",   label: "Done",        color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Cancelled",   label: "Cancelled",   color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon     sx={{ fontSize: 16 }} /> },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
const toLocalDateStr = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const todayStr = () => toLocalDateStr(new Date());

// Format as DD-MM-YYYY for display (matches screenshot style)
const fmtDateDisplay = (isoOrStr) => {
    if (!isoOrStr) return "—";
    const d = new Date(isoOrStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const isOverdue   = (iso, status) =>
    iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();
const statusColor  = (s) =>
    ({ Active: "#f57c00", "In Progress": "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());
const getFrequency = (row) => row.frequency ?? row.reminder_frequency ?? "None";

// ─── field styles ──────────────────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&:hover fieldset":       { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

const readonlySx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        bgcolor: "#f8fafc",
        "& fieldset": { borderColor: "#e8ecf0" },
    },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
};

// ─── Date Picker Banner — shows DD-MM-YYYY, no time ───────────────────────────
const DatePickerBanner = ({ value, onChange }) => (
    <Paper elevation={0} sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        px: 2, py: 1,
        borderRadius: "10px",
        border: `1.5px solid ${TEAL_MID}`,
        bgcolor: "#fff",
        minWidth: 180,
        cursor: "pointer",
    }}>
        {/* Calendar icon box */}
        <Box sx={{
            width: 38, height: 38, borderRadius: "10px", flexShrink: 0,
            background: `linear-gradient(135deg, ${TEAL} 0%, #26a69a 100%)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 10px ${alpha(TEAL, 0.35)}`,
        }}>
            <Typography sx={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1, letterSpacing: 0.8 }}>
                {new Date(value + "T00:00:00").toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
                {new Date(value + "T00:00:00").getDate()}
            </Typography>
        </Box>

        {/* Date text — DD-MM-YYYY */}
        <Box flex={1}>
            <Typography fontSize={13.5} fontWeight={700} color={TEAL_DARK} letterSpacing=".02em">
                {fmtDateDisplay(value + "T00:00:00")}
            </Typography>
            <Typography fontSize={10.5} color="text.disabled" fontWeight={500}>
                {new Date(value + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
            </Typography>
        </Box>

        {/* Hidden native date input overlaid */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
            <input
                type="date"
                value={value}
                max={todayStr()}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer", zIndex: 10,
                }}
            />
            <Box sx={{
                width: 28, height: 28, borderRadius: "8px", bgcolor: alpha(TEAL, 0.1),
                display: "flex", alignItems: "center", justifyContent: "center",
                color: TEAL, fontSize: 16, pointerEvents: "none",
            }}>
                📅
            </Box>
        </Box>
    </Paper>
);

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
        const total      = tasks.length;
        const byStatus   = { Active: 0, "In Progress": 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const bySlot     = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const overdueCount = tasks.filter(t => isOverdue(t.deadline, t.status)).length;
        tasks.forEach(t => {
            if (byStatus[t.status]     !== undefined) byStatus[t.status]++;
            if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
            const slot = t.slot ? t.slot.charAt(0).toUpperCase() + t.slot.slice(1).toLowerCase() : "";
            if (bySlot[slot] !== undefined) bySlot[slot]++;
        });
        const completionRate = total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;
        return { total, byStatus, byPriority, bySlot, completionRate, overdueCount };
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
                        <Typography fontWeight={700} fontSize={16}>My Task Analytics</Typography>
                        <Typography fontSize={12} color="text.secondary">Your personal task stats</Typography>
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
                    <ProgressRow label="Active"      value={stats.byStatus["Active"]}      max={stats.total} color="#f57c00" />
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
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
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
            </Box>
        </Drawer>
    );
};

// ─── Kanban Card ──────────────────────────────────────────────────────────────
const KanbanCard = ({ row, onEdit, onStatusChange }) => {
    const pm     = priorityMeta(row.priority);
    const sm     = slotMeta(row.slot);
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
                    <Tooltip title="Update My Task" arrow>
                        <IconButton size="small" onClick={() => onEdit(row)} sx={{ p: 0.3, color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
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
const KanbanColumn = ({ col, cards, onEdit, onStatusChange }) => {
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
                <KanbanCard key={row.id} row={row} onEdit={onEdit} onStatusChange={onStatusChange} />
            ))}
        </Box>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// UPDATE MY TASK DIALOG — only Status + Remarks editable
// ═════════════════════════════════════════════════════════════════════════════
const UpdateMyTaskDialog = ({ open, onClose, row, onSaved, userEmail }) => {
    const [status,  setStatus]  = useState("Active");
    const [remarks, setRemarks] = useState("");
    const [saving,  setSaving]  = useState(false);

    useEffect(() => {
        if (open && row) {
            setStatus(row.status   ?? "Active");
            setRemarks(row.remarks ?? "");
        }
    }, [open, row]);

    const handleSave = async () => {
        if (!row?.id) return;
        setSaving(true);
        try {
            // ✅ PUT to correct endpoint with only status, remarks, updated_by
            const res = await fetch(`${BASE_URL}${API.UPDATE(row.id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    remarks,
                    updated_by: userEmail,
                }),
            });

            if (!res.ok) throw new Error(`API error ${res.status}`);

            onClose();
            onSaved();
            Swal.fire({
                icon: "success",
                title: "Task Updated!",
                html: `Status set to <b>${status}</b>`,
                timer: 2200, showConfirmButton: false, timerProgressBar: true,
            });
        } catch (err) {
            console.error("UpdateMyTask error:", err);
            Swal.fire("Error", "Failed to update task.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!row) return null;

    const sm   = slotMeta(row.slot);
    const pm   = priorityMeta(row.priority);
    const freq = getFrequency(row);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", maxHeight: "92vh" } }}>

            <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "11px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TaskAltOutlinedIcon sx={{ color: TEAL, fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={17} lineHeight={1.2} color="#1a1a2e">Update My Task</Typography>
                            <Typography fontSize={12} color="text.secondary">Update your status and remarks</Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Close" arrow>
                        <IconButton onClick={onClose}
                            sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px", transition: "all .18s",
                                "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
                            <CloseIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ px: 3, pt: 2.5, pb: 1.5, overflowY: "auto" }}>
                <Box display="flex" flexDirection="column" gap={2.2}>

                    {/* Read-only task info */}
                    <Paper variant="outlined" sx={{
                        p: 2, borderRadius: "12px",
                        bgcolor: alpha(TEAL, 0.03),
                        border: `1px solid ${alpha(TEAL, 0.15)}`,
                    }}>
                        <Typography fontSize={11} fontWeight={600} color={TEAL} mb={1} letterSpacing=".06em" textTransform="uppercase">
                            Task Details (read-only)
                        </Typography>
                        <Typography fontSize={14} fontWeight={700} color="#1a1a2e" mb={1.2}>{row.task}</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {row.oem && <Chip label={row.oem} size="small" sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11 }} />}
                            {sm      && <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11 }} />}
                            <Chip label={row.priority || "—"} size="small" sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11 }} />
                            {freq && freq !== "None" && (
                                <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "11px !important" }} />}
                                    label={freq} size="small"
                                    sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11 }} />
                            )}
                        </Box>
                        <Box display="flex" gap={3} mt={1.2}>
                            <Box>
                                <Typography fontSize={10.5} color="text.disabled">Assigned By</Typography>
                                <Typography fontSize={12.5} fontWeight={600} color="#374151">{row.assigned_by || "—"}</Typography>
                            </Box>
                            <Box>
                                <Typography fontSize={10.5} color="text.disabled">Deadline</Typography>
                                <Typography fontSize={12.5} fontWeight={600}
                                    color={isOverdue(row.deadline, row.status) ? "#c62828" : "#374151"}>
                                    {fmtDate(row.deadline)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* ── EDITABLE: Status ── */}
                    <TextField
                        select label="Status *" value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        size="small" fullWidth sx={fieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor(status), ml: 0.5, flexShrink: 0 }} />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {MY_STATUS_OPTIONS.map(s => (
                            <MenuItem key={s} value={s}>
                                <Box display="flex" alignItems="center" gap={1.2}>
                                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: statusColor(s), flexShrink: 0 }} />
                                    <Typography fontSize={13} fontWeight={600} color={statusColor(s)}>{s}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* ── EDITABLE: Remarks ── */}
                    <TextField
                        label="Remarks / Notes"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add progress notes, blockers, or comments…"
                        size="small" fullWidth multiline rows={3} sx={fieldSx}
                        helperText="Share your progress update or any blockers"
                    />

                    {/* Quick status pick */}
                    <Box>
                        <Typography fontSize={11.5} fontWeight={600} color="text.secondary" mb={1}>Quick Status Pick</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {MY_STATUS_OPTIONS.map(s => (
                                <Chip key={s} label={s} onClick={() => setStatus(s)}
                                    variant={status === s ? "filled" : "outlined"}
                                    sx={{
                                        fontWeight: 700, fontSize: 11.5, cursor: "pointer",
                                        bgcolor:     status === s ? alpha(statusColor(s), 0.12) : "transparent",
                                        color:       statusColor(s),
                                        borderColor: status === s ? statusColor(s) : alpha(statusColor(s), 0.3),
                                        "&:hover": { bgcolor: alpha(statusColor(s), 0.1) },
                                    }} />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button onClick={onClose}
                    sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "10px", px: 2.5, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <TaskAltOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 3, boxShadow: `0 2px 10px ${alpha(TEAL, 0.4)}`, fontSize: 14 }}>
                    {saving ? "Saving…" : "Update My Task"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN: MyTask
// ═════════════════════════════════════════════════════════════════════════════
const MyTask = () => {
    const navigate = useNavigate();

    // ✅ Get user email for API calls
    const userEmail = useMemo(() => {
        const val = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail") || "";
        return val;
    }, []);

    const [tasks,      setTasks]      = useState([]);
    const [loading,    setLoading]    = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editRow,    setEditRow]    = useState(null);

    const [tableSearch,    setTableSearch]    = useState("");
    const [statusFilter,   setStatusFilter]   = useState("All");
    const [activeStatCard, setActiveStatCard] = useState("All");
    const [viewMode,       setViewMode]       = useState("table");
    const [analyticsOpen,  setAnalyticsOpen]  = useState(false);

    // ✅ Date filter — defaults to today, drives the API call
    const [selectedDate, setSelectedDate] = useState(todayStr());

    // ── fetch — POST with owner + assigned_at ──────────────────────────────────
    const fetchAll = useCallback(async (isRefresh = false) => {
        if (!userEmail) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}${API.GET_MY_TASKS}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    owner: userEmail,
                    assigned_at: selectedDate, // "YYYY-MM-DD"
                }),
            });

            const data = await res.json();
            console.log("MyTask API response:", data);

            let list = [];
            if (Array.isArray(data))          list = data;
            else if (Array.isArray(data?.data))    list = data.data;
            else if (Array.isArray(data?.results)) list = data.results;
            else if (Array.isArray(data?.tasks))   list = data.tasks;

            setTasks(list);
        } catch (err) {
            console.error("MyTask fetchAll:", err);
            Swal.fire("Error", "Failed to load tasks.", "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userEmail, selectedDate]);

    // Re-fetch on date change
    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── stats ──────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total:      tasks.length,
        active:    tasks.filter(t => t.status === "Active").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        completed:  tasks.filter(t => t.status === "Completed").length,
        cancelled:  tasks.filter(t => t.status === "Cancelled").length,
        overdue:    tasks.filter(t => isOverdue(t.deadline, t.status)).length,
    }), [tasks]);

    // ── filtered rows ──────────────────────────────────────────────────────────
    const filteredRows = useMemo(() => {
        const q = tableSearch.toLowerCase();
        return tasks.filter((row) => {
            const taskName   = (row.task       ?? "").toLowerCase();
            const oem        = (row.oem        ?? "").toLowerCase();
            const assignedBy = (row.assigned_by ?? "").toLowerCase();
            const matchQ = !q || taskName.includes(q) || oem.includes(q) || assignedBy.includes(q);
            const matchS = activeStatCard === "All" ? true : row.status === activeStatCard;
            const matchD = statusFilter   === "All" ? true : row.status === statusFilter;
            return matchQ && matchS && matchD;
        });
    }, [tasks, tableSearch, activeStatCard, statusFilter]);

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

    // ── kanban drag status change — calls PUT API directly ─────────────────────
    const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
        const row = tasks.find(t => String(t.id) === String(cardId));
        if (!row) return;
        // Optimistic update
        setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? { ...t, status: newStatus } : t));
        try {
            const res = await fetch(`${BASE_URL}${API.UPDATE(cardId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, remarks: row.remarks || "", updated_by: userEmail }),
            });
            if (!res.ok) throw new Error(`API ${res.status}`);
        } catch (e) {
            console.error("Kanban status update failed:", e);
            setTasks(prev => prev.map(t => String(t.id) === String(cardId) ? row : t));
            Swal.fire("Error", "Failed to update status.", "error");
        }
    }, [tasks, userEmail]);

    const openEdit = (row) => { setEditRow(row); setDialogOpen(true); };

    // Format display date as DD-MM-YYYY
    const displayDate = fmtDateDisplay(selectedDate + "T00:00:00");

    return (
        <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

            {/* breadcrumb */}
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>My Task</Typography>
                </Breadcrumbs>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #e8ecf0", bgcolor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

                {/* ── Header ── */}
                <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: "1px solid #f0f2f5", background: `linear-gradient(135deg, #fff 60%, ${alpha(TEAL, 0.03)} 100%)` }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>

                        <Box>
                            <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">My Tasks</Typography>
                            <Typography fontSize={13} color="text.secondary" mt={0.3}>
                                Tasks assigned to you · update your status and remarks
                            </Typography>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">

                            {/* ✅ Date picker — shows DD-MM-YYYY, no time */}
                            <DatePickerBanner
                                value={selectedDate}
                                onChange={(v) => {
                                    setSelectedDate(v);
                                    setActiveStatCard("All");
                                    setStatusFilter("All");
                                    setTableSearch("");
                                }}
                            />

                            {/* Analytics */}
                            <Button variant="outlined"
                                startIcon={<BarChartOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                                onClick={() => setAnalyticsOpen(true)}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: "#d0d5dd", color: "#374151", height: 38, "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                                Analytics
                            </Button>

                            {/* View toggle */}
                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                                sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, height: 38, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
                                <ToggleButton value="table"><Tooltip title="Table view"   arrow><TableRowsOutlinedIcon  sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                                <ToggleButton value="kanban"><Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                            </ToggleButtonGroup>

                            {/* Refresh */}
                            <Button variant="outlined"
                                startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
                                onClick={() => fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, height: 38, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </Button>
                        </Box>
                    </Box>

                    {/* User + date indicator */}
                    {userEmail && (
                        <Box mt={1.5} display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={12} color="text.secondary">Showing tasks for:</Typography>
                            <Chip label={userEmail} size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                            <Typography fontSize={12} color="text.secondary">on</Typography>
                            <Chip label={displayDate} size="small"
                                sx={{ height: 22, fontSize: 11.5, fontWeight: 600, bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontFamily: "monospace" }} />
                        </Box>
                    )}
                </Box>

                {/* ── Stat cards ── */}
                <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <StatCard label="Total"       count={stats.total}      icon={<AssignmentIndOutlinedIcon />} color={TEAL}    bg={TEAL_LIGHT} active={activeStatCard === "All"}         loading={loading} onClick={() => handleStatClick("All")} />
                        <StatCard label="Active"      count={stats.active}     icon={<HourglassEmptyIcon />}       color="#f57c00" bg="#fff3e0"    active={activeStatCard === "Active"}      loading={loading} onClick={() => handleStatClick("Active")} />
                        <StatCard label="In Progress" count={stats.inProgress} icon={<PlayCircleOutlineIcon />}   color="#2e7d32" bg="#e8f5e9"    active={activeStatCard === "In Progress"} loading={loading} onClick={() => handleStatClick("In Progress")} />
                        <StatCard label="Completed"   count={stats.completed}  icon={<CheckCircleOutlineIcon />}  color="#1565c0" bg="#e3f2fd"    active={activeStatCard === "Completed"}   loading={loading} onClick={() => handleStatClick("Completed")} />
                        <StatCard label="Cancelled"   count={stats.cancelled}  icon={<CancelOutlinedIcon />}      color="#c62828" bg="#fdecea"    active={activeStatCard === "Cancelled"}   loading={loading} onClick={() => handleStatClick("Cancelled")} />
                        {stats.overdue > 0 && (
                            <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading} onClick={() => {}} />
                        )}
                    </Box>
                </Box>

                {/* ── Search + filter ── */}
                <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField size="small" placeholder="Search task, OEM or assigned by…"
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
                                        onEdit={openEdit}
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
                                        {["SN", "Task", "Assigned By", "OEM", "Slot", "Priority", "Reminder", "Deadline", "Status", "Action"].map(h => (
                                            <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 10 }).map((_, j) => (
                                                <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                    {!loading && filteredRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                                                    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
                                                    </Box>
                                                    <Typography fontWeight={600} fontSize={14} color="text.secondary">
                                                        {tableSearch || statusFilter !== "All"
                                                            ? "No tasks match your filters"
                                                            : `No tasks assigned to you on ${displayDate}`}
                                                    </Typography>
                                                    <Typography fontSize={12.5} color="text.disabled">
                                                        {tableSearch || statusFilter !== "All"
                                                            ? "Try adjusting filters"
                                                            : "Try a different date using the date picker above"}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading && filteredRows.map((row, idx) => {
                                        const pm     = priorityMeta(row.priority);
                                        const sm     = slotMeta(row.slot);
                                        const overdue = isOverdue(row.deadline, row.status);
                                        const freq   = getFrequency(row);

                                        return (
                                            <TableRow key={row.id ?? idx} hover sx={{
                                                "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                                                "&:hover": { bgcolor: alpha(TEAL, 0.025) },
                                                bgcolor: overdue ? alpha("#e65100", 0.02) : undefined,
                                                transition: "background .12s",
                                            }}>
                                                {/* SN */}
                                                <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

                                                {/* Task */}
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

                                                {/* Assigned By */}
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.8}>
                                                        {row.assigned_by ? (
                                                            <>
                                                                <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha("#7c3aed", 0.15), color: "#5b21b6" }}>
                                                                    {(row.assigned_by[0] || "?").toUpperCase()}
                                                                </Avatar>
                                                                <Typography fontSize={12.5} color="#374151" fontWeight={500} noWrap sx={{ maxWidth: 110 }}>
                                                                    {row.assigned_by}
                                                                </Typography>
                                                            </>
                                                        ) : <Typography fontSize={12.5} color="text.disabled">—</Typography>}
                                                    </Box>
                                                </TableCell>

                                                {/* OEM */}
                                                <TableCell>
                                                    <Chip label={row.oem || "—"} size="small"
                                                        sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11, border: "1px solid #90caf9" }} />
                                                </TableCell>

                                                {/* Slot */}
                                                <TableCell>
                                                    {sm
                                                        ? <Chip label={sm.label} size="small" sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11, border: `1px solid ${alpha(sm.color, 0.3)}` }} />
                                                        : <Typography color="text.disabled" fontSize={12}>{row.slot || "—"}</Typography>
                                                    }
                                                </TableCell>

                                                {/* Priority */}
                                                <TableCell>
                                                    <Chip label={row.priority || "—"} size="small"
                                                        sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                                                </TableCell>

                                                {/* Reminder */}
                                                <TableCell>
                                                    {freq && freq !== "None" ? (
                                                        <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "12px !important" }} />}
                                                            label={freq} size="small"
                                                            sx={{ bgcolor: alpha(TEAL, 0.08), color: TEAL_DARK, fontWeight: 600, fontSize: 11, border: `1px solid ${TEAL_MID}` }} />
                                                    ) : (
                                                        <Typography color="text.disabled" fontSize={12}>None</Typography>
                                                    )}
                                                </TableCell>

                                                {/* Deadline */}
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                    <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
                                                        {fmtDate(row.deadline)}
                                                    </Typography>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <Chip label={row.status ?? "Active"} size="small"
                                                        sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status), fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
                                                </TableCell>

                                                {/* Action — Edit only */}
                                                <TableCell>
                                                    {row.status === "Completed"  ? <>   </>: <Tooltip title="Update My Task" arrow>
                                                        <IconButton size="small" onClick={() => openEdit(row)}
                                                            sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}>
                                                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                                                        </IconButton>
                                                    </Tooltip> }
                                                 
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
                                    Showing <strong>{filteredRows.length}</strong> of <strong>{tasks.length}</strong> tasks assigned to you on{" "}
                                    <span style={{ color: TEAL, fontWeight: 600 }}>{displayDate}</span>
                                    {stats.overdue > 0 && (
                                        <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>⚠ {stats.overdue} overdue</span>
                                    )}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Click ✎ to update your task status and remarks
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            <AnalyticsPanel tasks={tasks} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

            <UpdateMyTaskDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditRow(null); }}
                row={editRow}
                onSaved={fetchAll}
                userEmail={userEmail}
            />
        </Box>
    );
};

export default MyTask;