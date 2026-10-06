
// import React, { useMemo, useState, useEffect } from 'react';
// import {
//   Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
//   IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
//   TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
//   Snackbar, Alert, Menu, ListItemIcon, ListItemText, CircularProgress,
// } from '@mui/material';
// import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
// import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
// import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeekRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
// import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
// import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
// import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
// import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
// import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
// import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
// import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
// import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
// import {
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from 'recharts';
// import dayjs from 'dayjs';
// import { v4 as uuidv4 } from 'uuid';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import { getDecreyptedData } from "../../../utils/localstorage";

// /* ============================== CONSTANTS ============================== */

// const API_BASE_URL = 'https://commtoolapi.mcpspmis.com/task_tracking/tasks/';

// // ✅ ADMIN USERS - SAME AS BACKEND
// const ADMIN_USERS = ["abhinav@ust.com", "mohit@ust.com"];

// const STATUS_OPTIONS = [
//   'Not Started', 'In Progress', 'In Review', 'Testing', 'Completed', 'Delayed', 'On Hold',
// ];

// const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// const REASON_OPTIONS = [
//   'None', 'Resource Constraint', 'Dependency Delay', 'Scope Change',
//   'Client Delay', 'Technical Issue', 'Requirement Change', 'Other',
// ];

// // Status color tokens
// const STATUS_COLORS = {
//   'Not Started': { main: '#64748B', bg: '#F1F5F9' },
//   'In Progress': { main: '#2563EB', bg: '#EAF1FE' },
//   'In Review': { main: '#D97706', bg: '#FEF3E2' },
//   'Testing': { main: '#7C3AED', bg: '#F3ECFE' },
//   'Completed': { main: '#0E9F6E', bg: '#E7F9F1' },
//   'Delayed': { main: '#DC2626', bg: '#FDECEC' },
//   'On Hold': { main: '#475569', bg: '#EEF1F4' },
// };

// const PRIORITY_COLORS = {
//   High: { main: '#DC2626', bg: '#FDECEC' },
//   Medium: { main: '#D97706', bg: '#FEF3E2' },
//   Low: { main: '#0E9F6E', bg: '#E7F9F1' },
// };

// const KPI_ICONS = {
//   'Total Tasks': AssignmentRoundedIcon,
//   'Not Started': HourglassEmptyRoundedIcon,
//   'In Progress': TrendingUpRoundedIcon,
//   'In Review': RateReviewRoundedIcon,
//   'Testing': ScienceRoundedIcon,
//   'Completed': CheckCircleRoundedIcon,
//   'Delayed': ReportProblemRoundedIcon,
//   'Completion %': DonutLargeRoundedIcon,
// };

// const REASON_PALETTE = ['#0E7C7B', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#0EA5E9', '#64748B', '#B45309'];

// const PRIMARY = '#0E7C7B';
// const PRIMARY_DARK = '#0A5D5C';

// /* ============================== HELPERS ============================== */

// // ✅ GET CURRENT USERNAME
// const getCurrentUsername = () => {
//   const username = getDecreyptedData('userID') || getDecreyptedData('username') || 'anonymous';
//   console.log('Current username:', username);
//   return username;
// };

// // ✅ CHECK IF USER IS ADMIN
// const isUserAdmin = () => {
//   const username = getCurrentUsername();
//   return ADMIN_USERS.includes(username);
// };

// // ✅ GET EMPTY FORM WITH USERNAME
// const getEmptyForm = () => ({
//   date: new Date().toISOString().slice(0, 10),
//   username: getCurrentUsername(),
//   assigned_by: '',
//   project_name: '',
//   start_date: '',
//   expacted_date: '',
//   completed_date: '',
//   status: 'Not Started',
//   priority: 'Medium',
//   reason_for_delay: 'None',
//   remarks: '',
// });

// function getTotalTime(task) {
//   if (!task.start_date) return '—';
//   const start = dayjs(task.start_date);
//   if (task.completed_date) {
//     const days = dayjs(task.completed_date).diff(start, 'day');
//     return `${days} day${days === 1 ? '' : 's'}`;
//   }
//   const days = dayjs().diff(start, 'day');
//   return `${days} day${days === 1 ? '' : 's'} (ongoing)`;
// }

// // ✅ UPDATED FILTER FUNCTION - INCLUDES USERNAME FILTER
// function filterTasks(tasks, { dateFilterType, singleDate, fromDate, toDate, status, priority, search, username }) {
//   return tasks.filter((t) => {
//     // Apply date filter
//     if (dateFilterType === 'single' && singleDate && t.date !== singleDate) return false;
//     if (dateFilterType === 'range' && fromDate && toDate) {
//       if (!t.start_date) return false;
//       const taskDate = dayjs(t.start_date);
//       const from = dayjs(fromDate);
//       const to = dayjs(toDate);
//       if (taskDate.isBefore(from, 'day') || taskDate.isAfter(to, 'day')) return false;
//     }

//     if (status && status !== 'All' && t.status !== status) return false;
//     if (priority && priority !== 'All' && t.priority !== priority) return false;

//     // ✅ NEW: Username filter
//     if (username && username !== 'All' && t.username !== username) return false;

//     if (search) {
//       const q = search.toLowerCase();
//       const hay = `${t.project_name || ''} ${t.assigned_by || ''} ${t.remarks || ''}`.toLowerCase();
//       if (!hay.includes(q)) return false;
//     }
//     return true;
//   });
// }

// function computeKpis(tasks) {
//   const total = tasks.length;
//   const counts = {};
//   tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
//   const completed = counts['Completed'] || 0;
//   const completionPct = total ? Math.round((completed / total) * 100) : 0;
//   return { total, counts, completed, completionPct };
// }

// function computeStatusBreakdown(tasks) {
//   return STATUS_OPTIONS.map((s) => ({ name: s, value: tasks.filter((t) => t.status === s).length })).filter((d) => d.value > 0);
// }

// function computeReasonBreakdown(tasks) {
//   const counts = {};
//   tasks.forEach((t) => {
//     if (t.reason_for_delay && t.reason_for_delay !== 'None') counts[t.reason_for_delay] = (counts[t.reason_for_delay] || 0) + 1;
//   });
//   return Object.entries(counts).map(([name, value]) => ({ name, value }));
// }

// function computePriorityBreakdown(tasks) {
//   return PRIORITY_OPTIONS.map((p) => ({ name: p, value: tasks.filter((t) => t.priority === p).length }));
// }

// function fmt(d) { return d ? dayjs(d).format('DD MMM YYYY') : '—'; }

// /* ========================= API FUNCTIONS ========================= */

// // ✅ FETCH TASKS - SEND USERNAME AS QUERY PARAM
// async function fetchTasks() {
//   try {
//     const username = getCurrentUsername();
//     console.log('Fetching tasks for user:', username);

//     // Send username as query parameter for filtering
//     const response = await fetch(`${API_BASE_URL}?username=${encodeURIComponent(username)}`);

//     if (!response.ok) {
//       console.error('Fetch error:', response.status);
//       throw new Error('Failed to fetch tasks');
//     }

//     const data = await response.json();
//     console.log('Fetched tasks:', data);
//     return Array.isArray(data) ? data : data.results || [];
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     return [];
//   }
// }

// // ✅ CREATE TASK - INCLUDES USERNAME
// async function createTask(taskData) {
//   try {
//     const username = getCurrentUsername();
//     const payload = {
//       date: taskData.date,
//       username: taskData.username || username,
//       assigned_by: taskData.assigned_by,
//       project_name: taskData.project_name,
//       start_date: taskData.start_date,
//       expacted_date: taskData.expacted_date || null,
//       completed_date: taskData.completed_date || null,
//       status: taskData.status,
//       priority: taskData.priority,
//       reason_for_delay: taskData.reason_for_delay,
//       remarks: taskData.remarks,
//     };

//     console.log('Creating task with payload:', payload);

//     const response = await fetch(API_BASE_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Create error:', errorData);
//       throw new Error(JSON.stringify(errorData));
//     }

//     const responseData = await response.json();
//     console.log('Task created:', responseData);
//     return responseData;
//   } catch (error) {
//     console.error('Error creating task:', error);
//     throw error;
//   }
// }

// // ✅ UPDATE TASK - INCLUDES USERNAME
// async function updateTask(taskId, taskData) {
//   try {
//     const username = getCurrentUsername();
//     const payload = {
//       date: taskData.date,
//       username: taskData.username || username,
//       assigned_by: taskData.assigned_by,
//       project_name: taskData.project_name,
//       start_date: taskData.start_date,
//       expacted_date: taskData.expacted_date || null,
//       completed_date: taskData.completed_date || null,
//       status: taskData.status,
//       priority: taskData.priority,
//       reason_for_delay: taskData.reason_for_delay,
//       remarks: taskData.remarks,
//     };

//     console.log('Updating task with payload:', payload);

//     const response = await fetch(`${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Update error:', errorData);
//       throw new Error(JSON.stringify(errorData));
//     }

//     const responseData = await response.json();
//     console.log('Task updated:', responseData);
//     return responseData;
//   } catch (error) {
//     console.error('Error updating task:', error);
//     throw error;
//   }
// }

// // ✅ DELETE TASK - SEND USERNAME
// async function deleteTask(taskId) {
//   try {
//     const username = getCurrentUsername();
//     console.log('Deleting task:', taskId, 'for user:', username);

//     const response = await fetch(`${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Delete error:', errorData);
//       throw new Error('Failed to delete task');
//     }

//     console.log('Task deleted successfully');
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     throw error;
//   }
// }

// /* ========================= COLORFUL EXCEL EXPORT ========================= */

// async function exportTasksToExcel(tasks, filename) {
//   const STATUS_FILL = {
//     'Not Started': { fg: 'FFD9D9D9', font: 'FF595959' },
//     'In Progress': { fg: 'FFBDD7EE', font: 'FF1F4E78' },
//     'In Review': { fg: 'FFFFE9B3', font: 'FF7F6000' },
//     'Testing': { fg: 'FFE3D2FB', font: 'FF5A2D9C' },
//     'Completed': { fg: 'FFC6EFCE', font: 'FF006100' },
//     'Delayed': { fg: 'FFFFC7CE', font: 'FF9C0006' },
//     'On Hold': { fg: 'FFE4DFEC', font: 'FF5F497A' },
//   };
//   const PRIORITY_FILL = {
//     High: { fg: 'FFFFC7CE', font: 'FF9C0006' },
//     Medium: { fg: 'FFFFE9B3', font: 'FF7F6000' },
//     Low: { fg: 'FFC6EFCE', font: 'FF006100' },
//   };
//   const NAVY = 'FF1F4E78';
//   const WHITE = 'FFFFFFFF';
//   const border = {
//     top: { style: 'thin', color: { argb: 'FFB7B7B7' } }, left: { style: 'thin', color: { argb: 'FFB7B7B7' } },
//     bottom: { style: 'thin', color: { argb: 'FFB7B7B7' } }, right: { style: 'thin', color: { argb: 'FFB7B7B7' } },
//   };

//   const wb = new ExcelJS.Workbook();
//   wb.creator = 'Task Tracker';
//   wb.created = new Date();

//   // Summary sheet
//   const summary = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
//   summary.columns = [{ width: 4 }, { width: 26 }, { width: 16 }, { width: 4 }, { width: 26 }, { width: 16 }];
//   summary.mergeCells('B2:F2');
//   summary.getCell('B2').value = 'Task Tracker — Summary Report';
//   summary.getCell('B2').font = { name: 'Arial', size: 18, bold: true, color: { argb: NAVY } };
//   summary.mergeCells('B3:F3');
//   summary.getCell('B3').value = `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;
//   summary.getCell('B3').font = { name: 'Arial', size: 10, italic: true, color: { argb: '5B6B75' } };

//   const kpis = computeKpis(tasks);
//   let r = 5;
//   summary.getCell(`B${r}`).value = 'Key Metrics';
//   summary.getCell(`B${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
//   r += 1;
//   [['Total Tasks', kpis.total], ['Completed', kpis.completed], ['Completion %', `${kpis.completionPct}%`]]
//     .forEach(([label, value]) => {
//       summary.getCell(`B${r}`).value = label;
//       summary.getCell(`B${r}`).font = { name: 'Arial', size: 10 };
//       summary.getCell(`C${r}`).value = value;
//       summary.getCell(`C${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
//       r += 1;
//     });

//   let statusRow = 5;
//   summary.getCell(`E${statusRow}`).value = 'Status Breakdown';
//   summary.getCell(`E${statusRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
//   statusRow += 1;
//   ['Status', 'Count'].forEach((h, i) => {
//     const cell = summary.getCell(statusRow, 5 + i);
//     cell.value = h;
//     cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
//     cell.border = border;
//   });
//   statusRow += 1;
//   computeStatusBreakdown(tasks).forEach(({ name, value }) => {
//     const fill = STATUS_FILL[name] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const nameCell = summary.getCell(`E${statusRow}`);
//     nameCell.value = name;
//     nameCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
//     nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
//     nameCell.border = border;
//     const countCell = summary.getCell(`F${statusRow}`);
//     countCell.value = value;
//     countCell.alignment = { horizontal: 'center' };
//     countCell.border = border;
//     statusRow += 1;
//   });

//   // Task Data sheet
//   const ws = wb.addWorksheet('Task Data', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });
//   const headers = ['SR No', 'Date', 'User', 'Assigned By', 'Project', 'Start Date',
//     'Expected Date', 'Completed Date', 'Status', 'Priority', 'Reason for Delay', 'Remarks'];
//   ws.columns = [{ width: 7 }, { width: 12 }, { width: 18 }, { width: 18 }, { width: 28 },
//   { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 12 }, { width: 20 }, { width: 30 }];

//   const headerRow = ws.getRow(1);
//   headers.forEach((h, i) => {
//     const cell = headerRow.getCell(i + 1);
//     cell.value = h;
//     cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: WHITE } };
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
//     cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//     cell.border = border;
//   });
//   headerRow.height = 24;

//   const STATUS_COL = 9;
//   const PRIORITY_COL = 10;

//   tasks.forEach((t, idx) => {
//     const row = ws.getRow(idx + 2);
//     const values = [
//       idx + 1,
//       t.date ? dayjs(t.date).format('DD-MMM-YYYY') : '',
//       t.username || '',
//       t.assigned_by || '',
//       t.project_name || '',
//       t.start_date ? dayjs(t.start_date).format('DD-MMM-YYYY') : '',
//       t.expacted_date ? dayjs(t.expacted_date).format('DD-MMM-YYYY') : '',
//       t.completed_date ? dayjs(t.completed_date).format('DD-MMM-YYYY') : '',
//       t.status || '',
//       t.priority || '',
//       t.reason_for_delay || '',
//       t.remarks || '',
//     ];
//     values.forEach((v, i) => {
//       const cell = row.getCell(i + 1);
//       cell.value = v;
//       cell.font = { name: 'Arial', size: 10 };
//       cell.border = border;
//       cell.alignment = { vertical: 'middle', wrapText: i === 11, horizontal: [0, 8, 9].includes(i) ? 'center' : 'left' };
//     });
//     if (idx % 2 === 1) {
//       for (let c = 1; c <= headers.length; c++) {
//         const cell = row.getCell(c);
//         if (!cell.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8F9' } };
//       }
//     }
//     const statusFill = STATUS_FILL[t.status] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const statusCell = row.getCell(STATUS_COL);
//     statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusFill.fg } };
//     statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: statusFill.font } };
//     statusCell.alignment = { horizontal: 'center' };
//     const priorityFill = PRIORITY_COLORS[t.priority] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const priorityCell = row.getCell(PRIORITY_COL);
//     priorityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: priorityFill.fg } };
//     priorityCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: priorityFill.font } };
//     priorityCell.alignment = { horizontal: 'center' };
//   });

//   ws.autoFilter = { from: 'A1', to: `L${tasks.length + 1}` };

//   const buffer = await wb.xlsx.writeBuffer();
//   saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
// }

// /* ============================== SUBCOMPONENTS ============================== */

// function KpiCard({ label, value, color }) {
//   const Icon = KPI_ICONS[label] || AssignmentRoundedIcon;
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 2.25, height: '100%', borderRadius: 3, border: '1px solid #E9EDEF',
//         background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFDFD 100%)',
//         boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
//         transition: 'transform .15s ease, box-shadow .15s ease',
//         '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(16,24,40,0.08)' },
//       }}
//     >
//       <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//         <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
//         <Box sx={{
//           width: 34, height: 34, borderRadius: '10px', display: 'flex', alignItems: 'center',
//           justifyContent: 'center', bgcolor: `${color}1A`,
//         }}>
//           <Icon sx={{ fontSize: 18, color }} />
//         </Box>
//       </Stack>
//       <Typography variant="h4" sx={{ mt: 1.5, mb: 1, fontWeight: 800 }}>{value}</Typography>
//       <Box sx={{ height: 4, borderRadius: 2, bgcolor: color, width: '55%' }} />
//     </Paper>
//   );
// }

// function TaskFormDialog({ open, onClose, onSave, initialTask, currentUsername }) {
//   const [form, setForm] = useState(getEmptyForm());
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   React.useEffect(() => {
//     if (open) {
//       if (initialTask) {
//         setForm({
//           date: initialTask.date || new Date().toISOString().slice(0, 10),
//           username: initialTask.username || currentUsername,
//           assigned_by: initialTask.assigned_by || '',
//           project_name: initialTask.project_name || '',
//           start_date: initialTask.start_date || '',
//           expacted_date: initialTask.expacted_date || '',
//           completed_date: initialTask.completed_date || '',
//           status: initialTask.status || 'Not Started',
//           priority: initialTask.priority || 'Medium',
//           reason_for_delay: initialTask.reason_for_delay || 'None',
//           remarks: initialTask.remarks || '',
//         });
//       } else {
//         setForm(getEmptyForm());
//       }
//       setErrors({});
//     }
//   }, [open, initialTask, currentUsername]);

//   const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

//   const validate = () => {
//     const e = {};
//     if (!form.assigned_by.trim()) e.assigned_by = 'Required';
//     if (!form.project_name.trim()) e.project_name = 'Required';
//     if (!form.start_date) e.start_date = 'Required';
//     if (form.expacted_date && form.start_date && form.expacted_date < form.start_date) {
//       e.expacted_date = 'Cannot be before start date';
//     }
//     if (form.completed_date && form.start_date && form.completed_date < form.start_date) {
//       e.completed_date = 'Cannot be before start date';
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (validate()) {
//       setLoading(true);
//       try {
//         await onSave(form);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
//       <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Typography variant="h6" sx={{ fontWeight: 800 }}>{initialTask ? 'Edit Task' : 'Add Task'}</Typography>
//         <IconButton size="small" onClick={onClose} disabled={loading}><CloseRoundedIcon /></IconButton>
//       </DialogTitle>
//       <Divider />
//       <DialogContent sx={{ pt: 3 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Username" fullWidth size="small" value={form.username} disabled helperText="Auto from login" FormHelperTextProps={{ sx: { fontSize: '0.7rem' } }} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Assigned By" fullWidth size="small" value={form.assigned_by} onChange={handleChange('assigned_by')} error={!!errors.assigned_by} helperText={errors.assigned_by} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Project Name" fullWidth size="small" value={form.project_name} onChange={handleChange('project_name')} error={!!errors.project_name} helperText={errors.project_name} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Project Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.start_date} onChange={handleChange('start_date')} error={!!errors.start_date} helperText={errors.start_date} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Expected Completion" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.expacted_date} onChange={handleChange('expacted_date')} error={!!errors.expacted_date} helperText={errors.expacted_date} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Project Completed By" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.completed_date} onChange={handleChange('completed_date')} error={!!errors.completed_date} helperText={errors.completed_date} disabled={loading} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField select label="Status" fullWidth size="small" value={form.status} onChange={handleChange('status')} disabled={loading}>
//               {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField select label="Priority" fullWidth size="small" value={form.priority} onChange={handleChange('priority')} disabled={loading}>
//               {PRIORITY_OPTIONS.map((p) => (
//                 <MenuItem key={p} value={p}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[p].main }} />
//                     <span>{p}</span>
//                   </Stack>
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField select label="Reason for Delay" fullWidth size="small" value={form.reason_for_delay} onChange={handleChange('reason_for_delay')} disabled={loading}>
//               {REASON_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//             </TextField>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Remarks" fullWidth multiline minRows={2} size="small" value={form.remarks} onChange={handleChange('remarks')} disabled={loading} />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <Divider />
//       <DialogActions sx={{ p: 2 }}>
//         <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK } }}>
//           {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
//           {initialTask ? 'Save changes' : 'Add task'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// /* ============================== MAIN COMPONENT ============================== */

// export default function TaskTracker() {

//   const currentUsername = useMemo(() => getCurrentUsername(), []);
//   const isAdmin = useMemo(() => isUserAdmin(), []);

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     dateFilterType: 'range',
//     singleDate: '',
//     fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
//     toDate: dayjs().format('YYYY-MM-DD'),
//     status: 'All',
//     priority: 'All',
//     search: '',
//     username: 'All',
//   });
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [snack, setSnack] = useState(null);
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
//   const [customRange, setCustomRange] = useState({ from: '', to: '' });

//   const today = dayjs().format('YYYY-MM-DD');
//   const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');

//   useEffect(() => {
//     loadTasks();
//   }, []);

//   const loadTasks = async () => {
//     setLoading(true);
//     const data = await fetchTasks();
//     setTasks(data);
//     setLoading(false);
//   };

//   const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
//   const kpis = useMemo(() => computeKpis(filtered), [filtered]);
//   const statusBreakdown = useMemo(() => computeStatusBreakdown(filtered), [filtered]);
//   const reasonBreakdown = useMemo(() => computeReasonBreakdown(filtered), [filtered]);
//   const priorityBreakdown = useMemo(() => computePriorityBreakdown(filtered), [filtered]);

//   // ✅ GET UNIQUE USERNAMES FOR ADMIN FILTER
//   const uniqueUsernames = useMemo(() => {
//     const names = [...new Set(tasks.map(t => t.username).filter(Boolean))];
//     return names.sort();
//   }, [tasks]);

//   const openAdd = () => { setEditingTask(null); setDialogOpen(true); };
//   const openEdit = (t) => { setEditingTask(t); setDialogOpen(true); };

//   const handleSave = async (form) => {
//     try {
//       if (editingTask) {
//         await updateTask(editingTask.id, form);
//         setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...editingTask, ...form } : t)));
//         setSnack({ severity: 'success', message: 'Task updated.' });
//       } else {
//         const newTask = await createTask(form);
//         setSnack({ severity: 'success', message: 'Task added.' });
//         await loadTasks();
//       }
//       setDialogOpen(false);
//     } catch (error) {
//       setSnack({ severity: 'error', message: `Error: ${error.message}` });
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteTask(id);
//       setTasks((prev) => prev.filter((t) => t.id !== id));
//       setSnack({ severity: 'info', message: 'Task deleted.' });
//     } catch (error) {
//       setSnack({ severity: 'error', message: `Error: ${error.message}` });
//     }
//   };

//   const doExport = async (data, label) => {
//     if (!data.length) {
//       setSnack({ severity: 'warning', message: `No tasks found for "${label}".` });
//       return;
//     }
//     const filename = `Task_Tracker_${label.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;
//     await exportTasksToExcel(data, filename);
//     setSnack({ severity: 'success', message: `Exported ${data.length} task(s) — ${label}.` });
//   };

//   const tasksInRange = (from, to) => tasks.filter((t) => {
//     if (!t.start_date) return false;
//     if (from && dayjs(t.start_date).isBefore(dayjs(from), 'day')) return false;
//     if (to && dayjs(t.start_date).isAfter(dayjs(to), 'day')) return false;
//     return true;
//   });

//   const handleExportPreset = async (type) => {
//     setExportAnchorEl(null);
//     const now = dayjs();
//     if (type === 'current') {
//       await doExport(filtered, 'Current View');
//       return;
//     }
//     if (type === 'today') {
//       const data = tasks.filter((t) => t.date === today);
//       await doExport(data, `Today (${dayjs(today).format('DD MMM YYYY')})`);
//       return;
//     }
//     if (type === 'custom') {
//       setCustomRange({ from: monthStart, to: today });
//       setRangeDialogOpen(true);
//       return;
//     }
//     let from, to, label;
//     if (type === 'week') { from = now.startOf('week'); to = now.endOf('week'); label = `Weekly (${from.format('DD MMM')} - ${to.format('DD MMM YYYY')})`; }
//     else if (type === 'month') { from = now.startOf('month'); to = now.endOf('month'); label = `Monthly (${now.format('MMM YYYY')})`; }
//     else if (type === 'year') { from = now.startOf('year'); to = now.endOf('year'); label = `Yearly (${now.format('YYYY')})`; }
//     const data = tasksInRange(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
//     await doExport(data, label);
//   };

//   const handleCustomRangeExport = async () => {
//     if (!customRange.from || !customRange.to) {
//       setSnack({ severity: 'warning', message: 'Please select both From and To dates.' });
//       return;
//     }
//     const data = tasksInRange(customRange.from, customRange.to);
//     setRangeDialogOpen(false);
//     await doExport(data, `${dayjs(customRange.from).format('DD MMM YYYY')} to ${dayjs(customRange.to).format('DD MMM YYYY')}`);
//   };

//   const kpiCards = [
//     { label: 'Total Tasks', value: kpis.total, color: '#1B2A4A' },
//     { label: 'Not Started', value: kpis.counts['Not Started'] || 0, color: STATUS_COLORS['Not Started'].main },
//     { label: 'In Progress', value: kpis.counts['In Progress'] || 0, color: STATUS_COLORS['In Progress'].main },
//     { label: 'In Review', value: kpis.counts['In Review'] || 0, color: STATUS_COLORS['In Review'].main },
//     { label: 'Testing', value: kpis.counts['Testing'] || 0, color: STATUS_COLORS['Testing'].main },
//     { label: 'Completed', value: kpis.counts['Completed'] || 0, color: STATUS_COLORS['Completed'].main },
//     { label: 'Delayed', value: kpis.counts['Delayed'] || 0, color: STATUS_COLORS['Delayed'].main },
//     { label: 'Completion %', value: `${kpis.completionPct}%`, color: PRIMARY },
//   ];

//   if (loading) {
//     return (
//       <Box sx={{ minHeight: '100vh', bgcolor: '#F3F6F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Stack alignItems="center" spacing={2}>
//           <CircularProgress size={50} sx={{ color: PRIMARY }} />
//           <Typography color="text.secondary">Loading tasks...</Typography>
//         </Stack>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#F3F6F7', py: { xs: 2, md: 4 } }}>
//       <Container maxWidth="xl">

//         {/* ✅ HEADER WITH LOGO - LEFT (DATE) | CENTER (TITLE + LOGO) | RIGHT (LOGIN) - NARROW */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: '12px 24px', mb: 3, borderRadius: 3, border: '1px solid #E9EDEF',
//             background: `linear-gradient(120deg, ${PRIMARY} 0%, #12A39A 55%, #1AC2A4 100%)`,
//             color: '#fff', boxShadow: '0 10px 24px rgba(14,124,123,0.18)',
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>

//             {/* LEFT: Date */}
//             <Box sx={{ minWidth: '180px' }}>
//               <Typography variant="caption" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
//                 <TodayRoundedIcon sx={{ fontSize: 16 }} /> {dayjs(today).format('DD MMM YYYY')}
//               </Typography>
//             </Box>

//             {/* CENTER: Logo + Title */}
//             <Box sx={{ flex: 1, textAlign: 'center' }}>
//               <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 0.5 }}>
//                 <Box sx={{
//                   width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)'
//                 }}>
//                   <AssignmentRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
//                 </Box>
//                 <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>Task Tracker</Typography>
//               </Stack>
//               <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '12px' }}>Team work status &amp; analytics</Typography>
//             </Box>

//             {/* RIGHT: Login Info */}
//             <Box sx={{ minWidth: '220px', textAlign: 'right' }}>
//               <Typography variant="caption" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, fontWeight: 600 }}>
//                 👤 {currentUsername}
//               </Typography>
//               {isAdmin && (
//                 <Chip 
//                   label="ADMIN" 
//                   size="small" 
//                   variant="filled" 
//                   sx={{ 
//                     bgcolor: 'rgba(255,255,255,0.25)', 
//                     color: '#fff',
//                     fontWeight: 700,
//                     mt: 0.5,
//                     border: '1px solid rgba(255,255,255,0.4)'
//                   }} 
//                 />
//               )}
//             </Box>
//           </Stack>
//         </Paper>

//         {/* ✅ FILTERS ROW - REORGANIZED FOR BETTER LAYOUT */}
//         <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E9EDEF', bgcolor: '#fff' }}>
//           <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" flexWrap="wrap" justifyContent="space-between">

//             {/* Left side: Date and Status filters */}
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flex={1} minWidth={0}>
//               <TextField 
//                 select 
//                 label="Date Filter" 
//                 size="small" 
//                 value={filters.dateFilterType}
//                 onChange={(e) => setFilters((f) => ({ ...f, dateFilterType: e.target.value }))} 
//                 sx={{ minWidth: 120, bgcolor: '#f5f5f5', borderRadius: 1 }}
//               >
//                 <MenuItem value="range">Date Range</MenuItem>
//                 <MenuItem value="single">All Dates</MenuItem>
//               </TextField>

//               {filters.dateFilterType === 'single' ? (
//                 <TextField
//                   label="Filter by Date"
//                   type="date"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   value={filters.singleDate}
//                   onChange={(e) => setFilters((f) => ({ ...f, singleDate: e.target.value }))}
//                   sx={{ minWidth: 140, bgcolor: '#f5f5f5', borderRadius: 1 }}
//                 />
//               ) : (
//                 <>
//                   <TextField
//                     label="From"
//                     type="date"
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                     value={filters.fromDate}
//                     onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
//                     sx={{ minWidth: 120, bgcolor: '#f5f5f5', borderRadius: 1 }}
//                   />
//                   <TextField
//                     label="To"
//                     type="date"
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                     value={filters.toDate}
//                     onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
//                     sx={{ minWidth: 120, bgcolor: '#f5f5f5', borderRadius: 1 }}
//                   />
//                 </>
//               )}

//               <TextField 
//                 select 
//                 label="Status" 
//                 size="small" 
//                 value={filters.status}
//                 onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} 
//                 sx={{ minWidth: 110, bgcolor: '#f5f5f5', borderRadius: 1 }}
//               >
//                 <MenuItem value="All">All statuses</MenuItem>
//                 {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//               </TextField>

//               <TextField 
//                 select 
//                 label="Priority" 
//                 size="small" 
//                 value={filters.priority}
//                 onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} 
//                 sx={{ minWidth: 100, bgcolor: '#f5f5f5', borderRadius: 1 }}
//               >
//                 <MenuItem value="All">All priorities</MenuItem>
//                 {PRIORITY_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
//               </TextField>
//             </Stack>

//             {/* Right side: Admin username filter, search, and action buttons */}
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flex={1} minWidth={0} justifyContent="flex-end">

//               {/* ✅ ADMIN USERNAME FILTER */}
//               {isAdmin && (
//                 <TextField 
//                   select 
//                   label="User" 
//                   size="small" 
//                   value={filters.username}
//                   onChange={(e) => setFilters((f) => ({ ...f, username: e.target.value }))} 
//                   sx={{ minWidth: 120, bgcolor: '#f5f5f5', borderRadius: 1 }}
//                 >
//                   <MenuItem value="All">All users</MenuItem>
//                   {uniqueUsernames.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
//                 </TextField>
//               )}

//               <TextField 
//                 label="Search" 
//                 size="small" 
//                 placeholder="Project…" 
//                 value={filters.search}
//                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} 
//                 sx={{ minWidth: 140, bgcolor: '#f5f5f5', borderRadius: 1 }}
//               />

//               <Tooltip title="Reset filters">
//                 <IconButton 
//                   onClick={() => setFilters({ dateFilterType: 'range', singleDate: '', fromDate: monthStart, toDate: today, status: 'All', priority: 'All', search: '', username: 'All' })} 
//                   sx={{ border: '1px solid #E4E9EC', bgcolor: '#f5f5f5', borderRadius: 1 }}
//                 >
//                   <RefreshRoundedIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>

//               {/* ✅ ADD TASK BUTTON - PRIMARY POSITION */}
//               <Button 
//                 variant="contained" 
//                 startIcon={<AddRoundedIcon />} 
//                 onClick={openAdd}
//                 sx={{ bgcolor: PRIMARY, whiteSpace: 'nowrap', '&:hover': { bgcolor: PRIMARY_DARK } }}
//               >
//                 Add Task
//               </Button>

//               {/* ✅ EXPORT EXCEL BUTTON */}
//               <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadRoundedIcon />}
//                 endIcon={<ArrowDropDownRoundedIcon />}
//                 onClick={(e) => setExportAnchorEl(e.currentTarget)}
//                 sx={{ borderColor: PRIMARY, color: PRIMARY, whiteSpace: 'nowrap' }}
//               >
//                 Export
//               </Button>
//             </Stack>
//           </Stack>
//         </Paper>

//         <Menu anchorEl={exportAnchorEl} open={!!exportAnchorEl} onClose={() => setExportAnchorEl(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
//           <MenuItem onClick={() => handleExportPreset('today')}>
//             <ListItemIcon><TodayRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="Today Only" secondary={dayjs(today).format('DD MMM YYYY')} />
//           </MenuItem>
//           <Divider />
//           <MenuItem onClick={() => handleExportPreset('week')}>
//             <ListItemIcon><CalendarViewWeekRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="This Week" secondary="Monday – Sunday" />
//           </MenuItem>
//           <MenuItem onClick={() => handleExportPreset('month')}>
//             <ListItemIcon><CalendarMonthRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="This Month" />
//           </MenuItem>
//           <MenuItem onClick={() => handleExportPreset('year')}>
//             <ListItemIcon><EventRepeatRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="This Year" />
//           </MenuItem>
//           <Divider />
//           <MenuItem onClick={() => handleExportPreset('custom')}>
//             <ListItemIcon><DateRangeRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="Custom Range…" secondary="Pick any From – To dates" />
//           </MenuItem>
//           <MenuItem onClick={() => handleExportPreset('current')}>
//             <ListItemIcon><FileDownloadRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
//             <ListItemText primary="Current Filtered View" />
//           </MenuItem>
//         </Menu>

//         <Dialog open={rangeDialogOpen} onClose={() => setRangeDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
//           <DialogTitle sx={{ fontWeight: 800 }}>Custom Export Range</DialogTitle>
//           <Divider />
//           <DialogContent sx={{ pt: 3 }}>
//             <Stack spacing={2}>
//               <TextField label="From" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }}
//                 value={customRange.from} onChange={(e) => setCustomRange((r) => ({ ...r, from: e.target.value }))} />
//               <TextField label="To" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }}
//                 value={customRange.to} onChange={(e) => setCustomRange((r) => ({ ...r, to: e.target.value }))} />
//             </Stack>
//           </DialogContent>
//           <Divider />
//           <DialogActions sx={{ p: 2 }}>
//             <Button onClick={() => setRangeDialogOpen(false)} color="inherit">Cancel</Button>
//             <Button onClick={handleCustomRangeExport} variant="contained" sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK } }}>
//               Download
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Stack spacing={3}>
//           <Grid container spacing={2}>
//             {kpiCards.map((c) => (
//               <Grid item xs={12} sm={6} md={3} lg={1.5} key={c.label} sx={{ flexGrow: 1 }}>
//                 <KpiCard {...c} />
//               </Grid>
//             ))}
//           </Grid>

//           <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
//             <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
//               <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Task status breakdown</Typography>
//               {statusBreakdown.length === 0 ? (
//                 <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No tasks match the current filters.</Typography></Box>
//               ) : (
//                 <Box sx={{ position: 'relative', height: 300 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2} strokeWidth={0}>
//                         {statusBreakdown.map((entry) => (
//                           <Cell key={entry.name} fill={STATUS_COLORS[entry.name]?.main || '#94A3B8'} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip formatter={(value, name) => [`${value} task${value === 1 ? '' : 's'}`, name]} />
//                       <Legend verticalAlign="bottom" height={36} iconType="circle" />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <Stack sx={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', alignItems: 'center' }}>
//                     <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.total}</Typography>
//                     <Typography variant="caption" color="text.secondary">total</Typography>
//                   </Stack>
//                 </Box>
//               )}
//             </Paper>

//             <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
//               <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Delay reasons this period</Typography>
//               {reasonBreakdown.length === 0 ? (
//                 <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No delays recorded. 🎉</Typography></Box>
//               ) : (
//                 <Box sx={{ height: 300 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={reasonBreakdown} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9EC" />
//                       <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
//                       <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
//                       <ChartTooltip formatter={(value) => [`${value} task${value === 1 ? '' : 's'}`, 'Count']} />
//                       <Bar dataKey="value" radius={[6, 6, 0, 0]}>
//                         {reasonBreakdown.map((entry, i) => (
//                           <Cell key={entry.name} fill={REASON_PALETTE[i % REASON_PALETTE.length]} />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </Box>
//               )}
//             </Paper>

//             <Paper elevation={0} sx={{ p: 2.5, flex: 0.8, minWidth: 220, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Priority mix</Typography>
//               <Stack spacing={2.5}>
//                 {priorityBreakdown.map(({ name, value }) => {
//                   const pct = kpis.total ? Math.round((value / kpis.total) * 100) : 0;
//                   return (
//                     <Box key={name}>
//                       <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[name].main }} />
//                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
//                         </Stack>
//                         <Typography variant="body2" color="text.secondary">{value}</Typography>
//                       </Stack>
//                       <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#EEF1F2', overflow: 'hidden' }}>
//                         <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: PRIORITY_COLORS[name].main, borderRadius: 4, transition: 'width .3s ease' }} />
//                       </Box>
//                     </Box>
//                   );
//                 })}
//                 {kpis.total === 0 && <Typography variant="body2" color="text.secondary">No tasks match the current filters.</Typography>}
//               </Stack>
//             </Paper>
//           </Stack>

//           <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
//             <Box sx={{ p: 2, pb: 1 }}>
//               <Typography variant="h6" sx={{ fontWeight: 700 }}>All tasks ({filtered.length})</Typography>
//             </Box>
//             <TableContainer sx={{ maxHeight: 560 }}>
//               <Table stickyHeader size="small">
//                 <TableHead>
//                   <TableRow>
//                     {['SR', 'User', 'Assigned By', 'Project', 'Start', 'Expected', 'Completed',
//                       'Status', 'Priority', 'Time Taken', 'Reason', 'Remarks', 'Actions'].map((h) => (
//                         <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
//                           sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
//                           {h}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filtered.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={13}>
//                         <Box sx={{ py: 6, textAlign: 'center' }}>
//                           <Typography color="text.secondary">No tasks yet — click &ldquo;Add Task&rdquo; to create the first one.</Typography>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                   {filtered.map((t, idx) => {
//                     const statusColors = STATUS_COLORS[t.status] || { main: '#94A3B8', bg: '#F1F5F9' };
//                     const priorityColors = PRIORITY_COLORS[t.priority] || { main: '#94A3B8', bg: '#F1F5F9' };
//                     const isCompleted = t.status === 'Completed';
//                     return (
//                       <TableRow key={t.id} hover sx={{ bgcolor: idx % 2 ? '#FAFBFC' : 'transparent' }}>
//                         <TableCell>{idx + 1}</TableCell>
//                         <TableCell sx={{ fontSize: '0.8rem' }}>{t.username || '—'}</TableCell>
//                         <TableCell>{t.assigned_by || '—'}</TableCell>
//                         <TableCell sx={{ maxWidth: 200 }}>{t.project_name}</TableCell>
//                         <TableCell>{fmt(t.start_date)}</TableCell>
//                         <TableCell>{fmt(t.expacted_date)}</TableCell>
//                         <TableCell>{fmt(t.completed_date)}</TableCell>
//                         <TableCell>
//                           <Chip label={t.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.main, fontWeight: 700 }} />
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={t.priority} size="small" sx={{ bgcolor: priorityColors.bg, color: priorityColors.main, fontWeight: 700 }} />
//                         </TableCell>
//                         <TableCell sx={{ whiteSpace: 'nowrap' }}>{getTotalTime(t)}</TableCell>
//                         <TableCell>
//                           {t.reason_for_delay && t.reason_for_delay !== 'None' ? <Chip label={t.reason_for_delay} size="small" variant="outlined" /> : '—'}
//                         </TableCell>
//                         <TableCell sx={{ maxWidth: 200 }}>
//                           <Typography variant="body2" color="text.secondary" noWrap title={t.remarks}>{t.remarks || '—'}</Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Stack direction="row" spacing={0.5} justifyContent="center">
//                             <Tooltip title={isCompleted ? "Cannot edit completed tasks" : "Edit task"}>
//                               <span>
//                                 <IconButton 
//                                   size="small" 
//                                   onClick={() => openEdit(t)}
//                                   disabled={isCompleted}
//                                 >
//                                   <EditRoundedIcon fontSize="small" />
//                                 </IconButton>
//                               </span>
//                             </Tooltip>
//                             <IconButton size="small" onClick={() => handleDelete(t.id)}>
//                               <DeleteRoundedIcon fontSize="small" color="error" />
//                             </IconButton>
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Stack>
//       </Container>

//       <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} initialTask={editingTask} currentUsername={currentUsername} />

//       <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         {snack && <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>{snack.message}</Alert>}
//       </Snackbar>
//     </Box>
//   );
// }

import React, { useMemo, useState, useEffect } from 'react';
import {
  Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
  IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Snackbar, Alert, Menu, ListItemIcon, ListItemText, CircularProgress,
} from '@mui/material';

import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeekRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getDecreyptedData } from "../../../utils/localstorage";


/* ============================== CONSTANTS ============================== */

const API_BASE_URL =
  'https://commtoolapi.mcpspmis.com/task_tracking/tasks/';

// ADMIN USERS - SAME AS BACKEND
const ADMIN_USERS = [
  "abhinav@ust.com",
  "mohit@ust.com"
];

const STATUS_OPTIONS = [
  'Not Started',
  'In Progress',
  'In Review',
  'Testing',
  'Completed',
  'Delayed',
  'On Hold',
];

const PRIORITY_OPTIONS = [
  'High',
  'Medium',
  'Low'
];

const REASON_OPTIONS = [
  'None',
  'Resource Constraint',
  'Dependency Delay',
  'Scope Change',
  'Client Delay',
  'Technical Issue',
  'Requirement Change',
  'Other',
];


// Status color tokens
const STATUS_COLORS = {
  'Not Started': {
    main: '#64748B',
    bg: '#F1F5F9'
  },

  'In Progress': {
    main: '#2563EB',
    bg: '#EAF1FE'
  },

  'In Review': {
    main: '#D97706',
    bg: '#FEF3E2'
  },

  'Testing': {
    main: '#7C3AED',
    bg: '#F3ECFE'
  },

  'Completed': {
    main: '#0E9F6E',
    bg: '#E7F9F1'
  },

  'Delayed': {
    main: '#DC2626',
    bg: '#FDECEC'
  },

  'On Hold': {
    main: '#475569',
    bg: '#EEF1F4'
  },
};


const PRIORITY_COLORS = {
  High: {
    main: '#DC2626',
    bg: '#FDECEC'
  },

  Medium: {
    main: '#D97706',
    bg: '#FEF3E2'
  },

  Low: {
    main: '#0E9F6E',
    bg: '#E7F9F1'
  },
};


const KPI_ICONS = {
  'Total Tasks': AssignmentRoundedIcon,
  'Not Started': HourglassEmptyRoundedIcon,
  'In Progress': TrendingUpRoundedIcon,
  'In Review': RateReviewRoundedIcon,
  'Testing': ScienceRoundedIcon,
  'Completed': CheckCircleRoundedIcon,
  'Delayed': ReportProblemRoundedIcon,
  'Completion %': DonutLargeRoundedIcon,
};


const REASON_PALETTE = [
  '#0E7C7B',
  '#D97706',
  '#DC2626',
  '#2563EB',
  '#7C3AED',
  '#0EA5E9',
  '#64748B',
  '#B45309'
];


const PRIMARY = '#0E7C7B';
const PRIMARY_DARK = '#0A5D5C';


/* ============================== HELPERS ============================== */


// GET CURRENT USERNAME
const getCurrentUsername = () => {

  const username =
    getDecreyptedData('userID') ||
    getDecreyptedData('username') ||
    'anonymous';

  console.log(
    'Current username:',
    username
  );

  return username;
};


// CHECK IF USER IS ADMIN
const isUserAdmin = () => {

  const username = getCurrentUsername();

  return ADMIN_USERS.includes(username);
};


// EMPTY FORM
// CHANGED: Date defaults to today's local date
const getEmptyForm = () => ({

  date: dayjs().format('YYYY-MM-DD'),

  username: getCurrentUsername(),

  assigned_by: '',

  project_name: '',

  start_date: '',

  expacted_date: '',

  completed_date: '',

  status: 'Not Started',

  priority: 'Medium',

  reason_for_delay: 'None',

  remarks: '',
});


// function getTotalTime(task) {

//   if (!task.start_date) {
//     return '—';
//   }

//   const start = dayjs(
//     task.start_date
//   );

//   if (task.completed_date) {

//     const days =
//       dayjs(task.completed_date)
//         .diff(start, 'day');

//     return `${days} day${days === 1 ? '' : 's'}`;
//   }

//   const days =
//     dayjs().diff(
//       start,
//       'day'
//     );

//   return `${days} day${days === 1 ? '' : 's'} (ongoing)`;
// }


function getTotalTime(task) {
  if (!task.start_date) return '—';

  const start = dayjs(task.start_date).startOf('day');

  const end = task.completed_date
    ? dayjs(task.completed_date).startOf('day')
    : dayjs().startOf('day');

  if (end.isBefore(start, 'day')) {
    return '—';
  }

  let workingDays = 0;
  let currentDate = start;

  // Include both start date and end date
  while (
    currentDate.isBefore(end, 'day') ||
    currentDate.isSame(end, 'day')
  ) {
    const dayOfWeek = currentDate.day();

    // Sunday = 0
    // Saturday = 6
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }

    currentDate = currentDate.add(1, 'day');
  }

  if (task.completed_date) {
    return `${workingDays} working day${workingDays === 1 ? '' : 's'}`;
  }

  return `${workingDays} working day${workingDays === 1 ? '' : 's'} (ongoing)`;

}


/*
 * FILTER TASKS
 *
 * CHANGED:
 * Search filters ONLY by username.
 */
function filterTasks(
  tasks,
  {
    dateFilterType,
    singleDate,
    fromDate,
    toDate,
    status,
    priority,
    search,
    username
  }
) {

  return tasks.filter((t) => {

    /*
     * All Dates:
     * dateFilterType === single
     * singleDate is empty
     *
     * Therefore no date filtering happens.
     */
    if (
      dateFilterType === 'single' &&
      singleDate &&
      t.date !== singleDate
    ) {
      return false;
    }


    // Date Range
    if (
      dateFilterType === 'range' &&
      fromDate &&
      toDate
    ) {

      if (!t.start_date) {
        return false;
      }

      const taskDate =
        dayjs(t.start_date);

      const from =
        dayjs(fromDate);

      const to =
        dayjs(toDate);

      if (
        taskDate.isBefore(from, 'day') ||
        taskDate.isAfter(to, 'day')
      ) {
        return false;
      }
    }


    // Status filter
    if (
      status &&
      status !== 'All' &&
      t.status !== status
    ) {
      return false;
    }


    // Priority filter
    if (
      priority &&
      priority !== 'All' &&
      t.priority !== priority
    ) {
      return false;
    }


    // Admin username dropdown filter
    if (
      username &&
      username !== 'All' &&
      t.username !== username
    ) {
      return false;
    }


    /*
     * CHANGED:
     * Search input filters ONLY by task username.
     */
    if (search) {

      const q =
        search
          .trim()
          .toLowerCase();

      const taskUsername =
        (t.username || '')
          .toLowerCase();

      if (
        !taskUsername.includes(q)
      ) {
        return false;
      }
    }


    return true;
  });
}


function computeKpis(tasks) {

  const total =
    tasks.length;

  const counts = {};

  tasks.forEach((t) => {

    counts[t.status] =
      (counts[t.status] || 0) + 1;
  });

  const completed =
    counts['Completed'] || 0;

  const completionPct =
    total
      ? Math.round(
        (completed / total) * 100
      )
      : 0;

  return {
    total,
    counts,
    completed,
    completionPct
  };
}


function computeStatusBreakdown(tasks) {

  return STATUS_OPTIONS
    .map((s) => ({
      name: s,

      value:
        tasks.filter(
          (t) => t.status === s
        ).length
    }))
    .filter(
      (d) => d.value > 0
    );
}


function computeReasonBreakdown(tasks) {

  const counts = {};

  tasks.forEach((t) => {

    if (
      t.reason_for_delay &&
      t.reason_for_delay !== 'None'
    ) {

      counts[t.reason_for_delay] =
        (counts[t.reason_for_delay] || 0) + 1;
    }
  });


  return Object
    .entries(counts)
    .map(
      ([name, value]) => ({
        name,
        value
      })
    );
}


function computePriorityBreakdown(tasks) {

  return PRIORITY_OPTIONS.map(
    (p) => ({
      name: p,

      value:
        tasks.filter(
          (t) => t.priority === p
        ).length
    })
  );
}


function fmt(d) {

  return d
    ? dayjs(d).format('DD MMM YYYY')
    : '—';
}


/*
 * CHANGED:
 * Shows maximum first four words.
 */
function getShortRemarks(
  remarks,
  wordLimit = 4
) {

  if (!remarks) {
    return '—';
  }

  const words =
    remarks
      .trim()
      .split(/\s+/);

  if (
    words.length <= wordLimit
  ) {
    return remarks;
  }

  return `${words
    .slice(0, wordLimit)
    .join(' ')}...`;
}


/* ========================= API FUNCTIONS ========================= */


async function fetchTasks() {

  try {

    const username =
      getCurrentUsername();

    console.log(
      'Fetching tasks for user:',
      username
    );


    const response =
      await fetch(
        `${API_BASE_URL}?username=${encodeURIComponent(username)}`
      );


    if (!response.ok) {

      console.error(
        'Fetch error:',
        response.status
      );

      throw new Error(
        'Failed to fetch tasks'
      );
    }


    const data =
      await response.json();


    console.log(
      'Fetched tasks:',
      data
    );


    return Array.isArray(data)
      ? data
      : data.results || [];

  } catch (error) {

    console.error(
      'Error fetching tasks:',
      error
    );

    return [];
  }
}


// CREATE TASK
async function createTask(taskData) {

  try {

    const username =
      getCurrentUsername();


    const payload = {

      date:
        taskData.date,

      username:
        taskData.username ||
        username,

      assigned_by:
        taskData.assigned_by,

      project_name:
        taskData.project_name,

      start_date:
        taskData.start_date,

      expacted_date:
        taskData.expacted_date ||
        null,

      completed_date:
        taskData.completed_date ||
        null,

      status:
        taskData.status,

      priority:
        taskData.priority,

      reason_for_delay:
        taskData.reason_for_delay,

      remarks:
        taskData.remarks,
    };


    console.log(
      'Creating task with payload:',
      payload
    );


    const response =
      await fetch(
        API_BASE_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload)
        }
      );


    if (!response.ok) {

      const errorData =
        await response.json();

      console.error(
        'Create error:',
        errorData
      );

      throw new Error(
        JSON.stringify(errorData)
      );
    }


    const responseData =
      await response.json();


    console.log(
      'Task created:',
      responseData
    );


    return responseData;

  } catch (error) {

    console.error(
      'Error creating task:',
      error
    );

    throw error;
  }
}


// UPDATE TASK
async function updateTask(
  taskId,
  taskData
) {

  try {

    const username =
      getCurrentUsername();


    const payload = {

      date:
        taskData.date,

      username:
        taskData.username ||
        username,

      assigned_by:
        taskData.assigned_by,

      project_name:
        taskData.project_name,

      start_date:
        taskData.start_date,

      expacted_date:
        taskData.expacted_date ||
        null,

      completed_date:
        taskData.completed_date ||
        null,

      status:
        taskData.status,

      priority:
        taskData.priority,

      reason_for_delay:
        taskData.reason_for_delay,

      remarks:
        taskData.remarks,
    };


    console.log(
      'Updating task with payload:',
      payload
    );


    const response =
      await fetch(
        `${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload)
        }
      );


    if (!response.ok) {

      const errorData =
        await response.json();

      console.error(
        'Update error:',
        errorData
      );

      throw new Error(
        JSON.stringify(errorData)
      );
    }


    const responseData =
      await response.json();


    console.log(
      'Task updated:',
      responseData
    );


    return responseData;

  } catch (error) {

    console.error(
      'Error updating task:',
      error
    );

    throw error;
  }
}


// DELETE TASK
async function deleteTask(taskId) {

  try {

    const username =
      getCurrentUsername();


    console.log(
      'Deleting task:',
      taskId,
      'for user:',
      username
    );


    const response =
      await fetch(
        `${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`,
        {
          method: 'DELETE'
        }
      );


    if (!response.ok) {

      console.error(
        'Delete error:',
        response.status
      );

      throw new Error(
        'Failed to delete task'
      );
    }


    console.log(
      'Task deleted successfully'
    );

  } catch (error) {

    console.error(
      'Error deleting task:',
      error
    );

    throw error;
  }
}


/* ========================= COLORFUL EXCEL EXPORT ========================= */


async function exportTasksToExcel(
  tasks,
  filename
) {

  const STATUS_FILL = {

    'Not Started': {
      fg: 'FFD9D9D9',
      font: 'FF595959'
    },

    'In Progress': {
      fg: 'FFBDD7EE',
      font: 'FF1F4E78'
    },

    'In Review': {
      fg: 'FFFFE9B3',
      font: 'FF7F6000'
    },

    'Testing': {
      fg: 'FFE3D2FB',
      font: 'FF5A2D9C'
    },

    'Completed': {
      fg: 'FFC6EFCE',
      font: 'FF006100'
    },

    'Delayed': {
      fg: 'FFFFC7CE',
      font: 'FF9C0006'
    },

    'On Hold': {
      fg: 'FFE4DFEC',
      font: 'FF5F497A'
    },
  };


  const PRIORITY_FILL = {

    High: {
      fg: 'FFFFC7CE',
      font: 'FF9C0006'
    },

    Medium: {
      fg: 'FFFFE9B3',
      font: 'FF7F6000'
    },

    Low: {
      fg: 'FFC6EFCE',
      font: 'FF006100'
    },
  };


  const NAVY =
    'FF1F4E78';

  const WHITE =
    'FFFFFFFF';


  const border = {

    top: {
      style: 'thin',
      color: {
        argb: 'FFB7B7B7'
      }
    },

    left: {
      style: 'thin',
      color: {
        argb: 'FFB7B7B7'
      }
    },

    bottom: {
      style: 'thin',
      color: {
        argb: 'FFB7B7B7'
      }
    },

    right: {
      style: 'thin',
      color: {
        argb: 'FFB7B7B7'
      }
    },
  };


  const wb =
    new ExcelJS.Workbook();


  wb.creator =
    'Task Tracker';

  wb.created =
    new Date();


  const summary =
    wb.addWorksheet(
      'Dashboard',
      {
        views: [
          {
            showGridLines: false
          }
        ]
      }
    );


  summary.columns = [
    { width: 4 },
    { width: 26 },
    { width: 16 },
    { width: 4 },
    { width: 26 },
    { width: 16 }
  ];


  summary.mergeCells(
    'B2:F2'
  );


  summary.getCell('B2').value =
    'Task Tracker — Summary Report';


  summary.getCell('B2').font = {
    name: 'Arial',
    size: 18,
    bold: true,
    color: {
      argb: NAVY
    }
  };


  summary.mergeCells(
    'B3:F3'
  );


  summary.getCell('B3').value =
    `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;


  summary.getCell('B3').font = {
    name: 'Arial',
    size: 10,
    italic: true,
    color: {
      argb: '5B6B75'
    }
  };


  const kpis =
    computeKpis(tasks);


  let r = 5;


  summary.getCell(`B${r}`).value =
    'Key Metrics';


  summary.getCell(`B${r}`).font = {
    name: 'Arial',
    size: 12,
    bold: true,
    color: {
      argb: NAVY
    }
  };


  r += 1;


  [
    [
      'Total Tasks',
      kpis.total
    ],

    [
      'Completed',
      kpis.completed
    ],

    [
      'Completion %',
      `${kpis.completionPct}%`
    ]

  ].forEach(
    ([label, value]) => {

      summary.getCell(`B${r}`).value =
        label;

      summary.getCell(`B${r}`).font = {
        name: 'Arial',
        size: 10
      };


      summary.getCell(`C${r}`).value =
        value;

      summary.getCell(`C${r}`).font = {
        name: 'Arial',
        size: 12,
        bold: true,
        color: {
          argb: NAVY
        }
      };


      r += 1;
    }
  );


  let statusRow = 5;


  summary.getCell(
    `E${statusRow}`
  ).value =
    'Status Breakdown';


  summary.getCell(
    `E${statusRow}`
  ).font = {
    name: 'Arial',
    size: 12,
    bold: true,
    color: {
      argb: NAVY
    }
  };


  statusRow += 1;


  ['Status', 'Count']
    .forEach(
      (h, i) => {

        const cell =
          summary.getCell(
            statusRow,
            5 + i
          );


        cell.value = h;


        cell.font = {
          name: 'Arial',
          size: 10,
          bold: true,
          color: {
            argb: WHITE
          }
        };


        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: NAVY
          }
        };


        cell.border =
          border;
      }
    );


  statusRow += 1;


  computeStatusBreakdown(tasks)
    .forEach(
      ({
        name,
        value
      }) => {

        const fill =
          STATUS_FILL[name] || {
            fg: 'FFEFEFEF',
            font: 'FF333333'
          };


        const nameCell =
          summary.getCell(
            `E${statusRow}`
          );


        nameCell.value =
          name;


        nameCell.font = {
          name: 'Arial',
          size: 10,
          bold: true,
          color: {
            argb: fill.font
          }
        };


        nameCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: fill.fg
          }
        };


        nameCell.border =
          border;


        const countCell =
          summary.getCell(
            `F${statusRow}`
          );


        countCell.value =
          value;


        countCell.alignment = {
          horizontal: 'center'
        };


        countCell.border =
          border;


        statusRow += 1;
      }
    );


  // Task Data Sheet
  const ws =
    wb.addWorksheet(
      'Task Data',
      {
        views: [
          {
            state: 'frozen',
            ySplit: 1,
            showGridLines: false
          }
        ]
      }
    );


  const headers = [
    'SR No',
    'Date',
    'User',
    'Assigned By',
    'Project',
    'Start Date',
    'Expected Date',
    'Completed Date',
    'Status',
    'Priority',
    'Reason for Delay',
    'Remarks'
  ];


  ws.columns = [
    { width: 7 },
    { width: 12 },
    { width: 18 },
    { width: 18 },
    { width: 28 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 20 },
    { width: 30 }
  ];


  const headerRow =
    ws.getRow(1);


  headers.forEach(
    (h, i) => {

      const cell =
        headerRow.getCell(
          i + 1
        );


      cell.value =
        h;


      cell.font = {
        name: 'Arial',
        size: 11,
        bold: true,
        color: {
          argb: WHITE
        }
      };


      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: NAVY
        }
      };


      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };


      cell.border =
        border;
    }
  );


  headerRow.height =
    24;


  const STATUS_COL = 9;
  const PRIORITY_COL = 10;


  tasks.forEach(
    (t, idx) => {

      const row =
        ws.getRow(
          idx + 2
        );


      const values = [

        idx + 1,

        t.date
          ? dayjs(t.date)
            .format('DD-MMM-YYYY')
          : '',

        t.username || '',

        t.assigned_by || '',

        t.project_name || '',

        t.start_date
          ? dayjs(t.start_date)
            .format('DD-MMM-YYYY')
          : '',

        t.expacted_date
          ? dayjs(t.expacted_date)
            .format('DD-MMM-YYYY')
          : '',

        t.completed_date
          ? dayjs(t.completed_date)
            .format('DD-MMM-YYYY')
          : '',

        t.status || '',

        t.priority || '',

        t.reason_for_delay || '',

        t.remarks || '',
      ];


      values.forEach(
        (v, i) => {

          const cell =
            row.getCell(
              i + 1
            );


          cell.value =
            v;


          cell.font = {
            name: 'Arial',
            size: 10
          };


          cell.border =
            border;


          cell.alignment = {
            vertical: 'middle',
            wrapText: i === 11,

            horizontal:
              [0, 8, 9].includes(i)
                ? 'center'
                : 'left'
          };
        }
      );


      if (
        idx % 2 === 1
      ) {

        for (
          let c = 1;
          c <= headers.length;
          c++
        ) {

          const cell =
            row.getCell(c);


          if (!cell.fill) {

            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'FFF6F8F9'
              }
            };
          }
        }
      }


      const statusFill =
        STATUS_FILL[t.status] || {
          fg: 'FFEFEFEF',
          font: 'FF333333'
        };


      const statusCell =
        row.getCell(
          STATUS_COL
        );


      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: statusFill.fg
        }
      };


      statusCell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: {
          argb: statusFill.font
        }
      };


      statusCell.alignment = {
        horizontal: 'center'
      };


      const priorityFill =
        PRIORITY_FILL[t.priority] || {
          fg: 'FFEFEFEF',
          font: 'FF333333'
        };


      const priorityCell =
        row.getCell(
          PRIORITY_COL
        );


      priorityCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: priorityFill.fg
        }
      };


      priorityCell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: {
          argb: priorityFill.font
        }
      };


      priorityCell.alignment = {
        horizontal: 'center'
      };
    }
  );


  ws.autoFilter = {
    from: 'A1',
    to: `L${tasks.length + 1}`
  };


  const buffer =
    await wb.xlsx.writeBuffer();


  saveAs(
    new Blob(
      [buffer],
      {
        type:
          'application/octet-stream'
      }
    ),
    filename
  );
}


/* ============================== SUBCOMPONENTS ============================== */


function KpiCard({
  label,
  value,
  color
}) {

  const Icon =
    KPI_ICONS[label] ||
    AssignmentRoundedIcon;


  return (

    <Paper
      elevation={0}
      sx={{

        p: 2.25,

        height: '100%',

        borderRadius: 3,

        border:
          '1px solid #E9EDEF',

        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FBFDFD 100%)',

        boxShadow:
          '0 1px 2px rgba(16,24,40,0.04)',

        transition:
          'transform .15s ease, box-shadow .15s ease',

        '&:hover': {

          transform:
            'translateY(-2px)',

          boxShadow:
            '0 8px 20px rgba(16,24,40,0.08)'
        },
      }}
    >

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.secondary'
          }}
        >
          {label}
        </Typography>


        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}1A`,
          }}
        >

          <Icon
            sx={{
              fontSize: 18,
              color
            }}
          />

        </Box>

      </Stack>


      <Typography
        variant="h4"
        sx={{
          mt: 1.5,
          mb: 1,
          fontWeight: 800
        }}
      >
        {value}
      </Typography>


      <Box
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: color,
          width: '55%'
        }}
      />

    </Paper>
  );
}


/* ========================== TASK FORM ========================== */


function TaskFormDialog({
  open,
  onClose,
  onSave,
  initialTask,
  currentUsername
}) {

  const [form, setForm] =
    useState(
      getEmptyForm()
    );


  const [errors, setErrors] =
    useState({});


  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (open) {

      if (initialTask) {

        setForm({

          date:
            initialTask.date ||
            dayjs().format('YYYY-MM-DD'),

          username:
            initialTask.username ||
            currentUsername,

          assigned_by:
            initialTask.assigned_by ||
            '',

          project_name:
            initialTask.project_name ||
            '',

          start_date:
            initialTask.start_date ||
            '',

          expacted_date:
            initialTask.expacted_date ||
            '',

          completed_date:
            initialTask.completed_date ||
            '',

          status:
            initialTask.status ||
            'Not Started',

          priority:
            initialTask.priority ||
            'Medium',

          reason_for_delay:
            initialTask.reason_for_delay ||
            'None',

          remarks:
            initialTask.remarks ||
            '',
        });

      } else {

        setForm(
          getEmptyForm()
        );
      }


      setErrors({});
    }

  }, [
    open,
    initialTask,
    currentUsername
  ]);


  const handleChange =
    (field) =>
      (e) => {

        setForm(
          (f) => ({
            ...f,

            [field]:
              e.target.value
          })
        );
      };


  const validate = () => {

    const e = {};


    if (
      !form.assigned_by.trim()
    ) {

      e.assigned_by =
        'Required';
    }


    if (
      !form.project_name.trim()
    ) {

      e.project_name =
        'Required';
    }


    if (
      !form.start_date
    ) {

      e.start_date =
        'Required';
    }


    if (
      form.expacted_date &&
      form.start_date &&
      form.expacted_date <
      form.start_date
    ) {

      e.expacted_date =
        'Cannot be before start date';
    }


    if (
      form.completed_date &&
      form.start_date &&
      form.completed_date <
      form.start_date
    ) {

      e.completed_date =
        'Cannot be before start date';
    }


    setErrors(e);


    return (
      Object.keys(e).length === 0
    );
  };


  const handleSubmit =
    async () => {

      if (validate()) {

        setLoading(true);

        try {

          await onSave(form);

        } finally {

          setLoading(false);
        }
      }
    };


  return (

    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3
        }
      }}
    >

      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800
          }}
        >

          {initialTask
            ? 'Edit Task'
            : 'Add Task'}

        </Typography>


        <IconButton
          size="small"
          onClick={onClose}
          disabled={loading}
        >

          <CloseRoundedIcon />

        </IconButton>

      </DialogTitle>


      <Divider />


      <DialogContent
        sx={{
          pt: 3
        }}
      >

        <Grid
          container
          spacing={2}
        >

          {/* ============================================
              CHANGED:
              Add Task allows ONLY current date.
              Edit mode keeps its existing date.
          ============================================ */}

          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Date"
              type="date"
              fullWidth
              size="small"

              InputLabelProps={{
                shrink: true
              }}

              inputProps={
                !initialTask
                  ? {
                    min:
                      dayjs().format(
                        'YYYY-MM-DD'
                      ),

                    max:
                      dayjs().format(
                        'YYYY-MM-DD'
                      )
                  }
                  : {}
              }

              value={form.date}

              onChange={
                handleChange('date')
              }

              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Username"
              fullWidth
              size="small"
              value={form.username}
              disabled
              helperText="Auto from login"
              FormHelperTextProps={{
                sx: {
                  fontSize: '0.7rem'
                }
              }}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Assigned By"
              fullWidth
              size="small"
              value={form.assigned_by}
              onChange={
                handleChange('assigned_by')
              }
              error={
                !!errors.assigned_by
              }
              helperText={
                errors.assigned_by
              }
              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Project Name"
              fullWidth
              size="small"
              value={form.project_name}
              onChange={
                handleChange('project_name')
              }
              error={
                !!errors.project_name
              }
              helperText={
                errors.project_name
              }
              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Project Start Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={form.start_date}
              onChange={
                handleChange('start_date')
              }
              error={
                !!errors.start_date
              }
              helperText={
                errors.start_date
              }
              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Expected Completion"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={
                form.expacted_date
              }
              onChange={
                handleChange(
                  'expacted_date'
                )
              }
              error={
                !!errors.expacted_date
              }
              helperText={
                errors.expacted_date
              }
              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField
              label="Project Completed By"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={
                form.completed_date
              }
              onChange={
                handleChange(
                  'completed_date'
                )
              }
              error={
                !!errors.completed_date
              }
              helperText={
                errors.completed_date
              }
              disabled={loading}
            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={4}
          >

            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={form.status}
              onChange={
                handleChange('status')
              }
              disabled={loading}
            >

              {STATUS_OPTIONS.map(
                (s) => (

                  <MenuItem
                    key={s}
                    value={s}
                  >
                    {s}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>


          <Grid
            item
            xs={12}
            sm={4}
          >

            <TextField
              select
              label="Priority"
              fullWidth
              size="small"
              value={form.priority}
              onChange={
                handleChange('priority')
              }
              disabled={loading}
            >

              {PRIORITY_OPTIONS.map(
                (p) => (

                  <MenuItem
                    key={p}
                    value={p}
                  >

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >

                      <Box
                        sx={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          bgcolor:
                            PRIORITY_COLORS[p]
                              .main
                        }}
                      />

                      <span>
                        {p}
                      </span>

                    </Stack>

                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>


          <Grid
            item
            xs={12}
            sm={4}
          >

            <TextField
              select
              label="Reason for Delay"
              fullWidth
              size="small"
              value={
                form.reason_for_delay
              }
              onChange={
                handleChange(
                  'reason_for_delay'
                )
              }
              disabled={loading}
            >

              {REASON_OPTIONS.map(
                (s) => (

                  <MenuItem
                    key={s}
                    value={s}
                  >
                    {s}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>


          <Grid
            item
            xs={12}
          >

            <TextField
              label="Remarks"
              fullWidth
              multiline
              minRows={2}
              size="small"
              value={form.remarks}
              onChange={
                handleChange('remarks')
              }
              disabled={loading}
            />

          </Grid>

        </Grid>

      </DialogContent>


      <Divider />


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>


        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: PRIMARY,

            '&:hover': {
              bgcolor:
                PRIMARY_DARK
            }
          }}
        >

          {loading
            ? (
              <CircularProgress
                size={20}
                sx={{
                  mr: 1
                }}
              />
            )
            : null
          }


          {initialTask
            ? 'Save changes'
            : 'Add task'}

        </Button>

      </DialogActions>

    </Dialog>
  );
}


/* ============================== MAIN COMPONENT ============================== */


export default function TaskTracker() {


  const currentUsername =
    useMemo(
      () => getCurrentUsername(),
      []
    );


  const isAdmin =
    useMemo(
      () => isUserAdmin(),
      []
    );


  const [tasks, setTasks] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  /*
   * CHANGED:
   * All Dates is selected by default.
   */
  const [filters, setFilters] =
    useState({

      dateFilterType:
        'single',

      singleDate:
        '',

      fromDate:
        dayjs()
          .startOf('month')
          .format('YYYY-MM-DD'),

      toDate:
        dayjs()
          .format('YYYY-MM-DD'),

      status:
        'All',

      priority:
        'All',

      search:
        '',

      username:
        'All',
    });


  const [dialogOpen, setDialogOpen] =
    useState(false);


  const [editingTask, setEditingTask] =
    useState(null);


  const [snack, setSnack] =
    useState(null);


  const [
    exportAnchorEl,
    setExportAnchorEl
  ] =
    useState(null);


  const [
    rangeDialogOpen,
    setRangeDialogOpen
  ] =
    useState(false);


  const [
    customRange,
    setCustomRange
  ] =
    useState({
      from: '',
      to: ''
    });


  const today =
    dayjs()
      .format('YYYY-MM-DD');


  const monthStart =
    dayjs()
      .startOf('month')
      .format('YYYY-MM-DD');


  useEffect(() => {

    loadTasks();

  }, []);


  const loadTasks =
    async () => {

      setLoading(true);

      const data =
        await fetchTasks();

      setTasks(data);

      setLoading(false);
    };


  const filtered =
    useMemo(
      () =>
        filterTasks(
          tasks,
          filters
        ),

      [
        tasks,
        filters
      ]
    );


  const kpis =
    useMemo(
      () =>
        computeKpis(
          filtered
        ),

      [filtered]
    );


  const statusBreakdown =
    useMemo(
      () =>
        computeStatusBreakdown(
          filtered
        ),

      [filtered]
    );


  const reasonBreakdown =
    useMemo(
      () =>
        computeReasonBreakdown(
          filtered
        ),

      [filtered]
    );


  const priorityBreakdown =
    useMemo(
      () =>
        computePriorityBreakdown(
          filtered
        ),

      [filtered]
    );


  // UNIQUE USERNAMES FOR ADMIN FILTER
  const uniqueUsernames =
    useMemo(
      () => {

        const names = [
          ...new Set(
            tasks
              .map(
                (t) => t.username
              )
              .filter(Boolean)
          )
        ];

        return names.sort();

      },

      [tasks]
    );


  const openAdd = () => {

    setEditingTask(null);

    setDialogOpen(true);
  };


  const openEdit = (t) => {

    setEditingTask(t);

    setDialogOpen(true);
  };


  const handleSave =
    async (form) => {

      try {

        if (editingTask) {

          await updateTask(
            editingTask.id,
            form
          );


          setTasks(
            (prev) =>
              prev.map(
                (t) =>
                  t.id === editingTask.id
                    ? {
                      ...editingTask,
                      ...form
                    }
                    : t
              )
          );


          setSnack({
            severity: 'success',
            message:
              'Task updated.'
          });

        } else {

          await createTask(form);


          setSnack({
            severity: 'success',
            message:
              'Task added.'
          });


          await loadTasks();
        }


        setDialogOpen(false);

      } catch (error) {

        setSnack({
          severity: 'error',
          message:
            `Error: ${error.message}`
        });
      }
    };


  const handleDelete =
    async (id) => {

      try {

        await deleteTask(id);


        setTasks(
          (prev) =>
            prev.filter(
              (t) => t.id !== id
            )
        );


        setSnack({
          severity: 'info',
          message:
            'Task deleted.'
        });

      } catch (error) {

        setSnack({
          severity: 'error',
          message:
            `Error: ${error.message}`
        });
      }
    };


  const doExport =
    async (
      data,
      label
    ) => {

      if (!data.length) {

        setSnack({
          severity: 'warning',

          message:
            `No tasks found for "${label}".`
        });

        return;
      }


      const filename =
        `Task_Tracker_${label.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;


      await exportTasksToExcel(
        data,
        filename
      );


      setSnack({
        severity: 'success',

        message:
          `Exported ${data.length} task(s) — ${label}.`
      });
    };


  const tasksInRange =
    (from, to) =>
      tasks.filter(
        (t) => {

          if (!t.start_date) {
            return false;
          }


          if (
            from &&
            dayjs(t.start_date)
              .isBefore(
                dayjs(from),
                'day'
              )
          ) {

            return false;
          }


          if (
            to &&
            dayjs(t.start_date)
              .isAfter(
                dayjs(to),
                'day'
              )
          ) {

            return false;
          }


          return true;
        }
      );


  const handleExportPreset =
    async (type) => {

      setExportAnchorEl(null);


      const now = dayjs();


      if (
        type === 'current'
      ) {

        await doExport(
          filtered,
          'Current View'
        );

        return;
      }


      if (
        type === 'today'
      ) {

        const data =
          tasks.filter(
            (t) =>
              t.date === today
          );


        await doExport(
          data,

          `Today (${dayjs(today).format('DD MMM YYYY')})`
        );


        return;
      }


      if (
        type === 'custom'
      ) {

        setCustomRange({
          from: monthStart,
          to: today
        });


        setRangeDialogOpen(true);

        return;
      }


      let from;
      let to;
      let label;


      if (
        type === 'week'
      ) {

        from =
          now.startOf('week');

        to =
          now.endOf('week');

        label =
          `Weekly (${from.format('DD MMM')} - ${to.format('DD MMM YYYY')})`;

      } else if (
        type === 'month'
      ) {

        from =
          now.startOf('month');

        to =
          now.endOf('month');

        label =
          `Monthly (${now.format('MMM YYYY')})`;

      } else if (
        type === 'year'
      ) {

        from =
          now.startOf('year');

        to =
          now.endOf('year');

        label =
          `Yearly (${now.format('YYYY')})`;
      }


      const data =
        tasksInRange(
          from.format(
            'YYYY-MM-DD'
          ),

          to.format(
            'YYYY-MM-DD'
          )
        );


      await doExport(
        data,
        label
      );
    };


  const handleCustomRangeExport =
    async () => {

      if (
        !customRange.from ||
        !customRange.to
      ) {

        setSnack({
          severity:
            'warning',

          message:
            'Please select both From and To dates.'
        });

        return;
      }


      const data =
        tasksInRange(
          customRange.from,
          customRange.to
        );


      setRangeDialogOpen(false);


      await doExport(
        data,

        `${dayjs(customRange.from).format('DD MMM YYYY')} to ${dayjs(customRange.to).format('DD MMM YYYY')}`
      );
    };


  const kpiCards = [

    {
      label:
        'Total Tasks',

      value:
        kpis.total,

      color:
        '#1B2A4A'
    },

    {
      label:
        'Not Started',

      value:
        kpis.counts[
        'Not Started'
        ] || 0,

      color:
        STATUS_COLORS[
          'Not Started'
        ].main
    },

    {
      label:
        'In Progress',

      value:
        kpis.counts[
        'In Progress'
        ] || 0,

      color:
        STATUS_COLORS[
          'In Progress'
        ].main
    },

    {
      label:
        'In Review',

      value:
        kpis.counts[
        'In Review'
        ] || 0,

      color:
        STATUS_COLORS[
          'In Review'
        ].main
    },

    {
      label:
        'Testing',

      value:
        kpis.counts[
        'Testing'
        ] || 0,

      color:
        STATUS_COLORS[
          'Testing'
        ].main
    },

    {
      label:
        'Completed',

      value:
        kpis.counts[
        'Completed'
        ] || 0,

      color:
        STATUS_COLORS[
          'Completed'
        ].main
    },

    {
      label:
        'Delayed',

      value:
        kpis.counts[
        'Delayed'
        ] || 0,

      color:
        STATUS_COLORS[
          'Delayed'
        ].main
    },

    {
      label:
        'Completion %',

      value:
        `${kpis.completionPct}%`,

      color:
        PRIMARY
    },
  ];


  if (loading) {

    return (

      <Box
        sx={{
          minHeight:
            '100vh',

          bgcolor:
            '#F3F6F7',

          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'center'
        }}
      >

        <Stack
          alignItems="center"
          spacing={2}
        >

          <CircularProgress
            size={50}
            sx={{
              color: PRIMARY
            }}
          />

          <Typography
            color="text.secondary"
          >
            Loading tasks...
          </Typography>

        </Stack>

      </Box>
    );
  }


  return (

    <Box
      sx={{
        minHeight:
          '100vh',

        bgcolor:
          '#F3F6F7',

        py: {
          xs: 2,
          md: 4
        }
      }}
    >

      <Container
        maxWidth="xl"
      >


        {/* ================= HEADER ================= */}

        <Paper
          elevation={0}
          sx={{
            p:
              '12px 24px',

            mb: 3,

            borderRadius: 3,

            border:
              '1px solid #E9EDEF',

            background:
              `linear-gradient(120deg, ${PRIMARY} 0%, #12A39A 55%, #1AC2A4 100%)`,

            color:
              '#fff',

            boxShadow:
              '0 10px 24px rgba(14,124,123,0.18)'
          }}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >


            {/* LEFT DATE */}

            <Box
              sx={{
                minWidth:
                  '180px'
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  gap: 0.5,

                  fontWeight: 600
                }}
              >

                <TodayRoundedIcon
                  sx={{
                    fontSize: 16
                  }}
                />

                {dayjs(today).format(
                  'DD MMM YYYY'
                )}

              </Typography>

            </Box>


            {/* CENTER */}

            <Box
              sx={{
                flex: 1,

                textAlign:
                  'center'
              }}
            >

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{
                  mb: 0.5
                }}
              >

                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius:
                      '8px',

                    bgcolor:
                      'rgba(255,255,255,0.2)',

                    display:
                      'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    border:
                      '2px solid rgba(255,255,255,0.3)'
                  }}
                >

                  <AssignmentRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: '#fff'
                    }}
                  />

                </Box>


                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,

                    letterSpacing:
                      '0.5px'
                  }}
                >
                  Task Tracker
                </Typography>

              </Stack>


              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,

                  fontSize:
                    '12px'
                }}
              >

                Team work status & analytics

              </Typography>

            </Box>


            {/* RIGHT LOGIN */}

            <Box
              sx={{
                minWidth:
                  '220px',

                textAlign:
                  'right'
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'flex-end',

                  gap: 0.5,

                  fontWeight: 600
                }}
              >

                👤 {currentUsername}

              </Typography>


              {isAdmin && (

                <Chip
                  label="ADMIN"
                  size="small"
                  variant="filled"
                  sx={{
                    bgcolor:
                      'rgba(255,255,255,0.25)',

                    color:
                      '#fff',

                    fontWeight:
                      700,

                    mt: 0.5,

                    border:
                      '1px solid rgba(255,255,255,0.4)'
                  }}
                />

              )}

            </Box>

          </Stack>

        </Paper>


        {/* ================= FILTERS ================= */}

        <Paper
          elevation={0}
          sx={{
            p: 2,

            mb: 3,

            borderRadius: 3,

            border:
              '1px solid #E9EDEF',

            bgcolor:
              '#fff'
          }}
        >

          <Stack
            direction={{
              xs: 'column',
              md: 'row'
            }}
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
          >


            <Stack
              direction={{
                xs: 'column',
                sm: 'row'
              }}
              spacing={1.5}
              alignItems="center"
              flex={1}
              minWidth={0}
            >


              {/* DATE FILTER */}

              <TextField
                select
                label="Date Filter"
                size="small"

                value={
                  filters.dateFilterType
                }

                onChange={
                  (e) =>
                    setFilters(
                      (f) => ({
                        ...f,

                        dateFilterType:
                          e.target.value,

                        singleDate:
                          e.target.value ===
                            'single'
                            ? ''
                            : f.singleDate
                      })
                    )
                }

                sx={{
                  minWidth: 120,

                  bgcolor:
                    '#f5f5f5',

                  borderRadius: 1
                }}
              >

                {/* CHANGED: All Dates first/default */}

                <MenuItem
                  value="single"
                >
                  All Dates
                </MenuItem>

                <MenuItem
                  value="range"
                >
                  Date Range
                </MenuItem>

              </TextField>


              {/* Date controls only appear for Date Range */}

              {filters.dateFilterType ===
                'range' && (

                  <>

                    <TextField
                      label="From"
                      type="date"
                      size="small"

                      InputLabelProps={{
                        shrink: true
                      }}

                      value={
                        filters.fromDate
                      }

                      onChange={
                        (e) =>
                          setFilters(
                            (f) => ({
                              ...f,

                              fromDate:
                                e.target.value
                            })
                          )
                      }

                      sx={{
                        minWidth: 120,

                        bgcolor:
                          '#f5f5f5',

                        borderRadius: 1
                      }}
                    />


                    <TextField
                      label="To"
                      type="date"
                      size="small"

                      InputLabelProps={{
                        shrink: true
                      }}

                      value={
                        filters.toDate
                      }

                      onChange={
                        (e) =>
                          setFilters(
                            (f) => ({
                              ...f,

                              toDate:
                                e.target.value
                            })
                          )
                      }

                      sx={{
                        minWidth: 120,

                        bgcolor:
                          '#f5f5f5',

                        borderRadius: 1
                      }}
                    />

                  </>

                )}


              {/* STATUS */}

              <TextField
                select
                label="Status"
                size="small"

                value={
                  filters.status
                }

                onChange={
                  (e) =>
                    setFilters(
                      (f) => ({
                        ...f,

                        status:
                          e.target.value
                      })
                    )
                }

                sx={{
                  minWidth: 110,

                  bgcolor:
                    '#f5f5f5',

                  borderRadius: 1
                }}
              >

                <MenuItem
                  value="All"
                >
                  All statuses
                </MenuItem>


                {STATUS_OPTIONS.map(
                  (s) => (

                    <MenuItem
                      key={s}
                      value={s}
                    >
                      {s}
                    </MenuItem>

                  )
                )}

              </TextField>


              {/* PRIORITY */}

              <TextField
                select
                label="Priority"
                size="small"

                value={
                  filters.priority
                }

                onChange={
                  (e) =>
                    setFilters(
                      (f) => ({
                        ...f,

                        priority:
                          e.target.value
                      })
                    )
                }

                sx={{
                  minWidth: 100,

                  bgcolor:
                    '#f5f5f5',

                  borderRadius: 1
                }}
              >

                <MenuItem
                  value="All"
                >
                  All priorities
                </MenuItem>


                {PRIORITY_OPTIONS.map(
                  (p) => (

                    <MenuItem
                      key={p}
                      value={p}
                    >
                      {p}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Stack>


            {/* RIGHT FILTERS/ACTIONS */}

            <Stack
              direction={{
                xs: 'column',
                sm: 'row'
              }}
              spacing={1.5}
              alignItems="center"
              flex={1}
              minWidth={0}
              justifyContent="flex-end"
            >


              {/* ADMIN USER DROPDOWN */}

              {isAdmin && (

                <TextField
                  select

                  label="User"

                  size="small"

                  value={
                    filters.username
                  }

                  onChange={
                    (e) =>
                      setFilters(
                        (f) => ({
                          ...f,

                          username:
                            e.target.value
                        })
                      )
                  }

                  sx={{
                    minWidth: 120,

                    bgcolor:
                      '#f5f5f5',

                    borderRadius: 1
                  }}
                >

                  <MenuItem
                    value="All"
                  >
                    All users
                  </MenuItem>


                  {uniqueUsernames.map(
                    (u) => (

                      <MenuItem
                        key={u}
                        value={u}
                      >
                        {u}
                      </MenuItem>

                    )
                  )}

                </TextField>

              )}


              {/* ====================================
                  CHANGED:
                  Search shown for EVERYONE.
                  Search filters by USERNAME.
              ==================================== */}

              <TextField
                label="Search User"

                size="small"

                placeholder="Search by user..."

                value={
                  filters.search
                }

                onChange={
                  (e) =>
                    setFilters(
                      (f) => ({
                        ...f,

                        search:
                          e.target.value
                      })
                    )
                }

                sx={{
                  minWidth: 180,

                  bgcolor:
                    '#f5f5f5',

                  borderRadius: 1
                }}
              />


              {/* RESET */}

              <Tooltip
                title="Reset filters"
              >

                <IconButton
                  onClick={
                    () =>
                      setFilters({

                        dateFilterType:
                          'single',

                        singleDate:
                          '',

                        fromDate:
                          monthStart,

                        toDate:
                          today,

                        status:
                          'All',

                        priority:
                          'All',

                        search:
                          '',

                        username:
                          'All'
                      })
                  }

                  sx={{
                    border:
                      '1px solid #E4E9EC',

                    bgcolor:
                      '#f5f5f5',

                    borderRadius: 1
                  }}
                >

                  <RefreshRoundedIcon
                    fontSize="small"
                  />

                </IconButton>

              </Tooltip>


              {/* ADD */}

              <Button
                variant="contained"

                startIcon={
                  <AddRoundedIcon />
                }

                onClick={openAdd}

                sx={{
                  bgcolor:
                    PRIMARY,

                  whiteSpace:
                    'nowrap',

                  '&:hover': {
                    bgcolor:
                      PRIMARY_DARK
                  }
                }}
              >

                Add Task

              </Button>


              {/* EXPORT */}

              <Button
                variant="outlined"

                startIcon={
                  <FileDownloadRoundedIcon />
                }

                endIcon={
                  <ArrowDropDownRoundedIcon />
                }

                onClick={
                  (e) =>
                    setExportAnchorEl(
                      e.currentTarget
                    )
                }

                sx={{
                  borderColor:
                    PRIMARY,

                  color:
                    PRIMARY,

                  whiteSpace:
                    'nowrap'
                }}
              >

                Export

              </Button>

            </Stack>

          </Stack>

        </Paper>


        {/* ================= EXPORT MENU ================= */}

        <Menu
          anchorEl={
            exportAnchorEl
          }

          open={
            !!exportAnchorEl
          }

          onClose={
            () =>
              setExportAnchorEl(
                null
              )
          }

          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}

          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >

          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'today'
                )
            }
          >

            <ListItemIcon>

              <TodayRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="Today Only"
              secondary={
                dayjs(today).format(
                  'DD MMM YYYY'
                )
              }
            />

          </MenuItem>


          <Divider />


          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'week'
                )
            }
          >

            <ListItemIcon>

              <CalendarViewWeekRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="This Week"
              secondary="Monday – Sunday"
            />

          </MenuItem>


          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'month'
                )
            }
          >

            <ListItemIcon>

              <CalendarMonthRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="This Month"
            />

          </MenuItem>


          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'year'
                )
            }
          >

            <ListItemIcon>

              <EventRepeatRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="This Year"
            />

          </MenuItem>


          <Divider />


          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'custom'
                )
            }
          >

            <ListItemIcon>

              <DateRangeRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="Custom Range…"
              secondary="Pick any From – To dates"
            />

          </MenuItem>


          <MenuItem
            onClick={
              () =>
                handleExportPreset(
                  'current'
                )
            }
          >

            <ListItemIcon>

              <FileDownloadRoundedIcon
                fontSize="small"
                sx={{
                  color: PRIMARY
                }}
              />

            </ListItemIcon>

            <ListItemText
              primary="Current Filtered View"
            />

          </MenuItem>

        </Menu>


        {/* ================= CUSTOM RANGE ================= */}

        <Dialog
          open={
            rangeDialogOpen
          }

          onClose={
            () =>
              setRangeDialogOpen(
                false
              )
          }

          maxWidth="xs"

          fullWidth

          PaperProps={{
            sx: {
              borderRadius: 3
            }
          }}
        >

          <DialogTitle
            sx={{
              fontWeight: 800
            }}
          >
            Custom Export Range
          </DialogTitle>


          <Divider />


          <DialogContent
            sx={{
              pt: 3
            }}
          >

            <Stack
              spacing={2}
            >

              <TextField
                label="From"
                type="date"
                size="small"
                fullWidth

                InputLabelProps={{
                  shrink: true
                }}

                value={
                  customRange.from
                }

                onChange={
                  (e) =>
                    setCustomRange(
                      (r) => ({
                        ...r,

                        from:
                          e.target.value
                      })
                    )
                }
              />


              <TextField
                label="To"
                type="date"
                size="small"
                fullWidth

                InputLabelProps={{
                  shrink: true
                }}

                value={
                  customRange.to
                }

                onChange={
                  (e) =>
                    setCustomRange(
                      (r) => ({
                        ...r,

                        to:
                          e.target.value
                      })
                    )
                }
              />

            </Stack>

          </DialogContent>


          <Divider />


          <DialogActions
            sx={{
              p: 2
            }}
          >

            <Button
              onClick={
                () =>
                  setRangeDialogOpen(
                    false
                  )
              }

              color="inherit"
            >
              Cancel
            </Button>


            <Button
              onClick={
                handleCustomRangeExport
              }

              variant="contained"

              sx={{
                bgcolor:
                  PRIMARY,

                '&:hover': {
                  bgcolor:
                    PRIMARY_DARK
                }
              }}
            >
              Download
            </Button>

          </DialogActions>

        </Dialog>


        {/* ================= DASHBOARD ================= */}

        <Stack
          spacing={3}
        >


          {/* KPI CARDS */}

          <Grid
            container
            spacing={2}
          >

            {kpiCards.map(
              (c) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={1.5}
                  key={c.label}
                  sx={{
                    flexGrow: 1
                  }}
                >

                  <KpiCard
                    {...c}
                  />

                </Grid>

              )
            )}

          </Grid>


          {/* ================= CHARTS ================= */}

          <Stack
            direction={{
              xs: 'column',
              md: 'row'
            }}
            spacing={3}
            alignItems="stretch"
          >


            {/* STATUS */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,

                flex: 1.2,

                minWidth: 0,

                borderRadius: 3,

                border:
                  '1px solid #E9EDEF',

                boxShadow:
                  '0 1px 2px rgba(16,24,40,0.04)'
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 700
                }}
              >
                Task status breakdown
              </Typography>


              {statusBreakdown.length === 0
                ? (

                  <Box
                    sx={{
                      py: 6,

                      textAlign:
                        'center'
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      No tasks match the current filters.
                    </Typography>

                  </Box>

                )
                : (

                  <Box
                    sx={{
                      position:
                        'relative',

                      height:
                        300
                    }}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={
                            statusBreakdown
                          }

                          dataKey="value"

                          nameKey="name"

                          innerRadius={
                            70
                          }

                          outerRadius={
                            105
                          }

                          paddingAngle={
                            2
                          }

                          strokeWidth={
                            0
                          }
                        >

                          {statusBreakdown.map(
                            (entry) => (

                              <Cell
                                key={
                                  entry.name
                                }

                                fill={
                                  STATUS_COLORS[
                                    entry.name
                                  ]?.main ||
                                  '#94A3B8'
                                }
                              />

                            )
                          )}

                        </Pie>


                        <ChartTooltip
                          formatter={
                            (
                              value,
                              name
                            ) => [

                                `${value} task${value === 1 ? '' : 's'}`,

                                name
                              ]
                          }
                        />


                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                        />

                      </PieChart>

                    </ResponsiveContainer>


                    <Stack
                      sx={{
                        position:
                          'absolute',

                        top:
                          '42%',

                        left:
                          '50%',

                        transform:
                          'translate(-50%, -50%)',

                        pointerEvents:
                          'none',

                        alignItems:
                          'center'
                      }}
                    >

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800
                        }}
                      >
                        {kpis.total}
                      </Typography>


                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        total
                      </Typography>

                    </Stack>

                  </Box>

                )
              }

            </Paper>


            {/* DELAY */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,

                flex: 1.2,

                minWidth: 0,

                borderRadius: 3,

                border:
                  '1px solid #E9EDEF',

                boxShadow:
                  '0 1px 2px rgba(16,24,40,0.04)'
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 700
                }}
              >
                Delay reasons this period
              </Typography>


              {reasonBreakdown.length === 0
                ? (

                  <Box
                    sx={{
                      py: 6,
                      textAlign:
                        'center'
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      No delays recorded. 🎉
                    </Typography>

                  </Box>

                )
                : (

                  <Box
                    sx={{
                      height: 300
                    }}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={
                          reasonBreakdown
                        }

                        margin={{
                          top: 8,
                          right: 8,
                          left: -12,
                          bottom: 8
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E4E9EC"
                        />


                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11
                          }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />


                        <YAxis
                          allowDecimals={false}
                          tick={{
                            fontSize: 11
                          }}
                        />


                        <ChartTooltip
                          formatter={
                            (value) => [
                              `${value} task${value === 1 ? '' : 's'}`,
                              'Count'
                            ]
                          }
                        />


                        <Bar
                          dataKey="value"
                          radius={[
                            6,
                            6,
                            0,
                            0
                          ]}
                        >

                          {reasonBreakdown.map(
                            (
                              entry,
                              i
                            ) => (

                              <Cell
                                key={
                                  entry.name
                                }

                                fill={
                                  REASON_PALETTE[
                                  i %
                                  REASON_PALETTE.length
                                  ]
                                }
                              />

                            )
                          )}

                        </Bar>

                      </BarChart>

                    </ResponsiveContainer>

                  </Box>

                )
              }

            </Paper>


            {/* PRIORITY */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,

                flex: 0.8,

                minWidth: 220,

                borderRadius: 3,

                border:
                  '1px solid #E9EDEF',

                boxShadow:
                  '0 1px 2px rgba(16,24,40,0.04)'
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700
                }}
              >
                Priority mix
              </Typography>


              <Stack
                spacing={2.5}
              >

                {priorityBreakdown.map(
                  ({
                    name,
                    value
                  }) => {

                    const pct =
                      kpis.total
                        ? Math.round(
                          (
                            value /
                            kpis.total
                          ) * 100
                        )
                        : 0;


                    return (

                      <Box
                        key={name}
                      >

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{
                            mb: 0.5
                          }}
                        >

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >

                            <Box
                              sx={{
                                width: 9,
                                height: 9,
                                borderRadius:
                                  '50%',

                                bgcolor:
                                  PRIORITY_COLORS[
                                    name
                                  ].main
                              }}
                            />


                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight:
                                  600
                              }}
                            >
                              {name}
                            </Typography>

                          </Stack>


                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {value}
                          </Typography>

                        </Stack>


                        <Box
                          sx={{
                            height: 8,

                            borderRadius:
                              4,

                            bgcolor:
                              '#EEF1F2',

                            overflow:
                              'hidden'
                          }}
                        >

                          <Box
                            sx={{
                              height:
                                '100%',

                              width:
                                `${pct}%`,

                              bgcolor:
                                PRIORITY_COLORS[
                                  name
                                ].main,

                              borderRadius:
                                4,

                              transition:
                                'width .3s ease'
                            }}
                          />

                        </Box>

                      </Box>
                    );
                  }
                )}


                {kpis.total === 0 && (

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No tasks match the current filters.
                  </Typography>

                )}

              </Stack>

            </Paper>

          </Stack>


          {/* ================= TASK TABLE ================= */}

          <Paper
            elevation={0}
            sx={{
              overflow:
                'hidden',

              borderRadius:
                3,

              border:
                '1px solid #E9EDEF',

              boxShadow:
                '0 1px 2px rgba(16,24,40,0.04)'
            }}
          >

            <Box
              sx={{
                p: 2,
                pb: 1
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700
                }}
              >

                All tasks ({filtered.length})

              </Typography>

            </Box>


            <TableContainer
              sx={{
                maxHeight: 560
              }}
            >

              <Table
                stickyHeader
                size="small"
              >

                <TableHead>

                  <TableRow>

                    {[
                      'SR',
                      'User',
                      'Assigned By',
                      'Project',
                      'Start',
                      'Expected',
                      'Completed',
                      'Status',
                      'Priority',
                      'Time Taken',
                      'Reason',
                      'Remarks',
                      'Actions'
                    ].map(
                      (h) => (

                        <TableCell
                          key={h}

                          align={
                            h ===
                              'Actions'
                              ? 'center'
                              : 'left'
                          }

                          sx={{
                            fontWeight:
                              700,

                            color:
                              'text.secondary',

                            fontSize:
                              '0.72rem',

                            textTransform:
                              'uppercase',

                            letterSpacing:
                              '0.04em'
                          }}
                        >
                          {h}
                        </TableCell>

                      )
                    )}

                  </TableRow>

                </TableHead>


                <TableBody>


                  {filtered.length === 0 && (

                    <TableRow>

                      <TableCell
                        colSpan={13}
                      >

                        <Box
                          sx={{
                            py: 6,

                            textAlign:
                              'center'
                          }}
                        >

                          <Typography
                            color="text.secondary"
                          >
                            No tasks yet — click &ldquo;Add Task&rdquo; to create the first one.
                          </Typography>

                        </Box>

                      </TableCell>

                    </TableRow>

                  )}


                  {filtered.map(
                    (
                      t,
                      idx
                    ) => {


                      const statusColors =
                        STATUS_COLORS[
                        t.status
                        ] || {
                          main:
                            '#94A3B8',

                          bg:
                            '#F1F5F9'
                        };


                      const priorityColors =
                        PRIORITY_COLORS[
                        t.priority
                        ] || {
                          main:
                            '#94A3B8',

                          bg:
                            '#F1F5F9'
                        };


                      const isCompleted =
                        t.status ===
                        'Completed';


                      return (

                        <TableRow
                          key={t.id}

                          hover

                          sx={{
                            bgcolor:
                              idx % 2
                                ? '#FAFBFC'
                                : 'transparent'
                          }}
                        >


                          <TableCell>
                            {idx + 1}
                          </TableCell>


                          <TableCell
                            sx={{
                              fontSize:
                                '0.8rem'
                            }}
                          >
                            {t.username || '—'}
                          </TableCell>


                          <TableCell>
                            {t.assigned_by || '—'}
                          </TableCell>


                          <TableCell
                            sx={{
                              maxWidth: 200
                            }}
                          >
                            {t.project_name}
                          </TableCell>


                          <TableCell>
                            {fmt(t.start_date)}
                          </TableCell>


                          <TableCell>
                            {fmt(t.expacted_date)}
                          </TableCell>


                          <TableCell>
                            {fmt(t.completed_date)}
                          </TableCell>


                          <TableCell>

                            <Chip
                              label={t.status}

                              size="small"

                              sx={{
                                bgcolor:
                                  statusColors.bg,

                                color:
                                  statusColors.main,

                                fontWeight:
                                  700
                              }}
                            />

                          </TableCell>


                          <TableCell>

                            <Chip
                              label={t.priority}

                              size="small"

                              sx={{
                                bgcolor:
                                  priorityColors.bg,

                                color:
                                  priorityColors.main,

                                fontWeight:
                                  700
                              }}
                            />

                          </TableCell>


                          <TableCell
                            sx={{
                              whiteSpace:
                                'nowrap'
                            }}
                          >
                            {getTotalTime(t)}
                          </TableCell>


                          <TableCell>

                            {t.reason_for_delay &&
                              t.reason_for_delay !==
                              'None'

                              ? (

                                <Chip
                                  label={
                                    t.reason_for_delay
                                  }
                                  size="small"
                                  variant="outlined"
                                />

                              )

                              : '—'
                            }

                          </TableCell>


                          {/* ========================================
                              CHANGED:
                              First 4 words only.
                              Full remarks shown on hover.
                          ======================================== */}

                          <TableCell
                            sx={{
                              maxWidth: 180,
                              width: 180
                            }}
                          >

                            {t.remarks
                              ? (

                                <Tooltip
                                  title={t.remarks}
                                  arrow
                                  placement="top"
                                >

                                  <Typography
                                    variant="body2"

                                    color="text.secondary"

                                    noWrap

                                    sx={{
                                      maxWidth: 180,

                                      overflow:
                                        'hidden',

                                      textOverflow:
                                        'ellipsis',

                                      whiteSpace:
                                        'nowrap',

                                      cursor:
                                        'pointer'
                                    }}
                                  >

                                    {getShortRemarks(
                                      t.remarks,
                                      4
                                    )}

                                  </Typography>

                                </Tooltip>

                              )
                              : (

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  —
                                </Typography>

                              )
                            }

                          </TableCell>


                          {/* ACTIONS */}

                          {/* <TableCell
                            align="center"
                          >

                            <Stack
                              direction="row"
                              spacing={0.5}
                              justifyContent="center"
                            >

                              <Tooltip
                                title={
                                  isCompleted
                                    ? "Cannot edit completed tasks"
                                    : "Edit task"
                                }
                              >

                                <span>

                                  <IconButton
                                    size="small"

                                    onClick={
                                      () =>
                                        openEdit(t)
                                    }

                                    disabled={
                                      isCompleted
                                    }
                                  >

                                    <EditRoundedIcon
                                      fontSize="small"
                                    />

                                  </IconButton>

                                </span>

                              </Tooltip>


                              <IconButton
                                size="small"

                                onClick={
                                  () =>
                                    handleDelete(
                                      t.id
                                    )
                                }
                              >

                                <DeleteRoundedIcon
                                  fontSize="small"
                                  color="error"
                                />

                              </IconButton>

                            </Stack>

                          </TableCell> */}
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={0.5}
                              justifyContent="center"
                            >
                              {/* EDIT */}
                              <Tooltip
                                title={
                                  isCompleted
                                    ? "Cannot edit completed tasks"
                                    : "Edit task"
                                }
                              >
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => openEdit(t)}
                                    disabled={isCompleted}
                                  >
                                    <EditRoundedIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* DELETE */}
                              <Tooltip
                                title={
                                  isCompleted
                                    ? "Cannot delete completed tasks"
                                    : "Delete task"
                                }
                              >
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(t.id)}
                                    disabled={isCompleted}
                                  >
                                    <DeleteRoundedIcon
                                      fontSize="small"
                                      color={isCompleted ? "disabled" : "error"}
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </TableCell>

                        </TableRow>
                      );
                    }
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </Paper>

        </Stack>

      </Container>


      {/* ================= ADD / EDIT DIALOG ================= */}

      <TaskFormDialog
        open={dialogOpen}

        onClose={
          () =>
            setDialogOpen(
              false
            )
        }

        onSave={
          handleSave
        }

        initialTask={
          editingTask
        }

        currentUsername={
          currentUsername
        }
      />


      {/* ================= SNACKBAR ================= */}

      <Snackbar
        open={
          !!snack
        }

        autoHideDuration={
          3000
        }

        onClose={
          () =>
            setSnack(null)
        }

        anchorOrigin={{
          vertical:
            'bottom',

          horizontal:
            'right'
        }}
      >

        {snack && (

          <Alert
            severity={
              snack.severity
            }

            variant="filled"

            onClose={
              () =>
                setSnack(null)
            }
          >

            {snack.message}

          </Alert>

        )}

      </Snackbar>

    </Box>
  );
}

