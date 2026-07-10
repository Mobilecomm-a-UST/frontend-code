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
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import InboxIcon from "@mui/icons-material/Inbox";
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

const TEMPLATE_STATUS_OPTIONS = ["Active", "Inactive"];

// Recurrence pattern — mirrors Outlook/Teams "Recurring" options
const RECURRENCE_OPTIONS = [
    { value: "None", label: "Does not repeat", icon: "➖" },
    { value: "Daily", label: "Daily", icon: "📅" },
    { value: "Weekly", label: "Weekly", icon: "🗓️" },
    { value: "Monthly", label: "Monthly", icon: "📆" },
    { value: "Yearly", label: "Yearly", icon: "🎉" },
];

const BASE_URL = "https://commtoolapi.mcpspmis.com/";

// NOTE: endpoint paths below follow the same naming convention as the other
// dailytask_review APIs — adjust to match the real backend routes once known.
const API = {
    CREATE: "dailytask_review/task_template/create/",
    UPDATE: (pk) => `dailytask_review/task_template/update-template/${pk}/`,
    DELETE: (pk) => `dailytask_review/task_template/delete-template/${pk}/`,
    GET_TEMPLATES: "dailytask_review/task_template/get/",
    GET_EMAIL_OPTIONS: "dailytask_review/reporting-email-hierarchy/get/",
};

// ─── helpers ──────────────────────────────────────────────────────────────
const nowISO = () => new Date().toISOString();

const toLocalDateStr = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const todayStr = () => toLocalDateStr(new Date());

const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const recurrenceMeta = (r) => RECURRENCE_OPTIONS.find((o) => o.value === r) ?? RECURRENCE_OPTIONS[0];

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

// Human readable schedule summary shown on the template card
const scheduleSummary = (row) => {
    const rec = recurrenceMeta(row.recurrence);
    const datePart = fmtDate(row.start_date);
    const timePart = row.all_day ? "All day" : `${fmtTime(row.start_time)}${row.end_time ? ` – ${fmtTime(row.end_time)}` : ""}`;
    if (!row.recurrence || row.recurrence === "None") {
        return `One-time · ${datePart} · ${timePart}`;
    }
    return `${rec.label} · from ${datePart} · ${timePart}`;
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
    recipients: [], // single owner, same pattern as AssignTask
    oem: "",
    priority: "Medium",
    status: "Active",
    remarks: "",
    allDay: false,
    startDate: todayStr(),
    startTime: "09:00",
    endTime: "09:30",
    recurrence: "None",
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

// ─── No data placeholder ────────────────────────────────────────────────────
function NoData({ label = "No templates found" }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 8, color: "#94a3b8" }}>
            <InboxIcon sx={{ fontSize: 42 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
        </Box>
    );
}

// ═════════════════════════════════════════════════════════════════════════
// TEMPLATE CARD — static (not draggable), row-wise layout
// ═════════════════════════════════════════════════════════════════════════
const TemplateCard = ({ row, onEdit, onDelete }) => {
    const pm = priorityMeta(row.priority);
    const rec = recurrenceMeta(row.recurrence);
    const isActive = (row.status ?? "Active") === "Active";
    const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);

    return (
        <Paper elevation={0} sx={{
            p: 2, borderRadius: "12px", width: 280,
            border: `1px solid ${isActive ? "#e8ecf0" : "#f0f0f0"}`,
            bgcolor: isActive ? "#fff" : "#fafafa",
            opacity: isActive ? 1 : 0.75,
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
                <Box display="flex" gap={0.5}>
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

            <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e" mb={0.8} lineHeight={1.4}
                sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {row.template_name}
            </Typography>

            <Box display="flex" gap={0.5} flexWrap="wrap" mb={1.2}>
                {row.oem && <Chip label={row.oem} size="small" sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18 }} />}
                <Chip label={isActive ? "Active" : "Inactive"} size="small"
                    sx={{ bgcolor: isActive ? "#e8f5e9" : "#f5f5f5", color: isActive ? "#2e7d32" : "#777", fontSize: 10, height: 18, fontWeight: 700 }} />
            </Box>

            {/* Schedule summary — mirrors the Outlook-style recurrence chosen at creation */}
            <Box display="flex" alignItems="center" gap={0.7} mb={1}
                sx={{ px: 1.1, py: 0.6, borderRadius: "8px", bgcolor: alpha(TEAL, 0.06), border: `1px solid ${alpha(TEAL, 0.15)}` }}>
                <RepeatOutlinedIcon sx={{ fontSize: 14, color: TEAL }} />
                <Typography fontSize={11} fontWeight={600} color={TEAL_DARK} sx={{ lineHeight: 1.3 }}>
                    {scheduleSummary(row)}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={0.6}>
                    {owners.length > 0 ? (
                        <>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                                {(owners[0][0] || "?").toUpperCase()}
                            </Avatar>
                            <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 130 }}>
                                {owners[0]}
                            </Typography>
                        </>
                    ) : <Typography fontSize={11} color="text.disabled">No owner</Typography>}
                </Box>
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

    useEffect(() => {
        if (open) {
            setForm(initialForm ? initialForm : { ...EMPTY_FORM });
            setErrors({});
            setEmailInputValue("");
            fetchEmailOptions();
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

    const setField = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((e) => ({ ...e, [field]: "" }));
    };

    // Owner Email — single selection only, same pattern as AssignTask
    const addRecipient = (emailOrObj) => {
        const email = (typeof emailOrObj === "object" ? emailOrObj?.assigned_to ?? "" : emailOrObj ?? "").trim().toLowerCase();
        if (!email || !email.includes("@")) return;
        setForm((p) => ({ ...p, recipients: [{ name: email, email }] }));
        setErrors((e) => ({ ...e, recipients: "" }));
        setEmailInputValue("");
    };
    const removeRecipient = (email) =>
        setForm((p) => ({ ...p, recipients: p.recipients.filter((r) => r.email !== email) }));

    const validate = () => {
        const e = {};
        if (!form.templateName.trim()) e.templateName = "Template name is required";
        if (form.recipients.length === 0) e.recipients = "Add an owner email";
        if (!form.startDate) e.startDate = "Date is required";
        if (!form.allDay && (!form.startTime || !form.endTime)) e.startTime = "Start and end time are required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const buildPayload = () => ({
        templateName: form.templateName,
        payload: {
            template_name: form.templateName,
            oem: form.oem || "",
            priority: form.priority,
            status: form.status,
            owner: form.recipients.map((r) => r.email),
            remarks: form.remarks || "",
            all_day: form.allDay,
            start_date: form.startDate,
            start_time: form.allDay ? null : form.startTime,
            end_time: form.allDay ? null : form.endTime,
            recurrence: form.recurrence === "None" ? "" : form.recurrence,
            updated_by: userEmail,
            ...(editId ? {} : { created_by: userEmail, created_at: nowISO() }),
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

                    {/* ── Template Name ─────────────────────────────────────────────── */}
                    <TextField label="Template Name" value={form.templateName}
                        onChange={(e) => setField("templateName", e.target.value)}
                        error={!!errors.templateName} helperText={errors.templateName}
                        size="small" fullWidth sx={fieldSx} placeholder="e.g. Nokia 4G Site Audit"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LibraryAddOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                    {/* ── Owner Email (single selection) ────────────────────────────── */}
                    <Box>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Owner Email
                            <Chip label={form.recipients.length > 0 ? "1 selected" : "0 selected"} size="small"
                                sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: form.recipients.length > 0 ? alpha(TEAL, 0.12) : "#f3f4f6", color: form.recipients.length > 0 ? TEAL_DARK : "text.secondary" }} />
                        </Typography>

                        {form.recipients.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
                                {form.recipients.map((r) => (
                                    <Chip key={r.email} label={r.email} size="small"
                                        onDelete={() => removeRecipient(r.email)}
                                        avatar={<Avatar sx={{ bgcolor: alpha(TEAL, 0.2), color: `${TEAL_DARK} !important`, fontSize: "9px !important" }}>{(r.email[0] || "?").toUpperCase()}</Avatar>}
                                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11.5, height: 26, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
                                ))}
                            </Box>
                        )}

                        {form.recipients.length === 0 ? (
                            <Autocomplete
                                options={emailOptions}
                                getOptionLabel={(opt) => (typeof opt === "object" ? opt.assigned_to ?? "" : opt)}
                                inputValue={emailInputValue}
                                onInputChange={(_, val, reason) => { if (reason !== "reset") setEmailInputValue(val); }}
                                onChange={(_, val) => { if (val) addRecipient(val); }}
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
                                        error={!!errors.recipients}
                                        helperText={errors.recipients || "Search from saved emails or type a new one · Enter to select · Only one owner allowed"}
                                        sx={fieldSx}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (<><InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>{params.InputProps.startAdornment}</>),
                                            endAdornment: (<>{emailLoading ? <CircularProgress color="inherit" size={14} /> : null}{params.InputProps.endAdornment}</>),
                                            onKeyDown: (e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault(); e.stopPropagation();
                                                    if (emailInputValue.trim()) addRecipient(emailInputValue.trim());
                                                }
                                            },
                                        }} />
                                )}
                            />
                        ) : (
                            <Typography fontSize={11} color="text.disabled">Remove the selected owner above to choose a different one.</Typography>
                        )}
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
                                size="small" fullWidth sx={fieldSx}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: form.status === "Active" ? "#2e7d32" : "#9e9e9e", ml: 0.5, flexShrink: 0 }} /></InputAdornment>) }}>
                                {TEMPLATE_STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* ── Schedule (Outlook / Teams style) ───────────────────────────── */}
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${TEAL_MID}`, bgcolor: alpha(TEAL, 0.02) }}>
                        <Typography fontSize={12.5} fontWeight={700} color={TEAL_DARK} mb={1.5}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <RepeatOutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
                            Schedule
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch checked={form.allDay} onChange={(e) => setField("allDay", e.target.checked)}
                                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: TEAL }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: TEAL } }} />
                            }
                            label={
                                <Box display="flex" alignItems="center" gap={0.6}>
                                    <WbSunnyOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                                    <Typography fontSize={13} fontWeight={500}>All day</Typography>
                                </Box>
                            }
                            sx={{ mb: 1 }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={form.allDay ? 12 : 4}>
                                <TextField label="Date" type="date" value={form.startDate}
                                    onChange={(e) => setField("startDate", e.target.value)}
                                    error={!!errors.startDate} helperText={errors.startDate}
                                    size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
                            </Grid>
                            {!form.allDay && (
                                <>
                                    <Grid item xs={6} sm={4}>
                                        <TextField label="Start Time" type="time" value={form.startTime}
                                            onChange={(e) => setField("startTime", e.target.value)}
                                            error={!!errors.startTime} helperText={errors.startTime}
                                            size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx}
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <TextField label="End Time" type="time" value={form.endTime}
                                            onChange={(e) => setField("endTime", e.target.value)}
                                            size="small" fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mt={2} mb={1}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <RepeatOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Recurring
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {RECURRENCE_OPTIONS.map((opt) => {
                                const isActive = form.recurrence === opt.value;
                                return (
                                    <Box key={opt.value} onClick={() => setField("recurrence", opt.value)} sx={{
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

    const [search, setSearch] = useState("");

    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}${API.GET_TEMPLATES}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ created_by: userEmail }),
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

    const filteredTemplates = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return templates;
        return templates.filter((row) => {
            const name = (row.template_name ?? "").toLowerCase();
            const oem = (row.oem ?? "").toLowerCase();
            const ownerStr = (Array.isArray(row.owner) ? row.owner.join(" ") : row.owner ?? "").toLowerCase();
            return name.includes(q) || oem.includes(q) || ownerStr.includes(q);
        });
    }, [templates, search]);

    const openCreate = () => { setEditId(null); setEditForm(null); setDialogOpen(true); };

    const openEdit = (row) => {
        setEditId(row.id);
        const owners = Array.isArray(row.owner) ? row.owner : (row.owner ? [row.owner] : []);
        const recipients = owners.length > 0 ? [{ name: owners[0], email: owners[0] }] : [];
        setEditForm({
            templateName: row.template_name ?? "",
            recipients,
            oem: row.oem ?? "",
            priority: row.priority ?? "Medium",
            status: row.status ?? "Active",
            remarks: row.remarks ?? "",
            allDay: !!row.all_day,
            startDate: row.start_date ?? todayStr(),
            startTime: row.start_time ?? "09:00",
            endTime: row.end_time ?? "09:30",
            recurrence: row.recurrence || "None",
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
                                    Reusable, schedulable task definitions
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

                {/* ── Search ── */}
                <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5" }}>
                    <TextField size="small" placeholder="Search template name, owner, OEM…"
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: "100%", maxWidth: 420, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />
                </Box>

                {/* ── Templates — row-wise, static cards (no drag) ── */}
                <Box sx={{ px: 3, py: 2.5 }}>
                    {loading ? (
                        <Box display="flex" gap={2} flexWrap="wrap">
                            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" width={280} height={150} sx={{ borderRadius: "12px" }} />)}
                        </Box>
                    ) : filteredTemplates.length === 0 ? (
                        <NoData label={search ? "No templates match your search" : "No templates found — click + Create Template"} />
                    ) : (
                        <Box display="flex" gap={2} flexWrap="wrap">
                            {filteredTemplates.map((row, idx) => (
                                <TemplateCard key={row.id ?? idx} row={row} onEdit={openEdit} onDelete={handleDelete} />
                            ))}
                        </Box>
                    )}
                </Box>

                {!loading && (
                    <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f0f2f5" }}>
                        <Typography variant="caption" color="text.disabled">
                            Showing <strong>{filteredTemplates.length}</strong> of <strong>{templates.length}</strong> templates
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