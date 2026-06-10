

// import React, { useEffect, useState, useCallback, useRef } from "react";
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
//     "Nokia", "Ericsson", "Samsung", "Huawei", "ZTE",
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
//    remark:    "",
//     status:   "Pending",
// };

// // ── Draggable Paper wrapper ────────────────────────────────────────────────────
// // Attaches to the MUI Dialog's PaperComponent prop so the whole popup is movable.
// function DraggablePaper({ children, ...props }) {
//     const paperRef   = useRef(null);
//     const isDragging = useRef(false);
//     const origin     = useRef({ x: 0, y: 0 });   // mousedown position
//     const translate  = useRef({ x: 0, y: 0 });   // current offset

//     const onMouseDown = (e) => {
//         // Only start drag when clicking the title bar (first child = DialogTitle area)
//         const titleBar = paperRef.current?.querySelector("[data-drag-handle]");
//         if (!titleBar || !titleBar.contains(e.target)) return;
//         // Ignore clicks on interactive elements inside the title bar (close btn etc.)
//         if (e.target.closest("button")) return;

//         isDragging.current = true;
//         origin.current = {
//             x: e.clientX - translate.current.x,
//             y: e.clientY - translate.current.y,
//         };
//         e.preventDefault();
//     };

//     const onMouseMove = useCallback((e) => {
//         if (!isDragging.current || !paperRef.current) return;
//         const newX = e.clientX - origin.current.x;
//         const newY = e.clientY - origin.current.y;

//         // Clamp so popup never leaves viewport
//         const rect   = paperRef.current.getBoundingClientRect();
//         const maxX   = window.innerWidth  - rect.width  / 2;
//         const maxY   = window.innerHeight - rect.height / 2;
//         const clampX = Math.min(Math.max(newX, -(window.innerWidth  - rect.width  / 2)), maxX);
//         const clampY = Math.min(Math.max(newY, -(window.innerHeight - rect.height / 2)), maxY);

//         translate.current = { x: clampX, y: clampY };
//         paperRef.current.style.transform = `translate(${clampX}px, ${clampY}px)`;
//     }, []);

//     const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

//     useEffect(() => {
//         window.addEventListener("mousemove", onMouseMove);
//         window.addEventListener("mouseup",   onMouseUp);
//         return () => {
//             window.removeEventListener("mousemove", onMouseMove);
//             window.removeEventListener("mouseup",   onMouseUp);
//         };
//     }, [onMouseMove, onMouseUp]);

//     return (
//         <Paper
//             {...props}
//             ref={paperRef}
//             onMouseDown={onMouseDown}
//             sx={{
//                 ...props.sx,
//                 // keep MUI centering but allow transform to shift it
//                 position: "relative",
//                 transition: "box-shadow 0.15s",
//             }}
//         >
//             {children}
//         </Paper>
//     );
// }

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
//             remark:    row.remark    ?? "",
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
//             fd.append("remark",       form.remark);
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
//                 PaperComponent={DraggablePaper}
//                 PaperProps={{ sx:{ borderRadius:"14px", overflow:"hidden" } }}>

//                 {/* accent bar */}
//                 <Box sx={{ height:4, background:`linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />

//                 <DialogTitle
//                     data-drag-handle
//                     sx={{ display:"flex", alignItems:"center", gap:1.5,
//                         pb:1, pt:2.5, fontWeight:700, fontSize:16,
//                         cursor:"grab",
//                         userSelect:"none",
//                         "&:active":{ cursor:"grabbing" },
//                     }}>
//                     <AssignmentIndOutlinedIcon sx={{ color:TEAL }} />
//                     {editId ? "Edit Assignment" : "Assign Task"}
//                     {/* drag hint */}
//                     <Box sx={{ ml:"auto", display:"flex", flexDirection:"column",
//                         gap:"3px", pr:0.5, opacity:0.3 }}>
//                         {[0,1,2].map((r) => (
//                             <Box key={r} sx={{ display:"flex", gap:"3px" }}>
//                                 {[0,1].map((c) => (
//                                     <Box key={c} sx={{ width:3, height:3, borderRadius:"50%",
//                                         bgcolor:"text.primary" }} />
//                                 ))}
//                             </Box>
//                         ))}
//                     </Box>
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
//                         <TextField label="Remark (optional)" value={form.remark}
//                             onChange={(e) => handleFormChange("remark", e.target.value)}
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

// import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar, Badge, ToggleButtonGroup,
//     ToggleButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import CloseIcon from "@mui/icons-material/Close";
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
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Swal from "sweetalert2";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate } from "react-router-dom";

// // ─────────────────────────────────────────────────────────────────────────────
// // THEME
// // ─────────────────────────────────────────────────────────────────────────────
// const TEAL = "#228b7f";
// const TEAL_DARK = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─────────────────────────────────────────────────────────────────────────────
// // STATIC LISTS
// // ─────────────────────────────────────────────────────────────────────────────
// const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

// const SLOT_OPTIONS = [
//     { value: "morning", label: "🌤  Morning", color: "#f57c00" },
//     { value: "afternoon", label: "☀️  Afternoon", color: "#f9a825" },
//     { value: "evening", label: "🌙  Evening", color: "#5c6bc0" },
//     { value: "night", label: "🌌  Night", color: "#37474f" },
// ];

// const PRIORITY_OPTIONS = [
//     { value: "Critical", color: "#c62828", bg: "#fdecea" },
//     { value: "High", color: "#e65100", bg: "#fff3e0" },
//     { value: "Medium", color: "#f57c00", bg: "#fff8e1" },
//     { value: "Low", color: "#2e7d32", bg: "#e8f5e9" },
// ];

// // Reminder frequencies ── the value is what gets sent to the backend
// // "daily" → remind every day, "weekly" → every week, "monthly" → every month
// // "none"  → no automated reminder
// const REMINDER_OPTIONS = [
//     { value: "none", label: "None", icon: "🔕" },
//     { value: "daily", label: "Daily", icon: "📅" },
//     { value: "weekly", label: "Weekly", icon: "📆" },
//     { value: "monthly", label: "Monthly", icon: "🗓" },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // API PATHS
// // ─────────────────────────────────────────────────────────────────────────────
// const API = {
//     CREATE: "dailytask_review/assign/create/",
//     GET_ALL: "dailytask_review/assign/",
//     UPDATE: (pk) => `dailytask_review/assign/update/${pk}/`,
//     DELETE: (pk) => `dailytask_review/assign/delete/${pk}/`,
//     GET_TASKS: "dailytask_review/tasks/",
//     GET_USERS: "dailytask_review/users/",

//     UPDATE_REMINDER: (pk) => `dailytask_review/assign/reminder/${pk}/`,
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// const nowISO = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";

// const statusColor = (s) => ({ Pending: "#f57c00", Active: "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
// const slotMeta = (v) => SLOT_OPTIONS.find((o) => o.value === v);
// const reminderMeta = (v) => REMINDER_OPTIONS.find((o) => o.value === v) ?? REMINDER_OPTIONS[0];

// // ── read logged-in user from localStorage ─────────────────────────────────────
// // Adapt the key/field to whatever your auth layer stores.
// // Common patterns:
// //   localStorage.getItem("user")          → JSON: { name, email, id, … }
// //   localStorage.getItem("userInfo")      → same
// //   localStorage.getItem("access_token")  + decode JWT
// // We fall back gracefully so the field stays editable if nothing is found.
// const getLoggedInUser = () => {
//     try {
//         // ── OPTION A: plain JSON object stored under "user" ──────────────────
//         const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
//         const obj = JSON.parse(raw);
//         return {
//             name: obj.name ?? obj.username ?? obj.full_name ?? "",
//             email: obj.email ?? obj.emailaddress ?? "",
//         };
//     } catch {
//         return { name: "", email: "" };
//     }
// };

// const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// const EMPTY_FORM = {
//     task_id: "",
//     assignee: "",           // auto-filled from login
//     emails: [],           // array of email strings (multi-email chips)
//     emailInput: "",           // controlled input value (not sent to backend)
//     oem: "",
//     slot: "",
//     priority: "Medium",
//     deadline: "",
//     reminder: "none",       // "none" | "daily" | "weekly" | "monthly"
//     remark: "",
//     status: "Pending",
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const AssignTask = () => {
//     const navigate = useNavigate();

//     const [assignments, setAssignments] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [form, setForm] = useState(EMPTY_FORM);
//     const [errors, setErrors] = useState({});
//     const [saving, setSaving] = useState(false);
//     const emailInputRef = useRef(null);

//     // ── fetch ─────────────────────────────────────────────────────────────────
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
//             console.error("fetchAll:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // ── form helpers ──────────────────────────────────────────────────────────
//     const set = (field, value) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//         setErrors((e) => ({ ...e, [field]: "" }));
//     };

//     // Add an email chip on Enter / comma / Tab
//     const commitEmail = () => {
//         const val = form.emailInput.trim().replace(/,$/, "");
//         if (!val) return;
//         if (!isValidEmail(val)) { setErrors((e) => ({ ...e, emails: "Invalid email address" })); return; }
//         if (form.emails.includes(val)) { setErrors((e) => ({ ...e, emails: "Already added" })); return; }
//         setForm((prev) => ({ ...prev, emails: [...prev.emails, val], emailInput: "" }));
//         setErrors((e) => ({ ...e, emails: "" }));
//     };

//     const removeEmail = (addr) => setForm((prev) => ({ ...prev, emails: prev.emails.filter((e) => e !== addr) }));

//     // ── validation ────────────────────────────────────────────────────────────
//     const validate = () => {
//         const e = {};
//         if (!form.task_id) e.task_id = "Please select a task";
//         if (!form.assignee.trim()) e.assignee = "Assignee is required";
//         if (form.emails.length === 0) e.emails = "Add at least one email";
//         if (!form.oem) e.oem = "OEM is required";
//         if (!form.slot) e.slot = "Slot is required";
//         if (!form.deadline) e.deadline = "Deadline is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     // ── open dialog ───────────────────────────────────────────────────────────
//     const openCreate = () => {
//         const me = getLoggedInUser();
//         setEditId(null);
//         setForm({
//             ...EMPTY_FORM,
//             assignee: me.name,
//             emails: me.email ? [me.email] : [],
//             emailInput: "",
//             deadline: nowLocal(),
//         });
//         setErrors({});
//         setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id);
//         // emails may be stored as comma-joined string or JSON array in backend
//         let emails = [];
//         if (Array.isArray(row.emails)) emails = row.emails;
//         else if (typeof row.emails === "string") emails = row.emails.split(",").map((s) => s.trim()).filter(Boolean);
//         else if (row.email) emails = [row.email];

//         setForm({
//             task_id: String(row.task_id ?? row.task ?? ""),
//             assignee: row.assignee ?? "",
//             emails,
//             emailInput: "",
//             oem: row.oem ?? "",
//             slot: row.slot ?? "",
//             priority: row.priority ?? "Medium",
//             deadline: row.deadline ? row.deadline.slice(0, 16) : nowLocal(),
//             reminder: row.reminder ?? "none",
//             remark: row.remark ?? "",
//             status: row.status ?? "Pending",
//         });
//         setErrors({});
//         setDialogOpen(true);
//     };

//     // ── save ──────────────────────────────────────────────────────────────────
//     const handleSave = async () => {
//         // commit any typed-but-not-entered email before validating
//         if (form.emailInput.trim()) commitEmail();
//         if (!validate()) return;
//         setSaving(true);
//         try {
//             const fd = new FormData();
//             fd.append("task_id", form.task_id);
//             fd.append("assignee", form.assignee);
//             fd.append("emails", form.emails.join(","));
//             fd.append("email", form.emails[0] ?? "");
//             fd.append("oem", form.oem);
//             fd.append("slot", form.slot);
//             fd.append("priority", form.priority);
//             fd.append("deadline", new Date(form.deadline).toISOString());
//             fd.append("reminder", form.reminder);
//             fd.append("remark", form.remark);
//             fd.append("status", form.status);
//             fd.append("assigned_at", nowISO());

//             // ── CREATE or UPDATE ──────────────────────────────────────────────
//             let savedId = editId;

//             if (editId) {
//                 await postData(API.UPDATE(editId), fd);
//             } else {
//                 const res = await postData(API.CREATE, fd);
//                 // capture the new record ID from backend response
//                 // adjust key (id / data.id) to match your API response shape
//                 savedId = res?.id ?? res?.data?.id ?? null;
//             }

//             // ── REMINDER API call (only if reminder is active) ────────────────
//             // Runs after save so we always have a valid savedId
//             // Also resets last_reminded_at on backend so clock starts fresh
//             if (savedId && form.reminder !== "none") {
//                 try {
//                     await postData(API.UPDATE_REMINDER(savedId), { reminder: form.reminder });
//                 } catch (reminderErr) {
//                     // non-blocking — assignment already saved, just log the reminder failure
//                     console.warn("Reminder update failed:", reminderErr);
//                 }
//             }

//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon: "success",
//                 title: editId ? "Assignment Updated!" : "Task Assigned!",
//                 html: `Assigned to <b>${form.assignee}</b><br/>
//                    Notifications → <b>${form.emails.join(", ")}</b><br/>
//                    Reminder: <b>${reminderMeta(form.reminder).icon} ${reminderMeta(form.reminder).label}</b>`,
//                 timer: 3000,
//                 showConfirmButton: false,
//                 timerProgressBar: true,
//             });
//         } catch (err) {
//             console.error("handleSave:", err);
//             Swal.fire("Error", "Failed to save assignment.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ── delete ────────────────────────────────────────────────────────────────
//     const handleDelete = (row) => {
//         Swal.fire({
//             title: "Remove Assignment?",
//             html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#c62828",
//             confirmButtonText: "Yes, remove",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.DELETE(row.id)}`, {
//                     method: "DELETE", headers: { Accept: "application/json" },
//                 });
//                 await fetchAll();
//             } catch { Swal.fire("Error", "Failed to remove assignment.", "error"); }
//         });
//     };

//     const taskLabel = (id) => {
//         const t = tasks.find((t) => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? id ?? "—";
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     // RENDER
//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 3 }}>

//             {/* Breadcrumb */}
//             <Box mb={2.5}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize: 13 }}>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer", color: TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* Page header */}
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 24 }} />
//                     <Typography fontWeight={700} fontSize={17}>Assign Task</Typography>
//                     {!loading && (
//                         <Chip label={`${assignments.length} assigned`} size="small"
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 600, fontSize: 11, ml: 0.5 }} />
//                     )}
//                 </Box>
//                 <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
//                     sx={{
//                         bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                         fontWeight: 600, borderRadius: "8px", px: 2.5,
//                         boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}`
//                     }}>
//                     Assign Task
//                 </Button>
//             </Box>

//             {/* ── Table ── */}
//             <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "10px", overflow: "hidden" }}>
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ bgcolor: TEAL }}>
//                                 {["SN", "Task", "Assignee", "Recipients", "OEM", "Slot", "Priority", "Deadline", "Reminder", "Status", "Actions"].map((h) => (
//                                     <TableCell key={h} sx={{
//                                         color: "#fff", fontWeight: 700, fontSize: 12.5,
//                                         py: 1.4, letterSpacing: ".02em", whiteSpace: "nowrap"
//                                     }}>{h}</TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>

//                             {loading && Array.from({ length: 4 }).map((_, i) => (
//                                 <TableRow key={i}>
//                                     {Array.from({ length: 11 }).map((_, j) => (
//                                         <TableCell key={j}><Skeleton height={22} /></TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))}

//                             {!loading && assignments.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
//                                         <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
//                                             <AssignmentIndOutlinedIcon sx={{ fontSize: 40, color: TEAL_MID }} />
//                                             <Typography color="text.secondary" fontSize={14}>
//                                                 No assignments yet. Click <strong style={{ color: TEAL }}>+ Assign Task</strong> to get started.
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             )}

//                             {!loading && assignments.map((row, idx) => {
//                                 const pm = priorityMeta(row.priority);
//                                 const sm = slotMeta(row.slot);
//                                 const rm = reminderMeta(row.reminder);
//                                 const rowEmails = Array.isArray(row.emails)
//                                     ? row.emails
//                                     : (row.emails ?? row.email ?? "").split(",").map(s => s.trim()).filter(Boolean);

//                                 return (
//                                     <TableRow key={row.id ?? idx} hover
//                                         sx={{
//                                             "&:nth-of-type(even)": { bgcolor: "#fafafa" },
//                                             "&:hover": { bgcolor: alpha(TEAL, 0.04) }
//                                         }}>

//                                         <TableCell sx={{ color: "#aaa", fontSize: 12, width: 36 }}>{idx + 1}</TableCell>

//                                         <TableCell>
//                                             <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
//                                                 <Typography noWrap fontSize={13} fontWeight={600} sx={{ maxWidth: 130 }}>
//                                                     {taskLabel(row.task_id ?? row.task)}
//                                                 </Typography>
//                                             </Tooltip>
//                                         </TableCell>

//                                         {/* Assignee */}
//                                         <TableCell>
//                                             <Box display="flex" alignItems="center" gap={0.8}>
//                                                 <Avatar sx={{
//                                                     width: 26, height: 26, fontSize: 11, fontWeight: 700,
//                                                     bgcolor: alpha(TEAL, 0.2), color: TEAL_DARK
//                                                 }}>
//                                                     {(row.assignee ?? "?")[0].toUpperCase()}
//                                                 </Avatar>
//                                                 <Typography fontSize={13}>{row.assignee ?? "—"}</Typography>
//                                             </Box>
//                                         </TableCell>

//                                         {/* Recipients */}
//                                         <TableCell>
//                                             <Box display="flex" flexWrap="wrap" gap={0.4} maxWidth={180}>
//                                                 {rowEmails.slice(0, 2).map((em) => (
//                                                     <Chip key={em} label={em} size="small"
//                                                         sx={{
//                                                             fontSize: 10.5, height: 20, bgcolor: "#f3f4f6",
//                                                             color: "#374151", fontFamily: "monospace"
//                                                         }} />
//                                                 ))}
//                                                 {rowEmails.length > 2 && (
//                                                     <Tooltip title={rowEmails.slice(2).join(", ")} arrow>
//                                                         <Chip label={`+${rowEmails.length - 2}`} size="small"
//                                                             sx={{
//                                                                 fontSize: 10.5, height: 20, bgcolor: TEAL_LIGHT,
//                                                                 color: TEAL_DARK, fontWeight: 700
//                                                             }} />
//                                                     </Tooltip>
//                                                 )}
//                                             </Box>
//                                         </TableCell>

//                                         {/* OEM */}
//                                         <TableCell>
//                                             <Chip label={row.oem || "—"} size="small"
//                                                 sx={{
//                                                     bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600,
//                                                     fontSize: 11, border: "1px solid #90caf9"
//                                                 }} />
//                                         </TableCell>

//                                         {/* Slot */}
//                                         <TableCell>
//                                             {sm ? (
//                                                 <Chip label={sm.label} size="small"
//                                                     sx={{
//                                                         bgcolor: alpha(sm.color, 0.1), color: sm.color,
//                                                         fontWeight: 600, fontSize: 11,
//                                                         border: `1px solid ${alpha(sm.color, 0.3)}`
//                                                     }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         {/* Priority */}
//                                         <TableCell>
//                                             <Chip label={row.priority || "—"} size="small"
//                                                 sx={{
//                                                     bgcolor: pm.bg, color: pm.color, fontWeight: 700,
//                                                     fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}`
//                                                 }} />
//                                         </TableCell>

//                                         {/* Deadline */}
//                                         <TableCell sx={{ whiteSpace: "nowrap" }}>
//                                             <Typography fontSize={12} color="text.secondary">{fmtDate(row.deadline)}</Typography>
//                                             <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
//                                         </TableCell>

//                                         {/* Reminder */}
//                                         <TableCell>
//                                             {row.reminder && row.reminder !== "none" ? (
//                                                 <Chip
//                                                     icon={<NotificationsOutlinedIcon sx={{ fontSize: "13px !important" }} />}
//                                                     label={rm.label} size="small"
//                                                     sx={{
//                                                         bgcolor: "#ede7f6", color: "#4527a0", fontWeight: 600,
//                                                         fontSize: 11, border: "1px solid #d1c4e9"
//                                                     }} />
//                                             ) : (
//                                                 <Typography color="text.disabled" fontSize={12}>—</Typography>
//                                             )}
//                                         </TableCell>

//                                         {/* Status */}
//                                         <TableCell>
//                                             <Chip label={row.status ?? "Pending"} size="small"
//                                                 sx={{
//                                                     bgcolor: alpha(statusColor(row.status), 0.1),
//                                                     color: statusColor(row.status), fontWeight: 700,
//                                                     fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}`
//                                                 }} />
//                                         </TableCell>

//                                         {/* Actions */}
//                                         <TableCell>
//                                             <Box display="flex" gap={0.5}>
//                                                 <Tooltip title="Edit" arrow>
//                                                     <IconButton size="small" onClick={() => openEdit(row)}
//                                                         sx={{ color: TEAL, "&:hover": { bgcolor: alpha(TEAL, 0.1) } }}>
//                                                         <EditOutlinedIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete" arrow>
//                                                     <IconButton size="small" onClick={() => handleDelete(row)}
//                                                         sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
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

//             <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
//                 Click <strong>+ Assign Task</strong> to create · <strong>✎</strong> to edit · <strong>🗑</strong> to remove
//             </Typography>

//             {/* ══════════════════════════════════════════════════════════════
//                 DIALOG
//             ══════════════════════════════════════════════════════════════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth disableScrollLock
//                 PaperProps={{
//                     sx: {
//                         borderRadius: "16px", overflow: "hidden",
//                         boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
//                     }
//                 }}>

//                 {/* gradient accent */}
//                 <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

//                 {/* ── Dialog Header ── */}
//                 <DialogTitle sx={{ p: 0 }}>
//                     <Box sx={{
//                         display: "flex", alignItems: "center", justifyContent: "space-between",
//                         px: 3, pt: 2.5, pb: 1.5
//                     }}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{
//                                 width: 36, height: 36, borderRadius: "10px",
//                                 bgcolor: alpha(TEAL, 0.12), display: "flex",
//                                 alignItems: "center", justifyContent: "center"
//                             }}>
//                                 <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>
//                                     {editId ? "Edit Assignment" : "Assign Task"}
//                                 </Typography>
//                                 <Typography fontSize={12} color="text.secondary">
//                                     {editId ? "Update assignment details" : "Fill in the details to assign"}
//                                 </Typography>
//                             </Box>
//                         </Box>

//                         {/* Modern close button */}
//                         <Tooltip title="Close" arrow>
//                             <IconButton
//                                 onClick={() => setDialogOpen(false)}
//                                 sx={{
//                                     width: 32, height: 32,
//                                     bgcolor: "#f3f4f6",
//                                     color: "#6b7280",
//                                     borderRadius: "8px",
//                                     transition: "all .18s",
//                                     "&:hover": {
//                                         bgcolor: "#fdecea", color: "#c62828",
//                                         transform: "rotate(90deg)"
//                                     },
//                                 }}>
//                                 <CloseIcon sx={{ fontSize: 17 }} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* Task */}
//                         <TextField select label="Select Task" value={form.task_id}
//                             onChange={(e) => set("task_id", e.target.value)}
//                             error={!!errors.task_id} helperText={errors.task_id}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>)
//                             }}>
//                             <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Choose a task —</em></MenuItem>
//                             {tasks.map((t) => (
//                                 <MenuItem key={t.id} value={String(t.id)}>
//                                     {t.task ?? t.name ?? t.title}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* Assignee — auto-filled from login */}
//                         <TextField label="Assignee" value={form.assignee}
//                             onChange={(e) => set("assignee", e.target.value)}
//                             error={!!errors.assignee} helperText={errors.assignee || "Auto-filled from your login session"}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>),
//                                 endAdornment: form.assignee ? (
//                                     <InputAdornment position="end">
//                                         <Avatar sx={{
//                                             width: 22, height: 22, fontSize: 10, fontWeight: 700,
//                                             bgcolor: alpha(TEAL, 0.2), color: TEAL_DARK
//                                         }}>
//                                             {form.assignee[0].toUpperCase()}
//                                         </Avatar>
//                                     </InputAdornment>
//                                 ) : null,
//                             }} />

//                         {/* ── Multi-email chip input ── */}
//                         <Box>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                                 <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Recipients (emails)
//                                 <Chip label={`${form.emails.length} added`} size="small"
//                                     sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK }} />
//                             </Typography>

//                             {/* Chip box */}
//                             <Paper variant="outlined"
//                                 onClick={() => emailInputRef.current?.focus()}
//                                 sx={{
//                                     p: "8px 10px", minHeight: 46, display: "flex",
//                                     alignItems: "center", flexWrap: "wrap", gap: 0.7,
//                                     borderRadius: "8px", cursor: "text",
//                                     borderColor: errors.emails ? "#c62828" : "#c4c4c4",
//                                     "&:hover": { borderColor: errors.emails ? "#c62828" : TEAL },
//                                     transition: "border-color .15s",
//                                 }}>
//                                 {form.emails.map((em) => (
//                                     <Chip key={em} label={em} size="small"
//                                         onDelete={() => removeEmail(em)}
//                                         sx={{
//                                             bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 500,
//                                             fontSize: 12, height: 24,
//                                             "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL },
//                                             fontFamily: "monospace"
//                                         }} />
//                                 ))}
//                                 <input
//                                     ref={emailInputRef}
//                                     value={form.emailInput}
//                                     placeholder={form.emails.length === 0 ? "Type email and press Enter…" : "Add more…"}
//                                     onChange={(e) => { set("emailInput", e.target.value); setErrors((er) => ({ ...er, emails: "" })); }}
//                                     onKeyDown={(e) => {
//                                         if (["Enter", "Tab", ","].includes(e.key)) { e.preventDefault(); commitEmail(); }
//                                         if (e.key === "Backspace" && !form.emailInput && form.emails.length > 0)
//                                             removeEmail(form.emails[form.emails.length - 1]);
//                                     }}
//                                     onBlur={commitEmail}
//                                     style={{
//                                         border: "none", outline: "none", flex: 1, minWidth: 180,
//                                         fontSize: 13, background: "transparent", fontFamily: "inherit",
//                                         color: "inherit",
//                                     }}
//                                 />
//                             </Paper>
//                             <Typography fontSize={11} color={errors.emails ? "error" : "text.secondary"} mt={0.4} ml={0.5}>
//                                 {errors.emails || "Press Enter · Tab · comma to add · Backspace to remove last"}
//                             </Typography>
//                         </Box>

//                         {/* OEM + Slot */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem}
//                                     onChange={(e) => set("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                             </InputAdornment>)
//                                     }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot}
//                                     onChange={(e) => set("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                             </InputAdornment>)
//                                     }}>
//                                     <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Morning / Evening —</em></MenuItem>
//                                     {SLOT_OPTIONS.map((s) => (
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
//                                 <TextField select label="Priority" value={form.priority}
//                                     onChange={(e) => set("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <FlagOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                             </InputAdornment>)
//                                     }}>
//                                     {PRIORITY_OPTIONS.map((p) => (
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
//                                 <TextField select label="Status" value={form.status}
//                                     onChange={(e) => set("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                             </InputAdornment>)
//                                     }}>
//                                     {["Pending", "Active", "Completed", "Cancelled"].map((s) => (
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
//                         <TextField label="Deadline" type="datetime-local"
//                             value={form.deadline}
//                             onChange={(e) => set("deadline", e.target.value)}
//                             error={!!errors.deadline}
//                             helperText={errors.deadline || "Select date and time to complete the task"}
//                             size="small" fullWidth InputLabelProps={{ shrink: true }}
//                             inputProps={{ min: nowLocal() }} sx={fieldSx}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} />
//                                     </InputAdornment>)
//                             }} />

//                         {/* ── Reminder selector ── */}
//                         <Box>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}
//                                 sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
//                                 <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
//                                 Reminder Frequency
//                                 <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>
//                                     (sends to all recipients)
//                                 </Typography>
//                             </Typography>

//                             {/* 4-button toggle row */}
//                             <Box display="flex" gap={1} flexWrap="wrap">
//                                 {REMINDER_OPTIONS.map((r) => {
//                                     const active = form.reminder === r.value;
//                                     return (
//                                         <Box key={r.value}
//                                             onClick={() => set("reminder", r.value)}
//                                             sx={{
//                                                 display: "flex", alignItems: "center", gap: 0.7,
//                                                 px: 1.8, py: 0.9, borderRadius: "8px", cursor: "pointer",
//                                                 fontSize: 13, fontWeight: active ? 700 : 500,
//                                                 border: `1.5px solid ${active ? TEAL : "#e0e0e0"}`,
//                                                 bgcolor: active ? alpha(TEAL, 0.08) : "#fafafa",
//                                                 color: active ? TEAL_DARK : "#555",
//                                                 transition: "all .17s",
//                                                 userSelect: "none",
//                                                 "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) },
//                                             }}>
//                                             <span style={{ fontSize: 15 }}>{r.icon}</span>
//                                             {r.label}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>

//                             {/* Helper text showing what the selected reminder means */}
//                             {form.reminder !== "none" && (
//                                 <Paper variant="outlined" sx={{
//                                     mt: 1.2, px: 1.8, py: 1,
//                                     bgcolor: "#ede7f6", border: "1px solid #d1c4e9", borderRadius: "8px",
//                                     display: "flex", alignItems: "center", gap: 1
//                                 }}>
//                                     <NotificationsOutlinedIcon sx={{ fontSize: 16, color: "#4527a0" }} />
//                                     <Typography fontSize={12.5} color="#4527a0">
//                                         {form.reminder === "daily" && "A reminder will be sent every day until the deadline."}
//                                         {form.reminder === "weekly" && "A reminder will be sent every week on the same day."}
//                                         {form.reminder === "monthly" && "A reminder will be sent once every month."}
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </Box>

//                         {/* Auto assigned-at */}
//                         <Paper variant="outlined" sx={{
//                             display: "flex", alignItems: "center", gap: 1.2,
//                             px: 2, py: 1.2, bgcolor: TEAL_LIGHT,
//                             border: `1px solid ${TEAL_MID}`, borderRadius: "8px"
//                         }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", {
//                                     weekday: "long", day: "2-digit", month: "long", year: "numeric"
//                                 })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", {
//                                     hour: "2-digit", minute: "2-digit", hour12: true
//                                 })}
//                             </Typography>
//                         </Paper>

//                         {/* Remark */}
//                         <TextField label="Remark (optional)" value={form.remark}
//                             onChange={(e) => set("remark", e.target.value)}
//                             placeholder="Add any notes for the assignee…"
//                             size="small" fullWidth multiline rows={2} sx={fieldSx} />

//                     </Box>
//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
//                     <Button onClick={() => setDialogOpen(false)}
//                         sx={{
//                             textTransform: "none", color: "text.secondary",
//                             border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5
//                         }}>
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} disabled={saving}
//                         sx={{
//                             bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none",
//                             fontWeight: 700, borderRadius: "8px", px: 3,
//                             boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}`
//                         }}>
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



// import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     InputAdornment, Divider, alpha, Grid, Avatar,
// } from "@mui/material";
// import AddIcon                   from "@mui/icons-material/Add";
// import DeleteOutlineIcon         from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon          from "@mui/icons-material/EditOutlined";
// import CloseIcon                 from "@mui/icons-material/Close";
// import RefreshIcon               from "@mui/icons-material/Refresh";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import TaskAltOutlinedIcon       from "@mui/icons-material/TaskAltOutlined";
// import PersonOutlineIcon         from "@mui/icons-material/PersonOutline";
// import RouterOutlinedIcon        from "@mui/icons-material/RouterOutlined";
// import WbSunnyOutlinedIcon       from "@mui/icons-material/WbSunnyOutlined";
// import AccessTimeOutlinedIcon    from "@mui/icons-material/AccessTimeOutlined";
// import FlagOutlinedIcon          from "@mui/icons-material/FlagOutlined";
// import EventOutlinedIcon         from "@mui/icons-material/EventOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import GroupAddOutlinedIcon      from "@mui/icons-material/GroupAddOutlined";
// import SearchIcon                from "@mui/icons-material/Search";
// import FilterListIcon            from "@mui/icons-material/FilterList";
// import HourglassEmptyIcon        from "@mui/icons-material/HourglassEmpty";
// import PlayCircleOutlineIcon     from "@mui/icons-material/PlayCircleOutline";
// import CheckCircleOutlineIcon    from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon        from "@mui/icons-material/CancelOutlined";
// import Breadcrumbs               from "@mui/material/Breadcrumbs";
// import Link                      from "@mui/material/Link";
// import KeyboardArrowRightIcon    from "@mui/icons-material/KeyboardArrowRight";
// import Swal                      from "sweetalert2";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import { useNavigate }           from "react-router-dom";

// // ─────────────────────────────────────────────────────────────────────────────
// // THEME
// // ─────────────────────────────────────────────────────────────────────────────
// const TEAL       = "#228b7f";
// const TEAL_DARK  = "#004d40";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID   = "#b2dfdb";

// // ─────────────────────────────────────────────────────────────────────────────
// // STATIC LISTS
// // ─────────────────────────────────────────────────────────────────────────────
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

// // ─────────────────────────────────────────────────────────────────────────────
// // API PATHS
// // ─────────────────────────────────────────────────────────────────────────────
// const API = {
//     CREATE:          "dailytask_review/assign/create/",
//     GET_ALL:         "dailytask_review/assign/",
//     UPDATE:          (pk) => `dailytask_review/assign/update/${pk}/`,
//     DELETE:          (pk) => `dailytask_review/assign/delete/${pk}/`,
//     GET_TASKS:       "dailytask_review/tasks/",
//     GET_USERS:       "dailytask_review/users/",
//     UPDATE_REMINDER: (pk) => `dailytask_review/assign/reminder/${pk}/`,
//     SEARCH_USERS:    (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// const nowISO   = () => new Date().toISOString();
// const nowLocal = () => {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
// };
// const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const fmtTime  = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }) : "—";

// const statusColor  = (s) => ({ Pending:"#f57c00", Active:"#2e7d32", Completed:"#1565c0", Cancelled:"#c62828" }[s] ?? TEAL);
// const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color:"#777", bg:"#f5f5f5" };
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

// const EMPTY_FORM = {
//     task_id:"", assignee:"", emails:[], emailInput:"",
//     oem:"", slot:"", priority:"Medium", deadline:"",
//     reminder:"none", remark:"", status:"Pending",
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // STAT CARD — reusable, clickable, auto-highlights when active
// // ─────────────────────────────────────────────────────────────────────────────
// const StatCard = ({ label, count, icon, color, bg, active, onClick, loading }) => (
//     <Paper onClick={onClick} elevation={0} sx={{
//         flex:1, minWidth:160, p:2.5, borderRadius:"16px", cursor:"pointer",
//         border:`1.5px solid ${active ? color : "#e8ecf0"}`,
//         bgcolor: active ? alpha(color, 0.05) : "#fff",
//         transition:"all .2s ease",
//         "&:hover":{ borderColor:color, bgcolor:alpha(color,0.04),
//             transform:"translateY(-2px)", boxShadow:`0 6px 24px ${alpha(color,0.18)}` },
//         boxShadow: active ? `0 4px 20px ${alpha(color,0.2)}` : "0 1px 4px rgba(0,0,0,0.05)",
//         position:"relative", overflow:"hidden",
//     }}>
//         {/* subtle bg pattern */}
//         <Box sx={{ position:"absolute", top:-10, right:-10, width:70, height:70,
//             borderRadius:"50%", bgcolor:alpha(color,0.06), pointerEvents:"none" }} />

//         <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
//             <Box>
//                 <Typography fontSize={12} fontWeight={500} color="text.secondary" mb={0.6}
//                     letterSpacing=".02em">{label}</Typography>
//                 {loading
//                     ? <Skeleton width={40} height={32} />
//                     : <Typography fontSize={30} fontWeight={800} color={active ? color : "#1a1a2e"}
//                         lineHeight={1} sx={{ transition:"color .2s" }}>{count}</Typography>
//                 }
//             </Box>
//             <Box sx={{ width:48, height:48, borderRadius:"14px",
//                 bgcolor: active ? alpha(color,0.15) : bg,
//                 display:"flex", alignItems:"center", justifyContent:"center",
//                 transition:"all .2s", flexShrink:0 }}>
//                 {React.cloneElement(icon, { sx:{ fontSize:24, color, transition:"color .2s" } })}
//             </Box>
//         </Box>

//         {/* active indicator bar */}
//         {active && (
//             <Box sx={{ mt:1.5, height:3, borderRadius:2,
//                 background:`linear-gradient(90deg, ${color}, ${alpha(color,0.3)})` }} />
//         )}
//     </Paper>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const AssignTask = () => {
//     const navigate = useNavigate();

//     // data states
//     const [assignments, setAssignments] = useState([]);
//     const [tasks,       setTasks]       = useState([]);
//     const [users,       setUsers]       = useState([]);
//     const [loading,     setLoading]     = useState(false);
//     const [refreshing,  setRefreshing]  = useState(false);

//     // dialog states
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editId,     setEditId]     = useState(null);
//     const [form,       setForm]       = useState(EMPTY_FORM);
//     const [errors,     setErrors]     = useState({});
//     const [saving,     setSaving]     = useState(false);

//     // dashboard filter states
//     const [tableSearch,    setTableSearch]    = useState("");
//     const [statusFilter,   setStatusFilter]   = useState("All");
//     const [activeStatCard, setActiveStatCard] = useState("All");

//     // dialog task search
//     const [taskSearch, setTaskSearch] = useState("");

//     // email search states
//     const [emailSuggestions, setEmailSuggestions] = useState([]);
//     const [emailSearching,   setEmailSearching]   = useState(false);
//     const [showSuggestions,  setShowSuggestions]  = useState(false);
//     const emailInputRef    = useRef(null);
//     const emailSuggestRef  = useRef(null);
//     const emailSearchTimer = useRef(null);

//     // ── fetch ─────────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(async (isRefresh = false) => {
//         isRefresh ? setRefreshing(true) : setLoading(true);
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
//         } catch (err) { console.error("fetchAll:", err); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     // close email suggestions on outside click
//     useEffect(() => {
//         const h = (e) => {
//             if (emailSuggestRef.current && !emailSuggestRef.current.contains(e.target))
//                 setShowSuggestions(false);
//         };
//         document.addEventListener("mousedown", h);
//         return () => document.removeEventListener("mousedown", h);
//     }, []);

//     // ── dashboard stats — derived automatically from assignments ──────────────
//     const stats = useMemo(() => ({
//         total:     assignments.length,
//         pending:   assignments.filter(a => a.status === "Pending").length,
//         active:    assignments.filter(a => a.status === "Active").length,
//         completed: assignments.filter(a => a.status === "Completed").length,
//         cancelled: assignments.filter(a => a.status === "Cancelled").length,
//     }), [assignments]);

//     // ── filtered table rows ───────────────────────────────────────────────────
//     const filteredRows = useMemo(() => {
//         const q = tableSearch.toLowerCase();
//         return assignments.filter((row) => {
//             const taskName = (tasks.find(t => String(t.id) === String(row.task_id ?? row.task))?.task ?? "").toLowerCase();
//             const assignee = (row.assignee ?? "").toLowerCase();
//             const oem      = (row.oem ?? "").toLowerCase();
//             const matchQ   = !q || taskName.includes(q) || assignee.includes(q) || oem.includes(q);
//             const matchS   = activeStatCard === "All" ? true : row.status === activeStatCard;
//             const matchD   = statusFilter    === "All" ? true : row.status === statusFilter;
//             return matchQ && matchS && matchD;
//         });
//     }, [assignments, tasks, tableSearch, activeStatCard, statusFilter]);

//     // stat card click — filters table + highlights card
//     const handleStatClick = (label) => {
//         setActiveStatCard(label);
//         setStatusFilter(label);
//         setTableSearch("");
//     };

//     // ── form helpers ──────────────────────────────────────────────────────────
//     const set = (field, value) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//         setErrors((e)  => ({ ...e, [field]: "" }));
//     };

//     const filteredTasks = tasks.filter((t) =>
//         (t.task ?? t.name ?? "").toLowerCase().includes(taskSearch.toLowerCase())
//     );

//     const searchEmails = (query) => {
//         set("emailInput", query);
//         setErrors((er) => ({ ...er, emails:"" }));
//         if (!query.trim()) { setEmailSuggestions([]); setShowSuggestions(false); return; }
//         clearTimeout(emailSearchTimer.current);
//         emailSearchTimer.current = setTimeout(async () => {
//             setEmailSearching(true);
//             try {
//                 const res  = await getData(API.SEARCH_USERS(query));
//                 const list = Array.isArray(res) ? res : res?.data ?? [];
//                 setEmailSuggestions(list.filter((u) => u.email && !form.emails.includes(u.email)));
//                 setShowSuggestions(true);
//             } catch (err) { console.error("email search:", err); }
//             finally { setEmailSearching(false); }
//         }, 400);
//     };

//     const pickSuggestion = (user) => {
//         if (!user.email) return;
//         setForm((prev) => ({ ...prev, emails:[...prev.emails, user.email], emailInput:"" }));
//         setEmailSuggestions([]); setShowSuggestions(false);
//         setErrors((er) => ({ ...er, emails:"" }));
//         setTimeout(() => emailInputRef.current?.focus(), 50);
//     };

//     const commitEmail = () => {
//         const val = form.emailInput.trim().replace(/,$/, "");
//         if (!val) return;
//         if (!isValidEmail(val))        { setErrors((e) => ({ ...e, emails:"Invalid email address" })); return; }
//         if (form.emails.includes(val)) { setErrors((e) => ({ ...e, emails:"Already added" }));         return; }
//         setForm((prev) => ({ ...prev, emails:[...prev.emails, val], emailInput:"" }));
//         setErrors((e)  => ({ ...e, emails:"" }));
//     };

//     const removeEmail = (addr) =>
//         setForm((prev) => ({ ...prev, emails:prev.emails.filter((e) => e !== addr) }));

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
//         setForm({ ...EMPTY_FORM, assignee:me.name, emails:me.email?[me.email]:[], emailInput:"", deadline:nowLocal() });
//         setErrors({}); setDialogOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditId(row.id); setTaskSearch(""); setEmailSuggestions([]); setShowSuggestions(false);
//         let emails = [];
//         if (Array.isArray(row.emails))           emails = row.emails;
//         else if (typeof row.emails === "string") emails = row.emails.split(",").map(s=>s.trim()).filter(Boolean);
//         else if (row.email)                      emails = [row.email];
//         setForm({
//             task_id:String(row.task_id??row.task??""), assignee:row.assignee??"",
//             emails, emailInput:"", oem:row.oem??"", slot:row.slot??"",
//             priority:row.priority??"Medium",
//             deadline:row.deadline?row.deadline.slice(0,16):nowLocal(),
//             reminder:row.reminder??"none", remark:row.remark??"", status:row.status??"Pending",
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
//                 await postData(API.UPDATE(editId), fd);
//             } else {
//                 const res = await postData(API.CREATE, fd);
//                 savedId   = res?.id ?? res?.data?.id ?? null;
//             }
//             if (savedId && form.reminder !== "none") {
//                 try { await postData(API.UPDATE_REMINDER(savedId), { reminder:form.reminder }); }
//                 catch (e) { console.warn("Reminder update failed:", e); }
//             }
//             setDialogOpen(false);
//             await fetchAll();
//             Swal.fire({
//                 icon:"success",
//                 title: editId ? "Assignment Updated!" : "Task Assigned!",
//                 html:`Assigned to <b>${form.assignee}</b><br/>
//                       Notifications → <b>${form.emails.join(", ")}</b><br/>
//                       Reminder: <b>${reminderMeta(form.reminder).icon} ${reminderMeta(form.reminder).label}</b>`,
//                 timer:3000, showConfirmButton:false, timerProgressBar:true,
//             });
//         } catch (err) {
//             console.error("handleSave:", err);
//             Swal.fire("Error", "Failed to save assignment.", "error");
//         } finally { setSaving(false); }
//     };

//     const handleDelete = (row) => {
//         Swal.fire({
//             title:"Remove Assignment?",
//             html:`<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
//             icon:"warning", showCancelButton:true,
//             confirmButtonColor:"#c62828", confirmButtonText:"Yes, remove",
//         }).then(async (res) => {
//             if (!res.isConfirmed) return;
//             try {
//                 await fetch(`${ServerURL}${API.DELETE(row.id)}`, { method:"DELETE", headers:{ Accept:"application/json" } });
//                 await fetchAll();
//             } catch { Swal.fire("Error","Failed to remove assignment.","error"); }
//         });
//     };

//     const taskLabel = (id) => {
//         const t = tasks.find((t) => String(t.id) === String(id));
//         return t?.task ?? t?.name ?? id ?? "—";
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     // RENDER
//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p:3, bgcolor:"#f4f6f9", minHeight:"100vh" }}>

//             {/* Breadcrumb */}
//             <Box mb={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />} sx={{ fontSize:13 }}>
//                     <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor:"pointer", color:TEAL }} onClick={() => navigate("/tools/daily_task_review")}>Daily Task Review</Link>
//                     <Typography color="text.primary" fontSize={13}>Assign Task</Typography>
//                 </Breadcrumbs>
//             </Box>

//             {/* ══════════════════ MAIN DASHBOARD CARD ══════════════════ */}
//             <Paper elevation={0} sx={{
//                 borderRadius:"20px", overflow:"hidden",
//                 border:"1px solid #e8ecf0", bgcolor:"#fff",
//                 boxShadow:"0 2px 20px rgba(0,0,0,0.07)",
//             }}>

//                 {/* ── Header ── */}
//                 <Box sx={{
//                     px:3, pt:3, pb:2.5,
//                     borderBottom:"1px solid #f0f2f5",
//                     background:`linear-gradient(135deg, #fff 60%, ${alpha(TEAL,0.03)} 100%)`,
//                 }}>
//                     <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
//                         <Box>
//                             <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
//                                 Assign Task
//                             </Typography>
//                             <Typography fontSize={13} color="text.secondary" mt={0.3}>
//                                 Manage all task assignments, reminders and assignees
//                             </Typography>
//                         </Box>
//                         <Box display="flex" gap={1.5} alignItems="center">
//                             <Button
//                                 variant="outlined"
//                                 startIcon={
//                                     <RefreshIcon sx={{
//                                         fontSize: "18px !important",
//                                         animation: refreshing ? "spin .8s linear infinite" : "none",
//                                         "@keyframes spin":{ to:{ transform:"rotate(360deg)" } },
//                                     }} />
//                                 }
//                                 onClick={() => fetchAll(true)}
//                                 disabled={refreshing}
//                                 sx={{
//                                     textTransform:"none", fontWeight:600, borderRadius:"10px",
//                                     fontSize:13.5, px:2.2, py:0.9,
//                                     borderColor:TEAL_MID, color:TEAL,
//                                     "&:hover":{ borderColor:TEAL, bgcolor:alpha(TEAL,0.05) },
//                                 }}>
//                                 {refreshing ? "Refreshing…" : "Refresh"}
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 startIcon={<AddIcon />}
//                                 onClick={openCreate}
//                                 sx={{
//                                     bgcolor:TEAL, "&:hover":{ bgcolor:TEAL_DARK },
//                                     textTransform:"none", fontWeight:700,
//                                     borderRadius:"10px", px:2.5, fontSize:13.5,
//                                     boxShadow:`0 4px 14px ${alpha(TEAL,0.4)}`,
//                                 }}>
//                                 Assign Task
//                             </Button>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {/* ── Stat Cards ── */}
//                 <Box sx={{ px:3, py:2.5, borderBottom:"1px solid #f0f2f5", bgcolor:alpha("#f8fafc",0.7) }}>
//                     <Box display="flex" gap={2} flexWrap="wrap">
//                         <StatCard label="Total" count={stats.total}
//                             icon={<AssignmentIndOutlinedIcon />}
//                             color={TEAL} bg={TEAL_LIGHT}
//                             active={activeStatCard === "All"} loading={loading}
//                             onClick={() => handleStatClick("All")} />
//                         <StatCard label="Pending" count={stats.pending}
//                             icon={<HourglassEmptyIcon />}
//                             color="#f57c00" bg="#fff3e0"
//                             active={activeStatCard === "Pending"} loading={loading}
//                             onClick={() => handleStatClick("Pending")} />
//                         <StatCard label="Active" count={stats.active}
//                             icon={<PlayCircleOutlineIcon />}
//                             color="#2e7d32" bg="#e8f5e9"
//                             active={activeStatCard === "Active"} loading={loading}
//                             onClick={() => handleStatClick("Active")} />
//                         <StatCard label="Completed" count={stats.completed}
//                             icon={<CheckCircleOutlineIcon />}
//                             color="#1565c0" bg="#e3f2fd"
//                             active={activeStatCard === "Completed"} loading={loading}
//                             onClick={() => handleStatClick("Completed")} />
//                         <StatCard label="Cancelled" count={stats.cancelled}
//                             icon={<CancelOutlinedIcon />}
//                             color="#c62828" bg="#fdecea"
//                             active={activeStatCard === "Cancelled"} loading={loading}
//                             onClick={() => handleStatClick("Cancelled")} />
//                     </Box>
//                 </Box>

//                 {/* ── Search + Filter Bar ── */}
//                 <Box sx={{ px:3, py:1.8, borderBottom:"1px solid #f0f2f5",
//                     display:"flex", gap:2, alignItems:"center", flexWrap:"wrap" }}>
//                     <TextField
//                         size="small" placeholder="Search task, assignee or OEM…"
//                         value={tableSearch}
//                         onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
//                         sx={{
//                             flex:1, minWidth:240,
//                             "& .MuiOutlinedInput-root":{
//                                 borderRadius:"10px", bgcolor:"#f8fafc", fontSize:13.5,
//                                 "&:hover fieldset":{ borderColor:TEAL },
//                                 "&.Mui-focused fieldset":{ borderColor:TEAL },
//                             },
//                         }}
//                         InputProps={{ startAdornment:(
//                             <InputAdornment position="start">
//                                 <SearchIcon sx={{ fontSize:18, color:"#9ca3af" }} />
//                             </InputAdornment>) }}
//                     />
//                     <TextField
//                         select size="small" value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
//                         sx={{
//                             minWidth:170,
//                             "& .MuiOutlinedInput-root":{
//                                 borderRadius:"10px", bgcolor:"#f8fafc", fontSize:13.5,
//                                 "&:hover fieldset":{ borderColor:TEAL },
//                                 "&.Mui-focused fieldset":{ borderColor:TEAL },
//                             },
//                         }}
//                         InputProps={{ startAdornment:(
//                             <InputAdornment position="start">
//                                 <FilterListIcon sx={{ fontSize:17, color:"#9ca3af" }} />
//                             </InputAdornment>) }}>
//                         {STATUS_FILTERS.map(s => (
//                             <MenuItem key={s} value={s}>
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     {s !== "All" && (
//                                         <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:statusColor(s) }} />
//                                     )}
//                                     {s}
//                                 </Box>
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     {/* active filter pill */}
//                     {(tableSearch || statusFilter !== "All") && (
//                         <Box display="flex" alignItems="center" gap={1}>
//                             <Typography fontSize={12} color="text.secondary">
//                                 {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
//                             </Typography>
//                             <Chip label="Clear" size="small"
//                                 onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); }}
//                                 sx={{ height:22, fontSize:11, bgcolor:alpha(TEAL,0.08), color:TEAL,
//                                     "& .MuiChip-deleteIcon":{ fontSize:14, color:TEAL } }} />
//                         </Box>
//                     )}
//                 </Box>

//                 {/* ── Table ── */}
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ bgcolor:TEAL }}>
//                                 {["SN","Task","Assignee","Recipients","OEM","Slot","Priority","Deadline","Reminder","Status","Actions"].map((h) => (
//                                     <TableCell key={h} sx={{
//                                         color:"#fff", fontWeight:700, fontSize:12.5,
//                                         py:1.6, letterSpacing:".03em", whiteSpace:"nowrap",
//                                     }}>{h}</TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>

//                             {/* skeleton */}
//                             {loading && Array.from({ length:5 }).map((_,i) => (
//                                 <TableRow key={i}>
//                                     {Array.from({ length:11 }).map((_,j) => (
//                                         <TableCell key={j}><Skeleton height={22} sx={{ borderRadius:4 }} /></TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))}

//                             {/* empty */}
//                             {!loading && filteredRows.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={11} align="center" sx={{ py:7 }}>
//                                         <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//                                             <Box sx={{ width:56, height:56, borderRadius:"16px",
//                                                 bgcolor:alpha(TEAL,0.08), display:"flex",
//                                                 alignItems:"center", justifyContent:"center" }}>
//                                                 <AssignmentIndOutlinedIcon sx={{ fontSize:28, color:TEAL_MID }} />
//                                             </Box>
//                                             <Typography fontWeight={600} fontSize={14} color="text.secondary">
//                                                 {tableSearch || statusFilter !== "All"
//                                                     ? "No assignments found for this filter"
//                                                     : "No assignments yet"}
//                                             </Typography>
//                                             <Typography fontSize={12.5} color="text.disabled">
//                                                 {tableSearch || statusFilter !== "All"
//                                                     ? "Try adjusting your search or filter"
//                                                     : "Click + Assign Task to get started"}
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             )}

//                             {/* data rows */}
//                             {!loading && filteredRows.map((row, idx) => {
//                                 const pm = priorityMeta(row.priority);
//                                 const sm = slotMeta(row.slot);
//                                 const rm = reminderMeta(row.reminder);
//                                 const rowEmails = Array.isArray(row.emails)
//                                     ? row.emails
//                                     : (row.emails ?? row.email ?? "").split(",").map(s=>s.trim()).filter(Boolean);
//                                 return (
//                                     <TableRow key={row.id ?? idx} hover sx={{
//                                         "&:nth-of-type(even)":{ bgcolor:"#fafbfc" },
//                                         "&:hover":{ bgcolor:alpha(TEAL,0.03) },
//                                         transition:"background .12s",
//                                     }}>
//                                         <TableCell sx={{ color:"#b0b7c3", fontSize:12, width:40, fontWeight:600 }}>{idx+1}</TableCell>

//                                         <TableCell>
//                                             <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
//                                                 <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth:130 }}>
//                                                     {taskLabel(row.task_id ?? row.task)}
//                                                 </Typography>
//                                             </Tooltip>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" alignItems="center" gap={0.8}>
//                                                 <Avatar sx={{ width:28, height:28, fontSize:11, fontWeight:700,
//                                                     bgcolor:alpha(TEAL,0.18), color:TEAL_DARK }}>
//                                                     {(row.assignee ?? "?")[0].toUpperCase()}
//                                                 </Avatar>
//                                                 <Typography fontSize={13} fontWeight={500}>{row.assignee ?? "—"}</Typography>
//                                             </Box>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" flexWrap="wrap" gap={0.4} maxWidth={180}>
//                                                 {rowEmails.slice(0,2).map((em) => (
//                                                     <Chip key={em} label={em} size="small"
//                                                         sx={{ fontSize:10.5, height:20, bgcolor:"#f3f4f6",
//                                                               color:"#374151", fontFamily:"monospace" }} />
//                                                 ))}
//                                                 {rowEmails.length > 2 && (
//                                                     <Tooltip title={rowEmails.slice(2).join(", ")} arrow>
//                                                         <Chip label={`+${rowEmails.length-2}`} size="small"
//                                                             sx={{ fontSize:10.5, height:20, bgcolor:TEAL_LIGHT,
//                                                                   color:TEAL_DARK, fontWeight:700 }} />
//                                                     </Tooltip>
//                                                 )}
//                                             </Box>
//                                         </TableCell>

//                                         <TableCell>
//                                             <Chip label={row.oem || "—"} size="small"
//                                                 sx={{ bgcolor:"#e3f2fd", color:"#0d47a1", fontWeight:600,
//                                                       fontSize:11, border:"1px solid #90caf9" }} />
//                                         </TableCell>

//                                         <TableCell>
//                                             {sm ? (
//                                                 <Chip label={sm.label} size="small"
//                                                     sx={{ bgcolor:alpha(sm.color,0.1), color:sm.color,
//                                                           fontWeight:600, fontSize:11,
//                                                           border:`1px solid ${alpha(sm.color,0.3)}` }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         <TableCell>
//                                             <Chip label={row.priority || "—"} size="small"
//                                                 sx={{ bgcolor:pm.bg, color:pm.color, fontWeight:700,
//                                                       fontSize:11, border:`1px solid ${alpha(pm.color,0.3)}` }} />
//                                         </TableCell>

//                                         <TableCell sx={{ whiteSpace:"nowrap" }}>
//                                             <Typography fontSize={12} color="text.secondary">{fmtDate(row.deadline)}</Typography>
//                                             <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
//                                         </TableCell>

//                                         <TableCell>
//                                             {row.reminder && row.reminder !== "none" ? (
//                                                 <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize:"13px !important" }} />}
//                                                     label={rm.label} size="small"
//                                                     sx={{ bgcolor:"#ede7f6", color:"#4527a0", fontWeight:600,
//                                                           fontSize:11, border:"1px solid #d1c4e9" }} />
//                                             ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
//                                         </TableCell>

//                                         <TableCell>
//                                             <Chip label={row.status ?? "Pending"} size="small"
//                                                 sx={{ bgcolor:alpha(statusColor(row.status),0.1),
//                                                       color:statusColor(row.status), fontWeight:700,
//                                                       fontSize:11, border:`1px solid ${alpha(statusColor(row.status),0.25)}` }} />
//                                         </TableCell>

//                                         <TableCell>
//                                             <Box display="flex" gap={0.5}>
//                                                 <Tooltip title="Edit" arrow>
//                                                     <IconButton size="small" onClick={() => openEdit(row)}
//                                                         sx={{ color:TEAL, "&:hover":{ bgcolor:alpha(TEAL,0.1) } }}>
//                                                         <EditOutlinedIcon sx={{ fontSize:17 }} />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete" arrow>
//                                                     <IconButton size="small" onClick={() => handleDelete(row)}
//                                                         sx={{ color:"#c62828", "&:hover":{ bgcolor:"#fdecea" } }}>
//                                                         <DeleteOutlineIcon sx={{ fontSize:17 }} />
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

//                 {/* table footer */}
//                 {!loading && (
//                     <Box sx={{ px:3, py:1.5, borderTop:"1px solid #f0f2f5",
//                         display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                         <Typography variant="caption" color="text.disabled">
//                             Showing <strong>{filteredRows.length}</strong> of <strong>{assignments.length}</strong> assignments
//                         </Typography>
//                         <Typography variant="caption" color="text.disabled">
//                             Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove
//                         </Typography>
//                     </Box>
//                 )}
//             </Paper>

//             {/* ══════════════════════════════════════════════════════════════
//                 DIALOG
//             ══════════════════════════════════════════════════════════════ */}
//             <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
//                 maxWidth="sm" fullWidth disableScrollLock
//                 PaperProps={{ sx:{ borderRadius:"16px", overflow:"hidden",
//                     boxShadow:"0 24px 60px rgba(0,0,0,0.18)" } }}>

//                 <Box sx={{ height:5, background:`linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

//                 <DialogTitle sx={{ p:0 }}>
//                     <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between",
//                         px:3, pt:2.5, pb:1.5 }}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                             <Box sx={{ width:36, height:36, borderRadius:"10px",
//                                 bgcolor:alpha(TEAL,0.12), display:"flex",
//                                 alignItems:"center", justifyContent:"center" }}>
//                                 <AssignmentIndOutlinedIcon sx={{ color:TEAL, fontSize:20 }} />
//                             </Box>
//                             <Box>
//                                 <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>
//                                     {editId ? "Edit Assignment" : "Assign Task"}
//                                 </Typography>
//                                 <Typography fontSize={12} color="text.secondary">
//                                     {editId ? "Update assignment details" : "Fill in the details to assign"}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         <Tooltip title="Close" arrow>
//                             <IconButton onClick={() => setDialogOpen(false)}
//                                 sx={{ width:32, height:32, bgcolor:"#f3f4f6", color:"#6b7280",
//                                       borderRadius:"8px", transition:"all .18s",
//                                       "&:hover":{ bgcolor:"#fdecea", color:"#c62828", transform:"rotate(90deg)" } }}>
//                                 <CloseIcon sx={{ fontSize:17 }} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </DialogTitle>

//                 <Divider />

//                 <DialogContent sx={{ px:3, pt:2.5, pb:1 }}>
//                     <Box display="flex" flexDirection="column" gap={2.2}>

//                         {/* SEARCHABLE TASK DROPDOWN */}
//                         <TextField select label="Select Task" value={form.task_id}
//                             onChange={(e) => set("task_id", e.target.value)}
//                             error={!!errors.task_id} helperText={errors.task_id}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{ startAdornment:(
//                                 <InputAdornment position="start">
//                                     <TaskAltOutlinedIcon sx={{ fontSize:18, color:TEAL }} />
//                                 </InputAdornment>) }}
//                             SelectProps={{ MenuProps:{
//                                 PaperProps:{ sx:{ maxHeight:320 } },
//                                 autoFocus:false, disableAutoFocusItem:true, disableEnforceFocus:true,
//                             }}}>
//                             <MenuItem disableRipple disableTouchRipple
//                                 sx={{ position:"sticky", top:0, zIndex:10, bgcolor:"#fff",
//                                     "&:hover":{ bgcolor:"#fff" }, cursor:"default", py:1 }}>
//                                 <TextField size="small" fullWidth autoFocus
//                                     placeholder="Search task..."
//                                     value={taskSearch}
//                                     onChange={(e) => setTaskSearch(e.target.value)}
//                                     onClick={(e) => e.stopPropagation()}
//                                     onKeyDown={(e) => e.stopPropagation()}
//                                     InputProps={{ startAdornment:(
//                                         <InputAdornment position="start">
//                                             <SearchIcon sx={{ fontSize:16, color:"#aaa" }} />
//                                         </InputAdornment>) }}
//                                     sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"6px", fontSize:13, bgcolor:"#fff" } }}
//                                 />
//                             </MenuItem>
//                             <MenuItem value="" disabled>
//                                 <em style={{ color:"#aaa" }}>— Choose a task —</em>
//                             </MenuItem>
//                             {filteredTasks.length === 0 && (
//                                 <MenuItem disabled>
//                                     <Typography fontSize={13} color="text.disabled">No tasks found</Typography>
//                                 </MenuItem>
//                             )}
//                             {filteredTasks.map((t) => (
//                                 <MenuItem key={t.id} value={String(t.id)}
//                                     sx={{ fontSize:13, "&:hover":{ bgcolor:TEAL_LIGHT } }}>
//                                     {t.task ?? t.name ?? t.title}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         {/* Assignee */}
//                         <TextField label="Assignee" value={form.assignee}
//                             onChange={(e) => set("assignee", e.target.value)}
//                             error={!!errors.assignee}
//                             helperText={errors.assignee || "Auto-filled from your login session"}
//                             size="small" fullWidth sx={fieldSx}
//                             InputProps={{
//                                 startAdornment:(<InputAdornment position="start">
//                                     <PersonOutlineIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>),
//                                 endAdornment: form.assignee ? (
//                                     <InputAdornment position="end">
//                                         <Avatar sx={{ width:22, height:22, fontSize:10, fontWeight:700,
//                                             bgcolor:alpha(TEAL,0.2), color:TEAL_DARK }}>
//                                             {form.assignee[0].toUpperCase()}
//                                         </Avatar>
//                                     </InputAdornment>) : null,
//                             }} />

//                         {/* MULTI-EMAIL WITH BACKEND SEARCH */}
//                         <Box ref={emailSuggestRef} sx={{ position:"relative" }}>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
//                                 sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
//                                 <GroupAddOutlinedIcon sx={{ fontSize:15, color:TEAL }} />
//                                 Recipients (emails)
//                                 <Chip label={`${form.emails.length} added`} size="small"
//                                     sx={{ ml:0.5, height:18, fontSize:10.5, bgcolor:TEAL_LIGHT, color:TEAL_DARK }} />
//                             </Typography>
//                             <Paper variant="outlined"
//                                 onClick={() => emailInputRef.current?.focus()}
//                                 sx={{ p:"8px 10px", minHeight:46, display:"flex",
//                                     alignItems:"center", flexWrap:"wrap", gap:0.7,
//                                     borderRadius:"8px", cursor:"text",
//                                     borderColor: errors.emails ? "#c62828" : showSuggestions ? TEAL : "#c4c4c4",
//                                     "&:hover":{ borderColor: errors.emails ? "#c62828" : TEAL },
//                                     transition:"border-color .15s" }}>
//                                 {form.emails.map((em) => (
//                                     <Chip key={em} label={em} size="small" onDelete={() => removeEmail(em)}
//                                         sx={{ bgcolor:TEAL_LIGHT, color:TEAL_DARK, fontWeight:500,
//                                               fontSize:12, height:24, fontFamily:"monospace",
//                                               "& .MuiChip-deleteIcon":{ fontSize:14, color:TEAL } }} />
//                                 ))}
//                                 <Box sx={{ display:"flex", alignItems:"center", flex:1, minWidth:180, gap:0.5 }}>
//                                     <input ref={emailInputRef} value={form.emailInput}
//                                         placeholder={form.emails.length === 0 ? "Search name or type email…" : "Add more…"}
//                                         onChange={(e) => searchEmails(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (["Enter","Tab",","].includes(e.key)) {
//                                                 e.preventDefault();
//                                                 if (emailSuggestions.length > 0 && !isValidEmail(form.emailInput))
//                                                     pickSuggestion(emailSuggestions[0]);
//                                                 else { commitEmail(); setShowSuggestions(false); }
//                                             }
//                                             if (e.key === "Escape") setShowSuggestions(false);
//                                             if (e.key === "Backspace" && !form.emailInput && form.emails.length > 0)
//                                                 removeEmail(form.emails[form.emails.length - 1]);
//                                         }}
//                                         onFocus={() => { if (emailSuggestions.length > 0) setShowSuggestions(true); }}
//                                         style={{ border:"none", outline:"none", flex:1, fontSize:13,
//                                             background:"transparent", fontFamily:"inherit", color:"inherit" }} />
//                                     {emailSearching && (
//                                         <Box sx={{ width:14, height:14, flexShrink:0,
//                                             border:`2px solid ${TEAL}`, borderTopColor:"transparent",
//                                             borderRadius:"50%", animation:"spin .7s linear infinite",
//                                             "@keyframes spin":{ to:{ transform:"rotate(360deg)" } } }} />
//                                     )}
//                                 </Box>
//                             </Paper>
//                             {showSuggestions && emailSuggestions.length > 0 && (
//                                 <Paper elevation={6} sx={{ position:"absolute", top:"calc(100% + 4px)",
//                                     left:0, right:0, zIndex:1400, borderRadius:"10px", overflow:"hidden",
//                                     border:`1px solid ${TEAL_MID}`, maxHeight:220, overflowY:"auto",
//                                     boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
//                                     <Box sx={{ px:2, py:0.8, bgcolor:TEAL_LIGHT, borderBottom:`1px solid ${TEAL_MID}` }}>
//                                         <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
//                                             {emailSuggestions.length} result{emailSuggestions.length !== 1 ? "s" : ""} found
//                                         </Typography>
//                                     </Box>
//                                     {emailSuggestions.map((u) => (
//                                         <Box key={u.email ?? u.id}
//                                             onMouseDown={(e) => { e.preventDefault(); pickSuggestion(u); }}
//                                             sx={{ display:"flex", alignItems:"center", gap:1.5,
//                                                 px:2, py:1.2, cursor:"pointer",
//                                                 borderBottom:"1px solid #f5f5f5", transition:"background .12s",
//                                                 "&:hover":{ bgcolor:TEAL_LIGHT }, "&:last-child":{ borderBottom:"none" } }}>
//                                             <Avatar sx={{ width:30, height:30, fontSize:12, fontWeight:700,
//                                                 bgcolor:alpha(TEAL,0.18), color:TEAL_DARK, flexShrink:0 }}>
//                                                 {(u.name ?? u.username ?? "?")[0].toUpperCase()}
//                                             </Avatar>
//                                             <Box flex={1} minWidth={0}>
//                                                 <Typography fontSize={13} fontWeight={600} noWrap>{u.name ?? u.username}</Typography>
//                                                 <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>{u.email}</Typography>
//                                             </Box>
//                                             <Chip label="+ Add" size="small"
//                                                 sx={{ height:20, fontSize:10.5, bgcolor:TEAL_LIGHT,
//                                                       color:TEAL_DARK, fontWeight:700, flexShrink:0 }} />
//                                         </Box>
//                                     ))}
//                                 </Paper>
//                             )}
//                             <Typography fontSize={11}
//                                 color={errors.emails ? "error.main" : "text.secondary"} mt={0.4} ml={0.5}>
//                                 {errors.emails || "Search by name · or type email + Enter · Backspace removes last"}
//                             </Typography>
//                         </Box>

//                         {/* OEM + Slot */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="OEM" value={form.oem}
//                                     onChange={(e) => set("oem", e.target.value)}
//                                     error={!!errors.oem} helperText={errors.oem}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(<InputAdornment position="start">
//                                         <RouterOutlinedIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>) }}>
//                                     <MenuItem value="" disabled><em style={{ color:"#aaa" }}>— Select OEM —</em></MenuItem>
//                                     {OEM_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField select label="Slot" value={form.slot}
//                                     onChange={(e) => set("slot", e.target.value)}
//                                     error={!!errors.slot} helperText={errors.slot}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(<InputAdornment position="start">
//                                         <WbSunnyOutlinedIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>) }}>
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

//                         {/* Priority + Status */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField select label="Priority" value={form.priority}
//                                     onChange={(e) => set("priority", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(<InputAdornment position="start">
//                                         <FlagOutlinedIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>) }}>
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
//                                     onChange={(e) => set("status", e.target.value)}
//                                     size="small" fullWidth sx={fieldSx}
//                                     InputProps={{ startAdornment:(<InputAdornment position="start">
//                                         <AccessTimeOutlinedIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>) }}>
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

//                         {/* Deadline */}
//                         <TextField label="Deadline" type="datetime-local" value={form.deadline}
//                             onChange={(e) => set("deadline", e.target.value)}
//                             error={!!errors.deadline}
//                             helperText={errors.deadline || "Select date and time to complete the task"}
//                             size="small" fullWidth InputLabelProps={{ shrink:true }}
//                             inputProps={{ min:nowLocal() }} sx={fieldSx}
//                             InputProps={{ startAdornment:(<InputAdornment position="start">
//                                 <EventOutlinedIcon sx={{ fontSize:18, color:TEAL }} /></InputAdornment>) }} />

//                         {/* Reminder */}
//                         <Box>
//                             <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}
//                                 sx={{ display:"flex", alignItems:"center", gap:0.6 }}>
//                                 <NotificationsOutlinedIcon sx={{ fontSize:15, color:TEAL }} />
//                                 Reminder Frequency
//                                 <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>
//                                     (sends to all recipients)
//                                 </Typography>
//                             </Typography>
//                             <Box display="flex" gap={1} flexWrap="wrap">
//                                 {REMINDER_OPTIONS.map((r) => {
//                                     const active = form.reminder === r.value;
//                                     return (
//                                         <Box key={r.value} onClick={() => set("reminder", r.value)}
//                                             sx={{ display:"flex", alignItems:"center", gap:0.7,
//                                                 px:1.8, py:0.9, borderRadius:"8px", cursor:"pointer",
//                                                 fontSize:13, fontWeight: active ? 700 : 500,
//                                                 border:`1.5px solid ${active ? TEAL : "#e0e0e0"}`,
//                                                 bgcolor: active ? alpha(TEAL,0.08) : "#fafafa",
//                                                 color: active ? TEAL_DARK : "#555",
//                                                 transition:"all .17s", userSelect:"none",
//                                                 "&:hover":{ borderColor:TEAL, bgcolor:alpha(TEAL,0.05) } }}>
//                                             <span style={{ fontSize:15 }}>{r.icon}</span>
//                                             {r.label}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>
//                             {form.reminder !== "none" && (
//                                 <Paper variant="outlined" sx={{ mt:1.2, px:1.8, py:1,
//                                     bgcolor:"#ede7f6", border:"1px solid #d1c4e9", borderRadius:"8px",
//                                     display:"flex", alignItems:"center", gap:1 }}>
//                                     <NotificationsOutlinedIcon sx={{ fontSize:16, color:"#4527a0" }} />
//                                     <Typography fontSize={12.5} color="#4527a0">
//                                         {form.reminder === "daily"   && "A reminder will be sent every day until the deadline."}
//                                         {form.reminder === "weekly"  && "A reminder will be sent every week on the same day."}
//                                         {form.reminder === "monthly" && "A reminder will be sent once every month."}
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </Box>

//                         {/* Auto assigned-at */}
//                         <Paper variant="outlined" sx={{ display:"flex", alignItems:"center", gap:1.2,
//                             px:2, py:1.2, bgcolor:TEAL_LIGHT, border:`1px solid ${TEAL_MID}`, borderRadius:"8px" }}>
//                             <CalendarTodayOutlinedIcon sx={{ fontSize:16, color:TEAL_DARK }} />
//                             <Typography fontSize={13} color={TEAL_DARK}>
//                                 <strong>Assigned at:</strong>{" "}
//                                 {new Date().toLocaleDateString("en-IN", {
//                                     weekday:"long", day:"2-digit", month:"long", year:"numeric" })}{" "}
//                                 · {new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true })}
//                             </Typography>
//                         </Paper>

//                         {/* Remark */}
//                         <TextField label="Remark (optional)" value={form.remark}
//                             onChange={(e) => set("remark", e.target.value)}
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
//                               boxShadow:`0 2px 8px ${alpha(TEAL,0.35)}` }}>
//                         {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius:"8px",
//         "&:hover fieldset":       { borderColor:TEAL },
//         "&.Mui-focused fieldset": { borderColor:TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color:TEAL },
// };

// export default AssignTask;

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Chip, Tooltip, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
    InputAdornment, Divider, alpha, Grid, Avatar, Badge, LinearProgress,
    ToggleButton, ToggleButtonGroup, Drawer,
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
import DragIndicatorIcon          from "@mui/icons-material/DragIndicator";
import MoreVertIcon               from "@mui/icons-material/MoreVert";
import Breadcrumbs                from "@mui/material/Breadcrumbs";
import Link                       from "@mui/material/Link";
import KeyboardArrowRightIcon     from "@mui/icons-material/KeyboardArrowRight";
import Swal                       from "sweetalert2";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import { useNavigate }            from "react-router-dom";

// ─── theme ──────────────────────────────────────────────────────────────────
const TEAL       = "#228b7f";
const TEAL_DARK  = "#004d40";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID   = "#b2dfdb";

// ─── static lists ────────────────────────────────────────────────────────────
const OEM_OPTIONS = ["Nokia", "Ericsson", "Samsung", "Huawei", "ZTE"];

const SLOT_OPTIONS = [
    { value: "morning",   label: "🌤  Morning",   color: "#f57c00" },
    { value: "afternoon", label: "☀️  Afternoon", color: "#f9a825" },
    { value: "evening",   label: "🌙  Evening",   color: "#5c6bc0" },
    { value: "night",     label: "🌌  Night",     color: "#37474f" },
];

const PRIORITY_OPTIONS = [
    { value: "Critical", color: "#c62828", bg: "#fdecea" },
    { value: "High",     color: "#e65100", bg: "#fff3e0" },
    { value: "Medium",   color: "#f57c00", bg: "#fff8e1" },
    { value: "Low",      color: "#2e7d32", bg: "#e8f5e9" },
];

const REMINDER_OPTIONS = [
    { value: "none",    label: "None",    icon: "🔕" },
    { value: "daily",   label: "Daily",   icon: "📅" },
    { value: "weekly",  label: "Weekly",  icon: "📆" },
    { value: "monthly", label: "Monthly", icon: "🗓" },
];

const STATUS_FILTERS = ["All", "Pending", "Active", "Completed", "Cancelled"];

const KANBAN_COLS = [
    { key: "Pending",   label: "Pending",   color: "#f57c00", bg: "#fff8f0", icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} /> },
    { key: "Active",    label: "In Progress", color: "#2e7d32", bg: "#f0f9f0", icon: <PlayCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Completed", label: "Done",       color: "#1565c0", bg: "#f0f5ff", icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
    { key: "Cancelled", label: "Cancelled",  color: "#c62828", bg: "#fff5f5", icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
];

// ─── api paths ────────────────────────────────────────────────────────────────
const API = {
    CREATE:          "dailytask_review/assign/create/",
    GET_ALL:         "dailytask_review/assign/",
    UPDATE:          (pk) => `dailytask_review/assign/update/${pk}/`,
    DELETE:          (pk) => `dailytask_review/assign/delete/${pk}/`,
    GET_TASKS:       "dailytask_review/tasks/",
    GET_USERS:       "dailytask_review/users/",
    UPDATE_REMINDER: (pk) => `dailytask_review/assign/reminder/${pk}/`,
    SEARCH_USERS:    (q)  => `dailytask_review/users/?search=${encodeURIComponent(q)}`,
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
const isOverdue = (iso, status) => iso && !["Completed", "Cancelled"].includes(status) && new Date(iso) < new Date();

const statusColor  = (s) => ({ Pending: "#f57c00", Active: "#2e7d32", Completed: "#1565c0", Cancelled: "#c62828" }[s] ?? TEAL);
const priorityMeta = (p) => PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };
const slotMeta     = (v) => SLOT_OPTIONS.find((o) => o.value === v);
const reminderMeta = (v) => REMINDER_OPTIONS.find((o) => o.value === v) ?? REMINDER_OPTIONS[0];

const getLoggedInUser = () => {
    try {
        const raw = localStorage.getItem("user") ?? localStorage.getItem("userInfo") ?? "{}";
        const obj = JSON.parse(raw);
        return { name: obj.name ?? obj.username ?? obj.full_name ?? "", email: obj.email ?? obj.emailaddress ?? "" };
    } catch { return { name: "", email: "" }; }
};

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const EMPTY_FORM = {
    task_id: "", assignee: "", emails: [], emailInput: "",
    oem: "", slot: "", priority: "Medium", deadline: "",
    reminder: "none", remark: "", status: "Pending",
};

// ─── tiny sparkline svg ───────────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 32, width = 80 }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) =>
        `${(i / (data.length - 1)) * width},${height - (v / max) * (height - 4) - 2}`
    ).join(" ");
    return (
        <svg width={width} height={height} style={{ display: "block" }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

// ─── stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, icon, color, bg, active, onClick, loading, trend }) => (
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
                {trend && !loading && (
                    <Typography fontSize={10.5} color={trend > 0 ? "#2e7d32" : "#c62828"} mt={0.3} fontWeight={600}>
                        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% this week
                    </Typography>
                )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: active ? alpha(color, 0.15) : bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
                </Box>
            </Box>
        </Box>
        {active && <Box sx={{ mt: 1.2, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />}
    </Paper>
);

// ─── analytics panel ─────────────────────────────────────────────────────────
const AnalyticsPanel = ({ assignments, tasks, open, onClose }) => {
    const stats = useMemo(() => {
        const total = assignments.length;
        const byStatus = { Pending: 0, Active: 0, Completed: 0, Cancelled: 0 };
        const byPriority = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const byOEM = {};
        const bySlot = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        const overdueCount = assignments.filter(a => isOverdue(a.deadline, a.status)).length;

        assignments.forEach(a => {
            if (byStatus[a.status] !== undefined) byStatus[a.status]++;
            if (byPriority[a.priority] !== undefined) byPriority[a.priority]++;
            if (a.oem) byOEM[a.oem] = (byOEM[a.oem] || 0) + 1;
            if (bySlot[a.slot] !== undefined) bySlot[a.slot]++;
        });

        const completionRate = total > 0 ? Math.round((byStatus.Completed / total) * 100) : 0;
        const assigneeMap = {};
        assignments.forEach(a => { if (a.assignee) assigneeMap[a.assignee] = (assigneeMap[a.assignee] || 0) + 1; });
        const topAssignees = Object.entries(assigneeMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

        return { total, byStatus, byPriority, byOEM, bySlot, completionRate, overdueCount, topAssignees };
    }, [assignments]);

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
            PaperProps={{ sx: { width: 380, p: 0, bgcolor: "#f8fafc", border: "none" } }}>
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #26a69a, #80cbc4)` }} />
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #eee", bgcolor: "#fff" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography fontWeight={700} fontSize={16}>Analytics Overview</Typography>
                        <Typography fontSize={12} color="text.secondary">Live stats from all assignments</Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose}
                        sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                        <CloseIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ p: 2.5, overflowY: "auto", height: "calc(100vh - 80px)" }}>

                {/* completion rate */}
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
                            <Typography fontSize={13} color="text.secondary" mb={0.5}>{stats.byStatus.Completed} of {stats.total} tasks done</Typography>
                            {stats.overdueCount > 0 && (
                                <Chip icon={<WarningAmberOutlinedIcon sx={{ fontSize: "13px !important", color: "#e65100 !important" }} />}
                                    label={`${stats.overdueCount} overdue`} size="small"
                                    sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11, border: "1px solid #ffcc80" }} />
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* by status */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Status Breakdown</Typography>
                    <ProgressRow label="Pending"   value={stats.byStatus.Pending}   max={stats.total} color="#f57c00" />
                    <ProgressRow label="Active"    value={stats.byStatus.Active}    max={stats.total} color="#2e7d32" />
                    <ProgressRow label="Completed" value={stats.byStatus.Completed} max={stats.total} color="#1565c0" />
                    <ProgressRow label="Cancelled" value={stats.byStatus.Cancelled} max={stats.total} color="#c62828" />
                </Paper>

                {/* by priority */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Priority Distribution</Typography>
                    {PRIORITY_OPTIONS.map(p => (
                        <ProgressRow key={p.value} label={p.value} value={stats.byPriority[p.value] || 0} max={stats.total} color={p.color} />
                    ))}
                </Paper>

                {/* by OEM */}
                {Object.keys(stats.byOEM).length > 0 && (
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>OEM Distribution</Typography>
                        {Object.entries(stats.byOEM).sort((a, b) => b[1] - a[1]).map(([oem, cnt]) => (
                            <ProgressRow key={oem} label={oem} value={cnt} max={stats.total} color="#0d47a1" />
                        ))}
                    </Paper>
                )}

                {/* slot heatmap */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", mb: 2, border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                    <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5}>Slot Distribution</Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {SLOT_OPTIONS.map(s => {
                            const cnt = stats.bySlot[s.value] || 0;
                            const pct = stats.total > 0 ? Math.round((cnt / stats.total) * 100) : 0;
                            return (
                                <Box key={s.value} sx={{ flex: 1, minWidth: 70, p: 1.5, borderRadius: "10px",
                                    bgcolor: alpha(s.color, 0.08), border: `1px solid ${alpha(s.color, 0.2)}`, textAlign: "center" }}>
                                    <Typography fontSize={18}>{s.label.split(" ")[0]}</Typography>
                                    <Typography fontSize={16} fontWeight={800} color={s.color}>{cnt}</Typography>
                                    <Typography fontSize={10} color="text.secondary">{pct}%</Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* top assignees */}
                {stats.topAssignees.length > 0 && (
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e8ecf0", bgcolor: "#fff" }}>
                        <Typography fontSize={12.5} fontWeight={600} color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={0.8}>
                            <PersonSearchOutlinedIcon sx={{ fontSize: 15, color: TEAL }} /> Top Assignees
                        </Typography>
                        {stats.topAssignees.map(([name, cnt], i) => (
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
                                        value={(cnt / (stats.topAssignees[0]?.[1] || 1)) * 100}
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

// ─── kanban card ──────────────────────────────────────────────────────────────
const KanbanCard = ({ row, tasks, onEdit, onDelete, onStatusChange, isDragging }) => {
    const pm = priorityMeta(row.priority);
    const taskName = tasks.find(t => String(t.id) === String(row.task_id ?? row.task))?.task ?? "Unnamed Task";
    const overdue = isOverdue(row.deadline, row.status);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Paper elevation={0} sx={{
            p: 2, borderRadius: "12px", mb: 1.5, cursor: "grab",
            border: `1px solid ${overdue ? alpha("#c62828", 0.4) : "#e8ecf0"}`,
            bgcolor: overdue ? "#fff9f9" : "#fff",
            transition: "all .15s",
            opacity: isDragging ? 0.5 : 1,
            "&:hover": { borderColor: TEAL_MID, boxShadow: `0 4px 12px ${alpha(TEAL, 0.1)}`, transform: "translateY(-1px)" },
        }}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("cardId", row.id); e.dataTransfer.setData("fromStatus", row.status); }}
        >
            {/* top row */}
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Chip label={row.priority} size="small"
                    sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 10, height: 18, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                <Box display="flex" gap={0.5}>
                    {overdue && (
                        <Tooltip title="Overdue!" arrow>
                            <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} />
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

            {/* task name */}
            <Typography fontSize={13} fontWeight={700} color="#1a1a2e" mb={0.8} lineHeight={1.4} sx={{
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>
                {taskName}
            </Typography>

            {/* meta chips */}
            <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                {row.oem && (
                    <Chip label={row.oem} size="small"
                        sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18, border: "1px solid #90caf9" }} />
                )}
                {row.slot && slotMeta(row.slot) && (
                    <Chip label={slotMeta(row.slot).label} size="small"
                        sx={{ bgcolor: alpha(slotMeta(row.slot).color, 0.1), color: slotMeta(row.slot).color, fontSize: 10, height: 18 }} />
                )}
            </Box>

            {/* footer */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={0.6}>
                    <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                        {(row.assignee ?? "?")[0].toUpperCase()}
                    </Avatar>
                    <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 80 }}>{row.assignee}</Typography>
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

// ─── kanban column ────────────────────────────────────────────────────────────
const KanbanColumn = ({ col, cards, tasks, onEdit, onDelete, onStatusChange }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const cardId   = e.dataTransfer.getData("cardId");
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
            {/* column header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ color: col.color }}>{col.icon}</Box>
                    <Typography fontSize={13} fontWeight={700} color={col.color}>{col.label}</Typography>
                    <Chip label={cards.length} size="small"
                        sx={{ height: 18, fontSize: 10.5, fontWeight: 700, bgcolor: alpha(col.color, 0.12), color: col.color, minWidth: 24 }} />
                </Box>
            </Box>

            {/* drop zone hint */}
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
                <KanbanCard key={row.id} row={row} tasks={tasks}
                    onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
        </Box>
    );
};

// ─── main component ───────────────────────────────────────────────────────────
const AssignTask = () => {
    const navigate = useNavigate();

    const [assignments,  setAssignments]  = useState([]);
    const [tasks,        setTasks]        = useState([]);
    const [users,        setUsers]        = useState([]);
    const [loading,      setLoading]      = useState(false);
    const [refreshing,   setRefreshing]   = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId,     setEditId]     = useState(null);
    const [form,       setForm]       = useState(EMPTY_FORM);
    const [errors,     setErrors]     = useState({});
    const [saving,     setSaving]     = useState(false);

    const [tableSearch,    setTableSearch]    = useState("");
    const [statusFilter,   setStatusFilter]   = useState("All");
    const [activeStatCard, setActiveStatCard] = useState("All");
    const [viewMode,       setViewMode]       = useState("table"); // "table" | "kanban"
    const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
    const [myTasksOnly,    setMyTasksOnly]    = useState(false);
    const [taskSearch,     setTaskSearch]     = useState("");

    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [emailSearching,   setEmailSearching]   = useState(false);
    const [showSuggestions,  setShowSuggestions]  = useState(false);
    const emailInputRef    = useRef(null);
    const emailSuggestRef  = useRef(null);
    const emailSearchTimer = useRef(null);

    const loggedInUser = useMemo(() => getLoggedInUser(), []);

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchAll = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        try {
            const [assignRes, taskRes, userRes] = await Promise.allSettled([
                getData(API.GET_ALL), getData(API.GET_TASKS), getData(API.GET_USERS),
            ]);
            const safe = (r) => r.status === "fulfilled" ? (Array.isArray(r.value) ? r.value : r.value?.data ?? []) : [];
            setAssignments(safe(assignRes));
            setTasks(safe(taskRes));
            setUsers(safe(userRes));
        } catch (err) { console.error("fetchAll:", err); }
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    useEffect(() => {
        const h = (e) => { if (emailSuggestRef.current && !emailSuggestRef.current.contains(e.target)) setShowSuggestions(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // ── stats ──────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total:     assignments.length,
        pending:   assignments.filter(a => a.status === "Pending").length,
        active:    assignments.filter(a => a.status === "Active").length,
        completed: assignments.filter(a => a.status === "Completed").length,
        cancelled: assignments.filter(a => a.status === "Cancelled").length,
        overdue:   assignments.filter(a => isOverdue(a.deadline, a.status)).length,
    }), [assignments]);

    // ── filtered rows ──────────────────────────────────────────────────────────
    const filteredRows = useMemo(() => {
        const q = tableSearch.toLowerCase();
        return assignments.filter((row) => {
            const taskName = (tasks.find(t => String(t.id) === String(row.task_id ?? row.task))?.task ?? "").toLowerCase();
            const assignee = (row.assignee ?? "").toLowerCase();
            const oem      = (row.oem ?? "").toLowerCase();
            const matchQ   = !q || taskName.includes(q) || assignee.includes(q) || oem.includes(q);
            const matchS   = activeStatCard === "All" ? true : row.status === activeStatCard;
            const matchD   = statusFilter   === "All" ? true : row.status === statusFilter;
            const matchMe  = !myTasksOnly || assignee === loggedInUser.name.toLowerCase();
            return matchQ && matchS && matchD && matchMe;
        });
    }, [assignments, tasks, tableSearch, activeStatCard, statusFilter, myTasksOnly, loggedInUser]);

    // kanban grouped
    const kanbanCols = useMemo(() => {
        const grouped = {};
        KANBAN_COLS.forEach(c => { grouped[c.key] = []; });
        filteredRows.forEach(r => { if (grouped[r.status]) grouped[r.status].push(r); });
        return grouped;
    }, [filteredRows]);

    const handleStatClick = (label) => { setActiveStatCard(label); setStatusFilter(label); setTableSearch(""); };

    // ── kanban drag-drop status update ─────────────────────────────────────────
    const handleKanbanStatusChange = useCallback(async (cardId, newStatus) => {
        const row = assignments.find(a => String(a.id) === String(cardId));
        if (!row) return;
        // optimistic update
        setAssignments(prev => prev.map(a => String(a.id) === String(cardId) ? { ...a, status: newStatus } : a));
        try {
            const fd = new FormData();
            Object.entries({ ...row, status: newStatus }).forEach(([k, v]) => {
                if (v !== null && v !== undefined) fd.append(k, Array.isArray(v) ? v.join(",") : v);
            });
            await postData(API.UPDATE(cardId), fd);
        } catch (e) {
            console.error("Status update failed:", e);
            setAssignments(prev => prev.map(a => String(a.id) === String(cardId) ? row : a));
        }
    }, [assignments]);

    // ── form helpers ───────────────────────────────────────────────────────────
    const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); };

    const filteredTasks = tasks.filter(t => (t.task ?? t.name ?? "").toLowerCase().includes(taskSearch.toLowerCase()));

    const searchEmails = (query) => {
        set("emailInput", query);
        if (!query.trim()) { setEmailSuggestions([]); setShowSuggestions(false); return; }
        clearTimeout(emailSearchTimer.current);
        emailSearchTimer.current = setTimeout(async () => {
            setEmailSearching(true);
            try {
                const res  = await getData(API.SEARCH_USERS(query));
                const list = Array.isArray(res) ? res : res?.data ?? [];
                setEmailSuggestions(list.filter(u => u.email && !form.emails.includes(u.email)));
                setShowSuggestions(true);
            } catch (err) { console.error(err); }
            finally { setEmailSearching(false); }
        }, 400);
    };

    const pickSuggestion = (user) => {
        if (!user.email) return;
        setForm(p => ({ ...p, emails: [...p.emails, user.email], emailInput: "" }));
        setEmailSuggestions([]); setShowSuggestions(false);
        setTimeout(() => emailInputRef.current?.focus(), 50);
    };

    const commitEmail = () => {
        const val = form.emailInput.trim().replace(/,$/, "");
        if (!val) return;
        if (!isValidEmail(val))        { setErrors(e => ({ ...e, emails: "Invalid email address" })); return; }
        if (form.emails.includes(val)) { setErrors(e => ({ ...e, emails: "Already added" }));         return; }
        setForm(p => ({ ...p, emails: [...p.emails, val], emailInput: "" }));
        setErrors(e => ({ ...e, emails: "" }));
    };

    const removeEmail = (addr) => setForm(p => ({ ...p, emails: p.emails.filter(e => e !== addr) }));

    const validate = () => {
        const e = {};
        if (!form.task_id)            e.task_id  = "Please select a task";
        if (!form.assignee.trim())    e.assignee = "Assignee is required";
        if (form.emails.length === 0) e.emails   = "Add at least one email";
        if (!form.oem)                e.oem      = "OEM is required";
        if (!form.slot)               e.slot     = "Slot is required";
        if (!form.deadline)           e.deadline = "Deadline is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const openCreate = () => {
        const me = getLoggedInUser();
        setEditId(null); setTaskSearch(""); setEmailSuggestions([]); setShowSuggestions(false);
        setForm({ ...EMPTY_FORM, assignee: me.name, emails: me.email ? [me.email] : [], emailInput: "", deadline: nowLocal() });
        setErrors({}); setDialogOpen(true);
    };

    const openEdit = (row) => {
        setEditId(row.id); setTaskSearch(""); setEmailSuggestions([]); setShowSuggestions(false);
        let emails = [];
        if (Array.isArray(row.emails))           emails = row.emails;
        else if (typeof row.emails === "string") emails = row.emails.split(",").map(s => s.trim()).filter(Boolean);
        else if (row.email)                      emails = [row.email];
        setForm({
            task_id: String(row.task_id ?? row.task ?? ""), assignee: row.assignee ?? "",
            emails, emailInput: "", oem: row.oem ?? "", slot: row.slot ?? "",
            priority: row.priority ?? "Medium",
            deadline: row.deadline ? row.deadline.slice(0, 16) : nowLocal(),
            reminder: row.reminder ?? "none", remark: row.remark ?? "", status: row.status ?? "Pending",
        });
        setErrors({}); setDialogOpen(true);
    };

    const handleSave = async () => {
        if (form.emailInput.trim()) commitEmail();
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("task_id",     form.task_id);
            fd.append("assignee",    form.assignee);
            fd.append("emails",      form.emails.join(","));
            fd.append("email",       form.emails[0] ?? "");
            fd.append("oem",         form.oem);
            fd.append("slot",        form.slot);
            fd.append("priority",    form.priority);
            fd.append("deadline",    new Date(form.deadline).toISOString());
            fd.append("reminder",    form.reminder);
            fd.append("remark",      form.remark);
            fd.append("status",      form.status);
            fd.append("assigned_at", nowISO());

            let savedId = editId;
            if (editId) {
                await postData(API.UPDATE(editId), fd);
            } else {
                const res = await postData(API.CREATE, fd);
                savedId   = res?.id ?? res?.data?.id ?? null;
            }
            if (savedId && form.reminder !== "none") {
                try { await postData(API.UPDATE_REMINDER(savedId), { reminder: form.reminder }); }
                catch (e) { console.warn("Reminder update failed:", e); }
            }
            setDialogOpen(false);
            await fetchAll();
            Swal.fire({
                icon: "success",
                title: editId ? "Assignment Updated!" : "Task Assigned!",
                html: `Assigned to <b>${form.assignee}</b><br/>
                       Notifications → <b>${form.emails.join(", ")}</b><br/>
                       Reminder: <b>${reminderMeta(form.reminder).icon} ${reminderMeta(form.reminder).label}</b>`,
                timer: 3000, showConfirmButton: false, timerProgressBar: true,
            });
        } catch (err) {
            console.error("handleSave:", err);
            Swal.fire("Error", "Failed to save assignment.", "error");
        } finally { setSaving(false); }
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: "Remove Assignment?",
            html: `<span style="font-size:14px;color:#555">Remove <b>${row.assignee}</b>'s assignment?</span>`,
            icon: "warning", showCancelButton: true,
            confirmButtonColor: "#c62828", confirmButtonText: "Yes, remove",
        }).then(async (res) => {
            if (!res.isConfirmed) return;
            try {
                await fetch(`${ServerURL}${API.DELETE(row.id)}`, { method: "DELETE", headers: { Accept: "application/json" } });
                await fetchAll();
            } catch { Swal.fire("Error", "Failed to remove assignment.", "error"); }
        });
    };

    const taskLabel = (id) => {
        const t = tasks.find(t => String(t.id) === String(id));
        return t?.task ?? t?.name ?? id ?? "—";
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
                            <Typography fontWeight={800} fontSize={22} letterSpacing="-.4px" color="#1a1a2e">
                                Assign Task
                            </Typography>
                            <Typography fontSize={13} color="text.secondary" mt={0.3}>
                                Manage all task assignments · drag cards to update status
                            </Typography>
                        </Box>

                        <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            {/* my tasks toggle */}
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
                                    textTransform: "none", fontWeight: 600, borderRadius: "10px",
                                    fontSize: 13, px: 2, py: 0.9,
                                    borderColor: "#d0d5dd", color: "#374151",
                                    "&:hover": { borderColor: TEAL, color: TEAL, bgcolor: alpha(TEAL, 0.04) },
                                }}>
                                Analytics
                            </Button>

                            {/* view toggle */}
                            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
                                sx={{ bgcolor: "#f3f4f6", borderRadius: "10px", p: 0.3, "& .MuiToggleButton-root": { border: "none", borderRadius: "8px !important", px: 1.5 } }}>
                                <ToggleButton value="table">
                                    <Tooltip title="Table view" arrow><TableRowsOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
                                </ToggleButton>
                                <ToggleButton value="kanban">
                                    <Tooltip title="Kanban board" arrow><ViewKanbanOutlinedIcon sx={{ fontSize: 17 }} /></Tooltip>
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <Button variant="outlined" startIcon={<RefreshIcon sx={{ fontSize: "17px !important", animation: refreshing ? "spin .8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />}
                                onClick={() => fetchAll(true)} disabled={refreshing}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", fontSize: 13, px: 2, py: 0.9, borderColor: TEAL_MID, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </Button>

                            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                                sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 2.5, fontSize: 13.5, boxShadow: `0 4px 14px ${alpha(TEAL, 0.4)}` }}>
                                Assign Task
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* ── stat cards ── */}
                <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f2f5", bgcolor: alpha("#f8fafc", 0.7) }}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <StatCard label="Total"     count={stats.total}     icon={<AssignmentIndOutlinedIcon />} color={TEAL}      bg={TEAL_LIGHT}  active={activeStatCard === "All"}       loading={loading} onClick={() => handleStatClick("All")} />
                        <StatCard label="Pending"   count={stats.pending}   icon={<HourglassEmptyIcon />}       color="#f57c00"   bg="#fff3e0"     active={activeStatCard === "Pending"}   loading={loading} onClick={() => handleStatClick("Pending")} />
                        <StatCard label="Active"    count={stats.active}    icon={<PlayCircleOutlineIcon />}    color="#2e7d32"   bg="#e8f5e9"     active={activeStatCard === "Active"}    loading={loading} onClick={() => handleStatClick("Active")} />
                        <StatCard label="Completed" count={stats.completed} icon={<CheckCircleOutlineIcon />}  color="#1565c0"   bg="#e3f2fd"     active={activeStatCard === "Completed"} loading={loading} onClick={() => handleStatClick("Completed")} />
                        <StatCard label="Cancelled" count={stats.cancelled} icon={<CancelOutlinedIcon />}      color="#c62828"   bg="#fdecea"     active={activeStatCard === "Cancelled"} loading={loading} onClick={() => handleStatClick("Cancelled")} />
                        {stats.overdue > 0 && (
                            <StatCard label="Overdue" count={stats.overdue} icon={<WarningAmberOutlinedIcon />} color="#e65100" bg="#fff3e0" active={false} loading={loading}
                                onClick={() => {}} />
                        )}
                    </Box>
                </Box>

                {/* ── search + filter bar ── */}
                <Box sx={{ px: 3, py: 1.8, borderBottom: "1px solid #f0f2f5", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField size="small" placeholder="Search task, assignee or OEM…"
                        value={tableSearch}
                        onChange={(e) => { setTableSearch(e.target.value); setActiveStatCard("All"); setStatusFilter("All"); }}
                        sx={{ flex: 1, minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} /></InputAdornment>) }} />

                    <TextField select size="small" value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setActiveStatCard(e.target.value); }}
                        sx={{ minWidth: 170, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8fafc", fontSize: 13.5, "&:hover fieldset": { borderColor: TEAL }, "&.Mui-focused fieldset": { borderColor: TEAL } } }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 17, color: "#9ca3af" }} /></InputAdornment>) }}>
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
                            <Chip label="Clear" size="small"
                                onDelete={() => { setTableSearch(""); setStatusFilter("All"); setActiveStatCard("All"); setMyTasksOnly(false); }}
                                sx={{ height: 22, fontSize: 11, bgcolor: alpha(TEAL, 0.08), color: TEAL, "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
                        </Box>
                    )}
                </Box>

                {/* ════ KANBAN VIEW ════ */}
                {viewMode === "kanban" && (
                    <Box sx={{ px: 2.5, py: 2.5, overflowX: "auto" }}>
                        {loading ? (
                            <Box display="flex" gap={2}>
                                {[1, 2, 3, 4].map(i => (
                                    <Box key={i} sx={{ flex: 1, minWidth: 220 }}>
                                        {[1, 2, 3].map(j => <Skeleton key={j} height={120} sx={{ borderRadius: "12px", mb: 1 }} />)}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box display="flex" gap={2} sx={{ minWidth: 900 }}>
                                {KANBAN_COLS.map(col => (
                                    <KanbanColumn key={col.key} col={col}
                                        cards={kanbanCols[col.key] || []}
                                        tasks={tasks}
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

                {/* ════ TABLE VIEW ════ */}
                {viewMode === "table" && (
                    <>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: TEAL }}>
                                        {["SN", "Task", "Assignee", "Recipients", "OEM", "Slot", "Priority", "Deadline", "Reminder", "Status", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.6, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>{Array.from({ length: 11 }).map((_, j) => <TableCell key={j}><Skeleton height={22} sx={{ borderRadius: 4 }} /></TableCell>)}</TableRow>
                                    ))}

                                    {!loading && filteredRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center" sx={{ py: 7 }}>
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                                                    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(TEAL, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <AssignmentIndOutlinedIcon sx={{ fontSize: 28, color: TEAL_MID }} />
                                                    </Box>
                                                    <Typography fontWeight={600} fontSize={14} color="text.secondary">
                                                        {tableSearch || statusFilter !== "All" ? "No assignments found" : "No assignments yet"}
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
                                        const rm = reminderMeta(row.reminder);
                                        const overdue = isOverdue(row.deadline, row.status);
                                        const rowEmails = Array.isArray(row.emails)
                                            ? row.emails
                                            : (row.emails ?? row.email ?? "").split(",").map(s => s.trim()).filter(Boolean);
                                        return (
                                            <TableRow key={row.id ?? idx} hover sx={{
                                                "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                                                "&:hover":             { bgcolor: alpha(TEAL, 0.03) },
                                                bgcolor: overdue ? alpha("#e65100", 0.03) : undefined,
                                                transition: "background .12s",
                                            }}>
                                                <TableCell sx={{ color: "#b0b7c3", fontSize: 12, width: 40, fontWeight: 600 }}>{idx + 1}</TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.7}>
                                                        {overdue && <Tooltip title="Overdue" arrow><WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#e65100", flexShrink: 0 }} /></Tooltip>}
                                                        <Tooltip title={taskLabel(row.task_id ?? row.task)} arrow>
                                                            <Typography noWrap fontSize={13} fontWeight={600} color="#1a1a2e" sx={{ maxWidth: 130 }}>
                                                                {taskLabel(row.task_id ?? row.task)}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.8}>
                                                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK }}>
                                                            {(row.assignee ?? "?")[0].toUpperCase()}
                                                        </Avatar>
                                                        <Typography fontSize={13} fontWeight={500}>{row.assignee ?? "—"}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box display="flex" flexWrap="wrap" gap={0.4} maxWidth={180}>
                                                        {rowEmails.slice(0, 2).map(em => (
                                                            <Chip key={em} label={em} size="small"
                                                                sx={{ fontSize: 10.5, height: 20, bgcolor: "#f3f4f6", color: "#374151", fontFamily: "monospace" }} />
                                                        ))}
                                                        {rowEmails.length > 2 && (
                                                            <Tooltip title={rowEmails.slice(2).join(", ")} arrow>
                                                                <Chip label={`+${rowEmails.length - 2}`} size="small"
                                                                    sx={{ fontSize: 10.5, height: 20, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700 }} />
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.oem || "—"} size="small"
                                                        sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11, border: "1px solid #90caf9" }} />
                                                </TableCell>

                                                <TableCell>
                                                    {sm ? (
                                                        <Chip label={sm.label} size="small"
                                                            sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontWeight: 600, fontSize: 11, border: `1px solid ${alpha(sm.color, 0.3)}` }} />
                                                    ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.priority || "—"} size="small"
                                                        sx={{ bgcolor: pm.bg, color: pm.color, fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(pm.color, 0.3)}` }} />
                                                </TableCell>

                                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                    <Typography fontSize={12} color={overdue ? "#c62828" : "text.secondary"} fontWeight={overdue ? 700 : 400}>
                                                        {fmtDate(row.deadline)}
                                                    </Typography>
                                                    <Typography fontSize={11} color="text.disabled">{fmtTime(row.deadline)}</Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {row.reminder && row.reminder !== "none" ? (
                                                        <Chip icon={<NotificationsOutlinedIcon sx={{ fontSize: "13px !important" }} />}
                                                            label={rm.label} size="small"
                                                            sx={{ bgcolor: "#ede7f6", color: "#4527a0", fontWeight: 600, fontSize: 11, border: "1px solid #d1c4e9" }} />
                                                    ) : <Typography color="text.disabled" fontSize={12}>—</Typography>}
                                                </TableCell>

                                                <TableCell>
                                                    <Chip label={row.status ?? "Pending"} size="small"
                                                        sx={{ bgcolor: alpha(statusColor(row.status), 0.1), color: statusColor(row.status), fontWeight: 700, fontSize: 11, border: `1px solid ${alpha(statusColor(row.status), 0.25)}` }} />
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
                                    Showing <strong>{filteredRows.length}</strong> of <strong>{assignments.length}</strong> assignments
                                    {stats.overdue > 0 && (
                                        <span style={{ marginLeft: 12, color: "#e65100", fontWeight: 700 }}>
                                            ⚠ {stats.overdue} overdue
                                        </span>
                                    )}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Click <strong>+ Assign Task</strong> to create · ✎ edit · 🗑 remove · switch to Kanban for drag-drop
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* ════ ANALYTICS DRAWER ════ */}
            <AnalyticsPanel assignments={assignments} tasks={tasks}
                open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />

            {/* ════ DIALOG ════ */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                maxWidth="sm" fullWidth disableScrollLock
                PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" } }}>

                <Box sx={{ height: 5, background: `linear-gradient(90deg, ${TEAL} 0%, #26a69a 50%, #80cbc4 100%)` }} />

                <DialogTitle sx={{ p: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(TEAL, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AssignmentIndOutlinedIcon sx={{ color: TEAL, fontSize: 20 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>{editId ? "Edit Assignment" : "Assign Task"}</Typography>
                                <Typography fontSize={12} color="text.secondary">{editId ? "Update assignment details" : "Fill in the details to assign"}</Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Close" arrow>
                            <IconButton onClick={() => setDialogOpen(false)}
                                sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", borderRadius: "8px", transition: "all .18s", "&:hover": { bgcolor: "#fdecea", color: "#c62828", transform: "rotate(90deg)" } }}>
                                <CloseIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                    <Box display="flex" flexDirection="column" gap={2.2}>

                        {/* task dropdown */}
                        <TextField select label="Select Task" value={form.task_id}
                            onChange={(e) => set("task_id", e.target.value)}
                            error={!!errors.task_id} helperText={errors.task_id}
                            size="small" fullWidth sx={fieldSx}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><TaskAltOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}
                            SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 320 } }, autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true } }}>
                            <MenuItem disableRipple disableTouchRipple sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "#fff", "&:hover": { bgcolor: "#fff" }, cursor: "default", py: 1 }}>
                                <TextField size="small" fullWidth autoFocus placeholder="Search task..."
                                    value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#aaa" }} /></InputAdornment>) }}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13, bgcolor: "#fff" } }} />
                            </MenuItem>
                            <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Choose a task —</em></MenuItem>
                            {filteredTasks.length === 0 && <MenuItem disabled><Typography fontSize={13} color="text.disabled">No tasks found</Typography></MenuItem>}
                            {filteredTasks.map(t => (
                                <MenuItem key={t.id} value={String(t.id)} sx={{ fontSize: 13, "&:hover": { bgcolor: TEAL_LIGHT } }}>
                                    {t.task ?? t.name ?? t.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* assignee */}
                        <TextField label="Assignee" value={form.assignee} onChange={(e) => set("assignee", e.target.value)}
                            error={!!errors.assignee} helperText={errors.assignee || "Auto-filled from your login session"}
                            size="small" fullWidth sx={fieldSx}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>),
                                endAdornment: form.assignee ? (
                                    <InputAdornment position="end">
                                        <Avatar sx={{ width: 22, height: 22, fontSize: 10, fontWeight: 700, bgcolor: alpha(TEAL, 0.2), color: TEAL_DARK }}>
                                            {form.assignee[0].toUpperCase()}
                                        </Avatar>
                                    </InputAdornment>
                                ) : null,
                            }} />

                        {/* multi-email */}
                        <Box ref={emailSuggestRef} sx={{ position: "relative" }}>
                            <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={0.7}
                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <GroupAddOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                                Recipients (emails)
                                <Chip label={`${form.emails.length} added`} size="small"
                                    sx={{ ml: 0.5, height: 18, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK }} />
                            </Typography>
                            <Paper variant="outlined"
                                onClick={() => emailInputRef.current?.focus()}
                                sx={{
                                    p: "8px 10px", minHeight: 46, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.7,
                                    borderRadius: "8px", cursor: "text",
                                    borderColor: errors.emails ? "#c62828" : showSuggestions ? TEAL : "#c4c4c4",
                                    "&:hover": { borderColor: errors.emails ? "#c62828" : TEAL }, transition: "border-color .15s",
                                }}>
                                {form.emails.map(em => (
                                    <Chip key={em} label={em} size="small" onDelete={() => removeEmail(em)}
                                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 500, fontSize: 12, height: 24, fontFamily: "monospace", "& .MuiChip-deleteIcon": { fontSize: 14, color: TEAL } }} />
                                ))}
                                <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 180, gap: 0.5 }}>
                                    <input ref={emailInputRef} value={form.emailInput}
                                        placeholder={form.emails.length === 0 ? "Search name or type email…" : "Add more…"}
                                        onChange={(e) => searchEmails(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (["Enter", "Tab", ","].includes(e.key)) {
                                                e.preventDefault();
                                                if (emailSuggestions.length > 0 && !isValidEmail(form.emailInput)) pickSuggestion(emailSuggestions[0]);
                                                else { commitEmail(); setShowSuggestions(false); }
                                            }
                                            if (e.key === "Escape") setShowSuggestions(false);
                                            if (e.key === "Backspace" && !form.emailInput && form.emails.length > 0)
                                                removeEmail(form.emails[form.emails.length - 1]);
                                        }}
                                        onFocus={() => { if (emailSuggestions.length > 0) setShowSuggestions(true); }}
                                        style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", fontFamily: "inherit", color: "inherit" }} />
                                    {emailSearching && (
                                        <Box sx={{ width: 14, height: 14, flexShrink: 0, border: `2px solid ${TEAL}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
                                    )}
                                </Box>
                            </Paper>
                            {showSuggestions && emailSuggestions.length > 0 && (
                                <Paper elevation={6} sx={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1400, borderRadius: "10px", overflow: "hidden", border: `1px solid ${TEAL_MID}`, maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                                    <Box sx={{ px: 2, py: 0.8, bgcolor: TEAL_LIGHT, borderBottom: `1px solid ${TEAL_MID}` }}>
                                        <Typography fontSize={11} fontWeight={600} color={TEAL_DARK}>
                                            {emailSuggestions.length} result{emailSuggestions.length !== 1 ? "s" : ""} found
                                        </Typography>
                                    </Box>
                                    {emailSuggestions.map(u => (
                                        <Box key={u.email ?? u.id}
                                            onMouseDown={(e) => { e.preventDefault(); pickSuggestion(u); }}
                                            sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.2, cursor: "pointer", borderBottom: "1px solid #f5f5f5", transition: "background .12s", "&:hover": { bgcolor: TEAL_LIGHT }, "&:last-child": { borderBottom: "none" } }}>
                                            <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK, flexShrink: 0 }}>
                                                {(u.name ?? u.username ?? "?")[0].toUpperCase()}
                                            </Avatar>
                                            <Box flex={1} minWidth={0}>
                                                <Typography fontSize={13} fontWeight={600} noWrap>{u.name ?? u.username}</Typography>
                                                <Typography fontSize={11.5} color="text.secondary" fontFamily="monospace" noWrap>{u.email}</Typography>
                                            </Box>
                                            <Chip label="+ Add" size="small"
                                                sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, fontWeight: 700, flexShrink: 0 }} />
                                        </Box>
                                    ))}
                                </Paper>
                            )}
                            <Typography fontSize={11} color={errors.emails ? "error.main" : "text.secondary"} mt={0.4} ml={0.5}>
                                {errors.emails || "Search by name · or type email + Enter · Backspace removes last"}
                            </Typography>
                        </Box>

                        {/* OEM + Slot */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="OEM" value={form.oem} onChange={(e) => set("oem", e.target.value)}
                                    error={!!errors.oem} helperText={errors.oem} size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><RouterOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                    <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Select OEM —</em></MenuItem>
                                    {OEM_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField select label="Slot" value={form.slot} onChange={(e) => set("slot", e.target.value)}
                                    error={!!errors.slot} helperText={errors.slot} size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><WbSunnyOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                    <MenuItem value="" disabled><em style={{ color: "#aaa" }}>— Morning / Evening —</em></MenuItem>
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

                        {/* Priority + Status */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="Priority" value={form.priority} onChange={(e) => set("priority", e.target.value)}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><FlagOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
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
                                <TextField select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)}
                                    size="small" fullWidth sx={fieldSx}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }}>
                                    {["Pending", "Active", "Completed", "Cancelled"].map(s => (
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

                        {/* Deadline */}
                        <TextField label="Deadline" type="datetime-local" value={form.deadline}
                            onChange={(e) => set("deadline", e.target.value)}
                            error={!!errors.deadline} helperText={errors.deadline || "Select date and time to complete the task"}
                            size="small" fullWidth InputLabelProps={{ shrink: true }} inputProps={{ min: nowLocal() }} sx={fieldSx}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><EventOutlinedIcon sx={{ fontSize: 18, color: TEAL }} /></InputAdornment>) }} />

                        {/* Reminder */}
                        <Box>
                            <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}
                                sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                                <NotificationsOutlinedIcon sx={{ fontSize: 15, color: TEAL }} />
                                Reminder Frequency
                                <Typography component="span" fontSize={11} color="text.disabled" ml={0.5}>(sends to all recipients)</Typography>
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {REMINDER_OPTIONS.map(r => {
                                    const active = form.reminder === r.value;
                                    return (
                                        <Box key={r.value} onClick={() => set("reminder", r.value)}
                                            sx={{ display: "flex", alignItems: "center", gap: 0.7, px: 1.8, py: 0.9, borderRadius: "8px", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, border: `1.5px solid ${active ? TEAL : "#e0e0e0"}`, bgcolor: active ? alpha(TEAL, 0.08) : "#fafafa", color: active ? TEAL_DARK : "#555", transition: "all .17s", userSelect: "none", "&:hover": { borderColor: TEAL, bgcolor: alpha(TEAL, 0.05) } }}>
                                            <span style={{ fontSize: 15 }}>{r.icon}</span>
                                            {r.label}
                                        </Box>
                                    );
                                })}
                            </Box>
                            {form.reminder !== "none" && (
                                <Paper variant="outlined" sx={{ mt: 1.2, px: 1.8, py: 1, bgcolor: "#ede7f6", border: "1px solid #d1c4e9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
                                    <NotificationsOutlinedIcon sx={{ fontSize: 16, color: "#4527a0" }} />
                                    <Typography fontSize={12.5} color="#4527a0">
                                        {form.reminder === "daily"   && "A reminder will be sent every day until the deadline."}
                                        {form.reminder === "weekly"  && "A reminder will be sent every week on the same day."}
                                        {form.reminder === "monthly" && "A reminder will be sent once every month."}
                                    </Typography>
                                </Paper>
                            )}
                        </Box>

                        {/* assigned-at */}
                        <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.2, bgcolor: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: "8px" }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: TEAL_DARK }} />
                            <Typography fontSize={13} color={TEAL_DARK}>
                                <strong>Assigned at:</strong>{" "}
                                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}{" "}
                                · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </Typography>
                        </Paper>

                        {/* remark */}
                        <TextField label="Remark (optional)" value={form.remark}
                            onChange={(e) => set("remark", e.target.value)}
                            placeholder="Add any notes for the assignee…"
                            size="small" fullWidth multiline rows={2} sx={fieldSx} />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                    <Button onClick={() => setDialogOpen(false)}
                        sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2.5 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}
                        sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 3, boxShadow: `0 2px 8px ${alpha(TEAL, 0.35)}` }}>
                        {saving ? "Saving…" : editId ? "Update Assignment" : "⚡ Assign Task"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset":       { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

export default AssignTask;