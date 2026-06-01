// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Box,
//     Typography,
//     Paper,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     MenuItem,
//     Chip,
//     Tooltip,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Skeleton,
//     InputAdornment,
//     Divider,
//     alpha,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Swal from "sweetalert2";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate } from "react-router-dom";

// // ── Palette matching the teal sidebar theme ───────────────────────────────────
// const TEAL = "#228b7f";
// const TEAL_DARK = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ── API base paths ─────────────────────────────────────────────────────────────
// const API = {
//     // ── Assigned tasks CRUD ──
//     CREATE:  "dailytask_review/assign/create/",
//     GET_ALL: "dailytask_review/assign/",
//     UPDATE:  (pk) => `dailytask_review/assign/update/${pk}/`,
//     DELETE:  (pk) => `dailytask_review/assign/delete/${pk}/`,

//     // ── Reference data from backend ──
//     GET_TASKS:   "dailytask_review/tasks/",        // task list for dropdown
//     GET_USERS:   "dailytask_review/users/",         // email list for dropdown
//     // GET_API_KEYS:"dailytask_review/apikeys/",       // api keys for dropdown
// };

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const nowISO    = () => new Date().toISOString();
// const fmtDate   = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const fmtTime   = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
// const statusColor = (s) => {
//     const m = { Pending:"#f57c00", Active:"#2e7d32", Completed:"#1565c0", Cancelled:"#c62828" };
//     return m[s] ?? TEAL;
// };
// const EMPTY_FORM = {
//     task_id:    "",
//     assignee:   "",
//     email:      "",
//     // api_key:    "",
//     notes:      "",
//     status:     "Pending",
// };

// // ══════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     // ── state ──
//     const [assignments, setAssignments] = useState([]);
//     const [tasks,       setTasks]       = useState([]);
//     const [users,       setUsers]       = useState([]);
//     // const [apiKeys,     setApiKeys]     = useState([]);
//     const [loading,     setLoading]     = useState(false);
//     const [dialogOpen,  setDialogOpen]  = useState(false);
//     const [editId,      setEditId]      = useState(null);   // null = create mode
//     const [form,        setForm]        = useState(EMPTY_FORM);
//     const [errors,      setErrors]      = useState({});
//     const [saving,      setSaving]      = useState(false);

//     // ── fetch all reference data ──
//     const fetchAll = useCallback(async () => {
//         setLoading(true);
//         try {
//             const [assignRes, taskRes, userRes, keyRes] = await Promise.allSettled([
//                 getData(API.GET_ALL),
//                 getData(API.GET_TASKS),
//                 getData(API.GET_USERS),
//                 // getData(API.GET_API_KEYS),
//             ]);
//             const safe = (r) => (r.status === "fulfilled" ? (Array.isArray(r.value) ? r.value : r.value?.data ?? []) : []);
//             setAssignments(safe(assignRes));
//             setTasks(safe(taskRes));
//             setUsers(safe(userRes));
//             // setApiKeys(safe(keyRes));
//         } catch (err) {
//             console.error("fetchAll error:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // ── auto-fill email when user changes ──
//     const handleFormChange = (field, value) => {
//         setForm((prev) => {
//             const next = { ...prev, [field]: value };
//             // if user selected from dropdown, auto-fill their email
//             if (field === "assignee") {
//                 const found = users.find((u) => (u.name ?? u.username) === value);
//                 if (found?.email) next.email = found.email;
//             }
//             return next;
//         });
//         setErrors((e) => ({ ...e, [field]: "" }));
//     };

//     // ── validation ──
//     const validate = () => {
//         const e = {};
//         if (!form.task_id)  e.task_id  = "Please select a task";
//         if (!form.assignee) e.assignee = "Assignee is required";
//         if (!form.email)    e.email    = "Email is required";
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     // ── open dialog ──
//     const openCreate = () => {
//         setEditId(null);
//         setForm({ ...EMPTY_FORM, assigned_at: nowISO() });
//         setErrors({});
//         setDialogOpen(true);
//     };
//     const openEdit = (row) => {
//         setEditId(row.id);
//         setForm({
//             task_id:  String(row.task_id   ?? row.task ?? ""),
//             assignee: row.assignee ?? "",
//             email:    row.email    ?? "",
//             // api_key:  row.api_key  ?? "",
//             notes:    row.notes    ?? "",
//             status:   row.status   ?? "Pending",
//         });
//         setErrors({});
//         setDialogOpen(true);
//     };

//     // ── save (create / update) ──
//     const handleSave = async () => {
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const fd = new FormData();
//             fd.append("task_id",     form.task_id);
//             fd.append("assignee",    form.assignee);
//             fd.append("email",       form.email);
//             // fd.append("api_key",     form.api_key);
//             fd.append("notes",       form.notes);
//             fd.append("status",      form.status);
//             fd.append("assigned_at", nowISO());

//             if (editId) {
//                 const res = await postData(API.UPDATE(editId), fd);
//                 console.log(`PATCH assign/update/${editId}/`, res);
//             } else {
//                 const res = await postData(API.CREATE, fd);
//                 console.log("POST assign/create/", res);
//             }

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Assignment Updated!" : "Task Assigned!",
//                 text: `Assigned to ${form.assignee} — notification sent to ${form.email}`,
//                 timer: 2200,
//                 showConfirmButton: false,
//                 timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave error:", err);
//             Swal.fire("Error", "Failed to save assignment.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ── delete ──
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Remove Assignment?",
//             html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#c62828",
//             confirmButtonText: "Yes, remove",
//             cancelButtonText: "Cancel",
//         }).then(async (result) => {
//             if (!result.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.DELETE(row.id)}`, {
//                     method: "DELETE",
//                     headers: { Accept: "application/json" },
//                 });
//                 await fetchAll();
//             } catch (err) {
//                 console.error("handleDelete error:", err);
//                 Swal.fire("Error", "Failed to remove assignment.", "error");
//             }
//         });
//     };

//     // ── task label helper ──
//     const taskLabel = (id) => {
//         const t = tasks.find((t) => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? id ?? "—";
//     };

//     // ── render ────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 3 }}>
//             {/* ── Breadcrumb ── */}
//             <Box mb={2.5} ml={0}>
//                 <Breadcrumbs
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                     sx={{ fontSize: 13 }}
//                 >
//                     <Link
//                         underline="hover"
//                         sx={{ cursor: "pointer", color: TEAL }}
//                         onClick={() => navigate("/tools")}
//                     >
//                         Tools
//                     </Link>
//                     <Link
//                         underline="hover"
//                         sx={{ cursor: "pointer", color: TEAL }}
//                         onClick={() => navigate("/tools/daily_task_review")}
//                     >
//                         Daily Task Review
//                     </Link>
//                     <Typography color="text.primary" fontSize={13}>
//                         Assign Task
//                     </Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* ── Header row ── */}
//             <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="space-between"
//                 mb={2.5}
//             >
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 24 }} />
//                     <Typography fontWeight={700} fontSize={17}>
//                         Assign Task
//                     </Typography>
//                     {!loading && (
//                         <Chip
//                             label={`${assignments.length} assigned`}
//                             size="small"
//                             sx={{
//                                 bgcolor: TEAL_LIGHT,
//                                 color: TEAL_DARK,
//                                 fontWeight: 600,
//                                 fontSize: 11,
//                                 ml: 0.5,
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* ── + Assign Task button ── */}
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={openCreate}
//                     sx={{
//                         bgcolor: TEAL,
//                         "&:hover": { bgcolor: TEAL_DARK },
//                         textTransform: "none",
//                         fontWeight: 600,
//                         borderRadius: "8px",
//                         px: 2.5,
//                         boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}`,
//                     }}
//                 >
//                     Assign Task
//                 </Button>
//             </Box>

//             {/* ── Assignment table ── */}
//             <Paper
//                 elevation={0}
//                 sx={{
//                     border: "1px solid #e0e0e0",
//                     borderRadius: "10px",
//                     overflow: "hidden",
//                 }}
//             >
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ bgcolor: TEAL }}>
//                                 {["SN", "Task", "Assignee", "Email", "Assigned At", "Status", "Actions"].map((h) => (
//                                     <TableCell
//                                         key={h}
//                                         sx={{
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             fontSize: 12.5,
//                                             py: 1.4,
//                                             letterSpacing: ".02em",
//                                             whiteSpace: "nowrap",
//                                         }}
//                                     >
//                                         {h}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {/* loading skeletons */}
//                             {loading &&
//                                 Array.from({ length: 4 }).map((_, i) => (
//                                     <TableRow key={i}>
//                                         {Array.from({ length: 8 }).map((__, j) => (
//                                             <TableCell key={j}>
//                                                 <Skeleton height={22} />
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 ))}

//                             {/* empty state */}
//                             {!loading && assignments.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
//                                         <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
//                                             <AssignmentIndOutlinedIcon sx={{ fontSize: 40, color: TEAL_MID }} />
//                                             <Typography color="text.secondary" fontSize={14}>
//                                                 No assignments yet. Click{" "}
//                                                 <strong style={{ color: TEAL }}>+ Assign Task</strong> to get started.
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             )}

//                             {/* data rows */}
//                             {!loading &&
//                                 assignments.map((row, idx) => (
//                                     <TableRow
//                                         key={row.id ?? idx}
//                                         hover
//                                         sx={{
//                                             "&:nth-of-type(even)": { bgcolor: "#fafafa" },
//                                             "&:hover": { bgcolor: alpha(TEAL, 0.04) },
//                                         }}
//                                     >
//                                         <TableCell sx={{ color: "#aaa", fontSize: 12, width: 36 }}>
//                                             {idx + 1}
//                                         </TableCell>

//                                         <TableCell sx={{ fontWeight: 600, fontSize: 13, maxWidth: 160 }}>
//                                             <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
//                                                 <Typography
//                                                     noWrap
//                                                     fontSize={13}
//                                                     fontWeight={600}
//                                                     sx={{ maxWidth: 150 }}
//                                                 >
//                                                     {taskLabel(row.task_id ?? row.task)}
//                                                 </Typography>
//                                             </Tooltip>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" alignItems="center" gap={0.8}>
//                                                 <Box
//                                                     sx={{
//                                                         width: 28, height: 28, borderRadius: "50%",
//                                                         bgcolor: alpha(TEAL, 0.15),
//                                                         color: TEAL_DARK,
//                                                         display: "flex", alignItems: "center",
//                                                         justifyContent: "center",
//                                                         fontSize: 12, fontWeight: 700,
//                                                         flexShrink: 0,
//                                                     }}
//                                                 >
//                                                     {(row.assignee ?? "?")[0].toUpperCase()}
//                                                 </Box>
//                                                 <Typography fontSize={13}>{row.assignee ?? "—"}</Typography>
//                                             </Box>
//                                         </TableCell>

//                                         <TableCell sx={{ fontSize: 12.5, color: "#555", fontFamily: "monospace" }}>
//                                             {row.email ?? "—"}
//                                         </TableCell>

//                                         <TableCell>
//                                             {row.api_key ? (
//                                                 <Chip
//                                                     icon={<VpnKeyOutlinedIcon sx={{ fontSize: "14px !important" }} />}
//                                                     label={String(row.api_key).slice(0, 14) + "…"}
//                                                     size="small"
//                                                     sx={{
//                                                         bgcolor: "#ede7f6",
//                                                         color: "#4527a0",
//                                                         fontSize: 11,
//                                                         fontFamily: "monospace",
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <Typography color="text.disabled" fontSize={12}>—</Typography>
//                                             )}
//                                         </TableCell>

//                                         <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                             <Typography fontSize={12} color="text.secondary">
//                                                 {fmtDate(row.assigned_at)}
//                                             </Typography>
//                                             <Typography fontSize={11} color="text.disabled">
//                                                 {fmtTime(row.assigned_at)}
//                                             </Typography>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Chip
//                                                 label={row.status ?? "Pending"}
//                                                 size="small"
//                                                 sx={{
//                                                     bgcolor: alpha(statusColor(row.status), 0.1),
//                                                     color: statusColor(row.status),
//                                                     fontWeight: 700,
//                                                     fontSize: 11,
//                                                     border: `1px solid ${alpha(statusColor(row.status), 0.25)}`,
//                                                 }}
//                                             />
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" gap={0.5}>
//                                                 <Tooltip title="Edit" arrow>
//                                                     <IconButton
//                                                         size="small"
//                                                         onClick={() => openEdit(row)}
//                                                         sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}
//                                                     >
//                                                         <EditOutlinedIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete" arrow>
//                                                     <IconButton
//                                                         size="small"
//                                                         onClick={() => handleDelete(row)}
//                                                         sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}
//                                                     >
//                                                         <DeleteOutlineIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </Box>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>

//             {/* helper hint */}
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
//                 Click <strong>+ Assign Task</strong> to create · <strong>✎</strong> to edit · <strong>🗑</strong> to remove
//             </Typography>

//             {/* ══════════════════════════════════════════════════════════════
//                 ── Assign / Edit Dialog ──
//             ══════════════════════════════════════════════════════════════ */}
//             <Dialog
//                 open={dialogOpen}
//                 onClose={() => setDialogOpen(false)}
//                 maxWidth="sm"
//                 fullWidth
//                 PaperProps={{
//                     sx: {
//                         borderRadius: "14px",
//                         overflow: "hidden",
//                     },
//                 }}
//             >
//                 {/* Accent strip */}
//                 <Box sx={{ height: 4, bgcolor: TEAL }} />

//                 <DialogTitle
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1.5,
//                         pb: 1,
//                         pt: 2.5,
//                         fontWeight: 700,
//                         fontSize: 16,
//                     }}
//                 >
//                     <AssignmentIndOutlinedIcon sx={{ color: TEAL }} />
//                     {editId ? "Edit Assignment" : "Assign Task"}
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.5}>

//                         {/* ── Task selector ── */}
//                         <TextField
//                             select
//                             label="Select Task"
//                             value={form.task_id}
//                             onChange={(e) => handleFormChange("task_id", e.target.value)}
//                             error={!!errors.task_id}
//                             helperText={errors.task_id}
//                             size="small"
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={fieldSx}
//                         >
//                             <MenuItem value="" disabled>
//                                 <em style={{ color: "#aaa" }}>— Choose a task —</em>
//                             </MenuItem>
//                             {tasks.map((t) => (
//                                 <MenuItem key={t.id} value={String(t.id)}>
//                                     {t.task ?? t.name ?? t.title}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* ── Assignee ── */}
//                         <TextField
//                             select={users.length > 0}
//                             label="Assignee"
//                             value={form.assignee}
//                             onChange={(e) => handleFormChange("assignee", e.target.value)}
//                             error={!!errors.assignee}
//                             helperText={errors.assignee}
//                             placeholder="Enter name or select from list"
//                             size="small"
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={fieldSx}
//                         >
//                             {users.length > 0 && [
//                                 <MenuItem key="_empty" value="" disabled>
//                                     <em style={{ color: "#aaa" }}>— Select assignee —</em>
//                                 </MenuItem>,
//                                 ...users.map((u) => (
//                                     <MenuItem key={u.id ?? u.email} value={u.name ?? u.username}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box
//                                                 sx={{
//                                                     width: 24, height: 24, borderRadius: "50%",
//                                                     bgcolor: alpha(TEAL, 0.15), color: TEAL_DARK,
//                                                     display: "flex", alignItems: "center",
//                                                     justifyContent: "center", fontSize: 11, fontWeight: 700,
//                                                 }}
//                                             >
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Box>
//                                             {u.name ?? u.username}
//                                         </Box>
//                                     </MenuItem>
//                                 )),
//                             ]}
//                         </TextField>

//                         {/* ── Email (auto-filled) ── */}
//                         <TextField
//                             label="Email"
//                             value={form.email}
//                             onChange={(e) => handleFormChange("email", e.target.value)}
//                             error={!!errors.email}
//                             helperText={errors.email || "Auto-filled from user profile · editable"}
//                             placeholder="assignee@example.com"
//                             size="small"
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <EmailOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={fieldSx}
//                         />

//                         {/* ── API Key ── */}
//                         {/* <TextField
//                             select={apiKeys.length > 0}
//                             label="API Key"
//                             value={form.api_key}
//                             onChange={(e) => handleFormChange("api_key", e.target.value)}
//                             placeholder="Loaded from backend"
//                             size="small"
//                             fullWidth
//                             helperText="Fetched from backend — select or auto-populated"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <VpnKeyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={fieldSx}
//                         >
//                             {apiKeys.length > 0 && [
//                                 <MenuItem key="_empty" value="" disabled>
//                                     <em style={{ color: "#aaa" }}>— Select API key —</em>
//                                 </MenuItem>,
//                                 ...apiKeys.map((k) => (
//                                     <MenuItem key={k.id ?? k.key} value={k.key ?? k.value}>
//                                         <Typography fontFamily="monospace" fontSize={13}>
//                                             {(k.key ?? k.value ?? "").slice(0, 28)}…
//                                         </Typography>
//                                     </MenuItem>
//                                 )),
//                             ]}
//                         </TextField> */}

//                         {/* ── Status ── */}
//                         <TextField
//                             select
//                             label="Status"
//                             value={form.status}
//                             onChange={(e) => handleFormChange("status", e.target.value)}
//                             size="small"
//                             fullWidth
//                             sx={fieldSx}
//                         >
//                             {["Pending", "Active", "Completed", "Cancelled"].map((s) => (
//                                 <MenuItem key={s} value={s}>
//                                     <Box display="flex" alignItems="center" gap={1}>
//                                         <Box
//                                             sx={{
//                                                 width: 8, height: 8, borderRadius: "50%",
//                                                 bgcolor: statusColor(s),
//                                             }}
//                                         />
//                                         {s}
//                                     </Box>
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* ── Auto date display ── */}
//                         <Paper
//                             variant="outlined"
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1.2,
//                                 px: 2, py: 1.2,
//                                 bgcolor: TEAL_LIGHT,
//                                 border: `1px solid ${TEAL_MID}`,
//                                 borderRadius: "8px",
//                             }}
//                         >
//                             <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", {
//                                     weekday: "long", day: "2-digit",
//                                     month: "long", year: "numeric",
//                                 })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", {
//                                     hour: "2-digit", minute: "2-digit", hour12: true,
//                                 })}
//                             </Typography>
//                         </Paper>

//                         {/* ── Notes ── */}
//                         <TextField
//                             label="Notes (optional)"
//                             value={form.notes}
//                             onChange={(e) => handleFormChange("notes", e.target.value)}
//                             placeholder="Add any notes for the assignee…"
//                             size="small"
//                             fullWidth
//                             multiline
//                             rows={2}
//                             sx={fieldSx}
//                         />
//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button
//                         onClick={() => setDialogOpen(false)}
//                         sx={{
//                             textTransform: "none",
//                             color: "text.secondary",
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             px: 2.5,
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSave}
//                         disabled={saving}
//                         sx={{
//                             bgcolor: TEAL,
//                             "&:hover": { bgcolor: TEAL_DARK },
//                             textTransform: "none",
//                             fontWeight: 700,
//                             borderRadius: "8px",
//                             px: 3,
//                             boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}`,
//                         }}
//                     >
//                         {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// // ── shared TextField sx ────────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// export default AssignTask;


// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Box,
//     Typography,
//     Paper,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     MenuItem,
//     Chip,
//     Tooltip,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Skeleton,
//     InputAdornment,
//     Divider,
//     alpha,
//     Grid,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
// import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
// import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Swal from "sweetalert2";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate } from "react-router-dom";

// // ── Theme ─────────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// // ── Static option lists ────────────────────────────────────────────────────────
// const OEM_OPTIONS = [
//     "Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"
// ];

// const SLOT_OPTIONS = [
//     { value: "morning", label: "🌤  Morning", color: "#f57c00" },
//     { value: "evening", label: "🌙  Evening", color: "#5c6bc0" },
//     { value: "afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "night",   label: "🌌  Night",   color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High",     color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
// ];

// // ── API paths ──────────────────────────────────────────────────────────────────
// const API = {
//     CREATE:    "dailytask_review/assign/create/",
//     GET_ALL:   "dailytask_review/assign/",
//     UPDATE:    (pk) => `dailytask_review/assign/update/${pk}/`,
//     DELETE:    (pk) => `dailytask_review/assign/delete/${pk}/`,
//     GET_TASKS: "dailytask_review/tasks/",
//     GET_USERS: "dailytask_review/users/",
// };

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const nowISO      = () => new Date().toISOString();
// const nowLocal    = () => {
//     // Returns "YYYY-MM-DDTHH:MM" for datetime-local input default
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate     = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN",  { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const fmtTime     = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN",  { hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
// const fmtDeadline = (dt)  => {
//     if (!dt) return "—";
//     const d = new Date(dt);
//     return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
//         + "  " + d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
// };

// const statusColor = (s) => {
//     const m = { Pending:"#f57c00", Active:"#2e7d32", Completed:"#1565c0", Cancelled:"#c62828" };
//     return m[s] ?? TEAL;
// };
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color:"#777", bg:"#f5f5f5" };
// const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value === v);

// const EMPTY_FORM = {
//     task_id:  "",
//     assignee: "",
//     email:    "",
//     oem:      "",
//     slot:     "",
//     priority: "Medium",
//     deadline: "",
//     Remark:    "",
//     status:   "Pending",
// };

// // ══════════════════════════════════════════════════════════════════════════════
// const AssignTask = () => {
//     const navigate = useNavigate();

//     const [assignments, setAssignments] = useState([]);
//     const [tasks,       setTasks]       = useState([]);
//     const [users,       setUsers]       = useState([]);
//     const [loading,     setLoading]     = useState(false);
//     const [dialogOpen,  setDialogOpen]  = useState(false);
//     const [editId,      setEditId]      = useState(null);
//     const [form,        setForm]        = useState(EMPTY_FORM);
//     const [errors,      setErrors]      = useState({});
//     const [saving,      setSaving]      = useState(false);

//     // ── fetch ──
//     const fetchAll = useCallback(async () => {
//         setLoading(true);
//         try {
//             const [assignRes, taskRes, userRes] = await Promise.allSettled([
//                 getData(API.GET_ALL),
//                 getData(API.GET_TASKS),
//                 getData(API.GET_USERS),
//             ]);
//             const safe = (r) => r.status === "fulfilled"
//                 ? (Array.isArray(r.value) ? r.value : r.value?.data ?? []) : [];
//             setAssignments(safe(assignRes));
//             setTasks(safe(taskRes));
//             setUsers(safe(userRes));
//         } catch (err) {
//             console.error("fetchAll error:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // ── form change ──
//     const handleFormChange = (field, value) => {
//         setForm((prev) => {
//             const next = { ...prev, [field]: value };
//             if (field === "assignee") {
//                 const found = users.find((u) => (u.name ?? u.username) === value);
//                 if (found?.email) next.email = found.email;
//             }
//             return next;
//         });
//         setErrors((e) => ({ ...e, [field]: "" }));
//     };

//     // ── validation ──
//     const validate = () => {
//         const e = {};
//         if (!form.task_id)  e.task_id  = "Please select a task";
//         if (!form.assignee) e.assignee = "Assignee is required";
//         if (!form.email)    e.email    = "Email is required";
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
//         if (!form.oem)      e.oem      = "OEM is required";
//         if (!form.slot)     e.slot     = "Slot is required";
//         if (!form.deadline) e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     // ── dialog open ──
//     const openCreate = () => {
//         setEditId(null);
//         setForm({ ...EMPTY_FORM, deadline: nowLocal() });
//         setErrors({});
//         setDialogOpen(true);
//     };
//     const openEdit = (row) => {
//         setEditId(row.id);
//         setForm({
//             task_id:  String(row.task_id  ?? row.task ?? ""),
//             assignee: row.assignee ?? "",
//             email:    row.email    ?? "",
//             oem:      row.oem      ?? "",
//             slot:     row.slot     ?? "",
//             priority: row.priority ?? "Medium",
//             deadline: row.deadline ? row.deadline.slice(0, 16) : nowLocal(),
//             Remark:    row.Remark    ?? "",
//             status:   row.status   ?? "Pending",
//         });
//         setErrors({});
//         setDialogOpen(true);
//     };

//     // ── save ──
//     const handleSave = async () => {
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const fd = new FormData();
//             fd.append("task_id",     form.task_id);
//             fd.append("assignee",    form.assignee);
//             fd.append("email",       form.email);
//             fd.append("oem",         form.oem);
//             fd.append("slot",        form.slot);
//             fd.append("priority",    form.priority);
//             fd.append("deadline",    new Date(form.deadline).toISOString());
//             fd.append("Remark",       form.Remark);
//             fd.append("status",      form.status);
//             fd.append("assigned_at", nowISO());

//             if (editId) {
//                 await postData(API.UPDATE(editId), fd);
//             } else {
//                 await postData(API.CREATE, fd);
//             }

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Assignment Updated!" : "Task Assigned!",
//                 text: `Assigned to ${form.assignee} — notification sent to ${form.email}`,
//                 timer: 2200,
//                 showConfirmButton: false,
//                 timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave error:", err);
//             Swal.fire("Error", "Failed to save assignment.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ── delete ──
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Remove Assignment?",
//             html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#c62828",
//             confirmButtonText: "Yes, remove",
//         }).then(async (result) => {
//             if (!result.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.DELETE(row.id)}`, {
//                     method: "DELETE",
//                     headers: { Accept: "application/json" },
//                 });
//                 await fetchAll();
//             } catch (err) {
//                 Swal.fire("Error", "Failed to remove assignment.", "error");
//             }
//         });
//     };

//     const taskLabel = (id) => {
//         const t = tasks.find((t) => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? id ?? "—";
//     };

//     // ════════════════════════════════════════════════════════════════════════
//     return (
//         <Box sx={{ p: 3 }}>

//             {/* Breadcrumb */}
//             <Box mb={2.5}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* Header */}
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AssignmentIndOutlinedIcon sx={{ color:TEAL, fontSize:24 }} />
//                     <Typography fontWeight={700} fontSize={17}>Assign Task</Typography>
//                     {!loading && (
//                         <Chip label={`${assignments.length} assigned`} size="small"
//                             sx={{ bgcolor:TEAL_LIGHT, color:TEAL_DARK, fontWeight:600, fontSize:11, ml:0.5 }} />
//                     )}
//                 </Box>
//                 <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                     sx={{ bgcolor:TEAL, "&:hover":{ bgcolor:TEAL_DARK }, textTransform:"none",
//                           fontWeight:600, borderRadius:"8px", px:2.5,
//                           boxShadow:`0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                     Assign Task
//                 </Button>
//             </Box>

//             {/* Table */}
//             <Paper elevation={0} sx={{ border:"1px solid #e0e0e0", borderRadius:"10px", overflow:"hidden" }}>
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ bgcolor:TEAL }}>
//                                 {["SN","Task","Assignee","Email","OEM","Slot","Priority","Deadline","Status","Actions"].map((h) => (
//                                     <TableCell key={h} sx={{ color:"#fff", fontWeight:700, fontSize:12.5,
//                                         py:1.4, letterSpacing:".02em", whiteSpace:"nowrap" }}>{h}</TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>

//                             {/* skeleton */}
//                             {loading && Array.from({ length:4 }).map((_, i) => (
//                                 <TableRow key={i}>
//                                     {Array.from({ length:10 }).map((__, j) => (
//                                         <TableCell key={j}><Skeleton height={22} /></TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))}

//                             {/* empty */}
//                             {!loading && assignments.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={10} align="center" sx={{ py:6 }}>
//                                         <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
//                                             <AssignmentIndOutlinedIcon sx={{ fontSize:40, color:TEAL_MID }} />
//                                             <Typography color="text.secondary" fontSize={14}>
//                                                 No assignments yet. Click <strong style={{ color:TEAL }}>+ Assign Task</strong> to get started.
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             )}

//                             {/* rows */}
//                             {!loading && assignments.map((row, idx) => {
//                                 const pm = priorityMeta(row.priority);
//                                 const sm = slotMeta(row.slot);
//                                 return (
//                                     <TableRow key={row.id ?? idx} hover
//                                         sx={{ "&:nth-of-type(even)":{ bgcolor:"#fafafa" },
//                                               "&:hover":{ bgcolor:alpha(TEAL, 0.04) } }}>

//                                         <TableCell sx={{ color:"#aaa", fontSize:12, width:36 }}>{idx+1}</TableCell>

//                                         <TableCell>
//                                             <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
//                                                 <Typography noWrap fontSize={13} fontWeight={600} sx={{ maxWidth:140 }}>
//                                                     {taskLabel(row.task_id ?? row.task)}
//                                                 </Typography>
//                                             </Tooltip>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" alignItems="center" gap={0.8}>
//                                                 <Box sx={{ width:28, height:28, borderRadius:"50%",
//                                                     bgcolor:alpha(TEAL,0.15), color:TEAL_DARK,
//                                                     display:"flex", alignItems:"center", justifyContent:"center",
//                                                     fontSize:12, fontWeight:700, flexShrink:0 }}>
//                                                     {(row.assignee ?? "?")[0].toUpperCase()}
//                                                 </Box>
//                                                 <Typography fontSize={13}>{row.assignee ?? "—"}</Typography>
//                                             </Box>
//                                         </TableCell>

//                                         <TableCell sx={{ fontSize:12.5, color:"#555", fontFamily:"monospace" }}>
//                                             {row.email ?? "—"}
//                                         </TableCell>

//                                         {/* OEM */}
//                                         <TableCell>
//                                             {row.oem ? (
//                                                 <Chip label={row.oem} size="small"
//                                                     sx={{ bgcolor:"#e3f2fd", color:"#0d47a1", fontWeight:600, fontSize:11,
//                                                           border:"1px solid #90caf9" }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         {/* Slot */}
//                                         <TableCell>
//                                             {sm ? (
//                                                 <Chip label={sm.label} size="small"
//                                                     sx={{ bgcolor:alpha(sm.color, 0.1), color:sm.color,
//                                                           fontWeight:600, fontSize:11,
//                                                           border:`1px solid ${alpha(sm.color,0.3)}` }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         {/* Priority */}
//                                         <TableCell>
//                                             {row.priority ? (
//                                                 <Chip label={row.priority} size="small"
//                                                     sx={{ bgcolor:pm.bg, color:pm.color, fontWeight:700,
//                                                           fontSize:11, border:`1px solid ${alpha(pm.color,0.3)}` }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         {/* Deadline */}
//                                         <TableCell sx={{ whiteSpace:"nowrap" }}>
//                                             {row.deadline ? (
//                                                 <>
//                                                     <Typography fontSize={12} color="text.secondary">{fmtDate(row.deadline)}</Typography>
//                                                     <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
//                                                 </>
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         {/* Status */}
//                                         <TableCell>
//                                             <Chip label={row.status ?? "Pending"} size="small"
//                                                 sx={{ bgcolor:alpha(statusColor(row.status),0.1),
//                                                       color:statusColor(row.status), fontWeight:700,
//                                                       fontSize:11, border:`1px solid ${alpha(statusColor(row.status),0.25)}` }} />
//                                         </TableCell>

//                                         {/* Actions */}
//                                         <TableCell>
//                                             <Box display="flex" gap={0.5}>
//                                                 <Tooltip title="Edit" arrow>
//                                                     <IconButton size="small" onClick={() => openEdit(row)}
//                                                         sx={{ color:TEAL, "&:hover":{ bgcolor:alpha(TEAL,0.1) } }}>
//                                                         <EditOutlinedIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete" arrow>
//                                                     <IconButton size="small" onClick={() => handleDelete(row)}
//                                                         sx={{ color:"#c62828", "&:hover":{ bgcolor:"#fdecea" } }}>
//                                                         <DeleteOutlineIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </Box>
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>

//             <Typography variant="caption" color="text.secondary" sx={{ mt:1, display:"block" }}>
//                 Click <strong>+ Assign Task</strong> to create · <strong>✎</strong> to edit · <strong>🗑</strong> to remove
//             </Typography>

//             {/* ══════════ DIALOG ══════════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth
//                 PaperProps={{ sx:{ borderRadius:"14px", overflow:"hidden" } }}>

//                 {/* accent bar */}
//                 <Box sx={{ height:4, background:`linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />

//                 <DialogTitle sx={{ display:"flex", alignItems:"center", gap:1.5,
//                     pb:1, pt:2.5, fontWeight:700, fontSize:16 }}>
//                     <AssignmentIndOutlinedIcon sx={{ color:TEAL }} />
//                     {editId ? "Edit Assignment" : "Assign Task"}
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ pt:2.5, pb:1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* ── Select Task ── */}
//                         <TextField select label="Select Task" value={form.task_id}
//                             onChange={(e) => handleFormChange("task_id", e.target.value)}
//                             error={!!errors.task_id} helperText={errors.task_id}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment:(
//                                 <InputAdornment position="start">
//                                     <TaskAltOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                 </InputAdornment>) }}>
//                             <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Choose a task —</em></MenuItem>
//                             {tasks.map((t) => (
//                                 <MenuItem key={t.id} value={String(t.id)}>
//                                     {t.task ?? t.name ?? t.title}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* ── Assignee ── */}
//                         <TextField select={users.length > 0} label="Assignee" value={form.assignee}
//                             onChange={(e) => handleFormChange("assignee", e.target.value)}
//                             error={!!errors.assignee} helperText={errors.assignee}
//                             placeholder="Enter name or select from list"
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment:(
//                                 <InputAdornment position="start">
//                                     <PersonOutlineIcon sx={{ fontSize:18, color:TEAL }} />
//                                 </InputAdornment>) }}>
//                             {users.length > 0 && [
//                                 <MenuItem key="_empty" value="" disabled>
//                                     <em style={{ color:"#aaa" }}>— Select assignee —</em>
//                                 </MenuItem>,
//                                 ...users.map((u) => (
//                                     <MenuItem key={u.id ?? u.email} value={u.name ?? u.username}>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Box sx={{ width:24, height:24, borderRadius:"50%",
//                                                 bgcolor:alpha(TEAL,0.15), color:TEAL_DARK,
//                                                 display:"flex", alignItems:"center", justifyContent:"center",
//                                                 fontSize:11, fontWeight:700 }}>
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Box>
//                                             {u.name ?? u.username}
//                                         </Box>
//                                     </MenuItem>
//                                 )),
//                             ]}
//                         </TextField>

//                         {/* ── Email ── */}
//                         <TextField label="Email" value={form.email}
//                             onChange={(e) => handleFormChange("email", e.target.value)}
//                             error={!!errors.email}
//                             helperText={errors.email || "Auto-filled from user profile · editable"}
//                             placeholder="assignee@example.com"
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment:(
//                                 <InputAdornment position="start">
//                                     <EmailOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                 </InputAdornment>) }} />

//                         {/* ── OEM  +  Slot (2 cols) ── */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem}
//                                     onChange={(e) => handleFormChange("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(
//                                         <InputAdornment position="start">
//                                             <RouterOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                         </InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map((o) => (
//                                         <MenuItem key={o} value={o}>{o}</MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot}
//                                     onChange={(e) => handleFormChange("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(
//                                         <InputAdornment position="start">
//                                             <WbSunnyOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                         </InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Morning / Evening —</em></MenuItem>
//                                     {SLOT_OPTIONS.map((s) => (
//                                         <MenuItem key={s.value} value={s.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:s.color }} />
//                                                 {s.label}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* ── Priority  +  Status (2 cols) ── */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="Priority" value={form.priority}
//                                     onChange={(e) => handleFormChange("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(
//                                         <InputAdornment position="start">
//                                             <FlagOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                         </InputAdornment>) }}>
//                                     {PRIORITY_OPTIONS.map((p) => (
//                                         <MenuItem key={p.value} value={p.value}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:p.color }} />
//                                                 <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Status" value={form.status}
//                                     onChange={(e) => handleFormChange("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(
//                                         <InputAdornment position="start">
//                                             <AccessTimeOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                         </InputAdornment>) }}>
//                                     {["Pending","Active","Completed","Cancelled"].map((s) => (
//                                         <MenuItem key={s} value={s}>
//                                             <Box display="flex" alignItems="center" gap={1}>
//                                                 <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:statusColor(s) }} />
//                                                 {s}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         {/* ── Deadline (date + time picker) ── */}
//                         <TextField
//                             label="Deadline"
//                             type="datetime-local"
//                             value={form.deadline}
//                             onChange={(e) => handleFormChange("deadline", e.target.value)}
//                             error={!!errors.deadline}
//                             helperText={errors.deadline || "Select date and time to complete the task"}
//                             size="small"
//                             fullWidth
//                             InputLabelProps={{ shrink: true }}
//                             inputProps={{ min: nowLocal() }}
//                             sx={fieldSx}
//                             InputProps={{ startAdornment:(
//                                 <InputAdornment position="start">
//                                     <EventOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                 </InputAdornment>) }}
//                         />

//                         {/* ── Auto assigned-at strip ── */}
//                         <Paper variant="outlined" sx={{ display:"flex", alignItems:"center", gap:1.2,
//                             px:2, py:1.2, bgcolor:TEAL_LIGHT,
//                             border:`1px solid ${TEAL_MID}`, borderRadius:"8px" }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize:16, color:TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", {
//                                     weekday:"long", day:"2-digit", month:"long", year:"numeric" })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", {
//                                     hour:"2-digit", minute:"2-digit", hour12:true })}
//                             </Typography>
//                         </Paper>

//                         {/* ── Notes ── */}
//                         <TextField label="Remark (optional)" value={form.Remark}
//                             onChange={(e) => handleFormChange("Remark", e.target.value)}
//                             placeholder="Add any notes for the assignee…"
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />

//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px:3, pb:2.5, pt:1.5, gap:1 }}>
//                     <Button onClick={() => setDialogOpen(false)}
//                         sx={{ textTransform:"none", color:"text.secondary",
//                               border:"1px solid #e0e0e0", borderRadius:"8px", px:2.5 }}>
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{ bgcolor:TEAL, "&:hover":{ bgcolor:TEAL_DARK }, textTransform:"none",
//                               fontWeight:700, borderRadius:"8px", px:3,
//                               boxShadow:`0 2px 8px ${alpha(TEAL, 0.35)}` }}>
//                         {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// // ── shared TextField sx ────────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         "&:hover fieldset":   { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// export default AssignTask;

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton,
    InputAdornment,
    Divider,
    alpha,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Swal from "sweetalert2";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import { useNavigate } from "react-router-dom";

// ── Theme ─────────────────────────────────────────────────────────────────────
const TEAL       = "#228b7f";
const TEAL_DARK  = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID   = "#b2dfdb";

// ── Static option lists ────────────────────────────────────────────────────────
const OEM_OPTIONS = [
    "Nokia", "Ericsson", "Samsung", "Huawei", "ZTE",
];

const SLOT_OPTIONS = [
    { value: "morning", label: "🌤  Morning", color: "#f57c00" },
    { value: "evening", label: "🌙  Evening", color: "#5c6bc0" },
    { value: "afternoon", label: "☀️  Afternoon", color: "#f9a825" },
    { value: "night",   label: "🌌  Night",   color: "#37474f" },
];

const PRIORITY_OPTIONS = [
    { value: "Critical", color: "#c62828", bg: "#fdecea" },
    { value: "High",     color: "#e65100", bg: "#fff3e0" },
    { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
    { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
];

// ── API paths ──────────────────────────────────────────────────────────────────
const API = {
    CREATE:    "dailytask_review/assign/create/",
    GET_ALL:   "dailytask_review/assign/",
    UPDATE:    (pk) => `dailytask_review/assign/update/${pk}/`,
    DELETE:    (pk) => `dailytask_review/assign/delete/${pk}/`,
    GET_TASKS: "dailytask_review/tasks/",
    GET_USERS: "dailytask_review/users/",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const nowISO      = () => new Date().toISOString();
const nowLocal    = () => {
    // Returns "YYYY-MM-DDTHH:MM" for datetime-local input default
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};
const fmtDate     = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN",  { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtTime     = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN",  { hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
const fmtDeadline = (dt)  => {
    if (!dt) return "—";
    const d = new Date(dt);
    return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
        + "  " + d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
};

const statusColor = (s) => {
    const m = { Pending:"#f57c00", Active:"#2e7d32", Completed:"#1565c0", Cancelled:"#c62828" };
    return m[s] ?? TEAL;
};
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color:"#777", bg:"#f5f5f5" };
const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value === v);

const EMPTY_FORM = {
    task_id:  "",
    assignee: "",
    email:    "",
    oem:      "",
    slot:     "",
    priority: "Medium",
    deadline: "",
   remark:    "",
    status:   "Pending",
};

// ── Draggable Paper wrapper ────────────────────────────────────────────────────
// Attaches to the MUI Dialog's PaperComponent prop so the whole popup is movable.
function DraggablePaper({ children, ...props }) {
    const paperRef   = useRef(null);
    const isDragging = useRef(false);
    const origin     = useRef({ x: 0, y: 0 });   // mousedown position
    const translate  = useRef({ x: 0, y: 0 });   // current offset

    const onMouseDown = (e) => {
        // Only start drag when clicking the title bar (first child = DialogTitle area)
        const titleBar = paperRef.current?.querySelector("[data-drag-handle]");
        if (!titleBar || !titleBar.contains(e.target)) return;
        // Ignore clicks on interactive elements inside the title bar (close btn etc.)
        if (e.target.closest("button")) return;

        isDragging.current = true;
        origin.current = {
            x: e.clientX - translate.current.x,
            y: e.clientY - translate.current.y,
        };
        e.preventDefault();
    };

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current || !paperRef.current) return;
        const newX = e.clientX - origin.current.x;
        const newY = e.clientY - origin.current.y;

        // Clamp so popup never leaves viewport
        const rect   = paperRef.current.getBoundingClientRect();
        const maxX   = window.innerWidth  - rect.width  / 2;
        const maxY   = window.innerHeight - rect.height / 2;
        const clampX = Math.min(Math.max(newX, -(window.innerWidth  - rect.width  / 2)), maxX);
        const clampY = Math.min(Math.max(newY, -(window.innerHeight - rect.height / 2)), maxY);

        translate.current = { x: clampX, y: clampY };
        paperRef.current.style.transform = `translate(${clampX}px, ${clampY}px)`;
    }, []);

    const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup",   onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup",   onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    return (
        <Paper
            {...props}
            ref={paperRef}
            onMouseDown={onMouseDown}
            sx={{
                ...props.sx,
                // keep MUI centering but allow transform to shift it
                position: "relative",
                transition: "box-shadow 0.15s",
            }}
        >
            {children}
        </Paper>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
const AssignTask = () => {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [tasks,       setTasks]       = useState([]);
    const [users,       setUsers]       = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [dialogOpen,  setDialogOpen]  = useState(false);
    const [editId,      setEditId]      = useState(null);
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [errors,      setErrors]      = useState({});
    const [saving,      setSaving]      = useState(false);

    // ── fetch ──
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [assignRes, taskRes, userRes] = await Promise.allSettled([
                getData(API.GET_ALL),
                getData(API.GET_TASKS),
                getData(API.GET_USERS),
            ]);
            const safe = (r) => r.status === "fulfilled"
                ? (Array.isArray(r.value) ? r.value : r.value?.data ?? []) : [];
            setAssignments(safe(assignRes));
            setTasks(safe(taskRes));
            setUsers(safe(userRes));
        } catch (err) {
            console.error("fetchAll error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── form change ──
    const handleFormChange = (field, value) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "assignee") {
                const found = users.find((u) => (u.name ?? u.username) === value);
                if (found?.email) next.email = found.email;
            }
            return next;
        });
        setErrors((e) => ({ ...e, [field]: "" }));
    };

    // ── validation ──
    const validate = () => {
        const e = {};
        if (!form.task_id)  e.task_id  = "Please select a task";
        if (!form.assignee) e.assignee = "Assignee is required";
        if (!form.email)    e.email    = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.oem)      e.oem      = "OEM is required";
        if (!form.slot)     e.slot     = "Slot is required";
        if (!form.deadline) e.deadline = "Deadline is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── dialog open ──
    const openCreate = () => {
        setEditId(null);
        setForm({ ...EMPTY_FORM, deadline: nowLocal() });
        setErrors({});
        setDialogOpen(true);
    };
    const openEdit = (row) => {
        setEditId(row.id);
        setForm({
            task_id:  String(row.task_id  ?? row.task ?? ""),
            assignee: row.assignee ?? "",
            email:    row.email    ?? "",
            oem:      row.oem      ?? "",
            slot:     row.slot     ?? "",
            priority: row.priority ?? "Medium",
            deadline: row.deadline ? row.deadline.slice(0, 16) : nowLocal(),
            remark:    row.remark    ?? "",
            status:   row.status   ?? "Pending",
        });
        setErrors({});
        setDialogOpen(true);
    };

    // ── save ──
    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("task_id",     form.task_id);
            fd.append("assignee",    form.assignee);
            fd.append("email",       form.email);
            fd.append("oem",         form.oem);
            fd.append("slot",        form.slot);
            fd.append("priority",    form.priority);
            fd.append("deadline",    new Date(form.deadline).toISOString());
            fd.append("remark",       form.remark);
            fd.append("status",      form.status);
            fd.append("assigned_at", nowISO());

            if (editId) {
                await postData(API.UPDATE(editId), fd);
            } else {
                await postData(API.CREATE, fd);
            }

            setDialogOpen(false);
            await fetchAll();
            Swal.fire({
                icon: "success",
                title: editId ? "Assignment Updated!" : "Task Assigned!",
                text: `Assigned to ${form.assignee} — notification sent to ${form.email}`,
                timer: 2200,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave error:", err);
            Swal.fire("Error", "Failed to save assignment.", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── delete ──
    const handleDelete = (row) => {
        Swal.fire({
            title: "Remove Assignment?",
            html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c62828",
            confirmButtonText: "Yes, remove",
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            try {
                await fetch(`${ServerURL}${API.DELETE(row.id)}`, {
                    method: "DELETE",
                    headers: { Accept: "application/json" },
                });
                await fetchAll();
            } catch (err) {
                Swal.fire("Error", "Failed to remove assignment.", "error");
            }
        });
    };

    const taskLabel = (id) => {
        const t = tasks.find((t) => String(t.id) === String(id));
        return t?.task ?? t?.name ?? id ?? "—";
    };

    // ════════════════════════════════════════════════════════════════════════
    return (
        <Box sx={{ p: 3 }}>

            {/* Breadcrumb */}
            <Box mb={2.5}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
                    <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
                    <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
                </Breadcrumbs>
            </Box>

            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
                <Box display="flex" alignItems="center" gap={1}>
                    <AssignmentIndOutlinedIcon sx={{ color:TEAL, fontSize:24 }} />
                    <Typography fontWeight={700} fontSize={17}>Assign Task</Typography>
                    {!loading && (
                        <Chip label={`${assignments.length} assigned`} size="small"
                            sx={{ bgcolor:TEAL_LIGHT, color:TEAL_DARK, fontWeight:600, fontSize:11, ml:0.5 }} />
                    )}
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                    sx={{ bgcolor:TEAL, "&:hover":{ bgcolor:TEAL_DARK }, textTransform:"none",
                          fontWeight:600, borderRadius:"8px", px:2.5,
                          boxShadow:`0 2px 8px ${alpha(TEAL, 0.35)}` }}>
                    Assign Task
                </Button>
            </Box>

            {/* Table */}
            <Paper elevation={0} sx={{ border:"1px solid #e0e0e0", borderRadius:"10px", overflow:"hidden" }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor:TEAL }}>
                                {["SN","Task","Assignee","Email","OEM","Slot","Priority","Deadline","Status","Actions"].map((h) => (
                                    <TableCell key={h} sx={{ color:"#fff", fontWeight:700, fontSize:12.5,
                                        py:1.4, letterSpacing:".02em", whiteSpace:"nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {/* skeleton */}
                            {loading && Array.from({ length:4 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length:10 }).map((__, j) => (
                                        <TableCell key={j}><Skeleton height={22} /></TableCell>
                                    ))}
                                </TableRow>
                            ))}

                            {/* empty */}
                            {!loading && assignments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py:6 }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                            <AssignmentIndOutlinedIcon sx={{ fontSize:40, color:TEAL_MID }} />
                                            <Typography color="text.secondary" fontSize={14}>
                                                No assignments yet. Click <strong style={{ color:TEAL }}>+ Assign Task</strong> to get started.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* rows */}
                            {!loading && assignments.map((row, idx) => {
                                const pm = priorityMeta(row.priority);
                                const sm = slotMeta(row.slot);
                                return (
                                    <TableRow key={row.id ?? idx} hover
                                        sx={{ "&:nth-of-type(even)":{ bgcolor:"#fafafa" },
                                              "&:hover":{ bgcolor:alpha(TEAL, 0.04) } }}>

                                        <TableCell sx={{ color:"#aaa", fontSize:12, width:36 }}>{idx+1}</TableCell>

                                        <TableCell>
                                            <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
                                                <Typography noWrap fontSize={13} fontWeight={600} sx={{ maxWidth:140 }}>
                                                    {taskLabel(row.task_id ?? row.task)}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={0.8}>
                                                <Box sx={{ width:28, height:28, borderRadius:"50%",
                                                    bgcolor:alpha(TEAL,0.15), color:TEAL_DARK,
                                                    display:"flex", alignItems:"center", justifyContent:"center",
                                                    fontSize:12, fontWeight:700, flexShrink:0 }}>
                                                    {(row.assignee ?? "?")[0].toUpperCase()}
                                                </Box>
                                                <Typography fontSize={13}>{row.assignee ?? "—"}</Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell sx={{ fontSize:12.5, color:"#555", fontFamily:"monospace" }}>
                                            {row.email ?? "—"}
                                        </TableCell>

                                        {/* OEM */}
                                        <TableCell>
                                            {row.oem ? (
                                                <Chip label={row.oem} size="small"
                                                    sx={{ bgcolor:"#e3f2fd", color:"#0d47a1", fontWeight:600, fontSize:11,
                                                          border:"1px solid #90caf9" }} />
                                            ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                        </TableCell>

                                        {/* Slot */}
                                        <TableCell>
                                            {sm ? (
                                                <Chip label={sm.label} size="small"
                                                    sx={{ bgcolor:alpha(sm.color, 0.1), color:sm.color,
                                                          fontWeight:600, fontSize:11,
                                                          border:`1px solid ${alpha(sm.color,0.3)}` }} />
                                            ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                        </TableCell>

                                        {/* Priority */}
                                        <TableCell>
                                            {row.priority ? (
                                                <Chip label={row.priority} size="small"
                                                    sx={{ bgcolor:pm.bg, color:pm.color, fontWeight:700,
                                                          fontSize:11, border:`1px solid ${alpha(pm.color,0.3)}` }} />
                                            ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                        </TableCell>

                                        {/* Deadline */}
                                        <TableCell sx={{ whiteSpace:"nowrap" }}>
                                            {row.deadline ? (
                                                <>
                                                    <Typography fontSize={12} color="text.secondary">{fmtDate(row.deadline)}</Typography>
                                                    <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
                                                </>
                                            ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Chip label={row.status ?? "Pending"} size="small"
                                                sx={{ bgcolor:alpha(statusColor(row.status),0.1),
                                                      color:statusColor(row.status), fontWeight:700,
                                                      fontSize:11, border:`1px solid ${alpha(statusColor(row.status),0.25)}` }} />
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <Box display="flex" gap={0.5}>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton size="small" onClick={() => openEdit(row)}
                                                        sx={{ color:TEAL, "&:hover":{ bgcolor:alpha(TEAL,0.1) } }}>
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton size="small" onClick={() => handleDelete(row)}
                                                        sx={{ color:"#c62828", "&:hover":{ bgcolor:"#fdecea" } }}>
                                                        <DeleteOutlineIcon fontSize="small" />
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
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ mt:1, display:"block" }}>
                Click <strong>+ Assign Task</strong> to create · <strong>✎</strong> to edit · <strong>🗑</strong> to remove
            </Typography>

            {/* ══════════ DIALOG ══════════ */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                maxWidth="sm" fullWidth
                PaperComponent={DraggablePaper}
                PaperProps={{ sx:{ borderRadius:"14px", overflow:"hidden" } }}>

                {/* accent bar */}
                <Box sx={{ height:4, background:`linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />

                <DialogTitle
                    data-drag-handle
                    sx={{ display:"flex", alignItems:"center", gap:1.5,
                        pb:1, pt:2.5, fontWeight:700, fontSize:16,
                        cursor:"grab",
                        userSelect:"none",
                        "&:active":{ cursor:"grabbing" },
                    }}>
                    <AssignmentIndOutlinedIcon sx={{ color:TEAL }} />
                    {editId ? "Edit Assignment" : "Assign Task"}
                    {/* drag hint */}
                    <Box sx={{ ml:"auto", display:"flex", flexDirection:"column",
                        gap:"3px", pr:0.5, opacity:0.3 }}>
                        {[0,1,2].map((r) => (
                            <Box key={r} sx={{ display:"flex", gap:"3px" }}>
                                {[0,1].map((c) => (
                                    <Box key={c} sx={{ width:3, height:3, borderRadius:"50%",
                                        bgcolor:"text.primary" }} />
                                ))}
                            </Box>
                        ))}
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt:2.5, pb:1 }}>
                    <Box display="flex" flexDirection="column" gap={2.2}>

                        {/* ── Select Task ── */}
                        <TextField select label="Select Task" value={form.task_id}
                            onChange={(e) => handleFormChange("task_id", e.target.value)}
                            error={!!errors.task_id} helperText={errors.task_id}
                            size="small" fullWidth sx={fieldSx}
                            InputProps={{ startAdornment:(
                                <InputAdornment position="start">
                                    <TaskAltOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                </InputAdornment>) }}>
                            <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Choose a task —</em></MenuItem>
                            {tasks.map((t) => (
                                <MenuItem key={t.id} value={String(t.id)}>
                                    {t.task ?? t.name ?? t.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* ── Assignee ── */}
                        <TextField select={users.length > 0} label="Assignee" value={form.assignee}
                            onChange={(e) => handleFormChange("assignee", e.target.value)}
                            error={!!errors.assignee} helperText={errors.assignee}
                            placeholder="Enter name or select from list"
                            size="small" fullWidth sx={fieldSx}
                            InputProps={{ startAdornment:(
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ fontSize:18, color:TEAL }} />
                                </InputAdornment>) }}>
                            {users.length > 0 && [
                                <MenuItem key="_empty" value="" disabled>
                                    <em style={{ color:"#aaa" }}>— Select assignee —</em>
                                </MenuItem>,
                                ...users.map((u) => (
                                    <MenuItem key={u.id ?? u.email} value={u.name ?? u.username}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width:24, height:24, borderRadius:"50%",
                                                bgcolor:alpha(TEAL,0.15), color:TEAL_DARK,
                                                display:"flex", alignItems:"center", justifyContent:"center",
                                                fontSize:11, fontWeight:700 }}>
                                                {(u.name ?? u.username ?? "?")[0].toUpperCase()}
                                            </Box>
                                            {u.name ?? u.username}
                                        </Box>
                                    </MenuItem>
                                )),
                            ]}
                        </TextField>

                        {/* ── Email ── */}
                        <TextField label="Email" value={form.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email || "Auto-filled from user profile · editable"}
                            placeholder="assignee@example.com"
                            size="small" fullWidth sx={fieldSx}
                            InputProps={{ startAdornment:(
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                </InputAdornment>) }} />

                        {/* ── OEM  +  Slot (2 cols) ── */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="OEM" value={form.oem}
                                    onChange={(e) => handleFormChange("oem", e.target.value)}
                                    error={!!errors.oem} helperText={errors.oem}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment:(
                                        <InputAdornment position="start">
                                            <RouterOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                        </InputAdornment>) }}>
                                    <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Select OEM —</em></MenuItem>
                                    {OEM_OPTIONS.map((o) => (
                                        <MenuItem key={o} value={o}>{o}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField select label="Slot" value={form.slot}
                                    onChange={(e) => handleFormChange("slot", e.target.value)}
                                    error={!!errors.slot} helperText={errors.slot}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment:(
                                        <InputAdornment position="start">
                                            <WbSunnyOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                        </InputAdornment>) }}>
                                    <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Morning / Evening —</em></MenuItem>
                                    {SLOT_OPTIONS.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:s.color }} />
                                                {s.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* ── Priority  +  Status (2 cols) ── */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="Priority" value={form.priority}
                                    onChange={(e) => handleFormChange("priority", e.target.value)}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment:(
                                        <InputAdornment position="start">
                                            <FlagOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                        </InputAdornment>) }}>
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <MenuItem key={p.value} value={p.value}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:p.color }} />
                                                <Typography fontSize={13} color={p.color} fontWeight={600}>{p.value}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField select label="Status" value={form.status}
                                    onChange={(e) => handleFormChange("status", e.target.value)}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment:(
                                        <InputAdornment position="start">
                                            <AccessTimeOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                        </InputAdornment>) }}>
                                    {["Pending","Active","Completed","Cancelled"].map((s) => (
                                        <MenuItem key={s} value={s}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:statusColor(s) }} />
                                                {s}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* ── Deadline (date + time picker) ── */}
                        <TextField
                            label="Deadline"
                            type="datetime-local"
                            value={form.deadline}
                            onChange={(e) => handleFormChange("deadline", e.target.value)}
                            error={!!errors.deadline}
                            helperText={errors.deadline || "Select date and time to complete the task"}
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: nowLocal() }}
                            sx={fieldSx}
                            InputProps={{ startAdornment:(
                                <InputAdornment position="start">
                                    <EventOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
                                </InputAdornment>) }}
                        />

                        {/* ── Auto assigned-at strip ── */}
                        <Paper variant="outlined" sx={{ display:"flex", alignItems:"center", gap:1.2,
                            px:2, py:1.2, bgcolor:TEAL_LIGHT,
                            border:`1px solid ${TEAL_MID}`, borderRadius:"8px" }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize:16, color:TEAL_DARK }} />
                            <Typography fontSize={13} color={TEAL_DARK}>
                                <strong>Assigned at:</strong>{" "}
                                {new Date().toLocaleDateString("en-IN", {
                                    weekday:"long", day:"2-digit", month:"long", year:"numeric" })}{" "}
                                · {new Date().toLocaleTimeString("en-IN", {
                                    hour:"2-digit", minute:"2-digit", hour12:true })}
                            </Typography>
                        </Paper>

                        {/* ── Notes ── */}
                        <TextField label="Remark (optional)" value={form.remark}
                            onChange={(e) => handleFormChange("remark", e.target.value)}
                            placeholder="Add any notes for the assignee…"
                            size="small" fullWidth multiline rows={2} sx={fieldSx} />

                    </Box>
                </DialogContent>

                <DialogActions sx={{ px:3, pb:2.5, pt:1.5, gap:1 }}>
                    <Button onClick={() => setDialogOpen(false)}
                        sx={{ textTransform:"none", color:"text.secondary",
                              border:"1px solid #e0e0e0", borderRadius:"8px", px:2.5 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}
                        sx={{ bgcolor:TEAL, "&:hover":{ bgcolor:TEAL_DARK }, textTransform:"none",
                              fontWeight:700, borderRadius:"8px", px:3,
                              boxShadow:`0 2px 8px ${alpha(TEAL, 0.35)}` }}>
                        {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// ── shared TextField sx ────────────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset":   { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

export default AssignTask;