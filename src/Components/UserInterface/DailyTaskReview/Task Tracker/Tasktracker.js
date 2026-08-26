

// /**
//  * TaskTracker.jsx
//  * ------------------------------------------------------------------
//  * A single, self-contained "Task Tracker" page — drop this file into
//  * your project (e.g. src/pages/TaskTracker.jsx) and route your
//  * sidebar's "Task Tracker" item to it. 100% frontend, no backend:
//  * data is kept in React state and persisted to localStorage.
//  *
//  * Install these dependencies if you don't already have them:
//  *   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled \
//  *               recharts exceljs file-saver dayjs uuid
//  *
//  * Usage:
//  *   import TaskTracker from './pages/TaskTracker';
//  *   <TaskTracker />
//  *
//  * CHANGE LOG (latest request):
//  *   - Removed "UST ID" field entirely.
//  *   - Added "Priority" (High / Medium / Low) — shown as a colored chip
//  *     in the table and as a colored cell in the Excel export.
//  *   - "Expected Completion Date" and "Role / Task" fields are commented
//  *     out for now (not shown in the form, table, or Excel export). The
//  *     underlying state keys are left in place (commented) so they can
//  *     be restored easily later.
//  *   - Excel export now supports Weekly / Monthly / Yearly presets plus
//  *     a fully custom From–To date range, via a dropdown menu next to
//  *     the Export button.
//  *   - General visual refresh: icons on KPI cards, softer shadows,
//  *     gradient header accent, priority filter, priority breakdown.
//  * ------------------------------------------------------------------
//  */

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
//   IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
//   TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
//   Snackbar, Alert, Menu, ListItemIcon, ListItemText,
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

// /* ============================== CONSTANTS ============================== */

// const STATUS_OPTIONS = [
//   'Not Started', 'In Progress', 'In Review', 'Testing', 'Completed', 'Delayed', 'On Hold',
// ];

// const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// const REASON_OPTIONS = [
//   'None', 'Resource Constraint', 'Dependency Delay', 'Scope Change',
//   'Client Delay', 'Technical Issue', 'Requirement Change', 'Other',
// ];

// // Status color tokens — drive the chips, charts, and Excel export alike.
// const STATUS_COLORS = {
//   'Not Started': { main: '#64748B', bg: '#F1F5F9' },
//   'In Progress': { main: '#2563EB', bg: '#EAF1FE' },
//   'In Review':   { main: '#D97706', bg: '#FEF3E2' },
//   'Testing':     { main: '#7C3AED', bg: '#F3ECFE' },
//   'Completed':   { main: '#0E9F6E', bg: '#E7F9F1' },
//   'Delayed':     { main: '#DC2626', bg: '#FDECEC' },
//   'On Hold':     { main: '#475569', bg: '#EEF1F4' },
// };

// // Priority color tokens — drive the chip in the table and the colored
// // cell fill in the Excel export.
// const PRIORITY_COLORS = {
//   High:   { main: '#DC2626', bg: '#FDECEC' },
//   Medium: { main: '#D97706', bg: '#FEF3E2' },
//   Low:    { main: '#0E9F6E', bg: '#E7F9F1' },
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

// const PRIMARY = '#0E7C7B'; // matches the teal sidebar in your app
// const PRIMARY_DARK = '#0A5D5C';

// const STORAGE_KEY = 'task-tracker.tasks.v2';

// const emptyForm = {
//   date: new Date().toISOString().slice(0, 10),
//   name: '',
//   projectName: '',
//   // roleTask: '', // commented out for now — re-enable when needed
//   startDate: '',
//   // expectedDate: '', // commented out for now — re-enable when needed
//   completedDate: '',
//   status: 'Not Started',
//   priority: 'Medium',
//   reasonForDelay: 'None',
//   remarks: '',
// };

// const sampleTasks = [
// //   { id: 'seed-1', date: '2026-08-01', name: 'Rahul Sharma', projectName: 'Client Portal Revamp', startDate: '2026-07-01', completedDate: '2026-07-24', status: 'Completed', priority: 'Medium', reasonForDelay: 'None', remarks: 'Delivered ahead of schedule' },
// //   { id: 'seed-2', date: '2026-08-01', name: 'Priya Nair', projectName: 'Payment Gateway Integration', startDate: '2026-07-10', completedDate: '', status: 'In Progress', priority: 'High', reasonForDelay: 'None', remarks: 'On track, ~70% complete' },
// ];

// /* ============================== HELPERS ============================== */

// function getTotalTime(task) {
//   if (!task.startDate) return '—';
//   const start = dayjs(task.startDate);
//   if (task.completedDate) {
//     const days = dayjs(task.completedDate).diff(start, 'day');
//     return `${days} day${days === 1 ? '' : 's'}`;
//   }
//   const days = dayjs().diff(start, 'day');
//   return `${days} day${days === 1 ? '' : 's'} (ongoing)`;
// }

// function filterTasks(tasks, { from, to, status, priority, search }) {
//   return tasks.filter((t) => {
//     if (from && t.startDate && dayjs(t.startDate).isBefore(dayjs(from), 'day')) return false;
//     if (to && t.startDate && dayjs(t.startDate).isAfter(dayjs(to), 'day')) return false;
//     if (status && status !== 'All' && t.status !== status) return false;
//     if (priority && priority !== 'All' && t.priority !== priority) return false;
//     if (search) {
//       const q = search.toLowerCase();
//       const hay = `${t.name} ${t.projectName}`.toLowerCase();
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
//     if (t.reasonForDelay && t.reasonForDelay !== 'None') counts[t.reasonForDelay] = (counts[t.reasonForDelay] || 0) + 1;
//   });
//   return Object.entries(counts).map(([name, value]) => ({ name, value }));
// }

// function computePriorityBreakdown(tasks) {
//   return PRIORITY_OPTIONS.map((p) => ({ name: p, value: tasks.filter((t) => t.priority === p).length }));
// }

// function fmt(d) { return d ? dayjs(d).format('DD MMM YYYY') : '—'; }

// /* ========================= COLORFUL EXCEL EXPORT ========================= */

// async function exportTasksToExcel(tasks, filename) {
//   const STATUS_FILL = {
//     'Not Started': { fg: 'FFD9D9D9', font: 'FF595959' },
//     'In Progress': { fg: 'FFBDD7EE', font: 'FF1F4E78' },
//     'In Review':   { fg: 'FFFFE9B3', font: 'FF7F6000' },
//     'Testing':     { fg: 'FFE3D2FB', font: 'FF5A2D9C' },
//     'Completed':   { fg: 'FFC6EFCE', font: 'FF006100' },
//     'Delayed':     { fg: 'FFFFC7CE', font: 'FF9C0006' },
//     'On Hold':     { fg: 'FFE4DFEC', font: 'FF5F497A' },
//   };
//   const PRIORITY_FILL = {
//     High:   { fg: 'FFFFC7CE', font: 'FF9C0006' },
//     Medium: { fg: 'FFFFE9B3', font: 'FF7F6000' },
//     Low:    { fg: 'FFC6EFCE', font: 'FF006100' },
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

//   // ---- Sheet 1: Dashboard summary ----
//   const summary = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
//   summary.columns = [{ width: 4 }, { width: 26 }, { width: 16 }, { width: 4 }, { width: 26 }, { width: 16 }];
//   summary.mergeCells('B2:F2');
//   summary.getCell('B2').value = 'Task Tracker — Summary Report';
//   summary.getCell('B2').font = { name: 'Arial', size: 18, bold: true, color: { argb: NAVY } };
//   summary.mergeCells('B3:F3');
//   summary.getCell('B3').value = `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;
//   summary.getCell('B3').font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };

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

//   let priorityRow = statusRow + 2;
//   summary.getCell(`E${priorityRow}`).value = 'Priority Breakdown';
//   summary.getCell(`E${priorityRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
//   priorityRow += 1;
//   ['Priority', 'Count'].forEach((h, i) => {
//     const cell = summary.getCell(priorityRow, 5 + i);
//     cell.value = h;
//     cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
//     cell.border = border;
//   });
//   priorityRow += 1;
//   computePriorityBreakdown(tasks).forEach(({ name, value }) => {
//     const fill = PRIORITY_FILL[name] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const nameCell = summary.getCell(`E${priorityRow}`);
//     nameCell.value = name;
//     nameCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
//     nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
//     nameCell.border = border;
//     const countCell = summary.getCell(`F${priorityRow}`);
//     countCell.value = value;
//     countCell.alignment = { horizontal: 'center' };
//     countCell.border = border;
//     priorityRow += 1;
//   });

//   let reasonRow = Math.max(r, priorityRow) + 2;
//   summary.getCell(`B${reasonRow}`).value = 'Delay Reason Breakdown';
//   summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
//   reasonRow += 1;
//   ['Reason', 'Count'].forEach((h, i) => {
//     const cell = summary.getCell(reasonRow, 2 + i);
//     cell.value = h;
//     cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
//     cell.border = border;
//   });
//   reasonRow += 1;
//   const reasons = computeReasonBreakdown(tasks);
//   if (reasons.length === 0) {
//     summary.getCell(`B${reasonRow}`).value = 'No delays recorded';
//     summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };
//   } else {
//     reasons.forEach(({ name, value }) => {
//       summary.getCell(`B${reasonRow}`).value = name;
//       summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10 };
//       summary.getCell(`B${reasonRow}`).border = border;
//       summary.getCell(`C${reasonRow}`).value = value;
//       summary.getCell(`C${reasonRow}`).alignment = { horizontal: 'center' };
//       summary.getCell(`C${reasonRow}`).border = border;
//       reasonRow += 1;
//     });
//   }

//   // ---- Sheet 2: Task Data ----
//   // NOTE: "UST ID" removed. "Expected Completion Date" and "Role/Task"
//   // are intentionally left out of the export for now (see change log).
//   const ws = wb.addWorksheet('Task Data', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });
//   const headers = ['SR No', 'Date', 'Name', 'Project Name', 'Project Start Date',
//     'Completed Date', 'Status', 'Total Time Taken', 'Priority', 'Reason for Delay', 'Remarks'];
//   ws.columns = [{ width: 7 }, { width: 12 }, { width: 20 }, { width: 28 },
//     { width: 16 }, { width: 16 }, { width: 14 }, { width: 18 }, { width: 12 }, { width: 20 }, { width: 30 }];

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

//   tasks.forEach((t, idx) => {
//     const row = ws.getRow(idx + 2);
//     const values = [
//       idx + 1,
//       t.date ? dayjs(t.date).format('DD-MMM-YYYY') : '',
//       t.name,
//       t.projectName,
//       t.startDate ? dayjs(t.startDate).format('DD-MMM-YYYY') : '',
//       t.completedDate ? dayjs(t.completedDate).format('DD-MMM-YYYY') : '',
//       t.status,
//       getTotalTime(t),
//       t.priority,
//       t.reasonForDelay,
//       t.remarks,
//     ];
//     values.forEach((v, i) => {
//       const cell = row.getCell(i + 1);
//       cell.value = v;
//       cell.font = { name: 'Arial', size: 10 };
//       cell.border = border;
//       cell.alignment = { vertical: 'middle', wrapText: i === 10, horizontal: [0, 6, 8].includes(i) ? 'center' : 'left' };
//     });
//     if (idx % 2 === 1) {
//       for (let c = 1; c <= headers.length; c++) {
//         const cell = row.getCell(c);
//         if (!cell.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8F9' } };
//       }
//     }
//     // Status column (index 6 -> column 7)
//     const statusFill = STATUS_FILL[t.status] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const statusCell = row.getCell(7);
//     statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusFill.fg } };
//     statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: statusFill.font } };
//     statusCell.alignment = { horizontal: 'center' };
//     // Priority column (index 8 -> column 9)
//     const priorityFill = PRIORITY_FILL[t.priority] || { fg: 'FFEFEFEF', font: 'FF333333' };
//     const priorityCell = row.getCell(9);
//     priorityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: priorityFill.fg } };
//     priorityCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: priorityFill.font } };
//     priorityCell.alignment = { horizontal: 'center' };
//   });

//   ws.autoFilter = { from: 'A1', to: `K${tasks.length + 1}` };

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

// function TaskFormDialog({ open, onClose, onSave, initialTask }) {
//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (open) {
//       setForm(initialTask ? { ...initialTask } : { ...emptyForm, date: new Date().toISOString().slice(0, 10) });
//       setErrors({});
//     }
//   }, [open, initialTask]);

//   const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = 'Required';
//     if (!form.projectName.trim()) e.projectName = 'Required';
//     if (!form.startDate) e.startDate = 'Required';
//     if (form.completedDate && form.startDate && form.completedDate < form.startDate) e.completedDate = 'Cannot be before start date';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => { if (validate()) onSave(form); };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
//       <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Typography variant="h6" sx={{ fontWeight: 800 }}>{initialTask ? 'Edit Task' : 'Add Task'}</Typography>
//         <IconButton size="small" onClick={onClose}><CloseRoundedIcon /></IconButton>
//       </DialogTitle>
//       <Divider />
//       <DialogContent sx={{ pt: 3 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Name" fullWidth size="small" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Project Name" fullWidth size="small" value={form.projectName} onChange={handleChange('projectName')} error={!!errors.projectName} helperText={errors.projectName} />
//           </Grid>

//           {/* Role / Task — commented out for now, re-enable when needed
//           <Grid item xs={12}>
//             <TextField label="Role / Task" fullWidth size="small" value={form.roleTask} onChange={handleChange('roleTask')} />
//           </Grid>
//           */}

//           <Grid item xs={12} sm={6}>
//             <TextField label="Project Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.startDate} onChange={handleChange('startDate')} error={!!errors.startDate} helperText={errors.startDate} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="Project Completed By" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.completedDate} onChange={handleChange('completedDate')} error={!!errors.completedDate} helperText={errors.completedDate} />
//           </Grid>

//           {/* Expected Completion Date — commented out for now, re-enable when needed
//           <Grid item xs={12} sm={6}>
//             <TextField label="Expected Completion" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.expectedDate} onChange={handleChange('expectedDate')} />
//           </Grid>
//           */}

//           <Grid item xs={12} sm={4}>
//             <TextField select label="Status" fullWidth size="small" value={form.status} onChange={handleChange('status')}>
//               {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField select label="Priority" fullWidth size="small" value={form.priority} onChange={handleChange('priority')}>
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
//             <TextField select label="Reason for Delay" fullWidth size="small" value={form.reasonForDelay} onChange={handleChange('reasonForDelay')}>
//               {REASON_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//             </TextField>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Remarks" fullWidth multiline minRows={2} size="small" value={form.remarks} onChange={handleChange('remarks')} />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <Divider />
//       <DialogActions sx={{ p: 2 }}>
//         <Button onClick={onClose} color="inherit">Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK } }}>
//           {initialTask ? 'Save changes' : 'Add task'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// /* ============================== MAIN COMPONENT ============================== */

// export default function TaskTracker() {
//   const [tasks, setTasks] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw) : sampleTasks;
//     } catch {
//       return sampleTasks;
//     }
//   });
//   const [filters, setFilters] = useState({ from: '', to: '', status: 'All', priority: 'All', search: '' });
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [snack, setSnack] = useState(null);

//   // Export menu + custom range dialog
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
//   const [customRange, setCustomRange] = useState({ from: '', to: '' });

//   useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

//   const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
//   const kpis = useMemo(() => computeKpis(filtered), [filtered]);
//   const statusBreakdown = useMemo(() => computeStatusBreakdown(filtered), [filtered]);
//   const reasonBreakdown = useMemo(() => computeReasonBreakdown(filtered), [filtered]);
//   const priorityBreakdown = useMemo(() => computePriorityBreakdown(filtered), [filtered]);

//   const openAdd = () => { setEditingTask(null); setDialogOpen(true); };
//   const openEdit = (t) => { setEditingTask(t); setDialogOpen(true); };

//   const handleSave = (form) => {
//     if (editingTask) {
//       setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...form, id: editingTask.id } : t)));
//       setSnack({ severity: 'success', message: 'Task updated.' });
//     } else {
//       setTasks((prev) => [...prev, { ...form, id: uuidv4() }]);
//       setSnack({ severity: 'success', message: 'Task added.' });
//     }
//     setDialogOpen(false);
//   };

//   const handleDelete = (id) => {
//     setTasks((prev) => prev.filter((t) => t.id !== id));
//     setSnack({ severity: 'info', message: 'Task deleted.' });
//   };

//   /* ---------------------- Export: presets + custom range ---------------------- */

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
//     if (!t.startDate) return false;
//     if (from && dayjs(t.startDate).isBefore(dayjs(from), 'day')) return false;
//     if (to && dayjs(t.startDate).isAfter(dayjs(to), 'day')) return false;
//     return true;
//   });

//   const handleExportPreset = async (type) => {
//     setExportAnchorEl(null);
//     const now = dayjs();
//     if (type === 'current') {
//       await doExport(filtered, 'Current View');
//       return;
//     }
//     if (type === 'custom') {
//       setCustomRange({ from: filters.from || now.startOf('month').format('YYYY-MM-DD'), to: filters.to || now.format('YYYY-MM-DD') });
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

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#F3F6F7', py: { xs: 2, md: 4 } }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 2, md: 3 }, mb: 3, borderRadius: 4, border: '1px solid #E9EDEF',
//             background: `linear-gradient(120deg, ${PRIMARY} 0%, #12A39A 55%, #1AC2A4 100%)`,
//             color: '#fff', boxShadow: '0 10px 24px rgba(14,124,123,0.18)',
//           }}
//         >
//           <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 800 }}>Task Tracker</Typography>
//               <Typography variant="body2" sx={{ opacity: 0.85 }}>Team work status &amp; analytics</Typography>
//             </Box>
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} flexWrap="wrap"
//               sx={{ bgcolor: 'rgba(255,255,255,0.94)', p: 1.25, borderRadius: 3 }}>
//               <TextField label="From" type="date" size="small" InputLabelProps={{ shrink: true }}
//                 value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} sx={{ width: 145, bgcolor: '#fff', borderRadius: 1 }} />
//               <TextField label="To" type="date" size="small" InputLabelProps={{ shrink: true }}
//                 value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} sx={{ width: 145, bgcolor: '#fff', borderRadius: 1 }} />
//               <TextField select label="Status" size="small" value={filters.status}
//                 onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} sx={{ width: 140, bgcolor: '#fff', borderRadius: 1 }}>
//                 <MenuItem value="All">All statuses</MenuItem>
//                 {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//               </TextField>
//               <TextField select label="Priority" size="small" value={filters.priority}
//                 onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} sx={{ width: 130, bgcolor: '#fff', borderRadius: 1 }}>
//                 <MenuItem value="All">All priorities</MenuItem>
//                 {PRIORITY_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
//               </TextField>
//               <TextField label="Search" size="small" placeholder="Name, project…" value={filters.search}
//                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} sx={{ width: 160, bgcolor: '#fff', borderRadius: 1 }} />
//               <Tooltip title="Reset filters">
//                 <IconButton onClick={() => setFilters({ from: '', to: '', status: 'All', priority: 'All', search: '' })} sx={{ border: '1px solid #E4E9EC', bgcolor: '#fff' }}>
//                   <RefreshRoundedIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//               <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadRoundedIcon />}
//                 endIcon={<ArrowDropDownRoundedIcon />}
//                 onClick={(e) => setExportAnchorEl(e.currentTarget)}
//                 sx={{ borderColor: PRIMARY, color: PRIMARY, whiteSpace: 'nowrap' }}
//               >
//                 Export Excel
//               </Button>
//               <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}
//                 sx={{ bgcolor: PRIMARY, whiteSpace: 'nowrap', '&:hover': { bgcolor: PRIMARY_DARK } }}>
//                 Add Task
//               </Button>
//             </Stack>
//           </Stack>
//         </Paper>

//         {/* Export menu */}
//         <Menu anchorEl={exportAnchorEl} open={!!exportAnchorEl} onClose={() => setExportAnchorEl(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
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

//         {/* Custom range dialog */}
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
//           {/* KPI cards */}
//           <Grid container spacing={2}>
//             {kpiCards.map((c) => (
//               <Grid item xs={12} sm={6} md={3} lg={1.5} key={c.label} sx={{ flexGrow: 1 }}>
//                 <KpiCard {...c} />
//               </Grid>
//             ))}
//           </Grid>

//           {/* Charts */}
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

//           {/* Table */}
//           <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
//             <Box sx={{ p: 2, pb: 1 }}>
//               <Typography variant="h6" sx={{ fontWeight: 700 }}>All tasks ({filtered.length})</Typography>
//             </Box>
//             <TableContainer sx={{ maxHeight: 560 }}>
//               <Table stickyHeader size="small">
//                 <TableHead>
//                   <TableRow>
//                     {['SR', 'Name', 'Project', 'Start', 'Completed',
//                       'Status', 'Priority', 'Time Taken', 'Reason for Delay', 'Remarks', 'Actions'].map((h) => (
//                       <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
//                         sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
//                         {h}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filtered.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={11}>
//                         <Box sx={{ py: 6, textAlign: 'center' }}>
//                           <Typography color="text.secondary">No tasks yet — click &ldquo;Add Task&rdquo; to create the first one.</Typography>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                   {filtered.map((t, idx) => {
//                     const statusColors = STATUS_COLORS[t.status] || { main: '#94A3B8', bg: '#F1F5F9' };
//                     const priorityColors = PRIORITY_COLORS[t.priority] || { main: '#94A3B8', bg: '#F1F5F9' };
//                     return (
//                       <TableRow key={t.id} hover sx={{ bgcolor: idx % 2 ? '#FAFBFC' : 'transparent' }}>
//                         <TableCell>{idx + 1}</TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
//                         <TableCell sx={{ maxWidth: 200 }}>{t.projectName}</TableCell>
//                         <TableCell>{fmt(t.startDate)}</TableCell>
//                         <TableCell>{fmt(t.completedDate)}</TableCell>
//                         <TableCell>
//                           <Chip label={t.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.main, fontWeight: 700 }} />
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={t.priority} size="small" sx={{ bgcolor: priorityColors.bg, color: priorityColors.main, fontWeight: 700 }} />
//                         </TableCell>
//                         <TableCell sx={{ whiteSpace: 'nowrap' }}>{getTotalTime(t)}</TableCell>
//                         <TableCell>
//                           {t.reasonForDelay && t.reasonForDelay !== 'None' ? <Chip label={t.reasonForDelay} size="small" variant="outlined" /> : '—'}
//                         </TableCell>
//                         <TableCell sx={{ maxWidth: 200 }}>
//                           <Typography variant="body2" color="text.secondary" noWrap title={t.remarks}>{t.remarks || '—'}</Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Stack direction="row" spacing={0.5} justifyContent="center">
//                             <IconButton size="small" onClick={() => openEdit(t)}><EditRoundedIcon fontSize="small" /></IconButton>
//                             <IconButton size="small" onClick={() => handleDelete(t.id)}><DeleteRoundedIcon fontSize="small" color="error" /></IconButton>
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

//       <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} initialTask={editingTask} />

//       <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         {snack && <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>{snack.message}</Alert>}
//       </Snackbar>
//     </Box>
//   );
// }


/**
 * TaskTracker.jsx
 * ------------------------------------------------------------------
 * A single, self-contained "Task Tracker" page — drop this file into
 * your project (e.g. src/pages/TaskTracker.jsx) and route your
 * sidebar's "Task Tracker" item to it. 100% frontend, no backend,
 * and no persistence layer — all data lives only in memory on the
 * dashboard for the current session (see change log below).
 *
 * Install these dependencies if you don't already have them:
 *   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled \
 *               recharts exceljs file-saver dayjs uuid
 *
 * Usage:
 *   import TaskTracker from './pages/TaskTracker';
 *   <TaskTracker />
 *
 * CHANGE LOG (latest request):
 *   - Added "Assigned By" field — shown in the Add/Edit form, the
 *     table, and the Excel export.
 *   - Removed localStorage persistence entirely. All task data now
 *     lives purely in React state ("dashboard only" / no backend,
 *     no browser storage). Data resets on page reload — this is
 *     intentional per the latest request.
 *   - Removed the "From" / "To" date range filter. Replaced with a
 *     single "Filter by Date" picker so you can still look back at
 *     any specific previous date's tasks; leave it blank to see
 *     everything (past and present).
 *   - Added a live "Today" date display in the header, plus a
 *     dedicated "Today Only" export option in the Export Excel menu
 *     that downloads ONLY tasks dated today (nothing else).
 *   - Removed "UST ID" field entirely (carried over from before).
 *   - "Expected Completion Date" and "Role / Task" fields remain
 *     commented out (not shown in the form, table, or Excel export).
 *   - Excel export still supports Weekly / Monthly / Yearly presets
 *     plus a fully custom From–To date range, via the Export menu.
 * ------------------------------------------------------------------
 */

import React, { useMemo, useState } from 'react';
import {
  Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
  IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Snackbar, Alert, Menu, ListItemIcon, ListItemText,
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
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/* ============================== CONSTANTS ============================== */

const STATUS_OPTIONS = [
  'Not Started', 'In Progress', 'In Review', 'Testing', 'Completed', 'Delayed', 'On Hold',
];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const REASON_OPTIONS = [
  'None', 'Resource Constraint', 'Dependency Delay', 'Scope Change',
  'Client Delay', 'Technical Issue', 'Requirement Change', 'Other',
];

// Status color tokens — drive the chips, charts, and Excel export alike.
const STATUS_COLORS = {
  'Not Started': { main: '#64748B', bg: '#F1F5F9' },
  'In Progress': { main: '#2563EB', bg: '#EAF1FE' },
  'In Review':   { main: '#D97706', bg: '#FEF3E2' },
  'Testing':     { main: '#7C3AED', bg: '#F3ECFE' },
  'Completed':   { main: '#0E9F6E', bg: '#E7F9F1' },
  'Delayed':     { main: '#DC2626', bg: '#FDECEC' },
  'On Hold':     { main: '#475569', bg: '#EEF1F4' },
};

// Priority color tokens — drive the chip in the table and the colored
// cell fill in the Excel export.
const PRIORITY_COLORS = {
  High:   { main: '#DC2626', bg: '#FDECEC' },
  Medium: { main: '#D97706', bg: '#FEF3E2' },
  Low:    { main: '#0E9F6E', bg: '#E7F9F1' },
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

const REASON_PALETTE = ['#0E7C7B', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#0EA5E9', '#64748B', '#B45309'];

const PRIMARY = '#0E7C7B'; // matches the teal sidebar in your app
const PRIMARY_DARK = '#0A5D5C';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  name: '',
  assignedBy: '',
  projectName: '',
  // roleTask: '', // commented out for now — re-enable when needed
  startDate: '',
  // expectedDate: '', // commented out for now — re-enable when needed
  completedDate: '',
  status: 'Not Started',
  priority: 'Medium',
  reasonForDelay: 'None',
  remarks: '',
};

// No sample/seed data — dashboard starts empty every session since
// nothing is persisted (see change log above).
const sampleTasks = [];

/* ============================== HELPERS ============================== */

function getTotalTime(task) {
  if (!task.startDate) return '—';
  const start = dayjs(task.startDate);
  if (task.completedDate) {
    const days = dayjs(task.completedDate).diff(start, 'day');
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  const days = dayjs().diff(start, 'day');
  return `${days} day${days === 1 ? '' : 's'} (ongoing)`;
}

// Filters now operate on a single optional "date" (the task's entry
// date) instead of a from/to range, so you can look back at any one
// previous date's tasks, or leave it blank to see everything.
function filterTasks(tasks, { date, status, priority, search }) {
  return tasks.filter((t) => {
    if (date && t.date !== date) return false;
    if (status && status !== 'All' && t.status !== status) return false;
    if (priority && priority !== 'All' && t.priority !== priority) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${t.name} ${t.assignedBy} ${t.projectName}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function computeKpis(tasks) {
  const total = tasks.length;
  const counts = {};
  tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
  const completed = counts['Completed'] || 0;
  const completionPct = total ? Math.round((completed / total) * 100) : 0;
  return { total, counts, completed, completionPct };
}

function computeStatusBreakdown(tasks) {
  return STATUS_OPTIONS.map((s) => ({ name: s, value: tasks.filter((t) => t.status === s).length })).filter((d) => d.value > 0);
}

function computeReasonBreakdown(tasks) {
  const counts = {};
  tasks.forEach((t) => {
    if (t.reasonForDelay && t.reasonForDelay !== 'None') counts[t.reasonForDelay] = (counts[t.reasonForDelay] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function computePriorityBreakdown(tasks) {
  return PRIORITY_OPTIONS.map((p) => ({ name: p, value: tasks.filter((t) => t.priority === p).length }));
}

function fmt(d) { return d ? dayjs(d).format('DD MMM YYYY') : '—'; }

/* ========================= COLORFUL EXCEL EXPORT ========================= */

async function exportTasksToExcel(tasks, filename) {
  const STATUS_FILL = {
    'Not Started': { fg: 'FFD9D9D9', font: 'FF595959' },
    'In Progress': { fg: 'FFBDD7EE', font: 'FF1F4E78' },
    'In Review':   { fg: 'FFFFE9B3', font: 'FF7F6000' },
    'Testing':     { fg: 'FFE3D2FB', font: 'FF5A2D9C' },
    'Completed':   { fg: 'FFC6EFCE', font: 'FF006100' },
    'Delayed':     { fg: 'FFFFC7CE', font: 'FF9C0006' },
    'On Hold':     { fg: 'FFE4DFEC', font: 'FF5F497A' },
  };
  const PRIORITY_FILL = {
    High:   { fg: 'FFFFC7CE', font: 'FF9C0006' },
    Medium: { fg: 'FFFFE9B3', font: 'FF7F6000' },
    Low:    { fg: 'FFC6EFCE', font: 'FF006100' },
  };
  const NAVY = 'FF1F4E78';
  const WHITE = 'FFFFFFFF';
  const border = {
    top: { style: 'thin', color: { argb: 'FFB7B7B7' } }, left: { style: 'thin', color: { argb: 'FFB7B7B7' } },
    bottom: { style: 'thin', color: { argb: 'FFB7B7B7' } }, right: { style: 'thin', color: { argb: 'FFB7B7B7' } },
  };

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Task Tracker';
  wb.created = new Date();

  // ---- Sheet 1: Dashboard summary ----
  const summary = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
  summary.columns = [{ width: 4 }, { width: 26 }, { width: 16 }, { width: 4 }, { width: 26 }, { width: 16 }];
  summary.mergeCells('B2:F2');
  summary.getCell('B2').value = 'Task Tracker — Summary Report';
  summary.getCell('B2').font = { name: 'Arial', size: 18, bold: true, color: { argb: NAVY } };
  summary.mergeCells('B3:F3');
  summary.getCell('B3').value = `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;
  summary.getCell('B3').font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };

  const kpis = computeKpis(tasks);
  let r = 5;
  summary.getCell(`B${r}`).value = 'Key Metrics';
  summary.getCell(`B${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  r += 1;
  [['Total Tasks', kpis.total], ['Completed', kpis.completed], ['Completion %', `${kpis.completionPct}%`]]
    .forEach(([label, value]) => {
      summary.getCell(`B${r}`).value = label;
      summary.getCell(`B${r}`).font = { name: 'Arial', size: 10 };
      summary.getCell(`C${r}`).value = value;
      summary.getCell(`C${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
      r += 1;
    });

  let statusRow = 5;
  summary.getCell(`E${statusRow}`).value = 'Status Breakdown';
  summary.getCell(`E${statusRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  statusRow += 1;
  ['Status', 'Count'].forEach((h, i) => {
    const cell = summary.getCell(statusRow, 5 + i);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.border = border;
  });
  statusRow += 1;
  computeStatusBreakdown(tasks).forEach(({ name, value }) => {
    const fill = STATUS_FILL[name] || { fg: 'FFEFEFEF', font: 'FF333333' };
    const nameCell = summary.getCell(`E${statusRow}`);
    nameCell.value = name;
    nameCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
    nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
    nameCell.border = border;
    const countCell = summary.getCell(`F${statusRow}`);
    countCell.value = value;
    countCell.alignment = { horizontal: 'center' };
    countCell.border = border;
    statusRow += 1;
  });

  let priorityRow = statusRow + 2;
  summary.getCell(`E${priorityRow}`).value = 'Priority Breakdown';
  summary.getCell(`E${priorityRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  priorityRow += 1;
  ['Priority', 'Count'].forEach((h, i) => {
    const cell = summary.getCell(priorityRow, 5 + i);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.border = border;
  });
  priorityRow += 1;
  computePriorityBreakdown(tasks).forEach(({ name, value }) => {
    const fill = PRIORITY_FILL[name] || { fg: 'FFEFEFEF', font: 'FF333333' };
    const nameCell = summary.getCell(`E${priorityRow}`);
    nameCell.value = name;
    nameCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
    nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
    nameCell.border = border;
    const countCell = summary.getCell(`F${priorityRow}`);
    countCell.value = value;
    countCell.alignment = { horizontal: 'center' };
    countCell.border = border;
    priorityRow += 1;
  });

  let reasonRow = Math.max(r, priorityRow) + 2;
  summary.getCell(`B${reasonRow}`).value = 'Delay Reason Breakdown';
  summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  reasonRow += 1;
  ['Reason', 'Count'].forEach((h, i) => {
    const cell = summary.getCell(reasonRow, 2 + i);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.border = border;
  });
  reasonRow += 1;
  const reasons = computeReasonBreakdown(tasks);
  if (reasons.length === 0) {
    summary.getCell(`B${reasonRow}`).value = 'No delays recorded';
    summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };
  } else {
    reasons.forEach(({ name, value }) => {
      summary.getCell(`B${reasonRow}`).value = name;
      summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10 };
      summary.getCell(`B${reasonRow}`).border = border;
      summary.getCell(`C${reasonRow}`).value = value;
      summary.getCell(`C${reasonRow}`).alignment = { horizontal: 'center' };
      summary.getCell(`C${reasonRow}`).border = border;
      reasonRow += 1;
    });
  }

  // ---- Sheet 2: Task Data ----
  // NOTE: "UST ID" removed. "Expected Completion Date" and "Role/Task"
  // are intentionally left out of the export for now (see change log).
  // "Assigned By" is now included.
  const ws = wb.addWorksheet('Task Data', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });
  const headers = ['SR No', 'Date', 'Name', 'Assigned By', 'Project Name', 'Project Start Date',
    'Completed Date', 'Status', 'Total Time Taken', 'Priority', 'Reason for Delay', 'Remarks'];
  ws.columns = [{ width: 7 }, { width: 12 }, { width: 20 }, { width: 18 }, { width: 28 },
    { width: 16 }, { width: 16 }, { width: 14 }, { width: 18 }, { width: 12 }, { width: 20 }, { width: 30 }];

  const headerRow = ws.getRow(1);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = border;
  });
  headerRow.height = 24;

  // Column indices (1-based) for the fixed-fill cells below.
  const STATUS_COL = 8;
  const PRIORITY_COL = 10;
  const REMARKS_INDEX = 11; // 0-based index into `values` for wrapText/alignment

  tasks.forEach((t, idx) => {
    const row = ws.getRow(idx + 2);
    const values = [
      idx + 1,
      t.date ? dayjs(t.date).format('DD-MMM-YYYY') : '',
      t.name,
      t.assignedBy,
      t.projectName,
      t.startDate ? dayjs(t.startDate).format('DD-MMM-YYYY') : '',
      t.completedDate ? dayjs(t.completedDate).format('DD-MMM-YYYY') : '',
      t.status,
      getTotalTime(t),
      t.priority,
      t.reasonForDelay,
      t.remarks,
    ];
    values.forEach((v, i) => {
      const cell = row.getCell(i + 1);
      cell.value = v;
      cell.font = { name: 'Arial', size: 10 };
      cell.border = border;
      cell.alignment = { vertical: 'middle', wrapText: i === REMARKS_INDEX, horizontal: [0, 7, 9].includes(i) ? 'center' : 'left' };
    });
    if (idx % 2 === 1) {
      for (let c = 1; c <= headers.length; c++) {
        const cell = row.getCell(c);
        if (!cell.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8F9' } };
      }
    }
    // Status column
    const statusFill = STATUS_FILL[t.status] || { fg: 'FFEFEFEF', font: 'FF333333' };
    const statusCell = row.getCell(STATUS_COL);
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusFill.fg } };
    statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: statusFill.font } };
    statusCell.alignment = { horizontal: 'center' };
    // Priority column
    const priorityFill = PRIORITY_FILL[t.priority] || { fg: 'FFEFEFEF', font: 'FF333333' };
    const priorityCell = row.getCell(PRIORITY_COL);
    priorityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: priorityFill.fg } };
    priorityCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: priorityFill.font } };
    priorityCell.alignment = { horizontal: 'center' };
  });

  ws.autoFilter = { from: 'A1', to: `L${tasks.length + 1}` };

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

/* ============================== SUBCOMPONENTS ============================== */

function KpiCard({ label, value, color }) {
  const Icon = KPI_ICONS[label] || AssignmentRoundedIcon;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25, height: '100%', borderRadius: 3, border: '1px solid #E9EDEF',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFDFD 100%)',
        boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
        transition: 'transform .15s ease, box-shadow .15s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(16,24,40,0.08)' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
        <Box sx={{
          width: 34, height: 34, borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', bgcolor: `${color}1A`,
        }}>
          <Icon sx={{ fontSize: 18, color }} />
        </Box>
      </Stack>
      <Typography variant="h4" sx={{ mt: 1.5, mb: 1, fontWeight: 800 }}>{value}</Typography>
      <Box sx={{ height: 4, borderRadius: 2, bgcolor: color, width: '55%' }} />
    </Paper>
  );
}

function TaskFormDialog({ open, onClose, onSave, initialTask }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (open) {
      setForm(initialTask ? { ...initialTask } : { ...emptyForm, date: new Date().toISOString().slice(0, 10) });
      setErrors({});
    }
  }, [open, initialTask]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.assignedBy.trim()) e.assignedBy = 'Required';
    if (!form.projectName.trim()) e.projectName = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (form.completedDate && form.startDate && form.completedDate < form.startDate) e.completedDate = 'Cannot be before start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>{initialTask ? 'Edit Task' : 'Add Task'}</Typography>
        <IconButton size="small" onClick={onClose}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" fullWidth size="small" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Assigned By" fullWidth size="small" value={form.assignedBy} onChange={handleChange('assignedBy')} error={!!errors.assignedBy} helperText={errors.assignedBy} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Project Name" fullWidth size="small" value={form.projectName} onChange={handleChange('projectName')} error={!!errors.projectName} helperText={errors.projectName} />
          </Grid>

          {/* Role / Task — commented out for now, re-enable when needed
          <Grid item xs={12}>
            <TextField label="Role / Task" fullWidth size="small" value={form.roleTask} onChange={handleChange('roleTask')} />
          </Grid>
          */}

          <Grid item xs={12} sm={6}>
            <TextField label="Project Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.startDate} onChange={handleChange('startDate')} error={!!errors.startDate} helperText={errors.startDate} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Project Completed By" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.completedDate} onChange={handleChange('completedDate')} error={!!errors.completedDate} helperText={errors.completedDate} />
          </Grid>

          {/* Expected Completion Date — commented out for now, re-enable when needed
          <Grid item xs={12} sm={6}>
            <TextField label="Expected Completion" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.expectedDate} onChange={handleChange('expectedDate')} />
          </Grid>
          */}

          <Grid item xs={12} sm={4}>
            <TextField select label="Status" fullWidth size="small" value={form.status} onChange={handleChange('status')}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select label="Priority" fullWidth size="small" value={form.priority} onChange={handleChange('priority')}>
              {PRIORITY_OPTIONS.map((p) => (
                <MenuItem key={p} value={p}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[p].main }} />
                    <span>{p}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select label="Reason for Delay" fullWidth size="small" value={form.reasonForDelay} onChange={handleChange('reasonForDelay')}>
              {REASON_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Remarks" fullWidth multiline minRows={2} size="small" value={form.remarks} onChange={handleChange('remarks')} />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK } }}>
          {initialTask ? 'Save changes' : 'Add task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================== MAIN COMPONENT ============================== */

export default function TaskTracker() {
  // Data lives ONLY in React state for this session — no localStorage,
  // no backend call. Refreshing the page will reset it, by design.
  const [tasks, setTasks] = useState(sampleTasks);
  const [filters, setFilters] = useState({ date: '', status: 'All', priority: 'All', search: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snack, setSnack] = useState(null);

  // Export menu + custom range dialog
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: '', to: '' });

  const today = dayjs().format('YYYY-MM-DD');

  const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const statusBreakdown = useMemo(() => computeStatusBreakdown(filtered), [filtered]);
  const reasonBreakdown = useMemo(() => computeReasonBreakdown(filtered), [filtered]);
  const priorityBreakdown = useMemo(() => computePriorityBreakdown(filtered), [filtered]);

  const openAdd = () => { setEditingTask(null); setDialogOpen(true); };
  const openEdit = (t) => { setEditingTask(t); setDialogOpen(true); };

  const handleSave = (form) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...form, id: editingTask.id } : t)));
      setSnack({ severity: 'success', message: 'Task updated.' });
    } else {
      setTasks((prev) => [...prev, { ...form, id: uuidv4() }]);
      setSnack({ severity: 'success', message: 'Task added.' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSnack({ severity: 'info', message: 'Task deleted.' });
  };

  /* ---------------------- Export: presets + custom range ---------------------- */

  const doExport = async (data, label) => {
    if (!data.length) {
      setSnack({ severity: 'warning', message: `No tasks found for "${label}".` });
      return;
    }
    const filename = `Task_Tracker_${label.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;
    await exportTasksToExcel(data, filename);
    setSnack({ severity: 'success', message: `Exported ${data.length} task(s) — ${label}.` });
  };

  const tasksInRange = (from, to) => tasks.filter((t) => {
    if (!t.startDate) return false;
    if (from && dayjs(t.startDate).isBefore(dayjs(from), 'day')) return false;
    if (to && dayjs(t.startDate).isAfter(dayjs(to), 'day')) return false;
    return true;
  });

  const handleExportPreset = async (type) => {
    setExportAnchorEl(null);
    const now = dayjs();
    if (type === 'current') {
      await doExport(filtered, 'Current View');
      return;
    }
    if (type === 'today') {
      // ONLY tasks entered/dated today — nothing else.
      const data = tasks.filter((t) => t.date === today);
      await doExport(data, `Today (${dayjs(today).format('DD MMM YYYY')})`);
      return;
    }
    if (type === 'custom') {
      setCustomRange({ from: filters.from || now.startOf('month').format('YYYY-MM-DD'), to: filters.to || now.format('YYYY-MM-DD') });
      setRangeDialogOpen(true);
      return;
    }
    let from, to, label;
    if (type === 'week') { from = now.startOf('week'); to = now.endOf('week'); label = `Weekly (${from.format('DD MMM')} - ${to.format('DD MMM YYYY')})`; }
    else if (type === 'month') { from = now.startOf('month'); to = now.endOf('month'); label = `Monthly (${now.format('MMM YYYY')})`; }
    else if (type === 'year') { from = now.startOf('year'); to = now.endOf('year'); label = `Yearly (${now.format('YYYY')})`; }
    const data = tasksInRange(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
    await doExport(data, label);
  };

  const handleCustomRangeExport = async () => {
    if (!customRange.from || !customRange.to) {
      setSnack({ severity: 'warning', message: 'Please select both From and To dates.' });
      return;
    }
    const data = tasksInRange(customRange.from, customRange.to);
    setRangeDialogOpen(false);
    await doExport(data, `${dayjs(customRange.from).format('DD MMM YYYY')} to ${dayjs(customRange.to).format('DD MMM YYYY')}`);
  };

  const kpiCards = [
    { label: 'Total Tasks', value: kpis.total, color: '#1B2A4A' },
    { label: 'Not Started', value: kpis.counts['Not Started'] || 0, color: STATUS_COLORS['Not Started'].main },
    { label: 'In Progress', value: kpis.counts['In Progress'] || 0, color: STATUS_COLORS['In Progress'].main },
    { label: 'In Review', value: kpis.counts['In Review'] || 0, color: STATUS_COLORS['In Review'].main },
    { label: 'Testing', value: kpis.counts['Testing'] || 0, color: STATUS_COLORS['Testing'].main },
    { label: 'Completed', value: kpis.counts['Completed'] || 0, color: STATUS_COLORS['Completed'].main },
    { label: 'Delayed', value: kpis.counts['Delayed'] || 0, color: STATUS_COLORS['Delayed'].main },
    { label: 'Completion %', value: `${kpis.completionPct}%`, color: PRIMARY },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F3F6F7', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 }, mb: 3, borderRadius: 4, border: '1px solid #E9EDEF',
            background: `linear-gradient(120deg, ${PRIMARY} 0%, #12A39A 55%, #1AC2A4 100%)`,
            color: '#fff', boxShadow: '0 10px 24px rgba(14,124,123,0.18)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Task Tracker</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Team work status &amp; analytics</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <TodayRoundedIcon sx={{ fontSize: 14 }} /> Today: {dayjs(today).format('DD MMM YYYY')}
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} flexWrap="wrap"
              sx={{ bgcolor: 'rgba(255,255,255,0.94)', p: 1.25, borderRadius: 3 }}>
              <TextField
                label="Filter by Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filters.date}
                onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
                sx={{ width: 165, bgcolor: '#fff', borderRadius: 1 }}
                helperText="Blank = all dates"
                FormHelperTextProps={{ sx: { fontSize: '0.65rem', ml: 0, mt: 0.25 } }}
              />
              <TextField select label="Status" size="small" value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} sx={{ width: 140, bgcolor: '#fff', borderRadius: 1 }}>
                <MenuItem value="All">All statuses</MenuItem>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <TextField select label="Priority" size="small" value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} sx={{ width: 130, bgcolor: '#fff', borderRadius: 1 }}>
                <MenuItem value="All">All priorities</MenuItem>
                {PRIORITY_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField label="Search" size="small" placeholder="Name, project…" value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} sx={{ width: 160, bgcolor: '#fff', borderRadius: 1 }} />
              <Tooltip title="Reset filters">
                <IconButton onClick={() => setFilters({ date: '', status: 'All', priority: 'All', search: '' })} sx={{ border: '1px solid #E4E9EC', bgcolor: '#fff' }}>
                  <RefreshRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                startIcon={<FileDownloadRoundedIcon />}
                endIcon={<ArrowDropDownRoundedIcon />}
                onClick={(e) => setExportAnchorEl(e.currentTarget)}
                sx={{ borderColor: PRIMARY, color: PRIMARY, whiteSpace: 'nowrap' }}
              >
                Export Excel
              </Button>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}
                sx={{ bgcolor: PRIMARY, whiteSpace: 'nowrap', '&:hover': { bgcolor: PRIMARY_DARK } }}>
                Add Task
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Export menu */}
        <Menu anchorEl={exportAnchorEl} open={!!exportAnchorEl} onClose={() => setExportAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={() => handleExportPreset('today')}>
            <ListItemIcon><TodayRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="Today Only" secondary={dayjs(today).format('DD MMM YYYY')} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleExportPreset('week')}>
            <ListItemIcon><CalendarViewWeekRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="This Week" secondary="Monday – Sunday" />
          </MenuItem>
          <MenuItem onClick={() => handleExportPreset('month')}>
            <ListItemIcon><CalendarMonthRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="This Month" />
          </MenuItem>
          <MenuItem onClick={() => handleExportPreset('year')}>
            <ListItemIcon><EventRepeatRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="This Year" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleExportPreset('custom')}>
            <ListItemIcon><DateRangeRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="Custom Range…" secondary="Pick any From – To dates" />
          </MenuItem>
          <MenuItem onClick={() => handleExportPreset('current')}>
            <ListItemIcon><FileDownloadRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
            <ListItemText primary="Current Filtered View" />
          </MenuItem>
        </Menu>

        {/* Custom range dialog */}
        <Dialog open={rangeDialogOpen} onClose={() => setRangeDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>Custom Export Range</DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={2}>
              <TextField label="From" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }}
                value={customRange.from} onChange={(e) => setCustomRange((r) => ({ ...r, from: e.target.value }))} />
              <TextField label="To" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }}
                value={customRange.to} onChange={(e) => setCustomRange((r) => ({ ...r, to: e.target.value }))} />
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setRangeDialogOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleCustomRangeExport} variant="contained" sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK } }}>
              Download
            </Button>
          </DialogActions>
        </Dialog>

        <Stack spacing={3}>
          {/* KPI cards */}
          <Grid container spacing={2}>
            {kpiCards.map((c) => (
              <Grid item xs={12} sm={6} md={3} lg={1.5} key={c.label} sx={{ flexGrow: 1 }}>
                <KpiCard {...c} />
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
            <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Task status breakdown</Typography>
              {statusBreakdown.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No tasks match the current filters.</Typography></Box>
              ) : (
                <Box sx={{ position: 'relative', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2} strokeWidth={0}>
                        {statusBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name]?.main || '#94A3B8'} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value, name) => [`${value} task${value === 1 ? '' : 's'}`, name]} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <Stack sx={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.total}</Typography>
                    <Typography variant="caption" color="text.secondary">total</Typography>
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Delay reasons this period</Typography>
              {reasonBreakdown.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No delays recorded. 🎉</Typography></Box>
              ) : (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reasonBreakdown} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9EC" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip formatter={(value) => [`${value} task${value === 1 ? '' : 's'}`, 'Count']} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {reasonBreakdown.map((entry, i) => (
                          <Cell key={entry.name} fill={REASON_PALETTE[i % REASON_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, flex: 0.8, minWidth: 220, borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Priority mix</Typography>
              <Stack spacing={2.5}>
                {priorityBreakdown.map(({ name, value }) => {
                  const pct = kpis.total ? Math.round((value / kpis.total) * 100) : 0;
                  return (
                    <Box key={name}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[name].main }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">{value}</Typography>
                      </Stack>
                      <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#EEF1F2', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: PRIORITY_COLORS[name].main, borderRadius: 4, transition: 'width .3s ease' }} />
                      </Box>
                    </Box>
                  );
                })}
                {kpis.total === 0 && <Typography variant="body2" color="text.secondary">No tasks match the current filters.</Typography>}
              </Stack>
            </Paper>
          </Stack>

          {/* Table */}
          <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid #E9EDEF', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>All tasks ({filtered.length})</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {['SR', 'Name', 'Assigned By', 'Project', 'Start', 'Completed',
                      'Status', 'Priority', 'Time Taken', 'Reason for Delay', 'Remarks', 'Actions'].map((h) => (
                      <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
                        sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                          <Typography color="text.secondary">No tasks yet — click &ldquo;Add Task&rdquo; to create the first one.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((t, idx) => {
                    const statusColors = STATUS_COLORS[t.status] || { main: '#94A3B8', bg: '#F1F5F9' };
                    const priorityColors = PRIORITY_COLORS[t.priority] || { main: '#94A3B8', bg: '#F1F5F9' };
                    return (
                      <TableRow key={t.id} hover sx={{ bgcolor: idx % 2 ? '#FAFBFC' : 'transparent' }}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                        <TableCell>{t.assignedBy || '—'}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>{t.projectName}</TableCell>
                        <TableCell>{fmt(t.startDate)}</TableCell>
                        <TableCell>{fmt(t.completedDate)}</TableCell>
                        <TableCell>
                          <Chip label={t.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.main, fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={t.priority} size="small" sx={{ bgcolor: priorityColors.bg, color: priorityColors.main, fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{getTotalTime(t)}</TableCell>
                        <TableCell>
                          {t.reasonForDelay && t.reasonForDelay !== 'None' ? <Chip label={t.reasonForDelay} size="small" variant="outlined" /> : '—'}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" color="text.secondary" noWrap title={t.remarks}>{t.remarks || '—'}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton size="small" onClick={() => openEdit(t)}><EditRoundedIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDelete(t.id)}><DeleteRoundedIcon fontSize="small" color="error" /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Container>

      <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} initialTask={editingTask} />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {snack && <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </Box>
  );
}