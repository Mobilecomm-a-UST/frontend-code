


import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Skeleton,
    InputAdornment, Divider, alpha, Grid, Avatar, Autocomplete, CircularProgress,
    Switch, FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import InboxIcon from "@mui/icons-material/Inbox";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getDecreyptedData } from "../../../utils/localstorage";

// ─── theme (same palette as AssignTask.jsx) ────────────────────────────────
const TEAL = "#228b7f";
const TEAL_DARK = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

// ─── static options ─────────────────────────────────────────────────────────
const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

const PRIORITY_OPTIONS = [
    { value: "Critical", color: "#c62828", bg: "#fdecea" },
    { value: "High", color: "#e65100", bg: "#fff3e0" },
    { value: "Medium", color: "#f57c00", bg: "#fff8e1" },
    { value: "Low", color: "#2e7d32", bg: "#e8f5e9" },
];

const STATUS_OPTIONS = ["Active", "Inactive", "Draft", "Paused"];

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_WEEK_OPTIONS = ["FIRST", "SECOND", "THIRD", "FOURTH", "LAST"];

// Recurrence type chips — maps directly to recurrence_rule.type values
const RECURRENCE_TYPES = [
    { value: "once", label: "Once", icon: "➖" },
    { value: "daily", label: "Daily", icon: "📅" },
    { value: "weekly", label: "Weekly", icon: "🗓️" },
    { value: "monthly", label: "Monthly", icon: "📆" },
    { value: "custom", label: "Custom", icon: "🧩" },
];

// Deadline rule types — maps directly to deadline_rule.type values
const DEADLINE_TYPES = [
    { value: "same_day", label: "Same Day" },
    { value: "after_hours", label: "After Hours" },
    { value: "after_days", label: "After Days" },
    { value: "after_weeks", label: "After Weeks" },
    { value: "fixed_date", label: "Fixed Date" },
];

const BASE_URL = "https://commtoolapi.mcpspmis.com/";

// Matches the Task Template API routes provided
const API = {
    CREATE: "dailytask_review/task-template/create/",
    GET_TEMPLATES: "dailytask_review/task-template/get/",
    UPDATE: (pk) => `dailytask_review/task-template/update/${pk}/`,
    DELETE: (pk) => `dailytask_review/task-template/delete/${pk}/`,
    STATUS: (pk) => `dailytask_review/task-template/status/${pk}/`,
    GET_EMAIL_OPTIONS: "dailytask_review/reporting-email-hierarchy/get/",
    GET_TASK_OPTIONS: "dailytask_review/get-task/",
};

// ─── helpers ──────────────────────────────────────────────────────────────
const toLocalDateStr = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const todayStr = () => toLocalDateStr(new Date());

const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };

const fmtDate = (dateStr) =>
    dateStr
        ? new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "—";

const fmtTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hr12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hr12}:${m} ${ampm}`;
};

// ── recurrence_rule <-> form ────────────────────────────────────────────
const buildRecurrenceRule = (form) => {
    const times = form.times.length ? form.times : ["09:00"];
    switch (form.recurrenceType) {
        case "daily":
            return { type: "daily", interval: Number(form.recurrenceInterval) || 1, times };
        case "weekly":
            return { type: "weekly", interval: Number(form.recurrenceInterval) || 1, days: form.recurrenceDays, times };
        case "monthly":
            return form.monthlyMode === "date"
                ? { type: "monthly", interval: Number(form.recurrenceInterval) || 1, dates: form.monthlyDates.map(Number), times }
                : { type: "monthly", interval: Number(form.recurrenceInterval) || 1, week: form.monthlyWeek, day: form.monthlyDay, times };
        case "custom":
            return { type: "custom", days: form.recurrenceDays, times };
        case "once":
        default:
            return { type: "once", times };
    }
};

const parseRecurrenceRule = (rule) => {
    if (!rule) return { recurrenceType: "once", times: ["09:00"] };
    const times = rule.times && rule.times.length ? rule.times : ["09:00"];
    switch (rule.type) {
        case "daily":
            return { recurrenceType: "daily", recurrenceInterval: rule.interval ?? 1, times };
        case "weekly":
            return { recurrenceType: "weekly", recurrenceInterval: rule.interval ?? 1, recurrenceDays: rule.days ?? [], times };
        case "monthly":
            return rule.dates
                ? { recurrenceType: "monthly", recurrenceInterval: rule.interval ?? 1, monthlyMode: "date", monthlyDates: rule.dates ?? [], times }
                : { recurrenceType: "monthly", recurrenceInterval: rule.interval ?? 1, monthlyMode: "weekday", monthlyWeek: rule.week ?? "FIRST", monthlyDay: rule.day ?? "MON", times };
        case "custom":
            return { recurrenceType: "custom", recurrenceDays: rule.days ?? [], times };
        case "once":
        default:
            return { recurrenceType: "once", times };
    }
};

const recurrenceSummary = (rule) => {
    if (!rule) return "No schedule";
    const timesStr = (rule.times || []).map(fmtTime).join(", ");
    switch (rule.type) {
        case "once": return `Once · ${timesStr}`;
        case "daily": return rule.interval > 1 ? `Every ${rule.interval} days · ${timesStr}` : `Daily · ${timesStr}`;
        case "weekly": {
            const days = (rule.days || []).join(", ");
            return rule.interval > 1 ? `Every ${rule.interval} weeks on ${days} · ${timesStr}` : `Weekly on ${days} · ${timesStr}`;
        }
        case "monthly": {
            if (rule.dates) return `Monthly on ${rule.dates.join(", ")} · ${timesStr}`;
            if (rule.week && rule.day) return `Monthly, ${rule.week} ${rule.day} · ${timesStr}`;
            return `Monthly · ${timesStr}`;
        }
        case "custom": return `Custom on ${(rule.days || []).join(", ")} · ${timesStr}`;
        default: return timesStr || "—";
    }
};

// ── deadline_rule <-> form ──────────────────────────────────────────────
const buildDeadlineRule = (form) => {
    switch (form.deadlineType) {
        case "after_hours": return { type: "after_hours", hours: Number(form.deadlineHours) || 0 };
        case "after_days": return { type: "after_days", days: Number(form.deadlineDays) || 0, time: form.deadlineTime };
        case "after_weeks": return { type: "after_weeks", weeks: Number(form.deadlineWeeks) || 0, time: form.deadlineTime };
        case "fixed_date": return { type: "fixed_date", date: form.deadlineDate, time: form.deadlineTime };
        case "same_day":
        default:
            return { type: "same_day", time: form.deadlineTime };
    }
};

const parseDeadlineRule = (rule) => {
    if (!rule) return { deadlineType: "same_day", deadlineTime: "18:00" };
    switch (rule.type) {
        case "after_hours": return { deadlineType: "after_hours", deadlineHours: rule.hours ?? 6 };
        case "after_days": return { deadlineType: "after_days", deadlineDays: rule.days ?? 3, deadlineTime: rule.time ?? "18:00" };
        case "after_weeks": return { deadlineType: "after_weeks", deadlineWeeks: rule.weeks ?? 2, deadlineTime: rule.time ?? "18:00" };
        case "fixed_date": return { deadlineType: "fixed_date", deadlineDate: rule.date ?? "", deadlineTime: rule.time ?? "18:00" };
        case "same_day":
        default:
            return { deadlineType: "same_day", deadlineTime: rule.time ?? "18:00" };
    }
};

const deadlineSummary = (rule) => {
    if (!rule) return "—";
    switch (rule.type) {
        case "same_day": return `Due same day at ${fmtTime(rule.time)}`;
        case "after_hours": return `Due ${rule.hours}h after assignment`;
        case "after_days": return `Due ${rule.days}d later at ${fmtTime(rule.time)}`;
        case "after_weeks": return `Due ${rule.weeks}w later at ${fmtTime(rule.time)}`;
        case "fixed_date": return `Due by ${fmtDate(rule.date)}, ${fmtTime(rule.time)}`;
        default: return "—";
    }
};

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
    templateName: "",
    task: "",
    owners: [],
    oem: "",
    priority: "Medium",
    status: "Active",
    remarks: "",
    startDate: todayStr(),
    endDate: "",
    isActive: true,

    recurrenceType: "once",
    recurrenceInterval: 1,
    recurrenceDays: [],
    monthlyMode: "date",
    monthlyDates: [],
    monthlyWeek: "FIRST",
    monthlyDay: "MON",
    times: ["09:00"],

    deadlineType: "same_day",
    deadlineTime: "18:00",
    deadlineHours: 6,
    deadlineDays: 3,
    deadlineWeeks: 2,
    deadlineDate: "",
};

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

// ─── direct API fetch helper (same pattern as AssignTask.jsx) ─────────────
const apiFetch = async (endpoint, method = "GET", body = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
};

function NoData({ label = "No templates found" }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 8, color: "#94a3b8" }}>
            <InboxIcon sx={{ fontSize: 42 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
        </Box>
    );
}

// ═════════════════════════════════════════════════════════════════════════
// SMALL SCHEDULE-BUILDER INPUTS
// ═════════════════════════════════════════════════════════════════════════

// Chip list of MON..SUN, toggle on click
const DaysToggleGroup = ({ days, onChange }) => {
    const toggle = (d) => onChange(days.includes(d) ? days.filter((x) => x !== d) : [...days, d]);
    return (
        <Box display="flex" gap={0.7} flexWrap="wrap">
            {DAYS_OF_WEEK.map((d) => {
                const active = days.includes(d);
                return (
                    <Box key={d} onClick={() => toggle(d)} sx={{
                        px: 1.4, py: 0.5, borderRadius: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        border: `1.5px solid ${active ? TEAL : "#e0e0e0"}`,
                        bgcolor: active ? alpha(TEAL, 0.1) : "#fff",
                        color: active ? TEAL_DARK : "#777",
                        userSelect: "none", transition: "all .12s",
                        "&:hover": { borderColor: TEAL },
                    }}>
                        {d}
                    </Box>
                );
            })}
        </Box>
    );
};

// Add/remove HH:MM chips
const TimesChipsInput = ({ times, onChange }) => {
    const [temp, setTemp] = useState("09:00");
    const add = () => {
        if (temp && !times.includes(temp)) onChange([...times, temp].sort());
    };
    const remove = (t) => onChange(times.filter((x) => x !== t));
    return (
        <Box>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
                <TextField type="time" size="small" value={temp} onChange={(e) => setTemp(e.target.value)}
                    sx={{ width: 140, ...fieldSx }} InputLabelProps={{ shrink: true }} />
                <Button onClick={add} size="small" variant="outlined"
                    sx={{ textTransform: "none", borderRadius: "8px", borderColor: TEAL, color: TEAL, fontWeight: 600, "&:hover": { borderColor: TEAL_DARK, bgcolor: TEAL_LIGHT } }}>
                    + Add Time
                </Button>
            </Box>
            <Box display="flex" gap={0.7} flexWrap="wrap">
                {times.map((t) => (
                    <Chip key={t} label={fmtTime(t)} size="small" onDelete={() => remove(t)}
                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, "& .MuiChip-deleteIcon": { color: TEAL } }} />
                ))}
                {times.length === 0 && <Typography fontSize={11} color="text.disabled">No times added yet</Typography>}
            </Box>
        </Box>
    );
};

// Add/remove day-of-month (1-31) chips
const MonthDatesChipsInput = ({ dates, onChange }) => {
    const [temp, setTemp] = useState("");
    const add = () => {
        const n = Number(temp);
        if (n >= 1 && n <= 31 && !dates.includes(n)) onChange([...dates, n].sort((a, b) => a - b));
        setTemp("");
    };
    const remove = (n) => onChange(dates.filter((x) => x !== n));
    return (
        <Box>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
                <TextField type="number" size="small" placeholder="e.g. 5" value={temp}
                    onChange={(e) => setTemp(e.target.value)} inputProps={{ min: 1, max: 31 }}
                    sx={{ width: 100, ...fieldSx }} />
                <Button onClick={add} size="small" variant="outlined"
                    sx={{ textTransform: "none", borderRadius: "8px", borderColor: TEAL, color: TEAL, fontWeight: 600, "&:hover": { borderColor: TEAL_DARK, bgcolor: TEAL_LIGHT } }}>
                    + Add Date
                </Button>
            </Box>
            <Box display="flex" gap={0.7} flexWrap="wrap">
                {dates.map((n) => (
                    <Chip key={n} label={n} size="small" onDelete={() => remove(n)}
                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, "& .MuiChip-deleteIcon": { color: TEAL } }} />
                ))}
                {dates.length === 0 && <Typography fontSize={11} color="text.disabled">No dates added yet</Typography>}
            </Box>
        </Box>
    );
};

// ═════════════════════════════════════════════════════════════════════════
// TEMPLATE CARD — static (not draggable), row-wise layout
// ═════════════════════════════════════════════════════════════════════════
const TemplateCard = ({ row, onEdit, onDelete, onToggleActive }) => {
    const pm = priorityMeta(row.priority);
    const owners = Array.isArray(row.owners) ? row.owners : [];
    const active = !!row.is_active;

    return (
        <Paper elevation={0} sx={{
            p: 2, borderRadius: "12px", width: 300,
            border: `1px solid ${active ? "#e8ecf0" : "#f0f0f0"}`,
            bgcolor: active ? "#fff" : "#fafafa",
            opacity: active ? 1 : 0.8,
            transition: "all .15s",
            "&:hover": { borderColor: TEAL_MID, boxShadow: `0 4px 12px ${alpha(TEAL, 0.1)}`, transform: "translateY(-1px)" },
        }}>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
                    <Chip label={row.priority || "—"} size="small"
                        sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                    {row.id && (
                        <Chip icon={<TagOutlinedIcon sx={{ fontSize: "11px !important", color: "#5b21b6 !important" }} />}
                            label={row.id} size="small"
                            sx={{ bgcolor: alpha("#7c3aed", 0.08), color: "#5b21b6", fontWeight: 700, fontSize: 10, height: 18 }} />
                    )}
                </Box>
                <Box display="flex" gap={0.3} alignItems="center">
                    <Tooltip title={active ? "Deactivate template" : "Activate template"} arrow>
                        <IconButton size="small" onClick={() => onToggleActive(row)} sx={{ p: 0.3, color: active ? "#2e7d32" : "#9e9e9e" }}>
                            {active ? <ToggleOnOutlinedIcon sx={{ fontSize: 22 }} /> : <ToggleOffOutlinedIcon sx={{ fontSize: 22 }} />}
                        </IconButton>
                    </Tooltip>
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

            <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e" mb={0.3} lineHeight={1.35}
                sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {row.template_name}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                <TaskAltOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }} />
                <Typography fontSize={12} color="text.secondary" lineHeight={1.35}
                    sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {row.task}
                </Typography>
            </Box>

            <Box display="flex" gap={0.5} flexWrap="wrap" mb={1.2}>
                {row.oem && <Chip label={row.oem} size="small" sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18 }} />}
                {row.status && <Chip label={row.status} size="small" sx={{ bgcolor: "#f3f4f6", color: "#374151", fontSize: 10, height: 18, fontWeight: 600 }} />}
            </Box>

            {/* Recurrence summary */}
            <Box display="flex" alignItems="center" gap={0.7} mb={0.8}
                sx={{ px: 1.1, py: 0.6, borderRadius: "8px", bgcolor: alpha(TEAL, 0.06), border: `1px solid ${alpha(TEAL, 0.15)}` }}>
                <RepeatOutlinedIcon sx={{ fontSize: 14, color: TEAL, flexShrink: 0 }} />
                <Typography fontSize={10.5} fontWeight={600} color={TEAL_DARK} sx={{ lineHeight: 1.3 }}>
                    {recurrenceSummary(row.recurrence_rule)}
                </Typography>
            </Box>

            {/* Deadline summary */}
            <Box display="flex" alignItems="center" gap={0.7} mb={1}
                sx={{ px: 1.1, py: 0.6, borderRadius: "8px", bgcolor: alpha("#e65100", 0.06), border: `1px solid ${alpha("#e65100", 0.15)}` }}>
                <HourglassBottomOutlinedIcon sx={{ fontSize: 13, color: "#e65100", flexShrink: 0 }} />
                <Typography fontSize={10.5} fontWeight={600} color="#9a3412" sx={{ lineHeight: 1.3 }}>
                    {deadlineSummary(row.deadline_rule)}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                <EventOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af" }} />
                <Typography fontSize={10.5} color="text.disabled">
                    {fmtDate(row.start_date)}{row.end_date ? ` – ${fmtDate(row.end_date)}` : ""}
                </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    {owners.length > 0 ? owners.slice(0, 3).map((o, i) => (
                        <Tooltip key={o} title={o} arrow>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, border: "2px solid #fff", ml: i > 0 ? -0.8 : 0 }}>
                                {(o[0] || "?").toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    )) : <Typography fontSize={11} color="text.disabled">No owners</Typography>}
                    {owners.length > 3 && <Typography fontSize={10.5} color="text.secondary" ml={0.5}>+{owners.length - 3}</Typography>}
                </Box>
                {row.assigned_by && (
                    <Tooltip title={`Assigned by ${row.assigned_by}`} arrow>
                        <Box display="flex" alignItems="center" gap={0.3}>
                            <PersonOutlineIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                            <Typography fontSize={10} color="text.disabled" noWrap sx={{ maxWidth: 90 }}>{row.assigned_by}</Typography>
                        </Box>
                    </Tooltip>
                )}
            </Box>
        </Paper>
    );
};

// ═════════════════════════════════════════════════════════════════════════
// CREATE / EDIT TEMPLATE DIALOG
// ═════════════════════════════════════════════════════════════════════════
const CreateTemplateDialog = ({ open, onClose, editId, initialForm, onSaved, userEmail }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [emailOptions, setEmailOptions] = useState([]);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailInputValue, setEmailInputValue] = useState("");

    const [taskOptions, setTaskOptions] = useState([]);
    const [taskLoading, setTaskLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(initialForm ? initialForm : { ...EMPTY_FORM });
            setErrors({});
            setEmailInputValue("");
            fetchEmailOptions();
            fetchTaskOptions();
        }
    }, [open, initialForm]);

    const fetchEmailOptions = async () => {
        setEmailLoading(true);
        try {
            const formData = new FormData();
            formData.append("userID", userEmail);
            const res = await fetch(`${BASE_URL}${API.GET_EMAIL_OPTIONS}`, { method: "POST", body: formData });
            const data = await res.json();
            const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
            setEmailOptions(list);
        } catch (err) {
            console.error("fetchEmailOptions error:", err);
            setEmailOptions([]);
        } finally {
            setEmailLoading(false);
        }
    };

    // Auto-populate the Task Name field from existing tasks — same endpoint AssignTask.jsx uses
    const fetchTaskOptions = async () => {
        setTaskLoading(true);
        try {
            const formData = new FormData();
            formData.append("userID", userEmail);
            const res = await fetch(`${BASE_URL}${API.GET_TASK_OPTIONS}`, { method: "POST", body: formData });
            const data = await res.json();
            const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
            setTaskOptions(list);
        } catch (err) {
            console.error("fetchTaskOptions error:", err);
            setTaskOptions([]);
        } finally {
            setTaskLoading(false);
        }
    };

    const setField = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((e) => ({ ...e, [field]: "" }));
    };

    // Owners — multiple, matches the `owners` JSONField list on the backend
    const addOwner = (emailOrObj) => {
        const email = (typeof emailOrObj === "object" ? emailOrObj?.assigned_to ?? "" : emailOrObj ?? "").trim().toLowerCase();
        if (!email || !email.includes("@") || form.owners.includes(email)) return;
        setForm((p) => ({ ...p, owners: [...p.owners, email] }));
        setErrors((e) => ({ ...e, owners: "" }));
        setEmailInputValue("");
    };
    const removeOwner = (email) => setForm((p) => ({ ...p, owners: p.owners.filter((o) => o !== email) }));

    const validate = () => {
        const e = {};
        if (!form.templateName.trim()) e.templateName = "Template name is required";
        if (!form.task.trim()) e.task = "Task name is required";
        if (form.owners.length === 0) e.owners = "Add at least one owner email";
        if (!form.startDate) e.startDate = "Start date is required";
        if (form.recurrenceType === "weekly" && form.recurrenceDays.length === 0) e.recurrenceDays = "Select at least one day";
        if (form.recurrenceType === "custom" && form.recurrenceDays.length === 0) e.recurrenceDays = "Select at least one day";
        if (form.recurrenceType === "monthly" && form.monthlyMode === "date" && form.monthlyDates.length === 0) e.monthlyDates = "Add at least one date";
        if (form.times.length === 0) e.times = "Add at least one time";
        if (form.deadlineType === "fixed_date" && !form.deadlineDate) e.deadlineDate = "Fixed date is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const buildPayload = () => ({
        templateName: form.templateName,
        payload: {
            template_name: form.templateName,
            task: form.task,
            oem: form.oem || "",
            owners: form.owners,
            assigned_by: userEmail,
            priority: form.priority,
            status: form.status,
            remarks: form.remarks || "",
            recurrence_rule: buildRecurrenceRule(form),
            deadline_rule: buildDeadlineRule(form),
            start_date: form.startDate,
            end_date: form.endDate || null,
            is_active: form.isActive,
            ...(editId ? { updated_by: userEmail } : { assigned_by: userEmail }),
        },
    });

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const { templateName, payload } = buildPayload();
            if (editId) {
                await apiFetch(API.UPDATE(editId), "PUT", payload);
            } else {
                await apiFetch(API.CREATE, "POST", payload);
            }
            onClose();
            onSaved();
            Swal.fire({
                icon: "success",
                title: editId ? "Template Updated!" : "Template Created!",
                html: `<b>${templateName}</b> saved successfully`,
                timer: 2500, showConfirmButton: false, timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave error:", err);
            Swal.fire("Error", `Failed to save template: ${err.message}`, "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", maxHeight: "92vh" } }}>
            <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "11px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <LibraryAddOutlinedIcon sx={{ color: TEAL, fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={17} lineHeight={1.2} color="#1a1a2e">
                                {editId ? "Edit Task Template" : "Create Task Template"}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {editId ? "Update template details" : "Define a reusable, schedulable task"}
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

                    {/* ── Template Name + Task Name ─────────────────────────────────── */}
                    <TextField label="Template Name" value={form.templateName}
                        onChange={(e) => setField("templateName", e.target.value)}
                        error={!!errors.templateName} helperText={errors.templateName || "Unique name to identify this template"}
                        size="small" fullWidth sx={fieldSx} placeholder="e.g. Huawei Weekday KPI Check"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LibraryAddOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                    <Autocomplete
                        freeSolo
                        options={taskOptions}
                        getOptionLabel={(opt) => (typeof opt === "object" ? opt.task ?? "" : opt ?? "")}
                        inputValue={form.task}
                        onInputChange={(_, val, reason) => { if (reason !== "reset") setField("task", val); }}
                        onChange={(_, val) => setField("task", typeof val === "object" ? val?.task ?? "" : val ?? "")}
                        loading={taskLoading}
                        isOptionEqualToValue={(opt, val) => opt?.id === val?.id || opt?.task === val?.task}
                        noOptionsText={taskLoading ? "Loading tasks…" : "No tasks found — keep typing to add a new one"}
                        renderOption={(props, opt) => (
                            <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: alpha(TEAL, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <TaskAltOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                                    </Box>
                                    <Box>
                                        <Typography fontSize={13} fontWeight={600} color="#1a1a2e">{opt.task}</Typography>
                                        {opt.oem && <Typography fontSize={11} color="text.secondary">{opt.oem}</Typography>}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Task Name" size="small" placeholder="e.g. Check KPI Validation"
                                error={!!errors.task} helperText={errors.task || "Search existing tasks or type a new one"} sx={fieldSx}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (<><InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>{params.InputProps.startAdornment}</>),
                                    endAdornment: (<>{taskLoading ? <CircularProgress color="inherit" size={14} /> : null}{params.InputProps.endAdornment}</>),
                                }} />
                        )}
                    />

                    {/* ── Owners (multiple) ───────────────────────────────────────────── */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Owner Email(s)
                            <Chip label={`${form.owners.length} selected`} size="small"
                                sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: form.owners.length > 0 ? alpha(TEAL, 0.12) : "#f3f4f6", color: form.owners.length > 0 ? TEAL_DARK : "text.secondary" }} />
                        </Typography>

                        {form.owners.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
                                {form.owners.map((email) => (
                                    <Chip key={email} label={email} size="small"
                                        onDelete={() => removeOwner(email)}
                                        avatar={<Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>{(email[0] || "?").toUpperCase()}</Avatar>}
                                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, height: 26, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
                                ))}
                            </Box>
                        )}

                        <Autocomplete
                            options={emailOptions}
                            getOptionLabel={(opt) => (typeof opt === "object" ? opt.assigned_to ?? "" : opt)}
                            inputValue={emailInputValue}
                            onInputChange={(_, val, reason) => { if (reason !== "reset") setEmailInputValue(val); }}
                            onChange={(_, val) => { if (val) addOwner(val); }}
                            value={null}
                            loading={emailLoading}
                            freeSolo
                            clearOnBlur={false}
                            blurOnSelect
                            isOptionEqualToValue={(opt, val) => opt?.assigned_to === val?.assigned_to}
                            noOptionsText={emailLoading ? "Loading emails…" : emailInputValue ? `Press Enter to add "${emailInputValue}"` : "No emails found"}
                            filterOptions={(options, { inputValue }) => {
                                const q = inputValue.toLowerCase();
                                return options.filter((o) => (o.assigned_to ?? "").toLowerCase().includes(q));
                            }}
                            renderOption={(props, opt) => (
                                <Box component="li" {...props} sx={{ py: 0.8, px: 1.5 }}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.15), color: TEAL_DARK }}>
                                            {(opt.assigned_to?.[0] || "?").toUpperCase()}
                                        </Avatar>
                                        <Typography fontSize={13} fontWeight={500} color="#1a1a2e">{opt.assigned_to}</Typography>
                                    </Box>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} size="small" fullWidth
                                    placeholder="Search or type email, then press Enter…"
                                    error={!!errors.owners}
                                    helperText={errors.owners || "Search from saved emails or type a new one · Enter to add · multiple allowed"}
                                    sx={fieldSx}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (<><InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>{params.InputProps.startAdornment}</>),
                                        endAdornment: (<>{emailLoading ? <CircularProgress color="inherit" size={14} /> : null}{params.InputProps.endAdornment}</>),
                                        onKeyDown: (e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault(); e.stopPropagation();
                                                if (emailInputValue.trim()) addOwner(emailInputValue.trim());
                                            }
                                        },
                                    }} />
                            )}
                        />
                    </Box>

                    {/* ── OEM + Priority + Status ────────────────────────────────────── */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField select label="OEM" value={form.oem} onChange={(e) => setField("oem", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                <MenuItem value=""><em style={{ color: "#aaa" }}>— Select —</em></MenuItem>
                                {OEM_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <TextField select label="Priority" value={form.priority} onChange={(e) => setField("priority", e.target.value)}
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: priorityMeta(form.priority).color }} /></InputAdornment>) }}>
                                {PRIORITY_OPTIONS.map((p) => (
                                    <MenuItem key={p.value} value={p.value}>
                                        <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}
                                size="small" fullWidth sx={fieldSx}>
                                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Schedule ─────────────────────────────────────────────────────── */}
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${TEAL_MID}`, bgcolor: alpha(TEAL, 0.02) }}>
                        <Typography fontSize={12.5} fontWeight={700} color={TEAL_DARK} mb={1.5}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <RepeatOutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
                            Schedule
                        </Typography>

                        {/* Start / End date */}
                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={6}>
                                <TextField label="Start Date" type="date" value={form.startDate}
                                    onChange={(e) => setField("startDate", e.target.value)}
                                    error={!!errors.startDate} helperText={errors.startDate}
                                    size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="End Date (optional)" type="date" value={form.endDate}
                                    onChange={(e) => setField("endDate", e.target.value)}
                                    size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><EventBusyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
                            </Grid>
                        </Grid>

                        {/* Recurring type */}
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <RepeatOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Recurring
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                            {RECURRENCE_TYPES.map((opt) => {
                                const isActive = form.recurrenceType === opt.value;
                                return (
                                    <Box key={opt.value} onClick={() => setField("recurrenceType", opt.value)} sx={{
                                        display: "flex", alignItems: "center", gap: 0.7,
                                        px: 1.8, py: 0.8, borderRadius: "10px",
                                        border: `1.5px solid ${isActive ? TEAL : "#e0e0e0"}`,
                                        bgcolor: isActive ? alpha(TEAL, 0.08) : "#fff",
                                        color: isActive ? TEAL_DARK : "#555",
                                        fontWeight: isActive ? 700 : 500, fontSize: 12.5,
                                        cursor: "pointer", transition: "all .15s", userSelect: "none",
                                        "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
                                    }}>
                                        <span style={{ fontSize: 14 }}>{opt.icon}</span>
                                        <span>{opt.label}</span>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Interval — daily / weekly / monthly */}
                        {["daily", "weekly", "monthly"].includes(form.recurrenceType) && (
                            <TextField label={`Every N ${form.recurrenceType === "daily" ? "day(s)" : form.recurrenceType === "weekly" ? "week(s)" : "month(s)"}`}
                                type="number" value={form.recurrenceInterval}
                                onChange={(e) => setField("recurrenceInterval", e.target.value)}
                                inputProps={{ min: 1 }} size="small" fullWidth sx={{ ...fieldSx, mb: 2, maxWidth: 220 }} />
                        )}

                        {/* Weekly / Custom — day selector */}
                        {["weekly", "custom"].includes(form.recurrenceType) && (
                            <Box mb={2}>
                                <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.8}>Days</Typography>
                                <DaysToggleGroup days={form.recurrenceDays} onChange={(d) => setField("recurrenceDays", d)} />
                                {errors.recurrenceDays && <Typography fontSize={11} color="error.main" mt={0.5}>{errors.recurrenceDays}</Typography>}
                            </Box>
                        )}

                        {/* Monthly — date-of-month vs weekday pattern */}
                        {form.recurrenceType === "monthly" && (
                            <Box mb={2}>
                                <Box display="flex" gap={1} mb={1.2}>
                                    {["date", "weekday"].map((mode) => (
                                        <Box key={mode} onClick={() => setField("monthlyMode", mode)} sx={{
                                            px: 1.6, py: 0.6, borderRadius: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: `1.5px solid ${form.monthlyMode === mode ? TEAL : "#e0e0e0"}`,
                                            bgcolor: form.monthlyMode === mode ? alpha(TEAL, 0.08) : "#fff",
                                            color: form.monthlyMode === mode ? TEAL_DARK : "#777",
                                        }}>
                                            {mode === "date" ? "By date of month" : "By weekday pattern"}
                                        </Box>
                                    ))}
                                </Box>

                                {form.monthlyMode === "date" ? (
                                    <>
                                        <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.8}>Dates</Typography>
                                        <MonthDatesChipsInput dates={form.monthlyDates} onChange={(d) => setField("monthlyDates", d)} />
                                        {errors.monthlyDates && <Typography fontSize={11} color="error.main" mt={0.5}>{errors.monthlyDates}</Typography>}
                                    </>
                                ) : (
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField select label="Week" value={form.monthlyWeek} onChange={(e) => setField("monthlyWeek", e.target.value)}
                                                size="small" fullWidth sx={fieldSx}>
                                                {MONTH_WEEK_OPTIONS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField select label="Day" value={form.monthlyDay} onChange={(e) => setField("monthlyDay", e.target.value)}
                                                size="small" fullWidth sx={fieldSx}>
                                                {DAYS_OF_WEEK.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        )}

                        {/* Times — applies to every recurrence type */}
                        <Box mb={0.5}>
                            <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.8}
                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 14, color: TEAL }} />
                                Time(s)
                            </Typography>
                            <TimesChipsInput times={form.times} onChange={(t) => setField("times", t)} />
                            {errors.times && <Typography fontSize={11} color="error.main" mt={0.5}>{errors.times}</Typography>}
                        </Box>
                    </Paper>

                    {/* ── Deadline rule ───────────────────────────────────────────────── */}
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${alpha("#e65100", 0.3)}`, bgcolor: alpha("#e65100", 0.02) }}>
                        <Typography fontSize={12.5} fontWeight={700} color="#9a3412" mb={1.5}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <HourglassBottomOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} />
                            Deadline Rule
                        </Typography>

                        <TextField select label="Deadline Type" value={form.deadlineType}
                            onChange={(e) => setField("deadlineType", e.target.value)}
                            size="small" fullWidth sx={{ ...fieldSx, mb: 2 }}>
                            {DEADLINE_TYPES.map((d) => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
                        </TextField>

                        <Grid container spacing={2}>
                            {form.deadlineType === "after_hours" && (
                                <Grid item xs={6}>
                                    <TextField label="Hours after assignment" type="number" value={form.deadlineHours}
                                        onChange={(e) => setField("deadlineHours", e.target.value)}
                                        inputProps={{ min: 1 }} size="small" fullWidth sx={fieldSx} />
                                </Grid>
                            )}
                            {form.deadlineType === "after_days" && (
                                <Grid item xs={6}>
                                    <TextField label="Days after" type="number" value={form.deadlineDays}
                                        onChange={(e) => setField("deadlineDays", e.target.value)}
                                        inputProps={{ min: 1 }} size="small" fullWidth sx={fieldSx} />
                                </Grid>
                            )}
                            {form.deadlineType === "after_weeks" && (
                                <Grid item xs={6}>
                                    <TextField label="Weeks after" type="number" value={form.deadlineWeeks}
                                        onChange={(e) => setField("deadlineWeeks", e.target.value)}
                                        inputProps={{ min: 1 }} size="small" fullWidth sx={fieldSx} />
                                </Grid>
                            )}
                            {form.deadlineType === "fixed_date" && (
                                <Grid item xs={6}>
                                    <TextField label="Fixed Date" type="date" value={form.deadlineDate}
                                        onChange={(e) => setField("deadlineDate", e.target.value)}
                                        error={!!errors.deadlineDate} helperText={errors.deadlineDate}
                                        size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
                                </Grid>
                            )}
                            {form.deadlineType !== "after_hours" && (
                                <Grid item xs={6}>
                                    <TextField label="Time" type="time" value={form.deadlineTime}
                                        onChange={(e) => setField("deadlineTime", e.target.value)}
                                        size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
                                </Grid>
                            )}
                        </Grid>
                    </Paper>

                    {/* ── Active toggle ───────────────────────────────────────────────── */}
                    <FormControlLabel
                        control={
                            <Switch checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)}
                                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: TEAL }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: TEAL } }} />
                        }
                        label={<Typography fontSize={13} fontWeight={500}>Template is active</Typography>}
                    />

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
                    startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <LibraryAddOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 3, boxShadow: `0 2px 10px ${alpha(TEAL, 0.4)}`, fontSize: 14 }}>
                    {saving ? "Saving…" : editId ? "Update Template" : "Create Template"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ═════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════
const TaskTemplate = () => {
    const navigate = useNavigate();

    const userEmail = useMemo(() => {
        const fromDecrypt = getDecreyptedData("userID") || getDecreyptedData("email") || getDecreyptedData("userEmail");
        if (fromDecrypt && fromDecrypt.includes("@")) return fromDecrypt;
        return getLoggedInUserEmail();
    }, []);

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}${API.GET_TEMPLATES}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assigned_by: userEmail }),
            });
            const data = await res.json();

            let list = [];
            if (Array.isArray(data)) list = data;
            else if (Array.isArray(data?.data)) list = data.data;
            else if (Array.isArray(data?.results)) list = data.results;
            else if (Array.isArray(data?.templates)) list = data.templates;

            setTemplates(list);
        } catch (err) {
            console.error("fetchAll (templates) error:", err);
            Swal.fire("Error", `Failed to load templates: ${err.message}`, "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userEmail]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const openCreate = () => { setEditId(null); setEditForm(null); setDialogOpen(true); };

    const openEdit = (row) => {
        setEditId(row.id);
        setEditForm({
            templateName: row.template_name ?? "",
            task: row.task ?? "",
            owners: Array.isArray(row.owners) ? row.owners : [],
            oem: row.oem ?? "",
            priority: row.priority ?? "Medium",
            status: row.status ?? "Active",
            remarks: row.remarks ?? "",
            startDate: row.start_date ?? todayStr(),
            endDate: row.end_date ?? "",
            isActive: row.is_active ?? true,
            ...parseRecurrenceRule(row.recurrence_rule),
            ...parseDeadlineRule(row.deadline_rule),
        });
        setDialogOpen(true);
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete Template?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.template_name}</b>?</span>`,
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

    // ── Quick active/inactive toggle — task-template/status/<pk>/ ──────────────
    const handleToggleActive = useCallback(async (row) => {
        const next = !row.is_active;
        setTemplates((prev) => prev.map((t) => (t.id === row.id ? { ...t, is_active: next } : t)));
        try {
            await apiFetch(API.STATUS(row.id), "PUT", { is_active: next });
        } catch (err) {
            console.error("Toggle status failed:", err);
            setTemplates((prev) => prev.map((t) => (t.id === row.id ? { ...t, is_active: row.is_active } : t)));
            Swal.fire("Error", "Failed to update template status.", "error");
        }
    }, []);

    return (
        <Box sx={{ p: 3, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

            {/* Breadcrumb */}
            <Box mb={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Task Templates</Typography>
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
                                <LibraryAddOutlinedIcon sx={{ color: "#fff", fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">Task Templates</Typography>
                                <Typography fontSize={13} color="text.secondary" mt={0.2}>
                                    Reusable, Schedulable Task Templates. Create once, assign many times.
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            <Button variant="outlined"
                                startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
                                onClick={() => fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, height: 36, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </Button>

                            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                                sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, height: 36, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
                                Create Template
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* ── Templates — row-wise, static cards (no drag), no search bar ── */}
                <Box sx={{ px: 3, py: 2.5 }}>
                    {loading ? (
                        <Box display="flex" gap={2} flexWrap="wrap">
                            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" width={300} height={260} sx={{ borderRadius: "12px" }} />)}
                        </Box>
                    ) : templates.length === 0 ? (
                        <NoData label="No templates found — click + Create Template" />
                    ) : (
                        <Box display="flex" gap={2} flexWrap="wrap">
                            {templates.map((row, idx) => (
                                <TemplateCard key={row.id ?? idx} row={row} onEdit={openEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />
                            ))}
                        </Box>
                    )}
                </Box>

                {!loading && (
                    <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5" }}>
                        <Typography variant="caption" color="text.disabled">
                            Showing <strong>{templates.length}</strong> template{templates.length !== 1 ? "s" : ""}
                        </Typography>
                    </Box>
                )}
            </Paper>

            <CreateTemplateDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                editId={editId}
                initialForm={editForm}
                onSaved={fetchAll}
                userEmail={userEmail}
            />
        </Box>
    );
};

export default TaskTemplate;