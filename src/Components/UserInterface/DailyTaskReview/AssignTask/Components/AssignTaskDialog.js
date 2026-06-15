import React, { useState, useEffect, useRef } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton,
    InputAdornment, Divider, Grid, Avatar, CircularProgress, Autocomplete, alpha,
} from "@mui/material";
import AddIcon                  from "@mui/icons-material/Add";
import CloseIcon                from "@mui/icons-material/Close";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TaskAltOutlinedIcon       from "@mui/icons-material/TaskAltOutlined";
import PersonOutlineIcon         from "@mui/icons-material/PersonOutline";
import RouterOutlinedIcon        from "@mui/icons-material/RouterOutlined";
import WbSunnyOutlinedIcon       from "@mui/icons-material/WbSunnyOutlined";
import FlagOutlinedIcon          from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon         from "@mui/icons-material/EventOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import GroupAddOutlinedIcon      from "@mui/icons-material/GroupAddOutlined";
import EmailOutlinedIcon         from "@mui/icons-material/EmailOutlined";
import Swal from "sweetalert2";

import {
    TEAL, TEAL_DARK, TEAL_LIGHT, TEAL_MID,
    OEM_OPTIONS, SLOT_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS,
    REMINDER_OPTIONS, EMPTY_FORM, fieldSx,
} from "../Constants";
import { nowISO, nowLocal, priorityMeta, statusColor, fmtAssignedAt } from "../Helpers";
import { getData, postData } from "../../../../services/FetchNodeServices";
import { getDecreyptedData } from "../../../../utils/localstorage";
import API from "../Api";

// ─── Assign Task Dialog ───────────────────────────────────────────────────────
const AssignTaskDialog = ({ open, onClose, editId, initialForm, onSaved, options }) => {
    const [form, setForm]     = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const userName = getDecreyptedData("userID");

    // task search state
    const [taskOptions, setTaskOptions]   = useState([]);
    const [taskLoading, setTaskLoading]   = useState(false);
    const taskSearchTimer = useRef(null);

    // recipient search state
    const [recipientOptions, setRecipientOptions]   = useState([]);
    const [recipientLoading, setRecipientLoading]   = useState(false);
    const [recipientInputVal, setRecipientInputVal] = useState("");
    const recipientSearchTimer = useRef(null);

    // ── populate form on open ─────────────────────────────────────────────────
    useEffect(() => {
        if (open) {
            if (initialForm) {
                setForm(initialForm);
            } else {
                setForm({ ...EMPTY_FORM, deadline: nowLocal() });
            }
            setErrors({});
            setRecipientInputVal("");
            setTaskOptions(options || []);
        }
    }, [open, initialForm, options]);

    const setField = (field, value) => {
        setForm(p  => ({ ...p,  [field]: value }));
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
                const res  = await getData(API.SEARCH_TASKS(query));
                const list = Array.isArray(res) ? res : res?.data ?? [];
                setTaskOptions(list);
            } catch { setTaskOptions([]); }
            finally   { setTaskLoading(false); }
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
                const addedEmails = form.recipients.map(r => r.email);
                setRecipientOptions(list.filter(u => !addedEmails.includes(u.email ?? u.emailaddress)));
            } catch { setRecipientOptions([]); }
            finally   { setRecipientLoading(false); }
        }, 350);
    };

    const addRecipient = (user) => {
        if (!user) return;
        const email = user.email ?? user.emailaddress ?? "";
        const name  = user.name  ?? user.username  ?? email;
        if (!email) return;
        if (form.recipients.some(r => r.email === email)) return;
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
        if (!form.task)                  e.task       = "Please select a task";
        if (form.recipients.length === 0) e.recipients = "Add at least one recipient";
        if (!form.deadline)              e.deadline   = "Deadline is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const taskName = typeof form.task === "object" ? form.task?.task ?? "" : form.task;
            const payload  = {
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
                timer: 2800,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave:", err);
            Swal.fire("Error", "Failed to save task.", "error");
        } finally { setSaving(false); }
    };

    // ─────────────────────────────────────────────────────────────────────────
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
                },
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

                    {/* ── Select Task ── */}
                    <Autocomplete
                        options={taskOptions}
                        getOptionLabel={(opt) => (typeof opt === "object" ? opt.task ?? "" : opt)}
                        value={form.task}
                        onChange={(_, val) => setField("task", val)}
                        onInputChange={(_, val, reason) => { if (reason === "input") searchTasks(val); }}
                        loading={taskLoading}
                        isOptionEqualToValue={(opt, val) => opt?.id === val?.id || opt === val}
                        filterOptions={(x) => x}
                        noOptionsText={form.taskInput?.trim() ? "No tasks found" : "Type to search tasks…"}
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

                    {/* ── Recipients ── */}
                    <Box>
                        <Typography
                            fontSize={12.5} fontWeight={600} color="text.secondary" mb={0.8}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
                        >
                            <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Recipients (emails)
                            <Chip
                                label={`${form.recipients.length} added`}
                                size="small"
                                sx={{
                                    ml: 0.5, height: 18, fontSize: 10.5,
                                    bgcolor: form.recipients.length > 0 ? alpha(TEAL, 0.12) : "#f3f4f6",
                                    color:   form.recipients.length > 0 ? TEAL_DARK : "text.secondary",
                                }}
                            />
                        </Typography>

                        {/* chips */}
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

                        {/* search autocomplete */}
                        <Autocomplete
                            options={recipientOptions}
                            getOptionLabel={(opt) =>
                                typeof opt === "object"
                                    ? `${opt.name ?? opt.username ?? ""} ${opt.email ?? opt.emailaddress ?? ""}`
                                    : opt
                            }
                            inputValue={recipientInputVal}
                            onInputChange={(_, val, reason) => { if (reason === "input") searchRecipients(val); }}
                            value={null}
                            onChange={(_, val) => { if (val) addRecipient(val); }}
                            loading={recipientLoading}
                            filterOptions={(x) => x}
                            noOptionsText={recipientInputVal.trim() ? "No users found" : "Search by name or email…"}
                            clearOnBlur={false}
                            blurOnSelect
                            renderOption={(props, opt) => (
                                <Box component="li" {...props} sx={{ py: 1, px: 1.5 }}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{
                                            width: 32, height: 32, fontSize: 12, fontWeight: 700,
                                            bgcolor: alpha(TEAL, 0.15), color: TEAL_DARK, flexShrink: 0,
                                        }}>
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
                                        <Chip
                                            label="+ Add" size="small"
                                            sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }}
                                        />
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
                        <Typography
                            fontSize={12.5} fontWeight={600} color="text.secondary" mb={1}
                            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
                        >
                            <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                            Reminder Frequency
                            <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>
                                (sends to all recipients)
                            </Typography>
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {REMINDER_OPTIONS.map((opt) => {
                                const isActive = form.reminderFrequency === opt;
                                const icons    = { None: "🔕", Daily: "📅", Weekly: "🗓️", Monthly: "📆" };
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
                                            "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
                                        }}
                                    >
                                        <span style={{ fontSize: 15 }}>{icons[opt]}</span>
                                        <span>{opt}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ── Assigned at banner ── */}
                    <Paper
                        variant="outlined"
                        sx={{
                            display: "flex", alignItems: "center", gap: 1.2,
                            px: 2, py: 1.3,
                            bgcolor: TEAL_LIGHT,
                            border: `1px solid ${TEAL_MID}`,
                            borderRadius: "10px",
                        }}
                    >
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
                        bgcolor: TEAL, "&:hover": { bgcolor: "#004d40" },
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

export default AssignTaskDialog;